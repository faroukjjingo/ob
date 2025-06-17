// pages/index.js
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Calendar, TrendingUp, Users, Award } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(true);

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
    setIsLoading(false);
  }, [grants, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const stats = [
    { icon: Award, label: 'Active Grants', value: filteredGrants.length },
    { icon: Users, label: 'Organizations', value: new Set(grants.map(g => g.organization)).size },
    { icon: Calendar, label: 'This Month', value: grants.filter(g => {
      const deadline = new Date(g.deadline);
      const now = new Date();
      return deadline.getMonth() === now.getMonth() && deadline.getFullYear() === now.getFullYear();
    }).length },
    { icon: TrendingUp, label: 'Success Rate', value: '85%' }
  ];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Discover Your Next
            <span className={styles.heroAccent}> Grant Opportunity</span>
          </h1>
          <p className={styles.heroDescription}>
            Access thousands of funding opportunities from top organizations worldwide. 
            Find grants that match your project, research, or business needs.
          </p>
          
          {/* Search Section */}
          <div className={styles.searchSection}>
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} size={20} />
              <input
                type="text"
                placeholder="Search grants by title, category, location, or tags..."
                value={searchTerm}
                onChange={handleSearch}
                className={styles.searchInput}
              />
              <button className={styles.filterButton}>
                <Filter size={18} />
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statCard}>
                <div className={styles.statIcon}>
                  <stat.icon size={24} />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statValue}>{stat.value}</div>
                  <div className={styles.statLabel}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className={styles.resultsSection}>
        <div className={styles.resultsHeader}>
          <h2 className={styles.resultsTitle}>
            {searchTerm ? `Search Results for "${searchTerm}"` : 'Latest Grant Opportunities'}
          </h2>
          <div className={styles.resultsCount}>
            {isLoading ? (
              <span className={styles.loadingText}>Loading...</span>
            ) : (
              <span className={styles.countText}>
                {filteredGrants.length} {filteredGrants.length === 1 ? 'grant' : 'grants'} found
              </span>
            )}
          </div>
        </div>

        {/* Grant Grid */}
        <div className={styles.grid}>
          {isLoading ? (
            <div className={styles.loadingGrid}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className={styles.skeletonCard}></div>
              ))}
            </div>
          ) : filteredGrants.length === 0 ? (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>🔍</div>
              <h3 className={styles.noResultsTitle}>No grants found</h3>
              <p className={styles.noResultsText}>
                Try adjusting your search terms or browse all available grants.
              </p>
              <button 
                onClick={() => setSearchTerm('')}
                className={styles.clearButton}
              >
                Clear Search
              </button>
            </div>
          ) : (
            filteredGrants.map((grant) => (
              <GrantCard key={grant.id} grant={grant} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}