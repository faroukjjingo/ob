// pages/index.js
'use client';
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
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setFilteredGrants(
      grants.filter((grant) => {
        const isActive = new Date(grant.deadline) > new Date();
        const matchesSearch = 
          grant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          grant.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          grant.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          grant.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        return isActive && matchesSearch;
      })
    );
  }, [grants, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Grant Opportunities</h1>
      <input
        type="text"
        placeholder="Search grants by title, category, location, or tags..."
        value={searchTerm}
        onChange={handleSearch}
        className={styles.searchInput}
      />
      <div className={styles.grid}>
        {filteredGrants.length === 0 ? (
          <p className={styles.noResults}>No grants match your search.</p>
        ) : (
          filteredGrants.map((grant) => (
            <div key={grant.id} className={styles.card}>
              <div className={styles.cardImageWrapper}>
                {grant.media ? (
                  <img
                    src={grant.media}
                    alt={grant.title}
                    className={styles.cardImage}
                  />
                ) : (
                  <div className={styles.cardImagePlaceholder}>
                    No Image
                  </div>
                )}
              </div>
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>{grant.title}</h2>
                <p className={styles.cardSubtitle}>
                  {grant.category} - {grant.location}
                </p>
                <p className={styles.cardDeadline}>
                  Deadline: {new Date(grant.deadline).toLocaleDateString()}
                </p>
                <p className={styles.cardDescription}>
                  {grant.description.length > 100
                    ? `${grant.description.slice(0, 100)}...`
                    : grant.description}
                </p>
                <div className={styles.cardTags}>
                  {grant.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <Link href={`/grants/${grant.slug}`} className={styles.primaryButton}>
                  View Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}