# MyOrganization SDK - React SPA Example

React application demonstrating Auth0 MyOrganization SDK integration with `@auth0/auth0-react`.

## Prerequisites

- An Auth0 tenant with the **MyOrganization** feature enabled
- Node.js 18+

## Auth0 dashboard configuration

Before running this example you need to configure several things in the Auth0 Dashboard.

### 1. Enable the MyOrganization API

1. Navigate to **Applications > APIs** in the Auth0 Dashboard.
2. Locate the **MyOrganization API** (`https://<YOUR_DOMAIN>/my-org/`). If it does not exist, make sure MyOrganization is enabled on your tenant.
3. Open the API and confirm it is **Enabled**.
4. Under the **Permissions** tab, verify the required scopes are listed (e.g. `read:organization`, `update:organization`, `read:domains`, `create:domains`, `delete:domains`, `read:identity_providers`, `create:identity_providers`, `update:identity_providers`, `delete:identity_providers`).

### 2. Create a single page application

1. Navigate to **Applications > Applications** and click **+ Create Application**.
2. Choose **Single Page Web Applications** and give it a name (e.g. "MyOrg React SPA").
3. On the **Settings** tab configure:
    - **Allowed Callback URLs**: `http://localhost:5173`
    - **Allowed Logout URLs**: `http://localhost:5173`
    - **Allowed Web Origins**: `http://localhost:5173`
4. Note down the **Domain** and **Client ID** — you will need them for the `.env` file.

### 3. Authorize the SPA to access the MyOrganization API

1. Open the **MyOrganization API** settings (Applications > APIs).
2. Navigate to the **Machine to Machine Applications** tab (or the **Authorized Application** section).
3. Find the SPA you created and toggle it **on** (authorize it).
4. Select **all scopes** the application needs (or select all available scopes for the example).

### 4. Configure the login experience for organizations

The application sends an `organization` parameter during login, so Auth0 must be configured to allow this.

1. Navigate to **Applications > Applications** and open your SPA.
2. Click the **Login Experience** tab.
3. Under **Types of Users**, select **Both** — this allows users to sign up with a personal account and also be affiliated with one or more organizations.
4. Under **Login Flow**, select **No Prompt** — the application handles sending the `organization` parameter itself (via the Auth0Provider configuration), so Auth0 does not need to prompt the user for it.
5. Save your changes.

### 5. Create an organization and add members

1. Navigate to **Organizations** in the Auth0 Dashboard.
2. Click **+ Create Organization** (or open an existing one).
3. Navigate to the **Members** tab and click **Add Members**. Add the user(s) that will log in to this example.
4. Note down the **Organization ID** (`org_...`) — you will need it for the `.env` file.

### 6. Define roles and assign to members

The MyOrganization API uses roles to control what actions a user can perform. You must create a role with the required API permissions and assign it to your organization members.

1. Navigate to **User Management > Roles** in the Auth0 Dashboard.
2. Click **+ Create Role** and give it a name (e.g. "MyOrg Admin").
3. Open the role, navigate to the **Permissions** tab, and click **Add Permissions**.
4. Select the **MyOrganization API** (`https://<YOUR_DOMAIN>/my-org/`) from the dropdown.
5. Check all the permissions the role should have (e.g. `read:organization`, `update:organization`, `read:domains`, `create:domains`, `delete:domains`).
6. Click **Add Permissions**.
7. Now navigate to **Organizations**, open your organization, and navigate to the **Members** tab.
8. Click the **"..."** menu next to a member and select **Assign Roles**.
9. Select the role you created (e.g. "MyOrg Admin") and save.

> Without a role assigned, the user's access token will not include the scopes needed to call the MyOrganization API, and requests will fail with `403 Forbidden`.

### 7. Configure consent for the MyOrganization API

Because the SPA requests an `audience` parameter to receive a JWT access token, Auth0 may prompt the user for consent. To control this behavior:

1. Open the **MyOrganization API** settings (Applications > APIs).
2. Under **Settings**, toggle **Allow Skipping User Consent** to **on** if you want first-party applications to bypass the consent screen.

> If this toggle is left off, the first time a user's token is requested with new scopes Auth0 will show a consent prompt. The example handles this gracefully by falling back to a popup, but enabling the toggle provides a smoother experience.

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in this directory (you can copy from `.env.example` if available):

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

## Key patterns

### Custom hook with scope-aware tokens

The `useMyOrganization` hook creates a `MyOrganizationClient` that automatically requests the right scopes for each API call. If silent token acquisition fails (e.g. consent is required for new scopes), it falls back to a popup.

```typescript
import { useAuth0 } from "@auth0/auth0-react";
import { MyOrganizationClient } from "@auth0/myorganization-js";

export function useMyOrganization() {
    const { getAccessTokenSilently, getAccessTokenWithPopup } = useAuth0();

    const client = useMemo(() => {
        return new MyOrganizationClient({
            domain: import.meta.env.VITE_AUTH0_DOMAIN,
            token: async ({ scope }) => {
                const authorizationParams = {
                    scope: `openid profile email ${scope}`,
                    organization: import.meta.env.VITE_AUTH0_ORGANIZATION,
                };
                try {
                    return await getAccessTokenSilently({ authorizationParams });
                } catch (error: any) {
                    if (error?.error === "consent_required") {
                        const token = await getAccessTokenWithPopup({
                            authorizationParams: { ...authorizationParams, prompt: "consent" },
                        });
                        if (!token) throw new Error("Failed to obtain access token");
                        return token;
                    }
                    throw error;
                }
            },
        });
    }, [getAccessTokenSilently, getAccessTokenWithPopup]);

    return { client };
}
```

### Component example

```typescript
import { useMyOrganization } from "../hooks/useMyOrganization";

export function OrganizationDetails() {
    const { getOrganizationDetails } = useMyOrganization();
    const [details, setDetails] = useState(null);

    useEffect(() => {
        getOrganizationDetails().then(setDetails);
    }, []);

    return <div>{/* Render details */}</div>;
}
```

## Troubleshooting

| Problem                                     | Cause                                                                                                         | Fix                                                                                                                                                        |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Consent required` error                    | The MyOrganization API does not have "Allow Skipping User Consent" enabled and the user hasn't consented yet. | Enable the toggle on the API, or let the popup fallback handle it.                                                                                         |
| `Login required` on every page load         | The SPA is not authorized for the organization, or the user is not a member.                                  | Check the SPA's Organizations tab and add the user to the organization's Members list.                                                                     |
| Opaque (non-JWT) access token               | No `audience` parameter is being sent.                                                                        | Make sure `VITE_AUTH0_AUDIENCE` is set in `.env` and matches the API identifier.                                                                           |
| `Unauthorized` from the MyOrganization API  | The SPA is not authorized to call the API, or the required scopes were not granted.                           | Authorize the SPA on the API's Machine to Machine tab and select all scopes.                                                                               |
| `403 Forbidden` from the MyOrganization API | The user does not have a role with the required permissions assigned within the organization.                 | Navigate to Organizations > your org > Members, click "..." next to the user, assign a role that includes the MyOrganization API permissions (see step 6). |

## Security notes

- Never include client secrets in a SPA — secrets are only for server-side applications.
- Always pass the `organization` parameter in authorization requests to scope tokens to the correct organization.
- The SDK handles scope management automatically; you do not need to hard-code scope strings for each API call.

## Learn more

- [Auth0 React SDK](https://github.com/auth0/auth0-react)
- [MyOrganization SDK Documentation](../../README.md)
