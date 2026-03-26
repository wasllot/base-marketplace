import { readFileSync } from 'fs';
import { join } from 'path';

export function getSiteContent() {
  try {
    const raw = readFileSync(join(process.cwd(), 'src/lib/data/site-content.json'), 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}
