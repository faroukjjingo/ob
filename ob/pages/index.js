'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Clock, MapPin } from 'lucide-react';
import styles from '../styles/Home.module.css';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import GrantCard from '../components/GrantCard';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { tagsOptions } from '../constants/Tags';
import { locations } from '../constants/Locations';
import { categories } from '../constants/Categories';
import Modal from 'react-modal';

// Bind modal to app element for accessibility
Modal.setAppElement('#__next');

export async function getStaticProps() {
  try {
    const grantsCol = collection(db, 'grants');
    const grantsSnapshot = await getDocs(grantsCol);
    const grants = grantsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      publishedDate: doc.data().publishedDate?.toDate?.()?.toISOString?.() || new Date().toISOString(),
      deadline: doc.data().deadline?.toDate?.()?.toISOString?.() || new Date().toISOString(),
    }));
    return { props: { grants }, revalidate: 60 };
  } catch (error) {
    console.error('Error fetching grants:', error);
    return { props: { grants: [] }, revalidate: 60 };
  }
}

export default function Home({ grants }) {
  const [filteredGrants, setFilteredGrants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [featuredGrants, setFeaturedGrants] = useState([]);
  const [showThisMonth, setShowThisMonth] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [continentGrants, setContinentGrants] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    // Filter active grants
    const activeGrants = grants.filter(grant => 
      grant.deadline ? new Date(grant.deadline) > new Date() : true
    );

    // Fetch featured grants (2 random grants or fellowships, consistent for 24 hours)
    const fetchFeaturedGrants = () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const seed = parseInt(today.replace(/-/g, '')); // Deterministic seed
        const randomGrants = activeGrants
          .filter(grant => ['grants', 'fellowships'].includes(grant.category))
          .sort(() => 0.5 - (seed % 1000) / 1000)
          .slice(0, 2);
        setFeaturedGrants(randomGrants);
      } catch (err) {
        console.error('Error fetching featured grants:', err);
        setError('Failed to load featured grants');
      }
    };

    // Fetch continent-specific grants
    const fetchContinentGrants = async () => {
      try {
        const continentKeys = [
          'africa', 'asia', 'australia', 'europe', 
          'north_america', 'south_america', 'global', 'regional'
        ];
        const continentData = {};
        
        for (const continent of continentKeys) {
          const continentQuery = query(
            collection(db, 'grants'),
            where('location', '==', continent),
            where('deadline', '>', new Date()),
            limit(2)
          );
          const snapshot = await getDocs(continentQuery);
          const grants = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            publishedDate: doc.data().publishedDate?.toDate?.()?.toISOString?.() || new Date().toISOString(),
            deadline: doc.data().deadline?.toDate?.()?.toISOString?.() || new Date().toISOString(),
          }));
          if (grants.length > 0) {
            continentData[continent] = grants;
          }
        }
        setContinentGrants(continentData);
      } catch (err) {
        console.error('Error fetching continent grants:', err);
        setError('Failed to load continent grants');
      }
    };

    // Fetch latest grants (top 5 by publishedDate)
    const fetchLatestGrants = async () => {
      try {
        const latestQuery = query(
          collection(db, 'grants'),
          where('deadline', '>', new Date()),
          orderBy('publishedDate', 'desc'),
          limit(5)
        );
        const snapshot = await getDocs(latestQuery);
        setFilteredGrants(
          snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            publishedDate: doc.data().publishedDate?.toDate?.()?.toISOString?.() || new Date().toISOString(),
            deadline: doc.data().deadline?.toDate?.()?.toISOString?.() || new Date().toISOString(),
          }))
        );
      } catch (err) {
        console.error('Error fetching latest grants:', err);
        setError('Failed to load latest grants');
      }
    };

    const applyFilters = () => {
      try {
        let results = activeGrants.filter((grant) => {
          const matchesSearch =
            (grant.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
            (grant.category?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
            (grant.location?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
            (grant.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) || false);
          const matchesCategory = selectedCategory ? grant.category === selectedCategory.value : true;
          const matchesLocation = selectedLocation ? grant.location === selectedLocation.value : true;
          const matchesTags = selectedTags.length > 0
            ? grant.tags?.some(tag => selectedTags.some(selectedTag => selectedTag.value === tag))
            : true;
          const matchesThisMonth = showThisMonth ? (() => {
            const deadline = new Date(grace: 60 };
  } catch (error) {
    console.error('Error fetching grants:', error);
    return { props: { grants: [] }, revalidate: 60 };
  }
}

export default function Home({ grants }) {
  const [filteredGrants, setFilteredGrants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [featuredGrants, setFeaturedGrants] = useState([]);
  const [showThisMonth, setShowThisMonth] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [continentGrants, setContinentGrants] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    // Filter active grants
    const activeGrants = grants.filter(grant => 
      grant.deadline ? new Date(grant.deadline) > new Date() : true
    );

    // Fetch featured grants (2 random grants or fellowships, consistent for 24 hours)
    const fetchFeaturedGrants = () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const seed = parseInt(today.replace(/-/g, '')); // Deterministic seed
        const randomGrants = activeGrants
          .filter(grant => ['grants', 'fellowships'].includes(grant.category))
          .sort(() => 0.5 - (seed % 1000) / 1000)
          .slice(0, 2);
        setFeaturedGrants(randomGrants);
      } catch (err) {
        console.error('Error fetching featured grants:', err);
        setError('Failed to load featured grants');
      }
    };

    // Fetch continent-specific grants
    const fetchContinentGrants = async () => {
      try {
        const continentKeys = [
          'africa', 'asia', 'australia', 'europe', 
          'north_america', 'south_america', 'global', 'regional'
        ];
        const continentData = {};
        
        for (const continent of continentKeys) {
          const continentQuery = query(
            collection(db, 'grants'),
            where('location', '==', continent),
            where('deadline', '>', new Date()),
            limit(2)
          );
          const snapshot = await getDocs(continentQuery);
          const grants = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            publishedDate: doc.data().publishedDate?.toDate?.()?.toISOString?.() || new Date().toISOString(),
            deadline: doc.data().deadline?.toDate?.()?.toISOString?.() || new Date().toISOString(),
          }));
          if (grants.length > 0) {
            continentData[continent] = grants;
          }
        }
        setContinentGrants(continentData);
      } catch (err) {
        console.error('Error fetching continent grants:', err);
        setError('Failed to load continent grants');
      }
    };

    // Fetch latest grants (top 5 by publishedDate)
    const fetchLatestGrants = async () => {
      try {
        const latestQuery = query(
          collection(db, 'grants'),
          where('deadline', '>', new Date()),
          orderBy('publishedDate', 'desc'),
          limit(5)
        );
        const snapshot = await getDocs(latestQuery);
        setFilteredGrants(
          snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            publishedDate: doc.data().publishedDate?.toDate?.()?.toISOString?.() || new Date().toISOString(),
            deadline: doc.data().deadline?.toDate?.()?.toISOString?.() || new Date().toISOString(),
          }))
        );
      } catch (err) {
        console.error('Error fetching latest grants:', err);
        setError('Failed to load latest grants');
      }
    };

    const applyFilters = () => {
      try {
        let results = activeGrants.filter((grant) => {
          const matchesSearch =
            (grant.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
            (grant.category?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
            (grant.location?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
            (grant.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) || false);
          const matchesCategory = selectedCategory ? grant.category === selectedCategory.value : true;
          const matchesLocation = selectedLocation ? grant.location === selectedLocation.value : true;
          const matchesTags = selectedTags.length > 0
            ? grant.tags?.some(tag => selectedTags.some(selectedTag => selectedTag.value === tag))
            : true;
          const matchesThisMonth = showThisMonth ? (() => {
            const deadline = new Date(grant.deadline);
            const now = new Date();
            return deadline.getMonth() === now.getMonth() && deadline.getFullYear() === now.getFullYear();
          })() : true;
          return matchesSearch && matchesCategory && matchesLocation && matchesTags && matchesThisMonth;
        });

        // If no filters are applied, show latest grants
        if (!searchTerm && !selectedCategory && !selectedLocation && selectedTags.length === 0 && !showThisMonth) {
          fetchLatestGrants();
        } else {
          setFilteredGrants(results);
        }
      } catch (err) {
        console.error('Error applying filters:', err);
        setError('Failed to apply filters');
      }
    };

    fetchFeaturedGrants();
    fetchContinentGrants();
    applyFilters();
    setIsLoading(false);
  }, [grants, searchTerm, selectedCategory, selectedLocation, selectedTags, showThisMonth]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Trigger filter application (already handled in useEffect)
  };

  const handleThisMonthClick = () => {
    setShowThisMonth(!showThisMonth);
  };

  const stats = [
    {
      icon: Clock,
      label: 'This Month',
      value: grants.filter(g => {
        const deadline = new Date(g.deadline);
        const now = new Date();
        return deadline.getMonth() === now.getMonth() && deadline.getFullYear() === now.getFullYear();
      }).length,
      onClick: handleThisMonthClick,
    },
    {
      icon: MapPin,
      label: 'Total Active Opportunities',
      value: grants.filter(g => g.deadline ? new Date(g.deadline) > new Date() : true).length,
    },
  ];

  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.heroTitle}>Error</h1>
        <p className={styles.noResultsTitle}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>Discover Opportunities</h1>
            <div className={styles.searchSection}>
              <form onSubmit={handleSearchSubmit} className={styles.searchWrapper}>
                <Search className={styles.searchIcon} size={20} />
                <input
                  type="text"
                  placeholder="Search opportunities..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className={styles.searchInput}
                />
                <button type="submit" className={styles.searchButton}>Search</button>
              </form>
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className={styles.filterButton}
              >
                Filter
              </button>
              <Modal
                isOpen={isFilterModalOpen}
                onRequestClose={() => setIsFilterModalOpen(false)}
                className={styles.filterModal}
                overlayClassName={styles.modalOverlay}
              >
                <h2>Filter Opportunities</h2>
                <div className={styles.filterModalContent}>
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
                  <CreatableSelect
                    isMulti
                    options={tagsOptions}
                    value={selectedTags}
                    onChange={setSelectedTags}
                    placeholder="Filter by Tags"
                    className={styles.selectField}
                    formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
                  />
                </div>
                <div className={styles.modalButtons}>
                  <button
                    onClick={() => setIsFilterModalOpen(false)}
                    className={styles.modalButton}
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedLocation(null);
                      setSelectedTags([]);
                      setIsFilterModalOpen(false);
                    }}
                    className={styles.modalButton}
                  >
                    Clear Filters
                  </button>
                </div>
              </Modal>
            </div>
            <div className={styles.statsSection}>
              <div className={styles.statsGrid}>
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className={`${styles.statCard} ${stat.onClick ? styles.clickableStat : ''}`}
                    onClick={stat.onClick}
                  >
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
        </div>
      </div>

      <div className={styles.featuredSection}>
        <div className={styles.sectionContent}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured Opportunities</h2>
            <Link href="/grants" className={styles.sectionLink}>
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className={styles.featuredGrid}>
            {featuredGrants.map((opportunity) => (
              <GrantCard key={opportunity.id} grant={opportunity} />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.resultsSection}>
        <div className={styles.resultsHeader}>
          <h2 className={styles.resultsTitle}>
            {searchTerm || selectedCategory || selectedLocation || selectedTags.length > 0 || showThisMonth
              ? `Results for "${searchTerm || (showThisMonth ? 'this month' : 'filtered opportunities')}"`
              : 'Latest Opportunities'}
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
              {[...Array(5)].map((_, i) => (
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
                  setSelectedTags([]);
                  setShowThisMonth(false);
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

      {Object.keys(continentGrants).map(continent => (
        <div key={continent} className={styles.continentSection}>
          <div className={styles.sectionContent}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                Grants from {locations.find(l => l.value === continent)?.label || continent}
              </h2>
              <Link
                href={`/grants?location=${continent}`}
                className={styles.sectionLink}
              >
                View More <ArrowRight size={16} />
              </Link>
            </div>
            <div className={styles.featuredGrid}>
              {continentGrants[continent]?.map((grant) => (
                <GrantCard key={grant.id} grant={grant} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}