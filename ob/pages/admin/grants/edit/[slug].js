// project/pages/admin/grants/edit/[slug].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../../../styles/OpportunityDetail.module.css';
import { auth, db } from '../../../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export async function getServerSideProps({ params }) {
  const grantDoc = doc(db, 'grants', params.slug);
  const docSnap = await getDoc(grantDoc);
  if (!docSnap.exists()) {
    return { notFound: true };
  }
  return { props: { grant: { id: docSnap.id, ...docSnap.data() } } };
}

export default function EditGrant({ grant }) {
  const [form, setForm] = useState({
    title: grant.title,
    description: grant.description,
    link: grant.link,
    category: grant.category,
    location: grant.location,
    eligibility: grant.eligibility,
    tags: grant.tags.join(', '),
    publishedDate: new Date(grant.publishedDate).toISOString().slice(0, 16),
    organizerName: grant.organizerName,
    applicationProcess: grant.applicationProcess,
    contactEmail: grant.contactEmail,
    deadline: new Date(grant.deadline).toISOString().slice(0, 16),
    media: grant.media,
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/admin');
      } else {
        setIsAuthenticated(true);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`/api/grants/${grant.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    router.push('/admin');
  };

  const handleDelete = async () => {
    await fetch(`/api/grants/${grant.id}`, { method: 'DELETE' });
    router.push('/admin');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Edit Grant</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className={styles.inputField}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className={styles.inputField}
        />
        <input
          type="url"
          name="link"
          placeholder="Link"
          value={form.link}
          onChange={handleChange}
          className={styles.inputField}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className={styles.inputField}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className={styles.inputField}
        />
        <textarea
          name="eligibility"
          placeholder="Eligibility"
          value={form.eligibility}
          onChange={handleChange}
          className={styles.inputField}
        />
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma-separated)"
          value={form.tags}
          onChange={handleChange}
          className={styles.inputField}
        />
        <input
          type="datetime-local"
          name="publishedDate"
          value={form.publishedDate}
          onChange={handleChange}
          className={styles.inputField}
        />
        <input
          type="text"
          name="organizerName"
          placeholder="Organizer Name"
          value={form.organizerName}
          onChange={handleChange}
          className={styles.inputField}
        />
        <textarea
          name="applicationProcess"
          placeholder="Application Process"
          value={form.applicationProcess}
          onChange={handleChange}
          className={styles.inputField}
        />
        <input
          type="email"
          name="contactEmail"
          placeholder="Contact Email"
          value={form.contactEmail}
          onChange={handleChange}
          className={styles.inputField}
        />
        <input
          type="datetime-local"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          className={styles.inputField}
        />
        <input
          type="url"
          name="media"
          placeholder="Media URL"
          value={form.media}
          onChange={handleChange}
          className={styles.inputField}
        />
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.primaryButton}>
            Update Grant
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className={styles.deleteButton}
          >
            Delete Grant
          </button>
        </div>
      </form>
    </div>
  );
}