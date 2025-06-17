// pages/index.js
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Calendar, 
  TrendingUp, 
  Users, 
  Award,
  Trophy,
  GraduationCap,
  Briefcase,
  FileText,
  Lightbulb,
  Globe,
  ArrowRight,
  Clock,
  MapPin,
  DollarSign,
  BookOpen,
  Star,
  ChevronRight,
  Zap,
  Target,
  Heart
} from 'lucide-react';
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

  const opportunityTypes = [
    {
      icon: Award,
      title: 'Grants',
      description: 'Research and project funding opportunities',
      count: grants.filter(g => g.category === 'grants').length,
      color: '#3b82f6',
      href: '/grants'
    },
    {
      icon: GraduationCap,
      title: 'Scholarships',
      description: 'Educational funding and merit awards',
      count: grants.filter(g => g.category === 'scholarships').length,
      color: '#059669',
      href: '/scholarships'
    },
    {
      icon: Trophy,
      title: 'Competitions',
      description: 'Contests and challenges with prizes',
      count: grants.filter(g => g.category === 'competitions').length,
      color: '#dc2626',
      href: '/competitions'
    },
    {
      icon: Briefcase,
      title: 'Jobs',
      description: 'Career opportunities and positions',
      count: grants.filter(g => g.category === 'jobs').length,
      color: '#7c3aed',
      href: '/jobs'
    },
    {
      icon: FileText,
      title: 'Internships',
      description: 'Professional development programs',
      count: grants.filter(g => g.category === 'internships').length,
      color: '#ea580c',
      href: '/internships'
    },
    {
      icon: Lightbulb,
      title: 'Fellowships',
      description: 'Research and leadership programs',
      count: grants.filter(g => g.category === 'fellowships').length,
      color: '#0891b2',
      href: '/fellowships'
    }
  ];

  const stats = [
    { icon: Award, label: 'Active Opportunities', value: filteredGrants.length },
    { icon: Users, label: 'Organizations', value: new Set(grants.map(g => g.organization)).size },
    { icon: Calendar, label: 'This Month', value: grants.filter(g => {
      const deadline = new Date(g.deadline);
      const now = new Date();
      return deadline.getMonth() === now.getMonth() && deadline.getFullYear() === now.getFullYear();
    }).length },
    { icon: TrendingUp, label: 'Success Rate', value: '85%' }
  ];

  const featuredOpportunities = grants.slice(0, 3);

  const upcomingDeadlines = grants
    .filter(g => g.deadline)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  const successStories = [
    {
      name: "Sarah Chen",
      title: "AI Research Grant Recipient",
      amount: "$50,000",
      story: "Secured funding for groundbreaking machine learning research through our platform."
    },
    {
      name: "Michael Rodriguez",
      title: "Fulbright Scholar",
      amount: "Full Scholarship",
      story: "Found the perfect scholarship opportunity that changed my academic trajectory."
    },
    {
      name: "Tech Startup Inc.",
      title: "Innovation Competition Winner",
      amount: "$100,000",
      story: "Won first place in a startup competition and launched our company successfully."
    }
  ];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Discover Opportunities That
              <span className={styles.heroAccent}> Transform Lives</span>
            </h1>
            <p className={styles.heroDescription}>
              Your gateway to grants, scholarships, competitions, and career opportunities. 
              Join thousands who've found their perfect match and achieved their dreams.
            </p>
            
            {/* Search Section */}
            <div className={styles.searchSection}>
              <div className={styles.searchWrapper}>
                <Search className={styles.searchIcon} size={20} />
                <input
                  type="text"
                  placeholder="Search opportunities by title, category, location, or tags..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className={styles.searchInput}
                />
                <button className={styles.filterButton}>
                  <Filter size={18} />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.quickActions}>
              <Link href="/grants" className={styles.quickAction}>
                <Award size={20} />
                Browse Grants
              </Link>
              <Link href="/scholarships" className={styles.quickAction}>
                <GraduationCap size={20} />
                Find Scholarships
              </Link>
              <Link href="/competitions" className={styles.quickAction}>
                <Trophy size={20} />
                Enter Competitions
              </Link>
            </div>
          </div>

          {/* Hero Stats */}
          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>10K+</div>
              <div className={styles.statLabel}>Opportunities</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>$2.5B+</div>
              <div className={styles.statLabel}>Total Funding</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>50K+</div>
              <div className={styles.statLabel}>Success Stories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Opportunity Types Section */}
      <div className={styles.opportunityTypes}>
        <div className={styles.sectionContent}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Explore Opportunities</h2>
            <p className={styles.sectionDescription}>
              Discover the perfect opportunity for your goals and aspirations
            </p>
          </div>
          
          <div className={styles.typesGrid}>
            {opportunityTypes.map((type) => (
              <Link key={type.title} href={type.href} className={styles.typeCard}>
                <div className={styles.typeIcon} style={{ backgroundColor: `${type.color}15`, color: type.color }}>
                  <type.icon size={24} />
                </div>
                <div className={styles.typeContent}>
                  <h3 className={styles.typeTitle}>{type.title}</h3>
                  <p className={styles.typeDescription}>{type.description}</p>
                  <div className={styles.typeCount}>{type.count} available</div>
                </div>
                <ChevronRight size={20} className={styles.typeArrow} />
              </Link>
            ))}
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
              <div key={opportunity.id} className={styles.featuredCard}>
                <div className={styles.featuredCardHeader}>
                  <div className={styles.featuredCategory}>{opportunity.category}</div>
                  <div className={styles.featuredAmount}>
                    {opportunity.amount || 'Varies'}
                  </div>
                </div>
                <h3 className={styles.featuredTitle}>{opportunity.title}</h3>
                <p className={styles.featuredDescription}>
                  {opportunity.description?.substring(0, 120)}...
                </p>
                <div className={styles.featuredMeta}>
                  <div className={styles.featuredLocation}>
                    <MapPin size={14} />
                    {opportunity.location || 'Global'}
                  </div>
                  <div className={styles.featuredDeadline}>
                    <Clock size={14} />
                    {opportunity.deadline ? new Date(opportunity.deadline).toLocaleDateString() : 'Ongoing'}
                  </div>
                </div>
                <Link href={`/grants/${opportunity.slug}`} className={styles.featuredButton}>
                  Learn More
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className={styles.deadlinesSection}>
        <div className={styles.sectionContent}>
          <div className={styles.deadlinesHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Upcoming Deadlines</h2>
              <p className={styles.sectionDescription}>Don't miss out on these time-sensitive opportunities</p>
            </div>
            <Link href="/deadlines" className={styles.sectionLink}>
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className={styles.deadlinesList}>
            {upcomingDeadlines.map((opportunity, index) => (
              <div key={opportunity.id} className={styles.deadlineItem}>
                <div className={styles.deadlineDate}>
                  <div className={styles.deadlineDay}>
                    {new Date(opportunity.deadline).getDate()}
                  </div>
                  <div className={styles.deadlineMonth}>
                    {new Date(opportunity.deadline).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                </div>
                <div className={styles.deadlineContent}>
                  <h3 className={styles.deadlineTitle}>{opportunity.title}</h3>
                  <p className={styles.deadlineOrg}>{opportunity.organization}</p>
                  <div className={styles.deadlineAmount}>{opportunity.amount || 'Amount varies'}</div>
                </div>
                <Link href={`/grants/${opportunity.slug}`} className={styles.deadlineButton}>
                  Apply Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className={styles.successSection}>
        <div className={styles.sectionContent}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Success Stories</h2>
            <p className={styles.sectionDescription}>
              Real people, real success, real opportunities
            </p>
          </div>
          
          <div className={styles.successGrid}>
            {successStories.map((story, index) => (
              <div key={index} className={styles.successCard}>
                <div className={styles.successQuote}>
                  <div className={styles.successStars}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />
                    ))}
                  </div>
                  <p className={styles.successStory}>"{story.story}"</p>
                </div>
                <div className={styles.successProfile}>
                  <div className={styles.successAvatar}>
                    {story.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className={styles.successInfo}>
                    <div className={styles.successName}>{story.name}</div>
                    <div className={styles.successTitle}>{story.title}</div>
                    <div className={styles.successAmount}>{story.amount}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className={styles.newsletterSection}>
        <div className={styles.newsletterContent}>
          <div className={styles.newsletterText}>
            <h2 className={styles.newsletterTitle}>Never Miss an Opportunity</h2>
            <p className={styles.newsletterDescription}>
              Get weekly updates on new grants, scholarships, and opportunities tailored to your interests.
            </p>
          </div>
          <div className={styles.newsletterForm}>
            <input 
              type="email" 
              placeholder="Enter your email address"
              className={styles.newsletterInput}
            />
            <button className={styles.newsletterButton}>
              Subscribe
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Stats Section */}
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
            {searchTerm ? `Search Results for "${searchTerm}"` : 'Latest Opportunities'}
          </h2>
          <div className={styles.resultsCount}>
            {isLoading ? (
              <span className={styles.loadingText}>Loading...</span>
            ) : (
              <span className={styles.countText}>
                {filteredGrants.length} {filteredGrants.length === 1 ? 'opportunity' : 'opportunities'} found
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
              <h3 className={styles.noResultsTitle}>No opportunities found</h3>
              <p className={styles.noResultsText}>
                Try adjusting your search terms or browse all available opportunities.
              </p>
              <button 
                onClick={() => setSearchTerm('')}
                className={styles.clearButton}
              >
                Clear Search
              </button>
            </div>
          ) : (
            filteredGrants.slice(0, 6).map((grant) => (
              <GrantCard key={grant.id} grant={grant} />
            ))
          )}
        </div>

        {!isLoading && filteredGrants.length > 6 && (
          <div className={styles.viewMoreSection}>
            <Link href="/grants" className={styles.viewMoreButton}>
              View All Opportunities
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}