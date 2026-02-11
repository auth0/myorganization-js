# MyOrganization SDK - Node.js JavaScript Example

Vanilla JavaScript examples for Auth0 MyOrganization SDK in Node.js (no TypeScript).

## Features

- ✅ Pure JavaScript (no TypeScript required)
- ✅ Simple automation scripts
- ✅ All authentication methods
- ✅ Complete error handling
- ✅ Easy to understand and modify

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

**Run the example:**
```bash
npm start
```

## Example Patterns

### Client Initialization

```javascript
import { createMyOrganizationClientWithClientCredentials } from '@auth0/myorganization-js/server';

const client = createMyOrganizationClientWithClientCredentials(
  { domain: 'tenant.auth0.com' },
  {
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    organization: process.env.AUTH0_ORGANIZATION
  }
);
```

### Getting Organization Details

```javascript
const details = await client.organizationDetails.get();
console.log('Organization:', details.organization?.name);
```

### Creating a Domain

```javascript
const result = await client.organization.domains.create({ 
  domain: 'example.com' 
});
console.log('Domain created:', result.organization_domain?.id);
```

### Error Handling

```javascript
try {
  await client.organization.domains.create({ domain: 'example.com' });
} catch (error) {
  if (error.statusCode === 400) {
    console.error('Bad request:', error.message);
  } else if (error.statusCode === 409) {
    console.error('Domain already exists');
  } else {
    console.error('Error:', error.message);
  }
}
```

## Learn More

- [MyOrganization SDK Documentation](../../README.md)
- [API Reference](../../reference.md)
- [Auth0 Documentation](https://auth0.com/docs)
