import { useState, useEffect } from "react";
import { useMyOrganization } from "../hooks/useMyOrganization";
import { MyOrganization } from "@auth0/myorganization-js";

export function OrganizationDetails() {
    const { getOrganizationDetails, updateOrganizationDetails, isReady } = useMyOrganization();
    const [details, setDetails] = useState<MyOrganization.GetOrganizationDetailsResponseContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [displayName, setDisplayName] = useState("");

    useEffect(() => {
        if (!isReady) return;

        const fetchDetails = async () => {
            try {
                setLoading(true);
                const data = await getOrganizationDetails();
                setDetails(data);
                setDisplayName(data.display_name || "");
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load organization details");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [isReady, getOrganizationDetails]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const updated = await updateOrganizationDetails({
                display_name: displayName,
            });
            setDetails(updated);
            setIsEditing(false);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update organization");
        } finally {
            setLoading(false);
        }
    };

    if (!isReady || (loading && !details)) {
        return (
            <div className="loading-inline">
                <span className="loading-spinner" />
                Loading organization details&hellip;
            </div>
        );
    }

    if (error && !details) {
        return (
            <div className="card">
                <div className="card-body">
                    <div className="alert alert-error">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-header">
                <h2>Organization Details</h2>
                {!isEditing && (
                    <button className="btn btn-sm" onClick={() => setIsEditing(true)}>
                        Edit
                    </button>
                )}
            </div>

            <div className="card-body">
                {error && <div className="alert alert-error">{error}</div>}

                {!isEditing ? (
                    <div className="detail-grid">
                        <span className="detail-label">ID</span>
                        <span className="detail-value">{details?.id}</span>

                        <span className="detail-label">Name</span>
                        <span className="detail-value">{details?.name}</span>

                        <span className="detail-label">Display Name</span>
                        <span className="detail-value">{details?.display_name || "\u2014"}</span>

                        {details?.branding && (
                            <>
                                <span className="detail-label">Branding</span>
                                <span className="detail-value">
                                    <pre>{JSON.stringify(details.branding, null, 2)}</pre>
                                </span>
                            </>
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleUpdate}>
                        <div className="form-group">
                            <label className="form-label">Display Name</label>
                            <input
                                type="text"
                                className="form-input"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? "Saving\u2026" : "Save"}
                            </button>
                            <button type="button" className="btn" onClick={() => setIsEditing(false)}>
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
