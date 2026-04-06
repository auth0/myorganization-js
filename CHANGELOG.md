# Change Log

## [v1.0.0-beta.6](https://github.com/auth0/myorganization-js/tree/v1.0.0-beta.6) (2026-04-06)

**Breaking**

- chore!: bump minimum Node.js version from 18 to 20 [\#40](https://github.com/auth0/myorganization-js/pull/40) ([fern-api[bot]](https://github.com/apps/fern-api))
    - Bumped `engines.node` requirement from `>=18.0.0` to `>=20.0.0`
    - Updated `@types/node` from `^18.19.70` to `^22.0.0`

**Added**

- Added `fetch()` passthrough method on the base client for making requests to endpoints not yet supported, using the configured auth, retry, logging, and headers [\#38](https://github.com/auth0/myorganization-js/pull/38) ([fern-api[bot]](https://github.com/apps/fern-api))
- Added `cause` property to `MyOrganizationError` and `MyOrganizationTimeoutError`, preserving the original error through the error handling chain [\#38](https://github.com/auth0/myorganization-js/pull/38) ([fern-api[bot]](https://github.com/apps/fern-api))

**Changed**

- Removed `CustomPager` in favor of the existing `Page` class for pagination [\#38](https://github.com/auth0/myorganization-js/pull/38)
- Updated `BinaryResponse.bytes()` return type from `ReturnType<Response["bytes"]>` to `Promise<Uint8Array>` for broader runtime compatibility [\#38](https://github.com/auth0/myorganization-js/pull/38)
- Updated `@auth0/auth0-auth-js` from 1.5.0 to 1.6.0 [\#37](https://github.com/auth0/myorganization-js/pull/37)
- Bumped dev dependencies: vitest v3 to v4, TypeScript 5.7 to 5.9, prettier 3.7 to 3.8, webpack 5.97 to 5.105, pnpm 10.20 to 10.33 [\#38](https://github.com/auth0/myorganization-js/pull/38)

## [v1.0.0-beta.5](https://github.com/auth0/myorganization-js/tree/v1.0.0-beta.5) (2026-03-23)

**Breaking**

- chore!: regenerate SDK with pagination support for domains list [\#34](https://github.com/auth0/myorganization-js/pull/34) ([fern-api[bot]](https://github.com/apps/fern-api))
    - Changed `organization.domains.list()` return type from `HttpResponsePromise` to `Promise<Page>` with cursor-based pagination (`from`/`take` parameters)
    - Added new `core/pagination` module with `Page` and `CustomPager` classes
    - Added `BadRequestError` (400) handling to the domains list endpoint
- chore!: regenerate SDK with member type changes and scope updates [\#35](https://github.com/auth0/myorganization-js/pull/35) ([fern-api[bot]](https://github.com/apps/fern-api))
    - Removed `google-sync` provisioning method from `IdpProvisioningMethodEnum` and `IdentityProvidersConfigProvisioningMethodsEnum` (affects identity providers configuration client)
    - Renamed `OrgMemberId` type to `OrgMemberIdReadOnly`
    - Removed `is_guest` field from `OrgMember`
    - Removed `CreateMemberInvitationResponseContent` type
    - Made `BaseUserAttributeMapItem.user_attribute` optional
    - Changed `MemberInvitation.roles` type from `string[]` to `OrgMemberRoleId[]`

**Added**

- Added new OAuth scope `delete:my_org:memberships` (deletes membership without deleting underlying users)
- Added DPoP examples for vanilla and React SPAs [\#29](https://github.com/auth0/myorganization-js/pull/29)

**Changed**

- Updated `delete:my_org:members` scope description to clarify it deletes underlying users
- Updated `jose` from 6.2.1 to 6.2.2
- Bumped `typedoc`, `ts-api-utils`, `yaml`, and other dev dependencies

## [v1.0.0-beta.4](https://github.com/auth0/myorganization-js/tree/v1.0.0-beta.4) (2026-03-18)

**Added**

- feat: upgrade Fern SDK with logging, auth refactor, and new OAuth scopes [\#21](https://github.com/auth0/myorganization-js/pull/21) ([fern-api[bot]](https://github.com/apps/fern-api))
    - Added configurable `core.logging` module with automatic redaction of sensitive headers
    - Added `BearerAuthProvider` pattern replacing direct `token` option
    - Added new OAuth scopes: `create:my_org:client_grants`, `create:my_org:clients`, `read:my_org:clients`, `delete:my_org:clients`
    - Added `BodyIsNullError` type and `Accept` header auto-set based on `responseType`
- chore: regenerate SDK with API definition updates and core fetcher improvements [\#27](https://github.com/auth0/myorganization-js/pull/27) ([fern-api[bot]](https://github.com/apps/fern-api))
    - Split `OrgDetails` into `OrgDetails` (write) and `OrgDetailsRead` (read)
    - Added `cache: "no-store"` for streaming/SSE requests with Cloudflare Workers compatibility
    - Refactored Node.js runtime detection to avoid bundler warnings
- chore: regenerate SDK with updated API definitions and type changes [\#30](https://github.com/auth0/myorganization-js/pull/30) ([fern-api[bot]](https://github.com/apps/fern-api))
    - Renamed `google-apps` strategy key to `googleapps` in `IdentityProvidersConfigStrategyOverride`
    - Renamed `logout` feature to `universal_logout` in `IdentityProvidersConfigEnabledFeaturesEnum`
    - Removed `domain_aliases_config` field from `IdentityProvidersConfig`
    - Made several fields optional in `MemberInvitation` type
- Add framework documentation and examples for MyOrganization SDK [\#19](https://github.com/auth0/myorganization-js/pull/19)

**Fixed**

- fix: delegate custom fetcher to core.fetcher for proper request handling [\#25](https://github.com/auth0/myorganization-js/pull/25)
- fix: resolve header loss and duplicate auth in custom fetcher mode [\#28](https://github.com/auth0/myorganization-js/pull/28)

**Changed**

- Updated license to Apache-2.0 and added NOTICE file [\#20](https://github.com/auth0/myorganization-js/pull/20)
- Updated `@auth0/auth0-auth-js` from 1.3.0 to 1.5.0
- Updated `jose` from 6.1.3 to 6.2.1
- Bumped `lint-staged`, `typescript-eslint`, `eslint`, `webpack`, and other dev dependencies

## [v1.0.0-beta.3](https://github.com/auth0/myorganization-js/tree/v1.0.0-beta.3) (2025-12-22)

**Added**

- feat: Add attribute mapping endpoints for Identity Providers and Provisioning [\#17](https://github.com/auth0/myorganization-js/pull/17) ([fern-api[bot]](https://github.com/apps/fern-api))
    - Added `updateAttributes` endpoint for Identity Providers to refresh attribute mappings with admin-defined defaults
    - Added `updateAttributes` endpoint for Identity Provider Provisioning configurations
    - Added new attribute mapping types: `IdpUserAttributeMapItem`, `BaseUserAttributeMapItem`, `IdpProvisioningUserAttributeMapItem`
    - Enhanced Identity Provider and Provisioning responses to include attribute mapping information

**Changed**

- Updated `@auth0/auth0-auth-js` from 1.2.0 to 1.3.0
- Updated ESLint from 9.39.1 to 9.39.2
- Updated `typescript-eslint` from 8.48.0 to 8.50.0
- Updated TypeDoc from 0.28.14 to 0.28.15
- Updated various other dev dependencies to their latest versions

## [v1.0.0-beta.2](https://github.com/auth0/myorganization-js/tree/v1.0.0-beta.2) (2025-11-28)

**Added**

- chore(deps): update dependencies and API types [\#10](https://github.com/auth0/myorganization-js/pull/10) ([fern-api[bot]](https://github.com/apps/fern-api))

## [v1.0.0-beta.1](https://github.com/auth0/myorganization-js/tree/v1.0.0-beta.1) (2025-11-10)

[Full Changelog](https://github.com/auth0/myorganization-js/compare/v1.0.0-beta.0...v1.0.0-beta.1)

**Changed**

- Updated `jose` dependency from `6.1.0` to `6.1.1`
- Removed `members` and `invitations` resources from organization API client
- Removed request interface definitions: `ListOrganizationMembersRequestParameters`, `DeleteOrganizationMemberRequestParameters`, `CreateMemberInvitationRequestContent`, and `AssignOrganizationMemberRoleRequestContent`

**Fixed**

- Improved error handling for identity provider operations with HTTP 409 Conflict support

## [v1.0.0-beta.0](https://github.com/auth0/myorganization-js/tree/v1.0.0-beta.0) (2025-11-07)

**Initial beta release of Auth0 MyOrganization JavaScript SDK**

### Features

- Complete MyOrganization API client implementation
- TypeScript support with full type coverage
- Token supplier pattern for dynamic authentication
- Support for custom fetcher implementations
- Built-in telemetry and error handling
- Dual package support (CommonJS and ESM)
- Comprehensive API documentation
- Browser and Node.js compatibility (>=18.0.0)

### API Support

- Organization management and details
- Member management (add, remove, update)
- Role assignment and management
- Domain management (create, verify, delete)
- Identity Provider (IdP) integration
- Member invitations
- SCIM provisioning tokens
- Organization verification

### Developer Experience

- Flexible authentication patterns (token-based and token supplier)
- Strong TypeScript types for all API operations
- Built-in retry logic and error handling
- Automatic Auth0-Client telemetry headers
- Custom error types for better error handling
- Comprehensive reference documentation

[Full Changelog](https://github.com/auth0/myorganization-js/commits/v1.0.0-beta.0)
