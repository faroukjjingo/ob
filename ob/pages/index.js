'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Award, GraduationCap, Trophy, Briefcase, FileText, Lightbulb, ArrowRight, Clock, MapPin } from 'lucide-react';
import styles from '../styles/Home.module.css';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import GrantCard from '../components/GrantCard';
import Select from 'react-select';

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

const categories = [
  { value: 'grants', label: 'Grants' },
  { value: 'scholarships', label: 'Scholarships' },
  { value: 'competitions', label: 'Competitions' },
  { value: 'jobs', label: 'Jobs' },
  { value: 'internships', label: 'Internships' },
  { value: 'fellowships', label: 'Fellowships' }
];

const locations = [
  { value: 'north_america', label: 'North America' },
  { value: 'south_america', label: 'South America' },
  { value: 'europe', label: 'Europe' },
  { value: 'asia', label: 'Asia' },
  { value: 'africa', label: 'Africa' },
  { value: 'australia', label: 'Australia' },
  { value: 'global', label: 'Global' },
    { value: 'regional', label: 'Regional' }
];

export default function Home({ grants }) {
  const [filteredGrants, setFilteredGrants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setFilteredGrants(
      grants.filter((grant) => {
        const isActive = grant.deadline ? new Date(grant.deadline) > new Date() : true;
        const matchesSearch = 
          (grant.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
          (grant.category?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
          (grant.location?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
          (grant.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) || false);
        const matchesCategory = selectedCategory ? grant.category === selectedCategory.value : true;
        const matchesLocation = selectedLocation ? grant.location === selectedLocation.value : true;
        return isActive && matchesSearch && matchesCategory && matchesLocation;
      })
    );
    setIsLoading(false);
  }, [grants, searchTerm, selectedCategory, selectedLocation]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const opportunityTypes = [
    { icon: Award, title: 'Grants', href: '/grants' },
    { icon: GraduationCap, title: 'Scholarships', href: '/scholarships' },
    { icon: Trophy, title: 'Competitions', href: '/competitions' },
    { icon: Briefcase, title: 'Jobs', href: '/jobs' },
    { icon: FileText, title: 'Internships', href: '/internships' },
    { icon: Lightbulb, title: 'Fellowships', href: '/fellowships' }
  ];

  const stats = [
    { icon: Award, label: 'Active Opportunities', value: filteredGrants.length },
    { icon: Clock, label: 'This Month', value: grants.filter(g => {
      const deadline = new Date(g.deadline);
      const now = new Date();
      return deadline.getMonth() === now.getMonth() && deadline.getFullYear() === now.getFullYear();
    }).length }
  ];

  const featuredOpportunities = grants.slice(0, 3);

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>Discover Opportunities</h1>
            <div className={styles.searchSection}>
              <div className={styles.searchWrapper}>
                <Search className={styles.searchIcon} size={20} />
                <input
                  type="text"
                  placeholder=".   Search opportunities..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className={styles.searchInput}
                />
              </div>
              <div className={styles.filterWrapper}>
                <Select
                  options={categories}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  placeholder="Filter by Category"
                  className={styles.selectField}
                />
                <Select
                  options={locations}
                  value={selectedLocation}
                  onChange={setSelectedLocation}
                  placeholder="Filter by Location"
                  className={styles.selectField}
                />
              </div>
            </div>
            <div className={styles.quickActions}>
              {opportunityTypes.map((type) => (
                <Link key={type.title} href={type.href} className={styles.quickAction}>
                  <type.icon size={20} />
                  {type.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Opportunities */}
      <div className={styles.featuredSection}>
        <div className={styles.sectionContent}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured Opportunities</h2>
            <Link href="/grants" className={styles.sectionLink}>
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className={styles.featuredGrid}>
            {featuredOpportunities.map((opportunity) => (
              <GrantCard key={opportunity.id} grant={opportunity} />
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className={styles.mainStatsSection}>
        <div className={styles.sectionContent}>
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
            {searchTerm ? `Results for "${searchTerm}"` : 'Latest Opportunities'}
          </h2>
          <div className={styles.resultsCount}>
            {isLoading ? (
              <span className={styles.loadingText}>Loading...</span>
            ) : (
              <span className={styles.countText}>
                {filteredGrants.length} {filteredGrants.length === 1 ? 'opportunity' : 'opportunities'}
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
          ) : filteredGrants.length === 0 ? (
            <div className={styles.noResults}>
              <h3 className={styles.noResultsTitle}>No opportunities found</h3>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory(null);
                  setSelectedLocation(null);
                }}
                className={styles.clearButton}
              >
                Clear Filters
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