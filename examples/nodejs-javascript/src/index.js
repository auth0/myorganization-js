/**
 * Node.js JavaScript Example for MyOrganization SDK
 *
 * This example demonstrates using the SDK in vanilla JavaScript (no TypeScript)
 * for simple scripts and automation tasks
 */

import "dotenv/config";
import { createMyOrganizationClientWithClientCredentials } from "@auth0/myorganization-js/server";

// Initialize client
function getClient() {
    const { AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_PRIVATE_KEY, AUTH0_ORGANIZATION } = process.env;

    if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID || !AUTH0_ORGANIZATION) {
        console.error("Missing required environment variables");
        process.exit(1);
    }

    // Using private key JWT (if available)
    if (AUTH0_PRIVATE_KEY) {
        return createMyOrganizationClientWithClientCredentials(
            { domain: AUTH0_DOMAIN },
            {
                clientId: AUTH0_CLIENT_ID,
                privateKey: AUTH0_PRIVATE_KEY.replace(/\\n/g, "\n"),
                organization: AUTH0_ORGANIZATION,
            },
        );
    }

    // Using client secret
    if (AUTH0_CLIENT_SECRET) {
        return createMyOrganizationClientWithClientCredentials(
            { domain: AUTH0_DOMAIN },
            {
                clientId: AUTH0_CLIENT_ID,
                clientSecret: AUTH0_CLIENT_SECRET,
                organization: AUTH0_ORGANIZATION,
            },
        );
    }

    throw new Error("Either AUTH0_CLIENT_SECRET or AUTH0_PRIVATE_KEY required");
}

// Example: Get organization details
async function getOrganizationDetails() {
    const client = getClient();

    try {
        const details = await client.organizationDetails.get();

        console.log("Organization details:");
        console.log(`ID: ${details.id}`);
        console.log(`Name: ${details.name}`);
        console.log(`Display Name: ${details.display_name || "-"}`);

        return details;
    } catch (error) {
        console.error("Error:", error.message);
        throw error;
    }
}

// Example: List domains
async function listDomains() {
    const client = getClient();

    try {
        const result = await client.organization.domains.list({ take: 10 });
        const domains = result.organization_domains || [];

        console.log(`Domains (${domains.length}):`);
        domains.forEach((domain) => {
            console.log(`${domain.domain} (${domain.status})`);
        });

        return domains;
    } catch (error) {
        console.error("Error:", error.message);
        throw error;
    }
}

// Example: Create a domain
async function createDomain(domainName) {
    const client = getClient();

    try {
        const result = await client.organization.domains.create({ domain: domainName });

        console.log("Domain created:");
        console.log(`ID: ${result.id}`);
        console.log(`Domain: ${result.domain}`);
        console.log(`Status: ${result.status}`);

        if (result.status === "pending") {
            console.log("Verification TXT record:");
            console.log(`Host: ${result.verification_host}`);
            console.log(`Value: ${result.verification_txt}`);
        }

        return result;
    } catch (error) {
        console.error("Error:", error.message);
        throw error;
    }
}

// Example: List identity providers
async function listIdentityProviders() {
    const client = getClient();

    try {
        const result = await client.organization.identityProviders.list();
        const idps = result.identity_providers || [];

        console.log(`Identity providers (${idps.length}):`);
        idps.forEach((idp) => {
            console.log(`${idp.display_name || idp.name} (${idp.strategy})`);
            console.log(`Status: ${idp.is_enabled ? "Enabled" : "Disabled"}`);
        });

        return idps;
    } catch (error) {
        console.error("Error:", error.message);
        throw error;
    }
}

// Example: Create OIDC identity provider
async function createOIDCProvider(config) {
    const client = getClient();

    try {
        const result = await client.organization.identityProviders.create({
            strategy: "oidc",
            name: config.name,
            display_name: config.displayName,
            show_as_button: true,
            assign_membership_on_login: true,
            is_enabled: true,
            options: {
                type: "back_channel",
                client_id: config.clientId,
                client_secret: config.clientSecret,
                discovery_url: config.discoveryUrl,
            },
        });

        console.log("Identity provider created:");
        console.log(`ID: ${result.id}`);
        console.log(`Name: ${result.display_name}`);

        return result;
    } catch (error) {
        console.error("Error:", error.message);
        throw error;
    }
}

// Main execution
async function main() {
    try {
        // Get organization details
        await getOrganizationDetails();

        // List domains
        await listDomains();

        // List identity providers
        await listIdentityProviders();
    } catch (error) {
        console.error("Script failed:", error.message);
        process.exit(1);
    }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

// Export functions for use in other scripts
export { getClient, getOrganizationDetails, listDomains, createDomain, listIdentityProviders, createOIDCProvider };
