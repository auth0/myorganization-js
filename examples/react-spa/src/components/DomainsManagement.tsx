/**
 * React Component Example: Domains Management
 * 
 * This component demonstrates:
 * - Listing domains with pagination
 * - Creating new domains
 * - Domain verification workflow
 * - Error handling
 */

import { useState, useEffect } from 'react';
import { useMyOrganization } from '../hooks/useMyOrganization';
import { MyOrganization } from '@auth0/myorganization-js';

export function DomainsManagement() {
  const { listDomains, createDomain, verifyDomain, deleteDomain, isReady, client } = useMyOrganization();
  const [domains, setDomains] = useState<MyOrganization.OrgDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newDomain, setNewDomain] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchDomains = async () => {
    try {
      setLoading(true);
      const result = await listDomains({ take: 20 });
      setDomains(result.organization_domains || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load domains');
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
      setNewDomain('');
      await fetchDomains();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create domain');
    } finally {
      setCreating(false);
    }
  };

  const handleVerify = async (domainId: string) => {
    try {
      await verifyDomain(domainId);
      alert('Verification started. Check status by refreshing.');
      await fetchDomains();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify domain');
    }
  };

  const handleDelete = async (domainId: string) => {
    if (!confirm('Are you sure you want to delete this domain?')) return;

    try {
      await deleteDomain(domainId);
      await fetchDomains();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete domain');
    }
  };

  const getDomainDetails = async (domainId: string) => {
    if (!client) return;
    try {
      const details = await client.organization.domains.get(domainId);
      alert(`Verification TXT Record:\n\nHost: ${details.organization_domain?.verification_host}\nValue: ${details.organization_domain?.verification_txt}\n\nAdd this TXT record to your DNS, then click Verify.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get domain details');
    }
  };

  if (!isReady) return <div>Initializing...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Domains Management</h2>

      {error && (
        <div style={{ color: 'red', padding: '10px', marginBottom: '10px', border: '1px solid red' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleCreate} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={newDomain}
          onChange={(e) => setNewDomain(e.target.value)}
          placeholder="example.com"
          style={{ padding: '8px', marginRight: '10px', width: '300px' }}
        />
        <button type="submit" disabled={creating}>
          {creating ? 'Creating...' : 'Add Domain'}
        </button>
      </form>

      {loading && domains.length === 0 ? (
        <div>Loading domains...</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ccc' }}>
              <th style={{ textAlign: 'left', padding: '10px' }}>Domain</th>
              <th style={{ textAlign: 'left', padding: '10px' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '10px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {domains.map((domain) => (
              <tr key={domain.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{domain.domain}</td>
                <td style={{ padding: '10px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: domain.status === 'verified' ? '#d4edda' : '#fff3cd',
                    color: domain.status === 'verified' ? '#155724' : '#856404'
                  }}>
                    {domain.status}
                  </span>
                </td>
                <td style={{ padding: '10px' }}>
                  {domain.status === 'pending' && (
                    <>
                      <button onClick={() => getDomainDetails(domain.id)} style={{ marginRight: '5px' }}>
                        Get TXT Record
                      </button>
                      <button onClick={() => handleVerify(domain.id)} style={{ marginRight: '5px' }}>
                        Verify
                      </button>
                    </>
                  )}
                  <button onClick={() => handleDelete(domain.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {domains.length === 0 && !loading && (
        <p style={{ color: '#666', textAlign: 'center', padding: '40px' }}>
          No domains yet. Add your first domain above.
        </p>
      )}
    </div>
  );
}
