import { Auth0MyOrgClient } from "../Client.js";
import { Auth0ClientTelemetry, type Auth0ClientTelemetryOptions } from "../utils/index.js";
import * as core from "../core/index.js";
import {
    type Auth0TokenSupplier,
    createCoreTokenSupplier,
    type Auth0FetcherSupplier,
    type Auth0Fetcher,
    extractScopesFromMetadata,
} from "./auth/index.js";
import { type TokenProvider } from "../auth/index.js";

/**
 * All supported configuration options for the MyOrgClient.
 *
 * @group MyOrg API
 */
type MyOrgClientConfig =
    | MyOrgClient.MyOrgClientOptionsWithToken
    | MyOrgClient.MyOrgClientOptionsWithTokenProvider
    | MyOrgClient.MyOrgClientOptionsWithFetcher;

export declare namespace MyOrgClient {
    /**
     * Base configuration options for the MyOrg Client.
     * Extends the Fern client options but excludes token and environment
     * as these are handled by our wrapper.
     *
     * @group MyOrg API
     * @public
     */
    export interface MyOrgClientOptions
        extends Omit<Auth0MyOrgClient.Options, "token" | "environment" | "baseUrl" | "fetcher"> {
        /** Auth0 domain (e.g., 'your-tenant.auth0.com') */
        domain: string;
        /**
         * Custom base URL if you need a different API endpoint
         * Example: "https://your-tenant.auth0.com/custom/path"
         * Overrides the default URL construction from domain
         */
        baseUrl?: string;
        /**
         * Enable/disable telemetry. Defaults to true
         * @defaultValue true
         */
        telemetry?: boolean;
        /** Custom client information for telemetry */
        clientInfo?: Auth0ClientTelemetryOptions["clientInfo"];
    }

    /**
     * Configuration for token-based authentication.
     * Use this when you already have a valid access token or can get one.
     * This is the recommended approach for SPA applications.
     *
     * @group MyOrg API
     * @public
     *
     * @example Static token
     * ```typescript
     * const client = new MyOrgClient({
     *   domain: 'your-tenant.auth0.com',
     *   token: 'your-access-token'
     * });
     * ```
     *
     * @example Simple dynamic token
     * ```typescript
     * const client = new MyOrgClient({
     *   domain: 'your-tenant.auth0.com',
     *   token: () => getAccessToken() // Function that returns a token
     * });
     * ```
     *
     * @example Recommended: Auto scope-aware token (Auth0 SPA)
     * ```typescript
     * const client = new MyOrgClient({
     *   domain: 'your-tenant.auth0.com',
     *   token: async ({ authorizationParams }) => {
     *     // SDK automatically passes required scopes for each API call
     *     return await auth0.getTokenSilently({
     *       authorizationParams: {
     *         scope: `openid profile email ${authorizationParams.scope}`
     *       }
     *     });
     *   }
     * });
     * ```
     *
     * @example Pass your function directly
     * ```typescript
     * // Your getAccessToken function receives { authorizationParams: { scope: '...' } } automatically
     * const client = new MyOrgClient({
     *   domain: 'your-tenant.auth0.com',
     *   token: getAccessToken  // SDK calls with required scopes
     * });
     * 
     * async function getAccessToken({ authorizationParams }) {
     *   return await auth0.getTokenSilently({
     *     authorizationParams: {
     *       scope: `openid profile email ${authorizationParams.scope}`
     *     }
     *   });
     * }
     * ```
     *

     */
    export interface MyOrgClientOptionsWithToken extends MyOrgClientOptions {
        /**
         * Token configuration for authentication.
         *
         * Supports multiple patterns:
         * - **String**: Static access token
         * - **Simple function**: `() => string` - For dynamic tokens without scope handling
         * - **Scope-aware function**: `({ authorizationParams }) => string` - **RECOMMENDED** for Auth0 applications
         *
         * The scope-aware function is ideal for Auth0 applications as the SDK automatically
         * calls your function with the required scopes (as a space-separated string) for each API endpoint.
         */
        token: Auth0TokenSupplier;
        /**
         * Optional custom fetch function that can be used alongside token authentication.
         * When a token is provided, the Authorization header is automatically configured.
         * The custom fetcher can be used for additional request customization (e.g., logging, retry logic).
         */
        fetcher?: Auth0FetcherSupplier;
    }

    /**
     * Configuration for server-side authentication using a TokenProvider.
     * Use this approach for server applications where you can use client credentials.
     * The TokenProvider must be imported from 'auth0-my-org/server'.
     *
     * @group MyOrg API
     * @public
     *
     * @example Using TokenProvider (server-side only)
     * ```typescript
     * import { ClientCredentialsTokenProvider } from 'auth0-my-org/server';
     *
     * const tokenProvider = new ClientCredentialsTokenProvider({
     *   domain: 'your-tenant.auth0.com',
     *   clientId: 'your-client-id',
     *   clientSecret: 'your-client-secret',
     *   organization: 'org_123456789'
     * });
     *
     * const client = new MyOrgClient({
     *   domain: 'your-tenant.auth0.com',  // Domain passed to both (required)
     *   tokenProvider: tokenProvider
     * });
     * ```
     */
    export interface MyOrgClientOptionsWithTokenProvider extends MyOrgClientOptions {
        /** A token provider instance (only available from server imports) */
        tokenProvider: TokenProvider;
        /**
         * Optional custom fetch function that can be used alongside tokenProvider authentication.
         * When tokenProvider is provided, the Authorization header is automatically configured.
         * The custom fetcher can be used for additional request customization (e.g., logging, retry logic).
         */
        fetcher?: Auth0FetcherSupplier;
    }

    /**
     * Configuration when using only a custom fetcher without token or tokenProvider.
     * The fetcher is responsible for handling all authentication.
     *
     * @group MyOrg API
     * @public
     *
     * @example Using only a custom fetcher (fetcher handles auth)
     * ```typescript
     * const client = new MyOrgClient({
     *   domain: 'your-tenant.auth0.com',
     *   fetcher: async (url, init, authParams) => {
     *     const token = await getToken();
     *     return fetch(url, {
     *       ...init,
     *       headers: {
     *         ...init?.headers,
     *         'Authorization': `Bearer ${token}`
     *       }
     *     });
     *   }
     * });
     * ```
     */
    export interface MyOrgClientOptionsWithFetcher extends MyOrgClientOptions {
        /**
         * Custom fetch function that handles all authentication and authorization.
         * When using fetcher without token/tokenProvider, you must add authorization headers yourself.
         */
        fetcher: Auth0FetcherSupplier;
    }
}

/**
 * Auth0 MyOrg API client wrapper.
 *
 * Provides a high-level interface to Auth0's MyOrg API with automatic
 * token management, telemetry, and Auth0-specific configuration.
 *
 * @group MyOrg API
 * @example Using token (SPA/Client-side)
 * ```typescript
 * const client = new MyOrgClient({
 *   domain: 'your-tenant.auth0.com',
 *   token: () => getAccessToken() // Function that returns a token
 * });
 * ```
 *
 * @example Using TokenProvider (Server-side)
 * ```typescript
 * import { ClientCredentialsTokenProvider } from 'auth0-my-org/server';
 *
 * const tokenProvider = new ClientCredentialsTokenProvider({
 *   domain: 'your-tenant.auth0.com',
 *   clientId: 'your-client-id',
 *   clientSecret: 'your-client-secret',
 *   organization: 'org_123456789'
 * });
 *
 * const client = new MyOrgClient({
 *   domain: 'your-tenant.auth0.com',
 *   tokenProvider: tokenProvider
 * });
 * ```
 */
export class MyOrgClient extends Auth0MyOrgClient {
    /**
     * Creates a new MyOrg API client instance.
     *
     * @param _options - Configuration options for the MyOrg Client
     * @group MyOrg API
     */
    constructor(_options: MyOrgClientConfig) {
        // Sanitize domain - remove https:// prefix and trailing slash
        const sanitizedDomain = _options.domain.replace(/^https?:\/\//, "").replace(/\/$/, "");

        const baseUrl = `https://${sanitizedDomain}/my-org`;
        const audience = `${baseUrl}/`;
        const headers = createTelemetryHeaders(_options);
        const token = createTokenSupplier(_options);
        const fetcher =
            "fetcher" in _options && _options.fetcher
                ? createCoreFetcherSupplier(_options.fetcher, audience)
                : undefined;

        // Prepare the base client options
        // When fetcher-only is used, token will be empty string (safe placeholder)
        const clientOptions = {
            baseUrl: _options.baseUrl || baseUrl,
            headers,
            ...(fetcher && { fetcher }),
            ...(token !== undefined && { token }),
        } as Auth0MyOrgClient.Options;

        super(clientOptions);
    }
}

/**
 * Type guard to determine if options use token-based authentication.
 *
 * @param _options - The MyOrg client configuration options
 * @returns True if the options contain a token property
 * @group MyOrg API
 * @namespace MyOrgClient.Utils
 * @private
 */
function isClientOptionsWithToken(_options: MyOrgClientConfig): _options is MyOrgClient.MyOrgClientOptionsWithToken {
    return "token" in _options;
}

/**
 * Type guard to determine if options use tokenProvider-based authentication.
 *
 * @param _options - The MyOrg client configuration options
 * @returns True if the options contain a tokenProvider property
 * @group MyOrg API
 * @namespace MyOrgClient.Utils
 * @private
 */
function isClientOptionsWithTokenProvider(
    _options: MyOrgClientConfig,
): _options is MyOrgClient.MyOrgClientOptionsWithTokenProvider {
    return "tokenProvider" in _options;
}

/**
 * Type guard to determine if options use fetcher-based authentication.
 *
 * @param _options - The MyOrg client configuration options
 * @returns True if the options contain ONLY a fetcher property (no token or tokenProvider)
 * @group MyOrg API
 * @namespace MyOrgClient.Utils
 * @private
 */
function isClientOptionsWithFetcher(
    _options: MyOrgClientConfig,
): _options is MyOrgClient.MyOrgClientOptionsWithFetcher {
    return "fetcher" in _options;
}

/**
 * Creates telemetry headers for the MyOrg Client.
 * Adds the Auth0-Client header when telemetry is enabled.
 *
 * @param _options - The MyOrg client configuration options
 * @returns Headers object including telemetry information
 * @group MyOrg API
 * @namespace MyOrgClient.Utils
 * @private
 */
function createTelemetryHeaders(
    _options: MyOrgClientConfig,
): Record<string, string | core.EndpointSupplier<string | null | undefined> | null | undefined> {
    const headers: Record<string, string | core.EndpointSupplier<string | null | undefined> | null | undefined> = {
        ...(_options.headers ?? {}),
    };

    if (_options.telemetry !== false) {
        const telemetry = new Auth0ClientTelemetry({
            clientInfo: _options.clientInfo,
        });

        const auth0ClientHeader = telemetry.getAuth0ClientHeader();
        if (auth0ClientHeader) {
            headers["Auth0-Client"] = auth0ClientHeader;
        }
    }

    return headers;
}

/**
 * Creates a token supplier based on the authentication method.
 * For token-based auth: converts our Auth0TokenSupplier to core EndpointSupplier.
 * For tokenProvider-based auth: initializes the provider with domain and wraps it.
 * For fetcher-based auth: returns undefined as the fetcher handles authentication.
 *
 * @param _options - The MyOrg client configuration options
 * @param domain - The sanitized domain to initialize tokenProvider with
 * @returns A token supplier function compatible with the core client, or undefined if fetcher is provided
 * @group MyOrg API
 * @namespace MyOrgClient.Utils
 * @private
 */
function createTokenSupplier(_options: MyOrgClientConfig): core.EndpointSupplier<core.BearerToken> {
    if (isClientOptionsWithToken(_options)) {
        // SPA/Client-side pattern: convert our Auth0TokenSupplier to core EndpointSupplier
        return createCoreTokenSupplier(_options.token);
    }

    if (isClientOptionsWithTokenProvider(_options)) {
        // Server-side pattern: use the provided TokenProvider directly
        return () => _options.tokenProvider.getToken();
    }

    if (isClientOptionsWithFetcher(_options)) {
        // Custom fetcher pattern: fetcher handles authentication, return empty string as safe placeholder
        return "";
    }

    // This should never happen with proper TypeScript typing
    throw new Error(
        "MyOrgClient must be configured with either 'token', 'tokenProvider', or 'fetcher' (that handles authorization headers)",
    );
}

/**
 * Converts a custom fetch function to the core FetchFunction format.
 * Simply wraps the user's fetch and converts the Response to APIResponse.
 *
 * @param fetcherSupplier - The user-provided fetch function
 * @returns A core-compatible FetchFunction
 * @group MyOrg API
 * @namespace MyOrgClient.Utils
 * @private
 */
function createCoreFetcherSupplier(fetcherSupplier: Auth0FetcherSupplier, audience: string): core.FetchFunction {
    return async <R = unknown>(args: core.Fetcher.Args): Promise<core.APIResponse<R, core.Fetcher.Error>> => {
        // Extract scopes for authParams (optional - user's fetch may not use it)
        const scopes: string[] = args.endpointMetadata ? extractScopesFromMetadata(args.endpointMetadata) : [];
        const authParams: Auth0Fetcher.AuthorizationParams | undefined =
            scopes.length > 0 ? { scope: scopes, audience: audience } : undefined;

        // Build RequestInit from args
        const init: RequestInit = {
            method: args.method,
            headers: args.headers as HeadersInit,
            body: args.body ? JSON.stringify(args.body) : undefined,
            signal: args.abortSignal,
            credentials: args.withCredentials ? "include" : undefined,
        };

        // Call user's custom fetch
        const response = await fetcherSupplier(args.url, init, authParams);

        // Convert Response to APIResponse
        const responseBody = await response.text();
        const rawResponse: core.RawResponse = {
            headers: response.headers,
            redirected: response.redirected,
            status: response.status,
            statusText: response.statusText,
            type: response.type,
            url: response.url,
        };

        if (response.ok) {
            return {
                ok: true,
                body: responseBody ? (JSON.parse(responseBody) as R) : (undefined as R),
                rawResponse,
            };
        } else {
            return {
                ok: false,
                error: {
                    reason: "status-code",
                    statusCode: response.status,
                    body: responseBody ? JSON.parse(responseBody) : undefined,
                },
                rawResponse,
            };
        }
    };
}
