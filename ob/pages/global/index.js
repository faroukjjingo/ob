import { useState, useEffect } from 'react';
import GrantCard from '../../components/GrantCard';
import styles from '../../styles/Global.module.css';

export default function GlobalOpportunitiesPage() {
  const [grants, setGrants] = useState([]);

  useEffect(() => {
    const fetchGrants = async () => {
      try {
        const res = await fetch('/api/grants');
        const data = await res.json();
        setGrants(data.filter(grant => grant.category === 'global_opportunities'));
      } catch (error) {
        console.error('Error fetching grants:', error);
      }
    };
    fetchGrants();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Global Opportunities</h1>
      <div className={styles.grid}>
        {grants.map(grant => (
          <GrantCard key={grant.id} grant={grant} />
        ))}
      </div>
    </div>
  );
}