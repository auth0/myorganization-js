# MyOrganization SDK - Vanilla JavaScript SPA Example with DPoP

Vanilla JavaScript single-page application demonstrating Auth0 MyOrganization SDK integration with `@auth0/auth0-spa-js` using **DPoP (Demonstrating Proof-of-Possession)** for enhanced token security.

DPoP binds access tokens to a cryptographic key pair, preventing token theft and replay attacks. The Auth0 SPA SDK's `createFetcher()` handles DPoP proof generation, nonce management, and automatic retries transparently.

## Prerequisites

- An Auth0 tenant with the **MyOrganization** feature enabled
- Node.js 18+

## Auth0 Dashboard Configuration

Before running this example you need to configure several things in the Auth0 Dashboard.

### 1. Enable the MyOrganization API

1. Go to **Applications > APIs** in the Auth0 Dashboard.
2. Locate the **MyOrganization API** (`https://<YOUR_DOMAIN>/my-org/`). If it does not exist, make sure MyOrganization is enabled on your tenant.
3. Open the API and confirm it is **Enabled**.
4. Under the **Permissions** tab, verify the required scopes are listed (e.g. `read:organization`, `update:organization`, `read:domains`, `create:domains`, `delete:domains`, `read:identity_providers`, `create:identity_providers`, `update:identity_providers`, `delete:identity_providers`).

### 2. Create a Single Page Application

1. Go to **Applications > Applications** and click **+ Create Application**.
2. Choose **Single Page Web Applications** and give it a name (e.g. "MyOrg Vanilla SPA").
3. On the **Settings** tab configure:
    - **Allowed Callback URLs**: `http://localhost:5173`
    - **Allowed Logout URLs**: `http://localhost:5173`
    - **Allowed Web Origins**: `http://localhost:5173`
4. Note down the **Domain** and **Client ID** — you will need them for the `.env` file.

### 3. Authorize the SPA to Access the MyOrganization API

1. Open the **MyOrganization API** settings (Applications > APIs).
2. Go to the **Machine to Machine Applications** tab (or the **Authorized Application** section).
3. Find the SPA you created and toggle it **on** (authorize it).
4. Select **all scopes** the application needs (or select all available scopes for the example).

### 4. Configure the Login Experience for Organizations

The application sends an `organization` parameter during login, so Auth0 must be configured to allow this.

1. Go to **Applications > Applications** and open your SPA.
2. Click the **Login Experience** tab.
3. Under **Types of Users**, select **Both** — this allows users to sign up with a personal account and also be affiliated with one or more organizations.
4. Under **Login Flow**, select **No Prompt** — the application handles sending the `organization` parameter itself, so Auth0 does not need to prompt the user for it.
5. Save your changes.

### 5. Create an Organization and Add Members

1. Go to **Organizations** in the Auth0 Dashboard.
2. Click **+ Create Organization** (or open an existing one).
3. Go to the **Members** tab and click **Add Members**. Add the user(s) that will log in to this example.
4. Note down the **Organization ID** (`org_...`) — you will need it for the `.env` file.

### 6. Define Roles and Assign to Members

The MyOrganization API uses roles to control what actions a user can perform. You must create a role with the required API permissions and assign it to your organization members.

1. Go to **User Management > Roles** in the Auth0 Dashboard.
2. Click **+ Create Role** and give it a name (e.g. "MyOrg Admin").
3. Open the role, go to the **Permissions** tab, and click **Add Permissions**.
4. Select the **MyOrganization API** (`https://<YOUR_DOMAIN>/my-org/`) from the dropdown.
5. Check all the permissions the role should have (e.g. `read:organization`, `update:organization`, `read:domains`, `create:domains`, `delete:domains`).
6. Click **Add Permissions**.
7. Now go to **Organizations**, open your organization, and go to the **Members** tab.
8. Click the **"..."** menu next to a member and select **Assign Roles**.
9. Select the role you created (e.g. "MyOrg Admin") and save.

> Without a role assigned, the user's access token will not include the scopes needed to call the MyOrganization API, and requests will fail with `403 Forbidden`.

### 7. Enable DPoP on the API

1. Open the **MyOrganization API** settings (Applications > APIs).
2. Go to the **Settings** tab.
3. Under **Token Settings**, set the **Token Endpoint Auth Method** or locate the **DPoP** section.
4. Enable **Require DPoP** (or "Allow DPoP") for this API.

> When DPoP is enabled, the API will reject Bearer tokens that are not accompanied by a valid DPoP proof. The Auth0 SPA SDK handles proof generation automatically via `createFetcher()`.

### 8. Configure Consent for the MyOrganization API

Auth0 shows a consent prompt when the callback URI is non-verifiable (e.g. `http://localhost`). This is controlled by the **Non-Verifiable Callback URI End-User Confirmation** setting.

**To avoid consent prompts during local development:**

1. Go to **Auth0 Dashboard > Settings > Advanced**.
2. Under **Non-Verifiable Callback URI End-User Confirmation**, toggle it **off**.

> **In production** with a verifiable (non-localhost) callback URI, consent prompts do not appear regardless of this setting, as long as "Allow Skipping User Consent" is enabled on the API (Applications > APIs > MyOrganization API > Settings).

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in this directory (you can copy from `.env.example`):

```bash
cp .env.example .env
```

Then fill in the values:

```bash
# Your Auth0 tenant domain
VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com

# The Client ID of the SPA application you created in step 2
VITE_AUTH0_CLIENT_ID=your-spa-client-id

# The Organization ID from step 5
VITE_AUTH0_ORGANIZATION=org_xxxxxxxxxxxxx

# The audience must match the MyOrganization API identifier from step 1
VITE_AUTH0_AUDIENCE=https://your-tenant.us.auth0.com/my-org/

# Redirect URIs (must match what you configured in step 2)
VITE_AUTH0_REDIRECT_URI=http://localhost:5173
VITE_AUTH0_LOGOUT_URI=http://localhost:5173
```

## Running

**Development:**

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

**Production build:**

```bash
npm run build
npm run preview
```

## Key Patterns

### Initialization with DPoP Fetcher

```javascript
import { createAuth0Client } from "@auth0/auth0-spa-js";
import { MyOrganizationClient } from "@auth0/myorganization-js";

// Initialize Auth0 client with DPoP enabled.
// useDpop: true → generates an ES256 key pair and binds tokens to it
// cacheLocation: "localstorage" → persists tokens so sessions survive page refreshes
const auth0 = await createAuth0Client({
    domain: "your-tenant.auth0.com",
    clientId: "your-client-id",
    useDpop: true,
    cacheLocation: "localstorage",
    authorizationParams: {
        organization: "org_123456789",
        audience: "https://your-tenant.auth0.com/my-org/",
    },
});

// createFetcher() returns a Fetcher that automatically:
// 1. Generates a DPoP proof JWT for each request (bound to HTTP method + URL)
// 2. Handles server nonce challenges (extracts dpop-nonce header, retries with nonce)
// 3. Attaches the DPoP token and proof to every outgoing request
//
// dpopNonceId is required to enable DPoP proof generation.
// It scopes the nonce storage so different APIs maintain separate nonces.
const fetcher = auth0.createFetcher({
    dpopNonceId: "__auth0_my_org_api__",
});

// Pass fetchWithAuth as the fetcher — it attaches the DPoP proof + token
// to every request the SDK makes. No separate "token" option needed.
const myOrgClient = new MyOrganizationClient({
    domain: "your-tenant.auth0.com",
    fetcher: fetcher.fetchWithAuth.bind(fetcher),
});
```

### Making API Calls

```javascript
// Get organization details
const details = await myOrgClient.organizationDetails.get();

// List domains
const domains = await myOrgClient.organization.domains.list();

// Create domain
await myOrgClient.organization.domains.create({ domain: "example.com" });
```

## Troubleshooting

| Problem                                     | Cause                                                                                            | Fix                                                                                                                                                                                                                                           |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Consent required` error                    | Using a localhost callback URI with "Non-Verifiable Callback URI End-User Confirmation" enabled. | Disable the setting in Auth0 Dashboard > Settings > Advanced, or use a non-localhost callback URI.                                                                                                                                            |
| `Login required` on every page load         | The SPA is not authorized for the organization, or the user is not a member.                     | Check the SPA's Organizations tab and add the user to the organization's Members list.                                                                                                                                                        |
| Opaque (non-JWT) access token               | No `audience` parameter is being sent.                                                           | Make sure `VITE_AUTH0_AUDIENCE` is set in `.env` and matches the API identifier.                                                                                                                                                              |
| `Unauthorized` from the MyOrganization API  | The SPA is not authorized to call the API, or the required scopes were not granted.              | Authorize the SPA on the API's Machine to Machine tab and select all scopes.                                                                                                                                                                  |
| `403 Forbidden` from the MyOrganization API | The user does not have a role with the required permissions assigned within the organization.    | Go to Organizations > your org > Members, click "..." next to the user, assign a role that includes the MyOrganization API permissions (see step 6).                                                                                          |
| `use_dpop_nonce` error                      | The API requires a DPoP nonce but the client didn't include one.                                 | This is handled automatically by `createFetcher()` — it extracts the nonce from the `dpop-nonce` response header and retries. If you see this persistently, ensure you are using `createFetcher()` and not manually constructing DPoP proofs. |
| `invalid_dpop_proof` error                  | The DPoP proof JWT is malformed or the key doesn't match.                                        | Ensure `useDpop: true` is set on `createAuth0Client`. Clear browser storage and try again — the DPoP key pair may be corrupted.                                                                                                               |
| Token works but API rejects with 401        | DPoP is enabled on the API but the request doesn't include a DPoP proof.                         | Make sure you are using `fetcher: fetcher.fetchWithAuth.bind(fetcher)` instead of the `token` option. The `token` pattern sends a plain Bearer token without DPoP proof.                                                                      |

## Security Notes

- Never include client secrets in a SPA — secrets are only for server-side applications.
- Always pass the `organization` parameter in authorization requests to scope tokens to the correct organization.
- The SDK handles scope management automatically; you do not need to hard-code scope strings for each API call.

## Learn More

- [Auth0 SPA JS SDK](https://github.com/auth0/auth0-spa-js)
- [MyOrganization SDK Documentation](../../README.md)
- [Vite Documentation](https://vitejs.dev/)
