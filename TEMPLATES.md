# Templates de My English Spot

Arquitectura de templates consolidada en **2**, más la home (que no es un template):

| Template | Para qué | Páginas reales que lo usan hoy |
|---|---|---|
| `template-servicio.html` | Cualquier página de servicio: clases, preparación de exámenes, futuras ofertas | `clases-ingles-grupales-online.html`, `preparacion-first-cambridge.html`, `preparacion-ielts-online.html`, `preparacion-cae-online.html`, `preparacion-aptis-online.html`, `clases-particulares-ingles-online.html`, `clases-ingles-verano.html`, `clases-ingles-vigo.html`, `niveles-ingles-examenes.html` |
| `blog/template-articulo.html` | Cualquier post nuevo del blog | Los 8 artículos existentes en `blog/` |
| `index.html` | — no es un template — | Solo la home. Es única (nav con dropdown de exámenes + selector ES/EN + sistema de corte dinámico); no dupliques su estructura para páginas nuevas. |

Auditado el 24-ago-2026: las 9 páginas de servicio existentes están bien alineadas estructuralmente con `template-servicio.html` (mismo nav, mismo footer, mismo orden de secciones `que-es → para-quien → incluye → método → opiniones → como-funciona → faq[→ newsletter]`). Las únicas diferencias encontradas son intencionales: nombres de sección adaptados al copy (`que-son` en particulares, `niveles`/`servicios` en el hub de niveles), una sección extra `#partes` en FCE, y textos/eventos de CTA distintos por página — no hace falta reconciliar nada de eso.

---

## Cómo crear una página de servicio nueva

1. Duplicá `template-servicio.html` y renombralo al slug definitivo (ej: `ingles-empresas-online.html`).
2. Buscá la cadena `PLACEHOLDER` (todos los placeholders la incluyen) y completá:
   - `<head>`: title, meta description, canonical, Open Graph, Twitter Card, los 4 schemas (`Course`, `FAQPage`, `BreadcrumbList`, `Person`/instructor).
   - `<body>`: hero (breadcrumb, eyebrow, H1 de 2 líneas, subtítulo, chips), y cada sección (`que-es`, `para-quien`, `incluye`, `método`, `opiniones`, `como-funciona`, `faq` con mínimo 6 preguntas).
3. Ajustá los `href="#ancla"` del nav (`.nav__menu`) para que apunten a las secciones reales de la página nueva, y el link cruzado a otra página de servicio si corresponde.
4. Decidí si la página lleva la sección `#newsletter` (formulario Brevo, patrón `g-form`/`g-field` — ya no `subscribe-form__*`, ver nota de bug abajo). Si no aplica, eliminá la sección completa.
5. Agregá el rewrite en `vercel.json`:
   ```json
   { "source": "/slug-nuevo", "destination": "/slug-nuevo.html" }
   ```
6. Actualizá `sitemap.xml` con la URL nueva y `<lastmod>`.
7. Actualizá `llms.txt` si aplica.
8. Enlazá la página desde el nav de las páginas de servicio relacionadas (y desde `index.html` si corresponde) — nunca dejar una página nueva sin enlaces entrantes.
9. Verificá con Playwright en mobile (375px) y desktop (1280/1440px) antes de publicar: sin overflow horizontal, FAQ con `<details>`/`</details>` bien cerrados (no `</div>`), nav sin overlap.

**El footer no se toca.** Es idéntico en las 9 páginas y en el template — "No modificar" está indicado en el propio archivo.

---

## Cómo crear un post de blog nuevo

1. Duplicá `blog/template-articulo.html` y renombralo al slug definitivo dentro de `blog/`.
2. Buscá `PLACEHOLDER` y completá `<head>` (title, meta description, canonical, Open Graph tipo `article`, `article:published_time`) y `<body>` (breadcrumb, eyebrow/categoría, H1, meta de autor/fecha/tiempo de lectura, intro, secciones H2 con su CTA inline a mitad de artículo).
3. Seguí el **checklist de publicación** (evita desincronizar hub/schema/sitemap — regla ya establecida en este proyecto):
   1. Archivo del artículo (`blog/nombre-del-articulo.html`)
   2. Tarjeta en `blog/index.html` (grid) **y** entrada nueva en el array `blogPost` del schema `Blog`/`ItemList` del mismo archivo
   3. `sitemap.xml`
   4. Enlace interno desde la página de servicio relacionada
4. Agregá el rewrite en `vercel.json`: `{ "source": "/blog/slug-nuevo", "destination": "/blog/slug-nuevo.html" }`
5. Actualizá `llms.txt` si aplica.
6. Si el artículo usa algún script inline nuevo (no heredado del template), calculá su hash SHA256 y agregalo a `script-src` en `vercel.json` — la CSP del sitio es whitelist cerrada, sin `unsafe-inline`.
7. Verificá con Playwright en mobile y desktop antes de publicar.

---

## Bugs corregidos en los templates (24-ago-2026)

Ambos bugs vivían **solo en los templates**, nunca se propagaron a las 9 páginas de servicio ni a los 8 artículos de blog reales (verificado con un parser que sigue el anidamiento de comentarios/tags, no solo grep).

1. **`template-servicio.html` — comentario HTML anidado, causaba overflow horizontal en mobile.** El bloque de instrucciones del `<head>` (líneas 4-23) usaba, como ejemplo dentro de su propio texto, la sintaxis literal `<!-- PLACEHOLDER: ... -->`. Los comentarios HTML no anidan: ese `-->` de ejemplo cerraba el comentario exterior antes de tiempo, y el resto del checklist (incluyendo un `<lastmod>` literal de la línea 20) quedaba fuera del comentario — se parseaba como HTML real y se renderizaba como texto visible, un elemento `<lastmod>` desconocido que inflaba el ancho del documento en mobile (375 → 672px de `scrollWidth`). Corregido reformulando el texto sin usar la sintaxis de comentario dentro del ejemplo. Verificado con Playwright: `scrollWidth === innerWidth` en 375px tras el fix.
2. **`template-servicio.html` — formulario `#newsletter` con clases CSS sin estilos (`subscribe-form__*`).** Ese patrón nunca tuvo CSS en `styles.css` — quedó huérfano de una versión anterior. Las páginas reales que sí usan la sección (`clases-ingles-grupales-online.html`, `clases-ingles-verano.html`) ya usan el patrón correcto `g-form`/`g-field`. Se actualizó el template para que coincida exactamente con el patrón real en uso.

`blog/template-articulo.html` no tenía ninguno de los dos bugs — se auditó con el mismo parser y salió limpio.

---

## Nav: qué es específico de la home y qué no

El nav de `template-servicio.html` y `blog/template-articulo.html` es intencionalmente más simple que el de `index.html`: sin selector ES/EN, sin dropdown de "Preparación de exámenes", sin sistema de corte dinámico por ancho. Esa complejidad (y los 3 fixes de nav del 24-ago: "Clases" al hamburger, corte de "Cómo funciona" en <1409px, gap de 20px) es **exclusiva de la home** — el nav de servicio/blog nunca la tuvo y no la necesita, porque tiene muchos menos ítems y nunca se acerca al límite de ancho. No repliques ese sistema en páginas de servicio salvo que el nav de una página nueva crezca lo suficiente como para necesitarlo (poco probable dado el patrón actual de 5-9 links cortos).
