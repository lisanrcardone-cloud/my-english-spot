#!/usr/bin/env node
/**
 * scripts/ci/check-jsonld.js
 *
 * Falla si algún bloque <script type="application/ld+json"> de las páginas
 * reales del sitio no es JSON válido. Mismo check que se corrió a mano
 * varias veces durante la auditoría del 25-ago, ahora automatizado.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const pages = JSON.parse(fs.readFileSync(path.join(ROOT, 'config', 'pages.json'), 'utf8')).pages;

let fails = 0;
let checked = 0;

for (const p of pages) {
  const filePath = path.join(ROOT, p.file);
  const html = fs.readFileSync(filePath, 'utf8');
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  for (const [, raw] of blocks) {
    checked++;
    try {
      JSON.parse(raw);
    } catch (e) {
      fails++;
      console.error(`FAIL ${p.file}: bloque JSON-LD inválido — ${e.message}`);
    }
  }
}

console.log(`check-jsonld: ${checked} bloques revisados en ${pages.length} páginas, ${fails} inválidos.`);
process.exit(fails > 0 ? 1 : 0);
