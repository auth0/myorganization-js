import { MyOrganizationClient } from "../../../src/wrappers/MyOrganizationClient.js";
import { MyOrganizationClient as FernClient } from "../../../src/Client.js";
import { Auth0ClientTelemetry } from "../../../src/utils/auth0ClientTelemetry.js";
import { ClientCredentialsTokenProvider } from "../../../src/auth/ClientCredentialsTokenProvider.js";
import type { MockedClass } from "vitest";

// Mock the dependencies first
vi.mock("../../../src/Client.js");
vi.mock("../../../src/utils/auth0ClientTelemetry.js");

// Mock @auth0/auth0-auth-js with factory function
const mockGetTokenByClientCredentials = vi.fn();
vi.mock("@auth0/auth0-auth-js", () => ({
    AuthClient: vi.fn().mockImplementation(() => ({
        getTokenByClientCredentials: mockGetTokenByClientCredentials,
    })),
}));

// Import the mocked AuthClient after mocking
import { AuthClient } from "@auth0/auth0-auth-js";

const MockAuth0MyOrganizationClient = FernClient as MockedClass<typeof FernClient>;
const MockAuth0ClientTelemetry = Auth0ClientTelemetry as MockedClass<typeof Auth0ClientTelemetry>;
const MockAuthClient = AuthClient as MockedClass<typeof AuthClient>;

describe("MyOrganizationClient Unit Tests", () => {
    const mockTelemetryInstance = {
        getHeaders: vi.fn().mockReturnValue({ "Auth0-Client": "base64-encoded-telemetry" }),
        getAuth0ClientHeader: vi.fn().mockReturnValue("base64-encoded-telemetry"),
    } as any;

    // Helper function to extract the wrapped token function from the mock calls
    const getWrappedTokenFunction = (): any => {
        const callArgs = MockAuth0MyOrganizationClient.mock.calls[0][0];
        return callArgs.token;
    };

    const getWrappedFetcherFunction = (): any => {
        const callArgs = MockAuth0MyOrganizationClient.mock.calls[0][0];
        return callArgs.fetcher;
    };

    beforeEach(() => {
        vi.clearAllMocks();
        MockAuth0ClientTelemetry.mockImplementation(() => mockTelemetryInstance);
        mockGetTokenByClientCredentials.mockResolvedValue({
            accessToken: "mock-access-token",
            expires_in: 3600,
            token_type: "Bearer",
        });
    });

    describe("Token-based authentication", () => {
        it("should initialize with domain and token configuration", () => {
            const options = {
                token: "test-token",
                domain: "test-domain.auth0.com",
                clientInfo: { name: "my-app", version: "1.0.0" },
            };

            const client = new MyOrganizationClient(options);

            expect(client).toBeInstanceOf(MyOrganizationClient);
            expect(MockAuth0MyOrganizationClient).toHaveBeenCalledWith(
                expect.objectContaining({
                    baseUrl: "https://test-domain.auth0.com/my-org",
                    headers: { "Auth0-Client": "base64-encoded-telemetry" },
                    token: "test-token",
                }),
            );
        });

        it("should use custom baseUrl when provided", () => {
            const options = {
                token: "test-token",
                domain: "test-domain.auth0.com",
                baseUrl: "https://custom.domain.com/custom-path",
                clientInfo: { name: "my-app", version: "1.0.0" },
            };

            new MyOrganizationClient(options);

            expect(MockAuth0MyOrganizationClient).toHaveBeenCalledWith(
                expect.objectContaining({
                    baseUrl: "https://custom.domain.com/custom-path",
                }),
            );
        });

        it("should handle simple function token supplier", async () => {
            const tokenFunction = vi.fn().mockResolvedValue("dynamic-token");
            const options = {
                token: tokenFunction,
                domain: "test-domain.auth0.com",
            };

            new MyOrganizationClient(options);

            // Primary assertion: verify MyOrganizationClient was called with proper config
            expect(MockAuth0MyOrganizationClient).toHaveBeenCalledWith(
                expect.objectContaining({
                    baseUrl: "https://test-domain.auth0.com/my-org",
                    token: expect.any(Function),
                }),
            );

            // Test behavior: verify the wrapped function delegates to the original
            const wrappedToken = getWrappedTokenFunction();
            const mockEndpointMetadata = { security: [] };

            const result = await wrappedToken({ endpointMetadata: mockEndpointMetadata });

            expect(tokenFunction).toHaveBeenCalledWith(); // Simple function called with no args
            expect(result).toBe("dynamic-token");
        });

        it("should handle scope-aware function token supplier", async () => {
            // Use a real function instead of vi.fn() to ensure proper .length detection
            const scopeAwareFunction = vi.fn(function ({ scope }) {
                return `token-for-${scope}`;
            });
            const options = {
                token: scopeAwareFunction,
                domain: "test-domain.auth0.com",
            };

            new MyOrganizationClient(options);

            // Primary assertion: verify MyOrganizationClient was called with proper config
            expect(MockAuth0MyOrganizationClient).toHaveBeenCalledWith(
                expect.objectContaining({
                    baseUrl: "https://test-domain.auth0.com/my-org",
                    token: expect.any(Function),
                }),
            );

            // Test behavior: verify scope extraction and delegation
            const wrappedToken = getWrappedTokenFunction();
            const mockEndpointMetadata = {
                security: [{ oauth2: ["read:organizations", "write:members"] }],
            };

            const result = await wrappedToken({ endpointMetadata: mockEndpointMetadata });

            expect(scopeAwareFunction).toHaveBeenCalledWith({
                scope: "read:organizations write:members",
            });
            expect(result).toBe("token-for-read:organizations write:members");
        });
    });

    describe("Custom Fetcher", () => {
        it("should initialize with custom fetcher", () => {
            const customFetcher = vi.fn().mockResolvedValue(new Response());
            const options = {
                token: "test-token",
                domain: "test-domain.auth0.com",
                fetcher: customFetcher,
            };

            new MyOrganizationClient(options);

            expect(MockAuth0MyOrganizationClient).toHaveBeenCalledWith(
                expect.objectContaining({
                    baseUrl: "https://test-domain.auth0.com/my-org",
                    fetcher: expect.any(Function),
                }),
            );
        });

        it("should pass authParams with scopes to custom fetcher", async () => {
            const customFetcher = vi.fn().mockResolvedValue(
                new Response(JSON.stringify({ success: true }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }),
            );

            const options = {
                token: "test-token",
                domain: "test-domain.auth0.com",
                fetcher: customFetcher,
            };

            new MyOrganizationClient(options);

            // Get the wrapped fetcher function
            const wrappedFetcher = getWrappedFetcherFunction();
            expect(wrappedFetcher).toBeDefined();

            // Call the wrapped fetcher with mock args
            const mockArgs = {
                url: "https://test-domain.auth0.com/my-org/test",
                method: "GET",
                headers: { "Custom-Header": "value" },
                endpointMetadata: {
                    security: [{ oauth2: ["read:organizations", "write:members"] }],
                },
            };

            await wrappedFetcher!(mockArgs);

            // Verify custom fetcher was called with correct params
            expect(customFetcher).toHaveBeenCalledWith(
                "https://test-domain.auth0.com/my-org/test",
                expect.objectContaining({
                    method: "GET",
                    headers: { "Custom-Header": "value" },
                }),
                expect.objectContaining({
                    scope: ["read:organizations", "write:members"],
                }),
            );
        });

        it("should not pass authParams when no scopes are required", async () => {
            const customFetcher = vi.fn().mockResolvedValue(
                new Response(JSON.stringify({ success: true }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }),
            );

            const options = {
                token: "test-token",
                domain: "test-domain.auth0.com",
                fetcher: customFetcher,
            };

            new MyOrganizationClient(options);

            const wrappedFetcher = getWrappedFetcherFunction();
            expect(wrappedFetcher).toBeDefined();

            const mockArgs = {
                url: "https://test-domain.auth0.com/my-org/test",
                method: "GET",
                endpointMetadata: {
                    security: [],
                },
            };

            await wrappedFetcher!(mockArgs);

            // Verify custom fetcher was called without authParams
            expect(customFetcher).toHaveBeenCalledWith(
                "https://test-domain.auth0.com/my-org/test",
                expect.objectContaining({
                    method: "GET",
                }),
                undefined,
            );
        });

        it("should convert Response to APIResponse correctly for successful responses", async () => {
            const responseData = { id: "123", name: "Test Org" };
            const customFetcher = vi.fn().mockResolvedValue(
                new Response(JSON.stringify(responseData), {
                    status: 200,
                    statusText: "OK",
                    headers: new Headers({ "Content-Type": "application/json" }),
                }),
            );

            const options = {
                token: "test-token",
                domain: "test-domain.auth0.com",
                fetcher: customFetcher,
            };

            new MyOrganizationClient(options);

            const wrappedFetcher = getWrappedFetcherFunction();
            expect(wrappedFetcher).toBeDefined();

            const mockArgs = {
                url: "https://test-domain.auth0.com/my-org/test",
                method: "GET",
                endpointMetadata: {},
            };

            const result = await wrappedFetcher!(mockArgs);

            expect(result).toEqual(
                expect.objectContaining({
                    ok: true,
                    body: responseData,
                    rawResponse: expect.objectContaining({
                        status: 200,
                        statusText: "OK",
                    }),
                }),
            );
        });

        it("should convert Response to APIResponse correctly for error responses", async () => {
            const errorData = { error: "Not Found", message: "Resource not found" };
            const customFetcher = vi.fn().mockResolvedValue(
                new Response(JSON.stringify(errorData), {
                    status: 404,
                    statusText: "Not Found",
                    headers: new Headers({ "Content-Type": "application/json" }),
                }),
            );

            const options = {
                token: "test-token",
                domain: "test-domain.auth0.com",
                fetcher: customFetcher,
            };

            new MyOrganizationClient(options);

            const wrappedFetcher = getWrappedFetcherFunction();
            expect(wrappedFetcher).toBeDefined();

            const mockArgs = {
                url: "https://test-domain.auth0.com/my-org/test",
                method: "GET",
                endpointMetadata: {},
            };

            const result = await wrappedFetcher!(mockArgs);

            expect(result).toEqual(
                expect.objectContaining({
                    ok: false,
                    error: expect.objectContaining({
                        reason: "status-code",
                        statusCode: 404,
                        body: errorData,
                    }),
                    rawResponse: expect.objectContaining({
                        status: 404,
                        statusText: "Not Found",
                    }),
                }),
            );
        });

        it("should handle POST requests with body correctly", async () => {
            const customFetcher = vi.fn().mockResolvedValue(
                new Response(JSON.stringify({ success: true }), {
                    status: 201,
                    headers: { "Content-Type": "application/json" },
                }),
            );

            const options = {
                token: "test-token",
                domain: "test-domain.auth0.com",
                fetcher: customFetcher,
            };

            new MyOrganizationClient(options);

            const wrappedFetcher = getWrappedFetcherFunction();
            expect(wrappedFetcher).toBeDefined();

            const requestBody = { name: "New Organization" };
            const mockArgs = {
                url: "https://test-domain.auth0.com/my-org/organizations",
                method: "POST",
                body: requestBody,
                headers: { "Content-Type": "application/json" },
                endpointMetadata: {},
            };

            await wrappedFetcher!(mockArgs);

            expect(customFetcher).toHaveBeenCalledWith(
                "https://test-domain.auth0.com/my-org/organizations",
                expect.objectContaining({
                    method: "POST",
                    body: JSON.stringify(requestBody),
                    headers: { "Content-Type": "application/json" },
                }),
                undefined,
            );
        });

        it("should handle custom fetch compatible with Auth0 createFetcher", async () => {
            // Simulate Auth0's createFetcher().fetch signature
            const auth0Fetcher = vi.fn().mockResolvedValue(
                new Response(JSON.stringify({ data: "test" }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }),
            );

            const options = {
                token: "test-token",
                domain: "test-domain.auth0.com",
                fetcher: auth0Fetcher,
            };

            new MyOrganizationClient(options);

            const wrappedFetcher = getWrappedFetcherFunction();
            expect(wrappedFetcher).toBeDefined();

            const mockArgs = {
                url: "https://test-domain.auth0.com/my-org/test",
                method: "GET",
                endpointMetadata: {
                    security: [{ oauth2: ["read:data"] }],
                },
            };

            const result = await wrappedFetcher!(mockArgs);

            // Auth0 fetcher receives authParams but may ignore it if it handles auth internally
            expect(auth0Fetcher).toHaveBeenCalledWith(
                "https://test-domain.auth0.com/my-org/test",
                expect.any(Object),
                expect.objectContaining({
                    scope: ["read:data"],
                }),
            );

            expect(result.ok).toBe(true);
            if (result.ok) {
                expect(result.body).toEqual({ data: "test" });
            }
        });

        it("should allow creating client with only fetcher (no token or tokenProvider required)", () => {
            const customFetcher = vi.fn().mockResolvedValue(
                new Response(JSON.stringify({ success: true }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }),
            );

            // This should NOT require token or tokenProvider when fetcher is provided
            const options = {
                domain: "test-domain.auth0.com",
                fetcher: customFetcher,
            };

            const client = new MyOrganizationClient(options);

            expect(client).toBeInstanceOf(MyOrganizationClient);
            expect(MockAuth0MyOrganizationClient).toHaveBeenCalledWith(
                expect.objectContaining({
                    baseUrl: "https://test-domain.auth0.com/my-org",
                    fetcher: expect.any(Function),
                }),
            );

            // Verify that token was not passed to the base client
            const callArgs = MockAuth0MyOrganizationClient.mock.calls[0][0];
            expect(callArgs.token).toBe("");
        });

        it("should allow using fetcher with token (fetcher can use token or handle auth independently)", () => {
            const customFetcher = vi.fn().mockResolvedValue(
                new Response(JSON.stringify({ success: true }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }),
            );

            const options = {
                domain: "test-domain.auth0.com",
                token: "test-token",
                fetcher: customFetcher,
            };

            const client = new MyOrganizationClient(options);

            expect(client).toBeInstanceOf(MyOrganizationClient);
            expect(MockAuth0MyOrganizationClient).toHaveBeenCalledWith(
                expect.objectContaining({
                    baseUrl: "https://test-domain.auth0.com/my-org",
                    token: "test-token",
                    fetcher: expect.any(Function),
                }),
            );
        });

        it("should allow using fetcher with tokenProvider", () => {
            const customFetcher = vi.fn().mockResolvedValue(
                new Response(JSON.stringify({ success: true }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }),
            );

            const tokenProvider = new ClientCredentialsTokenProvider({
                domain: "test-domain.auth0.com",
                clientId: "test-client-id",
                clientSecret: "test-client-secret",
                organization: "org_123456789",
            });

            const options = {
                domain: "test-domain.auth0.com",
                tokenProvider: tokenProvider,
                fetcher: customFetcher,
            };

            const client = new MyOrganizationClient(options);

            expect(client).toBeInstanceOf(MyOrganizationClient);
            expect(MockAuth0MyOrganizationClient).toHaveBeenCalledWith(
                expect.objectContaining({
                    baseUrl: "https://test-domain.auth0.com/my-org",
                    token: expect.any(Function),
                    fetcher: expect.any(Function),
                }),
            );
        });
    });

    describe("TokenProvider-based authentication", () => {
        it("should initialize with tokenProvider", async () => {
            const tokenProvider = new ClientCredentialsTokenProvider({
                domain: "test-domain.auth0.com",
                clientId: "test-client-id",
                clientSecret: "test-client-secret",
                organization: "org_123456789",
            });

            const options = {
                domain: "test-domain.auth0.com",
                tokenProvider: tokenProvider,
            };

            new MyOrganizationClient(options);

            // Verify that MyOrganizationClient was called with a token function
            expect(MockAuth0MyOrganizationClient).toHaveBeenCalledWith(
                expect.objectContaining({
                    baseUrl: "https://test-domain.auth0.com/my-org",
                    token: expect.any(Function),
                }),
            );

            // Verify AuthClient was configured correctly
            expect(MockAuthClient).toHaveBeenCalledWith({
                domain: "test-domain.auth0.com",
                clientId: "test-client-id",
                clientSecret: "test-client-secret",
                clientAssertionSigningKey: undefined, // No JWT assertion for client secret flow
                clientAssertionSigningAlg: undefined,
                useMtls: undefined,
                customFetch: undefined,
            });
        });

        it("should work with private key tokenProvider", async () => {
            const tokenProvider = new ClientCredentialsTokenProvider({
                domain: "test-domain.auth0.com",
                clientId: "test-client-id",
                privateKey:
                    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKB...",
                organization: "org_123456789",
            });

            const options = {
                domain: "test-domain.auth0.com",
                tokenProvider: tokenProvider,
            };

            new MyOrganizationClient(options);

            // Verify AuthClient was configured
            expect(MockAuthClient).toHaveBeenCalledWith({
                domain: "test-domain.auth0.com",
                clientId: "test-client-id",
                clientSecret: undefined, // No client secret for private key auth
                clientAssertionSigningKey:
                    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKB...",
                clientAssertionSigningAlg: undefined, // Uses default (RS256)
                useMtls: undefined,
                customFetch: undefined,
            });
        });

        it("should respect custom audience in tokenProvider", async () => {
            const tokenProvider = new ClientCredentialsTokenProvider({
                domain: "test-domain.auth0.com",
                clientId: "test-client-id",
                clientSecret: "test-client-secret",
                organization: "org_123456789",
                audience: "https://custom-api.example.com/",
            });

            const options = {
                domain: "test-domain.auth0.com",
                tokenProvider: tokenProvider,
            };

            new MyOrganizationClient(options);

            // Primary assertion: verify MyOrganizationClient was called with proper config
            expect(MockAuth0MyOrganizationClient).toHaveBeenCalledWith(
                expect.objectContaining({
                    baseUrl: "https://test-domain.auth0.com/my-org",
                    token: expect.any(Function),
                }),
            );

            // Test behavior: verify custom audience is used
            const tokenSupplier = getWrappedTokenFunction();
            await tokenSupplier();

            expect(mockGetTokenByClientCredentials).toHaveBeenCalledWith({
                audience: "https://custom-api.example.com/",
                organization: "org_123456789",
            });
        });
    });

    describe("URL construction", () => {
        it("should strip https:// prefix from domain", () => {
            const options = {
                token: "test-token",
                domain: "https://test-domain.auth0.com",
            };

            new MyOrganizationClient(options);

            expect(MockAuth0MyOrganizationClient).toHaveBeenCalledWith(
                expect.objectContaining({
                    baseUrl: "https://test-domain.auth0.com/my-org",
                }),
            );
        });

        it("should strip trailing slash from domain", () => {
            const options = {
                token: "test-token",
                domain: "test-domain.auth0.com/",
            };

            new MyOrganizationClient(options);

            expect(MockAuth0MyOrganizationClient).toHaveBeenCalledWith(
                expect.objectContaining({
                    baseUrl: "https://test-domain.auth0.com/my-org",
                }),
            );
        });

        it("should construct audience URL correctly for tokenProvider", () => {
            const tokenProvider = new ClientCredentialsTokenProvider({
                domain: "custom-domain.auth0.com",
                clientId: "test-client-id",
                clientSecret: "test-client-secret",
                organization: "org_123456789",
            });

            const options = {
                domain: "custom-domain.auth0.com",
                tokenProvider: tokenProvider,
            };

            new MyOrganizationClient(options);

            // Primary assertion: verify MyOrganizationClient was called with proper config
            expect(MockAuth0MyOrganizationClient).toHaveBeenCalledWith(
                expect.objectContaining({
                    baseUrl: "https://custom-domain.auth0.com/my-org",
                    token: expect.any(Function),
                }),
            );

            // Test behavior: verify audience URL construction
            const tokenSupplier = getWrappedTokenFunction();
            tokenSupplier();

            expect(mockGetTokenByClientCredentials).toHaveBeenCalledWith(
                expect.objectContaining({
                    audience: "https://custom-domain.auth0.com/my-org/",
                }),
            );
        });
    });

    describe("Headers and telemetry", () => {
        it("should include telemetry headers by default", () => {
            const options = {
                token: "test-token",
                domain: "test-domain.auth0.com",
                clientInfo: { name: "my-app", version: "1.0.0" },
            };

            new MyOrganizationClient(options);

            expect(MockAuth0ClientTelemetry).toHaveBeenCalledWith({
                clientInfo: { name: "my-app", version: "1.0.0" },
            });
            expect(MockAuth0MyOrganizationClient).toHaveBeenCalledWith(
                expect.objectContaining({
                    headers: expect.objectContaining({
                        "Auth0-Client": "base64-encoded-telemetry",
                    }),
                }),
            );
        });

        it("should disable telemetry when configured", () => {
            const options = {
                token: "test-token",
                domain: "test-domain.auth0.com",
                telemetry: false,
            };

            new MyOrganizationClient(options);

            expect(MockAuth0MyOrganizationClient).toHaveBeenCalledWith(
                expect.objectContaining({
                    headers: expect.not.objectContaining({
                        "Auth0-Client": expect.anything(),
                    }),
                }),
            );
        });

        it("should merge custom headers with telemetry", () => {
            const options = {
                token: "test-token",
                domain: "test-domain.auth0.com",
                headers: {
                    "Custom-Header": "custom-value",
                    "Another-Header": "another-value",
                },
            };

            new MyOrganizationClient(options);

            expect(MockAuth0MyOrganizationClient).toHaveBeenCalledWith(
                expect.objectContaining({
                    headers: expect.objectContaining({
                        "Custom-Header": "custom-value",
                        "Another-Header": "another-value",
                        "Auth0-Client": "base64-encoded-telemetry",
                    }),
                }),
            );
        });
    });

    describe("Error handling", () => {
        it("should handle token retrieval errors from tokenProvider", async () => {
            const tokenError = new Error("Token retrieval failed");
            mockGetTokenByClientCredentials.mockRejectedValue(tokenError);

            const tokenProvider = new ClientCredentialsTokenProvider({
                domain: "test-domain.auth0.com",
                clientId: "test-client-id",
                clientSecret: "test-client-secret",
                organization: "org_123456789",
            });

            const options = {
                domain: "test-domain.auth0.com",
                tokenProvider: tokenProvider,
            };

            new MyOrganizationClient(options);

            // Primary assertion: verify MyOrganizationClient was called with proper config
            expect(MockAuth0MyOrganizationClient).toHaveBeenCalledWith(
                expect.objectContaining({
                    baseUrl: "https://test-domain.auth0.com/my-org",
                    token: expect.any(Function),
                }),
            );

            // Test behavior: verify error propagation
            const tokenSupplier = getWrappedTokenFunction();
            await expect(tokenSupplier()).rejects.toThrow("Token retrieval failed");
        });
    });
});
