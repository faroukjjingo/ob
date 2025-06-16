import styles from '../../styles/OpportunityDetail.module.css';

export async function getStaticPaths() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/grants`);
  const grants = await res.json();

  const paths = grants.map((grant) => ({
    params: { slug: grant.slug.toString() },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/grants`);
  const grants = await res.json();

  const grant = grants.find((g) => g.slug === params.slug);

  if (!grant || new Date(grant.deadline) < new Date()) {
    return { notFound: true };
  }

  return {
    props: { grant },
    revalidate: 60, // ISR: revalidate every 60 seconds
  };
}

export default function GrantDetail({ grant }) {
  if (!grant) return <p>Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className={styles.heroContent}>
        {grant.media && (
          <img
            src={grant.media}
            alt={grant.title}
            className={styles.heroImage}
          />
        )}
        <h1 className={styles.title}>{grant.title}</h1>
        <p className="text-text-secondary">
          {grant.category} - {grant.location}
        </p>
        <p>Organizer: {grant.organizerName}</p>
        <p>Deadline: {new Date(grant.deadline).toLocaleDateString()}</p>
        <a href={grant.link} className={styles.primaryButton} target="_blank" rel="noopener noreferrer">
          Apply Now
        </a>
      </div>

      <div className="mt-8">
        <h2>Description</h2>
        <p>{grant.description}</p>

        <h2>Eligibility</h2>
        <p>{grant.eligibility}</p>

        <h2>Application Process</h2>
        <p>{grant.applicationProcess}</p>

        <h2>Contact</h2>
        <p>
          Email: <a href={`mailto:${grant.contactEmail}`}>{grant.contactEmail}</a>
        </p>

        {grant.tags && grant.tags.length > 0 && (
          <>
            <h2>Tags</h2>
            <p>{grant.tags.join(', ')}</p>
          </>
        )}
      </div>
    </div>
  );
}