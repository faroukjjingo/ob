// components/GrantCard.js
import Link from 'next/link';
import { Calendar, MapPin, Eye, Clock } from 'lucide-react';
import styles from '../styles/GrantCard.module.css';

export default function GrantCard({ grant }) {
  // Strip HTML tags from description and truncate to 80 characters
  const cleanDescription = grant.description
    ? grant.description.replace(/<[^>]+>/g, '')
    : 'No description available';
  const truncatedDescription = cleanDescription.length > 80
    ? `${cleanDescription.slice(0, 80)}...`
    : cleanDescription;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={styles.card}>
      {grant.location && (
        <div className={styles.tag}>
          <MapPin size={12} />
          <span>{grant.location}</span>
        </div>
      )}
      
      <div className={styles.cardImageWrapper}>
        {grant.media ? (
          <img
            src={grant.media}
            alt={grant.title}
            className={styles.cardImage}
          />
        ) : (
          <div className={styles.cardImagePlaceholder}>
            <div className={styles.placeholderIcon}>📄</div>
            <span>No Image Available</span>
          </div>
        )}
      </div>
      
      <div className={styles.cardContent}>
        <h2 className={styles.cardTitle}>{grant.title}</h2>
        <p className={styles.cardDescription}>{truncatedDescription}</p>
        
        <div className={styles.cardMeta}>
          <div className={styles.metaItem}>
            <Calendar size={14} />
            <span>Published: {formatDate(grant.publishedDate)}</span>
          </div>
          <div className={styles.metaItem}>
            <Clock size={14} />
            <span>Deadline: {formatDate(grant.deadline)}</span>
          </div>
        </div>
        
        <Link href={`/grants/${grant.slug}`} className={styles.primaryButton}>
          <Eye size={16} />
          <span>View Details</span>
        </Link>
      </div>
    </div>
  );
}