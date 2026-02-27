/**
 * React Component Example: Identity Providers Management
 *
 * This component demonstrates:
 * - Listing identity providers
 * - Creating a new OIDC identity provider
 * - Deleting identity providers
 * - Error handling and loading states
 */

import { useState, useEffect } from "react";
import { useMyOrganization } from "../hooks/useMyOrganization";
import { MyOrganization } from "@auth0/myorganization-js";

interface OidcFormState {
    name: string;
    display_name: string;
    client_id: string;
    client_secret: string;
    discovery_url: string;
}

const emptyForm: OidcFormState = {
    name: "",
    display_name: "",
    client_id: "",
    client_secret: "",
    discovery_url: "",
};

export function IdentityProvidersManagement() {
    const { listIdentityProviders, createIdentityProvider, deleteIdentityProvider, isReady } =
        useMyOrganization();

    const [idps, setIdps] = useState<MyOrganization.IdpKnownResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState<OidcFormState>(emptyForm);
    const [creating, setCreating] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const fetchIdps = async () => {
        try {
            setLoading(true);
            const result = await listIdentityProviders();
            setIdps(result.identity_providers || []);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load identity providers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isReady) return;
        fetchIdps();
    }, [isReady]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload: MyOrganization.CreateIdentityProviderRequestContent = {
            strategy: "oidc",
            name: form.name,
            display_name: form.display_name,
            show_as_button: true,
            assign_membership_on_login: true,
            is_enabled: true,
            options: {
                type: "back_channel",
                client_id: form.client_id,
                client_secret: form.client_secret,
                discovery_url: form.discovery_url,
            },
        };

        try {
            setCreating(true);
            await createIdentityProvider(payload);
            setForm(emptyForm);
            setShowForm(false);
            await fetchIdps();
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create identity provider");
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (idpId: string) => {
        if (!confirm("Are you sure you want to delete this identity provider?")) return;

        try {
            await deleteIdentityProvider(idpId);
            await fetchIdps();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete identity provider");
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    if (!isReady) return <div>Initializing...</div>;

    return (
        <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
            <h2>Identity Providers</h2>

            {error && (
                <div style={{ color: "red", padding: "10px", marginBottom: "10px", border: "1px solid red" }}>
                    {error}
                </div>
            )}

            <div style={{ marginBottom: "20px" }}>
                <button onClick={() => setShowForm((v) => !v)}>
                    {showForm ? "Cancel" : "Add OIDC Provider"}
                </button>
            </div>

            {showForm && (
                <form
                    onSubmit={handleCreate}
                    style={{
                        marginBottom: "20px",
                        padding: "16px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                    }}
                >
                    <h3 style={{ marginBottom: "12px" }}>New OIDC Identity Provider</h3>
                    {(
                        [
                            { name: "name", label: "Name (unique identifier, no spaces)", placeholder: "my-oidc-provider" },
                            { name: "display_name", label: "Display Name", placeholder: "My OIDC Provider" },
                            { name: "client_id", label: "Client ID", placeholder: "OIDC client ID" },
                            { name: "client_secret", label: "Client Secret", placeholder: "OIDC client secret" },
                            {
                                name: "discovery_url",
                                label: "Discovery URL",
                                placeholder: "https://provider.example.com/.well-known/openid-configuration",
                            },
                        ] as const
                    ).map(({ name, label, placeholder }) => (
                        <div key={name} style={{ marginBottom: "10px" }}>
                            <label style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}>
                                {label}
                            </label>
                            <input
                                name={name}
                                value={form[name]}
                                onChange={handleFormChange}
                                placeholder={placeholder}
                                required
                                style={{ padding: "8px", width: "100%", boxSizing: "border-box" }}
                            />
                        </div>
                    ))}
                    <button type="submit" disabled={creating} style={{ marginTop: "8px" }}>
                        {creating ? "Creating..." : "Create Provider"}
                    </button>
                </form>
            )}

            {loading && idps.length === 0 ? (
                <div>Loading identity providers...</div>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "2px solid #ccc" }}>
                            <th style={{ textAlign: "left", padding: "10px" }}>Name</th>
                            <th style={{ textAlign: "left", padding: "10px" }}>Strategy</th>
                            <th style={{ textAlign: "left", padding: "10px" }}>Status</th>
                            <th style={{ textAlign: "left", padding: "10px" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {idps.map((idp) => (
                            <tr key={idp.id} style={{ borderBottom: "1px solid #eee" }}>
                                <td style={{ padding: "10px" }}>{idp.display_name || idp.name}</td>
                                <td style={{ padding: "10px" }}>
                                    <span
                                        style={{
                                            padding: "4px 8px",
                                            borderRadius: "4px",
                                            backgroundColor: "#d1ecf1",
                                            color: "#0c5460",
                                        }}
                                    >
                                        {idp.strategy}
                                    </span>
                                </td>
                                <td style={{ padding: "10px" }}>
                                    <span
                                        style={{
                                            padding: "4px 8px",
                                            borderRadius: "4px",
                                            backgroundColor: idp.is_enabled ? "#d4edda" : "#fff3cd",
                                            color: idp.is_enabled ? "#155724" : "#856404",
                                        }}
                                    >
                                        {idp.is_enabled ? "Enabled" : "Disabled"}
                                    </span>
                                </td>
                                <td style={{ padding: "10px" }}>
                                    <button onClick={() => handleDelete(idp.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {idps.length === 0 && !loading && (
                <p style={{ color: "#666", textAlign: "center", padding: "40px" }}>
                    No identity providers configured. Add one above.
                </p>
            )}
        </div>
    );
}
