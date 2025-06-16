import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function getStaticProps() {
  const grantsCol = collection(db, 'grants');
  const grantsSnapshot = await getDocs(grantsCol);
  const grants = grantsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return { props: { grants }, revalidate: 60 };
}

export default function Home({ grants }) {
  const [filteredGrants, setFilteredGrants] = useState(grants);

  useEffect(() => {
    setFilteredGrants(grants.filter((grant) => new Date(grant.deadline) > new Date()));
  }, [grants]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Grant Opportunities</h1>
      <div className={styles.grid}>
        {filteredGrants.map((grant) => (
          <div key={grant.id} className={styles.card}>
            <h2 className={styles.cardTitle}>{grant.title}</h2>
            <p className={styles.cardSubtitle}>{grant.category} - {grant.location}</p>
            <p className={styles.cardDeadline}>Deadline: {new Date(grant.deadline).toLocaleDateString()}</p>
            <Link href={`/grants/${grant.slug}`} className={styles.primaryButton}>
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}