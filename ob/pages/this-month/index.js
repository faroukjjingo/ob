
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import styles from '../styles/Home.module.css';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import GrantCard from '../components/GrantCard';

export async function getStaticProps() {
  try {
    const grantsCol = collection(db, 'grants');
    const grantsSnapshot = await getDocs(grantsCol);
    const grants = grantsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { props: { grants }, revalidate: 60 };
  } catch (error) {
    console.error('Error fetching grants:', error);
    return { props: { grants: [] }, revalidate: 60 };
  }
}

export default function ThisMonth({ grants }) {
  const [thisMonthGrants, setThisMonthGrants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    const filtered = grants.filter(grant => {
      const isActive = grant.deadline ? new Date(grant.deadline) > new Date() : true;
      const deadline = new Date(grant.deadline);
      return isActive && 
             deadline.getMonth() === now.getMonth() && 
             deadline.getFullYear() === now.getFullYear();
    });
    setThisMonthGrants(filtered);
    setIsLoading(false);
  }, [grants]);

  return (
    <div className={styles.container}>
      <div className={styles.resultsSection}>
        <div className={styles.resultsHeader}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.resultsTitle}>
              Opportunities This Month
              <Clock size={24} className={styles.sectionIcon} />
            </h2>
            <Link href="/" className={styles.sectionLink}>
              <ArrowLeft size={16} /> Back to Home
            </Link>
          </div>
          <div className={styles.resultsCount}>
            {isLoading ? (
              <span className={styles.loadingText}>Loading...</span>
            ) : (
              <span className={styles.countText}>
                {thisMonthGrants.length} {thisMonthGrants.length === 1 ? 'opportunity' : 'opportunities'}
              </span>
            )}
          </div>
        </div>
        <div className={styles.grid}>
          {isLoading ? (
            <div className={styles.loadingGrid}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className={styles.skeletonCard}></div>
              ))}
            </div>
          ) : thisMonthGrants.length === 0 ? (
            <div className={styles.noResults}>
              <h3 className={styles.noResultsTitle}>No opportunities found for this month</h3>
              <Link href="/" className={styles.clearButton}>
                Return to Home
              </Link>
            </div>
          ) : (
            thisMonthGrants.map((grant) => (
              <GrantCard key={grant.id} grant={grant} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}