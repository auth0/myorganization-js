# MyOrganization SDK - React SPA Example

React application demonstrating Auth0 MyOrganization SDK integration with `@auth0/auth0-react`.

## Features

- ✅ Auth0 React SDK integration with scope-aware tokens
- ✅ Custom hooks for organization management
- ✅ Reusable React components
- ✅ Complete CRUD operations for domains and identity providers
- ✅ Error boundaries and loading states
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

### Custom Hook with Scope-Aware Tokens

```typescript
import { useAuth0 } from '@auth0/auth0-react';
import { MyOrganizationClient } from '@auth0/myorganization-js';

export function useMyOrganization() {
  const { getAccessTokenSilently } = useAuth0();

  const client = useMemo(() => {
    return new MyOrganizationClient({
      domain: import.meta.env.VITE_AUTH0_DOMAIN,
      // SDK automatically passes required scopes
      token: async ({ scope }) => {
        return await getAccessTokenSilently({
          authorizationParams: {
            scope: `openid profile email ${scope}`,
            organization: import.meta.env.VITE_AUTH0_ORGANIZATION
          }
        });
      }
    });
  }, [getAccessTokenSilently]);

  return { client };
}
```

### Component Example

```typescript
import { useMyOrganization } from '../hooks/useMyOrganization';

export function OrganizationDetails() {
  const { getOrganizationDetails } = useMyOrganization();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    getOrganizationDetails().then(setDetails);
  }, []);

  return <div>{/* Render details */}</div>;
}
```

## Security Notes

- ⚠️ Never include client secrets in React applications
- ✅ Use token-based authentication only
- ✅ Let the SDK handle scope management automatically
- ✅ Always use organization parameter for auth requests

## Learn More

- [Auth0 React SDK](https://github.com/auth0/auth0-react)
- [MyOrganization SDK Documentation](../../README.md)
- [React Hooks Guide](https://react.dev/reference/react)
