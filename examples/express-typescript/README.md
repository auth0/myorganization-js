# MyOrganization SDK - Express TypeScript Example

This example demonstrates production-ready integration of the MyOrganization SDK in an Express.js application with TypeScript.

## Features

- ✅ **Server-side authentication** with client credentials (client secret & private key JWT)
- ✅ **Complete organization management** - CRUD operations for organization details
- ✅ **Domain verification workflow** - Create → verify → manage domains
- ✅ **Identity provider configuration** - Support for all strategies (OIDC, SAML, Okta, Azure AD, ADFS, Google Workspace, PingFederate)
- ✅ **Provisioning & SCIM management** - Complete SCIM provisioning setup
- ✅ **Home Realm Discovery** - Domain-based SSO routing
- ✅ **Comprehensive error handling** - All SDK error types with proper status codes
- ✅ **Rate limiting recovery** - Automatic retry with exponential backoff
- ✅ **Pagination support** - Cursor-based pagination for list endpoints
- ✅ **Request options** - Timeout, abort signals, custom headers
- ✅ **Complete workflows** - End-to-end examples for common use cases

## Prerequisites

- Node.js 20+
- Auth0 tenant with MyOrganization API enabled
- Machine-to-Machine (M2M) application configured in Auth0
- Required scopes granted to your M2M application

## Required Auth0 Setup

### 1. Enable MyOrganization API

1. Go to Auth0 Dashboard → Applications → APIs
2. Find "Auth0 My Organization API"
3. Enable it for your tenant (if not already enabled)

### 2. Create M2M Application

1. Go to Applications → Applications → Create Application
2. Choose "Machine to Machine Applications"
3. Authorize it for "Auth0 My Organization API"
4. Grant required scopes (see below)

### 3. Required Scopes

Grant these scopes to your M2M application:

```
read:my_org:details
update:my_org:details
read:my_org:configuration
read:my_org:organization_domains
create:my_org:organization_domains
update:my_org:organization_domains
delete:my_org:organization_domains
read:my_org:identity_providers
create:my_org:identity_providers
update:my_org:identity_providers
delete:my_org:identity_providers
read:my_org:identity_providers_provisioning
create:my_org:identity_providers_provisioning
update:my_org:identity_providers_provisioning
delete:my_org:identity_providers_provisioning
read:my_org:identity_providers_scim_tokens
create:my_org:identity_providers_scim_tokens
delete:my_org:identity_providers_scim_tokens
```

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

3. **Update `.env` with your Auth0 credentials:**
   ```bash
   AUTH0_DOMAIN=your-tenant.auth0.com
   AUTH0_CLIENT_ID=your-client-id
   AUTH0_CLIENT_SECRET=your-client-secret
   AUTH0_ORGANIZATION=org_123456789
   ```

## Running the Application

### Development Mode (with hot reload)
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

The server will start on `http://localhost:3000` (or your configured PORT).

## API Endpoints

### Organization Details

```bash
# Get organization details
curl http://localhost:3000/api/organization/details

# Update organization details
curl -X PATCH http://localhost:3000/api/organization/details \
  -H "Content-Type: application/json" \
  -d '{
    "display_name": "Acme Corporation",
    "branding": {
      "logo_url": "https://example.com/logo.png",
      "colors": {
        "primary": "#0066CC",
        "page_background": "#FFFFFF"
      }
    }
  }'
```

### Configuration

```bash
# Get organization configuration
curl http://localhost:3000/api/organization/configuration

# Get identity provider configuration
curl http://localhost:3000/api/organization/configuration/identity-providers
```

### Domains

```bash
# List all domains
curl http://localhost:3000/api/domains

# List with pagination
curl "http://localhost:3000/api/domains?take=5&from=cursor_string"

# Create a domain
curl -X POST http://localhost:3000/api/domains \
  -H "Content-Type: application/json" \
  -d '{"domain": "example.com"}'

# Get domain details
curl http://localhost:3000/api/domains/dom_abc123

# Start domain verification
curl -X POST http://localhost:3000/api/domains/dom_abc123/verify

# Delete a domain
curl -X DELETE http://localhost:3000/api/domains/dom_abc123

# List identity providers for a domain
curl http://localhost:3000/api/domains/dom_abc123/identity-providers
```

### Identity Providers

```bash
# List all identity providers
curl http://localhost:3000/api/identity-providers

# Create OIDC identity provider
curl -X POST http://localhost:3000/api/identity-providers \
  -H "Content-Type: application/json" \
  -d '{
    "strategy": "oidc",
    "name": "my-oidc-provider",
    "display_name": "My Company SSO",
    "show_as_button": true,
    "assign_membership_on_login": true,
    "is_enabled": true,
    "options": {
      "type": "back_channel",
      "client_id": "oidc-client-id",
      "client_secret": "oidc-client-secret",
      "issuer": "https://idp.company.com",
      "scopes": "openid profile email"
    }
  }'

# Create SAML identity provider
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

# Get identity provider
curl http://localhost:3000/api/identity-providers/idp_abc123

# Update identity provider
curl -X PATCH http://localhost:3000/api/identity-providers/idp_abc123 \
  -H "Content-Type: application/json" \
  -d '{"display_name": "Updated Display Name"}'

# Delete identity provider
curl -X DELETE http://localhost:3000/api/identity-providers/idp_abc123

# Refresh attribute mappings
curl -X POST http://localhost:3000/api/identity-providers/idp_abc123/refresh-attributes

# Detach underlying connection
curl -X POST http://localhost:3000/api/identity-providers/idp_abc123/detach
```

### Home Realm Discovery (HRD)

```bash
# Add domain to identity provider
curl -X POST http://localhost:3000/api/identity-providers/idp_abc123/domains \
  -H "Content-Type: application/json" \
  -d '{"domain": "company.com"}'

# Remove domain from identity provider
curl -X DELETE http://localhost:3000/api/identity-providers/idp_abc123/domains/company.com
```

### Provisioning

```bash
# Get provisioning configuration
curl http://localhost:3000/api/identity-providers/idp_abc123/provisioning

# Create provisioning configuration
curl -X POST http://localhost:3000/api/identity-providers/idp_abc123/provisioning \
  -H "Content-Type: application/json" \
  -d '{
    "method": "scim",
    "user_attribute_map": [
      {"auth0_attribute": "email", "idp_attribute": "emails[0].value"},
      {"auth0_attribute": "given_name", "idp_attribute": "name.givenName"},
      {"auth0_attribute": "family_name", "idp_attribute": "name.familyName"}
    ]
  }'

# Delete provisioning configuration
curl -X DELETE http://localhost:3000/api/identity-providers/idp_abc123/provisioning

# Refresh provisioning attribute mappings
curl -X POST http://localhost:3000/api/identity-providers/idp_abc123/provisioning/refresh-attributes
```

### SCIM Tokens

```bash
# List SCIM tokens
curl http://localhost:3000/api/identity-providers/idp_abc123/provisioning/scim-tokens

# Create SCIM token
curl -X POST http://localhost:3000/api/identity-providers/idp_abc123/provisioning/scim-tokens \
  -H "Content-Type: application/json" \
  -d '{"name": "Primary Token"}'

# Delete SCIM token
curl -X DELETE http://localhost:3000/api/identity-providers/idp_abc123/provisioning/scim-tokens/token_xyz789
```

### Workflows (Complete End-to-End Examples)

```bash
# Domain verification workflow
curl -X POST http://localhost:3000/api/workflows/domain-verification \
  -H "Content-Type: application/json" \
  -d '{"domain": "example.com"}'

# OIDC SSO setup workflow
curl -X POST http://localhost:3000/api/workflows/setup-oidc-sso \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-oidc-provider",
    "displayName": "My Company SSO",
    "domain": "company.com",
    "clientId": "oidc-client-id",
    "clientSecret": "oidc-client-secret",
    "issuer": "https://idp.company.com"
  }'

# SAML SSO setup workflow
curl -X POST http://localhost:3000/api/workflows/setup-saml-sso \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-saml-provider",
    "displayName": "Company SAML SSO",
    "domain": "company.com",
    "signInEndpoint": "https://idp.company.com/sso/saml",
    "signingCert": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----"
  }'

# SCIM provisioning setup workflow
curl -X POST http://localhost:3000/api/workflows/setup-provisioning \
  -H "Content-Type: application/json" \
  -d '{
    "idpId": "idp_abc123",
    "userAttributeMap": [
      {"auth0_attribute": "email", "idp_attribute": "emails[0].value"},
      {"auth0_attribute": "given_name", "idp_attribute": "name.givenName"}
    ]
  }'
```

## Supported Identity Provider Strategies

This example supports all Auth0 identity provider strategies:

| Strategy | Description | Use Case |
|----------|-------------|----------|
| `oidc` | OpenID Connect | Modern OAuth 2.0/OIDC providers |
| `samlp` | SAML Protocol | Enterprise SAML 2.0 SSO |
| `okta` | Okta | Okta identity provider |
| `waad` | Azure AD | Microsoft Azure Active Directory |
| `adfs` | ADFS | Active Directory Federation Services |
| `google-apps` | Google Workspace | Google Workspace SSO |
| `pingfederate` | PingFederate | PingFederate identity provider |

## Error Handling

The application provides comprehensive error handling for all SDK error types:

| Error Type | Status Code | Description |
|------------|-------------|-------------|
| `BadRequestError` | 400 | Invalid request parameters |
| `UnauthorizedError` | 401 | Invalid or expired token |
| `ForbiddenError` | 403 | Insufficient permissions/scopes |
| `NotFoundError` | 404 | Resource not found |
| `ConflictError` | 409 | Resource conflict (e.g., duplicate) |
| `TooManyRequestsError` | 429 | Rate limit exceeded |
| `MyOrganizationTimeoutError` | 504 | Request timeout |
| `MyOrganizationError` | 500 | Generic API error |

All errors include detailed messages and response bodies for debugging.

## Security Best Practices

### 🔐 Authentication

1. **Use Private Key JWT in production** - More secure than client secrets
   ```bash
   AUTH0_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
   ```

2. **Enable mTLS** for additional security
   ```bash
   AUTH0_MTLS_ENABLED=true
   ```

3. **Never commit `.env` file** - Contains sensitive credentials
   ```bash
   echo ".env" >> .gitignore
   ```

### 🔑 Secret Management

- Use environment variables (not hardcoded)
- Consider secret management services:
  - AWS Secrets Manager
  - Azure Key Vault
  - HashiCorp Vault
  - GCP Secret Manager

### 🔄 Credential Rotation

- Rotate client secrets every 90 days
- Rotate private keys annually
- Monitor Auth0 logs for suspicious activity

### 📊 Monitoring

- Log all API operations
- Monitor rate limits
- Set up alerts for errors
- Track authentication failures

## Project Structure

```
examples/express-typescript/
├── src/
│   └── index.ts          # Main application file with all routes
├── .env.example          # Environment variables template
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## Development Tips

### Testing Endpoints

Use the provided health check to verify the server is running:
```bash
curl http://localhost:3000/health
```

Get API documentation:
```bash
curl http://localhost:3000/
```

### Debugging

Enable development mode for detailed error messages:
```bash
NODE_ENV=development npm run dev
```

### Rate Limiting

The SDK includes automatic retry logic for rate-limited requests. Monitor the console for retry attempts.

## Common Issues

### Issue: "Missing required environment variables"

**Solution:** Ensure all required variables are set in `.env`:
- `AUTH0_DOMAIN`
- `AUTH0_CLIENT_ID`
- `AUTH0_CLIENT_SECRET` or `AUTH0_PRIVATE_KEY`
- `AUTH0_ORGANIZATION`

### Issue: "Unauthorized" (401)

**Solution:** 
- Verify your client credentials are correct
- Check that the M2M application is authorized for MyOrganization API
- Ensure the organization ID is correct

### Issue: "Forbidden" (403)

**Solution:**
- Grant required scopes to your M2M application
- Check Auth0 Dashboard → Applications → APIs → MyOrganization API → Permissions

### Issue: "Rate Limit Exceeded" (429)

**Solution:**
- The SDK automatically retries with exponential backoff
- Consider caching responses
- Implement request throttling in your application

## Learn More

- [MyOrganization SDK Documentation](../../README.md)
- [API Reference](../../reference.md)
- [Auth0 Documentation](https://auth0.com/docs)
- [MyOrganization API PRD](https://auth0.com/docs/customize/organizations)

## Support

For issues or questions:
1. Check the [SDK repository](https://github.com/auth0/myorganization-js/issues)
2. Visit [Auth0 Community](https://community.auth0.com)
3. Contact Auth0 Support

## License

This example is licensed under the MIT License. See the [LICENSE](../../LICENSE) file for details.
