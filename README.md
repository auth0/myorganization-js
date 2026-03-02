![Auth0 MyOrganization SDK for JavaScript/TypeScript](https://cdn.auth0.com/website/sdks/banners/myorganization-js-banner.png)

![Release](https://img.shields.io/npm/v/@auth0/myorganization-js)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![fern shield](https://img.shields.io/badge/%F0%9F%8C%BF-Built%20with%20Fern-brightgreen)](https://buildwithfern.com?utm_source=github&utm_medium=github&utm_campaign=readme&utm_source=https%3A%2F%2Fgithub.com%2Fauth0%2Fmyorganization-js)

📚 [Documentation](#documentation) - 🚀 [Getting Started](#getting-started) - 💻 [API Reference](#api-reference) - � [Examples](#framework-examples) - 💬 [Feedback](#feedback)

## Documentation

- [Docs Site](https://auth0.com/docs) - explore our docs site and learn more about Auth0
- [API Reference](https://github.com/auth0/myorganization-js/blob/main/reference.md) - full reference for this library
- [Framework Examples](./examples/) - production-ready examples for Express, Node.js, React, and vanilla JavaScript

## Getting Started

### Requirements

This library supports the following tooling versions:

- Node.js: 18 or higher

### Installation

Using [npm](https://npmjs.org) in your project directory run the following command:

```bash
npm install @auth0/myorganization-js
```

### Configure the SDK

The MyOrganization client allows you to manage Auth0 organizations, including organization details, domains, identity providers, and configuration.

Initialize your client with a domain and token supplier:

```typescript
import { MyOrganizationClient } from "@auth0/myorganization-js";

const client = new MyOrganizationClient({
    domain: "{YOUR_TENANT_AND_REGION}.auth0.com",
    token: "YOUR_ACCESS_TOKEN", // or use a token supplier function
});
```

#### Using a Token Supplier

For dynamic token retrieval (recommended for production):

```typescript
import { MyOrganizationClient } from "@auth0/myorganization-js";

const client = new MyOrganizationClient({
    domain: "{YOUR_TENANT_AND_REGION}.auth0.com",
    token: async ({ scope }) => {
        // Fetch token with required scopes
        return await getAccessToken({
            scope: `openid profile email ${scope}`,
        });
    },
});
```

#### Using a Custom Fetcher

For advanced authentication scenarios:

```typescript
import { MyOrganizationClient } from "@auth0/myorganization-js";

const client = new MyOrganizationClient({
    domain: "{YOUR_TENANT_AND_REGION}.auth0.com",
    fetcher: async (url, init, authParams) => {
        const token = await getAccessToken({ scope: authParams?.scope });
        return fetch(url, {
            ...init,
            headers: {
                ...init?.headers,
                Authorization: `Bearer ${token}`,
            },
        });
    },
});
```

### Server-Side Authentication

For server-side applications, you can use the client credentials flow with a helper function that automatically handles token management:

#### Using Client Credentials with Client Secret

```typescript
import { createMyOrganizationClientWithClientCredentials } from "@auth0/myorganization-js/server";

const client = createMyOrganizationClientWithClientCredentials(
    {
        domain: "{YOUR_TENANT_AND_REGION}.auth0.com",
    },
    {
        clientId: "YOUR_CLIENT_ID",
        clientSecret: "YOUR_CLIENT_SECRET",
        organization: "org_123456789",
    },
);
```

#### Using Client Credentials with Private Key Assertion

For enhanced security using private key JWT:

```typescript
import { createMyOrganizationClientWithClientCredentials } from "@auth0/myorganization-js/server";

const client = createMyOrganizationClientWithClientCredentials(
    {
        domain: "{YOUR_TENANT_AND_REGION}.auth0.com",
    },
    {
        clientId: "YOUR_CLIENT_ID",
        privateKey: "YOUR_PRIVATE_KEY",
        organization: "org_123456789",
    },
);
```

#### Manual Token Provider Setup

For more control, you can manually configure the token provider:

```typescript
import { MyOrganizationClient, ClientCredentialsTokenProvider } from "@auth0/myorganization-js/server";

const tokenProvider = new ClientCredentialsTokenProvider({
    domain: "{YOUR_TENANT_AND_REGION}.auth0.com",
    clientId: "YOUR_CLIENT_ID",
    clientSecret: "YOUR_CLIENT_SECRET",
    organization: "org_123456789",
    audience: "https://api.example.com", // optional custom audience
});

const client = new MyOrganizationClient({
    domain: "{YOUR_TENANT_AND_REGION}.auth0.com",
    tokenProvider,
});
```

**Security Warning**: Server-side authentication methods should only be used in secure server environments where client secrets and private keys can be safely stored. Never expose these credentials in browser or SPA applications.

## Request and Response Types

The SDK exports all request and response types as TypeScript interfaces. You can import them directly:

```typescript
import { MyOrganizationClient, MyOrganization } from "@auth0/myorganization-js";

const client = new MyOrganizationClient({
    domain: "{YOUR_TENANT_AND_REGION}.auth0.com",
    token: "YOUR_ACCESS_TOKEN",
});

// Use the request type
const request: MyOrganization.CreateOrganizationDomainRequestContent = {
    domain: "acme.com",
};

await client.organization.domains.create(request);
```

## API Reference

### Generated Documentation

- [Full Reference](./reference.md) - complete API reference guide

### Key Classes

- **MyOrganizationClient** - for managing organization details, domains, identity providers, and configuration

## Framework Examples

Comprehensive examples demonstrating how to use the MyOrganization SDK across different frameworks:

### 🚀 Server-Side

- **[Express TypeScript](./examples/express-typescript/)** - Core organization management REST API with domain and identity provider workflows
- **[Node.js TypeScript](./examples/nodejs-typescript/)** - CLI tools and automation scripts
- **[Node.js JavaScript](./examples/nodejs-javascript/)** - Vanilla JavaScript scripts and automation tasks

### 🌐 Client-Side

- **[React SPA](./examples/react-spa/)** - React application with Auth0 React SDK integration and custom hooks
- **[Vanilla JavaScript SPA](./examples/vanilla-spa/)** - Pure JavaScript SPA with Auth0 SPA JS integration

Each example includes:

- ✅ Complete setup instructions
- ✅ Environment configuration templates
- ✅ Production-ready patterns
- ✅ Comprehensive error handling
- ✅ All SDK features demonstrated

**Quick start:**

```bash
cd examples/[example-name]
npm install
cp .env.example .env
# Configure .env with your Auth0 credentials
npm run dev
```

### Key Patterns

**Server-side (Express, Node.js):**

```typescript
import { createMyOrganizationClientWithClientCredentials } from "@auth0/myorganization-js/server";

const client = createMyOrganizationClientWithClientCredentials(
    { domain: "tenant.auth0.com" },
    {
        clientId: "YOUR_CLIENT_ID",
        clientSecret: "YOUR_CLIENT_SECRET",
        organization: "org_123456789",
    },
);
```

**Client-side (React, SPA) with automatic scope injection:**

```typescript
import { MyOrganizationClient } from "@auth0/myorganization-js";

const client = new MyOrganizationClient({
    domain: "tenant.auth0.com",
    // SDK automatically passes required scopes for each API call
    token: async ({ scope }) => {
        return await auth0.getTokenSilently({
            authorizationParams: {
                scope: `openid profile email ${scope}`,
                organization: "org_123456789",
            },
        });
    },
});
```

**[View all examples →](./examples/)**

## Exception Handling

When the API returns a non-success status code (4xx or 5xx response), a subclass of the following error will be thrown:

```typescript
import { MyOrganizationClient, MyOrganizationError } from "@auth0/myorganization-js";

const client = new MyOrganizationClient({
    domain: "{YOUR_TENANT_AND_REGION}.auth0.com",
    token: "YOUR_ACCESS_TOKEN",
});

try {
    await client.organization.domains.create({
        domain: "acme.com",
    });
} catch (err) {
    if (err instanceof MyOrganizationError) {
        console.log(err.statusCode);
        console.log(err.message);
        console.log(err.body);
        console.log(err.rawResponse);
    }
}
```

## Advanced

### Additional Headers

If you would like to send additional headers as part of the request, use the `headers` request option:

```typescript
const response = await client.organization.domains.create(
    {
        domain: "acme.com",
    },
    {
        headers: {
            "X-Custom-Header": "custom value",
        },
    },
);
```

### Additional Query String Parameters

If you would like to send additional query string parameters as part of the request, use the `queryParams` request option:

```typescript
const response = await client.organization.domains.create(
    {
        domain: "acme.com",
    },
    {
        queryParams: {
            customQueryParamKey: "custom query param value",
        },
    },
);
```

### Retries

The SDK is instrumented with automatic retries with exponential backoff. A request will be retried as long as the request is deemed retryable and the number of retry attempts has not grown larger than the configured retry limit (default: 2).

A request is deemed retryable when any of the following HTTP status codes is returned:

- [408](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/408) (Timeout)
- [429](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429) (Too Many Requests)
- [5XX](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500) (Internal Server Errors)

Use the `maxRetries` request option to configure this behavior:

```typescript
const response = await client.organization.domains.create(
    {
        domain: "acme.com",
    },
    {
        maxRetries: 0, // override maxRetries at the request level
    },
);
```

### Timeouts

The SDK defaults to a 60 second timeout. Use the `timeoutInSeconds` option to configure this behavior:

```typescript
const response = await client.organization.domains.create(
    {
        domain: "acme.com",
    },
    {
        timeoutInSeconds: 30, // override timeout to 30s
    },
);
```

### Aborting Requests

The SDK allows users to abort requests at any point by passing in an abort signal:

```typescript
const controller = new AbortController();
const response = await client.organization.domains.create(
    {
        domain: "acme.com",
    },
    {
        abortSignal: controller.signal,
    },
);
controller.abort(); // aborts the request
```

### Access Raw Response Data

The SDK provides access to raw response data, including headers, through the `.withRawResponse()` method. The `.withRawResponse()` method returns a promise that results to an object with a `data` and a `rawResponse` property:

```typescript
const { data, rawResponse } = await client.organization.domains
    .create({
        domain: "acme.com",
    })
    .withRawResponse();

console.log(data);
console.log(rawResponse.headers["X-My-Header"]);
```

### Runtime Compatibility

The SDK works in the following runtimes:

- Node.js 18 or higher
- Vercel
- Cloudflare Workers
- Deno v1.25+
- Bun 1.0+
- React Native

## Feedback

### Contributing

We appreciate feedback and contribution to this repo! Before you get started, please see the following:

- [Auth0's general contribution guidelines](https://github.com/auth0/open-source-template/blob/master/GENERAL-CONTRIBUTING.md)
- [Auth0's code of conduct guidelines](https://github.com/auth0/open-source-template/blob/master/CODE-OF-CONDUCT.md)

While we value open-source contributions to this SDK, this library is generated programmatically. Additions made directly to this library would have to be moved over to our generation code, otherwise they would be overwritten upon the next generated release. Feel free to open a PR as a proof of concept, but know that we will not be able to merge it as-is. We suggest opening an issue first to discuss with us!

On the other hand, contributions to the README are always very welcome!

### Raise an issue

To provide feedback or report a bug, please [raise an issue on our issue tracker](https://github.com/auth0/myorganization-js/issues).

### Vulnerability Reporting

Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## What is Auth0?

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://cdn.auth0.com/website/sdks/logos/auth0_dark_mode.png" width="150">
    <source media="(prefers-color-scheme: light)" srcset="https://cdn.auth0.com/website/sdks/logos/auth0_light_mode.png" width="150">
    <img alt="Auth0 Logo" src="https://cdn.auth0.com/website/sdks/logos/auth0_light_mode.png" width="150">
  </picture>
</p>
<p align="center">
  Auth0 is an easy to implement, adaptable authentication and authorization platform. To learn more checkout <a href="https://auth0.com/why-auth0">Why Auth0?</a>
</p>
<p align="center">
  Copyright 2026 Okta, Inc. This project is licensed under the <a href="./LICENSE">Apache License 2.0</a>. See the <a href="./LICENSE">LICENSE</a> file for details.
</p>
