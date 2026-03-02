import { useState, useEffect } from "react";
import { useMyOrganization } from "../hooks/useMyOrganization";
import { MyOrganization } from "@auth0/myorganization-js";

export function DomainsManagement() {
    const { listDomains, createDomain, verifyDomain, deleteDomain, isReady, client } = useMyOrganization();
    const [domains, setDomains] = useState<MyOrganization.OrgDomain[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newDomain, setNewDomain] = useState("");
    const [creating, setCreating] = useState(false);

    const fetchDomains = async () => {
        try {
            setLoading(true);
            const result = await listDomains();
            setDomains(result.organization_domains || []);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load domains");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isReady) return;
        fetchDomains();
    }, [isReady]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDomain.trim()) return;

        try {
            setCreating(true);
            await createDomain(newDomain);
            setNewDomain("");
            await fetchDomains();
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create domain");
        } finally {
            setCreating(false);
        }
    };

    const handleVerify = async (domainId: string) => {
        try {
            await verifyDomain(domainId);
            alert("Verification started. Check status by refreshing.");
            await fetchDomains();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to verify domain");
        }
    };

    const handleDelete = async (domainId: string) => {
        if (!confirm("Are you sure you want to delete this domain?")) return;

        try {
            await deleteDomain(domainId);
            await fetchDomains();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete domain");
        }
    };

    const getDomainDetails = async (domainId: string) => {
        if (!client) return;
        try {
            const details = await client.organization.domains.get(domainId);
            alert(
                `Verification TXT Record:\n\nHost: ${details.verification_host}\nValue: ${details.verification_txt}\n\nAdd this TXT record to your DNS, then click Verify.`,
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to get domain details");
        }
    };

    if (!isReady) {
        return (
            <div className="loading-inline">
                <span className="loading-spinner" />
                Initializing&hellip;
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-header">
                <h2>Domains</h2>
            </div>

            <div className="card-body">
                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleCreate}>
                    <div className="form-row">
                        <input
                            type="text"
                            className="form-input"
                            value={newDomain}
                            onChange={(e) => setNewDomain(e.target.value)}
                            placeholder="example.com"
                            style={{ maxWidth: 320 }}
                        />
                        <button type="submit" className="btn btn-primary" disabled={creating}>
                            {creating ? "Adding\u2026" : "Add Domain"}
                        </button>
                    </div>
                </form>
            </div>

            {loading && domains.length === 0 ? (
                <div className="loading-inline">
                    <span className="loading-spinner" />
                    Loading domains&hellip;
                </div>
            ) : domains.length === 0 ? (
                <div className="empty-state">No domains yet. Add your first domain above.</div>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Domain</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {domains.map((domain) => (
                            <tr key={domain.id}>
                                <td>{domain.domain}</td>
                                <td>
                                    <span
                                        className={`badge ${domain.status === "verified" ? "badge-success" : "badge-warning"}`}
                                    >
                                        {domain.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="actions">
                                        {domain.status === "pending" && (
                                            <>
                                                <button
                                                    className="btn btn-sm"
                                                    onClick={() => getDomainDetails(domain.id)}
                                                >
                                                    TXT Record
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => handleVerify(domain.id)}
                                                >
                                                    Verify
                                                </button>
                                            </>
                                        )}
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(domain.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
