# GPW Website — Tareas Pendientes
**Generado:** 2026-03-26 | **Proyecto:** gpw-solutions.com | **Fase actual:** Phase 3 (Prototipos HTML)

---

## Resumen Rápido

| Categoría | Pendientes | Prioridad |
|-----------|-----------|-----------|
| SEO Técnico | 8 tareas | Alta |
| Accesibilidad (A11y) | 4 tareas | Alta |
| Performance | 3 tareas | Media |
| Contenido Faltante | 5 tareas | Media-Alta |
| Funcionalidad | 4 tareas | Media |
| Phase 3 — Copy | 3 páginas | Media |

---

## A — SEO Técnico (8 tareas)

### A1. Agregar Open Graph + Twitter Card meta tags — TODAS las páginas (19/19)
- **Prioridad:** Alta
- **Impacto:** Cuando alguien comparte el sitio en LinkedIn, Slack o Twitter, se ve un link genérico sin preview. Para B2B donde LinkedIn es canal #1 de procurement managers, esto es crítico.
- **Páginas afectadas:** Todas (19 páginas HTML)
- **Qué agregar en `<head>` de cada página:**
  ```html
  <meta property="og:type" content="website">
  <meta property="og:title" content="[Título de la página]">
  <meta property="og:description" content="[Meta description de la página]">
  <meta property="og:url" content="https://gpw-solutions.com/[ruta]">
  <meta property="og:image" content="https://gpw-solutions.com/img/og-[página].jpg">
  <meta property="og:site_name" content="Global Precision Works">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="[Título de la página]">
  <meta name="twitter:description" content="[Descripción corta]">
  <meta name="twitter:image" content="https://gpw-solutions.com/img/og-[página].jpg">
  ```
- **Dependencia:** Necesita imágenes OG (1200x630px) por página — se pueden generar con Canva
- **Esfuerzo estimado:** 30 min (tags) + 1-2 hrs (imágenes OG)

### A2. Agregar canonical tags — TODAS las páginas (19/19)
- **Prioridad:** Alta
- **Impacto:** Sin canonical, Google podría indexar versiones duplicadas (con/sin trailing slash, con parámetros UTM), diluyendo señales de ranking.
- **Qué agregar en `<head>` de cada página:**
  ```html
  <link rel="canonical" href="https://gpw-solutions.com/[ruta-canónica]/">
  ```
- **Ejemplo para EMS Home:** `<link rel="canonical" href="https://gpw-solutions.com/ems/">`
- **Esfuerzo estimado:** 15 min

### A3. Agregar Schema JSON-LD a Corporate Home y EMS Home ✅ HECHO
- **Estado:** Corporate Home tiene Organization schema. EMS Home tiene FAQPage schema.

### A4. Crear robots.txt ✅ HECHO
- **Estado:** `robots.txt` creado con reglas para AI bots (GPTBot, ChatGPT-User, ClaudeBot, Google-Extended, PerplexityBot) + sitemap reference.

### A5. Crear sitemap.xml ✅ HECHO
- **Estado:** `sitemap.xml` con 21 URLs (18 páginas + privacy + terms + services hub), lastmod, changefreq y priority.

### A6. Corregir title tag del EMS Home ✅ HECHO
- **Estado:** Título actual "Electromechanical Assembly Services Mexico | GPW Monterrey" (58 chars, dentro del límite).

### A7. Corregir meta description del EMS Home ✅ HECHO
- **Estado:** Meta description actual de 152 chars, dentro del límite.

### A8. Renombrar archivos con espacios en el nombre
- **Prioridad:** Media
- **Impacto:** Los espacios en URLs causan problemas de encoding en algunos servidores y CDNs. El favicon "isotipo naranja.png" tiene espacio, y los logos "LOGO - 28.png" y "LOGO - 1 .png" tienen espacios y un espacio extra antes de la extensión.
- **Archivos afectados:**
  - `img/isotipo naranja.png` → `img/isotipo-naranja.png` (o `favicon.png`)
  - `img/LOGO - 28.png` → `img/logo-white.png`
  - `img/LOGO - 1 .png` → `img/logo-teal.png`
- **Requiere:** Actualizar TODAS las referencias en las 19 páginas HTML
- **Esfuerzo estimado:** 20 min

---

## B — Accesibilidad / A11y (4 tareas)

### B1. Agregar focus states para navegación por teclado ✅ HECHO
- **Estado:** `:focus-visible` con outline Coral implementado en `styles.css` para links, botones y nav.

### B2. Agregar `prefers-reduced-motion` media query ✅ HECHO
- **Estado:** Media query implementada en `styles.css` — reduce animations/transitions a 0.01ms.

### B3. Corregir contraste de texto bajo ✅ HECHO
- **Estado:** Opacidades corregidas — `.breadcrumb__link` a 0.7, `.footer__heading` a 0.6, `.cta__reassurance` a 0.65.

### B4. Agregar `aria-label` a industry cards ✅ HECHO
- **Estado:** 16 aria-labels agregados (8 en `index.html` + 8 en `ems/index.html`). Patrón: "[Industry Title] — Learn more".

---

## C — Performance (3 tareas)

### C1. Mover CSS inline a archivos externos
- **Prioridad:** Media
- **Impacto:** Ambas homes tienen bloques `<style>` inline de 400-500 líneas (~13KB cada uno). Este CSS se descarga en cada page load y no se puede cachear como archivo CSS externo.
- **Archivos afectados:**
  - `05-website/ems/index.html` → extraer a `css/ems-home.css`
  - `05-website/index.html` → extraer a `css/corporate-home.css`
- **Esfuerzo estimado:** 20 min

### C2. Agregar `loading="lazy"` a imágenes below the fold
- **Prioridad:** Baja
- **Impacto:** Ninguna imagen usa lazy loading. Las imágenes below the fold (mapa SVG, logos en footer) se cargan inmediatamente, ralentizando el initial paint.
- **Archivos:** Todas las páginas
- **Esfuerzo estimado:** 10 min

### C3. Preload fuente principal (Lato)
- **Prioridad:** Baja
- **Impacto:** Google Fonts stylesheet bloquea rendering. Precargar el peso principal reduce FOIT.
- **Qué agregar:**
  ```html
  <link rel="preload" href="https://fonts.gstatic.com/s/lato/v24/S6uyw4BMUTPHjx4wXg.woff2" as="font" type="font/woff2" crossorigin>
  ```
- **Esfuerzo estimado:** 5 min por página

---

## D — Contenido Faltante (5 tareas)

### D1. Crear imágenes OG para social sharing (19 imágenes)
- **Prioridad:** Alta (bloquea tarea A1)
- **Impacto:** Sin imágenes OG, los tags de Open Graph no tienen imagen que mostrar. Formato: 1200x630px, JPG.
- **Herramienta sugerida:** Canva (ya conectado como MCP)
- **Esfuerzo estimado:** 2-3 hrs con plantilla

### D2. Agregar fotografías reales de contenido
- **Prioridad:** Media-Alta
- **Impacto:** El EMS Home tiene CERO imágenes de contenido (solo logos). Google usa imágenes como señal de calidad, y Google Images es fuente de tráfico. Además, el sitio se ve incompleto sin fotos.
- **Imágenes necesarias:**
  - 5 imágenes de servicios (box build, cable harness, system integration, testing, enclosures)
  - 8 imágenes de industrias (AI/servers, industrial, telecom, medical, auto, energy, aerospace, appliances)
  - Hero images para ambas homes
  - Cada imagen necesita alt text descriptivo con keywords
- **Fuente:** Stock photography profesional o sesión fotográfica de la planta
- **Esfuerzo estimado:** Variable (depende de la fuente)

### D3. Crear privacy-policy.html y terms.html — ✅ COMPLETADO 2026-03-26
- **Estado:** Páginas creadas con contenido placeholder profesional. Links del footer ya funcionan.
- **⚠️ PENDIENTE FUTURO:** Antes del launch, revisar y actualizar con abogado cuando se definan: qué analytics se usan (Google Analytics / Tag Manager), qué cookies de terceros hay, si se usa reCAPTCHA, si hay integraciones con CRM, y cualquier requisito legal específico de México/EE.UU. para B2B.

### D4. Comparison Pages — Phase 3 Copy (3 páginas pendientes)
- **Prioridad:** Media
- **Impacto:** Estas páginas son parte del plan de contenido de Phase 3. Son páginas BOFU (bottom of funnel) que ayudan a cerrar la venta.
- **Páginas:**
  1. Nearshore vs Offshore Manufacturing
  2. Mid-Market vs Mega-EMS Providers
  3. Agile vs Traditional EMS
- **Ubicación de copy:** `04-copy/`
- **Esfuerzo estimado:** 2-3 hrs por página

### D5. Agregar múltiples tamaños de favicon
- **Prioridad:** Baja
- **Impacto:** Solo hay un favicon PNG. Faltan tamaños para diferentes dispositivos.
- **Agregar:**
  ```html
  <link rel="icon" type="image/png" sizes="32x32" href="../img/favicon-32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="../img/favicon-16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="../img/apple-touch-icon.png">
  ```
- **Esfuerzo estimado:** 15 min (generar tamaños + actualizar HTML)

---

## E — Funcionalidad (4 tareas)

### E1. Configurar backend del formulario RFQ
- **Prioridad:** Alta (para launch)
- **Impacto:** El formulario de Request a Quote actualmente no tiene backend. Los envíos no llegan a ningún lado.
- **Opciones:** Formspree, Netlify Forms, custom endpoint
- **Esfuerzo estimado:** 1-2 hrs

### E2. Agregar reCAPTCHA al formulario RFQ
- **Prioridad:** Alta (para launch)
- **Impacto:** Sin CAPTCHA, el formulario recibirá spam inmediatamente después del launch.
- **Dependencia:** Requiere E1 (backend del form)
- **Esfuerzo estimado:** 30 min

### E3. Implementar cookies banner / consent ✅ HECHO
- **Prioridad:** Media (para launch)
- **Impacto:** Si se usan analytics o cookies de terceros, se necesita un banner de consentimiento.
- **Esfuerzo estimado:** 1 hr
- **Implementado:** `js/cookie-consent.js` — Banner fijo al fondo, Accept (Coral) / Decline (outline), localStorage persistence. API pública `gpwCookieConsent()` para que GA4 u otros scripts consulten el consentimiento. Agregado a las 20 páginas HTML. Pendiente: conectar con GA4 cuando se configure (E4).

### E4. Configurar Google Analytics / Tag Manager
- **Prioridad:** Alta (para launch)
- **Impacto:** Sin analytics no se puede medir nada — tráfico, conversiones, RFQs, bounce rate.
- **Esfuerzo estimado:** 30 min (setup básico)

---

## F — Auditoría Lighthouse (pendiente)

### F1. Correr Lighthouse audit completo
- **Prioridad:** Media
- **Impacto:** Da un baseline medible de Performance, Accessibility, Best Practices, y SEO score. Revela problemas ocultos que no se ven en revisión manual.
- **Herramienta:** Chrome DevTools (ya conectado como MCP)
- **Páginas a auditar:** Corporate Home + EMS Home como mínimo
- **Esfuerzo estimado:** 15 min

---

## G — Análisis Competitivo SEO (pendiente)

### G1. Análisis competitivo SEO vs competidores directos
- **Prioridad:** Media-Alta (para Phase 5)
- **Impacto:** Comparar GPW vs NEO Tech, Tacna Services, PCBA Electronics, etc. Identificar keywords donde rankean, gaps de contenido, oportunidades de backlinks.
- **Herramienta:** SearchFit SEO Competitor Analyzer (disponible como skill)
- **Esfuerzo estimado:** 30 min

---

## Orden Recomendado de Ejecución

### Bloque 1 — Quick wins SEO (se pueden hacer ahora, ~1 hr total)
1. A2 — Canonical tags (15 min)
2. A6 — Fix title tag EMS Home (2 min)
3. A7 — Fix meta description EMS Home (2 min)
4. A3 — Schema JSON-LD en 2 homes (20 min)
5. A4 — robots.txt (5 min)
6. A5 — sitemap.xml (15 min)

### Bloque 2 — Accesibilidad (se pueden hacer ahora, ~25 min total)
7. B1 — Focus states (10 min)
8. B2 — prefers-reduced-motion (5 min)
9. B3 — Corregir contraste (10 min)

### Bloque 3 — SEO Social
10. ✅ A1 — OG + Twitter Card tags agregados (18 páginas) — 2026-03-26
11. ⏳ D1 — **PENDIENTE: Crear 18 imágenes OG en Canva** (1200x630px, JPG) y colocarlas en `/img/og/`. Nombres: `corporate-home.jpg`, `ems-home.jpg`, `about-ems.jpg`, `request-quote.jpg`, `services-hub.jpg`, `box-build.jpg`, `cable-harness.jpg`, `system-integration.jpg`, `testing-inspection.jpg`, `enclosure-cabinet.jpg`, `ai-server-rack.jpg`, `industrial-equipment.jpg`, `telecom-hardware.jpg`, `medical-devices.jpg`, `automotive.jpg`, `energy.jpg`, `aerospace.jpg`, `appliances.jpg`

### Bloque 4 — Cleanup técnico (COMPLETADO 2026-03-26)
12. ✅ A8 — Archivos renombrados: `favicon.png`, `logo-white.png`, `logo-teal.png` + 18 páginas actualizadas
13. ✅ C1 — CSS inline extraído a `css/corporate-home.css` y `css/ems-home.css`
14. ✅ C2 — `loading="lazy"` en 20 imágenes below the fold (footer logos + map SVG)
15. ✅ C3 — Preload Lato font (woff2) en 18 páginas

### Bloque 5 — Contenido
15. D2 — Fotografías reales
16. D3 — Privacy policy + Terms
17. D4 — 3 Comparison pages

### Bloque 6 — Pre-launch
18. E1 — Backend RFQ form
19. E2 — reCAPTCHA
20. E3 — Cookies banner
21. E4 — Google Analytics

### Bloque 7 — Diagnóstico
22. F1 — Lighthouse audit
23. G1 — Competitive SEO analysis

---

*Este documento se puede importar a Notion como lista de tareas cuando la integración esté configurada.*
