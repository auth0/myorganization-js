# MyOrganization SDK - Vanilla JavaScript SPA Example

Vanilla JavaScript single-page application demonstrating Auth0 MyOrganization SDK integration with `@auth0/auth0-spa-js`.

## Features

- ✅ Zero framework dependencies (vanilla JavaScript)
- ✅ Auth0 SPA JS integration with scope-aware tokens
- ✅ Complete organization management dashboard
- ✅ Domain verification workflow
- ✅ Identity provider management
- ✅ Production-ready patterns

## Installation

```bash
npm install
```

## Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Configure your Auth0 SPA application:
   ```bash
   VITE_AUTH0_DOMAIN=your-tenant.auth0.com
   VITE_AUTH0_CLIENT_ID=your-spa-client-id
   VITE_AUTH0_ORGANIZATION=org_123456789
   ```

## Running

**Development:**
```bash
npm run dev
```

**Production build:**
```bash
npm run build
npm run preview
```

## Key Patterns

### Initialization with Scope-Aware Tokens

```javascript
import { createAuth0Client } from '@auth0/auth0-spa-js';
import { MyOrganizationClient } from '@auth0/myorganization-js';

// Initialize Auth0 client
const auth0 = await createAuth0Client({
  domain: 'your-tenant.auth0.com',
  clientId: 'your-client-id',
  authorizationParams: {
    organization: 'org_123456789'
  }
});

// Initialize MyOrganization client with scope-aware token
const myOrgClient = new MyOrganizationClient({
  domain: 'your-tenant.auth0.com',
  // SDK automatically passes required scopes for each API call
  token: async ({ scope }) => {
    return await auth0.getTokenSilently({
      authorizationParams: {
        scope: `openid profile email ${scope}`,
        organization: 'org_123456789'
      }
    });
  }
});
```

### Making API Calls

```javascript
// Get organization details
const details = await myOrgClient.organizationDetails.get();

// List domains
const domains = await myOrgClient.organization.domains.list();

// Create domain
await myOrgClient.organization.domains.create({ domain: 'example.com' });
```

### Error Handling

```javascript
try {
  await myOrgClient.organization.domains.create({ domain: 'example.com' });
} catch (error) {
  if (error.statusCode === 400) {
    console.error('Bad request:', error.message);
  } else if (error.statusCode === 429) {
    console.error('Rate limited');
  }
}
```

## Architecture

- **main.js** - Application entry point, client initialization, UI logic
- **index.html** - HTML structure
- **style.css** - Styling (optional)

## Security Notes

- ⚠️ Never include client secrets in browser applications
- ✅ Use token-based authentication only
- ✅ SDK handles automatic scope injection
- ✅ Always use organization parameter

## Learn More

- [Auth0 SPA JS SDK](https://github.com/auth0/auth0-spa-js)
- [MyOrganization SDK Documentation](../../README.md)
- [Vite Documentation](https://vitejs.dev/)
