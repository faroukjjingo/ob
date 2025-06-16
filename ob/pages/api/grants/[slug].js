
import styles from '../../styles/OpportunityDetail.module.css';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export async function getStaticPaths() {
  const grantsCol = collection(db, 'grants');
  const grantsSnapshot = await getDocs(grantsCol);
  const paths = grantsSnapshot.docs.map(doc => ({ params: { slug: doc.data().slug } }));
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const grantsCol = collection(db, 'grants');
  const q = query(grantsCol, where('slug', '==', params.slug));
  const grantsSnapshot = await getDocs(q);
  const grant = grantsSnapshot.docs[0]?.data();
  if (!grant || new Date(grant.deadline) < new Date()) {
    return { notFound: true };
  }
  return { props: { grant: { id: grantsSnapshot.docs[0].id, ...grant } }, revalidate: 60 };
}

export default function GrantDetail({ grant }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className={styles.heroContent}>
        {grant.media && <img src={grant.media} alt={grant.title} className={styles.heroImage} />}
        <h1 className={styles.title}>{grant.title}</h1>
        <p className="text-text-secondary">{grant.category} - {grant.location}</p>
        <p>Organizer: {grant.organizerName}</p>
        <p>Deadline: {new Date(grant.deadline).toLocaleDateString()}</p>
        <a href={grant.link} className={styles.primaryButton}>Apply Now</a>
      </div>
      <div className="mt-8">
        <h2>Description</h2>
        <p>{grant.description}</p>
        <h2>Eligibility</h2>
        <p>{grant.eligibility}</p>
        <h2>Application Process</h2>
        <p>{grant.applicationProcess}</p>
        <h2>Contact</h2>
        <p>Email: <a href={`mailto:${grant.contactEmail}`}>{grant.contactEmail}</a></p>
        <h2>Tags</h2>
        <p>{grant.tags.join(', ')}</p>
      </div>
    </div>
  );
}