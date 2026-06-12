# Informe Lighthouse — My English Spot

> **Fecha:** 2026-06-12  |  **Herramienta:** Lighthouse 12.8.2  |  **Audits:** 6 (3 páginas × mobile + desktop)

---

## 1. Scores por categoría

| Categoría              |        index-mob |       index-desk |       clases-mob |      clases-desk |          fce-mob |         fce-desk |
| ---------------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| performance            |             🟡 79 |             🟢 98 |             🟢 96 |             🟢 99 |             🟢 92 |             🟢 99 |
| accessibility          |             🟢 93 |             🟢 95 |             🟢 95 |             🟢 94 |             🟢 95 |             🟢 95 |
| best-practices         |             🟡 89 |             🟡 89 |             🟡 89 |             🟡 89 |             🟡 89 |             🟡 89 |
| seo                    |            🟢 100 |            🟢 100 |            🟢 100 |            🟢 100 |            🟢 100 |            🟢 100 |
| pwa                    |                — |                — |                — |                — |                — |                — |

> 🟢 ≥90 · 🟡 50–89 · 🔴 <50  — `pwa` no aplica en esta configuración

## 2. Core Web Vitals

| Métrica  |          index-mob |         index-desk |         clases-mob |        clases-desk |            fce-mob |           fce-desk |
| -------- | ------------------ | ------------------ | ------------------ | ------------------ | ------------------ | ------------------ |
| FCP      |              1.9 s |              0.7 s |              1.5 s |              0.8 s |              2.4 s |              0.4 s |
| LCP      |              3.1 s |              0.8 s |              2.7 s |              0.8 s |              2.4 s |              0.7 s |
| TBT      |             100 ms |               0 ms |              80 ms |               0 ms |              70 ms |               0 ms |
| CLS      |              0.248 |              0.071 |              0.033 |              0.054 |              0.091 |              0.067 |
| SI       |              2.5 s |              0.7 s |              1.7 s |              0.8 s |              2.4 s |              0.4 s |
| TTI      |              3.6 s |              0.8 s |              3.2 s |              0.8 s |              3.1 s |              0.7 s |
| TTFB     | Root document took 10 ms | Root document took 10 ms | Root document took 10 ms | Root document took 10 ms | Root document took 10 ms | Root document took 10 ms |

**Umbrales Google (mobile):**
- LCP: ✅ ≤2.5 s | ⚠️ ≤4.0 s | ❌ >4.0 s
- TBT: ✅ ≤200 ms | ⚠️ ≤600 ms | ❌ >600 ms
- CLS: ✅ ≤0.1 | ⚠️ ≤0.25 | ❌ >0.25

**Hallazgos clave:**
- `index-mobile` CLS = **0.248** → en el límite ❌ (necesita fix urgente)
- `fce-mobile` FCP = 2.4 s y LCP = 2.4 s → ⚠️ Google borderline
- Desktop excelente en todas las páginas (LCP <1 s, CLS <0.1)

## 3. Oportunidades de mejora (por ahorro estimado)

| Página | Audit ID | Ahorro (ms) | Título |
| --- | --- | --- | --- |
| clases-mobile | `unused-javascript` | 460 ms | Reduce unused JavaScript |
| index-mobile | `unused-javascript` | 450 ms | Reduce unused JavaScript |
| fce-desktop | `unused-javascript` | 80 ms | Reduce unused JavaScript |
| index-desktop | `unused-javascript` | 70 ms | Reduce unused JavaScript |
| clases-desktop | `unused-javascript` | 50 ms | Reduce unused JavaScript |

**Descripción de oportunidades:**

- **`unused-javascript`** — Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity. [Learn how to reduce unused JavaScript](https://developer.chrome.com/docs/lig

## 4. Recursos render-blocking

- `https://www.myenglishspotclasses.com/styles.css` — 303 ms (detectado en clases-mobile)

## 5. CLS — Layout shifts

**index-mobile:**
  - Score: `0.2475023964240062` — 
  - Score: `2.544259836613796e-05` — 
**index-desktop:**
  - Score: `0.07051622396759012` — 
**clases-mobile:**
  - Score: `0.03335036342762943` — 
**clases-desktop:**
  - Score: `0.05411866863915921` — 
**fce-mobile:**
  - Score: `0.09129192427775308` — 
**fce-desktop:**
  - Score: `0.06683277563188257` — 
  - Score: `4.306793853568251e-06` — 

## 6. Diagnósticos fallidos (score < 1)

### 6.1 Performance

- **`largest-contentful-paint-element`** (score: 0.00) — Largest Contentful Paint element
  - Valor: `3,130 ms`
  - This is the largest contentful element painted within the viewport. [Learn more about the Largest Contentful Paint element](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint/)
  - Afecta: _clases-mobile, index-mobile_
- **`layout-shifts`** (score: 0.00) — Avoid large layout shifts
  - Valor: `2 layout shifts found`
  - These are the largest layout shifts observed on the page. Each table item represents a single layout shift, and shows the element that shifted the most. Below each item are possible root causes that led to the layout shi
  - Afecta: _index-mobile_
- **`unused-javascript`** (score: 0.00) — Reduce unused JavaScript
  - Valor: `Est savings of 88 KiB`
  - Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity. [Learn how to reduce unused JavaScript](https://developer.chrome.com/docs/lighthouse/performance/
  - Afecta: _fce-desktop, index-desktop, clases-mobile, index-mobile, clases-desktop, fce-mobile_
- **`cls-culprits-insight`** (score: 0.00) — Layout shift culprits
  - Layout shifts occur when elements move absent any user interaction. [Investigate the causes of layout shifts](https://web.dev/articles/optimize-cls), such as elements being added, removed, or their fonts changing as the 
  - Afecta: _index-mobile_
- **`network-dependency-tree-insight`** (score: 0.00) — Network dependency tree
  - [Avoid chaining critical requests](https://developer.chrome.com/docs/lighthouse/performance/critical-request-chains) by reducing the length of chains, reducing the download size of resources, or deferring the download of
  - Afecta: _fce-desktop, index-desktop, clases-mobile, index-mobile, clases-desktop, fce-mobile_
- **`forced-reflow-insight`** (score: 0.00) — Forced reflow
  - A forced reflow occurs when JavaScript queries geometric properties (such as offsetWidth) after styles have been invalidated by a change to the DOM state. This can result in poor performance. Learn more about [forced ref
  - Afecta: _fce-mobile, clases-mobile, index-desktop_
- **`cumulative-layout-shift`** (score: 0.50) — Cumulative Layout Shift
  - Valor: `0.248`
  - Cumulative Layout Shift measures the movement of visible elements within the viewport. [Learn more about the Cumulative Layout Shift metric](https://web.dev/articles/cls).
  - Afecta: _fce-desktop, index-desktop, index-mobile, clases-desktop, fce-mobile_
- **`unminified-css`** (score: 0.50) — Minify CSS
  - Valor: `Est savings of 3 KiB`
  - Minifying CSS files can reduce network payload sizes. [Learn how to minify CSS](https://developer.chrome.com/docs/lighthouse/performance/unminified-css/).
  - Afecta: _fce-desktop, index-desktop, clases-mobile, index-mobile, clases-desktop, fce-mobile_
- **`uses-responsive-images`** (score: 0.50) — Properly size images
  - Valor: `Est savings of 11 KiB`
  - Serve images that are appropriately-sized to save cellular data and improve load time. [Learn how to size images](https://developer.chrome.com/docs/lighthouse/performance/uses-responsive-images/).
  - Afecta: _fce-desktop, index-desktop, clases-mobile, index-mobile, clases-desktop, fce-mobile_
- **`legacy-javascript`** (score: 0.50) — Avoid serving legacy JavaScript to modern browsers
  - Polyfills and transforms enable legacy browsers to use new JavaScript features. However, many aren't necessary for modern browsers. Consider modifying your JavaScript build process to not transpile [Baseline](https://web
  - Afecta: _fce-desktop, index-desktop, clases-mobile, index-mobile, clases-desktop, fce-mobile_
- **`image-delivery-insight`** (score: 0.50) — Improve image delivery
  - Valor: `Est savings of 12 KiB`
  - Reducing the download time of images can improve the perceived load time of the page and LCP. [Learn more about optimizing image size](https://developer.chrome.com/docs/lighthouse/performance/uses-optimized-images/)
  - Afecta: _fce-desktop, index-desktop, clases-mobile, index-mobile, clases-desktop, fce-mobile_
- **`render-blocking-insight`** (score: 0.50) — Render blocking requests
  - Requests are blocking the page's initial render, which may delay LCP. [Deferring or inlining](https://web.dev/learn/performance/understanding-the-critical-path#render-blocking_resources) can move these network requests o
  - Afecta: _fce-desktop, index-desktop, clases-mobile, index-mobile, clases-desktop, fce-mobile_
- **`render-blocking-resources`** (score: 0.50) — Eliminate render-blocking resources
  - Valor: `Est savings of 0 ms`
  - Resources are blocking the first paint of your page. Consider delivering critical JS/CSS inline and deferring all non-critical JS/styles. [Learn how to eliminate render-blocking resources](https://developer.chrome.com/do
  - Afecta: _fce-mobile, clases-mobile, clases-desktop_
- **`first-contentful-paint`** (score: 0.69) — First Contentful Paint
  - Valor: `2.4 s`
  - First Contentful Paint marks the time at which the first text or image is painted. [Learn more about the First Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/first-contentful-paint/).
  - Afecta: _fce-mobile_
- **`largest-contentful-paint`** (score: 0.74) — Largest Contentful Paint
  - Valor: `3.1 s`
  - Largest Contentful Paint marks the time at which the largest text or image is painted. [Learn more about the Largest Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-co
  - Afecta: _fce-desktop, index-desktop, clases-mobile, index-mobile, clases-desktop, fce-mobile_
- **`max-potential-fid`** (score: 0.91) — Max Potential First Input Delay
  - Valor: `120 ms`
  - The maximum potential First Input Delay that your users could experience is the duration of the longest task. [Learn more about the Maximum Potential First Input Delay metric](https://developer.chrome.com/docs/lighthouse
  - Afecta: _fce-mobile_
- **`interactive`** (score: 0.91) — Time to Interactive
  - Valor: `3.6 s`
  - Time to Interactive is the amount of time it takes for the page to become fully interactive. [Learn more about the Time to Interactive metric](https://developer.chrome.com/docs/lighthouse/performance/interactive/).
  - Afecta: _fce-mobile, clases-mobile, index-mobile_
- **`speed-index`** (score: 0.98) — Speed Index
  - Valor: `2.5 s`
  - Speed Index shows how quickly the contents of a page are visibly populated. [Learn more about the Speed Index metric](https://developer.chrome.com/docs/lighthouse/performance/speed-index/).
  - Afecta: _fce-mobile, clases-desktop, index-mobile_
- **`total-blocking-time`** (score: 0.98) — Total Blocking Time
  - Valor: `100 ms`
  - Sum of all time periods between FCP and Time to Interactive, when task length exceeded 50ms, expressed in milliseconds. [Learn more about the Total Blocking Time metric](https://developer.chrome.com/docs/lighthouse/perfo
  - Afecta: _fce-mobile, clases-mobile, index-mobile_

### 6.3 Accessibility

- **`color-contrast`** (score: 0.00) — Background and foreground colors do not have a sufficient contrast ratio.
  - Low-contrast text is difficult or impossible for many users to read. [Learn how to provide sufficient color contrast](https://dequeuniversity.com/rules/axe/4.10/color-contrast).
  - Afecta: _fce-desktop, index-desktop, clases-mobile, index-mobile, clases-desktop, fce-mobile_
- **`heading-order`** (score: 0.00) — Heading elements are not in a sequentially-descending order
  - Properly ordered headings that do not skip levels convey the semantic structure of the page, making it easier to navigate and understand when using assistive technologies. [Learn more about heading order](https://dequeun
  - Afecta: _fce-desktop, index-desktop, clases-mobile, index-mobile, clases-desktop, fce-mobile_
- **`label-content-name-mismatch`** (score: 0.00) — Elements with visible text labels do not have matching accessible names.
  - Visible text labels that do not match the accessible name can result in a confusing experience for screen reader users. [Learn more about accessible names](https://dequeuniversity.com/rules/axe/4.10/label-content-name-mi
  - Afecta: _fce-mobile, clases-mobile, index-mobile_

### 6.2 Best-practices

- **`errors-in-console`** (score: 0.00) — Browser errors were logged to the console
  - Errors logged to the console indicate unresolved problems. They can come from network request failures and other browser concerns. [Learn more about this errors in console diagnostic audit](https://developer.chrome.com/d
  - Afecta: _fce-desktop, index-desktop, clases-mobile, index-mobile, clases-desktop, fce-mobile_
- **`image-aspect-ratio`** (score: 0.00) — Displays images with incorrect aspect ratio
  - Image display dimensions should match natural aspect ratio. [Learn more about image aspect ratio](https://developer.chrome.com/docs/lighthouse/best-practices/image-aspect-ratio/).
  - Afecta: _fce-desktop, index-desktop, clases-mobile, index-mobile, clases-desktop, fce-mobile_
- **`inspector-issues`** (score: 0.00) — Issues were logged in the `Issues` panel in Chrome Devtools
  - Issues logged to the `Issues` panel in Chrome Devtools indicate unresolved problems. They can come from network request failures, insufficient security controls, and other browser concerns. Open up the Issues panel in Ch
  - Afecta: _fce-desktop, index-desktop, clases-mobile, index-mobile, clases-desktop, fce-mobile_

## 7. Accesibilidad — fallos

### `color-contrast` — Background and foreground colors do not have a sufficient contrast ratio.
- **Score:** 0.00
- **Páginas:** _fce-desktop, index-desktop, clases-mobile, index-mobile, clases-desktop, fce-mobile_
- Low-contrast text is difficult or impossible for many users to read. [Learn how to provide sufficient color contrast](https://dequeuniversity.com/rules/axe/4.10/color-contrast).

### `heading-order` — Heading elements are not in a sequentially-descending order
- **Score:** 0.00
- **Páginas:** _fce-desktop, index-desktop, clases-mobile, index-mobile, clases-desktop, fce-mobile_
- Properly ordered headings that do not skip levels convey the semantic structure of the page, making it easier to navigate and understand when using assistive technologies. [Learn more about heading order](https://dequeuniversity.com/rules/axe/4.10/heading-order).

### `label-content-name-mismatch` — Elements with visible text labels do not have matching accessible names.
- **Score:** 0.00
- **Páginas:** _fce-mobile, clases-mobile, index-mobile_
- Visible text labels that do not match the accessible name can result in a confusing experience for screen reader users. [Learn more about accessible names](https://dequeuniversity.com/rules/axe/4.10/label-content-name-mismatch).

## 8. Best Practices — fallos

### `errors-in-console` — Browser errors were logged to the console
- **Score:** 0.00  |  **Páginas:** _fce-desktop, index-desktop, clases-mobile, index-mobile, clases-desktop, fce-mobile_
- Errors logged to the console indicate unresolved problems. They can come from network request failures and other browser concerns. [Learn more about this errors in console diagnostic audit](https://developer.chrome.com/docs/lighthouse/best-practices/errors-in-console/)

### `image-aspect-ratio` — Displays images with incorrect aspect ratio
- **Score:** 0.00  |  **Páginas:** _fce-desktop, index-desktop, clases-mobile, index-mobile, clases-desktop, fce-mobile_
- Image display dimensions should match natural aspect ratio. [Learn more about image aspect ratio](https://developer.chrome.com/docs/lighthouse/best-practices/image-aspect-ratio/).

### `inspector-issues` — Issues were logged in the `Issues` panel in Chrome Devtools
- **Score:** 0.00  |  **Páginas:** _fce-desktop, index-desktop, clases-mobile, index-mobile, clases-desktop, fce-mobile_
- Issues logged to the `Issues` panel in Chrome Devtools indicate unresolved problems. They can come from network request failures, insufficient security controls, and other browser concerns. Open up the Issues panel in Chrome DevTools for more details on each issue.

## 9. Errores de consola

**index-mobile:**
  - `Executing inline event handler violates the following Content Security Policy directive 'script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms 'sha`
  - `Executing inline script violates the following Content Security Policy directive 'script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms 'sha256-tmY`
**index-desktop:**
  - `Executing inline event handler violates the following Content Security Policy directive 'script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms 'sha`
  - `Executing inline script violates the following Content Security Policy directive 'script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms 'sha256-tmY`
**clases-mobile:**
  - `Executing inline event handler violates the following Content Security Policy directive 'script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms 'sha`
  - `Executing inline script violates the following Content Security Policy directive 'script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms 'sha256-tmY`
**clases-desktop:**
  - `Executing inline event handler violates the following Content Security Policy directive 'script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms 'sha`
  - `Executing inline script violates the following Content Security Policy directive 'script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms 'sha256-tmY`
**fce-mobile:**
  - `Executing inline event handler violates the following Content Security Policy directive 'script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms 'sha`
  - `Executing inline script violates the following Content Security Policy directive 'script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms 'sha256-tmY`
**fce-desktop:**
  - `Executing inline event handler violates the following Content Security Policy directive 'script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms 'sha`
  - `Executing inline script violates the following Content Security Policy directive 'script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms 'sha256-tmY`

## 10. Inspector Issues (Chrome DevTools)

**index-mobile:**
  - {'issueType': 'Content security policy', 'subItems': {'type': 'subitems', 'items': []}}
**index-desktop:**
  - {'issueType': 'Content security policy', 'subItems': {'type': 'subitems', 'items': []}}
**clases-mobile:**
  - {'issueType': 'Content security policy', 'subItems': {'type': 'subitems', 'items': []}}
**clases-desktop:**
  - {'issueType': 'Content security policy', 'subItems': {'type': 'subitems', 'items': []}}
**fce-mobile:**
  - {'issueType': 'Content security policy', 'subItems': {'type': 'subitems', 'items': []}}
**fce-desktop:**
  - {'issueType': 'Content security policy', 'subItems': {'type': 'subitems', 'items': []}}

## 11. Imágenes con aspect ratio incorrecto

- `https://www.myenglishspotclasses.com/assets/pin.png` — mostrada: ?×?, natural: ?×? (detectado en index-mobile)

## 12. SEO técnico

**index-mobile:**
  - ✅ `meta-description`: Document has a meta description
  - ✅ `document-title`: Document has a `<title>` element
  - ✅ `hreflang`: Document has a valid `hreflang`
  - ✅ `canonical`: Document has a valid `rel=canonical`
  - ✅ `robots-txt`: robots.txt is valid
  - — `structured-data`: Structured data is valid
  - ✅ `crawlable-anchors`: Links are crawlable
  - ✅ `font-size`: 99.34% legible text
  - — `tap-targets`: 
  - ✅ `link-text`: Links have descriptive text

**index-desktop:**
  - ✅ `meta-description`: Document has a meta description
  - ✅ `document-title`: Document has a `<title>` element
  - ✅ `hreflang`: Document has a valid `hreflang`
  - ✅ `canonical`: Document has a valid `rel=canonical`
  - ✅ `robots-txt`: robots.txt is valid
  - — `structured-data`: Structured data is valid
  - ✅ `crawlable-anchors`: Links are crawlable
  - — `font-size`: Document uses legible font sizes
  - — `tap-targets`: 
  - ✅ `link-text`: Links have descriptive text

**clases-mobile:**
  - ✅ `meta-description`: Document has a meta description
  - ✅ `document-title`: Document has a `<title>` element
  - ✅ `hreflang`: Document has a valid `hreflang`
  - ✅ `canonical`: Document has a valid `rel=canonical`
  - ✅ `robots-txt`: robots.txt is valid
  - — `structured-data`: Structured data is valid
  - ✅ `crawlable-anchors`: Links are crawlable
  - ✅ `font-size`: 99.78% legible text
  - — `tap-targets`: 
  - ✅ `link-text`: Links have descriptive text

**clases-desktop:**
  - ✅ `meta-description`: Document has a meta description
  - ✅ `document-title`: Document has a `<title>` element
  - ✅ `hreflang`: Document has a valid `hreflang`
  - ✅ `canonical`: Document has a valid `rel=canonical`
  - ✅ `robots-txt`: robots.txt is valid
  - — `structured-data`: Structured data is valid
  - ✅ `crawlable-anchors`: Links are crawlable
  - — `font-size`: Document uses legible font sizes
  - — `tap-targets`: 
  - ✅ `link-text`: Links have descriptive text

**fce-mobile:**
  - ✅ `meta-description`: Document has a meta description
  - ✅ `document-title`: Document has a `<title>` element
  - ✅ `hreflang`: Document has a valid `hreflang`
  - ✅ `canonical`: Document has a valid `rel=canonical`
  - ✅ `robots-txt`: robots.txt is valid
  - — `structured-data`: Structured data is valid
  - ✅ `crawlable-anchors`: Links are crawlable
  - ✅ `font-size`: 99.65% legible text
  - — `tap-targets`: 
  - ✅ `link-text`: Links have descriptive text

**fce-desktop:**
  - ✅ `meta-description`: Document has a meta description
  - ✅ `document-title`: Document has a `<title>` element
  - ✅ `hreflang`: Document has a valid `hreflang`
  - ✅ `canonical`: Document has a valid `rel=canonical`
  - ✅ `robots-txt`: robots.txt is valid
  - — `structured-data`: Structured data is valid
  - ✅ `crawlable-anchors`: Links are crawlable
  - — `font-size`: Document uses legible font sizes
  - — `tap-targets`: 
  - ✅ `link-text`: Links have descriptive text

## 13. Recursos más pesados (top 20, únicos, por transferSize)

| # | Tipo | URL | Transfer (KB) | Resource (KB) |
| --- | --- | --- | --- | --- |
| 1 | Script | `https://www.googletagmanager.com/gtag/js?id=G-Y1Y9YC09NL` | 162.9 | 484.1 |
| 2 | Font | `https://fonts.gstatic.com/s/nunito/v32/XRXV3I6Li01BKofINeaBTMnFcQ.woff2` | 38.3 | 38.2 |
| 3 | Document | `https://www.myenglishspotclasses.com/` | 15.1 | 64.9 |
| 4 | Image | `https://www.myenglishspotclasses.com/assets/pin.png` | 12.3 | 12.2 |
| 5 | Stylesheet | `https://www.myenglishspotclasses.com/styles.css` | 12.2 | 61.0 |
| 6 | Document | `https://www.myenglishspotclasses.com/preparacion-first-cambridge` | 11.2 | 45.1 |
| 7 | Document | `https://www.myenglishspotclasses.com/clases-particulares-ingles-online` | 10.1 | 39.8 |
| 8 | Script | `https://www.myenglishspotclasses.com/app.js` | 1.7 | 3.8 |
| 9 | Stylesheet | `https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap` | 1.1 | 9.0 |

## 14. Resumen ejecutivo y prioridades

### Problemas críticos
1. **CLS index-mobile = 0.248** → Falla el umbral de Google (>0.25 límite). Hay 2 layout shifts detectados. Prioridad máxima.
2. **Errores en consola** en las 6 combinaciones → afecta puntuación best-practices (score 89 en todos). Investigar qué scripts lanzan errores.
3. **Inspector issues** en las 6 combinaciones → probablemente cookies SameSite o CORS. Afecta best-practices.
4. **Imagen con aspect ratio incorrecto** (pin.png) → aparece en todas las páginas.

### Problemas importantes
5. **Unused JavaScript** → hasta 460 ms de ahorro en clases-mobile. Probablemente gtag/Clarity. Considerar lazy load.
6. **Render-blocking requests** → Google Fonts bloqueando render.
7. **Color contrast** → falla accesibilidad en las 6 combinaciones. Algún color de texto no tiene suficiente contraste.
8. **Heading order** → estructura H1→H2→H3 no secuencial en alguna sección.
9. **label-content-name-mismatch** → solo en mobile (3 páginas). Botones o links con aria-label que no coincide con texto visible.

### Oportunidades de mejora de performance
- **Image delivery** (12 KiB ahorro estimado) → convertir pin.png a WebP/AVIF
- LCP index-mobile = 3.1 s → dentro de 'Needs Improvement' (⚠️)
- fce-mobile FCP = 2.4 s → en el límite

### Puntos fuertes
- **SEO perfecto (100/100)** en las 6 combinaciones
- **Desktop excelente**: performance ≥98/100, métricas todas en verde
- **TTFB excelente**: 10 ms en todas las páginas → servidor muy rápido
- **TBT mobile bajo**: ≤100 ms en todas (límite Google = 200 ms)
