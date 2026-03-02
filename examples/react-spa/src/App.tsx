import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { OrganizationDetails } from "./components/OrganizationDetails";
import { DomainsManagement } from "./components/DomainsManagement";

type Tab = "details" | "domains";

export function App() {
    const { isAuthenticated, isLoading, loginWithRedirect, logout, user } = useAuth0();
    const [activeTab, setActiveTab] = useState<Tab>("details");

    if (isLoading) {
        return (
            <div className="loading-screen">
                <span className="loading-spinner" />
                Loading&hellip;
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="login-page">
                <div className="login-card">
                    <h1>MyOrganization</h1>
                    <p>Sign in to manage your organization.</p>
                    <button className="btn btn-primary" onClick={() => loginWithRedirect()}>
                        Log In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <header className="app-header">
                <h1>MyOrganization</h1>
                <div className="user-info">
                    <span className="user-email">{user?.email}</span>
                    <button
                        className="btn btn-sm"
                        onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                    >
                        Log Out
                    </button>
                </div>
            </header>

            <nav className="app-nav">
                <button className={activeTab === "details" ? "active" : ""} onClick={() => setActiveTab("details")}>
                    Organization Details
                </button>
                <button className={activeTab === "domains" ? "active" : ""} onClick={() => setActiveTab("domains")}>
                    Domains
                </button>
            </nav>

            <main className="app-main">
                {activeTab === "details" && <OrganizationDetails />}
                {activeTab === "domains" && <DomainsManagement />}
            </main>
        </div>
    );
}
