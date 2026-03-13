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
});
