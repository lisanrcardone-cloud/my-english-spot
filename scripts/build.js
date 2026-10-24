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
const { execSync } = require('child_process');

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

// ---------------------------------------------------------------------------
// Markdown de páginas (negociación de contenido text/markdown, ver
// middleware.js). Conversión por regex, sin dependencias nuevas. Determinista
// e idempotente: mismo HTML de entrada -> mismo .md de salida siempre.
// ---------------------------------------------------------------------------

const SITE_ORIGIN = 'https://www.myenglishspotclasses.com';

const HTML_ENTITIES = {
  nbsp: ' ',
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  '#39': "'",
  apos: "'",
  middot: '·',
  mdash: '—',
  ndash: '–',
};

function decodeEntities(text) {
  return text.replace(/&(#39|nbsp|amp|lt|gt|quot|apos|middot|mdash|ndash);/g, (m, key) => HTML_ENTITIES[key]);
}

function resolveAbsoluteUrl(href) {
  if (/^(https?:|mailto:|tel:)/i.test(href)) return href;
  if (href.startsWith('/')) return SITE_ORIGIN + href;
  if (href.startsWith('#')) return SITE_ORIGIN + '/' + href; // ancla relativa a la propia página
  return SITE_ORIGIN + '/' + href.replace(/^\.\//, '');
}

function htmlToMarkdown(html) {
  let content = html;

  // 1. Quitar scripts/estilos completos.
  content = content.replace(/<script[\s\S]*?<\/script>/gi, '');
  content = content.replace(/<style[\s\S]*?<\/style>/gi, '');

  // 2. Quedarnos con el contenido de <main>...</main> si existe.
  const mainMatch = content.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) content = mainMatch[1];

  // 3. Enlaces -> markdown, con URL absoluta, antes de tocar el resto de tags.
  content = content.replace(/<a\s+[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (m, href, text) => {
    const plainText = text.replace(/<[^>]+>/g, '').trim();
    return `[${plainText}](${resolveAbsoluteUrl(href)})`;
  });

  // 4. Encabezados.
  content = content.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (m, t) => `\n# ${t.replace(/<[^>]+>/g, '').trim()}\n`);
  content = content.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (m, t) => `\n## ${t.replace(/<[^>]+>/g, '').trim()}\n`);
  content = content.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (m, t) => `\n### ${t.replace(/<[^>]+>/g, '').trim()}\n`);

  // 5. Items de lista.
  content = content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (m, t) => `- ${t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()}\n`);

  // 6. Párrafos.
  content = content.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (m, t) => `\n${t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()}\n`);

  // 7. Quitar cualquier tag restante (divs, spans, ul/ol, article, etc).
  content = content.replace(/<[^>]+>/g, ' ');

  // 8. Decodificar entidades HTML básicas.
  content = decodeEntities(content);

  // 9. Colapsar espacios/líneas en blanco excesivos.
  content = content
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return content + '\n';
}

function buildMarkdownForPage(relFile) {
  const filePath = path.join(ROOT, relFile);
  if (!fs.existsSync(filePath)) return false;
  const html = fs.readFileSync(filePath, 'utf8');
  const markdown = htmlToMarkdown(html);
  const mdPath = filePath.replace(/\.html$/, '.md');
  const original = fs.existsSync(mdPath) ? fs.readFileSync(mdPath, 'utf8') : null;
  if (original !== markdown) {
    fs.writeFileSync(mdPath, markdown, 'utf8');
    return true;
  }
  return false;
}

function buildAllMarkdown(config) {
  const extraPages = ['index.html', 'about.html', 'contacto.html', 'politica-privacidad.html'];
  const configPages = config.pages.map((p) => p.file);
  const allPages = [...new Set([...extraPages, ...configPages])];

  let changed = 0;
  for (const relFile of allPages) {
    const didChange = buildMarkdownForPage(relFile);
    if (didChange) {
      changed += 1;
      console.log(`updated (md): ${relFile.replace(/\.html$/, '.md')}`);
    }
  }
  return { total: allPages.length, changed };
}

// ---------------------------------------------------------------------------
// Sitemap: lastmod automático (fecha del último commit del archivo) y feed RSS.
// Las funciones de mapeo loc <-> archivo se exportan para scripts/indexnow.js.
// ---------------------------------------------------------------------------

// URL (loc del sitemap) -> archivo relativo. '/' -> index.html, '/blog' -> blog/index.html.
function locToFile(loc) {
  const pathname = loc.replace(SITE_ORIGIN, '').replace(/\/+$/, '');
  if (pathname === '') return 'index.html';
  if (pathname === '/blog') return 'blog/index.html';
  return pathname.replace(/^\//, '') + '.html';
}

// Archivo relativo -> URL (inverso de locToFile).
function fileToLoc(relFile) {
  if (relFile === 'index.html') return SITE_ORIGIN + '/';
  if (relFile === 'blog/index.html') return SITE_ORIGIN + '/blog';
  return SITE_ORIGIN + '/' + relFile.replace(/\.html$/, '');
}

function readSitemapLocs() {
  const xml = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

function gitOutput(cmd) {
  return execSync(cmd, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// Fecha para <lastmod>: la del último commit del archivo, o la de hoy si tiene
// cambios sin commitear (así, editar + build antes del commit deja la fecha buena).
function lastmodForFile(relFile) {
  if (gitOutput(`git status --porcelain -- "${relFile}"`) !== '') return todayISO();
  return gitOutput(`git log -1 --format=%cs -- "${relFile}"`) || todayISO();
}

function buildSitemapLastmod() {
  const sitemapPath = path.join(ROOT, 'sitemap.xml');
  const original = fs.readFileSync(sitemapPath, 'utf8');
  let changed = 0;

  const updated = original.replace(/<url>[\s\S]*?<\/url>/g, (block) => {
    const locMatch = block.match(/<loc>([^<]+)<\/loc>/);
    if (!locMatch) return block;
    const relFile = locToFile(locMatch[1]);
    if (!fs.existsSync(path.join(ROOT, relFile))) {
      console.warn(`aviso: sitemap.xml apunta a ${locMatch[1]} pero no existe ${relFile}; lastmod sin tocar.`);
      return block;
    }
    const date = lastmodForFile(relFile);
    const newBlock = block.replace(/(<lastmod>)[^<]*(<\/lastmod>)/, `$1${date}$2`);
    if (newBlock !== block) changed += 1;
    return newBlock;
  });

  if (updated !== original) fs.writeFileSync(sitemapPath, updated, 'utf8');
  return { total: readSitemapLocs().length, changed };
}

function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Lee el JSON-LD Article de un post (null si no tiene).
function readArticleSchema(html) {
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(m[1]);
      if (data && data['@type'] === 'Article') return data;
    } catch (e) {
      // JSON-LD inválido: lo detecta check-jsonld.js, aquí se ignora
    }
  }
  return null;
}

function buildFeed() {
  const sitemapLocs = new Set(readSitemapLocs());
  const posts = fs
    .readdirSync(path.join(ROOT, 'blog'))
    .filter((f) => f.endsWith('.html') && f !== 'index.html' && f !== 'template-articulo.html')
    .map((f) => readArticleSchema(fs.readFileSync(path.join(ROOT, 'blog', f), 'utf8')))
    .filter((a) => a && sitemapLocs.has(a.url))
    .sort((a, b) => b.datePublished.localeCompare(a.datePublished) || a.url.localeCompare(b.url));

  const blogHtml = fs.readFileSync(path.join(ROOT, 'blog', 'index.html'), 'utf8');
  const channelDesc = decodeEntities(blogHtml.match(/<meta name="description" content="([^"]*)"/)[1]);

  const items = posts
    .map((a) => {
      const pubDate = new Date(`${a.datePublished}T00:00:00Z`).toUTCString();
      return [
        '    <item>',
        `      <title>${escapeXml(decodeEntities(a.headline))}</title>`,
        `      <link>${escapeXml(a.url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(a.url)}</guid>`,
        `      <description>${escapeXml(decodeEntities(a.description))}</description>`,
        `      <pubDate>${pubDate}</pubDate>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    '    <title>My English Spot - Blog</title>',
    `    <link>${SITE_ORIGIN}/blog</link>`,
    `    <atom:link href="${SITE_ORIGIN}/feed.xml" rel="self" type="application/rss+xml" />`,
    `    <description>${escapeXml(channelDesc)}</description>`,
    '    <language>es-ES</language>',
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');

  const feedPath = path.join(ROOT, 'feed.xml');
  const original = fs.existsSync(feedPath) ? fs.readFileSync(feedPath, 'utf8') : null;
  if (original !== xml) {
    fs.writeFileSync(feedPath, xml, 'utf8');
    return { total: posts.length, changed: 1 };
  }
  return { total: posts.length, changed: 0 };
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

  const mdResult = buildAllMarkdown(config);
  console.log(`build.js: ${mdResult.total} páginas .md procesadas, ${mdResult.changed} modificadas.`);

  const sitemapResult = buildSitemapLastmod();
  console.log(`build.js: sitemap.xml ${sitemapResult.total} URLs, ${sitemapResult.changed} lastmod actualizados.`);

  const feedResult = buildFeed();
  console.log(`build.js: feed.xml ${feedResult.total} posts, ${feedResult.changed ? 'actualizado' : 'sin cambios'}.`);
}

if (require.main === module) {
  main();
}

module.exports = { htmlToMarkdown, resolveAbsoluteUrl, locToFile, fileToLoc, readSitemapLocs };
