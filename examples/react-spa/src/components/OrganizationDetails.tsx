/**
 * React Component Example: Organization Details
 * 
 * This component demonstrates how to use the MyOrganization SDK
 * with React for managing organization details
 */

import { useState, useEffect } from 'react';
import { useMyOrganization } from '../hooks/useMyOrganization';
import { MyOrganization } from '@auth0/myorganization-js';

export function OrganizationDetails() {
  const { getOrganizationDetails, updateOrganizationDetails, isReady } = useMyOrganization();
  const [details, setDetails] = useState<MyOrganization.GetOrganizationDetailsResponseContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (!isReady) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await getOrganizationDetails();
        setDetails(data);
        setDisplayName(data.organization?.display_name || '');
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load organization details');
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
        display_name: displayName
      });
      setDetails(updated);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update organization');
    } finally {
      setLoading(false);
    }
  };

  if (!isReady) {
    return <div>Initializing...</div>;
  }

  if (loading && !details) {
    return <div>Loading organization details...</div>;
  }

  if (error && !details) {
    return (
      <div style={{ color: 'red' }}>
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Organization Details</h2>
      
      {error && (
        <div style={{ color: 'red', padding: '10px', marginBottom: '10px', border: '1px solid red' }}>
          {error}
        </div>
      )}

      {!isEditing ? (
        <div>
          <dl>
            <dt><strong>ID:</strong></dt>
            <dd>{details?.organization?.id}</dd>
            
            <dt><strong>Name:</strong></dt>
            <dd>{details?.organization?.name}</dd>
            
            <dt><strong>Display Name:</strong></dt>
            <dd>{details?.organization?.display_name || '-'}</dd>
            
            {details?.organization?.branding && (
              <>
                <dt><strong>Branding:</strong></dt>
                <dd>
                  <pre>{JSON.stringify(details.organization.branding, null, 2)}</pre>
                </dd>
              </>
            )}
          </dl>
          
          <button onClick={() => setIsEditing(true)}>
            Edit Details
          </button>
        </div>
      ) : (
        <form onSubmit={handleUpdate}>
          <div style={{ marginBottom: '10px' }}>
            <label>
              <strong>Display Name:</strong>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                style={{ marginLeft: '10px', padding: '5px' }}
              />
            </label>
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={() => setIsEditing(false)} style={{ marginLeft: '10px' }}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
