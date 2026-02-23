# MyOrganization SDK — Express TypeScript Example

A production-ready Express.js REST API demonstrating the core features of the MyOrganization SDK: organization details, domain management, and identity provider configuration.

## What this example covers

- Server-side M2M authentication (client secret and private key JWT)
- Organization details — get and update
- Domains — list, create, get verification details, verify, delete
- Identity providers — list, create, get, update, delete
- Two end-to-end workflow examples: domain verification and OIDC SSO setup
- Comprehensive error handling for all SDK error types

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

## Running

```bash
# Development (with hot reload)
npm run dev

# Production
npm run build && npm run start:prod
```

The server starts at `http://localhost:3000`.

## API Endpoints

### Organization Details

```bash
# Get organization details
curl http://localhost:3000/api/organization/details

# Update display name and branding
curl -X PATCH http://localhost:3000/api/organization/details \
  -H "Content-Type: application/json" \
  -d '{
    "display_name": "Acme Corporation",
    "branding": {
      "logo_url": "https://example.com/logo.png",
      "colors": { "primary": "#0066CC", "page_background": "#FFFFFF" }
    }
  }'
```

### Domains

```bash
# List domains
curl http://localhost:3000/api/domains

# Add a domain
curl -X POST http://localhost:3000/api/domains \
  -H "Content-Type: application/json" \
  -d '{"domain": "example.com"}'

# Get domain details (includes TXT record for verification)
curl http://localhost:3000/api/domains/dom_abc123

# Start domain verification (after adding the TXT record to DNS)
curl -X POST http://localhost:3000/api/domains/dom_abc123/verify

# Delete a domain
curl -X DELETE http://localhost:3000/api/domains/dom_abc123
```

### Identity Providers

```bash
# List identity providers
curl http://localhost:3000/api/identity-providers

# Create an OIDC identity provider
curl -X POST http://localhost:3000/api/identity-providers \
  -H "Content-Type: application/json" \
  -d '{
    "strategy": "oidc",
    "name": "my-oidc-provider",
    "display_name": "Company SSO",
    "show_as_button": true,
    "assign_membership_on_login": true,
    "is_enabled": true,
    "options": {
      "type": "back_channel",
      "client_id": "oidc-client-id",
      "client_secret": "oidc-client-secret",
      "discovery_url": "https://idp.company.com/.well-known/openid-configuration"
    }
  }'

# Create a SAML identity provider
curl -X POST http://localhost:3000/api/identity-providers \
  -H "Content-Type: application/json" \
  -d '{
    "strategy": "samlp",
    "name": "my-saml-provider",
    "display_name": "Company SAML SSO",
    "show_as_button": true,
    "assign_membership_on_login": true,
    "is_enabled": true,
    "options": {
      "sign_in_endpoint": "https://idp.company.com/sso/saml",
      "signing_cert": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----",
      "protocol_binding": "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
    }
  }'

# Get an identity provider
curl http://localhost:3000/api/identity-providers/idp_abc123

# Update an identity provider
curl -X PATCH http://localhost:3000/api/identity-providers/idp_abc123 \
  -H "Content-Type: application/json" \
  -d '{"display_name": "Updated SSO Name", "is_enabled": true}'

# Delete an identity provider
curl -X DELETE http://localhost:3000/api/identity-providers/idp_abc123
```

### Workflows

```bash
# Domain verification workflow
# Creates a domain and returns DNS TXT record instructions
curl -X POST http://localhost:3000/api/workflows/domain-verification \
  -H "Content-Type: application/json" \
  -d '{"domain": "example.com"}'

# OIDC SSO setup workflow
# Creates an identity provider and optionally enables Home Realm Discovery
curl -X POST http://localhost:3000/api/workflows/setup-oidc-sso \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-oidc-provider",
    "displayName": "Company SSO",
    "clientId": "oidc-client-id",
    "clientSecret": "oidc-client-secret",
    "discoveryUrl": "https://idp.company.com/.well-known/openid-configuration",
    "domain": "company.com"
  }'
```

## Supported Identity Provider Strategies

| Strategy       | Description                          |
| -------------- | ------------------------------------ |
| `oidc`         | OpenID Connect                       |
| `samlp`        | SAML 2.0                             |
| `okta`         | Okta                                 |
| `waad`         | Azure Active Directory               |
| `adfs`         | Active Directory Federation Services |
| `google-apps`  | Google Workspace                     |
| `pingfederate` | PingFederate                         |

## Error Handling

The API maps SDK errors to standard HTTP status codes:

| Error                        | Status | Description                              |
| ---------------------------- | ------ | ---------------------------------------- |
| `BadRequestError`            | 400    | Invalid request parameters               |
| `UnauthorizedError`          | 401    | Invalid or expired token                 |
| `ForbiddenError`             | 403    | Insufficient scopes                      |
| `NotFoundError`              | 404    | Resource not found                       |
| `ConflictError`              | 409    | Duplicate resource                       |
| `TooManyRequestsError`       | 429    | Rate limited (SDK retries automatically) |
| `MyOrganizationTimeoutError` | 504    | Request timed out                        |

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
