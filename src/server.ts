/**
 * Server-only authentication components for Auth0 MyOrg SDK.
 *
 * This module contains authentication providers that should ONLY be used
 * in secure server environments where client secrets and private keys can
 * be safely stored.
 *
 * **Security Warning**: Never import or use these components in browser/SPA
 * applications as they expose sensitive credentials.
 *
 * @module Server
 * @group Server Authentication
 */

export {
    ClientCredentialsTokenProvider,
    type TokenProvider,
    type ClientCredentialsWithSecretOptions,
    type ClientCredentialsWithAssertionOptions,
    type ClientCredentialsOptions,
} from "./auth/index.js";

export { MyOrgClient } from "./wrappers/MyOrgClient.js";

import { MyOrgClient } from "./wrappers/MyOrgClient.js";
import {
    ClientCredentialsTokenProvider,
    type ClientCredentialsOptions,
    type ClientCredentialsWithSecretOptions,
    type ClientCredentialsWithAssertionOptions,
} from "./auth/index.js";

/**
 * Client credentials options without domain (domain comes from client options).
 *
 * @group Server Authentication
 * @public
 */
export type ClientCredentialsProviderOptions =
    | Omit<ClientCredentialsWithSecretOptions, "domain">
    | Omit<ClientCredentialsWithAssertionOptions, "domain">;

/**
 * Creates a MyOrgClient with client credentials authentication.
 * Provides clear separation between client options and authentication provider options.
 *
 * @param clientOptions - MyOrgClient configuration options (domain, baseUrl, telemetry, etc.)
 * @param providerOptions - Client credentials authentication options (clientId, clientSecret, organization, etc.)
 * @returns A configured MyOrgClient ready to use
 *
 * @group Server Authentication
 * @public
 *
 * @example Basic usage with client secret
 * ```typescript
 * import { createMyOrgClientWithCredentials } from 'auth0-my-org/server';
 *
 * const client = createMyOrgClientWithCredentials(
 *   {
 *     domain: 'your-tenant.auth0.com'
 *   },
 *   {
 *     clientId: 'your-client-id',
 *     clientSecret: 'your-client-secret',
 *     organization: 'org_123456789'
 *   }
 * );
 * ```
 *
 * @example With private key assertion
 * ```typescript
 * const client = createMyOrgClientWithCredentials(
 *   {
 *     domain: 'your-tenant.auth0.com',
 *     telemetry: false
 *   },
 *   {
 *     clientId: 'your-client-id',
 *     clientAssertionSigningKey: privateKey,
 *     organization: 'org_123456789'
 *   }
 * );
 * ```
 *
 * @example With custom base URL and fetcher
 * ```typescript
 * const client = createMyOrgClientWithCredentials(
 *   {
 *     domain: 'your-tenant.auth0.com',
 *     baseUrl: 'https://custom-domain.auth0.com/my-org',
 *     fetcher: customFetchFunction
 *   },
 *   {
 *     clientId: 'your-client-id',
 *     clientSecret: 'your-client-secret',
 *     organization: 'org_123456789',
 *     audience: 'https://api.example.com'
 *   }
 * );
 * ```
 */
export function createMyOrgClientWithClientCredentials(
    clientOptions: MyOrgClient.MyOrgClientOptions,
    providerOptions: ClientCredentialsProviderOptions,
): MyOrgClient {
    // Create the token provider with authentication options and domain from client options
    const tokenProvider = new ClientCredentialsTokenProvider({
        ...providerOptions,
        domain: clientOptions.domain,
    } as ClientCredentialsOptions);

    // Create and return the MyOrgClient with the token provider
    return new MyOrgClient({
        ...clientOptions,
        tokenProvider,
    });
}
