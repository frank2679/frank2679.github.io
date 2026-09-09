// Fetches the latest resume PDFs from github.com/frank2679/resume-ng and
// bundles them as same-origin static assets so the deployed site never
// depends on a third-party CDN (jsDelivr/statically.io etc. are unreliable
// or blocked from mainland China) to serve the resume.
//
// Runs at build time (see package.json "prebuild"/"predev") and on a
// schedule in CI (see .github/workflows/deploy.yml), never at request time.

import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const REPO = 'frank2679/resume-ng';
const DIR = 'resume_release';
const OUT_DIR = path.join(process.cwd(), 'public', 'resume');
const FILE_RE = /^(\d{6})_.+_(cn|en)\.pdf$/i;

const headers = { Accept: 'application/vnd.github+json' };
if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

async function main() {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${DIR}`, { headers });
  if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
  const files = await res.json();

  const latest = {};
  for (const f of files) {
    if (f.type !== 'file') continue;
    const m = f.name.match(FILE_RE);
    if (!m) continue;
    const [, date, langRaw] = m;
    const lang = langRaw.toLowerCase();
    if (!latest[lang] || date > latest[lang].date) {
      latest[lang] = { date, name: f.name, downloadUrl: f.download_url };
    }
  }

  if (!latest.en && !latest.cn) {
    throw new Error(`No files in ${REPO}/${DIR} matched the expected YYYYMM_*_cn|en.pdf naming`);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const meta = { syncedAt: new Date().toISOString() };

  for (const lang of ['en', 'cn']) {
    const entry = latest[lang];
    if (!entry) continue;
    const pdfRes = await fetch(entry.downloadUrl);
    if (!pdfRes.ok) throw new Error(`Failed to download ${entry.name}: ${pdfRes.status}`);
    const buf = Buffer.from(await pdfRes.arrayBuffer());
    writeFileSync(path.join(OUT_DIR, `resume-${lang}.pdf`), buf);
    meta[lang] = { date: entry.date, sourceName: entry.name };
    console.log(`[sync-resume] ${lang}: ${entry.name} (${buf.length} bytes)`);
  }

  writeFileSync(path.join(OUT_DIR, 'meta.json'), JSON.stringify(meta, null, 2));
  console.log('[sync-resume] done');
}

main().catch((err) => {
  // Never fail the site build/dev server just because resume-ng was
  // unreachable — the resume page falls back to linking the source repo
  // when public/resume/meta.json is missing or stale.
  console.warn(`[sync-resume] skipped: ${err.message}`);
});
