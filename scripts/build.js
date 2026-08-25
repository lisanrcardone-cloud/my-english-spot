#!/usr/bin/env node
/**
 * scripts/build.js
 *
 * Regenera el contenido entre los marcadores BUILD:NAV y BUILD:FOOTER en las
 * páginas listadas en config/pages.json, usando los partials en partials/.
 * (pages.json vive en config/, no en data/, porque data/ está en .gitignore
 * para los datos internos de agencia — ver witty-herding-sphinx-STATUS.md)
 *
 * Node puro, sin dependencias nuevas. Idempotente: correrlo dos veces
 * seguidas debe producir el mismo resultado (git diff vacío en la segunda
 * corrida).
 *
 * Alcance de esta pasada (ver plan witty-herding-sphinx.md, punto 1):
 * - BUILD:NAV: solo el dropdown "Preparación de exámenes" (el único bloque
 *   del nav que es realmente invariante entre páginas y el que causó el bug
 *   real de nav desincronizado). Va en las 23 páginas no-home.
 * - BUILD:FOOTER: footer completo, en las 23 páginas no-home (20 usan
 *   footer-common.html, 3 legales usan footer-legal.html).
 * - index.html (home) queda fuera de ambos sistemas en esta pasada: su nav
 *   es bilingüe con toggle de idioma y estructura de menú propia, y su
 *   footer tiene atributos data-es/data-en que ninguna otra página tiene.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const NAV_START = '<!-- BUILD:NAV:START -->';
const NAV_END = '<!-- BUILD:NAV:END -->';
const FOOTER_START = '<!-- BUILD:FOOTER:START -->';
const FOOTER_END = '<!-- BUILD:FOOTER:END -->';

function readPartial(name) {
  return fs.readFileSync(path.join(ROOT, 'partials', name), 'utf8').replace(/\n$/, '');
}

const navPartialTemplate = readPartial('nav-common.html');
const footerCommonTemplate = readPartial('footer-common.html');
const footerLegalTemplate = readPartial('footer-legal.html');

function loadPagesConfig() {
  const raw = fs.readFileSync(path.join(ROOT, 'config', 'pages.json'), 'utf8');
  return JSON.parse(raw);
}

function buildNavContent(pageConfig, examItems) {
  if (!pageConfig.has_dropdown) {
    return ''; // sin dropdown en esta página (gracias.html, niveles-ingles-examenes.html)
  }

  const excludeExam = pageConfig.exclude_exam || 'none';
  const order = ['fce', 'ielts', 'cae', 'aptis'];
  const items = order
    .filter((key) => key !== excludeExam)
    .map((key) => {
      const item = examItems[key];
      return `          <a href="${item.href}">${item.label}</a>`;
    })
    .join('\n');

  return navPartialTemplate.replace('{{DROPDOWN_ITEMS}}', items);
}

function buildFooterContent(pageConfig) {
  if (pageConfig.footer_type === 'legal') {
    return footerLegalTemplate;
  }

  return footerCommonTemplate
    .replace(/\{\{CTA_TEXT\}\}/g, pageConfig.cta_text)
    .replace(/\{\{CTA_HREF\}\}/g, pageConfig.cta_href)
    .replace(/\{\{CTA_EVENT\}\}/g, pageConfig.cta_event);
}

function replaceBetweenMarkers(content, startMarker, endMarker, replacement, filePath) {
  const startIdx = content.indexOf(startMarker);
  const endIdx = content.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1) {
    throw new Error(`Marcadores ${startMarker}/${endMarker} no encontrados en ${filePath}`);
  }
  if (endIdx < startIdx) {
    throw new Error(`Marcador END antes que START para ${startMarker} en ${filePath}`);
  }

  const before = content.slice(0, startIdx + startMarker.length);
  const after = content.slice(endIdx);

  const middle = replacement ? `\n${replacement}\n` : '\n';

  return `${before}${middle}${after}`;
}

function buildPage(pageConfig, examItems) {
  const filePath = path.join(ROOT, pageConfig.file);
  const original = fs.readFileSync(filePath, 'utf8');

  let updated = original;

  updated = replaceBetweenMarkers(
    updated,
    NAV_START,
    NAV_END,
    buildNavContent(pageConfig, examItems),
    pageConfig.file
  );

  updated = replaceBetweenMarkers(
    updated,
    FOOTER_START,
    FOOTER_END,
    buildFooterContent(pageConfig),
    pageConfig.file
  );

  if (updated !== original) {
    fs.writeFileSync(filePath, updated, 'utf8');
    return true;
  }
  return false;
}

function main() {
  const config = loadPagesConfig();
  const examItems = config.exam_dropdown_items;
  const managedPages = config.pages.filter((p) => p.build_managed !== false);

  let changed = 0;
  for (const pageConfig of managedPages) {
    const didChange = buildPage(pageConfig, examItems);
    if (didChange) {
      changed += 1;
      console.log(`updated: ${pageConfig.file}`);
    }
  }

  console.log(`\nbuild.js: ${managedPages.length} páginas procesadas, ${changed} modificadas.`);
}

main();
