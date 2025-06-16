project/pages/api/grants/[id].js
import fs from 'fs/promises';
import path from 'path';
import { lock } from 'proper-lockfile';
import slugify from 'slugify';

const dataFile = path.join(process.cwd(), 'data/grants.json');

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const release = await lock(dataFile, { retries: 5 });
    let grants = JSON.parse(await fs.readFile(dataFile, 'utf8'));

    if (req.method === 'GET') {
      const grant = grants.find((g) => g.id === id);
      if (!grant) return res.status(404).json({ error: 'Not found' });
      if (new Date(grant.deadline) < new Date()) {
        return res.status(410).json({ error: 'Grant expired' });
      }
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
      res.status(200).json(grant);
    } else if (req.method === 'PUT') {
      const index = grants.findIndex((g) => g.id === id);
      if (index === -1) return res.status(404).json({ error: 'Not found' });
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
      grants[index] = {
        ...grants[index],
        title,
        slug: slugify(title, { lower: true, strict: true }),
        description,
        link,
        category,
        location,
        eligibility,
        tags: tags.split(',').map((t) => t.trim()),
        publishedDate,
        organizerName,
        applicationProcess,
        contactEmail,
        deadline,
        media,
        updatedAt: new Date().toISOString(),
      };
      await fs.writeFile(dataFile, JSON.stringify(grants, null, 2));
      res.status(200).json(grants[index]);
    } else if (req.method === 'DELETE') {
      grants = grants.filter((g) => g.id !== id);
      await fs.writeFile(dataFile, JSON.stringify(grants, null, 2));
      res.status(204).end();
    } else {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  } finally {
    await release();
  }
}