#!/usr/bin/env node
/**
 * scripts/ci/check-links.js
 *
 * Falla si algún href interno (ruta relativa, absoluta del sitio, o
 * ancla #id) no resuelve a un archivo real, a una ruta declarada en
 * vercel.json (rewrites/redirects), o a un id existente en la página
 * destino. No valida links externos (http a otros dominios) ni
 * mailto:/tel: — eso queda fuera de "links internos rotos".
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const vercelConfig = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
const pages = JSON.parse(fs.readFileSync(path.join(ROOT, 'config', 'pages.json'), 'utf8')).pages;

// 1. Recolectar todos los archivos .html reales del repo (fuera de node_modules/.vercel/.claude)
function listHtmlFiles(dir, base = '') {
  let out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.vercel', '.claude', '.git'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out = out.concat(listHtmlFiles(full, rel));
    else if (entry.name.endsWith('.html')) out.push(rel);
  }
  return out;
}
const allHtmlFiles = listHtmlFiles(ROOT); // ej: "aviso-legal.html", "blog/index.html"

// 2. Tabla de rutas válidas: absoluta con "/" inicial -> archivo real en disco
const routeToFile = new Map();
for (const f of allHtmlFiles) {
  routeToFile.set('/' + f, f);
  if (f.endsWith('/index.html')) {
    routeToFile.set('/' + f.slice(0, -'/index.html'.length), f); // /blog -> blog/index.html
  } else if (f === 'index.html') {
    routeToFile.set('/', f);
  }
}
for (const rw of vercelConfig.rewrites || []) {
  if (rw.source.includes(':slug')) {
    // patrón "/blog/:slug" -> "/blog/:slug.html"
    const prefix = rw.source.split(':slug')[0];
    const destPrefix = rw.destination.split(':slug')[0];
    // no podemos enumerar slugs desde acá; se resuelven dinámicamente abajo
    routeToFile.set(`__pattern__${prefix}`, destPrefix);
  } else {
    const destFile = rw.destination.replace(/^\//, '');
    if (fs.existsSync(path.join(ROOT, destFile))) routeToFile.set(rw.source, destFile);
  }
}
// redirects con source literal (no el catch-all de host) también son rutas válidas
for (const rd of vercelConfig.redirects || []) {
  if (typeof rd.source === 'string' && !rd.source.includes('(.*)')) {
    routeToFile.set(rd.source, null); // válida, pero no mapea a archivo (redirige)
  }
}

function resolveRoute(route) {
  if (routeToFile.has(route)) return routeToFile.get(route);
  for (const [key, destPrefix] of routeToFile) {
    if (key.startsWith('__pattern__')) {
      const prefix = key.replace('__pattern__', '');
      if (route.startsWith(prefix) && !route.slice(prefix.length).includes('/')) {
        const slug = route.slice(prefix.length);
        const f = destPrefix.replace(/^\//, '') + slug + '.html';
        return fs.existsSync(path.join(ROOT, f)) ? f : undefined;
      }
    }
  }
  return undefined;
}

// 3. Extraer y validar hrefs de cada página real
let fails = 0;
let checked = 0;
const SITE = 'https://www.myenglishspotclasses.com';

for (const p of pages) {
  const filePath = path.join(ROOT, p.file);
  const html = fs.readFileSync(filePath, 'utf8');
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  const pageDir = path.dirname(p.file);

  for (const rawHref of hrefs) {
    if (/^(mailto:|tel:|javascript:|https?:\/\/(?!www\.myenglishspotclasses\.com))/.test(rawHref)) continue; // externo o no-http, fuera de alcance
    checked++;
    let href = rawHref.startsWith(SITE) ? rawHref.slice(SITE.length) || '/' : rawHref;

    let [routePart, hash] = href.split('#');
    if (routePart === '') {
      // solo ancla (#id) -> misma página
      if (hash && !new RegExp(`id="${hash}"`).test(html)) {
        fails++;
        console.error(`FAIL ${p.file}: ancla #${hash} no existe en la propia página`);
      }
      continue;
    }

    // resolver ruta relativa (sin "/" inicial) contra el directorio de la página
    let absRoute = routePart.startsWith('/') ? routePart : '/' + path.posix.normalize(path.posix.join(pageDir === '.' ? '' : pageDir, routePart));

    let targetFile = routeToFile.has(absRoute) ? routeToFile.get(absRoute) : undefined;
    if (targetFile === undefined) targetFile = resolveRoute(absRoute);

    const directFile = absRoute.replace(/^\//, '');
    const fileExists = fs.existsSync(path.join(ROOT, directFile));

    if (targetFile === undefined && !fileExists && !routeToFile.has(absRoute)) {
      fails++;
      console.error(`FAIL ${p.file}: href="${rawHref}" no resuelve a ninguna ruta/archivo conocido`);
      continue;
    }

    if (hash) {
      const resolvedPath = targetFile || (fileExists ? directFile : null);
      if (resolvedPath) {
        const targetHtml = fs.readFileSync(path.join(ROOT, resolvedPath), 'utf8');
        if (!new RegExp(`id="${hash}"`).test(targetHtml)) {
          fails++;
          console.error(`FAIL ${p.file}: href="${rawHref}" -> #${hash} no existe en ${resolvedPath}`);
        }
      }
    }
  }
}

console.log(`check-links: ${checked} hrefs internos revisados en ${pages.length} páginas, ${fails} rotos.`);
process.exit(fails > 0 ? 1 : 0);
