# Auth0 MyOrganization SDK - Framework Examples

Production-ready examples demonstrating the MyOrganization SDK across different frameworks.

> 📖 **New to the SDK?** Start with the [Main README](../README.md) for installation and setup instructions.

## Available examples

### Server-side (M2M authentication)

| Example                                         | Description                           | Best For                          |
| ----------------------------------------------- | ------------------------------------- | --------------------------------- |
| **[express-typescript](./express-typescript/)** | Core Organization management REST API | Production APIs, backend services |
| **[nodejs-typescript](./nodejs-typescript/)**   | CLI tools and automation              | Scripts, DevOps, batch operations |
| **[nodejs-javascript](./nodejs-javascript/)**   | Vanilla JS examples                   | Simple scripts, no TypeScript     |

### Client-side (user authentication)

| Example                           | Description          | Best For                    |
| --------------------------------- | -------------------- | --------------------------- |
| **[react-spa](./react-spa/)**     | React app with hooks | Modern React applications   |
| **[vanilla-spa](./vanilla-spa/)** | Framework-free SPA   | Learning, no framework deps |

## Quick start

```bash
# 1. Choose an example
cd examples/express-typescript

# 2. Install dependencies
npm install

# 3. Configure
cp .env.example .env
# Edit .env with your Auth0 credentials

# 4. Run
npm run dev
```

## Authentication quick reference

### Server-side

```typescript
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

### Client-side

```typescript
import { MyOrganizationClient } from "@auth0/myorganization-js";

const client = new MyOrganizationClient({
    domain: "tenant.auth0.com",
    token: async ({ scope }) => auth0.getTokenSilently({ scope: `openid profile email ${scope}` }),
});
```

## Need help?

- 📖 [Main README](../README.md) - Installation, authentication, and SDK overview
- 📖 [API Reference](../reference.md) - Full API documentation
- 💬 [Auth0 Community](https://community.auth0.com) - Ask questions and get help

## License

MIT License - See [LICENSE](../LICENSE) for details.
