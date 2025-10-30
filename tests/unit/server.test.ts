import { createMyOrgClientWithClientCredentials } from "../../src/server.js";
import { MyOrgClient } from "../../src/wrappers/MyOrgClient.js";
import { ClientCredentialsTokenProvider } from "../../src/auth/ClientCredentialsTokenProvider.js";
import type { MockedClass } from "vitest";

// Mock dependencies
vi.mock("../../src/wrappers/MyOrgClient.js");
vi.mock("../../src/auth/ClientCredentialsTokenProvider.js");

// Mock @auth0/auth0-auth-js
const mockGetTokenByClientCredentials = vi.fn();
vi.mock("@auth0/auth0-auth-js", () => ({
    AuthClient: vi.fn().mockImplementation(() => ({
        getTokenByClientCredentials: mockGetTokenByClientCredentials,
    })),
}));

const MockMyOrgClient = MyOrgClient as MockedClass<typeof MyOrgClient>;
const MockClientCredentialsTokenProvider = ClientCredentialsTokenProvider as MockedClass<
    typeof ClientCredentialsTokenProvider
>;

describe("Server Factory Functions", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockGetTokenByClientCredentials.mockResolvedValue({
            accessToken: "mock-access-token",
            expires_in: 3600,
            token_type: "Bearer",
        });
    });

    describe("createMyOrgClientWithClientCredentials", () => {
        it("should create MyOrgClient with client secret credentials", () => {
            const result = createMyOrgClientWithClientCredentials(
                { domain: "test-domain.auth0.com" },
                {
                    clientId: "test-client-id",
                    clientSecret: "test-client-secret",
                    organization: "org_123456789",
                },
            );

            // Verify ClientCredentialsTokenProvider was created with correct options
            expect(MockClientCredentialsTokenProvider).toHaveBeenCalledWith({
                domain: "test-domain.auth0.com",
                clientId: "test-client-id",
                clientSecret: "test-client-secret",
                organization: "org_123456789",
            });

            // Verify MyOrgClient was created with tokenProvider and domain
            expect(MockMyOrgClient).toHaveBeenCalledWith({
                domain: "test-domain.auth0.com",
                tokenProvider: expect.any(MockClientCredentialsTokenProvider),
                baseUrl: undefined,
                telemetry: undefined,
                clientInfo: undefined,
            });

            expect(result).toBeInstanceOf(MyOrgClient);
        });

        it("should create MyOrgClient with private key credentials", () => {
            const result = createMyOrgClientWithClientCredentials(
                { domain: "test-domain.auth0.com" },
                {
                    clientId: "test-client-id",
                    privateKey: "-----BEGIN PRIVATE KEY-----\ntest-key...",
                    organization: "org_123456789",
                },
            );

            // Verify ClientCredentialsTokenProvider was created with private key
            expect(MockClientCredentialsTokenProvider).toHaveBeenCalledWith({
                domain: "test-domain.auth0.com",
                clientId: "test-client-id",
                privateKey: "-----BEGIN PRIVATE KEY-----\ntest-key...",
                organization: "org_123456789",
            });

            // Verify MyOrgClient was created
            expect(MockMyOrgClient).toHaveBeenCalledWith({
                domain: "test-domain.auth0.com",
                tokenProvider: expect.any(MockClientCredentialsTokenProvider),
                baseUrl: undefined,
                telemetry: undefined,
                clientInfo: undefined,
            });

            expect(result).toBeInstanceOf(MyOrgClient);
        });

        it("should pass through additional options", () => {
            const result = createMyOrgClientWithClientCredentials(
                {
                    domain: "test-domain.auth0.com",
                    baseUrl: "https://custom-api.example.com",
                    telemetry: false,
                    clientInfo: { name: "my-app", version: "2.0.0" },
                },
                {
                    clientId: "test-client-id",
                    clientSecret: "test-client-secret",
                    organization: "org_123456789",
                },
            );

            // Verify additional options are passed to MyOrgClient
            expect(MockMyOrgClient).toHaveBeenCalledWith({
                domain: "test-domain.auth0.com",
                tokenProvider: expect.any(MockClientCredentialsTokenProvider),
                baseUrl: "https://custom-api.example.com",
                telemetry: false,
                clientInfo: { name: "my-app", version: "2.0.0" },
            });

            expect(result).toBeInstanceOf(MyOrgClient);
        });

        it("should pass through custom audience", () => {
            const result = createMyOrgClientWithClientCredentials(
                { domain: "test-domain.auth0.com" },
                {
                    clientId: "test-client-id",
                    clientSecret: "test-client-secret",
                    organization: "org_123456789",
                    audience: "https://custom-api.example.com/",
                },
            );

            // Verify custom audience is passed to ClientCredentialsTokenProvider
            expect(MockClientCredentialsTokenProvider).toHaveBeenCalledWith({
                domain: "test-domain.auth0.com",
                clientId: "test-client-id",
                clientSecret: "test-client-secret",
                organization: "org_123456789",
                audience: "https://custom-api.example.com/",
            });

            expect(result).toBeInstanceOf(MyOrgClient);
        });

        it("should pass through mTLS options", () => {
            const mockCustomFetch = vi.fn();
            const result = createMyOrgClientWithClientCredentials(
                { domain: "test-domain.auth0.com" },
                {
                    clientId: "test-client-id",
                    clientSecret: "test-client-secret",
                    organization: "org_123456789",
                    useMtls: true,
                    customFetch: mockCustomFetch,
                },
            );

            // Verify mTLS options are passed to ClientCredentialsTokenProvider
            expect(MockClientCredentialsTokenProvider).toHaveBeenCalledWith({
                domain: "test-domain.auth0.com",
                clientId: "test-client-id",
                clientSecret: "test-client-secret",
                organization: "org_123456789",
                useMtls: true,
                customFetch: mockCustomFetch,
            });

            expect(result).toBeInstanceOf(MyOrgClient);
        });
    });
});
