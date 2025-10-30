import { MyOrgClient } from "../../../src/wrappers/MyOrgClient.js";
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

        const myOrgClient = new MyOrgClient({
            fetcher: fetcher,
            domain: "example.com",
        });

        const result = await myOrgClient.organizationDetails.get();

        expect(result.id).toBe("org_id");
        expect(result.name).toBe("my org");
    });
});
