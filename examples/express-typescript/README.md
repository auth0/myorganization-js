# MyOrganization SDK — Express TypeScript Example

A production-ready Express.js REST API demonstrating the core features of the MyOrganization SDK: Organization details, domain management, and identity provider configuration.

## What this example covers

- Server-side M2M authentication: Client Secret and Private Key JWT
- Review and update Organization details: endpoints for `GET` and `PATCH` calls
- Configure domains: list, create, get verification details, verify, delete
- Configure identity providers: list, create, get, update, delete
- Two end-to-end workflow examples: domain verification and OpenID Connect (OIDC) SSO setup
- Comprehensive error handling for all SDK error types

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

## API endpoints

| Method | Endpoint                             | Description                                        |
| ------ | ------------------------------------ | -------------------------------------------------- |
| GET    | `/api/organization/details`          | Get org details                                    |
| PATCH  | `/api/organization/details`          | Update `display_name`, `branding`                  |
| GET    | `/api/domains`                       | List all domains                                   |
| POST   | `/api/domains`                       | Add a domain `{"domain": "example.com"}`           |
| GET    | `/api/domains/:domainId`             | Get domain + TXT record for verification           |
| POST   | `/api/domains/:domainId/verify`      | Trigger DNS verification                           |
| DELETE | `/api/domains/:domainId`             | Remove a domain                                    |
| GET    | `/api/identity-providers`            | List all IdPs                                      |
| POST   | `/api/identity-providers`            | Create an IdP (see body examples below)            |
| GET    | `/api/identity-providers/:idpId`     | Get an IdP                                         |
| PATCH  | `/api/identity-providers/:idpId`     | Update an IdP                                      |
| DELETE | `/api/identity-providers/:idpId`     | Delete an IdP                                      |
| POST   | `/api/workflows/domain-verification` | Create domain + return DNS TXT record instructions |
| POST   | `/api/workflows/setup-oidc-sso`      | Create OIDC IdP + optional Home Realm Discovery    |

### Create an identity provider

OIDC:

```bash
curl -X POST http://localhost:3000/api/identity-providers \
  -H "Content-Type: application/json" \
  -d '{
    "strategy": "oidc",
    "name": "my-oidc-provider",
    "display_name": "Company SSO",
    "is_enabled": true,
    "options": {
      "type": "back_channel",
      "client_id": "oidc-client-id",
      "client_secret": "oidc-client-secret",
      "discovery_url": "https://auth0.auth0.com/.well-known/openid-configuration"
    }
  }'
```

SAML:

```bash
curl -X POST http://localhost:3000/api/identity-providers \
  -H "Content-Type: application/json" \
  -d '{
    "strategy": "samlp",
    "name": "my-saml-provider",
    "display_name": "Company SAML SSO",
    "is_enabled": true,
    "options": {
      "signInEndpoint": "https://idp.company.com/sso/saml",
      "cert": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----",
      "signSAMLRequest": true
    }
  }'
```

### Workflows

Verify domain — creates the domain and returns the DNS TXT record to add before verifying:

```bash
curl -X POST http://localhost:3000/api/workflows/domain-verification \
  -H "Content-Type: application/json" \
  -d '{"domain": "example.com"}'
```

Set up OIDC SSO — creates the identity provider and optionally enables Home Realm Discovery for an email domain:

```bash
curl -X POST http://localhost:3000/api/workflows/setup-oidc-sso \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-oidc-provider",
    "displayName": "Company SSO",
    "clientId": "oidc-client-id",
    "clientSecret": "oidc-client-secret",
    "discoveryUrl": "https://auth0.auth0.com/.well-known/openid-configuration",
    "domain": "company.com"
  }'
```

## Supported identity provider strategies

| Strategy       | Description                          |
| -------------- | ------------------------------------ |
| `oidc`         | OpenID Connect                       |
| `samlp`        | SAML 2.0                             |
| `okta`         | Okta                                 |
| `waad`         | Azure Active Directory               |
| `adfs`         | Active Directory Federation Services |
| `google-apps`  | Google Workspace                     |
| `pingfederate` | PingFederate                         |

## Error handling

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
