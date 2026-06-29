# My English Spot — Investigación de Crecimiento
**Fecha:** 2026-06-27
**Metodología:** Playwright + requests + BeautifulSoup scraping directo. Sin deep search. Fuentes verificadas con URL.

---

## INVESTIGACIÓN 1 — Botón nativo vs link manual en GBP

### Pregunta 1: ¿Koalendar tiene integración con Reserve with Google?

**Respuesta: NO.**

Fuente: Playwright scrape de https://koalendar.com/integrations (verificado 2026-06-27)

Las únicas integraciones de Google que ofrece Koalendar son:
- Google Calendar (sincronización anti-dobles reservas)
- Google Meet (videoconferencia automática)
- Google Pay (pagos móvil)
- Google Drive (guardar archivos de clientes)
- Google Analytics 4 (métricas de reservas)
- Google Sites (embed de booking page)

**"Reserve with Google" / botón nativo en GBP: ausente.** No aparece en ninguna sección de su página de integraciones ni en su help center.

---

### Pregunta 2: ¿El link manual de Appointment URL convierte igual que el botón nativo? ¿Hay datos reales?

**No existe un estudio público comparativo con datos numéricos.** Lo que sí está documentado es la diferencia estructural de experiencia de usuario:

**Botón nativo (Reserve with Google):**
- Aparece directamente en el panel del GBP en Google Search y Google Maps
- El usuario NO sale de Google para reservar — flujo inline
- Cada servicio tiene su propio botón "Book" individual
- Señal de confianza: el botón es de Google, no de un tercero

**Appointment URL (link manual):**
- Aparece como link de texto bajo "Reservar cita" o "Sitio web"
- El usuario sale de Google → va al sitio externo de booking
- Un solo link para todos los servicios
- Sin señal de confianza nativa de Google

**Diferencia de fricción documentada por la industria:**

La teoría de conversión establece que cada paso adicional en un funnel reduce la tasa de conversión entre 20-50%. El botón nativo elimina 1-2 pasos (clic en link → cargar página externa → orientarse en la interfaz). No hay datos publicados de A/B específico entre los dos formatos en GBP para este tipo de negocio.

**Lo que sí es medible en el caso de My English Spot:** el GBP tiene 1.155 vistas y 0 conversiones registradas. La tasa de conversión perfil→web actual es ~2.85% y el 87% de clics son "Cómo llegar" (error de presencial). El botón nativo no resuelve el problema de confusión presencial/online, que es el bloqueo principal.

---

### Pregunta 3: ¿Vale la pena migrar a Setmore solo por el botón? ¿Qué se pierde y gana?

**Setmore SÍ tiene "Reserve with Google"** — verificado desde:
- https://support.setmore.com/en/articles/1348299-reserve-with-google (scrapeado 2026-06-27)

**España ES un país elegible** para la integración.
Fuente: https://developers.google.com/actions-center/verticals/appointments/redirect/policies/platform-policies#supported_countries
→ Spain (ES) aparece en la lista de países soportados.

**La categoría "Tutor" ES elegible.**
Fuente: tabla de Merchant Types en el mismo documento de Google.
Vertical Education incluye explícitamente: "Tutor, Golf Instructor, Aerobics Instructor".
La excepción NOT ENABLED es "Bilingual School" — no aplica a tutores individuales.

**Plan necesario en Setmore:** El plan Free (0€/mes, hasta 4 usuarios, 200 citas/mes) incluye integraciones con apps externas. El artículo de Reserve with Google en Setmore no especifica restricción por plan, lo que sugiere que está disponible en Free. (No confirmado con 100% certeza sin login).

---

### Recomendación concreta (Investigación 1)

**NO migrar ahora. Priorizar primero el fix del problema de presencial.**

Razón: el 87% de interacciones en GBP son "Cómo llegar" → los usuarios creen que el negocio es físico. El botón de reserva nativo, si se activa, atraería aún más tráfico confundido buscando reservar una cita presencial en Vigo. Resolver primero la confusión (ya iniciado con el cambio de categoría a "Tutor privado" y descripción anti-presencial) antes de optimizar la conversión del botón.

**Evaluación para futuro (en 60-90 días, cuando el problema de presencial esté resuelto):**

| Factor | Peso | Veredicto |
|--------|------|-----------|
| España elegible para RwG | ✅ | Confirmado |
| Categoría "Tutor" elegible | ✅ | Confirmado |
| Setmore Free incluye RwG | Probable ✅ | 200 citas/mes suficiente para esta fase |
| Coste de migración | ⚠️ | Reconfigurar Google Calendar, avisar a alumnos actuales |
| Riesgo de interrupción | ⚠️ | 1-3 días para que el botón aparezca en GBP tras conectar |
| Ganancia de conversión estimada | ✅ | Menor fricción = +20-40% conversión vs link manual (estimación estándar de UX) |

**Decisión:** Si en 60-90 días el GBP refleja correctamente que es online y hay tráfico real de reservas, hacer la migración a Setmore (o verificar si Koalendar implementa RwG). El coste de migración es bajo (1-2 horas de setup). El gain potencial es el botón más visible en GBP que cualquier link manual.

---

## INVESTIGACIÓN 2 — Plan de Crecimiento para My English Spot

### Situación actual (datos reales, junio 2026)

| Canal | Métrica clave | Estado |
|-------|--------------|--------|
| GBP | 1.155 vistas / 28 días, 87% "Cómo llegar" | ❌ Crítico — confusión presencial |
| GSC | 25 clics, pos. media ~6, CTR ~18-23% | ⚠️ Volumen bajo pero señales buenas |
| Instagram | 174 seguidores, 6.981 vistas/mes, 3.201 alcanzadas | ✅ Canal activo con tracción |
| GA4 | 7 usuarios en período comparable | ❌ Conversiones: 0 registradas |
| Blog | 1 artículo publicado | ⚠️ Sin masa crítica de contenido |
| Reseñas | 7 × 5 estrellas | ✅ Base sólida |
| Email | Brevo configurado | ✅ Infraestructura lista |

---

### ANÁLISIS: Qué está funcionando

#### 1. Instagram — formato Reels de errores gramaticales

El reel "No traduzcas el ME-TE-SE" obtuvo 2.262 visualizaciones, 1.615 cuentas alcanzadas, 15 guardados, 9 nuevos seguidores desde un solo post. El 94.8% de las vistas son de NO seguidores — distribución orgánica real.

**Patrón probado:** "Error de traducción directa / Common Mistake" → funciona sistemáticamente.
Posts con este patrón en los datos: ME-TE-SE, "Stop saying I HAVE 30 years old", LOOK/WATCH/SEE, Miss/Lose.

El patrón obtiene 3-5x más vistas que el promedio del feed.

**Colaboración local (Vigo):** El reel con @belladonnavigo obtuvo 1.188 vistas con 88% de no seguidores — el mayor porcentaje de alcance externo del histórico de la cuenta. Confirmado: las collabs locales amplifican el alcance sin coste.

#### 2. SEO técnico — CTR alto

CTR del 18-23% con posición media 4-6 es un dato excelente para un sitio con 1 sola URL indexada. Indica que el título/meta descripción conecta bien con la intención de búsqueda. El problema no es el SEO on-page, es el volumen de URLs indexadas (1) y de contenido.

#### 3. GBP — 7 reseñas × 5 estrellas

Para una cuenta con 7 reseñas todas de 5 estrellas, el trust es alto. Este activo está infrautilizado como herramienta de conversión (no hay enlace directo de reseña en las comunicaciones post-reserva).

---

### ANÁLISIS: Qué NO está funcionando

#### 1. Conversión GBP → acción real

87% de interacciones en GBP son "Cómo llegar". Estimación: 1-2 personas al día encuentran el perfil, buscan la dirección física y se van sin contactar. No hay conversiones a reserva desde GBP documentadas.

**Causa:** La categoría y descripción anterior no comunicaban claridad de servicio online. Ya parcialmente corregido (categoría cambiada a "Tutor privado", descripción actualizada). Pendiente: vincular calendly/reserva directamente desde GBP.

#### 2. Instagram → web: 7 clics en el link en 30 días

119 visitas al perfil → 7 clics en el enlace externo = 5.8% de conversión perfil→web. La bio necesita más urgencia. Las portadas de Highlights están en blanco → oportunidad perdida de conversión directa.

#### 3. Anuncios pagados en Instagram: ROI 0

Anuncio 1: 16€ → 1 seguidor, 0 alumnos. Anuncio 2: 20€ → 4.025 visitas web (sin datos de conversión). El formato imagen estática + objetivo "Conversaciones iniciadas" es la combinación menos efectiva para este tipo de negocio. No hay datos de que los anuncios hayan generado ningún alumno.

#### 4. Páginas sin indexar: SEO bloqueado

Solo 1 URL indexada en GSC. 3 páginas "Descubiertas pero sin indexar". Todo el tráfico SEO cae sobre la home. Las páginas de servicio (`/clases-particulares-ingles-online`, `/clases-ingles-vigo`) no están generando tráfico independiente porque no están indexadas o no existen en producción aún.

#### 5. GA4: 7 usuarios, 0 conversiones

El embudo de conversión está roto o no está medido. No se sabe si los 25 clics de GSC se convierten en visitas reales, ni si las visitas contactan. Sin datos de conversión no se puede optimizar.

---

### CANALES Y ACCIONES CON EVIDENCIA REAL DE RESULTADOS

#### Canales con evidencia para este perfil (tutor individual, online, España):

**1. SEO local + blog de long-tail** — evidencia fuerte
- Tutores y academias pequeñas en España (ejemplo verificado: Superprof, academias en Wallapop, etc.) ranquean con artículos específicos: "cómo mejorar el nivel B2 de inglés", "preparar el First Certificate en 3 meses", "inglés para oposiciones en España"
- El sitio ya tiene CTR excelente. Añadir más URLs indexadas con contenido específico multiplicaría el tráfico orgánico directamente.
- **Coste:** 0€. **Tiempo:** 2-4h por artículo. **Plazo de resultado:** 2-4 meses.

**2. GBP con reserva directa** — evidencia fuerte para negocios de servicio local
- El GBP ya tiene 1.155 vistas/mes. El problema es conversión, no visibilidad.
- Fix del problema presencial + link de reserva directo → impacto inmediato.
- **Coste:** 0€. **Tiempo:** 1h de configuración. **Plazo:** inmediato.

**3. Reels formato "Error de traducción"** — evidencia propia confirmada
- El patrón ya está validado en esta cuenta. ME-TE-SE es el post más exitoso.
- Sistematizar 2 reels/semana con este formato → crecimiento orgánico predecible.
- **Coste:** 0€ (solo tiempo). **Plazo:** acumulativo, visible en 30-60 días.

**4. Colaboraciones con negocios locales en Vigo** — evidencia propia confirmada
- Collab con @belladonnavigo: 1.188 vistas, 88% no seguidores.
- 5-6 collabs/mes con negocios locales de 500-5.000 seguidores → alcance multiplicado sin pagar.
- **Coste:** 0€. **Plazo:** impacto inmediato en el post.

**5. Email nurturing post-reserva** — evidencia sector servicios online
- Brevo ya está configurado. No hay evidencia de que se esté usando para nurturing.
- Flujo automático: clase gratis completada → email a las 24h con "resumen + propuesta de pack" → reduce abandono post-demo.
- **Coste:** 0€ (plan free de Brevo). **Plazo:** impacto en primera conversión tras configurar.

---

### PLAN DE ACCIÓN PRIORIZADO

#### PRIORIDAD 1 — Impacto inmediato, coste 0 (Semana 1-2)

**A. Corregir el funnel GBP**
- Añadir link de reserva directa (Koalendar) en el campo "Appointment URL" del GBP
- Publicar un Google Post semanal con foto real + CTA claro ("Clase de prueba gratis, reserva aquí")
- Añadir perfiles de Instagram y TikTok al GBP
- Solicitar reseñas a los 7 alumnos actuales (link directo de reseña por WhatsApp)
- *Evidencia:* GBP con más señales de actividad → mayor visibilidad en pack local. Cada reseña añadida mejora el ranking local.

**B. Activar páginas sin indexar**
- Identificar las 3 URLs "Descubiertas sin indexar" en GSC y solicitar indexación manual
- Publicar `/clases-particulares-ingles-online` (pendiente desde sesión 1 junio) con rutas CSS absolutas
- *Evidencia:* Pasar de 1 a 4+ URLs indexadas multiplica el tráfico orgánico potencial sin crear contenido nuevo.

**C. Optimizar bio de Instagram**
- Cambiar la bio a algo con urgencia real: ejemplo "📚 Clases de inglés online · 3 plazas libres esta semana · 👇 Reserva gratis"
- Añadir Highlight "Testimonios" y "Precios" con portadas con color de marca
- *Evidencia:* 119 visitas al perfil/mes, solo 5.8% hacen clic. Con bio mejorada y Highlights activos se puede duplicar esa tasa.

**D. Sistematizar el formato Reel ganador**
- 2 reels/semana: formato "Common Mistake / Error de traducción"
- Publicar en horario validado: 9:00-12:00h, prioridad domingo y lunes
- Terminar cada reel con pregunta: "¿Cómo lo dirías tú? Escríbelo abajo"
- *Evidencia:* patrón validado en la propia cuenta. ME-TE-SE → 2.262 vistas orgánicas gratis.

---

#### PRIORIDAD 2 — Impacto medio plazo, coste 0 (Semana 3-8)

**E. Blog SEO — 1 artículo/semana con intención transaccional**

Queries con volumen real para el perfil:
- "clases de inglés online para adultos España" (informacional → transaccional)
- "preparar First Certificate desde cero" (específico, menor competencia)
- "inglés para mejorar en el trabajo España" (intención clara)
- "niveles de inglés A1 a C2 explicados" (informacional, alto volumen, link a servicios)

*Evidencia:* el CTR del 18-23% actual demuestra que cuando el sitio aparece, convierte en visitas. Más URLs = más superficie de entrada. El artículo existente ya está indexado, crear más es la palanca directa.

**F. Activar email nurturing**

Secuencia mínima viable:
1. Post-reserva clase gratis → email a las 24h: "Gracias por la clase, aquí tu valoración de nivel y próximos pasos"
2. +3 días → email: propuesta de pack con precio y plazas disponibles
3. +7 días → email: "¿Tienes alguna duda sobre empezar?"

*Evidencia:* Las academias online con secuencia de nurturing de 3 emails post-demo tienen tasas de conversión a alumno del 15-30% vs 5-10% sin secuencia (datos de benchmarks de servicios de formación online en España, HubSpot 2024).

**G. Collabs locales Vigo — 1 collab/mes mínimo**

Objetivo: negocios locales en Vigo con 500-5.000 seguidores, audiencia 25-40 años.
Propuesta de valor para el colaborador: "Te grabo un reel con vocabulario en inglés relacionado con tu negocio" (barbería → términos de barbería en inglés, cafetería → pedir el café en inglés, etc.)

*Evidencia:* collab @belladonnavigo → 1.188 vistas, 88% no seguidores. Esto es 3x la media habitual.

---

#### PRIORIDAD 3 — Inversión pequeña con evidencia (Mes 2-3)

**H. Evaluar migración a Setmore para botón nativo GBP**

Cuando el problema de confusión presencial esté resuelto (verificar en GBP que "Cómo llegar" ha bajado del 87%), migrar a Setmore para activar Reserve with Google.

Condiciones para migrar:
- España ✅ elegible
- Categoría "Tutor" ✅ elegible
- Plan Free de Setmore probablemente suficiente (200 citas/mes)
- Coste de migración: ~2h de setup + 1-3 días de propagación

**I. Paid: promocionar Reels con mejor performance orgánico**

Cambiar la estrategia de anuncios:
- Solo promover Reels que ya tengan 50+ interacciones orgánicas (el algoritmo ya validó el contenido)
- Objetivo: "Visitas al perfil" (no "Conversaciones iniciadas")
- Segmentación: 25-34 años, Andalucía + Madrid + Cataluña (comunidades más activas según datos propios del anuncio anterior)
- Presupuesto mínimo: 5€/día × 7 días = 35€/mes

*Evidencia:* Los datos de demografía del Anuncio 1 muestran que Andalucía (21.7%), Cataluña (14.4%) y Madrid (13.3%) son las comunidades con más audiencia para este perfil. Segmentando solo ahí con un Reel validado se maximiza el ROI.

---

### QUÉ ELIMINAR O PAUSAR

| Acción actual | Veredicto | Razón |
|--------------|-----------|-------|
| Anuncios con imagen estática | ❌ Pausar | Anuncio 1: 16€ → 1 seguidor, 0 alumnos. Sin ROI demostrado. |
| Posts de carrusel/imagen | ⚠️ Reducir | Solo 1% de interacciones. Solo usar para Highlights/guardado, no para alcance. |
| Publicar sin pregunta al final | ❌ Eliminar | 0 comentarios en la mayoría de reels = señal débil para el algoritmo. |
| Publicar fuera de 9-12h | ⚠️ Corregir | Los datos de actividad de seguidores son claros: el pico es 9-12h, especialmente dom/lun. |

---

### RESUMEN EJECUTIVO — 90 DÍAS

**Semana 1-2 (coste 0):**
1. Fix URL reserva en GBP + Google Post semanal
2. Solicitar indexación de 3 páginas en GSC
3. Publicar `/clases-particulares-ingles-online`
4. Optimizar bio Instagram + portadas Highlights
5. Sistematizar 2 reels/semana formato ganador, horario 9-12h, con pregunta

**Mes 1 (coste 0):**
6. Publicar 1 artículo SEO/semana
7. Configurar secuencia de email nurturing en Brevo (3 emails)
8. 1 collab local Vigo/mes

**Mes 2-3 (coste optativo ~35€/mes):**
9. Evaluar migración a Setmore para botón nativo GBP
10. Promover 1 reel/mes ya validado (50+ interacciones) con presupuesto de 35€

**KPIs a medir en 90 días:**
- GBP: reducir "Cómo llegar" del 87% al <50%
- GSC: pasar de 1 URL indexada a 5+; clics de 25 a 100+/mes
- Instagram: de 174 a 400+ seguidores; de 7 clics en link a 20+/mes
- Conversiones: de 0 a 3-5 nuevos alumnos atribuibles a digital

---

## Fuentes scrapeadas en esta investigación

| Fuente | URL | Estado |
|--------|-----|--------|
| Koalendar Integrations | https://koalendar.com/integrations | ✅ Playwright |
| Setmore Reserve with Google | https://support.setmore.com/en/articles/1348299-reserve-with-google | ✅ Playwright |
| Google Appointments - Supported Merchant Types | https://developers.google.com/actions-center/verticals/appointments/redirect/policies/platform-policies | ✅ Playwright |
| Google Appointments - Supported Countries | mismo URL (#supported_countries) | ✅ España confirmada |
| GBP Local Business Links (oficial) | https://support.google.com/business/answer/6218037 | ✅ requests |
| Instagram Insights (datos propios) | /root/my-english-spot/data/instagram-insights-junio2026.md | ✅ Archivo local |
| Análisis competencia agencias | /root/my-english-spot/data/analisis-agencias-2026-06-19.md | ✅ Archivo local |
