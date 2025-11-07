import { AuthClient, type AuthClientOptions } from "@auth0/auth0-auth-js";

/**
 * Simple interface for token providers.
 * @public
 */
export interface TokenProvider {
    /**
     * Gets an access token.
     * @returns A promise that resolves to an access token string
     */
    getToken(): Promise<string>;
}

/**
 * Configuration options for client credentials authentication using client secret.
 *
 * @group Server Authentication
 * @public
 */
export interface ClientCredentialsWithSecretOptions {
    /** Auth0 domain (e.g., 'your-tenant.auth0.com') */
    domain: string;
    /** Auth0 application client ID */
    clientId: string;
    /** Auth0 application client secret */
    clientSecret: string;
    /** Organization ID or name - required for MyOrganization API access */
    organization: string;
    /**
     * API audience. Defaults to https://{domain}/my-org/
     * @defaultValue `https://{domain}/my-org/`
     */
    audience?: string;
    /** Enable mTLS authentication */
    useMtls?: boolean;
    /** Custom fetch function that handles client certificates */
    customFetch?: typeof fetch;
}

/**
 * Configuration options for client credentials authentication using JWT assertion.
 *
 * @group Server Authentication
 * @public
 */
export interface ClientCredentialsWithAssertionOptions {
    /** Auth0 domain (e.g., 'your-tenant.auth0.com') */
    domain: string;
    /** Auth0 application client ID */
    clientId: string;
    /** Private key for signing the client assertion JWT */
    privateKey: string | CryptoKey;
    /** Algorithm for signing the client assertion. Defaults to RS256 */
    clientAssertionSigningAlg?: string;
    /** Organization ID or name - required for MyOrganization API access */
    organization: string;
    /**
     * API audience. Defaults to https://{domain}/my-org/
     * @defaultValue `https://{domain}/my-org/`
     */
    audience?: string;
    /** Enable mTLS authentication */
    useMtls?: boolean;
    /** Custom fetch function that handles client certificates */
    customFetch?: typeof fetch;
}

/**
 * Union type for client credentials authentication options.
 * Use either client secret or private key authentication.
 *
 * @group Server Authentication
 * @public
 */
export type ClientCredentialsOptions = ClientCredentialsWithSecretOptions | ClientCredentialsWithAssertionOptions;

/**
 * A token provider that uses OAuth 2.0 client credentials flow.
 * This should only be used in secure server environments where client secrets can be protected.
 *
 * **Security Warning**: Never use this in browser environments as it exposes client secrets.
 *
 * @group Server Authentication
 * @public
 */
export class ClientCredentialsTokenProvider implements TokenProvider {
    private authClient: AuthClient;
    private readonly options: ClientCredentialsOptions;

    /**
     * Creates a new client credentials token provider.
     *
     * @param options - Configuration options including domain, credentials, and organization
     * @group Server Authentication
     * @public
     */
    constructor(options: ClientCredentialsOptions) {
        // Set default audience if not provided
        const sanitizedDomain = options.domain.replace(/^https?:\/\//, "").replace(/\/$/, "");

        this.options = {
            ...options,
            audience: options.audience || `https://${sanitizedDomain}/my-org/`,
        };

        // Initialize Auth0 client immediately
        const authClientOptions: AuthClientOptions = {
            domain: this.options.domain,
            clientId: this.options.clientId,
            clientSecret: "clientSecret" in this.options ? this.options.clientSecret : undefined,
            clientAssertionSigningKey: "privateKey" in this.options ? this.options.privateKey : undefined,
            clientAssertionSigningAlg:
                "clientAssertionSigningAlg" in this.options ? this.options.clientAssertionSigningAlg : undefined,
            useMtls: this.options?.useMtls,
            customFetch: this.options?.customFetch,
        };

        this.authClient = new AuthClient(authClientOptions);
    }

    /**
     * Gets an access token using client credentials flow.
     * @returns A promise that resolves to an access token
     */
    async getToken(): Promise<string> {
        const tokenResponse = await this.authClient.getTokenByClientCredentials({
            audience: this.options.audience!,
            organization: this.options.organization,
        });

        return tokenResponse.accessToken;
    }
}
