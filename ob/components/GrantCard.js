// components/GrantCard.js
import Link from 'next/link';
import styles from '../styles/GrantCard.module.css';

export default function GrantCard({ grant }) {
  // Strip HTML tags from description and truncate to 80 characters
  const cleanDescription = grant.description
    ? grant.description.replace(/<[^>]+>/g, '')
    : 'No description available';
  const truncatedDescription = cleanDescription.length > 80
    ? `${cleanDescription.slice(0, 80)}...`
    : cleanDescription;

  return (
    <div className={styles.card}>
      <div className={styles.tag}>{grant.location || 'N/A'}</div>
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
        <p className={styles.cardDescription}>{truncatedDescription}</p>
        <div className={styles.cardMetaGroup}>
          <p className={styles.cardMeta}>
            Published: {grant.publishedDate ? new Date(grant.publishedDate).toLocaleDateString() : 'N/A'} | 
            Deadline: {grant.deadline ? new Date(grant.deadline).toLocaleDateString() : 'N/A'}
          </p>
        </div>
        <Link href={`/grants/${grant.slug}`} className={styles.primaryButton}>
          View Details
        </Link>
      </div>
    </div>
  );
}