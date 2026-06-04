# My English Spot — Log de sesiones

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

### Checklist pendiente actualizado

#### 🔴 Urgente

- [ ] Arreglar rutas CSS en `clases-particulares-ingles-online.html` (relativas → absolutas), verificar en móvil y desktop, republicar

#### 🟡 Próximas sesiones — Claude Code

- [ ] Crear página `/clases-ingles-online-adultos`
- [ ] Crear página `/clases-ingles-vigo`
- [ ] Auditoría PageSpeed móvil

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

### 🔴 Urgente

- [ ] Investigar y corregir 3 páginas "Descubierta: actualmente sin indexar" en Search Console — identificar causa y solicitar indexación
- [ ] Arreglar rutas CSS en `clases-particulares-ingles-online.html` (relativas → absolutas), verificar en móvil y desktop, republicar

### 🟡 Próximas sesiones — Claude Code

- [ ] Añadir perfiles de Instagram y TikTok a Google Business Profile
- [ ] Vincular Google Calendar de reservas con "Configurar reserva" en GBP
- [ ] Crear página `/clases-ingles-online-adultos`
- [ ] Crear página `/clases-ingles-vigo`
- [ ] Auditoría PageSpeed móvil (identificar por qué CTR móvil es 10pp menor)

### 🟢 Medio plazo

- [ ] Configurar dashboard unificado en Google Sheets (Search Console + GBP + datos manuales de Instagram)
- [ ] Rocío: añadir link a `/gracias` en la descripción de la cita de Google Calendar
- [ ] Exportar CSVs de Search Console a 90 días (datos actuales: solo 13 días)
- [ ] Conectar GA4 para medir conversiones web
- [ ] Blog SEO — artículos para queries informacionales ("inglés online para adultos", etc.)
- [ ] Decidir arquitectura web: sitio estático actual vs CMS (para escalar contenido SEO)
- [ ] Pedir reseñas a alumnos (link directo desde GBP → "Pedir reseñas")
