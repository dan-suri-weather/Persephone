// Refreshes books.json from https://persephonebooks.co.uk/pages/book-list.
// Only adds books with new numbers, so existing entries never change. Run by .github/workflows/update-books.yml.
import { readFile, writeFile } from 'node:fs/promises';

const LIST_URL = 'https://persephonebooks.co.uk/pages/book-list';
const FILE = new URL('../books.json', import.meta.url);

const decode = s => s
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');

const html = await (await fetch(LIST_URL)).text();
const found = new Map();
for (const [, slug, inner] of html.matchAll(/<a[^>]+href="\/products\/([^"?#]+)[^"]*"[^>]*>([\s\S]*?)<\/a>/g)) {
  const text = inner.replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, '\n');
  const lines = text.split('\n').map(s => decode(s).trim()).filter(Boolean);
  const i = lines.findIndex(l => /^\d+\.\s+\S/.test(l));
  if (i < 0) continue;
  const [, n, title] = lines[i].match(/^(\d+)\.\s+(.+)$/);
  if (!found.has(+n)) found.set(+n, [+n, title, lines[i + 1] || '', slug]);
}
if (found.size < 50) throw new Error(`Only found ${found.size} books - page layout may have changed`);

const books = JSON.parse(await readFile(FILE, 'utf8'));
const have = new Set(books.map(b => b[0]));
const added = [...found.values()].filter(b => !have.has(b[0]));
if (!added.length) { console.log('No new books.'); process.exit(0); }
books.push(...added);
books.sort((a, b) => a[0] - b[0]);
await writeFile(FILE, '[' + books.map(b => JSON.stringify(b)).join(',') + ']\n');
console.log('Added:', added.map(b => `${b[0]}. ${b[1]}`).join('; '));
