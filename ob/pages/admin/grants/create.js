// pages/admin/grants/create.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        router.push('/admin');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      router.push('/admin');
      return;
    }
    try {
      const res = await fetch('/api/grants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push('/admin');
      } else {
        console.error('Failed to create grant');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create Grant</h1>
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
        <button type="submit" className={styles.primaryButton}>
          Create Grant
        </button>
      </form>
    </div>
  );
}