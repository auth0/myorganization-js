/**
 * Authentication utilities for MyOrganizationClient Client.
 *
 * @module Wrappers.Auth
 * @group MyOrganization API
 */

export type { Auth0TokenSupplier, Auth0Token } from "./Token.js";
export { createCoreTokenSupplier, extractScopesFromMetadata } from "./Token.js";

export type { Auth0FetcherSupplier, Auth0Fetcher } from "./Fetcher.js";
