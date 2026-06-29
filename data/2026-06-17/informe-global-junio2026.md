# Informe global — My English Spot
**Fecha:** 17 junio 2026  
**Fuentes:** Google Analytics GA4 · Google Search Console · Google Business Profile · Microsoft Clarity · Instagram Insights  
**Períodos:** GA4 y GSC = últimos 28 días (20 mayo–16 junio) · GSC CSVs = últimos 7 días · GBP = sin período exacto · Clarity = 11–17 junio · Instagram = últimos 30 días

---

## Nota sobre duplicados en los datos

Antes del análisis, se identificaron y descartaron los siguientes archivos redundantes:
- `Problemas críticos copia.csv` — idéntico a `Problemas críticos.csv` (ambos vacíos)
- `Problemas no críticos copia.csv` — idéntico a `Problemas no críticos.csv` (ambos vacíos)
- `Gráfico copia 2.csv` — subconjunto de `Gráfico copia.csv` (mismos datos sin la columna Impresiones)

Los cuatro archivos de problemas vacíos confirman: **cero errores de schema validados en Search Console**. Buena señal técnica.

---

## 1. Puntos fuertes

### SEO técnico — sin deuda
El sitio tiene cero errores en los informes de Search Console (Rich Results). Schema.org implementado en todas las páginas de servicio (Course, FAQPage, BreadcrumbList, Person), canonical correcto, sitemap actualizado, HTTPS forzado, headers de seguridad configurados en Vercel. Es una base técnica limpia que la mayoría de academias online no tiene.

### CTR de búsqueda orgánica — por encima de la media
La homepage tiene un CTR del 6.58% (últimos 7 días) y del 10.78% en los últimos 28 días según GA4. Para una cuenta con tan poco historial y en posición media ~20, estos CTRs son buenos: el snippet en Google es atractivo y consigue clics cuando aparece.

### Google Business Profile — tracción local real
1.155 vistas del perfil en el período medido, con 35 clics al sitio web. Los términos de búsqueda confirman que hay gente buscando específicamente "academia inglés vigo", "clases de inglés vigo", "ielts vigo" y "profesores particulares inglés vigo" — intención local y real. El perfil está siendo encontrado.

### Reputación — 5.0 ⭐ con 7 reseñas
Promedio perfecto con 7 reseñas. Para una academia nueva, esto es un activo de confianza directo que influye en la conversión de los que sí llegan al perfil.

### Instagram — distribución orgánica funcionando
El 62% de las visualizaciones llegan a no seguidores — el algoritmo está distribuyendo el contenido fuera de la base de seguidores. El post "No traduzcas el ME-TE-SE" (2.262 vistas, 15 guardados, 9 seguidores nuevos) demuestra que existe un formato probado y escalable. Con 174 seguidores conseguir 6.981 vistas es una ratio de alcance muy alta.

### Contenido técnico — ningún error de JavaScript en Clarity
El informe de Clarity registra 0 errores de JavaScript en las sesiones capturadas. El sitio no está roto por dentro.

---

## 2. Puntos débiles y problemas detectados

### 2.1 Tráfico web — prácticamente inexistente

**GA4: 7 usuarios en 28 días.** No es un número pequeño — es una señal de que el sitio web no existe como canal de captación todavía. Para contexto: el GBP recibió 1.155 vistas en el mismo período. El sitio web recibió 7 visitas únicas. Hay una desconexión enorme entre la visibilidad en Google Maps/GBP y las visitas al sitio.

| Canal | Usuarios (28 días) |
|---|---|
| Direct | 5 (71%) — probablemente Rocío y conocidos |
| Organic Social (Instagram) | 2 (29%) |
| Organic Search | ~0 |

El SEO orgánico no está generando tráfico todavía. Las búsquedas locales activas en GBP no se están convirtiendo en clics al sitio.

### 2.2 Cero conversiones medibles

El evento `reserva_confirmada` nunca se ha activado en GA4. Los eventos `click_reserva` y `click_email` tampoco aparecen en el historial de eventos. Esto significa una de dos cosas: nadie ha hecho clic en los CTAs, o los eventos están implementados pero no llegan a GA4 (posible problema de timing con la carga diferida de GA4).

**Consecuencia directa:** no se puede saber si algún alumno llegó a través del sitio web. Si Rocío tiene alumnos actuales, no existe forma de atribuirlos a ningún canal.

### 2.3 Clarity capturando sesiones de desarrollo, no de producción

El único registro de sesión en Clarity muestra la URL:
```
http://89.167.52.97:8080/preparacion-first-cambridge.html
```
Esta es una IP privada con puerto 8080 — un servidor de desarrollo local, no `www.myenglishspotclasses.com`. Clarity no está recibiendo datos reales de producción. Los mapas de calor, grabaciones y métricas de comportamiento (profundidad de scroll 7%, tiempo activo 0) son de una sesión de dev, no de usuarios reales. **Los datos de Clarity son actualmente inútiles para tomar decisiones.**

### 2.4 España = 0 interacción en GA4

De los 6 países registrados en GA4, España (el mercado objetivo) tiene 1 usuario y 0 sesiones con interacción. El único usuario español rebotó. Los usuarios que sí interactuaron vienen de Estados Unidos y Alemania. Esto sugiere que el tráfico español que llega está de paso (probablemente bots o rastreadores) o que el contenido no retiene.

### 2.5 Nadie scrollea

Solo 1 evento `scroll` registrado en 7 usuarios. Esto es una señal crítica: los usuarios entran y se van sin explorar. O el hero no convence para seguir leyendo, o el tiempo de carga en móvil es suficientemente lento para causar abandono antes de que la página cargue completamente. No se puede determinar cuál es el problema real porque Clarity no tiene datos válidos de producción.

### 2.6 GBP: 0 reservas, 2 reseñas sin responder

El perfil tiene 35 clics al sitio web y 0 reservas desde GBP. El botón de reserva existe pero no está convirtiendo — posiblemente el flujo hacia Google Calendar no está visible o configurado correctamente en el perfil. Las 2 reseñas sin responder son una señal de abandono del canal que Google penaliza en el ranking local.

### 2.7 Instagram → web: 5.8% de conversión

119 personas visitaron el perfil de Instagram en 30 días. Solo 7 tocaron el enlace al sitio. El 94.2% de las visitas al perfil no llega a la web. La bio actual no tiene urgencia ni dirección clara. El enlace único no discrimina entre "quiero información" y "quiero reservar".

### 2.8 Consultas de Search Console: nadie convierte en clics

Las 23 consultas registradas en los últimos 7 días tienen todas **0 clics**. Los únicos clics (5 en total) vienen de la homepage sin query asociada. La página de FCE aparece en posición 22 para "preparar fce huesca" — un query geográfico que no corresponde al mercado objetivo del sitio (Vigo/España). La página de clases particulares no aparece en ninguna consulta.

### 2.9 Anuncios de Instagram — ROI negativo

~40€ gastados en 3 campañas, con resultado confirmado de 0 nuevos alumnos atribuidos. El Anuncio 1 (imagen estática, 16€) captó 1 seguidor. Continuar con el mismo formato de anuncio sería tirar dinero.

---

## 3. Mejoras propuestas

### Bloque A — Lo que puede ejecutar Claude Code directamente

#### A1. Corregir el tracking de conversiones en `/gracias`
**Problema:** 0 conversiones registradas. La página `/gracias.html` existe pero probablemente no dispara el evento de conversión.  
**Acción:** Añadir `gtag('event', 'reserva_confirmada', { value: 1 })` en `/gracias.html` y marcarlo como conversión en GA4. También revisar que los eventos `click_reserva` en los CTAs llegan correctamente — el GA4 se carga con `requestIdleCallback`, lo que puede perder clics rápidos antes de que la librería esté lista. Mover el tracking de clics a un listener con cola de eventos.

#### A2. Añadir `LocalBusiness` schema a la homepage
**Problema:** GBP tiene tracción local pero el sitio web no tiene schema de negocio local. Google no puede vincular el sitio web con la entidad local de manera explícita.  
**Acción:** Añadir schema `LocalBusiness` con `name`, `address` (Vigo), `telephone`, `url`, `priceRange`, `openingHours` y `sameAs` apuntando al perfil de GBP. Esto refuerza el E-E-A-T local y puede mejorar el ranking en búsquedas locales.

#### A3. Crear página `/clases-ingles-vigo`
**Problema:** Las búsquedas locales activas en GBP ("academia inglés vigo", "clases de inglés vigo", "profesores particulares inglés vigo") no tienen una página de destino dedicada. El sitio no rankea para ninguna query local.  
**Acción:** Crear una landing page de servicio optimizada para búsquedas locales de Vigo, siguiendo el template-servicio.html existente, con schema `LocalBusiness` + `Course`, canonical correcto y contenido específico de la ciudad.

#### A4. Añadir UTMs al link de Instagram
**Problema:** No se puede distinguir en GA4 qué tráfico viene de Instagram orgánico vs. directo. Los 5 usuarios "Direct" pueden ser de Instagram si el usuario copia el link manualmente.  
**Acción:** Cambiar el link en la bio de Instagram a `https://www.myenglishspotclasses.com/?utm_source=instagram&utm_medium=social&utm_campaign=bio`. Crear versiones UTM también para los CTAs de stories y posts destacados.

#### A5. Excluir tráfico interno de Clarity y GA4
**Problema:** Clarity está recibiendo sesiones desde la IP de desarrollo (89.167.52.97). GA4 puede estar recibiendo sesiones propias de Rocío/Lisandro que distorsionan los datos (con solo 7 usuarios, 1 sesión interna = 14% de los datos).  
**Acción:** Añadir filtro de IP en GA4 (Admin → Filtros de datos → excluir IP interna). Para Clarity, el panel ya tiene un filtro de IP que hay que activar. También añadir `localStorage.setItem('clarity-opt-out', 1)` en el entorno de dev para evitar que Clarity capture sesiones locales.

#### A6. Mejorar la meta description de la homepage para CTR
**Problema:** La homepage está en posición media 20 con CTR del 6-10%. Hay margen para mejorar el snippet con un CTA explícito y la keyword "Vigo" para captar búsquedas locales.  
**Acción:** Actualizar `<meta name="description">` del `index.html` para incluir "Vigo", nivel CEFR, precio de referencia y CTA directo ("Primera clase gratis").

#### A7. Añadir `clases-particulares-ingles-online` al sitemap con fecha actualizada
**Problema:** La página principal de servicios no aparece en ninguna consulta de GSC. El sitemap la tiene pero puede necesitar re-señalizar a Google que está actualizada.  
**Acción:** Actualizar `<lastmod>` en el sitemap y hacer ping manual a Google vía GSC (o solicitar indexación directa).

---

### Bloque B — Lo que deben hacer Lisandro o Rocío manualmente

#### B1. Responder las 2 reseñas pendientes de GBP — **urgente**
Google tiene en cuenta la velocidad de respuesta a reseñas como señal de actividad del negocio. Dos reseñas sin responder en un perfil de 7 reseñas es un porcentaje alto. Responder también muestra a futuros clientes que el negocio está activo.  
**Dónde:** Google Business Profile → Reseñas → Responder.  
**Tiempo estimado:** 10 minutos.

#### B2. Completar el perfil de GBP
Google marca el perfil como incompleto. Los campos que suelen faltar: horario de atención, descripción del negocio (el texto libre de 750 caracteres es muy importante para SEO local), fotos del negocio/profesora, y URL específica de reserva en el botón de acción.  
**Acción específica:** Añadir el link de Google Calendar directamente como URL de reserva en el perfil para que el botón "Reservar" de GBP funcione.

#### B3. Configurar el botón de reserva de GBP correctamente
El perfil tiene 35 clics al sitio web pero 0 reservas desde GBP. Esto indica que el botón de "Reservar" dentro del perfil no está configurado con el link de calendario, o está apuntando a una URL que no funciona en móvil. Verificar que `https://calendar.app.google/sRYu3JKfnedx8V3v8` está configurado como URL de reservas en el perfil.

#### B4. Cambiar el link en la bio de Instagram + Linktree con 3 opciones claras
Solo 7 de 119 visitantes del perfil hacen clic en el enlace. La bio tiene un solo link genérico. Crear un Linktree (gratuito) o similar con tres opciones diferenciadas:
1. "Reservar clase gratis →" (link al calendario)
2. "Ver grupos de verano →" (link a /clases-ingles-verano)
3. "Escribirme por WhatsApp →" (link de WhatsApp Business)

Esto resuelve la fricción de "¿a dónde voy?" para los visitantes del perfil.

#### B5. Publicar en Instagram en el horario óptimo
Los datos de audiencia son claros: el pico máximo es **domingo a las 12h** (95 seguidores activos), seguido del lunes a las 12h (94). Actualmente los reels no siguen un horario fijo. Publicar fuera del pico significa menos engagement en las primeras 2 horas, que son las que el algoritmo usa para decidir si distribuir el contenido.  
**Acción:** Programar todos los reels para domingo o lunes entre las 10h y las 12h.

#### B6. Publicar 2 reels semanales con el formato "error de traducción"
El formato está demostrado: "No traduzcas el ME-TE-SE" multiplicó por 5 la media de vistas y captó 9 seguidores en solitario. No hay razón para no replicarlo sistemáticamente.  
**Temas pendientes de alto potencial confirmado:** "Me gusta" (I like vs. I enjoy), "Estar cansado" (tired vs. exhausted), "Echar de menos" (miss), "Quedar con alguien" (meet up).  
**Formato que NO está funcionando:** carruseles e imágenes estáticas (1% de las interacciones).

#### B7. Colaboraciones con negocios locales de Vigo — mínimo 1 por mes
El reel con @belladonnavigo alcanzó el 88.1% de no seguidores — el mayor porcentaje de alcance externo en el historial de la cuenta. Es el canal de crecimiento orgánico más eficiente disponible y no se ha repetido desde febrero.  
**Perfil de colaborador:** negocios locales en Vigo con 500–5.000 seguidores. No necesariamente relacionados con idiomas: gimnasios, cafeterías especializadas, tiendas de ropa, fotógrafos.

#### B8. Pausar los anuncios de imagen estática en Instagram
Los tres anuncios pagados han gastado ~40€ con ROI confirmado de 0 nuevos alumnos. El formato de imagen estática tiene demostrado ser el menos efectivo para esta cuenta. Si se va a invertir en publicidad, debe ser promocionando reels que ya tienen engagement orgánico (mínimo 50 interacciones), no publicaciones nuevas frías, y con el objetivo "Mensajes" o "Visitas al perfil" — no "Conversaciones iniciadas" que es el objetivo más difícil de cumplir para una cuenta nueva.

#### B9. Solicitar indexación en Google Search Console para 3 URLs
Ir a GSC → Inspeccionar URL → Solicitar indexación para:
1. `https://www.myenglishspotclasses.com/clases-ingles-verano` (nueva, publicada hoy)
2. `https://www.myenglishspotclasses.com/clases-particulares-ingles-online` (no aparece en consultas)
3. `https://www.myenglishspotclasses.com/` (actualizar lastmod tras cambios recientes)

#### B10. Añadir número de teléfono real a GBP o eliminar el botón de llamada
GBP registra 6 llamadas que Rocío nunca recibió. Si no hay un número de atención disponible, el botón de llamada genera fricción y confusión. Opciones: (a) añadir un número de WhatsApp Business y ocultarlo para llamadas directas, o (b) eliminar el campo de teléfono del perfil y sustituirlo por el enlace de reservas.

---

## Resumen ejecutivo

| Dimensión | Estado | Señal clave |
|---|---|---|
| SEO técnico | ✅ Sólido | 0 errores de schema, CSP, canonical |
| Tráfico web | 🔴 Crítico | 7 usuarios en 28 días |
| Conversiones web | 🔴 Sin datos | 0 eventos de reserva registrados |
| Comportamiento en página | ⚠️ Sin datos válidos | Clarity captura dev, no producción |
| SEO orgánico | ⚠️ Emergente | CTR bueno, volumen mínimo, posición ~20 |
| SEO local (GBP) | 🟡 Potencial | 1.155 vistas, 0 reservas directas |
| Instagram orgánico | 🟡 En crecimiento | Formato viral probado, funnel roto |
| Publicidad pagada | 🔴 Ineficiente | 40€ gastados, 0 conversiones atribuidas |

**El diagnóstico honesto:** el proyecto tiene una base técnica buena y un canal orgánico (Instagram) con señales positivas reales. El problema es que ninguno de los canales está conectado con la conversión. No se sabe si hay alumnos porque nadie lo está midiendo correctamente, el tráfico web es anecdótico, y el puente entre la visibilidad en redes/GBP y la reserva de una clase está roto en múltiples puntos. Las prioridades son: medir conversiones reales (A1), activar el SEO local con una página de Vigo (A3), y conectar Instagram con la web (B4 + A4).
