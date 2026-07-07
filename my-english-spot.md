# My English Spot — Log de sesiones

## Sesión 7 julio 2026

### Auditoría técnica completa — GA4 muerto desde el 18-jun, formulario roto, CSP con múltiples bloqueos

Motivada por preocupación de Rocío: no llegan llamadas ni mensajes pese a impresiones/vistas en GSC y GBP. Diagnóstico completo con verificación real en navegador (Playwright), no solo lectura de código — se encontraron y corrigieron 3 bugs de producción que llevaban semanas activos sin detectar.

**Hallazgo raíz — GA4 sin recibir un solo hit desde el 18 de junio:**
El commit `f12580e` (banner de cookies, Consent Mode v2) reemplazó el snippet que inicializaba GA4 (`gtag('js', new Date()); gtag('config', 'G-Y1Y9YC09NL')`) por uno que solo carga la librería y define consentimiento, pero nunca vuelve a inicializar. No es un problema de contenedor GTM (no existe, es gtag.js directo) — el script cargaba pero nunca se ejecutaba. Confirmado con `browser_network_requests`: cero requests a `google-analytics.com` en 3 semanas de datos, pese a clics reales confirmados por GSC.

**Fixes aplicados y verificados en producción (commits `870bf97`, `ededfcf`, `b701ab3`):**
| Fix | Detalle |
|---|---|
| Inicialización GA4 restaurada | `gtag('js')`/`gtag('config')` agregado a las 12 páginas indexadas |
| CSP bloqueaba el propio fix | Hash SHA256 del script de init agregado a `script-src`; `i.clarity.ms` agregado a `connect-src` |
| GA4 usa endpoints regionales | `region1.google-analytics.com` no estaba permitido — agregado wildcard `https://*.google-analytics.com` |

Verificado con `page_view` y `click_reserva` llegando con `204` a `region1.google-analytics.com/g/collect` en navegador real.

**Barrido de CSP en las 14 páginas del sitio — 2 bugs más encontrados (commits `ef99ed8`, `1e41018`, `ce7d2bd`):**
| Bug | Página(s) | Impacto |
|---|---|---|
| Script del formulario de lista de espera bloqueado por CSP (sin hash) | `clases-ingles-verano.html` | 🔴 Alto — el form de "avísame cuando haya plaza" nunca llegaba a `/api/subscribe` desde su publicación |
| Botón sin clase `.subscribe-form__btn` que el script buscaba | `clases-ingles-verano.html` | 🔴 Alto — mismo form, `TypeError` cortaba el submit incluso con la CSP arreglada |
| 4 estilos inline bloqueados (cosmético) | `clases-ingles-verano.html` | 🟡 Bajo |
| `onload="this.rel=\'stylesheet\'"` con sintaxis JS inválida (barras invertidas, no solo bloqueo CSP) | `aviso-legal.html`, `politica-privacidad.html`, `politica-cookies.html` | 🟡 Bajo — fuente Nunito no cargaba, cae a fuente de sistema |
| `app.js` crasheaba (`navToggle`/`navMenu` null) cortando el resto del script | mismas 3 legales | 🟡 Bajo — no afecta `/gracias` (lógica en IIFE separado) |

Verificado end-to-end: envío real del formulario de lista de espera → `POST /api/subscribe → 200`, con GA4 registrando `form_start` y `subscribe_success` automáticamente.

**Clarity — investigado, confirmado funcionando:**
Rocío reportó el dashboard de Clarity en 0. Verificado con navegador real: `POST i.clarity.ms/collect → 204` en dos interacciones distintas (carga + scroll), `window.clarity` inicializado correctamente. El "0" es lag de procesamiento del dashboard (hasta 1-2h) y/o filtrado de tráfico de bot en las pruebas automatizadas — no es un bug. A revisar de nuevo en unas horas.

**Realidad del funnel de conversión (aportado por Rocío):** solo hubo **1 clase de prueba en todo el período medido, y esa persona ya es alumna** (100% de cierre, muestra de 1). Confirma que el problema no es de conversión post-clase ni de disponibilidad de agenda (se renueva semanalmente, está bien como está) — es de **volumen de entrada al funnel**, consistente con el bajo tráfico medido en GSC/GBP.

**Análisis de tamaño de mercado (con datos externos + GSC propio):**
- Vigo: ~294.224 habitantes, en declive poblacional (-0.09%/año)
- Al menos ~20 academias de inglés compitiendo en Vigo (no solo las 3 del análisis de cookies previo), 2 de ellas (English Solutions, Schoolhouse) corriendo Google Ads activamente
- Comparando impresiones propias: `clases-ingles-vigo` (pilar local) trae 4-7 impresiones/semana vs. `blog/como-preparar-el-first-certificate-fce` (pilar nacional, exámenes) con 41-50/semana — 6-10x más demanda ya demostrada en el propio sitio
- **Recomendación:** priorizar contenido de Pilar 1 (exámenes oficiales: FCE/CAE/IELTS) y Pilar 2 (clases online por objetivo, sin límite geográfico) sobre expandir contenido local de Vigo, que tiene techo bajo confirmado

**Skill nueva creada:** `/opt/agent/skills/user/auditoria-tecnica-cliente.md` — metodología reutilizable de esta auditoría (diagnóstico → verificación real en navegador → barrido de CSP → fix priorizado con deploy verificado uno por uno) para aplicar a otros clientes de la agencia. Registrada en `/root/.claude/CLAUDE.md`.

---

## Sesión 6 julio 2026

### Sesión SEO semanal — comparativa, meta tags, blog nuevo, GBP

Basada en el informe automático `seo_report.py` del 2026-07-05 (`/root/agencia/informes/2026-07-06/my-english-spot-2026-07-06.md`).

**Comparativa vs semana anterior (2026-06-28):** caída fuerte — clics 13→1, impresiones 390→136, CTR 3.33%→0.74%. No es problema de visibilidad, es de conversión impresión→clic y de posición media (21.5). El artículo de blog existente tiene 50 impresiones/semana pero 0 clics (posición 35.68).

**Cambios aplicados y publicados (push + deploy a Vercel confirmados, HTTP 200):**

| Archivo | Cambio |
|---|---|
| `clases-ingles-verano.html`, `clases-particulares-ingles-online.html`, `clases-ingles-vigo.html` | Meta descriptions recortadas a ≤160 caracteres (estaban entre 165 y 230) |
| `blog/como-preparar-el-first-certificate-fce.html` | Meta description reescrita (171c → 141c) para mejorar CTR |
| `blog/cuanto-se-tarda-en-preparar-first-certificate.html` | Artículo nuevo — responde a las 4 variantes de consulta "preparar first certificate" con impresiones altas y posición floja. Incluye schema Article + Breadcrumb + FAQPage |
| `blog/index.html`, `sitemap.xml` | Tarjeta y entrada de sitemap del artículo nuevo |
| `llms.txt` | Añadida sección `## Blog` (nunca había existido — el blog era invisible para crawlers de AI desde su creación) |
| `data/gbp/post-2026-07-06.md` | Post redactado para GBP — **ya publicado por Rocío** ✅ |

**Bug encontrado y corregido — `site_url` incorrecto en `seo_report.py`:**
La auditoría técnica automática (sección 10 del informe) llevaba dos semanas seguidas (2026-06-29 y 2026-07-06) analizando `myenglishspot.com` — un dominio de terceros no relacionado — en vez de `www.myenglishspotclasses.com`. Corregido en `/root/agencia/seo_report.py` (dict `CLIENTS`) y en el snippet de referencia de `SEO_LOOP_MASTER.md`. Verificado: `crawl_site()` contra el dominio correcto devuelve "sin problemas detectados"; `.env`, systemd y crontab revisados, sin más referencias al dominio incorrecto. El informe del 2026-07-13 ya saldrá corregido.

**Hallazgo pendiente de decisión — posible conflicto con política de precios:**
Rocío indicó que la dueña del negocio pidió no publicar precios en ninguna web. Se encontraron precios activos en producción:
- `https://www.myenglishspotclasses.com/#precios` (sección completa en la home, 22€/20€ por clase)
- `llms.txt` — "Precios: desde €200/10 clases"
- `https://www.myenglishspotclasses.com/clases-ingles-verano` — "desde €200 el bono de 10 horas"
- El blog menciona la tasa oficial del examen de Cambridge (150-200€) — no es precio del negocio, a confirmar si cuenta igual

**No se tocó nada de esto todavía** — es un cambio de contenido visible en varias páginas (incluye enlaces internos `#precios` desde el menú), requiere decisión de Rocío antes de aplicar. Ver checklist de pendientes.

---

## Sesión 5 julio 2026

### Loop SEO automático (`seo_report.py`) — 3 bugs corregidos

Detectados al revisar el informe semanal del 2026-07-05 antes del envío del lunes. Afectaban también al informe de Víctor Martín (mismo script), auditado y confirmado.

| Bug | Fix |
|---|---|
| GBP fuera de lugar: el export `gbp-my-english-spot-2026-07-05.md` se había guardado en `data/2026-07-05/` en vez de `data/gbp/` | Movido a `data/gbp/gbp-2026-07-05.md`. Regla dura documentada en `SEO_LOOP_MASTER.md`: los archivos GBP van siempre directo en `gbp/`, nunca en la carpeta fechada |
| Ambigüedad en `find_csv("Páginas")` — podía traer `Páginas_y_pantallas_...csv` (GA4) en vez de `Páginas.csv` (GSC) por orden de iteración del filesystem | Ahora excluye archivos con `y_pantallas` y prioriza match exacto de nombre |
| Cabeceras reales de los CSV de GSC ("Consultas principales"/"Páginas principales") no coincidían con lo que el script buscaba ("Consulta"/"Página de destino") — se perdía la columna con el texto de la keyword/URL | Match de columnas ampliado para reconocer también el prefijo real de cabecera |

Además, se agregó al MD una sección nueva **4.6. Top 5 consultas y páginas (por clics)** — los datos ya se calculaban (`top_queries`/`top_pages`) pero no se mostraban en el informe final.

Validado con `python3 -m py_compile` y regeneración de informe de prueba (borrado tras confirmar). Ver detalle completo en `/root/agencia/SEO_LOOP_MASTER.md`.

**Pendiente:** verificar que el informe automático del lunes 2026-07-06 llegue a Telegram con las 4 correcciones reflejadas (GBP fresco, top 5 consultas/páginas con nombre visible).

---

## Sesión 4 junio 2026

### Página `/gracias` creada y depurada

- Creada `gracias.html`: página de confirmación post-reserva
  - Mensaje de bienvenida confirmando la reserva exitosa
  - Formulario corto: Nombre, Email, Nivel de inglés (A1–C1 / No lo sé), Objetivo principal
  - Al hacer submit construye un link `wa.me/34678703017` con los datos del formulario y abre WhatsApp directamente — sin servicios externos (sin Formspree, sin EmailJS)
  - `noindex, follow` — correctamente bloqueada para buscadores
  - Live en https://www.myenglishspotclasses.com/gracias

- Fix en `vercel.json`: añadida rewrite `/gracias` → `/gracias.html` (sin esto Vercel devolvía 404 en la URL limpia)

- **Bugs corregidos durante depuración:**
  1. **CSP bloqueaba script inline**: `script-src 'self'` sin `'unsafe-inline'` impedía que el handler del form se ejecutara. Fix: mover el handler a `app.js` (ya permitido como `'self'`)
  2. **`id="nav-menu"` faltante**: `gracias.html` no tenía `id="nav-menu"` en el `<nav>`. `app.js` llama `getElementById('nav-menu')` en el nivel superior; el null-dereference crasheaba sin capturar, impidiendo que el IIFE del form se registrara. Fix: añadir `id="nav-menu"` al nav de `gracias.html`
  3. **Emojis en mensaje WhatsApp**: los emojis se codificaban como caracteres de reemplazo en algunos entornos. Fix: reemplazados por etiquetas de texto plano (`Nombre:`, `Email:`, etc.)

### Search Console — análisis últimos 3 meses

| Métrica | Valor |
|---------|-------|
| Clics | 16 |
| Impresiones | 85 |
| CTR medio | 18.82% |
| Posición media | 6.36 |
| Páginas indexadas | 1 |
| Páginas "Descubierta: actualmente sin indexar" | 3 |

- Solo 1 URL indexada — todo el SEO sigue dependiendo de la home
- 3 páginas descubiertas pero no indexadas — pendiente investigar y solicitar indexación

---

## Sesión 1 junio 2026

### Google Business Profile — cambios manuales completados

- ✅ Categoría cambiada a "Tutor privado"
- ✅ Atributo "Ofrece clases online" activado
- ✅ "Servicios en las instalaciones" desactivado
- ✅ Dirección física oculta para clientes
- ✅ Área de servicio: España añadida
- ✅ Descripción actualizada (texto optimizado anti-confusión presencial)
- ✅ Post publicado con botón "Reservar" → Google Calendar

### Página de servicio `/clases-particulares-ingles-online`

- Creada, revisada y aprobada visualmente en preview
- **Problema detectado en producción:** CSS no carga en móvil — rutas relativas (`../styles.css`) en lugar de absolutas (`/styles.css`)
- Página retirada del repo hasta resolver el problema
- Contexto guardado en `/root/my-english-spot/data/pendiente-clases-particulares.md`

_(Checklist de esta sesión consolidado en "Checklist de pendientes" al final del documento — evitar duplicados)_

---

## Sesión 31 mayo 2026 (tarde)

### Fixes de código aplicados

- **Responsive layout card CTA — móvil vertical** (commit `6915dc6`)
  Los 3 ítems de beneficios del card CTA se cortaban en 390px. Bug: `grid-template-columns: 1fr` aplicado a un contenedor `display: flex` (sin efecto). Fix: `flex-direction: column` en `max-width: 720px`. También se agregaron breakpoints para 768px y 640px con paddings y tipografía ajustados.

- **Fix overflow beneficios en anchos intermedios** (commit `6b80161`)
  Entre 721px y ~830px los ítems seguían en fila (`flex-wrap` ausente) y desbordaban. Fix: `flex-wrap: wrap` + `justify-content: center` + `flex: 0 0 auto` en los `li`. Los ítems ahora envuelven naturalmente sin depender de breakpoints frágiles.

- **OG image actualizada** (commits `fc7fb6e` y `df84980`)
  Imagen Open Graph actualizada a `og-image.jpeg` en resolución 1200×630.

---

### Análisis SEO + GBP completado

- CSVs exportados de Google Search Console y Google Business Profile subidos a `/root/my-english-spot/data/`
- Skill `seo-gbp-analyzer` creada en `/opt/agent/skills/seo/seo-gbp-analyzer.md` — **v1.2.0**
  - Análisis estructurado en 7 secciones fijas
  - Comparación de dos períodos (con normalización por días)
  - Sección 8 de análisis libre: prosa conversacional, hallazgos no obvios, cierre con "Si este fuera mi negocio..."

#### Hallazgos principales del análisis

| Métrica | Valor | Estado |
|---|---|---|
| Impresiones GSC (13 días) | 55 (~127/mes est.) | ℹ️ Volumen muy bajo |
| Clics GSC | 13 | ℹ️ |
| CTR medio | **23.6%** | ✅ Excelente |
| Posición media | 4.36 | ✅ |
| Vistas GBP (6 meses) | 1.053 (~176/mes) | ℹ️ |
| Conversión perfil→web GBP | 2.85% | ❌ Crítico |
| Ratio "Cómo llegar" | **87.2%** | ❌ CRÍTICO |

**Hallazgo crítico:** El 87% de las interacciones en Google Business Profile son solicitudes de "Cómo llegar" — Google y los usuarios creen que el negocio es presencial en Vigo. Cada día 1-2 personas llegan a la ficha, buscan la dirección y se van. Estimación: €1.200 en ingresos perdidos en 6 meses solo por este problema.

**Otros hallazgos:**
- Solo 1 URL indexada en GSC — todo el SEO depende de la home
- Google asocia el negocio a Vigo (300k hab.) cuando podría posicionarse en toda España
- Búsquedas de marca ("spot", "english") en GBP → hay reconocimiento de marca por algún canal no identificado
- CTR móvil (18.5%) vs desktop (28.6%) → 10pp de diferencia, experiencia móvil a mejorar

---

## Checklist de pendientes

_Actualizado 2026-07-07 — se sacaron los ítems ya resueltos (verificado contra el estado real del sitio en navegador, no solo contra el checklist) y se dejaron solo los pendientes vigentes._

### 🔴 Decisión de Rocío necesaria

- [ ] **Confirmar política de precios:** ¿hay que quitar los precios de `index.html` (#precios), `llms.txt` y `clases-ingles-verano.html`? Si sí, definir qué reemplaza la sección `#precios` de la home (tiene enlaces internos desde el menú que quedarían rotos si se borra sin reemplazo). Ver detalle en sesión 6 julio 2026.
- [ ] **Aprobar redirección de foco de contenido** hacia Pilar exámenes oficiales (FCE/CAE/IELTS) y Pilar online por objetivo, frenando expansión de contenido local de Vigo (techo de mercado bajo confirmado con datos propios de GSC). Ver análisis en sesión 7 julio 2026.
- [ ] **Definir junto con los resultados del informe del lunes 2026-07-13** (primer informe con GA4 realmente activo) qué hacer con el volumen de entrada al funnel — hoy solo hay 1 clase de prueba registrada en todo el historial medido.
- [ ] Investigar 3 páginas "Descubierta: actualmente sin indexar" en Search Console — requiere entrar a GSC directamente y solicitar indexación manual

### 🟡 Esta semana — Rocío

- [ ] Subir 3 fotos nuevas a GBP
- [ ] Revisar/aprobar el tono y contenido del artículo nuevo del blog (ya publicado, indexación aún no masiva)
- [ ] Decidir si anunciar el artículo nuevo en Instagram/TikTok esta semana o esperar
- [ ] Revisar Clarity de nuevo en 2-3 horas (confirmado funcionando técnicamente el 7-jul, dashboard puede tardar en mostrar sesiones)

### 🟡 Próximas sesiones — Claude Code

- [ ] Cruzar `instagram-insights-junio2026.md` y `reels-validados-julio2026.md` con el diagnóstico de volumen — es el canal más probable detrás de las búsquedas de marca ("spot", "english") en GBP
- [ ] Cruzar `competencia-cookies-2026-06-19.md` con precios/propuesta de valor de las academias de Vigo (hoy solo compara tracking/cookies)
- [ ] Borrar el email de prueba `test-verificacion-csp2@example.com` de la lista de espera real (quedó cargado al verificar el formulario el 7-jul)
- [ ] Auditoría PageSpeed móvil (CTR móvil 10pp menor que desktop — sin diagnosticar aún)
- [ ] Crear página `/clases-ingles-online-adultos` (alineada con el Pilar online por objetivo)
- [ ] Añadir perfiles de Instagram y TikTok a Google Business Profile
- [ ] Vincular Google Calendar de reservas con "Configurar reserva" en GBP
- [ ] Verificar que el informe automático del lunes 2026-07-13 salga en horario con GA4 activo y datos de comportamiento real por primera vez

### 🟢 Medio plazo

- [ ] Configurar dashboard unificado en Google Sheets (Search Console + GBP + datos manuales de Instagram)
- [ ] Rocío: añadir link a `/gracias` en la descripción de la cita de Google Calendar
- [ ] Exportar CSVs de Search Console a 90 días (datos actuales: solo 13 días)
- [ ] Decidir arquitectura web: sitio estático actual vs CMS (para escalar contenido SEO)
- [ ] Pedir reseñas nuevas a alumnos (link directo desde GBP → "Pedir reseñas") — distinto de responder, ya están todas contestadas

### ✅ Resuelto (sacado del checklist activo)

- Rutas CSS relativas en `clases-particulares-ingles-online.html` → ya son absolutas, verificado
- Página `/clases-ingles-vigo` → creada y publicada
- `site_url` incorrecto en `seo_report.py` (auditaba dominio de terceros) → corregido 2026-07-06
- Post de GBP de esta semana → publicado por Rocío
- Reseñas pendientes de responder → no había ninguna, todas contestadas
- **GA4 sin recibir hits desde el 18-jun** (falsa alarma previa de "conectado" — nunca se verificó con network requests reales) → corregido y verificado en producción el 7-jul (3 deploys)
- **Formulario de lista de espera roto** (`clases-ingles-verano.html`) desde su publicación → corregido y verificado end-to-end el 7-jul
- CSP bloqueando estilos/scripts en 4 páginas (incl. bug de sintaxis JS en 3 legales) → corregido el 7-jul
- Disponibilidad de Calendar / tasa de conversión de la clase de prueba → no son problemas a resolver, son la realidad actual del negocio (agenda se renueva semanalmente; 1/1 clases de prueba se convirtió en alumna)
- Clarity mostrando 0 en dashboard → investigado, confirmado funcionando técnicamente (7-jul), es lag de dashboard/tráfico de prueba filtrado como bot
