// pages/grants/[slug].js
import styles from '../../styles/OpportunityDetail.module.css';
import Select from 'react-select';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import { tagsOptions } from '../../constants/Tags';
import { categories } from '../../constants/Categories';


const locations = [
  { value: 'north_america', label: 'North America' },
  { value: 'south_america', label: 'South America' },
  { value: 'europe', label: 'Europe' },
  { value: 'asia', label: 'Asia' },
  { value: 'africa', label: 'Africa' },
  { value: 'australia', label: 'Australia' },
  { value: 'global', label: 'Global' },
];

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
        <div className={styles.metaGroup}>
          <p className={styles.meta}>
            Category: {categories.find(c => c.value === grant.category)?.label || grant.category}
          </p>
          <p className={styles.meta}>
            Location: {locations.find(l => l.value === grant.location)?.label || grant.location}
          </p>
          <p className={styles.meta}>
            Organizer: {grant.organizerName}
          </p>
          <p className={styles.meta}>
            Deadline: {new Date(grant.deadline).toLocaleDateString()}
          </p>
          <p className={styles.meta}>
            Published: {new Date(grant.publishedDate).toLocaleDateString()}
          </p>
        </div>
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
        <div className={styles.formGroup}>
          <label className={styles.label}>Description</label>
          <div className={styles.quillViewer}>
            <ReactQuill
              value={grant.description}
              readOnly={true}
              theme="bubble"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Eligibility</label>
          <div className={styles.quillViewer}>
            <ReactQuill
              value={grant.eligibility}
              readOnly={true}
              theme="bubble"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Application Process</label>
          <div className={styles.quillViewer}>
            <ReactQuill
              value={grant.applicationProcess}
              readOnly={true}
              theme="bubble"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Contact</label>
          <p className={styles.content}>
            Email: <a href={`mailto:${grant.contactEmail}`} className={styles.emailLink}>{grant.contactEmail}</a>
          </p>
        </div>

        {grant.tags && grant.tags.length > 0 && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Tags</label>
            <div className={styles.tags}>
              {grant.tags.map((tag, index) => (
                <span key={index} className={styles.tag}>
                  {tagsOptions.find(t => t.value === tag)?.label || tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}