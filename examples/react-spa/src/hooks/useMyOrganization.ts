/**
 * React Hook for Auth0 MyOrganization SDK
 *
 * This hook demonstrates the recommended pattern for integrating
 * the MyOrganization SDK with Auth0 React SDK using scope-aware tokens
 */

import { useAuth0 } from "@auth0/auth0-react";
import { MyOrganizationClient, MyOrganization } from "@auth0/myorganization-js";
import { useMemo, useCallback } from "react";

/**
 * Hook that provides a configured MyOrganization client
 *
 * Key features:
 * - Automatic scope injection for each API call
 * - Token refresh handling
 * - Organization context from Auth0
 */
export function useMyOrganization() {
    const { getAccessTokenSilently, getAccessTokenWithPopup, isAuthenticated } = useAuth0();

    // Create MyOrganization client with scope-aware token function
    const client = useMemo(() => {
        if (!isAuthenticated) {
            return null;
        }

        return new MyOrganizationClient({
            domain: import.meta.env.VITE_AUTH0_DOMAIN,
            // This is the recommended pattern: SDK passes required scopes automatically
            token: async ({ scope }) => {
                const authorizationParams = {
                    scope: `openid profile email ${scope}`,
                    organization: import.meta.env.VITE_AUTH0_ORGANIZATION,
                };
                try {
                    return await getAccessTokenSilently({ authorizationParams });
                } catch (error: any) {
                    // If silent token acquisition fails due to consent, fall back to a popup
                    // that only asks for consent (not a full re-login)
                    if (error?.error === "consent_required" || error?.message?.includes("Consent required")) {
                        const token = await getAccessTokenWithPopup({
                            authorizationParams: {
                                ...authorizationParams,
                                prompt: "consent",
                            },
                        });
                        if (!token) throw new Error("Failed to obtain access token via popup");
                        return token;
                    }
                    console.error("Failed to get access token:", error);
                    throw error;
                }
            },
        });
    }, [isAuthenticated, getAccessTokenSilently]);

    // Get organization details
    const getOrganizationDetails = useCallback(async () => {
        if (!client) throw new Error("Not authenticated");
        return await client.organizationDetails.get();
    }, [client]);

    // Update organization details
    const updateOrganizationDetails = useCallback(
        async (data: MyOrganization.UpdateOrganizationDetailsRequestContent) => {
            if (!client) throw new Error("Not authenticated");
            return await client.organizationDetails.update(data);
        },
        [client],
    );

    // List domains
    const listDomains = useCallback(async () => {
        if (!client) throw new Error("Not authenticated");
        return await client.organization.domains.list();
    }, [client]);

    // Create domain
    const createDomain = useCallback(
        async (domain: string) => {
            if (!client) throw new Error("Not authenticated");
            return await client.organization.domains.create({ domain });
        },
        [client],
    );

    // Verify domain
    const verifyDomain = useCallback(
        async (domainId: string) => {
            if (!client) throw new Error("Not authenticated");
            return await client.organization.domains.verify.create(domainId);
        },
        [client],
    );

    // Delete domain
    const deleteDomain = useCallback(
        async (domainId: string) => {
            if (!client) throw new Error("Not authenticated");
            return await client.organization.domains.delete(domainId);
        },
        [client],
    );

    return {
        client,
        isReady: !!client,
        // Organization Details
        getOrganizationDetails,
        updateOrganizationDetails,
        // Domains
        listDomains,
        createDomain,
        verifyDomain,
        deleteDomain,
    };
}
