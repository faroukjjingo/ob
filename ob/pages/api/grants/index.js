project/pages/api/grants/index.js
import fs from 'fs/promises';
import path from 'path';
import { lock } from 'proper-lockfile';
import slugify from 'slugify';

const dataFile = path.join(process.cwd(), 'data/grants.json');

async function getGrants() {
  try {
    const data = await fs.readFile(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(dataFile, '[]');
      return [];
    }
    throw error;
  }
}

export default async function handler(req, res) {
  try {
    const release = await lock(dataFile, { retries: 5 });
    let grants = await getGrants();

    if (req.method === 'GET') {
      const now = new Date();
      grants = grants.filter((grant) => new Date(grant.deadline) > now);
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
      res.status(200).json(grants);
    } else if (req.method === 'POST') {
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
      } = req.body;
      const newGrant = {
        id: String(Date.now()),
        title,
        slug: slugify(title, { lower: true, strict: true }),
        description,
        link,
        category,
        location,
        eligibility,
        tags: tags.split(',').map((t) => t.trim()),
        publishedDate: publishedDate || new Date().toISOString(),
        organizerName,
        applicationProcess,
        contactEmail,
        deadline,
        media,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      grants.push(newGrant);
      await fs.writeFile(dataFile, JSON.stringify(grants, null, 2));
      res.status(201).json(newGrant);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  } finally {
    await release();
  }
}