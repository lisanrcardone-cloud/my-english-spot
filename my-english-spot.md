# My English Spot — Log de sesiones

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

### Checklist pendiente

#### 🔴 Urgente — Google Business Profile (`business.google.com`)

- ✅ 1. Activar atributo "Presta servicios online" — hecho 1 jun
- ✅ 2. Eliminar dirección física → cambiar a Área de servicio: **España** — hecho 1 jun
- ✅ 3. Cambiar categoría principal a **"Tutor privado"** — hecho 1 jun
- ✅ 4. Actualizar descripción — hecho 1 jun
- ✅ 5. Publicar Post en GBP con oferta de clase de prueba gratuita — hecho 1 jun
- [ ] 6. Pedir reseñas a alumnos (link directo desde GBP → "Pedir reseñas")

#### 🟡 Próximas sesiones — Claude Code

- [ ] 7. Crear página `/clases-particulares-ingles-online` (creada, pendiente fix CSS móvil)
- [ ] 8. Crear página `/clases-ingles-online-adultos`
- [ ] 9. Crear página `/clases-ingles-vigo` (captura local → explica que es online)
- [ ] 10. Auditoría PageSpeed móvil (identificar por qué CTR móvil es 10pp menor)

#### 🟢 Medio plazo

- [ ] 11. Exportar CSVs de Search Console a 90 días (datos actuales: solo 13 días)
- [ ] 12. Conectar GA4 para medir conversiones web
- [ ] 13. Blog SEO — artículos para queries informacionales ("inglés online para adultos", etc.)
- [ ] 14. Decidir arquitectura web: sitio estático actual vs CMS (para escalar contenido SEO)
