// pages/grants/[slug].js
import styles from '../../styles/OpportunityDetail.module.css';

export async function getStaticPaths() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/grants`);
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
    
    const grants = await res.json();

    const paths = grants.map((grant) => ({
      params: { slug: grant.slug.toString() },
    }));

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Error in getStaticPaths:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}

export async function getStaticProps({ params }) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/grants`);
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

    const grants = await res.json();
    const grant = grants.find((g) => g.slug === params.slug);

    if (!grant || new Date(grant.deadline) < new Date()) {
      return { notFound: true };
    }

    return {
      props: { grant },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return { notFound: true };
  }
}

export default function GrantDetail({ grant }) {
  if (!grant) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.heroContent}>
        {grant.media && (
          <div className={styles.heroImageWrapper}>
            <img
              src={grant.media}
              alt={grant.title}
              className={styles.heroImage}
            />
          </div>
        )}
        <h1 className={styles.title}>{grant.title}</h1>
        <p className={styles.subtitle}>
          {grant.category} | {grant.location}
        </p>
        <p className={styles.meta}>Organizer: {grant.organizerName}</p>
        <p className={styles.meta}>Deadline: {new Date(grant.deadline).toLocaleDateString()}</p>
        <a
          href={grant.link}
          className={styles.primaryButton}
          target="_blank"
          rel="noopener noreferrer"
        >
          Apply Now
        </a>
      </div>

      <div className={styles.details}>
        <h2 className={styles.sectionTitle}>Description</h2>
        <div className={styles.content}>{grant.description}</div>

        <h2 className={styles.sectionTitle}>Eligibility</h2>
        <div className={styles.content}>{grant.eligibility}</div>

        <h2 className={styles.sectionTitle}>Application Process</h2>
        <div className={styles.content}>{grant.applicationProcess}</div>

        <h2 className={styles.sectionTitle}>Contact</h2>
        <p className={styles.content}>
          Email: <a href={`mailto:${grant.contactEmail}`} className={styles.emailLink}>{grant.contactEmail}</a>
        </p>

        {grant.tags && grant.tags.length > 0 && (
          <>
            <h2 className={styles.sectionTitle}>Tags</h2>
            <div className={styles.tags}>
              {grant.tags.map((tag, index) => (
                <span key={index} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}