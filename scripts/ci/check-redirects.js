#!/usr/bin/env node
/**
 * scripts/ci/check-redirects.js
 *
 * Falla si alguna página real (config/pages.json) tiene un rewrite
 * ("/slug" -> "/slug.html") en vercel.json sin su redirect complementario
 * ("/slug.html" -> "/slug"). Es el check pensado directamente para no
 * repetir el bug de las 12 páginas duplicadas encontrado el 25-ago.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const vercelConfig = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));

const rewrites = vercelConfig.rewrites || [];
const redirects = vercelConfig.redirects || [];

// Alias puros en inglés servidos para agentes/audits (agentic readiness), no
// URLs canónicas nuevas: no llevan redirect inverso ni reemplazan el
// canonical existente de la página en español (ej. /contacto, /politica-privacidad).
const ALIAS_ONLY_REWRITES = ['/contact', '/privacy'];

let fails = 0;
let checked = 0;

for (const rw of rewrites) {
  if (ALIAS_ONLY_REWRITES.includes(rw.source)) continue;
  // solo nos importan los rewrites 1:1 de página (source sin :slug, destino .html real)
  if (rw.source.includes(':slug') || !rw.destination.endsWith('.html')) continue;
  checked++;
  const expectedRedirectSource = rw.destination; // ej: "/aviso-legal.html"
  const hasRedirect = redirects.some(
    (rd) => rd.source === expectedRedirectSource && rd.destination === rw.source && rd.permanent === true
  );
  if (!hasRedirect) {
    fails++;
    console.error(`FAIL: rewrite ${rw.source} -> ${rw.destination} no tiene redirect complementario ${rw.destination} -> ${rw.source}`);
  }
}

console.log(`check-redirects: ${checked} rewrites de página revisados, ${fails} sin redirect complementario.`);
process.exit(fails > 0 ? 1 : 0);
