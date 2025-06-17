import { db } from '../../../lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { generateSlug } from '../../../lib/utils';

export default async function handler(req, res) {
  const grantsCol = collection(db, 'grants');

  if (req.method === 'GET') {
    try {
      const grantsSnapshot = await getDocs(grantsCol);
      const grants = grantsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
      res.status(200).json(grants);
    } catch (error) {
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
        publishedDate: publishedDate || new Date().toISOString(),
        organizerName: organizerName || '',
        applicationProcess: applicationProcess || '',
        contactEmail,
        deadline,
        media: media || '',
        createdAt: createdAt || new Date().toISOString(),
        updatedAt: updatedAt || new Date().toISOString(),
      };
      const docRef = await addDoc(grantsCol, newGrant);
      res.status(201).json({ id: docRef.id, ...newGrant });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}