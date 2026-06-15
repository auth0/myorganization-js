# Reference

## OrganizationDetails

<details><summary><code>client.organizationDetails.<a href="/src/api/resources/organizationDetails/client/Client.ts">get</a>() -> MyOrganization.GetOrganizationDetailsResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve details for this Organization, including display name and branding options. To learn more about Auth0 Organizations, read [Organizations](https://auth0.com/docs/manage-users/organizations).

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.organizationDetails.get();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `OrganizationDetailsClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organizationDetails.<a href="/src/api/resources/organizationDetails/client/Client.ts">update</a>({ ...params }) -> MyOrganization.UpdateOrganizationDetailsResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update details for this Organization, such as display name and branding options. To learn more about Auth0 Organizations, read [Organizations](https://auth0.com/docs/manage-users/organizations).

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.organizationDetails.update({
    name: "testorg",
    display_name: "Test Organization",
    branding: {
        logo_url: "https://example.com/logo.png",
        colors: {
            primary: "#000000",
            page_background: "#FFFFFF",
        },
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `MyOrganization.UpdateOrganizationDetailsRequestContent`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `OrganizationDetailsClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Organization Configuration

<details><summary><code>client.organization.configuration.<a href="/src/api/resources/organization/resources/configuration/client/Client.ts">get</a>() -> MyOrganization.GetConfigurationResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve the My Organization API configuration. Returns only the `connection_deletion_behavior` and `allowed_strategies`. Identifier attributes such as `user_attribute_profile_id` and `connection_profile_id` are not included. Cache this information, as it does not change frequently.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.organization.configuration.get();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `ConfigurationClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Organization Domains

<details><summary><code>client.organization.domains.<a href="/src/api/resources/organization/resources/domains/client/Client.ts">list</a>({ ...params }) -> core.Page&lt;MyOrganization.OrgDomain, MyOrganization.ListOrganizationDomainsResponseContent&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a list of all pending and verified domains for this Organization.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const pageableResponse = await client.organization.domains.list({
    from: "from",
    take: 1,
});
for await (const item of pageableResponse) {
    console.log(item);
}

// Or you can manually iterate page-by-page
let page = await client.organization.domains.list({
    from: "from",
    take: 1,
});
while (page.hasNextPage()) {
    page = page.getNextPage();
}

// You can also access the underlying response
const response = page.response;
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `MyOrganization.ListOrganizationDomainsRequestParameters`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `DomainsClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.domains.<a href="/src/api/resources/organization/resources/domains/client/Client.ts">create</a>({ ...params }) -> MyOrganization.CreateOrganizationDomainResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a new domain for this Organization.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.organization.domains.create({
    domain: "acme.com",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `MyOrganization.CreateOrganizationDomainRequestContent`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `DomainsClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.domains.<a href="/src/api/resources/organization/resources/domains/client/Client.ts">get</a>(domain_id) -> MyOrganization.GetOrganizationDomainResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve details of a domain specified by ID for this Organization.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.organization.domains.get("domain_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**domain_id:** `MyOrganization.OrgDomainId`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `DomainsClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.domains.<a href="/src/api/resources/organization/resources/domains/client/Client.ts">delete</a>(domain_id) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Remove a domain specified by ID from this Organization.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.organization.domains.delete("domain_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**domain_id:** `MyOrganization.OrgDomainId`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `DomainsClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Organization IdentityProviders

<details><summary><code>client.organization.identityProviders.<a href="/src/api/resources/organization/resources/identityProviders/client/Client.ts">list</a>() -> MyOrganization.ListIdentityProvidersResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a list of all Identity Providers for this Organization.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.organization.identityProviders.list();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `IdentityProvidersClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.identityProviders.<a href="/src/api/resources/organization/resources/identityProviders/client/Client.ts">create</a>({ ...params }) -> MyOrganization.CreateIdentityProviderResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a new Identity Provider for this Organization.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.organization.identityProviders.create({
    name: "oidcIdp",
    strategy: "oidc",
    domains: ["mydomain.com"],
    display_name: "OIDC IdP",
    show_as_button: true,
    assign_membership_on_login: false,
    is_enabled: true,
    options: {
        type: "front_channel",
        client_id: "a8f3b2e7-5d1c-4f9a-8b0d-2e1c3a5b6f7d",
        client_secret: "KzQp2sVxR8nTgMjFhYcEWuLoIbDvUoC6A9B1zX7yWqFjHkGrP5sQdLmNp",
        discovery_url: "https://{yourDomain}/.well-known/openid-configuration",
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `MyOrganization.CreateIdentityProviderRequestContent`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `IdentityProvidersClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.identityProviders.<a href="/src/api/resources/organization/resources/identityProviders/client/Client.ts">get</a>(idp_id) -> MyOrganization.GetIdentityProviderResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve details of an Identity Provider specified by ID for this Organization.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.organization.identityProviders.get("idp_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**idp_id:** `MyOrganization.IdpId`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `IdentityProvidersClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.identityProviders.<a href="/src/api/resources/organization/resources/identityProviders/client/Client.ts">delete</a>(idp_id) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete an Identity Provider specified by ID from this Organization. This will remove the association and delete the underlying Identity Provider. Members will no longer be able to authenticate using this Identity Provider.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.organization.identityProviders.delete("idp_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**idp_id:** `MyOrganization.IdpId`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `IdentityProvidersClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.identityProviders.<a href="/src/api/resources/organization/resources/identityProviders/client/Client.ts">update</a>(idp_id, { ...params }) -> MyOrganization.UpdateIdentityProviderResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update the details of an Identity Provider specified by ID for this Organization.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.organization.identityProviders.update("idp_id", {
    display_name: "OIDC IdP",
    show_as_button: true,
    assign_membership_on_login: false,
    is_enabled: true,
    options: {
        type: "front_channel",
        client_id: "a8f3b2e7-5d1c-4f9a-8b0d-2e1c3a5b6f7d",
        client_secret: "KzQp2sVxR8nTgMjFhYcEWuLoIbDvUoC6A9B1zX7yWqFjHkGrP5sQdLmNp",
        discovery_url: "https://{yourDomain}/.well-known/openid-configuration",
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**idp_id:** `MyOrganization.IdpId`

</dd>
</dl>

<dl>
<dd>

**request:** `MyOrganization.UpdateIdentityProviderRequestContent`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `IdentityProvidersClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.identityProviders.<a href="/src/api/resources/organization/resources/identityProviders/client/Client.ts">updateAttributes</a>(idp_id, { ...params }) -> MyOrganization.GetIdentityProviderResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Refresh the attribute mapping for an Identity Provider specified by ID for this Organization. Mappings are reset to the admin-defined defaults.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.organization.identityProviders.updateAttributes("idp_id", {
    key: "value",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**idp_id:** `MyOrganization.IdpId`

</dd>
</dl>

<dl>
<dd>

**request:** `Record<string, unknown>`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `IdentityProvidersClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.identityProviders.<a href="/src/api/resources/organization/resources/identityProviders/client/Client.ts">detach</a>(idp_id) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Remove an Identity Provider specified by ID from this Organization. This only removes the association; the underlying Identity Provider is not deleted. Members will no longer be able to authenticate using this Identity Provider.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.organization.identityProviders.detach("idp_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**idp_id:** `MyOrganization.IdpId`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `IdentityProvidersClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Organization Members

<details><summary><code>client.organization.members.<a href="/src/api/resources/organization/resources/members/client/Client.ts">list</a>({ ...params }) -> core.Page&lt;MyOrganization.OrgMember, MyOrganization.ListOrganizationMembersResponseContent&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a list of all members for this Organization. The `roles` field is only included for each member when the token also carries the `read:my_org:member_roles` scope; without that scope the `roles` field is omitted from the response.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const pageableResponse = await client.organization.members.list({
    fields: "fields",
    include_fields: true,
    from: "from",
    take: 1,
});
for await (const item of pageableResponse) {
    console.log(item);
}

// Or you can manually iterate page-by-page
let page = await client.organization.members.list({
    fields: "fields",
    include_fields: true,
    from: "from",
    take: 1,
});
while (page.hasNextPage()) {
    page = page.getNextPage();
}

// You can also access the underlying response
const response = page.response;
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `MyOrganization.ListOrganizationMembersRequestParameters`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `MembersClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.members.<a href="/src/api/resources/organization/resources/members/client/Client.ts">get</a>(user_id, { ...params }) -> MyOrganization.GetOrganizationMemberResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve details of a member specified by user ID for this Organization.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.organization.members.get("user_id", {
    fields: "fields",
    include_fields: true,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**user_id:** `MyOrganization.OrgMemberId`

</dd>
</dl>

<dl>
<dd>

**request:** `MyOrganization.GetOrganizationMemberRequestParameters`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `MembersClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Organization Memberships

<details><summary><code>client.organization.memberships.<a href="/src/api/resources/organization/resources/memberships/client/Client.ts">deleteMemberships</a>({ ...params }) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Remove one member from this Organization. The underlying user account is not deleted.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.organization.memberships.deleteMemberships({
    members: ["auth0|1234567890"],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `MyOrganization.DeleteOrganizationMembershipsRequestParameters`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `MembershipsClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Organization Invitations

<details><summary><code>client.organization.invitations.<a href="/src/api/resources/organization/resources/invitations/client/Client.ts">list</a>({ ...params }) -> core.Page&lt;MyOrganization.MemberInvitation, MyOrganization.ListMembersInvitationsResponseContent&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a list of all member invitations for this Organization.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const pageableResponse = await client.organization.invitations.list({
    fields: "fields",
    include_fields: true,
    from: "from",
    take: 1,
    sort: "sort",
});
for await (const item of pageableResponse) {
    console.log(item);
}

// Or you can manually iterate page-by-page
let page = await client.organization.invitations.list({
    fields: "fields",
    include_fields: true,
    from: "from",
    take: 1,
    sort: "sort",
});
while (page.hasNextPage()) {
    page = page.getNextPage();
}

// You can also access the underlying response
const response = page.response;
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `MyOrganization.ListMemberInvitationsRequestParameters`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `InvitationsClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.invitations.<a href="/src/api/resources/organization/resources/invitations/client/Client.ts">create</a>({ ...params }) -> MyOrganization.CreateMemberInvitationResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create one or more member invitations for this Organization. If an active invitation already exists for a user, generating a new invitation will automatically revoke any outstanding invitations for that user. Roles specified in the payload will be granted to the user upon acceptance of the invitation.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.organization.invitations.create({
    invitees: [
        {
            email: "user@example.com",
            roles: ["rol_0000000000000001"],
        },
    ],
    inviter: {
        name: "Allison the Admin",
    },
    identity_provider_id: "con_2CZPv6IY0gWzDaQJ",
    ttl_sec: 3600,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `MyOrganization.CreateMemberInvitationRequestContent`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `InvitationsClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.invitations.<a href="/src/api/resources/organization/resources/invitations/client/Client.ts">get</a>(invitation_id, { ...params }) -> MyOrganization.GetMemberInvitationResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve details of a member invitation specified by ID for this Organization.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.organization.invitations.get("invitation_id", {
    fields: "fields",
    include_fields: true,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**invitation_id:** `MyOrganization.InvitationId`

</dd>
</dl>

<dl>
<dd>

**request:** `MyOrganization.GetMemberInvitationRequestParameters`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `InvitationsClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.invitations.<a href="/src/api/resources/organization/resources/invitations/client/Client.ts">delete</a>(invitation_id) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Revoke a member invitation specified by ID for this Organization.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.organization.invitations.delete("invitation_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**invitation_id:** `MyOrganization.InvitationId`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `InvitationsClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Organization Roles

<details><summary><code>client.organization.roles.<a href="/src/api/resources/organization/resources/roles/client/Client.ts">list</a>({ ...params }) -> core.Page&lt;MyOrganization.Role, MyOrganization.ListRolesResponseContent&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve the list of roles available for binding to members and invitations for this Organization. Only roles made visible to this Organization by the Tenant Admin are returned.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const pageableResponse = await client.organization.roles.list({
    from: "from",
    take: 1,
    name: "name",
});
for await (const item of pageableResponse) {
    console.log(item);
}

// Or you can manually iterate page-by-page
let page = await client.organization.roles.list({
    from: "from",
    take: 1,
    name: "name",
});
while (page.hasNextPage()) {
    page = page.getNextPage();
}

// You can also access the underlying response
const response = page.response;
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `MyOrganization.ListRolesRequestParameters`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RolesClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Organization Configuration IdentityProviders

<details><summary><code>client.organization.configuration.identityProviders.<a href="/src/api/resources/organization/resources/configuration/resources/identityProviders/client/Client.ts">get</a>() -> MyOrganization.GetIdpConfigurationResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve the [Connection Profile](https://auth0.com/docs/authenticate/enterprise-connections/connection-profile) for this application. You should cache this information as it does not change frequently.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.organization.configuration.identityProviders.get();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `IdentityProvidersClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Organization Domains Verify

<details><summary><code>client.organization.domains.verify.<a href="/src/api/resources/organization/resources/domains/resources/verify/client/Client.ts">create</a>(domain_id) -> MyOrganization.StartOrganizationDomainVerificationResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Initiate the verification process for a domain specified by ID for this Organization.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.organization.domains.verify.create("domain_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**domain_id:** `MyOrganization.OrgDomainId`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `VerifyClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Organization Domains IdentityProviders

<details><summary><code>client.organization.domains.identityProviders.<a href="/src/api/resources/organization/resources/domains/resources/identityProviders/client/Client.ts">get</a>(domain_id) -> MyOrganization.ListDomainIdentityProvidersResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve the list of Identity Providers associated with a domain specified by ID for this Organization.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.organization.domains.identityProviders.get("domain_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**domain_id:** `MyOrganization.OrgDomainId`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `IdentityProvidersClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Organization IdentityProviders Domains

<details><summary><code>client.organization.identityProviders.domains.<a href="/src/api/resources/organization/resources/identityProviders/resources/domains/client/Client.ts">create</a>(idp_id, { ...params }) -> MyOrganization.CreateIdpDomainResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Associate a domain with an Identity Provider specified by ID for this Organization. The domain must be claimed and verified.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.organization.identityProviders.domains.create("idp_id", {
    domain: "my-domain.com",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**idp_id:** `MyOrganization.IdpId`

</dd>
</dl>

<dl>
<dd>

**request:** `MyOrganization.CreateIdpDomainRequestContent`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `DomainsClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.identityProviders.domains.<a href="/src/api/resources/organization/resources/identityProviders/resources/domains/client/Client.ts">delete</a>(idp_id, domain) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Remove a domain specified by name from an Identity Provider specified by ID for this Organization.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.organization.identityProviders.domains.delete("idp_id", "domain");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**idp_id:** `MyOrganization.IdpId`

</dd>
</dl>

<dl>
<dd>

**domain:** `MyOrganization.OrgDomainName`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `DomainsClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Organization IdentityProviders Provisioning

<details><summary><code>client.organization.identityProviders.provisioning.<a href="/src/api/resources/organization/resources/identityProviders/resources/provisioning/client/Client.ts">get</a>(idp_id) -> MyOrganization.GetIdPProvisioningConfigResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve the Provisioning Configuration for an Identity Provider specified by ID for this Organization.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.organization.identityProviders.provisioning.get("idp_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**idp_id:** `MyOrganization.IdpId`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ProvisioningClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.identityProviders.provisioning.<a href="/src/api/resources/organization/resources/identityProviders/resources/provisioning/client/Client.ts">create</a>(idp_id) -> MyOrganization.CreateIdPProvisioningConfigResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a new Provisioning Configuration for an Identity Provider specified by ID for this Organization.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.organization.identityProviders.provisioning.create("idp_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**idp_id:** `MyOrganization.IdpId`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ProvisioningClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.identityProviders.provisioning.<a href="/src/api/resources/organization/resources/identityProviders/resources/provisioning/client/Client.ts">delete</a>(idp_id) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete the Provisioning Configuration for an Identity Provider specified by ID for this Organization.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.organization.identityProviders.provisioning.delete("idp_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**idp_id:** `MyOrganization.IdpId`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ProvisioningClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.identityProviders.provisioning.<a href="/src/api/resources/organization/resources/identityProviders/resources/provisioning/client/Client.ts">updateAttributes</a>(idp_id, { ...params }) -> MyOrganization.GetIdPProvisioningConfigResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Refresh the attribute mapping for the Provisioning Configuration of an Identity Provider specified by ID for this Organization. Mappings are reset to the admin-defined defaults.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.organization.identityProviders.provisioning.updateAttributes("idp_id", {
    key: "value",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**idp_id:** `MyOrganization.IdpId`

</dd>
</dl>

<dl>
<dd>

**request:** `Record<string, unknown>`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ProvisioningClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Organization IdentityProviders Provisioning ScimTokens

<details><summary><code>client.organization.identityProviders.provisioning.scimTokens.<a href="/src/api/resources/organization/resources/identityProviders/resources/provisioning/resources/scimTokens/client/Client.ts">list</a>(idp_id) -> MyOrganization.ListIdpProvisioningScimTokensResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a list of [SCIM tokens](https://auth0.com/docs/authenticate/protocols/scim/configure-inbound-scim#scim-endpoints-and-tokens) for the Provisioning Configuration of an Identity Provider specified by ID for this Organization.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.organization.identityProviders.provisioning.scimTokens.list("idp_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**idp_id:** `MyOrganization.IdpId`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ScimTokensClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.identityProviders.provisioning.scimTokens.<a href="/src/api/resources/organization/resources/identityProviders/resources/provisioning/resources/scimTokens/client/Client.ts">create</a>(idp_id, { ...params }) -> MyOrganization.CreateIdpProvisioningScimTokenResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a new SCIM token for the Provisioning Configuration of an Identity Provider specified by ID for this Organization.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.organization.identityProviders.provisioning.scimTokens.create("idp_id", {
    token_lifetime: 86400,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**idp_id:** `MyOrganization.IdpId`

</dd>
</dl>

<dl>
<dd>

**request:** `MyOrganization.CreateIdpProvisioningScimTokenRequestContent`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ScimTokensClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.identityProviders.provisioning.scimTokens.<a href="/src/api/resources/organization/resources/identityProviders/resources/provisioning/resources/scimTokens/client/Client.ts">delete</a>(idp_id, idp_scim_token_id) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Revoke a SCIM token specified by token ID for the Provisioning Configuration of an Identity Provider specified by ID for this Organization.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.organization.identityProviders.provisioning.scimTokens.delete("idp_id", "idp_scim_token_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**idp_id:** `MyOrganization.IdpId`

</dd>
</dl>

<dl>
<dd>

**idp_scim_token_id:** `MyOrganization.IdpProvisioningScimTokenId`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ScimTokensClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Organization Members Roles

<details><summary><code>client.organization.members.roles.<a href="/src/api/resources/organization/resources/members/resources/roles/client/Client.ts">list</a>(user_id, { ...params }) -> core.Page&lt;MyOrganization.Role, MyOrganization.GetOrganizationMemberRolesResponseContent&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a list of roles assigned to a member specified by ID for this Organization.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const pageableResponse = await client.organization.members.roles.list("user_id", {
    from: "from",
    take: 1,
});
for await (const item of pageableResponse) {
    console.log(item);
}

// Or you can manually iterate page-by-page
let page = await client.organization.members.roles.list("user_id", {
    from: "from",
    take: 1,
});
while (page.hasNextPage()) {
    page = page.getNextPage();
}

// You can also access the underlying response
const response = page.response;
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**user_id:** `MyOrganization.OrgMemberId`

</dd>
</dl>

<dl>
<dd>

**request:** `MyOrganization.ListOrgMemberRolesRequestParameters`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RolesClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.members.roles.<a href="/src/api/resources/organization/resources/members/resources/roles/client/Client.ts">assign</a>(user_id, { ...params }) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Assign roles to a member specified by ID for this Organization.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.organization.members.roles.assign("user_id", {
    role_ids: ["rol_SO2j0sFo9NFa3F9w"],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**user_id:** `MyOrganization.OrgMemberId`

</dd>
</dl>

<dl>
<dd>

**request:** `MyOrganization.OrganizationMemberRolesChangeRequestContent`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RolesClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.members.roles.<a href="/src/api/resources/organization/resources/members/resources/roles/client/Client.ts">unassign</a>(user_id, { ...params }) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Remove roles from a member specified by ID for this Organization.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.organization.members.roles.unassign("user_id", {
    role_ids: ["rol_SO2j0sFo9NFa3F9w"],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**user_id:** `MyOrganization.OrgMemberId`

</dd>
</dl>

<dl>
<dd>

**request:** `MyOrganization.OrganizationMemberRolesChangeRequestContent`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `RolesClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>
