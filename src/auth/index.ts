/**
 * Authentication providers and interfaces.
 *
 * @module Auth
 * @group Server Authentication
 */

// Export factory functions and types
export {
    ClientCredentialsTokenProvider,
    type TokenProvider,
    type ClientCredentialsWithSecretOptions,
    type ClientCredentialsWithAssertionOptions,
    type ClientCredentialsOptions,
} from "./ClientCredentialsTokenProvider.js";
