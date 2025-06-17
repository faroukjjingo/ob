// pages/index.js
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
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

export default function Home({ grants }) {
  const [filteredGrants, setFilteredGrants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    console.log('Initial grants:', grants);
    setFilteredGrants(
      grants.filter((grant) => {
        const isActive = grant.deadline ? new Date(grant.deadline) > new Date() : true;
        const matchesSearch = 
          (grant.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
          (grant.category?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
          (grant.location?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
          (grant.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) || false);
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
            <GrantCard key={grant.id} grant={grant} />
          ))
        )}
      </div>
    </div>
  );
}