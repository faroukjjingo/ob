
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../../styles/OpportunityDetail.module.css';
import { auth } from '../../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function CreateGrant() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    link: '',
    category: '',
    location: '',
    eligibility: '',
    tags: '',
    publishedDate: new Date().toISOString().slice(0, 16),
    organizerName: '',
    applicationProcess: '',
    contactEmail: '',
    deadline: '',
    media: '',
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

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
    await fetch('/api/grants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    router.push('/admin');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className={styles.title}>Create Grant</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="bg-surface shadow-sm w-full"
          style={{ borderRadius: 'var(--radius-sm)', padding: 'var(--space-sm)' }}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="bg-surface shadow-sm w-full"
          style={{ borderRadius: 'var(--radius-sm)', padding: 'var(--space-sm)' }}
        />
        <input
          type="url"
          name="link"
          placeholder="Link"
          value={form.link}
          onChange={handleChange}
          className="bg-surface shadow-sm w-full"
          style={{ borderRadius: 'var(--radius-sm)', padding: 'var(--space-sm)' }}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="bg-surface shadow-sm w-full"
          style={{ borderRadius: 'var(--radius-sm)', padding: 'var(--space-sm)' }}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="bg-surface shadow-sm w-full"
          style={{ borderRadius: 'var(--radius-sm)', padding: 'var(--space-sm)' }}
        />
        <textarea
          name="eligibility"
          placeholder="Eligibility"
          value={form.eligibility}
          onChange={handleChange}
          className="bg-surface shadow-sm w-full"
          style={{ borderRadius: 'var(--radius-sm)', padding: 'var(--space-sm)' }}
        />
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma-separated)"
          value={form.tags}
          onChange={handleChange}
          className="bg-surface shadow-sm w-full"
          style={{ borderRadius: 'var(--radius-sm)', padding: 'var(--space-sm)' }}
        />
        <input
          type="datetime-local"
          name="publishedDate"
          value={form.publishedDate}
          onChange={handleChange}
          className="bg-surface shadow-sm w-full"
          style={{ borderRadius: 'var(--radius-sm)', padding: 'var(--space-sm)' }}
        />
        <input
          type="text"
          name="organizerName"
          placeholder="Organizer Name"
          value={form.organizerName}
          onChange={handleChange}
          className="bg-surface shadow-sm w-full"
          style={{ borderRadius: 'var(--radius-sm)', padding: 'var(--space-sm)' }}
        />
        <textarea
          name="applicationProcess"
          placeholder="Application Process"
          value={form.applicationProcess}
          onChange={handleChange}
          className="bg-surface shadow-sm w-full"
          style={{ borderRadius: 'var(--radius-sm)', padding: 'var(--space-sm)' }}
        />
        <input
          type="email"
          name="contactEmail"
          placeholder="Contact Email"
          value={form.contactEmail}
          onChange={handleChange}
          className="bg-surface shadow-sm w-full"
          style={{ borderRadius: 'var(--radius-sm)', padding: 'var(--space-sm)' }}
        />
        <input
          type="datetime-local"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          className="bg-surface shadow-sm w-full"
          style={{ borderRadius: 'var(--radius-sm)', padding: 'var(--space-sm)' }}
        />
        <input
          type="url"
          name="media"
          placeholder="Media URL"
          value={form.media}
          onChange={handleChange}
          className="bg-surface shadow-sm w-full"
          style={{ borderRadius: 'var(--radius-sm)', padding: 'var(--space-sm)' }}
        />
        <button type="submit" className={styles.primaryButton}>
          Create Grant
        </button>
      </form>
    </div>
  );
}