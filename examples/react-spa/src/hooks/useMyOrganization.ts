/**
 * React Hook for Auth0 MyOrganization SDK
 * 
 * This hook demonstrates the recommended pattern for integrating
 * the MyOrganization SDK with Auth0 React SDK using scope-aware tokens
 */

import { useAuth0 } from '@auth0/auth0-react';
import { MyOrganizationClient, MyOrganization } from '@auth0/myorganization-js';
import { useMemo, useCallback } from 'react';

/**
 * Hook that provides a configured MyOrganization client
 * 
 * Key features:
 * - Automatic scope injection for each API call
 * - Token refresh handling
 * - Organization context from Auth0
 */
export function useMyOrganization() {
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();

  // Create MyOrganization client with scope-aware token function
  const client = useMemo(() => {
    if (!isAuthenticated) {
      return null;
    }

    return new MyOrganizationClient({
      domain: import.meta.env.VITE_AUTH0_DOMAIN,
      // This is the recommended pattern: SDK passes required scopes automatically
      token: async ({ scope }) => {
        try {
          const token = await getAccessTokenSilently({
            authorizationParams: {
              // Combine default scopes with SDK-provided scopes
              scope: `openid profile email ${scope}`,
              organization: import.meta.env.VITE_AUTH0_ORGANIZATION
            }
          });
          return token;
        } catch (error) {
          console.error('Failed to get access token:', error);
          throw error;
        }
      }
    });
  }, [isAuthenticated, getAccessTokenSilently]);

  // Get organization details
  const getOrganizationDetails = useCallback(async () => {
    if (!client) throw new Error('Not authenticated');
    return await client.organizationDetails.get();
  }, [client]);

  // Update organization details
  const updateOrganizationDetails = useCallback(async (
    data: MyOrganization.UpdateOrganizationDetailsRequestContent
  ) => {
    if (!client) throw new Error('Not authenticated');
    return await client.organizationDetails.update(data);
  }, [client]);

  // List domains with pagination
  const listDomains = useCallback(async (options?: { take?: number; from?: string }) => {
    if (!client) throw new Error('Not authenticated');
    return await client.organization.domains.list(options);
  }, [client]);

  // Create domain
  const createDomain = useCallback(async (domain: string) => {
    if (!client) throw new Error('Not authenticated');
    return await client.organization.domains.create({ domain });
  }, [client]);

  // Verify domain
  const verifyDomain = useCallback(async (domainId: string) => {
    if (!client) throw new Error('Not authenticated');
    return await client.organization.domains.verify.start(domainId);
  }, [client]);

  // Delete domain
  const deleteDomain = useCallback(async (domainId: string) => {
    if (!client) throw new Error('Not authenticated');
    return await client.organization.domains.delete(domainId);
  }, [client]);

  // List identity providers
  const listIdentityProviders = useCallback(async () => {
    if (!client) throw new Error('Not authenticated');
    return await client.organization.identityProviders.list();
  }, [client]);

  // Create identity provider
  const createIdentityProvider = useCallback(async (
    data: MyOrganization.CreateIdentityProviderRequestContent
  ) => {
    if (!client) throw new Error('Not authenticated');
    return await client.organization.identityProviders.create(data);
  }, [client]);

  // Update identity provider
  const updateIdentityProvider = useCallback(async (
    idpId: string,
    data: MyOrganization.UpdateIdentityProviderRequestContent
  ) => {
    if (!client) throw new Error('Not authenticated');
    return await client.organization.identityProviders.update(idpId, data);
  }, [client]);

  // Delete identity provider
  const deleteIdentityProvider = useCallback(async (idpId: string) => {
    if (!client) throw new Error('Not authenticated');
    return await client.organization.identityProviders.delete(idpId);
  }, [client]);

  return {
    client,
    isReady: !!client,
    user,
    // Organization Details
    getOrganizationDetails,
    updateOrganizationDetails,
    // Domains
    listDomains,
    createDomain,
    verifyDomain,
    deleteDomain,
    // Identity Providers
    listIdentityProviders,
    createIdentityProvider,
    updateIdentityProvider,
    deleteIdentityProvider
  };
}
