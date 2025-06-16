project/pages/api/grants/cleanup.js
import fs from 'fs/promises';
import path from 'path';
import { lock } from 'proper-lockfile';

const dataFile = path.join(process.cwd(), 'data/grants.json');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const release = await lock(dataFile, { retries: 5 });
    let grants = JSON.parse(await fs.readFile(dataFile, 'utf8'));
    const now = new Date();
    const initialCount = grants.length;
    grants = grants.filter((grant) => new Date(grant.deadline) > now);
    await fs.writeFile(dataFile, JSON.stringify(grants, null, 2));
    res.status(200).json({
      message: `Deleted ${initialCount - grants.length} expired grants`,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  } finally {
    await release();
  }
}