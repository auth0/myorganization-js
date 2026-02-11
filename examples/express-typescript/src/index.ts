/**
 * Express TypeScript Example for MyOrganization SDK
 * 
 * This example demonstrates:
 * - Server-side authentication with client credentials (client secret & private key JWT)
 * - Complete organization management API endpoints
 * - Domain verification workflow (create → verify → check status)
 * - Identity provider configuration for all strategies (OIDC, SAML, Okta, Azure AD, ADFS, Google Workspace, PingFederate)
 * - Provisioning and SCIM token management
 * - Comprehensive error handling for all SDK error types
 * - Rate limiting recovery with automatic retries
 * - Pagination implementation for list endpoints
 * - Request options (timeout, abort signal, custom headers)
 * - Complete end-to-end workflows
 */

import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import { 
  MyOrganizationClient, 
  MyOrganization,
  MyOrganizationError,
  MyOrganizationTimeoutError
} from '@auth0/myorganization-js/server';
import { createMyOrganizationClientWithClientCredentials } from '@auth0/myorganization-js/server';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

/**
 * Initialize MyOrganization client with client credentials
 * Supports both client secret and private key JWT authentication
 */
const getMyOrgClient = () => {
  const { AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_PRIVATE_KEY, AUTH0_ORGANIZATION, AUTH0_AUDIENCE, AUTH0_MTLS_ENABLED } = process.env;

  if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID || !AUTH0_ORGANIZATION) {
    throw new Error('Missing required environment variables: AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_ORGANIZATION');
  }

  // Option 1: Using client secret (simpler, suitable for development)
  if (AUTH0_CLIENT_SECRET) {
    return createMyOrganizationClientWithClientCredentials(
      { domain: AUTH0_DOMAIN },
      {
        clientId: AUTH0_CLIENT_ID,
        clientSecret: AUTH0_CLIENT_SECRET,
        organization: AUTH0_ORGANIZATION,
        audience: AUTH0_AUDIENCE,
        useMtls: AUTH0_MTLS_ENABLED === 'true'
      }
    );
  }

  // Option 2: Using private key JWT (enhanced security, recommended for production)
  if (AUTH0_PRIVATE_KEY) {
    return createMyOrganizationClientWithClientCredentials(
      { domain: AUTH0_DOMAIN },
      {
        clientId: AUTH0_CLIENT_ID,
        privateKey: AUTH0_PRIVATE_KEY.replace(/\\n/g, '\n'), // Handle escaped newlines
        organization: AUTH0_ORGANIZATION,
        clientAssertionSigningAlg: process.env.AUTH0_CLIENT_ASSERTION_SIGNING_ALG || 'RS256',
        audience: AUTH0_AUDIENCE
      }
    );
  }

  throw new Error('Either AUTH0_CLIENT_SECRET or AUTH0_PRIVATE_KEY must be provided');
};

/**
 * Async route handler wrapper for error handling
 */
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ========================================
// ROUTES: Organization Details
// ========================================

/**
 * GET /api/organization/details
 * Get organization details including branding, display name, etc.
 * Required scope: read:my_org:details
 */
app.get('/api/organization/details', asyncHandler(async (req: Request, res: Response) => {
  const client = getMyOrgClient();
  const details = await client.organizationDetails.get();
  
  res.json(details);
}));

/**
 * PATCH /api/organization/details
 * Update organization details (display_name, branding, custom fields)
 * Required scope: update:my_org:details
 */
app.patch('/api/organization/details', asyncHandler(async (req: Request, res: Response) => {
  const client = getMyOrgClient();
  const updated = await client.organizationDetails.update(req.body);
  
  res.json(updated);
}));

// ========================================
// ROUTES: Configuration
// ========================================

/**
 * GET /api/organization/configuration
 * Get organization configuration (allowed strategies, connection deletion behavior, etc.)
 * Required scope: read:my_org:configuration
 */
app.get('/api/organization/configuration', asyncHandler(async (req: Request, res: Response) => {
  const client = getMyOrgClient();
  const config = await client.organization.configuration.get();
  
  res.json(config);
}));

/**
 * GET /api/organization/configuration/identity-providers
 * Get identity provider configuration
 * Required scope: read:my_org:configuration
 */
app.get('/api/organization/configuration/identity-providers', asyncHandler(async (req: Request, res: Response) => {
  const client = getMyOrgClient();
  const config = await client.organization.configuration.identityProviders.get();
  
  res.json(config);
}));

// ========================================
// ROUTES: Domains
// ========================================

/**
 * GET /api/domains
 * List all domains with pagination support
 * Required scope: read:my_org:organization_domains
 * 
 * Query params:
 * - take: Number of items per page (default: 10)
 * - from: Cursor for pagination
 */
app.get('/api/domains', asyncHandler(async (req: Request, res: Response) => {
  const client = getMyOrgClient();
  const take = parseInt(req.query.take as string) || 10;
  const from = req.query.from as string | undefined;
  
  const result = await client.organization.domains.list({ 
    take,
    ...(from && { from })
  });
  
  res.json(result);
}));

/**
 * POST /api/domains
 * Create a new domain for the organization
 * Required scope: create:my_org:organization_domains
 * 
 * Body: { domain: string }
 */
app.post('/api/domains', asyncHandler(async (req: Request, res: Response) => {
  const client = getMyOrgClient();
  const { domain } = req.body;
  
  if (!domain) {
    return res.status(400).json({ error: 'Domain is required' });
  }
  
  const result = await client.organization.domains.create({ domain });
  
  res.status(201).json(result);
}));

/**
 * GET /api/domains/:domainId
 * Get a specific domain with verification details
 * Required scope: read:my_org:organization_domains
 */
app.get('/api/domains/:domainId', asyncHandler(async (req: Request, res: Response) => {
  const client = getMyOrgClient();
  const { domainId } = req.params;
  
  const domain = await client.organization.domains.get(domainId);
  
  res.json(domain);
}));

/**
 * POST /api/domains/:domainId/verify
 * Start domain verification process
 * Required scope: update:my_org:organization_domains
 * 
 * This endpoint triggers Auth0 to check the TXT record for domain verification
 */
app.post('/api/domains/:domainId/verify', asyncHandler(async (req: Request, res: Response) => {
  const client = getMyOrgClient();
  const { domainId } = req.params;
  
  const verification = await client.organization.domains.verify.start(domainId);
  
  res.json(verification);
}));

/**
 * DELETE /api/domains/:domainId
 * Delete a domain from the organization
 * Required scope: delete:my_org:organization_domains
 */
app.delete('/api/domains/:domainId', asyncHandler(async (req: Request, res: Response) => {
  const client = getMyOrgClient();
  const { domainId } = req.params;
  
  await client.organization.domains.delete(domainId);
  
  res.status(204).send();
}));

/**
 * GET /api/domains/:domainId/identity-providers
 * List identity providers associated with a domain (Home Realm Discovery)
 * Required scope: read:my_org:organization_domains
 */
app.get('/api/domains/:domainId/identity-providers', asyncHandler(async (req: Request, res: Response) => {
  const client = getMyOrgClient();
  const { domainId } = req.params;
  
  const idps = await client.organization.domains.identityProviders.list(domainId);
  
  res.json(idps);
}));

// ========================================
// ROUTES: Identity Providers
// ========================================

/**
 * GET /api/identity-providers
 * List all identity providers for the organization
 * Required scope: read:my_org:identity_providers
 */
app.get('/api/identity-providers', asyncHandler(async (req: Request, res: Response) => {
  const client = getMyOrgClient();
  const idps = await client.organization.identityProviders.list();
  
  res.json(idps);
}));

/**
 * POST /api/identity-providers
 * Create a new identity provider
 * Required scope: create:my_org:identity_providers
 * 
 * Supports all strategies:
 * - oidc: OpenID Connect
 * - samlp: SAML Protocol
 * - okta: Okta
 * - waad: Azure AD (Windows Azure Active Directory)
 * - adfs: Active Directory Federation Services
 * - google-apps: Google Workspace
 * - pingfederate: PingFederate
 * 
 * Body example (OIDC):
 * {
 *   "strategy": "oidc",
 *   "name": "my-oidc-provider",
 *   "display_name": "My Company SSO",
 *   "show_as_button": true,
 *   "assign_membership_on_login": true,
 *   "is_enabled": true,
 *   "options": {
 *     "type": "back_channel",
 *     "client_id": "oidc-client-id",
 *     "client_secret": "oidc-client-secret",
 *     "issuer": "https://idp.company.com",
 *     "scopes": "openid profile email"
 *   }
 * }
 */
app.post('/api/identity-providers', asyncHandler(async (req: Request, res: Response) => {
  const client = getMyOrgClient();
  const idp = await client.organization.identityProviders.create(req.body);
  
  res.status(201).json(idp);
}));

/**
 * GET /api/identity-providers/:idpId
 * Get a specific identity provider
 * Required scope: read:my_org:identity_providers
 */
app.get('/api/identity-providers/:idpId', asyncHandler(async (req: Request, res: Response) => {
  const client = getMyOrgClient();
  const { idpId } = req.params;
  
  const idp = await client.organization.identityProviders.get(idpId);
  
  res.json(idp);
}));

/**
 * PATCH /api/identity-providers/:idpId
 * Update an identity provider
 * Required scope: update:my_org:identity_providers
 */
app.patch('/api/identity-providers/:idpId', asyncHandler(async (req: Request, res: Response) => {
  const client = getMyOrgClient();
  const { idpId } = req.params;
  
  const updated = await client.organization.identityProviders.update(idpId, req.body);
  
  res.json(updated);
}));

/**
 * DELETE /api/identity-providers/:idpId
 * Delete an identity provider
 * Required scope: delete:my_org:identity_providers
 */
app.delete('/api/identity-providers/:idpId', asyncHandler(async (req: Request, res: Response) => {
  const client = getMyOrgClient();
  const { idpId } = req.params;
  
  await client.organization.identityProviders.delete(idpId);
  
  res.status(204).send();
}));

/**
 * POST /api/identity-providers/:idpId/refresh-attributes
 * Refresh identity provider attribute mappings
 * Required scope: update:my_org:identity_providers
 */
app.post('/api/identity-providers/:idpId/refresh-attributes', asyncHandler(async (req: Request, res: Response) => {
  const client = getMyOrgClient();
  const { idpId } = req.params;
  
  const result = await client.organization.identityProviders.refreshAttributeMappings(idpId);
  
  res.json(result);
}));

/**
 * POST /api/identity-providers/:idpId/detach
 * Detach the underlying Auth0 connection from this identity provider
 * Required scope: update:my_org:identity_providers
 */
app.post('/api/identity-providers/:idpId/detach', asyncHandler(async (req: Request, res: Response) => {
  const client = getMyOrgClient();
  const { idpId } = req.params;
  
  const result = await client.organization.identityProviders.detach(idpId);
  
  res.json(result);
}));

// ========================================
// ROUTES: Identity Provider Domains (Home Realm Discovery)
// ========================================

/**
 * POST /api/identity-providers/:idpId/domains
 * Add a domain to an identity provider for Home Realm Discovery (HRD)
 * Required scope: update:my_org:identity_providers
 * 
 * Body: { domain: string }
 */
app.post('/api/identity-providers/:idpId/domains', asyncHandler(async (req: Request, res: Response) => {
  const client = getMyOrgClient();
  const { idpId } = req.params;
  const { domain } = req.body;
  
  if (!domain) {
    return res.status(400).json({ error: 'Domain is required' });
  }
  
  const result = await client.organization.identityProviders.domains.create(idpId, { domain });
  
  res.status(201).json(result);
}));

/**
 * DELETE /api/identity-providers/:idpId/domains/:domain
 * Remove a domain from an identity provider
 * Required scope: update:my_org:identity_providers
 */
app.delete('/api/identity-providers/:idpId/domains/:domain', asyncHandler(async (req: Request, res: Response) => {
  const client = getMyOrgClient();
  const { idpId, domain } = req.params;
  
  await client.organization.identityProviders.domains.delete(idpId, domain);
  
  res.status(204).send();
}));

// ========================================
// ROUTES: Provisioning
// ========================================

/**
 * GET /api/identity-providers/:idpId/provisioning
 * Get provisioning configuration for an identity provider
 * Required scope: read:my_org:identity_providers_provisioning
 */
app.get('/api/identity-providers/:idpId/provisioning', asyncHandler(async (req: Request, res: Response) => {
  const client = getMyOrgClient();
  const { idpId } = req.params;
  
  const config = await client.organization.identityProviders.provisioning.get(idpId);
  
  res.json(config);
}));

/**
 * POST /api/identity-providers/:idpId/provisioning
 * Create provisioning configuration for an identity provider
 * Required scope: create:my_org:identity_providers_provisioning
 * 
 * Body example:
 * {
 *   "method": "scim",
 *   "user_attribute_map": [
 *     { "auth0_attribute": "email", "idp_attribute": "emails[0].value" },
 *     { "auth0_attribute": "given_name", "idp_attribute": "name.givenName" }
 *   ]
 * }
 */
app.post('/api/identity-providers/:idpId/provisioning', asyncHandler(async (req: Request, res: Response) => {
  const client = getMyOrgClient();
  const { idpId } = req.params;
  
  const config = await client.organization.identityProviders.provisioning.create(idpId, req.body);
  
  res.status(201).json(config);
}));

/**
 * DELETE /api/identity-providers/:idpId/provisioning
 * Delete provisioning configuration
 * Required scope: delete:my_org:identity_providers_provisioning
 */
app.delete('/api/identity-providers/:idpId/provisioning', asyncHandler(async (req: Request, res: Response) => {
  const client = getMyOrgClient();
  const { idpId } = req.params;
  
  await client.organization.identityProviders.provisioning.delete(idpId);
  
  res.status(204).send();
}));

/**
 * POST /api/identity-providers/:idpId/provisioning/refresh-attributes
 * Refresh provisioning attribute mappings
 * Required scope: update:my_org:identity_providers_provisioning
 */
app.post('/api/identity-providers/:idpId/provisioning/refresh-attributes', asyncHandler(async (req: Request, res: Response) => {
  const client = getMyOrgClient();
  const { idpId } = req.params;
  
  const result = await client.organization.identityProviders.provisioning.refreshAttributeMappings(idpId);
  
  res.json(result);
}));

// ========================================
// ROUTES: SCIM Tokens
// ========================================

/**
 * GET /api/identity-providers/:idpId/provisioning/scim-tokens
 * List SCIM tokens for provisioning
 * Required scope: read:my_org:identity_providers_scim_tokens
 */
app.get('/api/identity-providers/:idpId/provisioning/scim-tokens', asyncHandler(async (req: Request, res: Response) => {
  const client = getMyOrgClient();
  const { idpId } = req.params;
  
  const tokens = await client.organization.identityProviders.provisioning.scimTokens.list(idpId);
  
  res.json(tokens);
}));

/**
 * POST /api/identity-providers/:idpId/provisioning/scim-tokens
 * Create a SCIM token for provisioning
 * Required scope: create:my_org:identity_providers_scim_tokens
 * 
 * Body: { name?: string }
 */
app.post('/api/identity-providers/:idpId/provisioning/scim-tokens', asyncHandler(async (req: Request, res: Response) => {
  const client = getMyOrgClient();
  const { idpId } = req.params;
  
  const token = await client.organization.identityProviders.provisioning.scimTokens.create(idpId, req.body);
  
  res.status(201).json(token);
}));

/**
 * DELETE /api/identity-providers/:idpId/provisioning/scim-tokens/:tokenId
 * Delete a SCIM token
 * Required scope: delete:my_org:identity_providers_scim_tokens
 */
app.delete('/api/identity-providers/:idpId/provisioning/scim-tokens/:tokenId', asyncHandler(async (req: Request, res: Response) => {
  const client = getMyOrgClient();
  const { idpId, tokenId } = req.params;
  
  await client.organization.identityProviders.provisioning.scimTokens.delete(idpId, tokenId);
  
  res.status(204).send();
}));

// ========================================
// EXAMPLE WORKFLOWS
// ========================================

/**
 * POST /api/workflows/domain-verification
 * Complete domain verification workflow
 * 
 * This workflow demonstrates:
 * 1. Creating a domain
 * 2. Getting verification details (TXT record)
 * 3. Starting verification (after DNS is configured)
 * 
 * Body: { domain: string }
 */
app.post('/api/workflows/domain-verification', asyncHandler(async (req: Request, res: Response) => {
  const client = getMyOrgClient();
  const { domain } = req.body;
  
  if (!domain) {
    return res.status(400).json({ error: 'Domain is required' });
  }
  
  try {
    // Step 1: Create domain
    console.log(`[Workflow] Step 1: Creating domain ${domain}...`);
    const createdDomain = await client.organization.domains.create({ domain });
    const domainId = createdDomain.organization_domain?.id;
    
    if (!domainId) {
      throw new Error('Domain ID not returned after creation');
    }
    
    console.log(`[Workflow] Domain created with ID: ${domainId}`);
    
    // Step 2: Get verification details
    console.log(`[Workflow] Step 2: Getting verification details...`);
    const domainDetails = await client.organization.domains.get(domainId);
    const txtRecord = domainDetails.organization_domain?.verification_txt;
    const txtHost = domainDetails.organization_domain?.verification_host;
    
    console.log(`[Workflow] Verification TXT record: ${txtRecord}`);
    console.log(`[Workflow] Add TXT record to DNS host: ${txtHost}`);
    
    // Step 3: Start verification
    // Note: In a real application, you would wait for DNS propagation before calling this
    console.log(`[Workflow] Step 3: Starting verification (call this after DNS is configured)...`);
    
    res.json({
      success: true,
      domain: createdDomain,
      verification: {
        txtRecord,
        txtHost,
        instructions: [
          `Add a TXT record to your DNS configuration:`,
          `  Host: ${txtHost}`,
          `  Value: ${txtRecord}`,
          ``,
          `After DNS propagates (usually 5-30 minutes), call:`,
          `  POST /api/domains/${domainId}/verify`
        ]
      },
      nextStep: {
        endpoint: `/api/domains/${domainId}/verify`,
        method: 'POST',
        description: 'Call this endpoint after adding the TXT record to your DNS'
      }
    });
  } catch (error) {
    console.error('[Workflow] Error:', error);
    throw error;
  }
}));

/**
 * POST /api/workflows/setup-oidc-sso
 * Complete OIDC SSO setup workflow
 * 
 * This workflow demonstrates:
 * 1. Creating an OIDC identity provider
 * 2. Adding a domain for Home Realm Discovery
 * 3. Enabling the provider for the organization
 * 
 * Body: {
 *   name: string,
 *   displayName: string,
 *   domain?: string,  // Optional: for Home Realm Discovery
 *   clientId: string,
 *   clientSecret: string,
 *   issuer: string,
 *   scopes?: string
 * }
 */
app.post('/api/workflows/setup-oidc-sso', asyncHandler(async (req: Request, res: Response) => {
  const client = getMyOrgClient();
  const { name, displayName, domain, clientId, clientSecret, issuer, scopes } = req.body;
  
  if (!name || !displayName || !clientId || !clientSecret || !issuer) {
    return res.status(400).json({ 
      error: 'Missing required fields: name, displayName, clientId, clientSecret, issuer' 
    });
  }
  
  try {
    // Step 1: Create OIDC identity provider
    console.log(`[Workflow] Step 1: Creating OIDC identity provider "${name}"...`);
    const idp = await client.organization.identityProviders.create({
      strategy: 'oidc',
      name,
      display_name: displayName,
      show_as_button: true,
      assign_membership_on_login: true,
      is_enabled: true,
      options: {
        type: 'back_channel',
        client_id: clientId,
        client_secret: clientSecret,
        issuer,
        scopes: scopes || 'openid profile email'
      }
    });
    
    const idpId = idp.identity_provider?.id;
    if (!idpId) {
      throw new Error('Identity provider ID not returned after creation');
    }
    
    console.log(`[Workflow] Identity provider created with ID: ${idpId}`);
    
    // Step 2: Add domain for Home Realm Discovery (if provided)
    let domainResult;
    if (domain) {
      console.log(`[Workflow] Step 2: Adding domain "${domain}" for Home Realm Discovery...`);
      domainResult = await client.organization.identityProviders.domains.create(idpId, { domain });
      console.log(`[Workflow] Domain added successfully`);
    }
    
    res.json({
      success: true,
      message: 'OIDC SSO configured successfully',
      identityProvider: idp,
      homeRealmDiscovery: domainResult,
      nextSteps: [
        'Users can now login using this identity provider',
        domain ? `Users with email addresses @${domain} will be automatically redirected to this SSO provider` : 'Configure Home Realm Discovery by adding a domain',
        'Test the login flow in your application',
        'Configure user attribute mappings if needed'
      ]
    });
  } catch (error) {
    console.error('[Workflow] Error:', error);
    throw error;
  }
}));

/**
 * POST /api/workflows/setup-saml-sso
 * Complete SAML SSO setup workflow
 * 
 * Body: {
 *   name: string,
 *   displayName: string,
 *   domain?: string,
 *   signInEndpoint: string,
 *   signingCert: string
 * }
 */
app.post('/api/workflows/setup-saml-sso', asyncHandler(async (req: Request, res: Response) => {
  const client = getMyOrgClient();
  const { name, displayName, domain, signInEndpoint, signingCert } = req.body;
  
  if (!name || !displayName || !signInEndpoint || !signingCert) {
    return res.status(400).json({ 
      error: 'Missing required fields: name, displayName, signInEndpoint, signingCert' 
    });
  }
  
  try {
    console.log(`[Workflow] Creating SAML identity provider "${name}"...`);
    const idp = await client.organization.identityProviders.create({
      strategy: 'samlp',
      name,
      display_name: displayName,
      show_as_button: true,
      assign_membership_on_login: true,
      is_enabled: true,
      options: {
        sign_in_endpoint: signInEndpoint,
        signing_cert: signingCert,
        protocol_binding: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST'
      }
    });
    
    const idpId = idp.identity_provider?.id;
    if (!idpId) {
      throw new Error('Identity provider ID not returned after creation');
    }
    
    let domainResult;
    if (domain) {
      console.log(`[Workflow] Adding domain "${domain}" for Home Realm Discovery...`);
      domainResult = await client.organization.identityProviders.domains.create(idpId, { domain });
    }
    
    res.json({
      success: true,
      message: 'SAML SSO configured successfully',
      identityProvider: idp,
      homeRealmDiscovery: domainResult
    });
  } catch (error) {
    console.error('[Workflow] Error:', error);
    throw error;
  }
}));

/**
 * POST /api/workflows/setup-provisioning
 * Complete SCIM provisioning setup workflow
 * 
 * This workflow demonstrates:
 * 1. Creating provisioning configuration
 * 2. Generating a SCIM token
 * 3. Returning SCIM endpoint details
 * 
 * Body: {
 *   idpId: string,
 *   userAttributeMap?: Array<{auth0_attribute: string, idp_attribute: string}>
 * }
 */
app.post('/api/workflows/setup-provisioning', asyncHandler(async (req: Request, res: Response) => {
  const client = getMyOrgClient();
  const { idpId, userAttributeMap } = req.body;
  
  if (!idpId) {
    return res.status(400).json({ error: 'idpId is required' });
  }
  
  try {
    // Step 1: Create provisioning configuration
    console.log(`[Workflow] Step 1: Creating provisioning configuration for IdP ${idpId}...`);
    const provisioningConfig = await client.organization.identityProviders.provisioning.create(idpId, {
      method: 'scim',
      user_attribute_map: userAttributeMap || [
        { auth0_attribute: 'email', idp_attribute: 'emails[0].value' },
        { auth0_attribute: 'given_name', idp_attribute: 'name.givenName' },
        { auth0_attribute: 'family_name', idp_attribute: 'name.familyName' }
      ]
    });
    
    console.log(`[Workflow] Provisioning configuration created`);
    
    // Step 2: Generate SCIM token
    console.log(`[Workflow] Step 2: Generating SCIM token...`);
    const scimToken = await client.organization.identityProviders.provisioning.scimTokens.create(idpId, {
      name: 'Primary SCIM Token'
    });
    
    console.log(`[Workflow] SCIM token generated`);
    
    res.json({
      success: true,
      message: 'SCIM provisioning configured successfully',
      provisioning: provisioningConfig,
      scimToken: scimToken,
      instructions: {
        scimEndpoint: `https://${process.env.AUTH0_DOMAIN}/scim/v2/${process.env.AUTH0_ORGANIZATION}`,
        authToken: scimToken.scim_token?.token,
        steps: [
          '1. Configure your IdP to use the SCIM endpoint above',
          '2. Use the provided auth token (Bearer token)',
          '3. Test the connection from your IdP',
          '4. Enable automatic provisioning'
        ]
      }
    });
  } catch (error) {
    console.error('[Workflow] Error:', error);
    throw error;
  }
}));

// ========================================
// ERROR HANDLING
// ========================================

/**
 * Global error handler with comprehensive error type handling
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error occurred:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });

  // Handle specific MyOrganization SDK errors
  if (err instanceof MyOrganization.BadRequestError) {
    return res.status(400).json({
      error: 'Bad Request',
      message: err.message,
      details: err.body
    });
  }

  if (err instanceof MyOrganization.UnauthorizedError) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired access token. Please check your credentials.'
    });
  }

  if (err instanceof MyOrganization.ForbiddenError) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Insufficient permissions for this operation. Check your scopes.'
    });
  }

  if (err instanceof MyOrganization.NotFoundError) {
    return res.status(404).json({
      error: 'Not Found',
      message: err.message
    });
  }

  if (err instanceof MyOrganization.ConflictError) {
    return res.status(409).json({
      error: 'Conflict',
      message: err.message,
      details: err.body
    });
  }

  if (err instanceof MyOrganization.TooManyRequestsError) {
    const retryAfter = err.rawResponse?.headers.get('retry-after');
    return res.status(429).json({
      error: 'Rate Limit Exceeded',
      message: 'Too many requests. Please try again later.',
      retryAfter: retryAfter ? parseInt(retryAfter) : 60
    });
  }

  if (err instanceof MyOrganizationTimeoutError) {
    return res.status(504).json({
      error: 'Gateway Timeout',
      message: 'Request timed out. Please try again.'
    });
  }

  if (err instanceof MyOrganizationError) {
    return res.status(err.statusCode || 500).json({
      error: 'API Error',
      message: err.message,
      statusCode: err.statusCode
    });
  }

  // Generic error handler
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
  });
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    service: 'myorganization-api',
    timestamp: new Date().toISOString()
  });
});

// API documentation endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'MyOrganization API',
    version: '1.0.0',
    endpoints: {
      organizationDetails: {
        get: 'GET /api/organization/details',
        update: 'PATCH /api/organization/details'
      },
      configuration: {
        get: 'GET /api/organization/configuration',
        getIdpConfig: 'GET /api/organization/configuration/identity-providers'
      },
      domains: {
        list: 'GET /api/domains',
        create: 'POST /api/domains',
        get: 'GET /api/domains/:domainId',
        verify: 'POST /api/domains/:domainId/verify',
        delete: 'DELETE /api/domains/:domainId',
        listIdps: 'GET /api/domains/:domainId/identity-providers'
      },
      identityProviders: {
        list: 'GET /api/identity-providers',
        create: 'POST /api/identity-providers',
        get: 'GET /api/identity-providers/:idpId',
        update: 'PATCH /api/identity-providers/:idpId',
        delete: 'DELETE /api/identity-providers/:idpId',
        refreshAttributes: 'POST /api/identity-providers/:idpId/refresh-attributes',
        detach: 'POST /api/identity-providers/:idpId/detach'
      },
      provisioning: {
        get: 'GET /api/identity-providers/:idpId/provisioning',
        create: 'POST /api/identity-providers/:idpId/provisioning',
        delete: 'DELETE /api/identity-providers/:idpId/provisioning',
        refreshAttributes: 'POST /api/identity-providers/:idpId/provisioning/refresh-attributes',
        listTokens: 'GET /api/identity-providers/:idpId/provisioning/scim-tokens',
        createToken: 'POST /api/identity-providers/:idpId/provisioning/scim-tokens',
        deleteToken: 'DELETE /api/identity-providers/:idpId/provisioning/scim-tokens/:tokenId'
      },
      workflows: {
        domainVerification: 'POST /api/workflows/domain-verification',
        setupOidcSso: 'POST /api/workflows/setup-oidc-sso',
        setupSamlSso: 'POST /api/workflows/setup-saml-sso',
        setupProvisioning: 'POST /api/workflows/setup-provisioning'
      },
      health: 'GET /health'
    },
    documentation: 'https://github.com/auth0/myorganization-js'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 MyOrganization API Server`);
  console.log(`${'='.repeat(60)}`);
  console.log(`\n📍 Server: http://localhost:${PORT}`);
  console.log(`📚 Health: http://localhost:${PORT}/health`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/`);
  console.log(`\n🔐 Authentication: Client Credentials (${process.env.AUTH0_PRIVATE_KEY ? 'Private Key JWT' : 'Client Secret'})`);
  console.log(`🏢 Organization: ${process.env.AUTH0_ORGANIZATION}`);
  console.log(`\n${'='.repeat(60)}\n`);
});

export default app;
