/**
 * Vanilla JavaScript SPA Example for MyOrganization SDK
 * 
 * This example demonstrates how to use the MyOrganization SDK with Auth0 SPA JS
 * in a vanilla JavaScript application (no framework)
 */

import { createAuth0Client } from '@auth0/auth0-spa-js';
import { MyOrganizationClient } from '@auth0/myorganization-js';

let auth0Client;
let myOrgClient;

/**
 * Initialize Auth0 and MyOrganization clients
 */
async function initializeClients() {
  try {
    // Initialize Auth0 SPA JS client
    auth0Client = await createAuth0Client({
      domain: import.meta.env.VITE_AUTH0_DOMAIN,
      clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
      authorizationParams: {
        redirect_uri: window.location.origin,
        organization: import.meta.env.VITE_AUTH0_ORGANIZATION
      }
    });

    // Check if user is authenticated
    const isAuthenticated = await auth0Client.isAuthenticated();
    
    if (isAuthenticated) {
      await setupMyOrganizationClient();
      await showApp();
    } else {
      showLoginButton();
    }

    // Handle redirect callback
    if (window.location.search.includes('code=')) {
      await auth0Client.handleRedirectCallback();
      await setupMyOrganizationClient();
      window.history.replaceState({}, document.title, window.location.pathname);
      await showApp();
    }
  } catch (error) {
    console.error('Error initializing clients:', error);
    showError('Failed to initialize application');
  }
}

/**
 * Setup MyOrganization client with scope-aware token
 * This is the recommended pattern for Auth0 SPA integration
 */
async function setupMyOrganizationClient() {
  myOrgClient = new MyOrganizationClient({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    // SDK automatically passes required scopes for each API call
    token: async ({ scope }) => {
      console.log('Getting token with scopes:', scope);
      return await auth0Client.getTokenSilently({
        authorizationParams: {
          scope: `openid profile email ${scope}`,
          organization: import.meta.env.VITE_AUTH0_ORGANIZATION
        }
      });
    }
  });
}

/**
 * Login function
 */
async function login() {
  try {
    await auth0Client.loginWithRedirect();
  } catch (error) {
    console.error('Login error:', error);
    showError('Login failed');
  }
}

/**
 * Logout function
 */
async function logout() {
  try {
    await auth0Client.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  } catch (error) {
    console.error('Logout error:', error);
  }
}

/**
 * UI Functions
 */
function showLoginButton() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div style="text-align: center; padding: 50px;">
      <h1>MyOrganization Management</h1>
      <p>Please login to manage your organization</p>
      <button id="loginBtn" style="padding: 10px 20px; font-size: 16px;">
        Login with Auth0
      </button>
    </div>
  `;
  document.getElementById('loginBtn').addEventListener('click', login);
}

async function showApp() {
  const user = await auth0Client.getUser();
  
  const app = document.getElementById('app');
  app.innerHTML = `
    <div style="padding: 20px; max-width: 1200px; margin: 0 auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px;">
        <h1>MyOrganization Management</h1>
        <div>
          <span>Welcome, ${user.name || user.email}</span>
          <button id="logoutBtn" style="margin-left: 20px; padding: 8px 16px;">Logout</button>
        </div>
      </div>
      
      <div id="error" style="display: none; color: red; padding: 10px; margin-bottom: 20px; border: 1px solid red;"></div>
      
      <div style="margin-bottom: 30px;">
        <h2>Organization Details</h2>
        <div id="orgDetails">Loading...</div>
        <button id="refreshOrgBtn" style="margin-top: 10px;">Refresh</button>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h2>Domains</h2>
        <div style="margin-bottom: 10px;">
          <input type="text" id="newDomain" placeholder="example.com" style="padding: 8px; width: 300px; margin-right: 10px;">
          <button id="addDomainBtn" style="padding: 8px 16px;">Add Domain</button>
        </div>
        <div id="domainsList">Loading...</div>
      </div>
      
      <div>
        <h2>Identity Providers</h2>
        <div id="idpsList">Loading...</div>
      </div>
    </div>
  `;
  
  // Event listeners
  document.getElementById('logoutBtn').addEventListener('click', logout);
  document.getElementById('refreshOrgBtn').addEventListener('click', loadOrganizationDetails);
  document.getElementById('addDomainBtn').addEventListener('click', addDomain);
  
  // Load data
  await loadOrganizationDetails();
  await loadDomains();
  await loadIdentityProviders();
}

function showError(message) {
  const errorDiv = document.getElementById('error');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
      errorDiv.style.display = 'none';
    }, 5000);
  } else {
    alert('Error: ' + message);
  }
}

/**
 * Organization Details Functions
 */
async function loadOrganizationDetails() {
  try {
    const details = await myOrgClient.organizationDetails.get();
    const detailsDiv = document.getElementById('orgDetails');
    detailsDiv.innerHTML = `
      <dl style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
        <dt><strong>ID:</strong></dt>
        <dd>${details.organization?.id || '-'}</dd>
        <dt><strong>Name:</strong></dt>
        <dd>${details.organization?.name || '-'}</dd>
        <dt><strong>Display Name:</strong></dt>
        <dd>${details.organization?.display_name || '-'}</dd>
      </dl>
    `;
  } catch (error) {
    console.error('Error loading organization details:', error);
    showError('Failed to load organization details');
  }
}

/**
 * Domains Functions
 */
async function loadDomains() {
  try {
    const result = await myOrgClient.organization.domains.list({ take: 20 });
    const domains = result.organization_domains || [];
    
    const domainsDiv = document.getElementById('domainsList');
    if (domains.length === 0) {
      domainsDiv.innerHTML = '<p style="color: #666;">No domains yet. Add your first domain above.</p>';
      return;
    }
    
    domainsDiv.innerHTML = `
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 2px solid #ccc;">
            <th style="text-align: left; padding: 10px;">Domain</th>
            <th style="text-align: left; padding: 10px;">Status</th>
            <th style="text-align: left; padding: 10px;">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${domains.map(domain => `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px;">${domain.domain}</td>
              <td style="padding: 10px;">
                <span style="padding: 4px 8px; border-radius: 4px; background: ${domain.status === 'verified' ? '#d4edda' : '#fff3cd'}; color: ${domain.status === 'verified' ? '#155724' : '#856404'};">
                  ${domain.status}
                </span>
              </td>
              <td style="padding: 10px;">
                ${domain.status === 'pending' ? `
                  <button onclick="getDomainVerification('${domain.id}')" style="margin-right: 5px;">Get TXT Record</button>
                  <button onclick="verifyDomain('${domain.id}')" style="margin-right: 5px;">Verify</button>
                ` : ''}
                <button onclick="deleteDomain('${domain.id}')">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (error) {
    console.error('Error loading domains:', error);
    showError('Failed to load domains');
  }
}

async function addDomain() {
  const input = document.getElementById('newDomain');
  const domain = input.value.trim();
  
  if (!domain) {
    showError('Please enter a domain');
    return;
  }
  
  try {
    await myOrgClient.organization.domains.create({ domain });
    input.value = '';
    await loadDomains();
  } catch (error) {
    console.error('Error adding domain:', error);
    showError('Failed to add domain');
  }
}

async function getDomainVerification(domainId) {
  try {
    const details = await myOrgClient.organization.domains.get(domainId);
    alert(`Add this TXT record to your DNS:\n\nHost: ${details.organization_domain?.verification_host}\nValue: ${details.organization_domain?.verification_txt}\n\nAfter DNS propagates, click Verify.`);
  } catch (error) {
    console.error('Error getting domain verification:', error);
    showError('Failed to get verification details');
  }
}

async function verifyDomain(domainId) {
  try {
    await myOrgClient.organization.domains.verify.start(domainId);
    alert('Verification started. Refresh to see updated status.');
    await loadDomains();
  } catch (error) {
    console.error('Error verifying domain:', error);
    showError('Failed to verify domain');
  }
}

async function deleteDomain(domainId) {
  if (!confirm('Are you sure you want to delete this domain?')) return;
  
  try {
    await myOrgClient.organization.domains.delete(domainId);
    await loadDomains();
  } catch (error) {
    console.error('Error deleting domain:', error);
    showError('Failed to delete domain');
  }
}

/**
 * Identity Providers Functions
 */
async function loadIdentityProviders() {
  try {
    const result = await myOrgClient.organization.identityProviders.list();
    const idps = result.identity_providers || [];
    
    const idpsDiv = document.getElementById('idpsList');
    if (idps.length === 0) {
      idpsDiv.innerHTML = '<p style="color: #666;">No identity providers configured yet.</p>';
      return;
    }
    
    idpsDiv.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px;">
        ${idps.map(idp => `
          <div style="border: 1px solid #ddd; padding: 15px; border-radius: 5px;">
            <h3 style="margin-top: 0;">${idp.display_name || idp.name}</h3>
            <p><strong>Strategy:</strong> ${idp.strategy}</p>
            <p><strong>Status:</strong> ${idp.is_enabled ? '✓ Enabled' : '✗ Disabled'}</p>
            <button onclick="deleteIdp('${idp.id}')">Delete</button>
          </div>
        `).join('')}
      </div>
    `;
  } catch (error) {
    console.error('Error loading identity providers:', error);
    showError('Failed to load identity providers');
  }
}

async function deleteIdp(idpId) {
  if (!confirm('Are you sure you want to delete this identity provider?')) return;
  
  try {
    await myOrgClient.organization.identityProviders.delete(idpId);
    await loadIdentityProviders();
  } catch (error) {
    console.error('Error deleting identity provider:', error);
    showError('Failed to delete identity provider');
  }
}

// Make functions global for onclick handlers
window.getDomainVerification = getDomainVerification;
window.verifyDomain = verifyDomain;
window.deleteDomain = deleteDomain;
window.deleteIdp = deleteIdp;

// Initialize app
initializeClients();
