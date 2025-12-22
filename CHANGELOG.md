# Change Log

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
