import { db } from '../../../lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { generateSlug } from '../../../lib/utils';

export default async function handler(req, res) {
  const grantsCol = collection(db, 'grants');

  if (req.method === 'GET') {
    try {
      const grantsSnapshot = await getDocs(grantsCol);
      const grants = grantsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        publishedDate: doc.data().publishedDate?.toDate?.()?.toISOString?.() || new Date().toISOString(),
        deadline: doc.data().deadline?.toDate?.()?.toISOString?.() || new Date().toISOString(),
      }));
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
      res.status(200).json(grants);
    } catch (error) {
      console.error('Error fetching grants:', error);
      res.status(500).json({ error: 'Server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const {
        title,
        description,
        link,
        category,
        location,
        eligibility,
        tags,
        publishedDate,
        organizerName,
        applicationProcess,
        contactEmail,
        deadline,
        media,
        createdAt,
        updatedAt,
      } = req.body;
      const newGrant = {
        title,
        slug: generateSlug(title),
        description,
        link,
        category,
        location,
        eligibility,
        tags: Array.isArray(tags) ? tags : [],
        publishedDate: new Date(publishedDate || new Date()),
        organizerName: organizerName || '',
        applicationProcess: applicationProcess || '',
        contactEmail,
        deadline: new Date(deadline),
        media: media || '',
        createdAt: new Date(createdAt || new Date()),
        updatedAt: new Date(updatedAt || new Date()),
      };
      const docRef = await addDoc(grantsCol, newGrant);
      res.status(201).json({ id: docRef.id, ...newGrant });
    } catch (error) {
      console.error('Error creating grant:', error);
      res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}