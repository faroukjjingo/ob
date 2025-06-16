project/lib/utils.js
import slugify from 'slugify';

export function generateSlug(title) {
  return slugify(title, { lower: true, strict: true });
}