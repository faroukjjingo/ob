import { useState, useEffect } from 'react';
import GrantCard from '../../components/GrantCard';
import styles from '../../styles/Grants.module.css';

export default function GrantsPage() {
  const [grants, setGrants] = useState([]);

  useEffect(() => {
    const fetchGrants = async () => {
      try {
        const res = await fetch('/api/grants');
        const data = await res.json();
        setGrants(data.filter(grant => grant.category === 'grants'));
      } catch (error) {
        console.error('Error fetching grants:', error);
      }
    };
    fetchGrants();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Grants</h1>
      <div className={styles.grid}>
        {grants.map(grant => (
          <GrantCard key={grant.id} grant={grant} />
        ))}
      </div>
    </div>
  );
}