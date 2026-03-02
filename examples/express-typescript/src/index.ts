/**
 * Express TypeScript Example for MyOrganization SDK
 *
 * This example demonstrates:
 * - Server-side authentication with client credentials (client secret & private key JWT)
 * - Organization details management (get and update)
 * - Domain management (list, create, get verification details, verify, delete)
 * - Identity provider management (list, create, get, update, delete)
 * - Domain verification workflow (create → get TXT record → verify)
 * - OIDC SSO setup workflow (create IdP + configure Home Realm Discovery)
 * - Comprehensive error handling for all SDK error types
 */

import express, { type Express, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import { MyOrganization, MyOrganizationError, MyOrganizationTimeoutError } from "@auth0/myorganization-js";
import { createMyOrganizationClientWithClientCredentials } from "@auth0/myorganization-js/server";

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

/**
 * Initialize MyOrganization client with client credentials.
 * Supports both private key JWT (production) and client secret (development).
 */
const getMyOrgClient = () => {
    const {
        AUTH0_DOMAIN,
        AUTH0_CLIENT_ID,
        AUTH0_CLIENT_SECRET,
        AUTH0_PRIVATE_KEY,
        AUTH0_ORGANIZATION,
        AUTH0_AUDIENCE,
    } = process.env;

    if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID || !AUTH0_ORGANIZATION) {
        throw new Error("Missing required environment variables: AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_ORGANIZATION");
    }

    // Option 1: Private key JWT (recommended for production)
    if (AUTH0_PRIVATE_KEY) {
        return createMyOrganizationClientWithClientCredentials(
            { domain: AUTH0_DOMAIN },
            {
                clientId: AUTH0_CLIENT_ID,
                privateKey: AUTH0_PRIVATE_KEY.replace(/\\n/g, "\n"), // Handle escaped newlines in env vars
                organization: AUTH0_ORGANIZATION,
                clientAssertionSigningAlg: process.env.AUTH0_CLIENT_ASSERTION_SIGNING_ALG || "RS256",
                audience: AUTH0_AUDIENCE,
            },
        );
    }

    // Option 2: Client secret (simpler, for development)
    if (AUTH0_CLIENT_SECRET) {
        return createMyOrganizationClientWithClientCredentials(
            { domain: AUTH0_DOMAIN },
            {
                clientId: AUTH0_CLIENT_ID,
                clientSecret: AUTH0_CLIENT_SECRET,
                organization: AUTH0_ORGANIZATION,
                audience: AUTH0_AUDIENCE,
            },
        );
    }

    throw new Error("Either AUTH0_CLIENT_SECRET or AUTH0_PRIVATE_KEY must be provided");
};

// Initialize client once at startup — fails fast if credentials are missing
const client = getMyOrgClient();

/**
 * Async route handler wrapper — ensures unhandled promise rejections
 * are forwarded to Express error middleware.
 */
type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;
const asyncHandler = (fn: AsyncRequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// ========================================
// ROUTES: Organization Details
// ========================================

/**
 * GET /api/organization/details
 * Get organization details (id, name, display_name, branding, etc.)
 * Required scope: read:my_org:details
 */
app.get(
    "/api/organization/details",
    asyncHandler(async (req: Request, res: Response) => {
        const details = await client.organizationDetails.get();
        res.json(details);
    }),
);

/**
 * PATCH /api/organization/details
 * Update organization details (display_name, branding colors/logo, etc.)
 * Required scope: update:my_org:details
 *
 * Body example:
 * {
 *   "display_name": "Acme Corporation",
 *   "branding": {
 *     "logo_url": "https://example.com/logo.png",
 *     "colors": { "primary": "#0066CC", "page_background": "#FFFFFF" }
 *   }
 * }
 */
app.patch(
    "/api/organization/details",
    asyncHandler(async (req: Request, res: Response) => {
        const updated = await client.organizationDetails.update(req.body);
        res.json(updated);
    }),
);

// ========================================
// ROUTES: Domains
// ========================================

/**
 * GET /api/domains
 * List all organization domains.
 * Required scope: read:my_org:organization_domains
 */
app.get(
    "/api/domains",
    asyncHandler(async (_req: Request, res: Response) => {
        const result = await client.organization.domains.list();

        res.json(result);
    }),
);

/**
 * POST /api/domains
 * Add a new domain to the organization.
 * Required scope: create:my_org:organization_domains
 *
 * Body: { "domain": "example.com" }
 *
 * The domain starts in "pending" status. Use GET /api/domains/:domainId
 * to retrieve the TXT record needed for DNS verification.
 */
app.post(
    "/api/domains",
    asyncHandler(async (req: Request, res: Response) => {
        const { domain } = req.body;

        if (!domain) {
            return res.status(400).json({ error: "domain is required" });
        }

        const result = await client.organization.domains.create({ domain });
        res.status(201).json(result);
    }),
);

/**
 * GET /api/domains/:domainId
 * Get a specific domain including its TXT verification record.
 * Required scope: read:my_org:organization_domains
 *
 * The response includes verification_host and verification_txt fields
 * that you must add as a DNS TXT record to verify ownership.
 */
app.get(
    "/api/domains/:domainId",
    asyncHandler(async (req: Request, res: Response) => {
        const { domainId } = req.params;
        const domain = await client.organization.domains.get(domainId);
        res.json(domain);
    }),
);

/**
 * POST /api/domains/:domainId/verify
 * Trigger domain ownership verification.
 * Required scope: update:my_org:organization_domains
 *
 * Auth0 will check for the TXT record in DNS. The domain must have had its
 * TXT record added (from GET /api/domains/:domainId) before calling this.
 */
app.post(
    "/api/domains/:domainId/verify",
    asyncHandler(async (req: Request, res: Response) => {
        const { domainId } = req.params;
        const verification = await client.organization.domains.verify.create(domainId);
        res.json(verification);
    }),
);

/**
 * DELETE /api/domains/:domainId
 * Remove a domain from the organization.
 * Required scope: delete:my_org:organization_domains
 */
app.delete(
    "/api/domains/:domainId",
    asyncHandler(async (req: Request, res: Response) => {
        const { domainId } = req.params;
        await client.organization.domains.delete(domainId);
        res.status(204).send();
    }),
);

// ========================================
// ROUTES: Identity Providers
// ========================================

/**
 * GET /api/identity-providers
 * List all identity providers for the organization.
 * Required scope: read:my_org:identity_providers
 */
app.get(
    "/api/identity-providers",
    asyncHandler(async (req: Request, res: Response) => {
        const idps = await client.organization.identityProviders.list();
        res.json(idps);
    }),
);

/**
 * POST /api/identity-providers
 * Create a new identity provider.
 * Required scope: create:my_org:identity_providers
 *
 * Supported strategies: oidc, samlp, okta, waad, adfs, google-apps, pingfederate
 *
 * Body example (OIDC):
 * {
 *   "strategy": "oidc",
 *   "name": "my-oidc-provider",
 *   "display_name": "Company SSO",
 *   "is_enabled": true,
 *   "options": {
 *     "type": "back_channel",
 *     "client_id": "oidc-client-id",
 *     "client_secret": "oidc-client-secret",
 *     "discovery_url": "https://auth0.auth0.com/.well-known/openid-configuration"
 *   }
 * }
 */
app.post(
    "/api/identity-providers",
    asyncHandler(async (req: Request, res: Response) => {
        const idp = await client.organization.identityProviders.create(req.body);
        res.status(201).json(idp);
    }),
);

/**
 * GET /api/identity-providers/:idpId
 * Get a specific identity provider.
 * Required scope: read:my_org:identity_providers
 */
app.get(
    "/api/identity-providers/:idpId",
    asyncHandler(async (req: Request, res: Response) => {
        const { idpId } = req.params;
        const idp = await client.organization.identityProviders.get(idpId);
        res.json(idp);
    }),
);

/**
 * PATCH /api/identity-providers/:idpId
 * Update an identity provider (display name, options, enabled status, etc.)
 * Required scope: update:my_org:identity_providers
 */
app.patch(
    "/api/identity-providers/:idpId",
    asyncHandler(async (req: Request, res: Response) => {
        const { idpId } = req.params;
        const updated = await client.organization.identityProviders.update(idpId, req.body);
        res.json(updated);
    }),
);

/**
 * DELETE /api/identity-providers/:idpId
 * Delete an identity provider.
 * Required scope: delete:my_org:identity_providers
 */
app.delete(
    "/api/identity-providers/:idpId",
    asyncHandler(async (req: Request, res: Response) => {
        const { idpId } = req.params;
        await client.organization.identityProviders.delete(idpId);
        res.status(204).send();
    }),
);

// ========================================
// WORKFLOWS: End-to-end examples
// ========================================

/**
 * POST /api/workflows/domain-verification
 * Complete domain verification workflow.
 *
 * Steps:
 * 1. Create a domain
 * 2. Return the TXT record details for DNS configuration
 * 3. After DNS propagates, call POST /api/domains/:domainId/verify
 *
 * Body: { "domain": "example.com" }
 */
app.post(
    "/api/workflows/domain-verification",
    asyncHandler(async (req: Request, res: Response) => {
        const { domain } = req.body;

        if (!domain) {
            return res.status(400).json({ error: "domain is required" });
        }

        // Step 1: Create the domain
        const createdDomain = await client.organization.domains.create({ domain });
        const domainId = createdDomain.id;

        if (!domainId) {
            throw new Error("Domain ID not returned after creation");
        }

        // Step 2: Get the TXT record needed for DNS verification
        const domainDetails = await client.organization.domains.get(domainId);
        const txtRecord = domainDetails.verification_txt;
        const txtHost = domainDetails.verification_host;

        res.json({
            success: true,
            domain: createdDomain,
            verification: {
                txtRecord,
                txtHost,
                instructions: [
                    `Add a DNS TXT record:`,
                    `  Host:  ${txtHost}`,
                    `  Value: ${txtRecord}`,
                    ``,
                    `After DNS propagates (usually 5–30 minutes), call:`,
                    `  POST /api/domains/${domainId}/verify`,
                ],
            },
            nextStep: {
                method: "POST",
                endpoint: `/api/domains/${domainId}/verify`,
                description: "Call once the TXT record has been added to DNS",
            },
        });
    }),
);

/**
 * POST /api/workflows/setup-oidc-sso
 * Complete OIDC SSO setup workflow.
 *
 * Steps:
 * 1. Create an OIDC identity provider
 * 2. Optionally add a domain for Home Realm Discovery (auto-route users by email domain)
 *
 * Body:
 * {
 *   "name": "my-oidc-provider",
 *   "displayName": "Company SSO",
 *   "clientId": "oidc-client-id",
 *   "clientSecret": "oidc-client-secret",
 *   "discoveryUrl": "https://auth0.auth0.com/.well-known/openid-configuration",
 *   "domain": "company.com"   // optional: enables Home Realm Discovery
 * }
 */
app.post(
    "/api/workflows/setup-oidc-sso",
    asyncHandler(async (req: Request, res: Response) => {
        const { name, displayName, domain, clientId, clientSecret, discoveryUrl } = req.body;

        if (!name || !displayName || !clientId || !clientSecret || !discoveryUrl) {
            return res.status(400).json({
                error: "Missing required fields: name, displayName, clientId, clientSecret, discoveryUrl",
            });
        }

        // Step 1: Create the OIDC identity provider
        const idp = await client.organization.identityProviders.create({
            strategy: "oidc",
            name,
            display_name: displayName,
            is_enabled: true,
            options: {
                type: "back_channel",
                client_id: clientId,
                client_secret: clientSecret,
                discovery_url: discoveryUrl,
            },
        });

        const oidcIdp = idp as MyOrganization.IdpOidcResponse;
        const idpId = oidcIdp.id;
        if (!idpId) {
            throw new Error("Identity provider ID not returned after creation");
        }

        // Step 2: Add a domain for Home Realm Discovery (optional)
        let hrdResult;
        if (domain) {
            hrdResult = await client.organization.identityProviders.domains.create(idpId, { domain });
        }

        res.json({
            success: true,
            message: "OIDC SSO configured successfully",
            identityProvider: idp,
            homeRealmDiscovery: hrdResult,
            nextSteps: [
                "Users can now log in via this identity provider",
                domain
                    ? `Users with @${domain} email addresses will be automatically routed to this SSO provider`
                    : "Add a domain via POST /api/identity-providers/:idpId/domains to enable Home Realm Discovery",
            ],
        });
    }),
);

// ========================================
// ERROR HANDLING
// ========================================

/**
 * Global error handler — maps SDK error types to appropriate HTTP responses.
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", {
        message: err.message,
        path: req.path,
        method: req.method,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });

    if (err instanceof MyOrganization.BadRequestError) {
        return res
            .status(400)
            .json({ error: "Bad Request", message: err.message, details: (err as MyOrganizationError).body });
    }

    if (err instanceof MyOrganization.UnauthorizedError) {
        return res.status(401).json({
            error: "Unauthorized",
            message: "Invalid or expired access token. Check your client credentials.",
        });
    }

    if (err instanceof MyOrganization.ForbiddenError) {
        return res.status(403).json({
            error: "Forbidden",
            message: "Insufficient permissions. Check the required scopes in your M2M application.",
        });
    }

    if (err instanceof MyOrganization.NotFoundError) {
        return res.status(404).json({ error: "Not Found", message: err.message });
    }

    if (err instanceof MyOrganization.ConflictError) {
        return res
            .status(409)
            .json({ error: "Conflict", message: err.message, details: (err as MyOrganizationError).body });
    }

    if (err instanceof MyOrganization.TooManyRequestsError) {
        const retryAfter = err.rawResponse?.headers.get("retry-after");
        return res.status(429).json({
            error: "Rate Limit Exceeded",
            message: "Too many requests. The SDK will retry automatically.",
            retryAfter: retryAfter ? parseInt(retryAfter) : 60,
        });
    }

    if (err instanceof MyOrganizationTimeoutError) {
        return res.status(504).json({ error: "Gateway Timeout", message: "Request timed out. Please try again." });
    }

    if (err instanceof MyOrganizationError) {
        return res.status(err.statusCode || 500).json({
            error: "API Error",
            message: err.message,
            statusCode: err.statusCode,
        });
    }

    res.status(500).json({
        error: "Internal Server Error",
        message: process.env.NODE_ENV === "development" ? err.message : "An unexpected error occurred",
    });
});

// ========================================
// UTILITIES
// ========================================

app.get("/health", (req: Request, res: Response) => {
    res.json({ status: "ok", service: "myorganization-api", timestamp: new Date().toISOString() });
});

app.get("/", (req: Request, res: Response) => {
    res.json({
        name: "MyOrganization API",
        version: "1.0.0",
        endpoints: {
            organizationDetails: {
                get: "GET /api/organization/details",
                update: "PATCH /api/organization/details",
            },
            domains: {
                list: "GET /api/domains",
                create: "POST /api/domains",
                get: "GET /api/domains/:domainId",
                verify: "POST /api/domains/:domainId/verify",
                delete: "DELETE /api/domains/:domainId",
            },
            identityProviders: {
                list: "GET /api/identity-providers",
                create: "POST /api/identity-providers",
                get: "GET /api/identity-providers/:idpId",
                update: "PATCH /api/identity-providers/:idpId",
                delete: "DELETE /api/identity-providers/:idpId",
            },
            workflows: {
                domainVerification: "POST /api/workflows/domain-verification",
                setupOidcSso: "POST /api/workflows/setup-oidc-sso",
            },
        },
        documentation: "https://github.com/auth0/myorganization-js",
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server:  http://localhost:${PORT}`);
    console.log(`Health:  http://localhost:${PORT}/health`);
    console.log(`Docs:    http://localhost:${PORT}/`);
    console.log(`Auth:    ${process.env.AUTH0_PRIVATE_KEY ? "Private Key JWT" : "Client Secret"}`);
    console.log(`Org:     ${process.env.AUTH0_ORGANIZATION}`);
});

export default app;
