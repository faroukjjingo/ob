import { useState, useEffect } from 'react';
import GrantCard from '../../components/GrantCard';
import styles from './CompetitionsPage.module.css';

export default function CompetitionsPage() {
  const [grants, setGrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGrants = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/grants');
        if (!res.ok) throw new Error('Failed to fetch grants');
        const data = await res.json();
        setGrants(data.filter(grant => grant.category === 'competitions'));
      } catch (error) {
        setError(error.message);
        console.error('Error fetching grants:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGrants();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Competitions</h1>
      {loading && <p className={styles.loading}>Loading grants...</p>}
      {error && <p className={styles.error}>Error: {error}</p>}
      {!loading && !error && grants.length === 0 && (
        <p className={styles.noGrants}>No competitions available at this time.</p>
      )}
      <div className={styles.grid}>
        {grants.map(grant => (
          <GrantCard key={grant.id} grant={grant} />
        ))}
      </div>
    </div>
  );
}