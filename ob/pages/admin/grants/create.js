// pages/admin/grants/create.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import styles from '../../../styles/OpportunityDetail.module.css';
import 'react-quill/dist/quill.snow.css';
import Select from 'react-select';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const categories = [
  { value: 'youth', label: 'Youth' },
  { value: 'research', label: 'Research' },
  { value: 'scholarships', label: 'Scholarships' },
  { value: 'community', label: 'Community Development' },
  { value: 'education', label: 'Education' },
  { value: 'health', label: 'Health' },
  { value: 'environment', label: 'Environment' },
  { value: 'technology', label: 'Technology' },
  { value: 'arts', label: 'Arts & Culture' },
  { value: 'social_justice', label: 'Social Justice' },
];

const locations = [
  { value: 'north_america', label: 'North America' },
  { value: 'south_america', label: 'South America' },
  { value: 'europe', label: 'Europe' },
  { value: 'asia', label: 'Asia' },
  { value: 'africa', label: 'Africa' },
  { value: 'australia', label: 'Australia' },
  { value: 'global', label: 'Global' },
];

const tagsOptions = [
  { value: 'sustainability', label: 'Sustainability' },
  { value: 'innovation', label: 'Innovation' },
  { value: 'education', label: 'Education' },
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'youth', label: 'Youth' },
  { value: 'research', label: 'Research' },
  { value: 'scholarships', label: 'Scholarships' },
  { value: 'community', label: 'Community' },
  { value: 'environment', label: 'Environment' },
  { value: 'climate_change', label: 'Climate Change' },
  { value: 'social_justice', label: 'Social Justice' },
  { value: 'arts', label: 'Arts' },
  { value: 'culture', label: 'Culture' },
  { value: 'diversity', label: 'Diversity' },
  { value: 'inclusion', label: 'Inclusion' },
  { value: 'STEM', label: 'STEM' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'entrepreneurship', label: 'Entrepreneurship' },
  { value: 'women_empowerment', label: 'Women Empowerment' },
  { value: 'rural_development', label: 'Rural Development' },
  { value: 'urban_development', label: 'Urban Development' },
  { value: 'public_health', label: 'Public Health' },
  { value: 'mental_health', label: 'Mental Health' },
  { value: 'disaster_relief', label: 'Disaster Relief' },
  { value: 'human_rights', label: 'Human Rights' },
  { value: 'poverty_reduction', label: 'Poverty Reduction' },
  { value: 'renewable_energy', label: 'Renewable Energy' },
  { value: 'water_sanitation', label: 'Water & Sanitation' },
  { value: 'food_security', label: 'Food Security' },
  // Add more tags to reach 100
  { value: 'literacy', label: 'Literacy' },
  { value: 'vocational_training', label: 'Vocational Training' },
  { value: 'microfinance', label: 'Microfinance' },
  { value: 'global_health', label: 'Global Health' },
  { value: 'indigenous_rights', label: 'Indigenous Rights' },
  { value: 'refugee_support', label: 'Refugee Support' },
  { value: 'gender_equality', label: 'Gender Equality' },
  { value: 'climate_action', label: 'Climate Action' },
  { value: 'wildlife_conservation', label: 'Wildlife Conservation' },
  { value: 'ocean_protection', label: 'Ocean Protection' },
  { value: 'forest_conservation', label: 'Forest Conservation' },
  { value: 'sustainable_agriculture', label: 'Sustainable Agriculture' },
  { value: 'clean_energy', label: 'Clean Energy' },
  { value: 'waste_management', label: 'Waste Management' },
  { value: 'recycling', label: 'Recycling' },
  { value: 'education_reform', label: 'Education Reform' },
  { value: 'digital_literacy', label: 'Digital Literacy' },
  { value: 'AI_research', label: 'AI Research' },
  { value: 'biotechnology', label: 'Biotechnology' },
  { value: 'medical_research', label: 'Medical Research' },
  { value: 'public_policy', label: 'Public Policy' },
  { value: 'economic_development', label: 'Economic Development' },
  { value: 'social_entrepreneurship', label: 'Social Entrepreneurship' },
  { value: 'youth_leadership', label: 'Youth Leadership' },
  { value: 'community_engagement', label: 'Community Engagement' },
  { value: 'cultural_preservation', label: 'Cultural Preservation' },
  { value: 'disability_rights', label: 'Disability Rights' },
  { value: 'LGBTQ_rights', label: 'LGBTQ+ Rights' },
  { value: 'veteran_support', label: 'Veteran Support' },
  { value: 'elderly_care', label: 'Elderly Care' },
  { value: 'child_welfare', label: 'Child Welfare' },
  { value: 'peacebuilding', label: 'Peacebuilding' },
  { value: 'conflict_resolution', label: 'Conflict Resolution' },
  { value: 'humanitarian_aid', label: 'Humanitarian Aid' },
  { value: 'global_partnerships', label: 'Global Partnerships' },
  { value: 'civic_engagement', label: 'Civic Engagement' },
  { value: 'anti_corruption', label: 'Anti-Corruption' },
  { value: 'legal_aid', label: 'Legal Aid' },
  { value: 'public_safety', label: 'Public Safety' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'urban_planning', label: 'Urban Planning' },
  { value: 'rural_health', label: 'Rural Health' },
  { value: 'tech_innovation', label: 'Tech Innovation' },
  { value: 'data_science', label: 'Data Science' },
  { value: 'machine_learning', label: 'Machine Learning' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'blockchain', label: 'Blockchain' },
  { value: 'fintech', label: 'Fintech' },
  { value: 'edtech', label: 'EdTech' },
  { value: 'healthtech', label: 'HealthTech' },
  { value: 'agritech', label: 'AgriTech' },
  { value: 'space_research', label: 'Space Research' },
  { value: 'renewable_resources', label: 'Renewable Resources' },
  { value: 'energy_efficiency', label: 'Energy Efficiency' },
  { value: 'sustainable_design', label: 'Sustainable Design' },
  { value: 'green_technology', label: 'Green Technology' },
  { value: 'social_impact', label: 'Social Impact' },
  { value: 'philanthropy', label: 'Philanthropy' },
  { value: 'nonprofit', label: 'Nonprofit' },
  { value: 'volunteerism', label: 'Volunteerism' },
  { value: 'grassroots', label: 'Grassroots' },
  { value: 'capacity_building', label: 'Capacity Building' },
  { value: 'advocacy', label: 'Advocacy' },
  { value: 'policy_reform', label: 'Policy Reform' },
  { value: 'community_health', label: 'Community Health' },
  { value: 'youth_mentorship', label: 'Youth Mentorship' },
  { value: 'cultural_exchange', label: 'Cultural Exchange' },
  { value: 'global_education', label: 'Global Education' },
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