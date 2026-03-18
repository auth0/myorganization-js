/**
 * React Hook for Auth0 MyOrganization SDK with DPoP
 *
 * This hook demonstrates the recommended pattern for integrating
 * the MyOrganization SDK with Auth0 React SDK using DPoP
 * (Demonstrating Proof-of-Possession) for enhanced token security.
 *
 * Key DPoP features:
 * - Cryptographic proof that the sender possesses the private key bound to the token
 * - Automatic DPoP proof generation, nonce management, and retry via createFetcher()
 * - Protection against token theft and replay attacks
 */

import { useAuth0 } from "@auth0/auth0-react";
import { MyOrganizationClient, MyOrganization } from "@auth0/myorganization-js";
import { useMemo, useCallback } from "react";

/**
 * Hook that provides a configured MyOrganization client with DPoP
 *
 * Key features:
 * - DPoP proof generation and nonce management via createFetcher()
 * - Automatic token acquisition and scope injection
 * - Organization context from Auth0
 */
export function useMyOrganization() {
    const { isAuthenticated, createFetcher } = useAuth0();

    // createFetcher() returns a Fetcher that automatically:
    // 1. Generates a DPoP proof JWT for each request (bound to HTTP method + URL)
    // 2. Handles server nonce challenges (extracts dpop-nonce header, retries with nonce)
    // 3. Attaches the DPoP token and proof to every outgoing request
    //
    // dpopNonceId is required to enable DPoP proof generation on the fetcher.
    // It scopes the nonce storage so different APIs can maintain separate nonces.
    // Without it, the fetcher sends plain Bearer tokens (no DPoP proof).
    const client = useMemo(() => {
        if (!isAuthenticated) {
            return null;
        }

        const fetcher = createFetcher({
            dpopNonceId: "__auth0_my_org_api__",
        });

        // Pass fetchWithAuth as the fetcher — it attaches the DPoP proof + token
        // to every request the SDK makes. No separate "token" option needed.
        return new MyOrganizationClient({
            domain: import.meta.env.VITE_AUTH0_DOMAIN,
            fetcher: fetcher.fetchWithAuth.bind(fetcher),
        });
    }, [isAuthenticated, createFetcher]);

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
