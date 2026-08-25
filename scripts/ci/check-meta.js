#!/usr/bin/env node
/**
 * scripts/ci/check-meta.js
 *
 * Falla si algún .html tocado en el diff actual (vs. el commit anterior,
 * o vs. origin/main en un PR) le falta <title>, meta description o
 * rel="canonical" no vacíos. Solo mira archivos modificados, no todo
 * el repo — así no se dispara con contenido histórico ya conocido.
 */
'use strict';
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');

function changedHtmlFiles() {
  const base = process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : 'HEAD~1';
  let out;
  try {
    out = execSync(`git diff --name-only --diff-filter=ACM ${base}...HEAD`, { cwd: ROOT }).toString();
  } catch (e) {
    // sin historial suficiente (ej. primer commit) -> no hay nada que comparar
    return [];
  }
  return out.split('\n').filter((f) => f.endsWith('.html') && fs.existsSync(path.join(ROOT, f)))
    .filter((f) => !f.includes('template-servicio.html') && !f.includes('template-articulo.html')) // templates llevan PLACEHOLDER a propósito
    .filter((f) => !f.startsWith('partials/')); // fragmentos HTML (nav/footer), no páginas completas — sin title/meta/canonical por diseño
}

const files = changedHtmlFiles();
let fails = 0;

for (const f of files) {
  const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
  const title = /<title>([^<]*)<\/title>/.exec(html);
  const desc = /<meta\s+name="description"\s+content="([^"]*)"/.exec(html);
  const canonical = /<link\s+rel="canonical"\s+href="([^"]*)"/.exec(html);

  if (!title || !title[1].trim() || title[1].includes('PLACEHOLDER')) {
    fails++; console.error(`FAIL ${f}: <title> faltante o vacío`);
  }
  if (!desc || !desc[1].trim() || desc[1].includes('PLACEHOLDER')) {
    fails++; console.error(`FAIL ${f}: meta description faltante o vacía`);
  }
  if (!canonical || !canonical[1].trim() || canonical[1].includes('PLACEHOLDER')) {
    fails++; console.error(`FAIL ${f}: rel="canonical" faltante o vacío`);
  }
}

console.log(`check-meta: ${files.length} páginas modificadas en el diff, ${fails} problemas de meta.`);
process.exit(fails > 0 ? 1 : 0);
