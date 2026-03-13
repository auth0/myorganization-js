import { MyOrganizationClient } from "../../../src/wrappers/MyOrganizationClient.js";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { Auth0FetcherSupplier } from "../../../src/wrappers/index.js";

const server = setupServer();

describe("Auth0Fetcher", () => {
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    const mockDpopProvider = {
        getNonce: vi.fn().mockResolvedValue(undefined),
        setNonce: vi.fn().mockResolvedValue(undefined),
        getPrivateKeyPair: vi
            .fn()
            .mockReturnValue(
                crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, false, ["sign", "verify"]),
            ),
    };

    beforeEach(() => {
        mockDpopProvider.getNonce.mockClear();
        mockDpopProvider.setNonce.mockClear();
        mockDpopProvider.getPrivateKeyPair.mockClear();
    });

    it("should allow for a custom fetcher", async () => {
        server.use(
            http.get("https://example.com/my-org/details", (req) => {
                return HttpResponse.json({ id: "org_id", name: "my org" });
            }),
        );

        const fetcher: Auth0FetcherSupplier = vi
            .fn()
            .mockImplementation(async (url, init, authParams) => fetch(url, init));

        const myOrganizationClient = new MyOrganizationClient({
            fetcher: fetcher,
            domain: "example.com",
        });

        const result = await myOrganizationClient.organizationDetails.get();

        expect(result.id).toBe("org_id");
        expect(result.name).toBe("my org");
    });

    it("should pass headers as a plain object so users can spread them to add Authorization", async () => {
        let receivedInitHeaders: unknown = undefined;
        const capturedRequestHeaders: Record<string, string> = {};

        server.use(
            http.get("https://example.com/my-org/details", ({ request }) => {
                request.headers.forEach((value, key) => {
                    capturedRequestHeaders[key] = value;
                });
                return HttpResponse.json({ id: "org_id", name: "my org" });
            }),
        );

        // This is the pattern from our docs: spread init.headers and add Authorization.
        // Previously broken because init.headers was a Headers instance (spreading it
        // produced an empty object, losing Content-Type, Accept, etc.).
        const fetcher: Auth0FetcherSupplier = async (url, init, authParams) => {
            receivedInitHeaders = init?.headers;
            const headers = {
                ...init?.headers,
                Authorization: "Bearer my-custom-token",
            };
            return fetch(url, { ...init, headers });
        };

        const myOrganizationClient = new MyOrganizationClient({
            fetcher,
            domain: "example.com",
        });

        const result = await myOrganizationClient.organizationDetails.get();

        expect(result.id).toBe("org_id");

        // Headers must be a plain object, NOT a Headers instance
        expect(receivedInitHeaders).not.toBeInstanceOf(Headers);
        expect(typeof receivedInitHeaders).toBe("object");

        // The SDK-set headers must be present in the plain object
        const headersRecord = receivedInitHeaders as Record<string, string>;
        expect(headersRecord["accept"]).toBeDefined();
        expect(headersRecord["auth0-client"]).toBeDefined();

        // The placeholder "authorization: Bearer " from the empty token must NOT be present
        expect(headersRecord["authorization"]).toBeUndefined();

        // The user's Authorization header must reach the server
        expect(capturedRequestHeaders["authorization"]).toBe("Bearer my-custom-token");
    });

    it("should preserve a legitimate Authorization header passed via options.headers in fetcher-only mode", async () => {
        let receivedInitHeaders: unknown = undefined;
        const capturedRequestHeaders: Record<string, string> = {};

        server.use(
            http.get("https://example.com/my-org/details", ({ request }) => {
                request.headers.forEach((value, key) => {
                    capturedRequestHeaders[key] = value;
                });
                return HttpResponse.json({ id: "org_id", name: "my org" });
            }),
        );

        // In fetcher-only mode, a user may pass Authorization via options.headers.
        // The strip logic should only remove the placeholder "Bearer " (empty token),
        // not this legitimate header.
        const fetcher: Auth0FetcherSupplier = async (url, init) => {
            receivedInitHeaders = init?.headers;
            return fetch(url, init);
        };

        const myOrganizationClient = new MyOrganizationClient({
            fetcher,
            domain: "example.com",
            headers: { Authorization: "Bearer legitimate-token" },
        });

        const result = await myOrganizationClient.organizationDetails.get();

        expect(result.id).toBe("org_id");

        const headersRecord = receivedInitHeaders as Record<string, string>;

        // The legitimate Authorization from options.headers must be preserved
        expect(headersRecord["authorization"]).toBe("Bearer legitimate-token");

        // The server must receive the legitimate token
        expect(capturedRequestHeaders["authorization"]).toBe("Bearer legitimate-token");
    });

    it("should preserve SDK Authorization header in token + fetcher mode", async () => {
        let receivedInitHeaders: unknown = undefined;
        const capturedRequestHeaders: Record<string, string> = {};

        server.use(
            http.get("https://example.com/my-org/details", ({ request }) => {
                request.headers.forEach((value, key) => {
                    capturedRequestHeaders[key] = value;
                });
                return HttpResponse.json({ id: "org_id", name: "my org" });
            }),
        );

        // When both token and fetcher are provided, the SDK handles auth
        // and the fetcher is for other customization (logging, custom headers, etc.).
        const fetcher: Auth0FetcherSupplier = async (url, init) => {
            receivedInitHeaders = init?.headers;
            return fetch(url, init);
        };

        const myOrganizationClient = new MyOrganizationClient({
            token: "my-sdk-token",
            fetcher,
            domain: "example.com",
        });

        const result = await myOrganizationClient.organizationDetails.get();

        expect(result.id).toBe("org_id");

        // Headers must be a plain object
        expect(receivedInitHeaders).not.toBeInstanceOf(Headers);
        expect(typeof receivedInitHeaders).toBe("object");

        const headersRecord = receivedInitHeaders as Record<string, string>;

        // SDK-set Authorization header from token must be present
        expect(headersRecord["authorization"]).toBe("Bearer my-sdk-token");

        // Other SDK headers must also survive
        expect(headersRecord["accept"]).toBeDefined();
        expect(headersRecord["auth0-client"]).toBeDefined();

        // The server must receive the SDK token
        expect(capturedRequestHeaders["authorization"]).toBe("Bearer my-sdk-token");
    });

    it("should allow fetcher to add custom headers alongside SDK headers in token + fetcher mode", async () => {
        const capturedRequestHeaders: Record<string, string> = {};

        server.use(
            http.get("https://example.com/my-org/details", ({ request }) => {
                request.headers.forEach((value, key) => {
                    capturedRequestHeaders[key] = value;
                });
                return HttpResponse.json({ id: "org_id", name: "my org" });
            }),
        );

        // User adds custom headers without touching Authorization
        const fetcher: Auth0FetcherSupplier = async (url, init) => {
            const headers = {
                ...init?.headers,
                "X-Custom-Header": "custom-value",
                "X-Request-Id": "req-123",
            };
            return fetch(url, { ...init, headers });
        };

        const myOrganizationClient = new MyOrganizationClient({
            token: "my-sdk-token",
            fetcher,
            domain: "example.com",
        });

        const result = await myOrganizationClient.organizationDetails.get();

        expect(result.id).toBe("org_id");

        // SDK Authorization must be preserved
        expect(capturedRequestHeaders["authorization"]).toBe("Bearer my-sdk-token");

        // Custom headers from the fetcher must be present
        expect(capturedRequestHeaders["x-custom-header"]).toBe("custom-value");
        expect(capturedRequestHeaders["x-request-id"]).toBe("req-123");

        // SDK headers must also be present
        expect(capturedRequestHeaders["auth0-client"]).toBeDefined();
    });
});
