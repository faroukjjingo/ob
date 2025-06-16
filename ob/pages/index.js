
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/OpportunityDetail.module.css';
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
    <div className="container mx-auto px-4 py-8">
      <h1 className={styles.title}>Grant Opportunities</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredGrants.map((grant) => (
          <div key={grant.id} className="bg-surface shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold">{grant.title}</h2>
            <p className="text-text-secondary mt-2">{grant.category} - {grant.location}</p>
            <p className="mt-2">Deadline: {new Date(grant.deadline).toLocaleDateString()}</p>
            <Link href={`/grants/${grant.slug}`} className={styles.primaryButton}>
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}