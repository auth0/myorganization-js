# MyOrganization SDK - Node.js TypeScript CLI Example

Command-line interface and script examples for Auth0 MyOrganization SDK in TypeScript.

## Features

- ✅ CLI tool for organization management
- ✅ Identity provider setup scripts
- ✅ All authentication methods (Client Secret & Private Key JWT)
- ✅ Comprehensive error handling

## Prerequisites

- Node.js 20+
- An Auth0 tenant with the MyOrganization API enabled
- A Machine-to-Machine (M2M) application in Auth0

## Auth0 setup

### 1. Enable the MyOrganization API

1. Navigate to **Auth0 Dashboard → Applications → APIs**.
2. Find **Auth0 My Organization API** and confirm it is enabled. If not, select **Activate**.

### 2. Create an M2M application

1. Navigate to **Applications → Applications → Create Application**.
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

### 3. Note your credentials

From the M2M application's **Settings** tab, copy:

- **Domain** — your Auth0 tenant domain (e.g. `your-tenant.auth0.com`)
- **Client ID**
- **Client Secret** (or configure a private key for private key JWT)

### 4. Get your organization ID

1. Navigate to **Auth0 Dashboard → Organizations**.
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

### CLI commands

| Command                                | Description              |
| -------------------------------------- | ------------------------ |
| `npm start org:details`                | Get organization details |
| `npm start domains:list`               | List all domains         |
| `npm start domains:create example.com` | Add a domain             |
| `npm start idp:list`                   | List identity providers  |

**Create an OIDC identity provider:**

```bash
npm start idp:create-oidc \
  --name my-oidc-provider \
  --display-name "My Company SSO" \
  --client-id oidc-client-id \
  --client-secret oidc-client-secret \
  --discovery-url https://auth0.auth0.com/.well-known/openid-configuration
```

## Key patterns

### Client initialization

```typescript
import { createMyOrganizationClientWithClientCredentials } from "@auth0/myorganization-js/server";

// Using client secret
const client = createMyOrganizationClientWithClientCredentials(
    { domain: "tenant.auth0.com" },
    {
        clientId: "YOUR_CLIENT_ID",
        clientSecret: "YOUR_CLIENT_SECRET",
        organization: "org_123456789",
    },
);

// Using private key JWT (recommended for production)
const client = createMyOrganizationClientWithClientCredentials(
    { domain: "tenant.auth0.com" },
    {
        clientId: "YOUR_CLIENT_ID",
        privateKey: process.env.AUTH0_PRIVATE_KEY,
        organization: "org_123456789",
    },
);
```

### Error handling

```typescript
import { MyOrganization, MyOrganizationError } from "@auth0/myorganization-js";

try {
    await client.organization.domains.create({ domain: "example.com" });
} catch (error) {
    if (error instanceof MyOrganization.BadRequestError) {
        console.error("Invalid request:", error.message);
    } else if (error instanceof MyOrganization.UnauthorizedError) {
        console.error("Authentication failed");
    } else if (error instanceof MyOrganization.TooManyRequestsError) {
        console.error("Rate limited - retry after:", error.rawResponse?.headers.get("retry-after"));
    }
}
```

## Security

**Use Private Key JWT in production** — more secure than a Client Secret:

```bash
AUTH0_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

Never commit your `.env` file. Use a secrets manager (AWS Secrets Manager, Azure Key Vault, HashiCorp Vault, etc.) for production deployments.

## Troubleshooting

**`Missing required environment variables`** — Check that `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_ORGANIZATION`, and either `AUTH0_CLIENT_SECRET` or `AUTH0_PRIVATE_KEY` are all set in `.env`.

**401 Unauthorized** — Verify your client credentials and that the M2M application is authorized for the MyOrganization API.

**403 Forbidden** — Grant the required scopes listed above to your M2M application in the Auth0 Dashboard.

## Learn more

- [MyOrganization SDK Documentation](../../README.md)
- [API Reference](../../reference.md)
- [Auth0 Documentation](https://auth0.com/docs)
