/**
 * Vanilla JavaScript SPA Example for MyOrganization SDK with DPoP
 *
 * This example demonstrates how to use the MyOrganization SDK with Auth0 SPA JS
 * in a vanilla JavaScript application using DPoP (Demonstrating Proof-of-Possession)
 * for enhanced token security.
 *
 * Key DPoP features:
 * - Cryptographic proof that the sender possesses the private key bound to the token
 * - Automatic DPoP proof generation, nonce management, and retry via createFetcher()
 * - Protection against token theft and replay attacks
 */

import { createAuth0Client } from "@auth0/auth0-spa-js";
import { MyOrganizationClient } from "@auth0/myorganization-js";

let auth0Client;
let myOrgClient;

const audience = import.meta.env.VITE_AUTH0_AUDIENCE || `https://${import.meta.env.VITE_AUTH0_DOMAIN}/my-org/`;

// ========================================
// INITIALIZATION
// ========================================

async function initializeClients() {
    try {
        // useDpop: true → generates an ES256 key pair and binds tokens to it
        // cacheLocation: "localstorage" → persists tokens across page refreshes
        //   so users don't need to re-authenticate on every reload
        auth0Client = await createAuth0Client({
            domain: import.meta.env.VITE_AUTH0_DOMAIN,
            clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
            useDpop: true,
            cacheLocation: "localstorage",
            authorizationParams: {
                redirect_uri: window.location.origin,
                organization: import.meta.env.VITE_AUTH0_ORGANIZATION,
                audience,
            },
        });

        // Handle redirect callback after login
        if (window.location.search.includes("code=")) {
            await auth0Client.handleRedirectCallback();
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        const isAuthenticated = await auth0Client.isAuthenticated();

        // Hide the loading screen
        document.getElementById("loading-screen").classList.add("hidden");

        if (isAuthenticated) {
            await setupMyOrganizationClient();
            showApp();
        } else {
            showLoginPage();
        }
    } catch (error) {
        console.error("Error initializing clients:", error);
        document.getElementById("loading-screen").classList.add("hidden");
        showLoginPage();
        showError("Failed to initialize application. Check your configuration.");
    }
}

async function setupMyOrganizationClient() {
    // createFetcher() returns a Fetcher that automatically:
    // 1. Generates a DPoP proof JWT for each request (bound to HTTP method + URL)
    // 2. Handles server nonce challenges (extracts dpop-nonce header, retries with nonce)
    // 3. Attaches the DPoP token and proof to every outgoing request
    //
    // dpopNonceId is required to enable DPoP proof generation on the fetcher.
    // It scopes the nonce storage so different APIs can maintain separate nonces.
    // Without it, the fetcher sends plain Bearer tokens (no DPoP proof).
    const fetcher = auth0Client.createFetcher({
        dpopNonceId: "__auth0_my_org_api__",
    });

    // Pass fetchWithAuth as the fetcher — it attaches the DPoP proof + token
    // to every request the SDK makes. No separate "token" option needed.
    myOrgClient = new MyOrganizationClient({
        domain: import.meta.env.VITE_AUTH0_DOMAIN,
        fetcher: fetcher.fetchWithAuth.bind(fetcher),
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

function showLoginPage() {
    document.getElementById("login-page").classList.remove("hidden");
    document.getElementById("app").classList.add("hidden");
    document.getElementById("login-btn").addEventListener("click", login);
}

async function showApp() {
    document.getElementById("login-page").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");

    // Display user email
    const user = await auth0Client.getUser();
    if (user?.email) {
        document.getElementById("user-email").textContent = user.email;
    }

    // Wire up event listeners
    document.getElementById("logout-btn").addEventListener("click", logout);
    document.getElementById("add-domain-btn").addEventListener("click", addDomain);

    // Tab navigation
    document.querySelectorAll(".app-nav button").forEach((btn) => {
        btn.addEventListener("click", () => switchTab(btn.dataset.tab));
    });

    // Load initial data
    loadOrganizationDetails();
    loadDomains();
}

function switchTab(tab) {
    // Update nav buttons
    document.querySelectorAll(".app-nav button").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.tab === tab);
    });

    // Toggle panels
    document.getElementById("panel-details").classList.toggle("hidden", tab !== "details");
    document.getElementById("panel-domains").classList.toggle("hidden", tab !== "domains");
}

function showError(message) {
    const container = document.getElementById("error-container");
    container.innerHTML = `<div class="alert alert-error">${message}</div>`;
    setTimeout(() => {
        container.innerHTML = "";
    }, 5000);
}

// ========================================
// ORGANIZATION DETAILS
// ========================================

async function loadOrganizationDetails() {
    const container = document.getElementById("org-details");
    container.innerHTML =
        '<div class="loading-inline"><span class="loading-spinner"></span> Loading organization details&hellip;</div>';

    try {
        const details = await myOrgClient.organizationDetails.get();

        container.innerHTML = `
            <div class="detail-grid">
                <span class="detail-label">ID</span>
                <span class="detail-value">${details.id || "\u2014"}</span>
                <span class="detail-label">Name</span>
                <span class="detail-value">${details.name || "\u2014"}</span>
                <span class="detail-label">Display Name</span>
                <span class="detail-value">${details.display_name || "\u2014"}</span>
            </div>
        `;
    } catch (error) {
        console.error("Error loading organization details:", error);
        const message = error instanceof Error ? error.message : "Failed to load organization details";
        container.innerHTML = `<div class="alert alert-error">${message}</div>`;
    }
}

// ========================================
// DOMAINS
// ========================================

async function loadDomains() {
    const container = document.getElementById("domains-list");
    container.innerHTML =
        '<div class="loading-inline"><span class="loading-spinner"></span> Loading domains&hellip;</div>';

    try {
        const result = await myOrgClient.organization.domains.list({ take: 20 });
        const domains = result.organization_domains || [];

        if (domains.length === 0) {
            container.innerHTML = '<div class="empty-state">No domains yet. Add your first domain above.</div>';
            return;
        }

        container.innerHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Domain</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${domains
                        .map(
                            (domain) => `
                        <tr>
                            <td>${domain.domain}</td>
                            <td>
                                <span class="badge ${domain.status === "verified" ? "badge-success" : "badge-warning"}">
                                    ${domain.status}
                                </span>
                            </td>
                            <td>
                                <div class="actions">
                                    ${
                                        domain.status === "pending"
                                            ? `
                                        <button class="btn btn-sm" data-action="get-txt" data-id="${domain.id}">TXT Record</button>
                                        <button class="btn btn-sm btn-primary" data-action="verify" data-id="${domain.id}">Verify</button>
                                    `
                                            : ""
                                    }
                                    <button class="btn btn-sm btn-danger" data-action="delete-domain" data-id="${domain.id}">Delete</button>
                                </div>
                            </td>
                        </tr>
                    `,
                        )
                        .join("")}
                </tbody>
            </table>
        `;

        container.querySelectorAll("[data-action]").forEach((btn) => {
            btn.addEventListener("click", handleDomainAction);
        });
    } catch (error) {
        console.error("Error loading domains:", error);
        const message = error instanceof Error ? error.message : "Failed to load domains";
        container.innerHTML = `<div class="alert alert-error" style="margin: 24px;">${message}</div>`;
    }
}

function handleDomainAction(event) {
    const btn = event.currentTarget;
    const action = btn.dataset.action;
    const id = btn.dataset.id;

    if (action === "get-txt") getDomainVerification(id);
    else if (action === "verify") verifyDomain(id);
    else if (action === "delete-domain") deleteDomain(id);
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
        showError(error instanceof Error ? error.message : "Failed to create domain");
    }
}

async function getDomainVerification(domainId) {
    try {
        const details = await myOrgClient.organization.domains.get(domainId);
        alert(
            `Verification TXT Record:\n\n` +
                `Host: ${details.verification_host}\n` +
                `Value: ${details.verification_txt}\n\n` +
                `Add this TXT record to your DNS, then click Verify.`,
        );
    } catch (error) {
        console.error("Error getting domain verification:", error);
        showError(error instanceof Error ? error.message : "Failed to get domain details");
    }
}

async function verifyDomain(domainId) {
    try {
        await myOrgClient.organization.domains.verify.start(domainId);
        await loadDomains();
    } catch (error) {
        console.error("Error verifying domain:", error);
        showError(error instanceof Error ? error.message : "Failed to verify domain");
    }
}

async function deleteDomain(domainId) {
    if (!confirm("Delete this domain?")) return;

    try {
        await myOrgClient.organization.domains.delete(domainId);
        await loadDomains();
    } catch (error) {
        console.error("Error deleting domain:", error);
        showError(error instanceof Error ? error.message : "Failed to delete domain");
    }
}

// Start the app
initializeClients();
