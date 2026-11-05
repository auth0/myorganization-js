# Reference

## Organization

<details><summary><code>client.organization.<a href="/src/api/resources/organization/client/Client.ts">delete</a>() -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Permanently delete this Organization.

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
await client.organization.delete();
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

**requestOptions:** `OrganizationClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

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

Retrieve the My Organization API configuration. Returns the `allowed_strategies`, `connection_deletion_behavior`, `organization_deletion_behavior`, and (when enabled) `third_party_client_access` settings. Identifier attributes such as `user_attribute_profile_id` and `connection_profile_id` are not included. Cache this information, as it does not change frequently.

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

## Organization UserStores

<details><summary><code>client.organization.userStores.<a href="/src/api/resources/organization/resources/userStores/client/Client.ts">list</a>({ ...params }) -> MyOrganization.ListUserStoresResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve the user stores for the associated Organization.

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
await client.organization.userStores.list({
    member_access_level: ["none"],
    is_enabled: true,
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

**request:** `MyOrganization.ListOrganizationUserStoresRequestParameters`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `UserStoresClient.RequestOptions`

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
    page = await page.getNextPage();
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

Create a domain for an Auth0 Organization and optionally enable Organization Discovery for members during the user login flow

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

Retrieve the details of an Auth0 Organization domain using its unique domain ID, including the domain name and its current verification status.

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

Delete an Auth0 Organization domain using its unique domain ID, including all associated details and verification status.

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

<details><summary><code>client.organization.domains.<a href="/src/api/resources/organization/resources/domains/client/Client.ts">update</a>(domain_id, { ...params }) -> MyOrganization.UpdateOrganizationDomainResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update an Auth0 Organization domain. Currently only `use_for_organization_discovery` can be updated. The value must be one of the `allowed_values` configured in the Organization Template.

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
await client.organization.domains.update("domain_id", {
    use_for_organization_discovery: true,
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

**domain_id:** `MyOrganization.OrgDomainId`

</dd>
</dl>

<dl>
<dd>

**request:** `MyOrganization.UpdateOrganizationDomainRequestContent`

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

<details><summary><code>client.organization.identityProviders.<a href="/src/api/resources/organization/resources/identityProviders/client/Client.ts">list</a>({ ...params }) -> MyOrganization.ListIdentityProvidersResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve the comprehensive list of identity providers and their respective configurations associated with an Auth0 Organization.

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
await client.organization.identityProviders.list({
    member_access_level: ["none"],
    is_enabled: true,
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

**request:** `MyOrganization.ListOrganizationIdentityProvidersRequestParameters`

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

<details><summary><code>client.organization.identityProviders.<a href="/src/api/resources/organization/resources/identityProviders/client/Client.ts">create</a>({ ...params }) -> MyOrganization.CreateIdentityProviderResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a new enterprise Identity Provider utilizing the specified configuration settings and details for this Auth0 Organization.

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
    include_totals: true,
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
    include_totals: true,
});
while (page.hasNextPage()) {
    page = await page.getNextPage();
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
    include_totals: true,
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
    include_totals: true,
});
while (page.hasNextPage()) {
    page = await page.getNextPage();
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

<details><summary><code>client.organization.invitations.<a href="/src/api/resources/organization/resources/invitations/client/Client.ts">delete</a>({ ...params }) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Revoke a set of member invitations specified by IDs for this Organization.

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
await client.organization.invitations.delete({
    invitations: ["uinv_0000000000000001", "uinv_0000000000000002", "uinv_0000000000000003"],
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

**request:** `MyOrganization.DeleteMemberInvitationsRequestContent`

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

## Organization ClientGrants

<details><summary><code>client.organization.clientGrants.<a href="/src/api/resources/organization/resources/clientGrants/client/Client.ts">create</a>({ ...params }) -> MyOrganization.CreateClientGrantResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a new client grant for this client for this Organization.

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
await client.organization.clientGrants.create({
    client_id: "client_id",
    audience: "audience",
    scope: ["scope"],
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

**request:** `MyOrganization.CreateClientGrantRequestContent`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ClientGrantsClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Organization Clients

<details><summary><code>client.organization.clients.<a href="/src/api/resources/organization/resources/clients/client/Client.ts">list</a>() -> MyOrganization.ListClientsResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a list of all API clients for this Organization. Clients are used to obtain credentials for programmatic API access.

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
await client.organization.clients.list();
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

**requestOptions:** `ClientsClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.clients.<a href="/src/api/resources/organization/resources/clients/client/Client.ts">create</a>({ ...params }) -> MyOrganization.CreateClientResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a new API client for this Organization. The client can be used to obtain access tokens for calling tenant APIs.

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
await client.organization.clients.create({
    name: "name",
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

**request:** `MyOrganization.CreateClientRequestContent`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ClientsClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.clients.<a href="/src/api/resources/organization/resources/clients/client/Client.ts">delete</a>(client_id) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete an API client specified by client ID for this Organization.

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
await client.organization.clients.delete("client_id");
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

**client_id:** `MyOrganization.ClientId` — The ID of the client

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ClientsClient.RequestOptions`

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
    page = await page.getNextPage();
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

## Organization Groups

<details><summary><code>client.organization.groups.<a href="/src/api/resources/organization/resources/groups/client/Client.ts">list</a>({ ...params }) -> core.Page&lt;MyOrganization.Group, MyOrganization.ListGroupsResponseContent&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a list of connection groups for this Organization.

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
const pageableResponse = await client.organization.groups.list({
    from: "from",
    take: 1,
});
for await (const item of pageableResponse) {
    console.log(item);
}

// Or you can manually iterate page-by-page
let page = await client.organization.groups.list({
    from: "from",
    take: 1,
});
while (page.hasNextPage()) {
    page = await page.getNextPage();
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

**request:** `MyOrganization.ListGroupsRequestParameters`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `GroupsClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Organization Configuration Apis

<details><summary><code>client.organization.configuration.apis.<a href="/src/api/resources/organization/resources/configuration/resources/apis/client/Client.ts">get</a>() -> MyOrganization.GetAllowedApisResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve the list of allowed APIs/resource servers for this Organization.

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
await client.organization.configuration.apis.get();
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

**requestOptions:** `ApisClient.RequestOptions`

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

## Organization Configuration IdentityProviderInstructions

<details><summary><code>client.organization.configuration.identityProviderInstructions.<a href="/src/api/resources/organization/resources/configuration/resources/identityProviderInstructions/client/Client.ts">get</a>(strategy, { ...params }) -> MyOrganization.GetIdentityProviderInstructionsResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve the step-by-step instructions a client should render to guide an administrator through creating an identity provider of the given strategy. The response describes an ordered list of pages, each containing an ordered list of content items. Content items are either Markdown prose or a reference to an interactive component the client is responsible for rendering. Instructions do not depend on any existing identity provider, so you should cache this information; it does not change frequently.

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
await client.organization.configuration.identityProviderInstructions.get("adfs", {
    locale: "en",
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

**strategy:** `MyOrganization.IdpStrategyEnum` — The identity provider strategy.

</dd>
</dl>

<dl>
<dd>

**request:** `MyOrganization.GetIdentityProviderInstructionsRequestParameters`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `IdentityProviderInstructionsClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Organization Configuration IdentityProviderProvisioningInstructions

<details><summary><code>client.organization.configuration.identityProviderProvisioningInstructions.<a href="/src/api/resources/organization/resources/configuration/resources/identityProviderProvisioningInstructions/client/Client.ts">get</a>(strategy, { ...params }) -> MyOrganization.GetIdentityProviderProvisioningInstructionsResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve the step-by-step instructions a client should render to guide an administrator through setting up user provisioning for an identity provider of the given strategy. The response describes an ordered list of pages, each containing an ordered list of content items. Content items are either Markdown prose or a reference to an interactive component the client is responsible for rendering; components such as the SCIM endpoint URL and the bearer token are named rather than inlined, because the instructions themselves carry no organization-specific data. Instructions do not depend on any existing identity provider, so you should cache this information; it does not change frequently.

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
await client.organization.configuration.identityProviderProvisioningInstructions.get("adfs", {
    locale: "en",
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

**strategy:** `MyOrganization.IdpStrategyEnum` — The identity provider strategy.

</dd>
</dl>

<dl>
<dd>

**request:** `MyOrganization.GetIdentityProviderProvisioningInstructionsRequestParameters`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `IdentityProviderProvisioningInstructionsClient.RequestOptions`

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

<details><summary><code>client.organization.domains.identityProviders.<a href="/src/api/resources/organization/resources/domains/resources/identityProviders/client/Client.ts">list</a>(domain_id) -> MyOrganization.ListDomainIdentityProvidersResponseContent</code></summary>
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
await client.organization.domains.identityProviders.list("domain_id");
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

## Organization Groups Roles

<details><summary><code>client.organization.groups.roles.<a href="/src/api/resources/organization/resources/groups/resources/roles/client/Client.ts">list</a>(group_id, { ...params }) -> core.Page&lt;MyOrganization.Role, MyOrganization.GetOrganizationMemberRolesResponseContent&gt;</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a list of roles assigned to a group specified by ID for this Organization.

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
const pageableResponse = await client.organization.groups.roles.list("group_id", {
    from: "from",
    take: 1,
});
for await (const item of pageableResponse) {
    console.log(item);
}

// Or you can manually iterate page-by-page
let page = await client.organization.groups.roles.list("group_id", {
    from: "from",
    take: 1,
});
while (page.hasNextPage()) {
    page = await page.getNextPage();
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

**group_id:** `string` — The ID of the group.

</dd>
</dl>

<dl>
<dd>

**request:** `MyOrganization.ListGroupRolesRequestParameters`

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

<details><summary><code>client.organization.groups.roles.<a href="/src/api/resources/organization/resources/groups/resources/roles/client/Client.ts">assign</a>(group_id, { ...params }) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Assign roles to a group specified by ID for this Organization.

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
await client.organization.groups.roles.assign("group_id", {
    role_ids: ["role_ids"],
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

**group_id:** `string` — The ID of the group.

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

<details><summary><code>client.organization.groups.roles.<a href="/src/api/resources/organization/resources/groups/resources/roles/client/Client.ts">unassign</a>(group_id, { ...params }) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Remove roles from a group specified by ID for this Organization.

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
await client.organization.groups.roles.unassign("group_id", {
    role_ids: ["role_ids"],
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

**group_id:** `string` — The ID of the group.

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

## Organization IdentityProviders DirectoryProvisioning

<details><summary><code>client.organization.identityProviders.directoryProvisioning.<a href="/src/api/resources/organization/resources/identityProviders/resources/directoryProvisioning/client/Client.ts">get</a>(idp_id) -> MyOrganization.DirectoryProvisioningConfig</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve the Directory Provisioning Configuration for an Identity Provider specified by ID for this Organization.

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
await client.organization.identityProviders.directoryProvisioning.get("idp_id");
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

**requestOptions:** `DirectoryProvisioningClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.identityProviders.directoryProvisioning.<a href="/src/api/resources/organization/resources/identityProviders/resources/directoryProvisioning/client/Client.ts">create</a>(idp_id, { ...params }) -> MyOrganization.CreateDirectoryProvisioningResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Start the Google Workspace directory provisioning consent flow for an Identity Provider specified by ID for this Organization. Returns a `provisioning_ticket_url` — an Auth0-hosted ticket URL that the Organization administrator opens in a new tab, which redirects to the Google admin-consent screen to grant access. The directory synchronization configuration is not created at this point — it is created only once consent completes, which is detected by polling `POST /identity-providers/{idp_id}/directory-provisioning/verify`. Calling this endpoint again while a flow is in progress returns the existing ticket URL rather than starting a new one.

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
await client.organization.identityProviders.directoryProvisioning.create("idp_id", {
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

**requestOptions:** `DirectoryProvisioningClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.identityProviders.directoryProvisioning.<a href="/src/api/resources/organization/resources/identityProviders/resources/directoryProvisioning/client/Client.ts">delete</a>(idp_id) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete the Directory Provisioning Configuration for an Identity Provider specified by ID for this Organization. Succeeds with 204 even if no Directory Provisioning Configuration exists.

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
await client.organization.identityProviders.directoryProvisioning.delete("idp_id");
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

**requestOptions:** `DirectoryProvisioningClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.identityProviders.directoryProvisioning.<a href="/src/api/resources/organization/resources/identityProviders/resources/directoryProvisioning/client/Client.ts">update</a>(idp_id, { ...params }) -> MyOrganization.DirectoryProvisioningConfig</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update the Directory Provisioning Configuration for an Identity Provider specified by ID for this Organization.

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
await client.organization.identityProviders.directoryProvisioning.update("idp_id", {
    synchronize_automatically: true,
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

**request:** `MyOrganization.UpdateDirectoryProvisioningRequestContent`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `DirectoryProvisioningClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.identityProviders.directoryProvisioning.<a href="/src/api/resources/organization/resources/identityProviders/resources/directoryProvisioning/client/Client.ts">verify</a>(idp_id, { ...params }) -> MyOrganization.VerifyDirectoryProvisioningResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Poll the status of the Google Workspace directory provisioning consent flow for an Identity Provider specified by ID for this Organization, at a minimum interval of 5000 ms. Returns `waiting` until the administrator completes consent, then `complete` once the directory synchronization configuration exists (with automatic synchronization initially disabled).

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
await client.organization.identityProviders.directoryProvisioning.verify("idp_id", {
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

**requestOptions:** `DirectoryProvisioningClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Organization IdentityProviders Tests

<details><summary><code>client.organization.identityProviders.tests.<a href="/src/api/resources/organization/resources/identityProviders/resources/tests/client/Client.ts">create</a>(idp_id, { ...params }) -> MyOrganization.CreateIdpTestResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Start a test of an Identity Provider specified by ID for this Organization. The test is created with status `in_progress`. Open the returned `test_url` to sign in with the Identity Provider; once sign-in completes, the status changes to `success` or `error`. If sign-in is not completed, the test remains `in_progress` until it expires. Retrieve the result by polling `GET /identity-providers/{idp_id}/tests/{test_id}`. Tests expire at `expires_at` and are then no longer available. Each call starts a new test; to retry a test (for example, if the URL expired or the tab was blocked), call this endpoint again. Only one test is kept per Identity Provider in the Organization: starting a test replaces the previous one, whose `id` and `test_url` stop working.

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
await client.organization.identityProviders.tests.create("idp_id", {
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

**requestOptions:** `TestsClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.identityProviders.tests.<a href="/src/api/resources/organization/resources/identityProviders/resources/tests/client/Client.ts">get</a>(idp_id, test_id) -> MyOrganization.GetIdpTestResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve an Identity Provider test specified by ID, as returned by `POST /identity-providers/{idp_id}/tests`. Clients should poll at an interval of approximately 5000 ms until a terminal status (`success` or `error`) is returned. Tests expire at `expires_at`; once a test expires, or is replaced because a newer test was started for the same Identity Provider, this endpoint returns `404`.

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
await client.organization.identityProviders.tests.get("idp_id", "test_id");
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

**test_id:** `MyOrganization.IdpTestId`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `TestsClient.RequestOptions`

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

## Organization Invitations Roles

<details><summary><code>client.organization.invitations.roles.<a href="/src/api/resources/organization/resources/invitations/resources/roles/client/Client.ts">list</a>(invitation_id) -> MyOrganization.GetMemberInvitationRolesResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve the roles assigned to a member invitation specified by ID for this Organization.

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
await client.organization.invitations.roles.list("invitation_id");
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

**requestOptions:** `RolesClient.RequestOptions`

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
    page = await page.getNextPage();
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
