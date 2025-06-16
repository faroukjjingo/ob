// project/pages/index.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/OpportunityDetail.module.css';

export async function getStaticProps() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/grants`);
  const grants = await res.json();
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGrants.map((grant) => (
          <div key={grant.id} className="bg-surface shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold mb-2">{grant.title}</h2>
            <p className="text-text-secondary mb-2">
              {grant.category} - {grant.location}
            </p>
            <p className="text-text-secondary mb-4">
              Deadline: {new Date(grant.deadline).toLocaleDateString()}
            </p>
            <Link href={`/grants/${grant.slug}`} className={styles.primaryButton}>
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}