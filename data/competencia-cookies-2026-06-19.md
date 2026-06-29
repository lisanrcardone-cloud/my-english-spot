# Análisis de Cookies y Tracking — Academias de Inglés en Vigo
**Fecha:** 2026-06-19  
**Metodología:** Análisis con Playwright (carga real de página sin interacción previa con el banner), inspección de red, HTML fuente y headers HTTP.

---

## Academias analizadas

| # | Academia | URL |
|---|----------|-----|
| 1 | English Solutions Vigo | englishsolutionsvigo.com |
| 2 | Schoolhouse Vigo | schoolhousevigo.com |
| 3 | WorldEnglish Vigo | worldenglishvigo.es |
| REF | My English Spot | myenglishspotclasses.com |

---

## Análisis individual

### 1. English Solutions Vigo — `englishsolutionsvigo.com`

**1. Banner de cookies**  
Sí. Diálogo modal centrado con tres opciones: *Aceptar / Denegar / Ver preferencias* y botón de cierre (×). Texto genérico estándar sobre procesamiento de datos. Aspecto cuidado.

**2. Tecnologías de tracking detectadas**  
- GTM: `GTM-NX9M2VNL`  
- Universal Analytics (UA): `UA-12509713-3` ⚠️ *(UA está oficialmente retirado desde julio 2024)*  
- GA4: `G-4CQKP3XV1J`  
- Google Ads: `AW-864468116`  
- reCAPTCHA (Google)  

**3. ¿Cookies de terceros antes del consentimiento?**  
**SÍ.** GTM carga inmediatamente al abrir la página. Desde GTM se disparan peticiones POST a `google-analytics.com` (UA), `region1.google-analytics.com` (GA4) y `pagead2.googlesyndication.com` (Google Ads) antes de cualquier interacción del usuario con el banner.

**4. Consent Mode v2**  
Implementación **parcial e inconsistente**. Los pings de GA4 incluyen parámetros `gcs=G100`, `pscdl=denied`, `npa=1` y `gcd=13q3q3q2q5l1`, lo que indica que CM v2 está configurado en GTM. Sin embargo, la etiqueta UA (`UA-12509713-3`) se inyecta directamente en el HTML fuente con `gtag('config', 'UA-12509713-3')` sin ningún control de consentimiento. **Incumplimiento grave** dado que UA ni siquiera debería estar activo.

**5. CMP externa**  
Sí: **Complianz** (plugin WordPress para GDPR). Es una CMP legítima y auditable.

**6. Política de cookies enlazada desde el banner**  
Sí. El footer del banner incluye enlace a `englishsolutionsvigo.com/cookies/`.

**7. Headers HTTP de privacidad**  
- `Permissions-Policy`: ❌ No presente  
- `Content-Security-Policy`: ❌ No presente  
- `Referrer-Policy`: ❌ No presente  
- `Strict-Transport-Security`: ❌ No presente  
- `X-Frame-Options`: ❌ No presente  

**8. Trackers no obvios**  
- UA (`UA-12509713-3`) sigue activo pese a estar retirado oficialmente por Google. Es un tracker zombie que recoge datos sin base legal clara.  
- Google Ads Conversion Tracking (`AW-864468116`) activo, implica que hacen campañas de pago y rastrean conversiones.

---

### 2. Schoolhouse Vigo — `schoolhousevigo.com`

**1. Banner de cookies**  
Sí. Panel inferior completo con tres opciones: *Aceptar solo lo necesario / Aceptar todo / Abrir configuración avanzada*. Texto detallado sobre el uso de cookies. Diseño sólido.

**2. Tecnologías de tracking detectadas**  
- GTM (dos contenedores): `GTM-542MMSL` y `GTM-TPHV4ZX`  
- GA4: `G-BRD14MZDTH`  
- Google Ads: `AW-817777108`  

**3. ¿Cookies de terceros antes del consentimiento?**  
**SÍ.** GA4 y Google Ads envían `page_view` a `region1.google-analytics.com` y `pagead2.googlesyndication.com` antes de cualquier interacción. El flujo es idéntico al de English Solutions.

**4. Consent Mode v2**  
Implementación **presente con estado denied**. Los pings incluyen `gcs=G100`, `pscdl=denied`, `npa=1`, `gcd=13p3pPp2p5l1`. A diferencia de English Solutions, aquí el CM v2 parece más consistente (solo GA4 y Ads, sin UA zombie). Google recibe señales de modelado de conversiones incluso sin consentimiento, que es el comportamiento esperado con CM v2.

**5. CMP externa**  
Sí: **iubenda** — CMP profesional y auditada, muy usada en el mercado europeo.

**6. Política de cookies enlazada desde el banner**  
No visible en el banner. iubenda normalmente enlaza a la política, pero no se detectó link directo en el snapshot del banner.

**7. Headers HTTP de privacidad**  
- `Permissions-Policy`: ❌ No presente  
- `Content-Security-Policy`: ❌ No presente  
- `Referrer-Policy`: ❌ No presente  
- `Strict-Transport-Security`: ❌ No presente  
- `X-Frame-Options`: ✅ `DENY` (único header de seguridad presente)  

**8. Trackers no obvios**  
- Dos contenedores GTM activos simultáneamente (`GTM-542MMSL` + `GTM-TPHV4ZX`). Esto sugiere configuración heredada o duplicada, con riesgo de disparar eventos dobles y datos inflados en Analytics.

---

### 3. WorldEnglish Vigo — `worldenglishvigo.es`

**1. Banner de cookies**  
Sí. Banner inferior compacto con texto directo: *"Utilizamos cookies propias y de terceros para elaborar información estadística y mostrarte contenidos y servicios personalizados"*. Opciones: *Rechazar / Configurar / Aceptar* + enlace "Más información".

**2. Tecnologías de tracking detectadas**  
- Ningún tracker de Google, Meta, Microsoft u otro tercero conocido.  
- Stats propios del CMS: `stats.administrarweb.es` (plataforma española de gestión web).

**3. ¿Cookies de terceros antes del consentimiento?**  
**No aplica para terceros.** El único request no estático es `stats.administrarweb.es/registerStats.ashx`, que es el analytics interno del CMS. No hay trackers de terceros en absoluto.

**4. Consent Mode v2**  
No aplica. No usan Google Analytics ni Google Ads.

**5. CMP externa**  
No. El banner es nativo del CMS `administrarweb.es` (plataforma española de hosting/CMS).

**6. Política de cookies enlazada desde el banner**  
Sí. El enlace "Más información" apunta a `/politica-privacidad-cookies.aspx#usoCookies`.

**7. Headers HTTP de privacidad**  
- `Permissions-Policy`: ❌ No presente  
- `Content-Security-Policy`: ⚠️ Parcial — solo `worker-src blob:;` (mínimo)  
- `Referrer-Policy`: ✅ `strict-origin`  
- `Strict-Transport-Security`: ✅ `max-age=31536000`  
- `X-Frame-Options`: ❌ No presente  

**8. Trackers no obvios**  
- El banner menciona "cookies de terceros" pero no existen en la práctica. El texto del banner no coincide exactamente con la realidad técnica (menor gravedad, posiblemente es una plantilla genérica del CMS).

---

## Tabla resumen comparativa

| Factor | English Solutions | Schoolhouse | WorldEnglish | **My English Spot** |
|--------|:-----------------:|:-----------:|:------------:|:-------------------:|
| **Banner de cookies** | ✅ Modal completo | ✅ Panel inferior | ✅ Banner compacto | ✅ Diálogo simple |
| **Descripción del banner** | Genérica | Detallada | Compacta | **Clara y específica** ⭐ |
| **CMP externa** | Complianz | iubenda | No (CMS propio) | No (custom) |
| **Tracking antes del consentimiento** | ❌ SÍ (UA+GA4+Ads) | ❌ SÍ (GA4+Ads) | ⚠️ Solo stats CMS | ✅ **NO** ⭐ |
| **Trackers de terceros activos** | GTM, UA, GA4, Ads, reCAPTCHA | GTM×2, GA4, Ads | Ninguno | GA4, Clarity |
| **UA zombie activo** | ❌ Sí (incumplimiento) | ❌ No | — | — |
| **Google Ads tracking** | Sí | Sí | No | No |
| **Consent Mode v2** | ⚠️ Parcial/roto | ✅ Presente | No aplica | ❌ No detectado |
| **Política cookies enlazada** | ✅ Sí | ⚠️ No visible | ✅ Sí | ✅ Sí |
| **CSP (Content-Security-Policy)** | ❌ No | ❌ No | ⚠️ Parcial | ✅ **Completo** ⭐ |
| **Permissions-Policy** | ❌ No | ❌ No | ❌ No | ✅ **Sí** ⭐ |
| **Referrer-Policy** | ❌ No | ❌ No | ✅ strict-origin | ✅ strict-origin-when-cross-origin |
| **HSTS** | ❌ No | ❌ No | ✅ Sí | ✅ **Con preload** ⭐ |
| **X-Frame-Options** | ❌ No | ✅ DENY | ❌ No | ✅ **DENY** |

---

## Lo que los competidores tienen y My English Spot NO tiene

### 1. Consent Mode v2 de Google
**Schoolhouse** tiene CM v2 implementado correctamente. **English Solutions** lo tiene parcialmente.  
My English Spot bloquea todo tracking antes del consentimiento (lo cual es técnicamente correcto para RGPD), pero **no usa CM v2**, lo que significa que Google no recibe señales de modelado de conversiones aunque el usuario rechace. Para quien quiera usar Google Ads en el futuro, CM v2 es fundamental.  
> **Acción recomendada:** Si se considera activar Google Ads, implementar CM v2 con modo "denied by default" antes de que se acepten las cookies.

### 2. CMP externa reconocida
English Solutions usa **Complianz** y Schoolhouse usa **iubenda** — ambas son plataformas auditables con documentación legal explícita, generación automática de políticas y actualizaciones regulatorias.  
My English Spot tiene un banner propio que funciona bien técnicamente pero **no tiene respaldo de una CMP certificada**, lo que puede ser un punto débil ante auditorías formales o reclamaciones.  
> **Acción recomendada:** Opcional pero útil: añadir Complianz (WordPress) o iubenda para automatizar la gestión legal a largo plazo.

### 3. Google Ads Conversion Tracking
English Solutions y Schoolhouse tienen píxeles de Google Ads activos, lo que indica que **hacen campañas de pago en Google**. My English Spot no tiene esto configurado.  
Si en algún momento se activan campañas SEM, será necesario añadir el tag de conversiones.

---

## Donde My English Spot está POR ENCIMA del sector

### 1. ✅ Tracking bloqueado antes del consentimiento
My English Spot es la **única** de las 4 webs que **no envía ningún dato de tracking a terceros antes de que el usuario interactúe con el banner**. English Solutions y Schoolhouse violan este principio básico del RGPD. This is the most important compliance factor.

### 2. ✅ Headers HTTP de seguridad — los mejores del grupo
My English Spot es la única con:
- **CSP completo y restrictivo** (lista blanca explícita de dominios permitidos)
- **Permissions-Policy** (deshabilita acceso a cámara, micrófono, geolocalización, pagos, USB, FLoC)
- **HSTS con `preload`** (el nivel más alto de protección de transporte)
- **X-Frame-Options: DENY**

Ningún competidor tiene más de 2 de estos headers. WorldEnglish tiene HSTS pero sin preload y sin CSP real.

### 3. ✅ Banner honesto y específico
El banner de My English Spot es el único que **nombra explícitamente los trackers que usa** ("GA4" y "Clarity") y **declara lo que NO usa** ("no usamos cookies publicitarias"). Esto es transparencia activa, no solo cumplimiento formal.

### 4. ✅ Sin Universal Analytics zombie
English Solutions sigue mandando datos a UA (retirado), lo cual es un tracker sin base legal activa. My English Spot usa solo GA4 (el estándar actual).

### 5. ✅ Sin Google Ads tracking oculto
My English Spot no tiene píxeles de conversión de Google Ads, lo que implica menor exposición a trackers publicitarios que los competidores.

---

## Resumen ejecutivo

My English Spot tiene la implementación técnica más limpia del grupo en cuanto a **seguridad de headers y bloqueo de tracking previo al consentimiento**. Las dos áreas de mejora son la adopción de Consent Mode v2 (para estar preparado para campañas SEM) y el respaldo de una CMP externa certificada (para mayor robustez legal a largo plazo). 

En el contexto del sector de academias de inglés en Vigo, el estándar de facto es: *banner presente + trackers que se disparan de todas formas antes del clic*. My English Spot rompe con esa pauta, y eso es una ventaja tanto de cumplimiento como de confianza de usuario.

---
*Generado automáticamente con Playwright + análisis de red. Revisar periódicamente ya que las implementaciones de las webs competidoras pueden cambiar.*
