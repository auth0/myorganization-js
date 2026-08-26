# Migration Guide

This guide covers the breaking changes in v2 of the stable MyOrganization SDK (`@auth0/myorganization-js`) and how to adapt your application.

## Release channels

Endpoints move through three maturity tiers: Generally Available, Early Access, and Beta. The SDK is published on two channels, and each channel exposes a different set of tiers:

- **Stable** (`@auth0/myorganization-js`, npm `latest`): includes the Generally Available and Early Access endpoints.
- **Beta** (`@auth0/myorganization-js@beta`, npm `beta`): a superset that includes all three tiers (Generally Available, Early Access, and Beta), including member management.

```bash
npm install @auth0/myorganization-js        # stable (Generally Available + Early Access)
npm install @auth0/myorganization-js@beta    # beta (all tiers, including member management)
```

## Upgrading to v2.0.0 (stable)

### Member management moved to the beta channel

Starting with v2.0.0, member management becomes a Beta-tier feature, so it is no longer part of the stable channel. These resources are removed from `@auth0/myorganization-js` and are available on the beta channel (`@auth0/myorganization-js@beta`) going forward. If your application manages members, invitations, roles, or memberships, install the beta SDK.

Removed from stable:

- `organization.members` (`list`, `get`)
- `organization.members.roles` (`list`, `assign`, `unassign`)
- `organization.invitations` (`list`, `create`, `get`, `delete`)
- `organization.memberships` (`deleteMemberships`)
- `organization.roles` (`list`)

Along with their types, including `CreateMemberInvitationInvitee`, `CreateMemberInvitationResponseContent`, `GetOrganizationMemberRolesResponseContent`, `ListMembersInvitationsResponseContent`, `ListOrganizationMembersResponseContent`, `ListRolesResponseContent`, `OrgMemberId`, and `OrganizationMemberRolesChangeRequestContent`.

To keep using these features, switch the import to the beta package:

```bash
npm install @auth0/myorganization-js@beta
```

The beta SDK also introduces the replacement endpoints for the operations that are being decommissioned (batch invitation delete, member role unassignment via `POST`, and member-invitation role listing). See the beta package's migration guide for those endpoint changes.

The stable channel continues to include organization details, configuration, domains, and identity providers.

### `domains.identityProviders.get` renamed to `list`

Listing the identity providers on a domain moved from a `get` method to a `list` method, and the response is now a list response type.

- Old: `organization.domains.identityProviders.get(domain_id)`
- New: `organization.domains.identityProviders.list(domain_id)` returning `ListDomainIdentityProvidersResponseContent`

Before:

```typescript
const result = await client.organization.domains.identityProviders.get("domain_id");
```

After:

```typescript
const result = await client.organization.domains.identityProviders.list("domain_id");
```

### Identity provider response `options` and `attributes` are now optional

On identity provider response types, `options` (and `attributes`, where present) changed from required to optional, so they may be `undefined`. Add null-handling when reading them.

Affected response types:

- `options` is now optional on `IdpAdfsResponse`, `IdpGoogleAppsResponse`, `IdpOidcResponse`, `IdpOktaResponse`, `IdpPingFederateResponse`, `IdpSamlpResponse`, and `IdpWaadResponse`.
- `attributes` is now optional on `IdpOidcResponse`, `IdpOktaResponse`, and `IdpSamlpResponse`.

Before:

```typescript
const idp = await client.organization.identityProviders.get("idp_id");
const opts = idp.options; // previously always defined
```

After:

```typescript
const idp = await client.organization.identityProviders.get("idp_id");
if (idp.options) {
    // read idp.options safely
}
```

## New (non-breaking)

- `organization.identityProviders.list()` now accepts an optional request object for filtering. Existing no-argument calls continue to work.
- New OAuth scopes `read:my_org:user_stores` and `delete:my_org:organizations`.
- Cross-app access and third-party client access support on identity providers, including the `use_for_third_party_client_access` and `cross_app_access_resource_app` fields.

## Questions

If you run into issues migrating, please open an issue at https://github.com/auth0/myorganization-js/issues.
