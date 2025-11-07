import { createMyOrganizationClientWithClientCredentials } from "../../src/server.js";
import { MyOrganizationClient } from "../../src/wrappers/MyOrganizationClient.js";
import { ClientCredentialsTokenProvider } from "../../src/auth/ClientCredentialsTokenProvider.js";
import type { MockedClass } from "vitest";

// Mock dependencies
vi.mock("../../src/wrappers/MyOrganizationClient.js");
vi.mock("../../src/auth/ClientCredentialsTokenProvider.js");

// Mock @auth0/auth0-auth-js
const mockGetTokenByClientCredentials = vi.fn();
vi.mock("@auth0/auth0-auth-js", () => ({
    AuthClient: vi.fn().mockImplementation(() => ({
        getTokenByClientCredentials: mockGetTokenByClientCredentials,
    })),
}));

const MockMyOrgClient = MyOrganizationClient as MockedClass<typeof MyOrganizationClient>;
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

    describe("createMyOrganizationClientWithClientCredentials", () => {
        it("should create MyOrganizationClient with client secret credentials", () => {
            const result = createMyOrganizationClientWithClientCredentials(
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

            // Verify MyOrganizationClient was created with tokenProvider and domain
            expect(MockMyOrgClient).toHaveBeenCalledWith({
                domain: "test-domain.auth0.com",
                tokenProvider: expect.any(MockClientCredentialsTokenProvider),
                baseUrl: undefined,
                telemetry: undefined,
                clientInfo: undefined,
            });

            expect(result).toBeInstanceOf(MyOrganizationClient);
        });

        it("should create MyOrganizationClient with private key credentials", () => {
            const result = createMyOrganizationClientWithClientCredentials(
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

            // Verify MyOrganizationClient was created
            expect(MockMyOrgClient).toHaveBeenCalledWith({
                domain: "test-domain.auth0.com",
                tokenProvider: expect.any(MockClientCredentialsTokenProvider),
                baseUrl: undefined,
                telemetry: undefined,
                clientInfo: undefined,
            });

            expect(result).toBeInstanceOf(MyOrganizationClient);
        });

        it("should pass through additional options", () => {
            const result = createMyOrganizationClientWithClientCredentials(
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

            // Verify additional options are passed to MyOrganizationClient
            expect(MockMyOrgClient).toHaveBeenCalledWith({
                domain: "test-domain.auth0.com",
                tokenProvider: expect.any(MockClientCredentialsTokenProvider),
                baseUrl: "https://custom-api.example.com",
                telemetry: false,
                clientInfo: { name: "my-app", version: "2.0.0" },
            });

            expect(result).toBeInstanceOf(MyOrganizationClient);
        });

        it("should pass through custom audience", () => {
            const result = createMyOrganizationClientWithClientCredentials(
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

            expect(result).toBeInstanceOf(MyOrganizationClient);
        });

        it("should pass through mTLS options", () => {
            const mockCustomFetch = vi.fn();
            const result = createMyOrganizationClientWithClientCredentials(
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

            expect(result).toBeInstanceOf(MyOrganizationClient);
        });
    });
});
