/**
 * Auth0 MyOrganization SDK - Complete Usage Examples
 *
 * This file demonstrates both SPA and server-side usage patterns for the MyOrganizationClient.
 * The SDK provides secure separation between client-side and server-side authentication.
 */

// SPA applications - only import the main client
import { MyOrganizationClient } from "./src/wrappers/index.js";

// Server applications - import from server module
import { createMyOrganizationClientWithClientCredentials } from "./src/server.js";

/**
 * 🌐 SPA APPLICATION EXAMPLES (React, Vue, Angular, etc.)
 *
 * SPA users can only use token-based authentication - no client secrets exposed!
 */

// Example 1: SPA with static token
async function spaExampleWithStaticToken() {
    const client = new MyOrganizationClient({
        domain: "your-tenant.auth0.com", // Your Auth0 domain
        token: "your-user-access-token", // User's access token from Auth0 SPA SDK
    });

    try {
        // Get organization details that user has access to
        const orgDetails = await client.organizationDetails.get();
        console.log("Organization Details:", orgDetails);
    } catch (error) {
        console.error("Error:", error);
    }
}

// Example 2: SPA with dynamic token (recommended)
async function spaExampleWithDynamicToken() {
    const client = new MyOrganizationClient({
        domain: "your-tenant.auth0.com",
        token: () => getAccessTokenFromAuth0SPA(), // Function that returns fresh token
    });

    try {
        // Access organization APIs with user permissions
        const orgDetails = await client.organizationDetails.get();
        console.log("Organization Details:", orgDetails);
    } catch (error) {
        console.error("Error:", error);
    }
}

// Helper function for SPA token retrieval (integrate with @auth0/auth0-spa-js)
async function getAccessTokenFromAuth0SPA(): Promise<string> {
    // This would integrate with your Auth0 SPA SDK
    // return await auth0Client.getTokenSilently();
    return "user-access-token-from-spa-sdk";
}

// Example 3: SPA with scope-aware token function (Recommended for Auth0 SPAs)
async function spaExampleWithScopeAwareToken() {
    const client = new MyOrganizationClient({
        domain: "your-tenant.auth0.com",
        token: async ({ scope }) => {
            // This function receives the exact scopes required by each API endpoint
            // Perfect for Auth0 SPA SDK getTokenSilently pattern
            console.log("API endpoint requires scopes:", scope);

            // Example integration with @auth0/auth0-spa-js
            const token = await auth0.getTokenSilently({
                authorizationParams: {
                    scope: `openid profile email ${scope}`,
                },
            });

            return token;
        },
    });

    try {
        // Each API call automatically passes the required scopes to your token function
        console.log("=== Getting organization details ===");
        const orgDetails = await client.organizationDetails.get(); // Calls with org-specific scopes
        console.log("Organization Details:", orgDetails);

        console.log("\n=== Getting organization members ===");
        const members = await client.organization.members.list(); // Calls with member-specific scopes
        console.log("Organization Members:", members);

        console.log("\n=== Creating a member invitation ===");
        const invitation = await client.organization.invitations.create({
            // This endpoint might require different scopes than the read operations above
            invitee: {
                email: "newuser@example.com",
            },
            client_id: "your-client-id",
            connection_id: "con_2CZPv6IY0gWzDaQJ",
            ttl_sec: 3600,
            roles: ["rol_basic_member"],
            send_invitation_email: true,
        });
        console.log("Created invitation:", invitation);
    } catch (error) {
        console.error("Error:", error);
    }
}

// Example 5: Simplest pattern - Just pass your getAccessToken function
async function spaExampleWithDirectFunction() {
    // Even simpler! Just pass your getAccessToken function directly
    // The SDK automatically calls it with { scope: [...] }
    const client = new MyOrganizationClient({
        domain: "your-tenant.auth0.com",
        token: getAccessToken, // SDK handles scope passing automatically
    });

    try {
        console.log("=== Using direct function pattern ===");
        const orgDetails = await client.organizationDetails.get();
        console.log("Organization Details:", orgDetails);
    } catch (error) {
        console.error("Error:", error);
    }
}

// Your getAccessToken function - SDK automatically passes { scope } to it
async function getAccessToken({ scope }: { scope: string }) {
    console.log("getAccessToken called with scopes:", scope);

    // Your implementation can be anything - Auth0 SPA, custom auth, etc.
    return await auth0.getTokenSilently({
        authorizationParams: {
            scope: `openid profile email ${scope}`,
        },
    });
}

// Mock auth0 client for example (in real code, import from @auth0/auth0-spa-js)
const auth0 = {
    async getTokenSilently(options: { authorizationParams: { scope: string } }): Promise<string> {
        console.log(`🔐 Getting Auth0 SPA token with scope: "${options.authorizationParams.scope}"`);
        // In real implementation, this would return the actual access token
        return `auth0-spa-token-with-scopes-${Date.now()}`;
    },
};

/**
 * 🔒 SERVER-SIDE EXAMPLES (Node.js, serverless functions, etc.)
 *
 * Server users can use client credentials with the TokenProvider pattern.
 * Domain inheritance ensures no duplication!
 */

// Example 3: Server with client secret (most common)
async function serverExampleWithClientSecret() {
    // Option 1: Use the factory function (recommended)
    const client = createMyOrganizationClientWithClientCredentials(
        {
            domain: "your-tenant.auth0.com",
            clientInfo: {
                name: "my-server-app",
                version: "1.0.0",
            },
        },
        {
            clientId: "YOUR_CLIENT_ID",
            clientSecret: "YOUR_CLIENT_SECRET",
            organization: "org_123456789",
            // audience is optional - defaults to https://{domain}/my-org/
        },
    );

    // Option 2: Manual setup (if you need more control)
    // const tokenProvider = new ClientCredentialsTokenProvider({
    //     domain: 'your-tenant.auth0.com',
    //     clientId: 'YOUR_CLIENT_ID',
    //     clientSecret: 'YOUR_CLIENT_SECRET',
    //     organization: 'org_123456789'
    // });
    //
    // const client = new MyOrganizationClient({
    //     domain: 'your-tenant.auth0.com',
    //     tokenProvider: tokenProvider,
    //     clientInfo: {
    //         name: "my-server-app",
    //         version: "1.0.0"
    //     }
    // });

    try {
        // Server-side access with client credentials
        const orgDetails = await client.organizationDetails.get();
        console.log("Organization Details:", orgDetails);

        // Access organization members with server permissions
        const members = await client.organization.members.list();
        console.log("Organization Members count:", members);
    } catch (error) {
        console.error("Error:", error);
    }
}

// Example 4: Server with private key JWT (enhanced security)
async function serverExampleWithPrivateKey() {
    // Option 1: Use the factory function (recommended)
    const client = createMyOrganizationClientWithClientCredentials(
        { domain: "your-tenant.auth0.com" },
        {
            clientId: "YOUR_CLIENT_ID",
            privateKey: process.env.AUTH0_PRIVATE_KEY!, // Your RSA/ECDSA private key
            organization: "org_123456789",
            audience: "https://my-tenant.auth0.com/custom-api/", // Custom audience if needed
        },
    );

    // Option 2: Manual setup (if you need more control)
    // const tokenProvider = new ClientCredentialsTokenProvider({
    //     domain: 'your-tenant.auth0.com',
    //     clientId: 'YOUR_CLIENT_ID',
    //     privateKey: process.env.AUTH0_PRIVATE_KEY!,
    //     organization: 'org_123456789',
    //     audience: 'https://my-tenant.auth0.com/custom-api/'
    // });
    //
    // const client = new MyOrganizationClient({
    //     domain: 'your-tenant.auth0.com',
    //     tokenProvider: tokenProvider
    // });

    try {
        const orgDetails = await client.organizationDetails.get();
        console.log("Secure Organization Details:", orgDetails);
    } catch (error) {
        console.error("Error:", error);
    }
}

// Example 3: Initialize client with static token
async function exampleWithStaticToken() {
    const client = new MyOrganizationClient({
        token: "your-access-token-here", // Replace with your actual token
        domain: "your-tenant.auth0.com", // Replace with your Auth0 domain
        clientInfo: {
            name: "my-app",
            version: "1.0.0",
        },
    });

    try {
        // Get organization details
        const orgDetails = await client.organizationDetails.get();
        console.log("Organization Details:", orgDetails);

        // List organization members
        const members = await client.organization.members.list();
        console.log("Organization Members:", members);

        // Get organization configuration
        const config = await client.organization.configuration.get();
        console.log("Organization Configuration:", config);
    } catch (error) {
        console.error("Error:", error);
    }
}

/**
 * 🎯 MAIN EXECUTION AND BENEFITS
 */

// Main function to run examples
async function main() {
    console.log("=== Auth0 MyOrganization SDK Examples ===\n");

    console.log("🌐 SPA Examples (Browser-safe - no client secrets):");
    console.log("1. SPA with Static Token:");
    await spaExampleWithStaticToken();
    console.log("\n2. SPA with Dynamic Token:");
    await spaExampleWithDynamicToken();
    console.log("\n3. SPA with Scope-Aware Token:");
    await spaExampleWithScopeAwareToken();
    console.log("\n4. SPA with Direct Function:");
    await spaExampleWithDirectFunction();
    console.log("\n" + "=".repeat(50) + "\n");

    console.log("🔒 Server Examples (Client credentials via TokenProvider):");
    console.log("3. Server with Client Secret:");
    await serverExampleWithClientSecret();
    console.log("\n4. Server with Private Key JWT:");
    await serverExampleWithPrivateKey();

    console.log("\n✅ All examples completed!");
}

// Uncomment the line below to run the examples
// main().catch(console.error);

/**
 * 🔒 SECURITY GUARANTEE:
 *
 * ✅ SPA users importing '@auth0/myorganization-js' will NEVER see:
 *    - clientId, clientSecret, privateKey options in MyOrganizationClient
 *    - ClientCredentialsTokenProvider class
 *    - Any client credentials related interfaces
 *
 * ✅ These are ONLY available from '@auth0/myorganization-js/server' import!
 *
 * 🎯 PERFECT API:
 *    - Simple factory function: createMyOrganizationClientWithClientCredentials()
 *    - Or manual setup with TokenProvider constructor
 *    - Domain specified once, audience auto-generated or customizable
 *    - Clean separation between SPA and server usage!
 */

export {
    // SPA Examples
    spaExampleWithStaticToken,
    spaExampleWithDynamicToken,
    spaExampleWithScopeAwareToken,
    spaExampleWithDirectFunction,
    getAccessTokenFromAuth0SPA,
    getAccessToken,

    // Server Examples
    serverExampleWithClientSecret,
    serverExampleWithPrivateKey,

    // Main execution
    main,
};
