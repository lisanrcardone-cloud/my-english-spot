/**
 * middleware.js — Vercel Edge Middleware
 *
 * Negociación de contenido: si un agente pide explícitamente
 * `Accept: text/markdown` (con prioridad igual o mayor que text/html, o sin
 * text/html en el header), servimos el `.md` generado por scripts/build.js
 * para esa misma ruta en vez del HTML normal.
 *
 * Sin ese header, el comportamiento es IDÉNTICO al actual: no se toca nada.
 * Solo intercepta GET a rutas de página (no assets, no /api/*).
 *
 * Node puro / Edge runtime nativo de Vercel, sin dependencias nuevas.
 */

export const config = {
  matcher: [
    '/((?!api/|_next/|assets/|_vercel/|favicon.ico|robots.txt|sitemap.xml|llms.txt|.*\\.[a-zA-Z0-9]+$).*)',
  ],
};

/**
 * Decide si la request pide markdown explícitamente por sobre HTML.
 * Exportada por separado para poder testearla de forma unitaria sin
 * levantar un servidor real (ver scripts/ci/check-markdown-negotiation.js).
 */
export function wantsMarkdown(acceptHeader) {
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

/**
 * Alias en inglés servidos solo como rewrite en vercel.json (ver
 * ALIAS_ONLY_REWRITES en scripts/ci/check-redirects.js) que no tienen su
 * propio .md — apuntan al mismo contenido que la página canónica en español.
 */
const ALIAS_MARKDOWN_PATHS = {
  '/contact': '/contacto',
  '/privacy': '/politica-privacidad',
};

/**
 * Resuelve el pathname de una request a la ruta del archivo .md
 * correspondiente (mismo layout que los .html generados por build.js).
 */
export function resolveMarkdownPath(pathname) {
  let p = pathname === '/' ? '/index' : pathname.replace(/\/$/, '');
  if (!p.startsWith('/')) p = '/' + p;
  p = ALIAS_MARKDOWN_PATHS[p] || p;
  return p + '.md';
}

export default function middleware(request) {
  if (request.method !== 'GET') return;

  const accept = request.headers.get('accept');
  if (!wantsMarkdown(accept)) return;

  const url = new URL(request.url);
  const mdPath = resolveMarkdownPath(url.pathname);
  const mdUrl = new URL(mdPath, url.origin);

  // Edge Middleware no tiene acceso a fs; usamos rewrite hacia el propio
  // archivo estático .md (servido por Vercel como asset) y ajustamos los
  // headers de la respuesta.
  return fetch(mdUrl).then((res) => {
    if (!res.ok) return; // no existe .md para esta ruta -> dejar pasar (HTML normal)
    const headers = new Headers(res.headers);
    headers.set('Content-Type', 'text/markdown; charset=utf-8');
    headers.set('Vary', 'Accept');
    return new Response(res.body, { status: res.status, headers });
  });
}
