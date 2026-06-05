# Prompts para Claude Code — Rediseño de Industry Pages

Copia y pega estos prompts en Claude Code en orden. Cada prompt aborda una sección específica. Adapta el nombre de la industria según la página que estés trabajando.

---

## PROMPT 0: Contexto Inicial (pegar SIEMPRE al inicio de la sesión)

```
Estoy construyendo las industry pages para GPW (Global Precision Works), una empresa de ensamble electromecánico en Monterrey, México. El sitio es B2B, dirigido a procurement directors de OEMs en Estados Unidos.

Brand identity:
- Teal #23555A (primary)
- Coral #ED835E (CTA/accent)
- Deep Blue #2A4E64 (secondary)
- Lime #ADCF91 (highlights/accents)
- Font principal: Lato (headlines, body, nav, todo)
- Font decorativo: Trirong (serif) — SOLO para acentos pequeños: un tagline, un label decorativo, un pull quote. NUNCA como font de headlines.

El problema actual: las industry pages son muros de texto. El copy es extenso (~3,000 palabras por página) y eso es intencional para SEO, pero necesita presentarse con diseño visual que lo haga digerible, no como un documento pegado en un div.

Principios de diseño:
1. Alternar fondos entre secciones (blanco → off-white #F7F8F6 → teal oscuro → blanco) para crear ritmo visual
2. Nunca más de 2 párrafos consecutivos sin un break visual (card, stat, icono, imagen, columna, divider)
3. Max-width del texto: 720px para legibilidad — pero las secciones usan el full width con layouts de 2 columnas
4. Los CTAs coral son el elemento visual más llamativo de cada sección
5. Mantener el sidebar nav de secciones (Overview, Definition, Capabilities, etc.) — funciona bien para páginas largas
```

---

## PROMPT 1: Rediseño del Hero

```
Rediseña la sección hero de la industry page. El problema actual: tiene 4 párrafos largos sobre fondo oscuro = muro de texto.

Cambios específicos:
- REDUCIR el texto visible del hero a: headline + subheadline (1 oración) + CTA button. Nada más.
- Los 3 párrafos de copy del hero actual muévelos ABAJO del hero como una sección "Overview" con fondo blanco
- Layout del hero: texto a la izquierda (60%), área visual a la derecha (40%) — puede ser un bloque geométrico abstracto con los colores de marca, un placeholder para foto, o un grid de stats
- Agregar 3 stats pequeños debajo del headline dentro del hero: "8 Industries", "2hr from Border", "48hr RFQ Response"
- El eyebrow label (ej: "INDUSTRIAL EQUIPMENT ASSEMBLY") en color lime con una línea a la izquierda, funciona bien — mantenerlo
- Fondo: gradiente teal oscuro → deep blue, no flat color
- El CTA button coral debe ser prominente con hover effect
- Trust signals debajo del CTA en texto pequeño: "USMCA-compliant · ISO 9001 in progress · Monterrey, NL"
```

---

## PROMPT 2: Sección Overview (texto que salió del hero)

```
Crea una sección "Overview" inmediatamente después del hero. Esta sección contiene los 3 párrafos de texto que ANTES estaban en el hero.

Diseño:
- Fondo blanco
- Layout: texto en columna central (max-width 720px)
- PERO: extraer una frase clave del texto y convertirla en un "pull quote" con borde izquierdo lime, font Trirong italic, tamaño más grande — esto rompe la monotonía visual
- Después de los 3 párrafos, agregar el CTA coral como botón centrado: "Request a Quote for [Industry] Assembly →"
- Separador lime sutil al final de la sección
```

---

## PROMPT 3: Definition Block (AI-extractable)

```
La sección "What Is [Industry] Assembly?" tiene un definition block largo. Es importante para AI SEO así que no cortes el texto, pero mejora la presentación:

- Fondo: off-white (#F7F8F6)
- El definition block: fondo blanco, borde izquierdo 3px lime, padding generoso, border-radius en las esquinas derechas, sombra sutil
- Agregar un icono o badge pequeño arriba del bloque que diga "DEFINITION" en estilo label
- El texto dentro del bloque mantiene la fuente normal pero con line-height generoso (1.75)
- Después del definition block, dejar espacio visual (80px+) antes de la siguiente sección
```

---

## PROMPT 4: Industry Context — Romper el muro de texto

```
La sección "Industry Context" es la más problemática — son 4+ párrafos de puro texto. Rediseñala así:

- Fondo: blanco
- Layout de 2 columnas para el contenido principal:
  - Columna izquierda (55%): los primeros 2 párrafos de texto
  - Columna derecha (45%): un bloque destacado con fondo teal claro que contenga 2-3 datos clave del industry context como stats (ej: para Industrial Equipment: "PLC + sensor integration in single assembly", "Domestic assembly costs continue to rise", "Communication gaps offshore = quality variability"). Presentar como lista con iconos o como mini-cards
- Los últimos 1-2 párrafos van debajo en full-width con un pull quote de Trirong italic intercalado
- El último párrafo (siempre es el "GPW was built for this type of work...") destacarlo en un box con fondo lime-muted como cierre de sección
```

---

## PROMPT 5: Capabilities — Cards en vez de solo accordions

```
La sección Capabilities tiene accordions que están OK pero se ven planos. Mejora así:

- Fondo: off-white
- ANTES de los accordions: agregar una fila de 3-4 "capability cards" compactas que resuman las capabilities principales — icono + título + 1 línea. Funcionan como visual overview antes de entrar al detalle
- Los accordions se mantienen DEBAJO de las cards para el detalle completo
- Cada card: fondo blanco, borde superior de 3px (alternar entre teal, coral, deep-blue, lime), hover con sombra sutil y translateY(-3px)
- Dentro de cada accordion expandido: agregar bullet points con dots lime en vez de texto corrido
- Al final de la sección: link texto "See all GPW services →" apuntando al services hub
```

---

## PROMPT 6: Typical Projects — Visual storytelling

```
La sección "Typical Projects" describe 2-3 proyectos ejemplo. Rediseñala como storytelling visual:

- Fondo: teal oscuro (#1a4145) — cambio dramático de fondo para crear contraste
- Cada proyecto: card horizontal con fondo semi-transparente (rgba blanco 0.04), borde sutil
- Layout de cada card: número grande a la izquierda ("01", "02", "03") en font Lato black, color lime opacity 0.3, tamaño 4rem. Contenido a la derecha.
- Dentro de cada card: título del proyecto en blanco, descripción en texto claro, y abajo los "Services used" como pills/tags con borde (ej: "Box Build" "Testing & QA")
- Los service tags deben ser clickeables (links a las service pages)
- Stagger animation al hacer scroll (cada card aparece con delay)
```

---

## PROMPT 7: Nearshore Advantage — Stats prominentes

```
La sección Nearshore para esta industry page. Diseño:

- Fondo: blanco
- Layout: texto introductorio arriba (max 2 párrafos, max-width 640px)
- Debajo: grid de 4 stat cards en una fila
  - Cada stat: número grande (Lato Black, 2.5rem, color teal), label pequeño debajo, descripción de 1 línea
  - Stats: "2 hrs from border", "CST timezone", "40-60% cost savings", "USMCA compliant"
  - Cards con fondo off-white, hover con borde lime
- Los párrafos restantes de nearshore advantage van debajo de los stats en 2 columnas
- CTA teal al final: "Get a Cost Comparison →"
```

---

## PROMPT 8: Quality & Compliance — Trust signals

```
La sección Quality & Compliance necesita transmitir confianza visual:

- Fondo: off-white
- Los bullets de certificaciones/estándares: presentarlos como una fila horizontal de "badge cards" — cada uno con icono, nombre del estándar, y status (ej: "ISO 9001 — In Progress", "IPC-A-620 — Workmanship Standard")
- Las badges con borde y fondo blanco, icono teal a la izquierda
- El texto de proceso (documentación, traceability, etc.) va en 2 columnas debajo de las badges
- IMPORTANTE: nunca exagerar certificaciones. Los status deben reflejar exactamente lo que dice el copy ("pursuing", "in progress", "awareness")
```

---

## PROMPT 9: FAQ — Accordions limpios

```
Sección FAQ. El diseño actual de accordions probablemente está OK, pero mejora:

- Fondo: blanco
- Cada pregunta: fondo off-white cuando está cerrada, fondo blanco con borde izquierdo coral cuando está abierta
- Icono de + / - a la derecha, color teal
- Transición suave al abrir/cerrar (max-height transition)
- Agregar schema markup FAQPage en el HTML (JSON-LD en un script tag)
- Después de las FAQs: un texto pequeño "Have a specific question? Talk to our engineering team →" con link al contact
```

---

## PROMPT 10: CTA Final

```
Sección final CTA. Diseño:

- Fondo: gradiente teal → deep blue (mismo estilo que el hero pero más compacto)
- Centrado: headline + 1 párrafo + 2 botones (coral primary, outline secondary)
- Texto de reassurance debajo de los botones en font pequeño, color blanco al 40%: "No minimum order · Pilot builds available · We speak your language"
- Elemento decorativo: círculo geométrico grande semi-transparente centrado detrás del texto
- Padding generoso (100px top/bottom)
```

---

## PROMPT 11: Ajustes globales de spacing y ritmo

```
Revisa toda la página y ajusta:

1. Padding entre secciones: mínimo 100px top y bottom en desktop, 60px en mobile
2. Los headings H2 de cada sección: Lato Black (font-weight 900), tamaño clamp(2rem, 3.5vw, 2.75rem), color teal dark
3. Cada sección debe tener un "section label" arriba del H2: texto uppercase, letra espaciada, color coral, con una línea corta a la izquierda
4. Line-height del body text: 1.7 mínimo
5. Max-width del body text: 720px (pero los layouts de cards/stats usan el full container width)
6. Asegura que NINGUNA sección tenga más de 2 párrafos consecutivos sin un elemento visual entre ellos
7. El sidebar nav de la izquierda: position sticky, top 100px, solo visible en desktop (>1100px)
8. Mobile: todo a 1 columna, sidebar nav se convierte en un dropdown o scroll horizontal
```

---

## PROMPT EXTRA: Para aplicar a TODAS las industry pages

```
Este diseño es un template. Una vez que la página de Industrial Equipment se vea bien, aplica el mismo diseño a las otras 7 industry pages:

1. AI & Server Rack Assembly
2. Telecom Hardware Assembly
3. Medical Devices & Equipment Assembly
4. Automotive Sub-Assembly
5. Energy Sector Equipment Assembly
6. Aerospace Sub-Assemblies
7. Appliances & White Goods Assembly

El layout es idéntico — solo cambia el contenido (copy, stats específicos, certificaciones). Mantén el mismo sistema de diseño para todas.
```

---

## Notas para ti (Enrique)

- **Orden recomendado:** Prompt 0 → 1 → 11 (globals) → 2 a 10 sección por sección
- **Iteración:** Después de cada prompt, revisa el resultado en el browser. Si algo no te gusta, dile a Claude Code qué cambiar antes de pasar al siguiente prompt.
- **Imágenes:** Los prompts dejan espacios para fotos. Por ahora usa placeholders grises. Después se reemplazan con fotos reales de la planta.
- **El sidebar nav que ya tienes** (Overview, Definition, Industry Context, etc.) es bueno — estos prompts lo mantienen.
- **No cortes copy para hacer la página más corta.** El copy está diseñado para SEO. El diseño se encarga de hacerlo digerible.
