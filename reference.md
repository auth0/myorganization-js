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

Retrieve details for an Organization.

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

**requestOptions:** `OrganizationDetails.RequestOptions`

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

Update the details of a specific Organization, such as display name and branding options.

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
        logo_url: "http://example.com/logo.png",
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

**requestOptions:** `OrganizationDetails.RequestOptions`

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

Retrieve the configuration for the /my-org API. This will return all stored client information with the exception of attributes that are identifiers. Identifier attributes will be given their own endpoint that will return the full object. This will give the components all of the information they will need to be successful. The SDK provider for the components should manage fetching and caching this information for all components.

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

**requestOptions:** `Configuration.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Organization Domains

<details><summary><code>client.organization.domains.<a href="/src/api/resources/organization/resources/domains/client/Client.ts">list</a>() -> MyOrganization.ListOrganizationDomainsResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists all domains pending and verified for an organization.

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
await client.organization.domains.list();
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

**requestOptions:** `Domains.RequestOptions`

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

Create a new domain for an organization.

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

**requestOptions:** `Domains.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.domains.<a href="/src/api/resources/organization/resources/domains/client/Client.ts">get</a>(domainId) -> MyOrganization.GetOrganizationDomainResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a domain for an organization.

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

**domainId:** `MyOrganization.OrgDomainId`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Domains.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.domains.<a href="/src/api/resources/organization/resources/domains/client/Client.ts">delete</a>(domainId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Remove a domain from this organization.

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

**domainId:** `MyOrganization.OrgDomainId`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Domains.RequestOptions`

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

List the identity providers associated with this organization.

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

**requestOptions:** `IdentityProviders.RequestOptions`

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

Create an identity provider associated with this organization.

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

**requestOptions:** `IdentityProviders.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.identityProviders.<a href="/src/api/resources/organization/resources/identityProviders/client/Client.ts">get</a>(idpId) -> MyOrganization.GetIdentityProviderResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve the details for one particular identity-provider.

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

**idpId:** `MyOrganization.IdpId`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `IdentityProviders.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.identityProviders.<a href="/src/api/resources/organization/resources/identityProviders/client/Client.ts">delete</a>(idpId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete an identity provider from this organization.

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

**idpId:** `MyOrganization.IdpId`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `IdentityProviders.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.identityProviders.<a href="/src/api/resources/organization/resources/identityProviders/client/Client.ts">update</a>(idpId, { ...params }) -> MyOrganization.UpdateIdentityProviderResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update an identity provider associated with this organization.

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

**idpId:** `MyOrganization.IdpId`

</dd>
</dl>

<dl>
<dd>

**request:** `MyOrganization.UpdateIdentityProviderRequestContent`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `IdentityProviders.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.identityProviders.<a href="/src/api/resources/organization/resources/identityProviders/client/Client.ts">detach</a>(idpId) -> MyOrganization.DetachIdpProviderResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete underlying identity provider from this organization.

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

**idpId:** `MyOrganization.IdpId`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `IdentityProviders.RequestOptions`

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

Retrieve the connection profile for the application. This will give the components all of the information they will need to be successful. The SDK provider for the components should manage fetching and caching this information for all components.

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

**requestOptions:** `IdentityProviders.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Organization Domains Verify

<details><summary><code>client.organization.domains.verify.<a href="/src/api/resources/organization/resources/domains/resources/verify/client/Client.ts">create</a>(domainId) -> MyOrganization.StartOrganizationDomainVerificationResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a verification text and start the domain verification process for a particular domain.

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

**domainId:** `MyOrganization.OrgDomainId`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Verify.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Organization Domains IdentityProviders

<details><summary><code>client.organization.domains.identityProviders.<a href="/src/api/resources/organization/resources/domains/resources/identityProviders/client/Client.ts">get</a>(domainId) -> MyOrganization.ListDomainIdentityProvidersResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve the list of identity providers that have a specific organization domain alias.

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

**domainId:** `MyOrganization.OrgDomainId`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `IdentityProviders.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Organization IdentityProviders Domains

<details><summary><code>client.organization.identityProviders.domains.<a href="/src/api/resources/organization/resources/identityProviders/resources/domains/client/Client.ts">create</a>(idpId, { ...params }) -> MyOrganization.CreateIdpDomainResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Add a domain to the identity provider's list of domains for [Home Realm Discovery (HRD)](https://auth0.com/docs/get-started/architecture-scenarios/business-to-business/authentication#home-realm-discovery). The domain passed must be claimed and verified by this organization.

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

**idpId:** `MyOrganization.IdpId`

</dd>
</dl>

<dl>
<dd>

**request:** `MyOrganization.CreateIdpDomainRequestContent`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Domains.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.identityProviders.domains.<a href="/src/api/resources/organization/resources/identityProviders/resources/domains/client/Client.ts">delete</a>(idpId, domain) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Remove a domain from an identity provider.

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

**idpId:** `MyOrganization.IdpId`

</dd>
</dl>

<dl>
<dd>

**domain:** `MyOrganization.OrgDomainName`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Domains.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Organization IdentityProviders Provisioning

<details><summary><code>client.organization.identityProviders.provisioning.<a href="/src/api/resources/organization/resources/identityProviders/resources/provisioning/client/Client.ts">get</a>(idpId) -> MyOrganization.GetIdPProvisioningConfigResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve the Provisioning configuration for this identity provider.

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

**idpId:** `MyOrganization.IdpId`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Provisioning.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.identityProviders.provisioning.<a href="/src/api/resources/organization/resources/identityProviders/resources/provisioning/client/Client.ts">create</a>(idpId) -> MyOrganization.CreateIdPProvisioningConfigResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create the Provisioning configuration for this identity provider.

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

**idpId:** `MyOrganization.IdpId`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Provisioning.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.identityProviders.provisioning.<a href="/src/api/resources/organization/resources/identityProviders/resources/provisioning/client/Client.ts">delete</a>(idpId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete the Provisioning configuration for an identity provider.

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

**idpId:** `MyOrganization.IdpId`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Provisioning.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Organization IdentityProviders Provisioning ScimTokens

<details><summary><code>client.organization.identityProviders.provisioning.scimTokens.<a href="/src/api/resources/organization/resources/identityProviders/resources/provisioning/resources/scimTokens/client/Client.ts">list</a>(idpId) -> MyOrganization.ListIdpProvisioningScimTokensResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List the Provisioning SCIM tokens for this identity provider.

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

**idpId:** `MyOrganization.IdpId`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ScimTokens.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.identityProviders.provisioning.scimTokens.<a href="/src/api/resources/organization/resources/identityProviders/resources/provisioning/resources/scimTokens/client/Client.ts">create</a>(idpId, { ...params }) -> MyOrganization.CreateIdpProvisioningScimTokenResponseContent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a Provisioning SCIM token for this identity provider.

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

**idpId:** `MyOrganization.IdpId`

</dd>
</dl>

<dl>
<dd>

**request:** `MyOrganization.CreateIdpProvisioningScimTokenRequestContent`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ScimTokens.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.organization.identityProviders.provisioning.scimTokens.<a href="/src/api/resources/organization/resources/identityProviders/resources/provisioning/resources/scimTokens/client/Client.ts">delete</a>(idpId, idpScimTokenId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete a Provisioning SCIM configuration for an identity provider.

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

**idpId:** `MyOrganization.IdpId`

</dd>
</dl>

<dl>
<dd>

**idpScimTokenId:** `MyOrganization.IdpProvisioningScimTokenId`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ScimTokens.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>
