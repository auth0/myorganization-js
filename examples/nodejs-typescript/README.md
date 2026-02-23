# MyOrganization SDK - Node.js TypeScript CLI Example

Command-line interface and script examples for Auth0 MyOrganization SDK in TypeScript.

## Features

- ✅ CLI tool for organization management
- ✅ Identity provider setup scripts
- ✅ All authentication methods (client secret & private key JWT)
- ✅ Comprehensive error handling

## Installation

```bash
npm install
```

## Configuration

1. Copy `.env.example` to `.env`:

    ```bash
    cp .env.example .env
    ```

2. Configure your Auth0 credentials in `.env`

## Usage

### CLI Commands

**List organization details:**

```bash
npm start org:details
```

**List domains:**

```bash
npm start domains:list
```

**Create a domain:**

```bash
npm start domains:create example.com
```

**List identity providers:**

```bash
npm start idp:list
```

**Create OIDC identity provider:**

```bash
npm start idp:create-oidc \
  --name my-oidc-provider \
  --display-name "My Company SSO" \
  --client-id oidc-client-id \
  --client-secret oidc-client-secret \
  --discovery-url https://idp.company.com/.well-known/openid-configuration
```

## Key Patterns

### Client Initialization

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

### Error Handling

```typescript
import { MyOrganization, MyOrganizationError } from "@auth0/myorganization-js/server";

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

## Learn More

- [MyOrganization SDK Documentation](../../README.md)
- [API Reference](../../reference.md)
- [Auth0 Documentation](https://auth0.com/docs)
