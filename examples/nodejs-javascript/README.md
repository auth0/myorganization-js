# MyOrganization SDK - Node.js JavaScript Example

Vanilla JavaScript examples for Auth0 MyOrganization SDK in Node.js (no TypeScript).

## Features

- ✅ Pure JavaScript (no TypeScript required)
- ✅ Simple automation scripts
- ✅ All authentication methods
- ✅ Complete error handling
- ✅ Easy to understand and modify

## Prerequisites

- Node.js 20+
- An Auth0 tenant with the MyOrganization API enabled
- A Machine-to-Machine (M2M) application in Auth0

## Auth0 Setup

### 1. Enable the MyOrganization API

1. Go to **Auth0 Dashboard → Applications → APIs**
2. Find **Auth0 My Organization API** and confirm it is enabled

### 2. Create an M2M Application

1. Go to **Applications → Applications → Create Application**
2. Select **Machine to Machine Applications**
3. Authorize it for the **Auth0 My Organization API**
4. Grant the following scopes:

```
read:my_org:details
update:my_org:details
read:my_org:organization_domains
create:my_org:organization_domains
update:my_org:organization_domains
delete:my_org:organization_domains
read:my_org:identity_providers
create:my_org:identity_providers
update:my_org:identity_providers
delete:my_org:identity_providers
```

### 3. Note Your Credentials

From the M2M application's **Settings** tab, copy:

- **Domain** — your Auth0 tenant domain (e.g. `your-tenant.auth0.com`)
- **Client ID**
- **Client Secret** (or configure a private key for private key JWT)

### 4. Get Your Organization ID

1. Go to **Auth0 Dashboard → Organizations**
2. Select your organization
3. Copy the **Organization ID** (starts with `org_`)

## Installation

```bash
npm install
```

## Configuration

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```bash
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret   # or use AUTH0_PRIVATE_KEY
AUTH0_ORGANIZATION=org_123456789
```

## Usage

**Run the example:**

```bash
npm start
```

## Example Patterns

### Client Initialization

```javascript
import { createMyOrganizationClientWithClientCredentials } from "@auth0/myorganization-js/server";

const client = createMyOrganizationClientWithClientCredentials(
    { domain: "tenant.auth0.com" },
    {
        clientId: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        organization: process.env.AUTH0_ORGANIZATION,
    },
);
```

### Getting Organization Details

```javascript
const details = await client.organizationDetails.get();
console.log("Organization:", details.name);
```

### Creating a Domain

```javascript
const result = await client.organization.domains.create({
    domain: "example.com",
});
console.log("Domain created:", result.id);
```

### Error Handling

```javascript
try {
    await client.organization.domains.create({ domain: "example.com" });
} catch (error) {
    if (error.statusCode === 400) {
        console.error("Bad request:", error.message);
    } else if (error.statusCode === 409) {
        console.error("Domain already exists");
    } else {
        console.error("Error:", error.message);
    }
}
```

## Security

**Use private key JWT in production** — more secure than a client secret:

```bash
AUTH0_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

Never commit your `.env` file. Use a secrets manager (AWS Secrets Manager, Azure Key Vault, HashiCorp Vault, etc.) for production deployments.

## Troubleshooting

**`Missing required environment variables`** — Check that `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_ORGANIZATION`, and either `AUTH0_CLIENT_SECRET` or `AUTH0_PRIVATE_KEY` are all set in `.env`.

**401 Unauthorized** — Verify your client credentials and that the M2M application is authorized for the MyOrganization API.

**403 Forbidden** — Grant the required scopes listed above to your M2M application in the Auth0 Dashboard.

## Learn More

- [MyOrganization SDK Documentation](../../README.md)
- [API Reference](../../reference.md)
- [Auth0 Documentation](https://auth0.com/docs)
