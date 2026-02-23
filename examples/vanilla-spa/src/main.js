/**
 * Vanilla JavaScript SPA Example for MyOrganization SDK
 *
 * This example demonstrates how to use the MyOrganization SDK with Auth0 SPA JS
 * in a vanilla JavaScript application (no framework required).
 */

import { createAuth0Client } from "@auth0/auth0-spa-js";
import { MyOrganizationClient } from "@auth0/myorganization-js";

let auth0Client;
let myOrgClient;

// ========================================
// INITIALIZATION
// ========================================

/**
 * Initialize Auth0 and MyOrganization clients, then set up the UI.
 */
async function initializeClients() {
    try {
        auth0Client = await createAuth0Client({
            domain: import.meta.env.VITE_AUTH0_DOMAIN,
            clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
            authorizationParams: {
                redirect_uri: window.location.origin,
                organization: import.meta.env.VITE_AUTH0_ORGANIZATION,
            },
        });

        // Handle redirect callback after login
        if (window.location.search.includes("code=")) {
            await auth0Client.handleRedirectCallback();
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        const isAuthenticated = await auth0Client.isAuthenticated();

        if (isAuthenticated) {
            await setupMyOrganizationClient();
            showApp();
        } else {
            showUnauthenticatedState();
        }
    } catch (error) {
        console.error("Error initializing clients:", error);
        showError("Failed to initialize application. Check your configuration.");
    }
}

/**
 * Set up the MyOrganization client with a scope-aware token function.
 * The SDK automatically passes the required scopes for each API call.
 */
async function setupMyOrganizationClient() {
    myOrgClient = new MyOrganizationClient({
        domain: import.meta.env.VITE_AUTH0_DOMAIN,
        token: async ({ scope }) => {
            return await auth0Client.getTokenSilently({
                authorizationParams: {
                    scope: `openid profile email ${scope}`,
                    organization: import.meta.env.VITE_AUTH0_ORGANIZATION,
                },
            });
        },
    });
}

// ========================================
// AUTH FUNCTIONS
// ========================================

async function login() {
    try {
        await auth0Client.loginWithRedirect();
    } catch (error) {
        console.error("Login error:", error);
        showError("Login failed. Please try again.");
    }
}

async function logout() {
    try {
        await auth0Client.logout({
            logoutParams: { returnTo: window.location.origin },
        });
    } catch (error) {
        console.error("Logout error:", error);
    }
}

// ========================================
// UI STATE
// ========================================

/**
 * Show the unauthenticated state: welcome message visible, app hidden.
 */
function showUnauthenticatedState() {
    document.getElementById("login-message").classList.remove("hidden");
    document.getElementById("app").classList.add("hidden");
    document.getElementById("login-btn").classList.remove("hidden");
    document.getElementById("logout-btn").classList.add("hidden");

    document.getElementById("login-btn").addEventListener("click", login);
}

/**
 * Show the authenticated app: hide welcome message, show app content.
 */
function showApp() {
    document.getElementById("login-message").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    document.getElementById("login-btn").classList.add("hidden");
    document.getElementById("logout-btn").classList.remove("hidden");

    document.getElementById("logout-btn").addEventListener("click", logout);
    document.getElementById("add-domain-btn").addEventListener("click", addDomain);

    // Load data into the placeholder divs
    loadOrganizationDetails();
    loadDomains();
    loadIdentityProviders();
}

function showError(message) {
    const container = document.getElementById("error-container");
    container.innerHTML = `<div class="error">${message}</div>`;
    setTimeout(() => {
        container.innerHTML = "";
    }, 5000);
}

// ========================================
// ORGANIZATION DETAILS
// ========================================

async function loadOrganizationDetails() {
    const container = document.getElementById("org-details");
    container.innerHTML = '<p class="loading">Loading...</p>';

    try {
        const details = await myOrgClient.organizationDetails.get();

        container.innerHTML = `
      <dl>
        <dt><strong>ID:</strong></dt>
        <dd>${details.id || "—"}</dd>
        <dt><strong>Name:</strong></dt>
        <dd>${details.name || "—"}</dd>
        <dt><strong>Display Name:</strong></dt>
        <dd>${details.display_name || "—"}</dd>
      </dl>
    `;
    } catch (error) {
        console.error("Error loading organization details:", error);
        container.innerHTML = '<p class="error">Failed to load organization details.</p>';
    }
}

// ========================================
// DOMAINS
// ========================================

async function loadDomains() {
    const container = document.getElementById("domains-list");
    container.innerHTML = '<p class="loading">Loading...</p>';

    try {
        const result = await myOrgClient.organization.domains.list({ take: 20 });
        const domains = result.organization_domains || [];

        if (domains.length === 0) {
            container.innerHTML = '<p class="info-text">No domains yet. Add your first domain above.</p>';
            return;
        }

        container.innerHTML = domains
            .map(
                (domain) => `
      <div class="list-item">
        <div>
          <strong>${domain.domain}</strong>
          <span class="badge ${domain.status === "verified" ? "badge-success" : "badge-warning"}">
            ${domain.status}
          </span>
        </div>
        <div class="actions">
          ${
              domain.status === "pending"
                  ? `
            <button class="btn btn-secondary" onclick="getDomainVerification('${domain.id}')">Get TXT Record</button>
            <button class="btn btn-secondary" onclick="verifyDomain('${domain.id}')">Verify</button>
          `
                  : ""
          }
          <button class="btn btn-danger" onclick="deleteDomain('${domain.id}')">Delete</button>
        </div>
      </div>
    `,
            )
            .join("");
    } catch (error) {
        console.error("Error loading domains:", error);
        container.innerHTML = '<p class="error">Failed to load domains.</p>';
    }
}

async function addDomain() {
    const input = document.getElementById("new-domain");
    const domain = input.value.trim();

    if (!domain) {
        showError("Please enter a domain name.");
        return;
    }

    try {
        await myOrgClient.organization.domains.create({ domain });
        input.value = "";
        await loadDomains();
    } catch (error) {
        console.error("Error adding domain:", error);
        showError("Failed to add domain. It may already exist.");
    }
}

async function getDomainVerification(domainId) {
    try {
        const details = await myOrgClient.organization.domains.get(domainId);
        alert(
            `Add this TXT record to your DNS:\n\n` +
                `Host:  ${details.verification_host}\n` +
                `Value: ${details.verification_txt}\n\n` +
                `After DNS propagates (5–30 min), click Verify.`,
        );
    } catch (error) {
        console.error("Error getting domain verification:", error);
        showError("Failed to get verification details.");
    }
}

async function verifyDomain(domainId) {
    try {
        await myOrgClient.organization.domains.verify.start(domainId);
        await loadDomains();
    } catch (error) {
        console.error("Error verifying domain:", error);
        showError("Verification failed. Ensure the TXT record has propagated.");
    }
}

async function deleteDomain(domainId) {
    if (!confirm("Delete this domain?")) return;

    try {
        await myOrgClient.organization.domains.delete(domainId);
        await loadDomains();
    } catch (error) {
        console.error("Error deleting domain:", error);
        showError("Failed to delete domain.");
    }
}

// ========================================
// IDENTITY PROVIDERS
// ========================================

async function loadIdentityProviders() {
    const container = document.getElementById("idps-list");
    container.innerHTML = '<p class="loading">Loading...</p>';

    try {
        const result = await myOrgClient.organization.identityProviders.list();
        const idps = result.identity_providers || [];

        if (idps.length === 0) {
            container.innerHTML = '<p class="info-text">No identity providers configured.</p>';
            return;
        }

        container.innerHTML = idps
            .map(
                (idp) => `
      <div class="list-item">
        <div>
          <strong>${idp.display_name || idp.name}</strong>
          <span class="badge badge-info">${idp.strategy}</span>
          <span class="badge ${idp.is_enabled ? "badge-success" : "badge-warning"}">
            ${idp.is_enabled ? "Enabled" : "Disabled"}
          </span>
        </div>
        <div class="actions">
          <button class="btn btn-danger" onclick="deleteIdp('${idp.id}')">Delete</button>
        </div>
      </div>
    `,
            )
            .join("");
    } catch (error) {
        console.error("Error loading identity providers:", error);
        container.innerHTML = '<p class="error">Failed to load identity providers.</p>';
    }
}

async function deleteIdp(idpId) {
    if (!confirm("Delete this identity provider?")) return;

    try {
        await myOrgClient.organization.identityProviders.delete(idpId);
        await loadIdentityProviders();
    } catch (error) {
        console.error("Error deleting identity provider:", error);
        showError("Failed to delete identity provider.");
    }
}

// Expose functions referenced via inline onclick handlers
window.getDomainVerification = getDomainVerification;
window.verifyDomain = verifyDomain;
window.deleteDomain = deleteDomain;
window.deleteIdp = deleteIdp;

// Start the app
initializeClients();
