#!/usr/bin/env node
/**
 * scripts/indexnow.js
 *
 * Avisa a IndexNow (Bing, Copilot, etc.) de las páginas que han cambiado.
 * Uso: node scripts/indexnow.js [rango-git] [--dry-run]
 *   rango-git por defecto: HEAD~1..HEAD
 *
 * Toma los .html cambiados en el rango, los convierte a URL con el mismo
 * mapeo que build.js y se queda solo con los que están en sitemap.xml (así no
 * avisa de páginas noindex, plantillas ni 404). Node puro, sin dependencias.
 */
'use strict';
const { execSync } = require('child_process');
const { fileToLoc, readSitemapLocs } = require('./build.js');

const HOST = 'www.myenglishspotclasses.com';
const KEY = '95e3583391d44bf51c24081ec4defef5'; // pública por diseño: también está en /95e3583391d44bf51c24081ec4defef5.txt
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const MAX_ATTEMPTS = 3;
const TIMEOUT_MS = 10000;

function changedUrls(range) {
  const out = execSync(`git diff --name-only --diff-filter=ACM ${range}`, {
    cwd: require('path').resolve(__dirname, '..'),
  }).toString();
  const inSitemap = new Set(readSitemapLocs());
  return out
    .split('\n')
    .filter((f) => f.endsWith('.html'))
    .map(fileToLoc)
    .filter((url) => inSitemap.has(url));
}

async function submit(urlList) {
  const body = JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList });
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body,
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      console.log(`IndexNow intento ${attempt}/${MAX_ATTEMPTS}: HTTP ${res.status}`);
      if (res.status === 200 || res.status === 202) return true;
    } catch (e) {
      console.log(`IndexNow intento ${attempt}/${MAX_ATTEMPTS}: error ${e.message}`);
    }
  }
  return false;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const range = args.find((a) => !a.startsWith('--')) || 'HEAD~1..HEAD';

  const urlList = changedUrls(range);
  if (urlList.length === 0) {
    console.log(`indexnow: sin URLs del sitemap cambiadas en ${range}; nada que enviar.`);
    return;
  }
  console.log(`indexnow: ${urlList.length} URLs en ${range}:`);
  urlList.forEach((u) => console.log(`  ${u}`));

  if (dryRun) {
    console.log('--dry-run: no se envía nada.');
    return;
  }
  if (!(await submit(urlList))) process.exit(1);
}

main();
