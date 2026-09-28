#!/usr/bin/env node
/**
 * scripts/ci/check-csp.js
 *
 * Recorre todos los .html publicados (excluye template-*.html y
 * google*.html, que no se sirven como páginas reales) y calcula el
 * sha256 de cada <script> inline (excluyendo type="application/ld+json")
 * y de cada atributo on*="..." (onclick, etc). Falla listando archivo +
 * hash si alguno no está en el script-src de vercel.json — así el CSP
 * nunca queda desincronizado de los scripts inline reales del sitio.
 *
 * Excluye partials/ (fragmentos con placeholders {{...}} que build.js
 * sustituye en cada página; no se sirven tal cual, su versión ya
 * renderizada se valida al revisar la página real que los incluye).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..', '..');

function listHtmlFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'partials') continue;
      out.push(...listHtmlFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      if (entry.name.startsWith('template-')) continue;
      if (entry.name.startsWith('google')) continue;
      out.push(full);
    }
  }
  return out;
}

function sha256b64(str) {
  return 'sha256-' + crypto.createHash('sha256').update(str, 'utf8').digest('base64');
}

function extractInlineHashes(html) {
  const hashes = [];

  // <script>...</script>, excluyendo type="application/ld+json" y scripts con src (externos, no inline).
  const scriptRe = /<script\b([^>]*)>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = scriptRe.exec(html))) {
    const attrs = m[1];
    const content = m[2];
    if (/type\s*=\s*["']application\/ld\+json["']/.test(attrs)) continue;
    if (/\bsrc\s*=/.test(attrs)) continue; // script externo, no requiere hash CSP
    if (!content.trim()) continue;
    hashes.push(sha256b64(content));
  }

  // atributos on*="..." u on*='...'
  const onAttrRe = /\bon[a-z]+\s*=\s*"([^"]*)"|\bon[a-z]+\s*=\s*'([^']*)'/gi;
  while ((m = onAttrRe.exec(html))) {
    const val = m[1] !== undefined ? m[1] : m[2];
    if (!val || !val.trim()) continue;
    hashes.push(sha256b64(val));
  }

  return hashes;
}

function getScriptSrcHashes() {
  const vercelConfig = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
  const headers = vercelConfig.headers || [];
  let cspValue = null;
  for (const h of headers) {
    for (const kv of h.headers || []) {
      if (kv.key === 'Content-Security-Policy') cspValue = kv.value;
    }
  }
  if (!cspValue) {
    console.error('check-csp.js: no se encontró Content-Security-Policy en vercel.json');
    process.exit(1);
  }
  const scriptSrcMatch = /script-src\s+([^;]+);/.exec(cspValue);
  if (!scriptSrcMatch) {
    console.error('check-csp.js: no se encontró script-src dentro del CSP');
    process.exit(1);
  }
  const tokens = scriptSrcMatch[1].split(/\s+/).filter(Boolean);
  const hashSet = new Set();
  for (const t of tokens) {
    const m = /^'(sha256-[A-Za-z0-9+/=]+)'$/.exec(t);
    if (m) hashSet.add(m[1]);
  }
  return hashSet;
}

const allowedHashes = getScriptSrcHashes();
const files = listHtmlFiles(ROOT);

let fails = 0;
for (const f of files) {
  const rel = path.relative(ROOT, f);
  const html = fs.readFileSync(f, 'utf8');
  const hashes = extractInlineHashes(html);
  for (const h of hashes) {
    if (!allowedHashes.has(h)) {
      console.error(`check-csp.js: FALTA en script-src de vercel.json: ${rel} -> '${h}'`);
      fails++;
    }
  }
}

if (fails > 0) {
  console.error(`check-csp.js: ${fails} hash(es) inline sin cubrir en el CSP.`);
  process.exit(1);
}

console.log(`check-csp.js: OK — ${files.length} páginas revisadas, todos los inline cubiertos por script-src.`);
