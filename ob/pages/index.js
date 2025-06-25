'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import styles from '../styles/OpportunityDetail.module.css';
import 'react-quill/dist/quill.snow.css';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { categories } from '../constants/Categories';
import { tagsOptions } from '../constants/Tags';
import { locations } from '../constants/Locations';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export async function getServerSideProps({ params }) {
  const grantDoc = doc(db, 'grants', params.slug);
  const docSnap = await getDoc(grantDoc);
  if (!docSnap.exists()) {
    return { notFound: true };
  }
  const grantData = docSnap.data();
  return {
    props: {
      grant: {
        id: docSnap.id,
        ...grantData,
        tags: grantData.tags
          ? grantData.tags.map(tag => ({ value: tag, label: tag }))
          : [],
        publishedDate: grantData.publishedDate
          ? grantData.publishedDate.toDate().toISOString()
          : new Date().toISOString(),
        deadline: grantData.deadline
          ? grantData.deadline.toDate().toISOString()
          : new Date().toISOString(),
      },
    },
  };
}

export default function EditGrant({ grant }) {
  const [form, setForm] = useState({
    title: grant.title || '',
    description: grant.description || '',
    link: grant.link || '',
    category: grant.category || '',
    location: grant.location || '',
    eligibility: grant.eligibility || '',
    tags: grant.tags || [],
    publishedDate: grant.publishedDate.slice(0, 16),
    organizerName: grant.organizerName || '',
    applicationProcess: grant.applicationProcess || '',
    contactEmail: grant.contactEmail || '',
    deadline: grant.deadline.slice(0, 16),
    media: grant.media || '',
  });
  const [errors, setErrors] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedAuth = localStorage.getItem('adminAuthenticated');
    if (storedAuth !== 'true') {
      router.push('/admin');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.title) newErrors.title = 'Title is required';
    if (!form.description) newErrors.description = 'Description is required';
    if (!form.link) newErrors.link = 'Link is required';
    if (!form.category) newErrors.category = 'Category is required';
    if (!form.location) newErrors.location = 'Location is required';
    if (!form.eligibility) newErrors.eligibility = 'Eligibility is required';
    if (!form.deadline) newErrors.deadline = 'Deadline is required';
    if (!form.contactEmail) newErrors.contactEmail = 'Contact Email is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const res = await fetch(`/api/grants/${grant.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tags: form.tags.map(tag => tag.value),
          updatedAt: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        router.push('/admin');
      } else {
        console.error('Failed to update grant');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/grants/${grant.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin');
      } else {
        console.error('Failed to delete grant');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleQuillChange = (name) => (value) => {
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSelectChange = (name) => (selected) => {
    setForm({
      ...form,
      [name]: name === 'tags' ? selected || [] : selected?.value || '',
    });
    setErrors({ ...errors, [name]: '' });
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Edit Grant</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Title *</label>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className={styles.inputField}
          />
          {errors.title && <p className={styles.errorText}>{errors.title}</p>}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Description *</label>
          <ReactQuill
            value={form.description}
            onChange={handleQuillChange('description')}
            modules={quillModules}
            className={styles.quillEditor}
          />
          {errors.description && <p className={styles.errorText}>{errors.description}</p>}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Link *</label>
          <input
            type="url"
            name="link"
            placeholder="Link"
            value={form.link}
            onChange={handleChange}
            className={styles.inputField}
          />
          {errors.link && <p className={styles.errorText}>{errors.link}</p>}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Category *</label>
          <Select
            options={categories}
            value={categories.find(c => c.value === form.category)}
            onChange={handleSelectChange('category')}
            className={styles.selectField}
            placeholder="Select Category"
          />
          {errors.category && <p className={styles.errorText}>{errors.category}</p>}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Location *</label>
          <Select
            options={locations}
            value={locations.find(l => l.value === form.location)}
            onChange={handleSelectChange('location')}
            className={styles.selectField}
            placeholder="Select Location"
          />
          {errors.location && <p className={styles.errorText}>{errors.location}</p>}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Eligibility *</label>
          <ReactQuill
            value={form.eligibility}
            onChange={handleQuillChange('eligibility')}
            modules={quillModules}
            className={styles.quillEditor}
          />
          {errors.eligibility && <p className={styles.errorText}>{errors.eligibility}</p>}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Tags</label>
          <CreatableSelect
            isMulti
            options={tagsOptions}
            value={form.tags}
            onChange={handleSelectChange('tags')}
            className={styles.selectField}
            placeholder="Select or type tags"
            formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Published Date</label>
          <input
            type="datetime-local"
            name="publishedDate"
            value={form.publishedDate}
            onChange={handleChange}
            className={styles.inputField}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Organizer Name</label>
          <input
            type="text"
            name="organizerName"
            placeholder="Organizer Name"
            value={form.organizerName}
            onChange={handleChange}
            className={styles.inputField}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Application Process</label>
          <ReactQuill
            value={form.applicationProcess}
            onChange={handleQuillChange('applicationProcess')}
            modules={quillModules}
            className={styles.quillEditor}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Contact Email *</label>
          <input
            type="email"
            name="contactEmail"
            placeholder="Contact Email"
            value={form.contactEmail}
            onChange={handleChange}
            className={styles.inputField}
          />
          {errors.contactEmail && <p className={styles.errorText}>{errors.contactEmail}</p>}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Deadline *</label>
          <input
            type="datetime-local"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            className={styles.inputField}
          />
          {errors.deadline && <p className={styles.errorText}>{errors.deadline}</p>}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Media URL</label>
          <input
            type="url"
            name="media"
            placeholder="Media URL"
            value={form.media}
            onChange={handleChange}
            className={styles.inputField}
          />
        </div>
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