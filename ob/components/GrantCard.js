// components/GrantCard.js
import Link from 'next/link';
import styles from '../styles/GrantCard.module.css';

export default function GrantCard({ grant }) {
  return (
    <div className={styles.card}>
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
        <p className={styles.cardDescription}>
          {grant.description?.length > 80
            ? `${grant.description.slice(0, 80)}...`
            : grant.description || 'No description available'}
        </p>
        <p className={styles.cardMeta}>
          Published: {grant.publishedDate ? new Date(grant.publishedDate).toLocaleDateString() : 'N/A'}
        </p>
        <p className={styles.cardMeta}>
          Region: {grant.location || 'N/A'}
        </p>
        <p className={styles.cardMeta}>
          Deadline: {grant.deadline ? new Date(grant.deadline).toLocaleDateString() : 'N/A'}
        </p>
        <Link href={`/grants/${grant.slug}`} className={styles.primaryButton}>
          View Details
        </Link>
      </div>
    </div>
  );
}