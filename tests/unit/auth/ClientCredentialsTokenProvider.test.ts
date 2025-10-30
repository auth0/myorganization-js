import { ClientCredentialsTokenProvider } from "../../../src/auth/ClientCredentialsTokenProvider.js";
import type { MockedClass } from "vitest";

// Mock @auth0/auth0-auth-js
const mockGetTokenByClientCredentials = vi.fn();

// Create a custom error class for mTLS
class NotSupportedError extends Error {
    code: string;
    constructor(message: string, code: string) {
        super(message);
        this.name = "NotSupportedError";
        this.code = code;
    }
}

vi.mock("@auth0/auth0-auth-js", () => ({
    AuthClient: vi.fn().mockImplementation((options: any) => {
        // Simulate the real behavior: throw error if useMtls is true but no customFetch
        if (options?.useMtls && !options?.customFetch) {
            throw new NotSupportedError(
                "Using mTLS without a custom fetch implementation is not supported",
                "mtls_without_custom_fetch_not_supported",
            );
        }
        return {
            getTokenByClientCredentials: mockGetTokenByClientCredentials,
        };
    }),
}));

import { AuthClient } from "@auth0/auth0-auth-js";
const MockAuthClient = AuthClient as MockedClass<typeof AuthClient>;

describe("ClientCredentialsTokenProvider", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockGetTokenByClientCredentials.mockResolvedValue({
            accessToken: "mock-access-token",
            expires_in: 3600,
            token_type: "Bearer",
        });
    });

    describe("constructor with client secret", () => {
        it("should create instance with client secret", () => {
            const provider = new ClientCredentialsTokenProvider({
                domain: "test-domain.auth0.com",
                clientId: "test-client-id",
                clientSecret: "test-client-secret",
                organization: "org_123456789",
            });

            expect(provider).toBeInstanceOf(ClientCredentialsTokenProvider);
        });

        it("should accept custom audience", () => {
            const provider = new ClientCredentialsTokenProvider({
                domain: "test-domain.auth0.com",
                clientId: "test-client-id",
                clientSecret: "test-client-secret",
                organization: "org_123456789",
                audience: "https://custom-api.example.com/",
            });

            expect(provider).toBeInstanceOf(ClientCredentialsTokenProvider);
        });

        it("should accept mTLS options", () => {
            const mockCustomFetch = vi.fn();
            const provider = new ClientCredentialsTokenProvider({
                domain: "test-domain.auth0.com",
                clientId: "test-client-id",
                clientSecret: "test-client-secret",
                organization: "org_123456789",
                useMtls: true,
                customFetch: mockCustomFetch,
            });

            expect(provider).toBeInstanceOf(ClientCredentialsTokenProvider);

            expect(MockAuthClient).toHaveBeenCalledWith({
                domain: "test-domain.auth0.com",
                clientId: "test-client-id",
                clientSecret: "test-client-secret",
                clientAssertionSigningKey: undefined, // No JWT assertion for client secret flow
                clientAssertionSigningAlg: undefined,
                useMtls: true,
                customFetch: mockCustomFetch,
            });
        });

        it("should throw error when useMtls is true without customFetch", () => {
            expect(() => {
                new ClientCredentialsTokenProvider({
                    domain: "test-domain.auth0.com",
                    clientId: "test-client-id",
                    clientSecret: "test-client-secret",
                    organization: "org_123456789",
                    useMtls: true,
                });
            }).toThrow("Using mTLS without a custom fetch implementation is not supported");
        });
    });

    describe("constructor with private key", () => {
        it("should create instance with private key", () => {
            const provider = new ClientCredentialsTokenProvider({
                domain: "test-domain.auth0.com",
                clientId: "test-client-id",
                privateKey:
                    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKB...",
                organization: "org_123456789",
            });

            expect(provider).toBeInstanceOf(ClientCredentialsTokenProvider);
        });

        it("should create instance with private key and mTLS options", () => {
            const mockCustomFetch = vi.fn();
            const provider = new ClientCredentialsTokenProvider({
                domain: "test-domain.auth0.com",
                clientId: "test-client-id",
                privateKey:
                    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKB...",
                organization: "org_123456789",
                useMtls: true,
                customFetch: mockCustomFetch,
            });

            expect(provider).toBeInstanceOf(ClientCredentialsTokenProvider);

            expect(MockAuthClient).toHaveBeenCalledWith({
                domain: "test-domain.auth0.com",
                clientId: "test-client-id",
                clientSecret: undefined, // No client secret for private key flow
                clientAssertionSigningKey:
                    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKB...",
                clientAssertionSigningAlg: undefined, // Uses default (RS256)
                useMtls: true,
                customFetch: mockCustomFetch,
            });
        });

        it("should create instance with CryptoKey and mTLS", () => {
            const mockCryptoKey = {} as CryptoKey; // Mock CryptoKey object
            const mockCustomFetch = vi.fn();
            const provider = new ClientCredentialsTokenProvider({
                domain: "test-domain.auth0.com",
                clientId: "test-client-id",
                privateKey: mockCryptoKey,
                organization: "org_123456789",
                useMtls: true,
                customFetch: mockCustomFetch,
            });

            expect(provider).toBeInstanceOf(ClientCredentialsTokenProvider);

            expect(MockAuthClient).toHaveBeenCalledWith({
                domain: "test-domain.auth0.com",
                clientId: "test-client-id",
                clientSecret: undefined,
                clientAssertionSigningKey: mockCryptoKey,
                clientAssertionSigningAlg: undefined, // Uses default (RS256)
                useMtls: true,
                customFetch: mockCustomFetch,
            });
        });

        it("should create instance with private key, custom audience, and mTLS", () => {
            const mockCustomFetch = vi.fn();
            const provider = new ClientCredentialsTokenProvider({
                domain: "test-domain.auth0.com",
                clientId: "test-client-id",
                privateKey: "-----BEGIN PRIVATE KEY-----\ntest-key...",
                organization: "org_123456789",
                audience: "https://custom-mtls-api.example.com/",
                useMtls: true,
                customFetch: mockCustomFetch,
            });

            expect(provider).toBeInstanceOf(ClientCredentialsTokenProvider);
        });
    });

    describe("audience handling", () => {
        it("should auto-generate default audience from domain", () => {
            const provider = new ClientCredentialsTokenProvider({
                domain: "test-domain.auth0.com",
                clientId: "test-client-id",
                clientSecret: "test-client-secret",
                organization: "org_123456789",
            });

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

        it("should use default audience in getToken", async () => {
            const provider = new ClientCredentialsTokenProvider({
                domain: "test-domain.auth0.com",
                clientId: "test-client-id",
                clientSecret: "test-client-secret",
                organization: "org_123456789",
            });

            await provider.getToken();

            expect(mockGetTokenByClientCredentials).toHaveBeenCalledWith({
                audience: "https://test-domain.auth0.com/my-org/",
                organization: "org_123456789",
            });
        });

        it("should preserve custom audience", async () => {
            const provider = new ClientCredentialsTokenProvider({
                domain: "test-domain.auth0.com",
                clientId: "test-client-id",
                clientSecret: "test-client-secret",
                organization: "org_123456789",
                audience: "https://custom-api.example.com/",
            });

            await provider.getToken();

            expect(mockGetTokenByClientCredentials).toHaveBeenCalledWith({
                audience: "https://custom-api.example.com/",
                organization: "org_123456789",
            });
        });

        it("should sanitize domain correctly", async () => {
            const provider = new ClientCredentialsTokenProvider({
                domain: "https://test-domain.auth0.com/",
                clientId: "test-client-id",
                clientSecret: "test-client-secret",
                organization: "org_123456789",
            });

            await provider.getToken();

            expect(mockGetTokenByClientCredentials).toHaveBeenCalledWith({
                audience: "https://test-domain.auth0.com/my-org/",
                organization: "org_123456789",
            });
        });
    });

    describe("getToken method", () => {
        it("should return access token from Auth0", async () => {
            const provider = new ClientCredentialsTokenProvider({
                domain: "test-domain.auth0.com",
                clientId: "test-client-id",
                clientSecret: "test-client-secret",
                organization: "org_123456789",
            });

            const token = await provider.getToken();

            expect(token).toBe("mock-access-token");
            expect(mockGetTokenByClientCredentials).toHaveBeenCalledWith({
                audience: "https://test-domain.auth0.com/my-org/",
                organization: "org_123456789",
            });
        });

        it("should propagate Auth0 errors", async () => {
            const authError = new Error("Invalid client credentials");
            mockGetTokenByClientCredentials.mockRejectedValue(authError);

            const provider = new ClientCredentialsTokenProvider({
                domain: "test-domain.auth0.com",
                clientId: "test-client-id",
                clientSecret: "test-client-secret",
                organization: "org_123456789",
            });

            await expect(provider.getToken()).rejects.toThrow("Invalid client credentials");
        });
    });

    describe("mTLS integration", () => {
        it("should successfully get token with client secret and mTLS", async () => {
            const mockCustomFetch = vi.fn();
            const provider = new ClientCredentialsTokenProvider({
                domain: "test-domain.auth0.com",
                clientId: "test-client-id",
                clientSecret: "test-client-secret",
                organization: "org_123456789",
                useMtls: true,
                customFetch: mockCustomFetch,
            });

            const token = await provider.getToken();

            expect(token).toBe("mock-access-token");
            expect(MockAuthClient).toHaveBeenCalledWith({
                domain: "test-domain.auth0.com",
                clientId: "test-client-id",
                clientSecret: "test-client-secret",
                clientAssertionSigningKey: undefined, // No JWT assertion for client secret flow
                clientAssertionSigningAlg: undefined,
                useMtls: true,
                customFetch: mockCustomFetch,
            });
            expect(mockGetTokenByClientCredentials).toHaveBeenCalledWith({
                audience: "https://test-domain.auth0.com/my-org/",
                organization: "org_123456789",
            });
        });

        it("should successfully get token with private key and mTLS", async () => {
            const mockCustomFetch = vi.fn();
            const provider = new ClientCredentialsTokenProvider({
                domain: "test-domain.auth0.com",
                clientId: "test-client-id",
                privateKey: "-----BEGIN PRIVATE KEY-----\ntest-key...",
                organization: "org_123456789",
                useMtls: true,
                customFetch: mockCustomFetch,
            });

            const token = await provider.getToken();

            expect(token).toBe("mock-access-token");
            expect(MockAuthClient).toHaveBeenCalledWith({
                domain: "test-domain.auth0.com",
                clientId: "test-client-id",
                clientSecret: undefined,
                clientAssertionSigningKey: "-----BEGIN PRIVATE KEY-----\ntest-key...",
                clientAssertionSigningAlg: undefined, // Uses default (RS256)
                useMtls: true,
                customFetch: mockCustomFetch,
            });
        });

        it("should successfully get token with mTLS and custom audience", async () => {
            const mockCustomFetch = vi.fn();
            const provider = new ClientCredentialsTokenProvider({
                domain: "test-domain.auth0.com",
                clientId: "test-client-id",
                clientSecret: "test-client-secret",
                organization: "org_123456789",
                audience: "https://mtls-api.example.com/",
                useMtls: true,
                customFetch: mockCustomFetch,
            });

            await provider.getToken();

            expect(mockGetTokenByClientCredentials).toHaveBeenCalledWith({
                audience: "https://mtls-api.example.com/",
                organization: "org_123456789",
            });
        });

        it("should throw error when client secret mTLS lacks customFetch", () => {
            expect(() => {
                new ClientCredentialsTokenProvider({
                    domain: "test-domain.auth0.com",
                    clientId: "test-client-id",
                    clientSecret: "test-client-secret",
                    organization: "org_123456789",
                    useMtls: true,
                    // No customFetch - should throw an error during initialization
                });
            }).toThrow("Using mTLS without a custom fetch implementation is not supported");
        });

        it("should throw error when private key mTLS lacks customFetch", () => {
            expect(() => {
                new ClientCredentialsTokenProvider({
                    domain: "test-domain.auth0.com",
                    clientId: "test-client-id",
                    privateKey: "-----BEGIN PRIVATE KEY-----\ntest-key...",
                    organization: "org_123456789",
                    useMtls: true,
                    // No customFetch - should throw an error during initialization
                });
            }).toThrow("Using mTLS without a custom fetch implementation is not supported");
        });
    });
});
