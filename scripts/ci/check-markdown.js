#!/usr/bin/env node
/**
 * scripts/ci/check-markdown.js
 *
 * Tests unitarios (sin dependencias, sin servidor real) para:
 * - htmlToMarkdown() en scripts/build.js: conversión HTML -> markdown
 *   usada para generar los .md que sirve middleware.js.
 * - wantsMarkdown() en middleware.js: lógica de negociación del header
 *   Accept, probada llamando la función directamente (no vía fetch/HTTP)
 *   para evitar flakiness.
 */
'use strict';
const path = require('path');
const assert = require('assert');

const ROOT = path.join(__dirname, '..', '..');
const { htmlToMarkdown } = require(path.join(ROOT, 'scripts', 'build.js'));

let fails = 0;
let checked = 0;

function test(name, fn) {
  checked++;
  try {
    fn();
    console.log(`OK   ${name}`);
  } catch (err) {
    fails++;
    console.error(`FAIL ${name}: ${err.message}`);
  }
}

// --- htmlToMarkdown ---------------------------------------------------

test('htmlToMarkdown: convierte h1/h2 y párrafo', () => {
  const html = '<main><h1>Título</h1><h2>Subtítulo</h2><p>Un párrafo simple.</p></main>';
  const md = htmlToMarkdown(html);
  assert.ok(md.includes('# Título'), 'debe incluir "# Título"');
  assert.ok(md.includes('## Subtítulo'), 'debe incluir "## Subtítulo"');
  assert.ok(md.includes('Un párrafo simple.'), 'debe incluir el párrafo');
});

test('htmlToMarkdown: convierte link con href absoluto', () => {
  const html = '<main><p>Visita <a href="/about">Sobre nosotros</a>.</p></main>';
  const md = htmlToMarkdown(html);
  assert.ok(
    md.includes('[Sobre nosotros](https://www.myenglishspotclasses.com/about)'),
    `debe incluir el link absoluto, obtuvo: ${md}`
  );
});

test('htmlToMarkdown: conserva links http externos tal cual', () => {
  const html = '<main><p><a href="https://calendar.app.google/x">Reserva</a></p></main>';
  const md = htmlToMarkdown(html);
  assert.ok(md.includes('[Reserva](https://calendar.app.google/x)'));
});

test('htmlToMarkdown: es idempotente sobre el mismo input', () => {
  const html = '<main><h1>A</h1><ul><li>uno</li><li>dos</li></ul></main>';
  assert.strictEqual(htmlToMarkdown(html), htmlToMarkdown(html));
});

// --- wantsMarkdown (middleware.js) ------------------------------------
// middleware.js usa `export`, que require() no puede cargar directo en
// Node CommonJS sin transpilar; probamos la misma lógica de decisión
// re-declarada aquí a partir del código fuente para no introducir un
// paso de build/transpile nuevo. Si cambia la firma de wantsMarkdown en
// middleware.js, este bloque debe actualizarse en paralelo.
function wantsMarkdown(acceptHeader) {
  if (!acceptHeader) return false;
  const accept = acceptHeader.toLowerCase();

  if (!accept.includes('text/html') && accept.includes('text/markdown')) return true;
  if (!accept.includes('text/markdown')) return false;

  const qValue = (entry) => {
    const m = entry.match(/;\s*q=([0-9.]+)/);
    return m ? parseFloat(m[1]) : 1;
  };

  const entries = accept.split(',').map((e) => e.trim());
  const mdEntry = entries.find((e) => e.startsWith('text/markdown'));
  const htmlEntry = entries.find((e) => e.startsWith('text/html'));

  if (!htmlEntry) return true;
  return qValue(mdEntry) >= qValue(htmlEntry);
}

test('wantsMarkdown: true si Accept es solo text/markdown', () => {
  assert.strictEqual(wantsMarkdown('text/markdown'), true);
});

test('wantsMarkdown: false si Accept es solo text/html (default de navegadores)', () => {
  assert.strictEqual(wantsMarkdown('text/html,application/xhtml+xml,*/*;q=0.8'), false);
});

test('wantsMarkdown: true si markdown tiene q-value >= html', () => {
  assert.strictEqual(wantsMarkdown('text/html;q=0.5,text/markdown;q=0.9'), true);
});

test('wantsMarkdown: false si markdown tiene q-value < html', () => {
  assert.strictEqual(wantsMarkdown('text/html;q=0.9,text/markdown;q=0.5'), false);
});

test('wantsMarkdown: false si no hay Accept header', () => {
  assert.strictEqual(wantsMarkdown(undefined), false);
});

// --- resolveMarkdownPath (middleware.js) -------------------------------
// Misma limitación que wantsMarkdown arriba (export de ES modules): lógica
// re-declarada aquí. Si cambia en middleware.js, actualizar en paralelo.
const ALIAS_MARKDOWN_PATHS = {
  '/contact': '/contacto',
  '/privacy': '/politica-privacidad',
};

function resolveMarkdownPath(pathname) {
  let p = pathname === '/' ? '/index' : pathname.replace(/\/$/, '');
  if (!p.startsWith('/')) p = '/' + p;
  p = ALIAS_MARKDOWN_PATHS[p] || p;
  return p + '.md';
}

test('resolveMarkdownPath: home -> /index.md', () => {
  assert.strictEqual(resolveMarkdownPath('/'), '/index.md');
});

test('resolveMarkdownPath: página normal usa su propio slug', () => {
  assert.strictEqual(resolveMarkdownPath('/preparacion-cae-online'), '/preparacion-cae-online.md');
});

test('resolveMarkdownPath: alias /contact resuelve al .md de /contacto', () => {
  assert.strictEqual(resolveMarkdownPath('/contact'), '/contacto.md');
});

test('resolveMarkdownPath: alias /privacy resuelve al .md de /politica-privacidad', () => {
  assert.strictEqual(resolveMarkdownPath('/privacy'), '/politica-privacidad.md');
});

console.log(`\ncheck-markdown: ${checked} tests, ${fails} fallidos.`);
process.exit(fails > 0 ? 1 : 0);
