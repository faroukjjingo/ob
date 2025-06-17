// pages/grants/[slug].js
import styles from '../../styles/OpportunityDetail.module.css';
import Select from 'react-select';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

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