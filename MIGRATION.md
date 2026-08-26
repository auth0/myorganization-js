# Migration Guide

This guide covers the breaking changes and deprecated endpoints in the v2 (beta) line of the MyOrganization SDK, and how to move to their replacements.

The v2 surface is available on the beta channel:

```bash
npm install @auth0/myorganization-js@beta
```

Beta prereleases can introduce further breaking changes between versions, so pin an exact version if you need reproducible installs.

## Breaking changes

### 1. Deleting member invitations is now a batch operation

The single-invitation delete has been replaced by a batch endpoint, and the method signature changed.

- Old: `DELETE /member-invitations/{invitation_id}`, called as `organization.invitations.delete(invitation_id)`
- New: `POST /delete-member-invitations`, called as `organization.invitations.delete({ invitations: [...] })`

The previous single-item behavior is preserved (deprecated) as `organization.invitations.deleteLegacy(invitation_id)`.

Before:

```typescript
await client.organization.invitations.delete("invitation_id");
```

After:

```typescript
await client.organization.invitations.delete({ invitations: ["invitation_id"] });
```

### 2. Member role unassignment moved from DELETE to POST

Role unassignment now targets a `POST` endpoint. The method name and arguments are unchanged, but the underlying request changed.

- Old: `DELETE /members/{user_id}/roles`, called as `organization.members.roles.unassign(user_id, { role_ids })`
- New: `POST /members/{user_id}/unassign-roles`, called as `organization.members.roles.unassign(user_id, { role_ids })`

The previous behavior is preserved (deprecated) as `organization.members.roles.unassignLegacy(user_id, { role_ids })`.

Before and after (call site is unchanged):

```typescript
await client.organization.members.roles.unassign("user_id", { role_ids: ["role_id"] });
```

If you need the legacy `DELETE` behavior during migration:

```typescript
await client.organization.members.roles.unassignLegacy("user_id", { role_ids: ["role_id"] });
```

### 3. `domains.identityProviders.get` renamed to `list`

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

### 4. `GetOrganizationMemberResponseContent` no longer includes `roles`

The get-member response type changed from `OrgMember` to `OrgMemberBase`, which does not carry the `roles` field. Reading `roles` directly off a `get` response will no longer type-check. Fetch a member's roles through the dedicated endpoint instead.

Before:

```typescript
const member = await client.organization.members.get("user_id");
const roles = member.roles; // previously available on the response
```

After:

```typescript
const member = await client.organization.members.get("user_id");
const rolesPage = await client.organization.members.roles.list("user_id");
```

The `roles` field is still present on the list-members response (`OrgMember`), which extends `OrgMemberBase`.

### 5. Identity provider response `options` and `attributes` are now optional

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
const opts = idp.options ?? undefined;
if (idp.options) {
    // read idp.options safely
}
```

## Deprecated endpoints

These remain available in v2 so you can migrate incrementally, but they are being decommissioned. Once member management is enabled for a tenant, the legacy endpoints are switched off server side, so calls that work today can begin to fail.

- `organization.invitations.deleteLegacy` (`DELETE /member-invitations/{invitation_id}`); use `organization.invitations.delete({ invitations: [...] })`.
- `organization.members.roles.unassignLegacy` (`DELETE /members/{user_id}/roles`); use `organization.members.roles.unassign(user_id, { role_ids })`.

## New in v2 (non-breaking)

- `organization.invitations.roles.list(invitation_id)` lists the roles on a member invitation (`GET /member-invitations/{invitation_id}/roles`).
- `organization.identityProviders.list()` now accepts an optional request object for filtering. Existing no-argument calls continue to work.
- New OAuth scopes `read:my_org:user_stores` and `delete:my_org:organizations`.
- Cross-app access and third-party client access support on identity providers, including the `use_for_third_party_client_access` and `cross_app_access_resource_app` fields and the new `CrossAppAccessResourceApp`, `OrgThirdPartyClientAccessConfig`, and related types.

## Questions

If you run into issues migrating, please open an issue at https://github.com/auth0/myorganization-js/issues.
