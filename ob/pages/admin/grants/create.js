'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import styles from '../../../styles/OpportunityDetail.module.css';
import 'react-quill/dist/quill.snow.css';
import Select from 'react-select';
import { categories } from '../../../constants/categories';
import { tagOptions } from '../../../constants/tags';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });


const locations = [
  { value: 'north_america', label: 'North America' },
  { value: 'south_america', label: 'South America' },
  { value: 'europe', label: 'Europe' },
  { value: 'asia', label: 'Asia' },
  { value: 'africa', label: 'Africa' },
  { value: 'australia', label: 'Australia' },
  { value: 'global', label: 'Global' },
];



export default function CreateGrant() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    link: '',
    category: '',
    location: '',
    eligibility: '',
    tags: [],
    publishedDate: new Date().toISOString().slice(0, 16),
    organizerName: '',
    applicationProcess: '',
    contactEmail: '',
    deadline: '',
    media: '',
  });
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    const storedAuth = localStorage.getItem('adminAuthenticated');
    if (storedAuth !== 'true') {
      router.push('/admin');
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
      const res = await fetch('/api/grants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tags: form.tags.map(tag => tag.value),
          publishedDate: form.publishedDate || new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
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
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleQuillChange = (name) => (value) => {
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSelectChange = (name) => (selected) => {
    setForm({ ...form, [name]: name === 'tags' ? selected : selected?.value });
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

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create Grant</h1>
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
          <Select
            isMulti
            options={tagsOptions}
            value={form.tags}
            onChange={handleSelectChange('tags')}
            className={styles.selectField}
            placeholder="Select Tags"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Published Date</label>
          <input
            type="text"
            name="publishedDate"
            value={form.publishedDate}
            readOnly
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
        <button type="submit" className={styles.primaryButton}>
          Create Grant
        </button>
      </form>
    </div>
  );
}