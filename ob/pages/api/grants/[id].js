import { db } from '../../../lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { generateSlug } from '../../../lib/utils';

export default async function handler(req, res) {
  const { id } = req.query;
  const grantDoc = doc(db, 'grants', id);

  if (req.method === 'GET') {
    try {
      const docSnap = await getDoc(grantDoc);
      if (!docSnap.exists()) {
        return res.status(404).json({ error: 'Not found' });
      }
      const grant = {
        id: docSnap.id,
        ...docSnap.data(),
        publishedDate: docSnap.data().publishedDate?.toDate?.()?.toISOString?.() || new Date().toISOString(),
        deadline: docSnap.data().deadline?.toDate?.()?.toISOString?.() || new Date().toISOString(),
      };
      if (new Date(grant.deadline) < new Date()) {
        return res.status(410).json({ error: 'Grant expired' });
      }
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
      res.status(200).json(grant);
    } catch (error) {
      console.error('Error fetching grant:', error);
      res.status(500).json({ error: 'Server error' });
    }
  } else if (req.method === 'PUT') {
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
        updatedAt,
      } = req.body;
      const updatedGrant = {
        title,
        slug: generateSlug(title),
        description,
        link,
        category,
        location,
        eligibility,
        tags: Array.isArray(tags) ? tags : [],
        publishedDate: new Date(publishedDate),
        organizerName: organizerName || '',
        applicationProcess: applicationProcess || '',
        contactEmail,
        deadline: new Date(deadline),
        media: media || '',
        updatedAt: new Date(updatedAt || new Date()),
      };
      await updateDoc(grantDoc, updatedGrant);
      res.status(200).json({ id, ...updatedGrant });
    } catch (error) {
      console.error('Error updating grant:', error);
      res.status(500).json({ error: 'Server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await deleteDoc(grantDoc);
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting grant:', error);
      res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}