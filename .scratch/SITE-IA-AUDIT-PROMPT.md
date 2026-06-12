# Prompt — Auditoría completa de IA (arquitectura de información) del sitio GPW

> Pegar esto en una sesión NUEVA de Claude Code, desde la raíz del proyecto GLOBAL PRECISION WORKS.
> Objetivo de esa sesión: auditar, NO cambiar nada todavía.

---

Quiero una auditoría EXHAUSTIVA y al 100% de la arquitectura de información del sitio web. NO cambies nada todavía — esta sesión es solo auditar y proponer; las decisiones (borrar / mover / re-enlazar / quitar redirects) las tomo yo después de ver el informe.

## Contexto
- Sitio estático en `08_Pagina Web/05-website/` (HTML con `<style>` inline + `css/*.css`; `.htaccess` maneja los redirects en producción; deploy por cPanel).
- Trabajo **LOCAL únicamente**: deploy en HOLD. **NO git push, NO deploy, no toques git.** Server local de prueba: `python -m http.server 8181` desde `05-website/` (http://localhost:8181/).
- El sitio es **UNA marca unificada**: CNC Machining (Contract Manufacturing) + EMS Assembly, bajo `gpw-solutions.com`, con `/industries/` compartido y RFQ unificado (`/request-a-quote/`). El historial del restructure está en `.scratch/unified-site-architecture-cm-build/` (PRD + issues #01–#19).
- Lee primero los 2 CLAUDE.md (raíz del proyecto y `08_Pagina Web/CLAUDE.md`) y la memoria (hay una nota "Site IA review (pending)").
- La web tiene poca visibilidad/tráfico todavía, así que **está OK proponer cambiar links y eliminar redirects** para dejar URLs canónicas limpias (el archivo viviendo directamente en su URL final, sin cadenas de redirect). No me importa "empezar de cero" con algunos links con tal de que quede 100% limpio.

## El síntoma que disparó esto
Hay páginas que existen pero no tienen acceso real desde el menú, y breadcrumbs que prometen un nivel inalcanzable. Ejemplo concreto: entras a `/ems/services/cable-harness-assembly.html` y el breadcrumb dice **GPW Corporate / EMS Assembly / Services / Cable & Harness**, pero "Services" (`/ems/services/`) probablemente no está en el menú — pasaste por una sección a la que no puedes llegar a propósito. Verifica esto y todos los casos parecidos. También sospecho que hay páginas hechas y olvidadas que conviene borrar por limpieza.

## Meta final (después de la auditoría)
0 páginas huérfanas, 0 niveles de breadcrumb inalcanzables, el mínimo de redirects posible, y links internos correctos (apuntando al destino canónico directo) en TODAS las páginas.

## Qué entregar — tabla maestra de inventario
Una fila por página real (`.html` y `.php`), con columnas:
- Ruta del archivo + URL pública.
- **Estado**: Viva+Enlazada / Viva+Huérfana / Redirigida (el archivo aún existe) / Solo-redirect / Dev-Preview / Placeholder.
- ¿En el menú header? ¿En mega-menú/dropdown? ¿En el footer?
- # de enlaces entrantes desde páginas vivas (y desde cuáles).
- Redirect entrante/saliente en `.htaccess` (origen→destino).
- ¿En `sitemap.xml`? ¿Bloqueada en `robots.txt`?
- Breadcrumb que muestra vs. reachability real (¿algún nivel del breadcrumb NO se alcanza desde el menú?).
- Propósito en 1 línea.

## Pasos (sé exhaustivo)
1. Enumera TODOS los `.html`/`.php` bajo `05-website/`, separando: (a) páginas reales del sitio, (b) artefactos de desarrollo (`nav-preview.html`, `refresh-preview*.html`, `screenshot-review.html`, etc.), (c) backups bajo `.scratch/` (NO son páginas del sitio). Reporta los tres grupos.
2. Extrae la estructura de navegación real: header nav + dropdowns/mega-menús + footer (en las plantillas). Lista qué URLs son alcanzables desde el menú.
3. Crawl de enlaces internos: recolecta todos los `<a href>` de cada página viva → grafo de enlaces entrantes. Marca huérfanas (0 entrantes).
4. Parsea TODO el `.htaccess`: cada RewriteRule (origen→destino, código). Detecta: redirects cuyo archivo origen aún existe, cadenas de redirect (A→B→C), y redirects a páginas que a su vez redirigen.
5. Cruza `sitemap.xml` y `robots.txt`: URLs en sitemap que redirigen o dan 404; páginas vivas que faltan en el sitemap.
6. Reachability vs breadcrumbs: por cada página compara su breadcrumb con lo que el menú permite alcanzar. Marca cada nivel de breadcrumb inalcanzable (empezando por `/ems/services/`).
7. Links rotos: cualquier `href` interno que apunte a un archivo inexistente (404) o a una URL que redirige (debería apuntar al destino canónico directo). Lista todos.
8. Verifica en el navegador con el server local (`:8181`): recorre el menú y confirma qué alcanza un usuario real. **CAVEAT importante**: `python -m http.server` NO procesa `.htaccess`, así que el comportamiento de los redirects se infiere LEYENDO `.htaccess`, no navegando local.

## Entregable (guardar como `.md` en `05-website/docs/` o `.scratch/`; ofrecer `.docx`)
- **A)** Tabla maestra de inventario (todas las páginas, todas las columnas de arriba).
- **B)** Hallazgos agrupados por tipo de problema, con los archivos exactos: huérfanas, páginas olvidadas/muertas, duplicados (ej. `ems/about.html` vs `/about.html`), links internos rotos o que apuntan a URLs redirigidas, niveles de breadcrumb inalcanzables, redirects sobrantes/encadenados, patrones de URL inconsistentes.
- **C)** IA propuesta: un árbol/sitemap limpio con la acción recomendada por página — conservar / borrar / quitar-redirect (mover el archivo a su URL canónica) / mover / arreglar-links. Apunta a URLs canónicas directas con el mínimo de redirects.
- **D)** Decisiones abiertas para mí (donde haya ambigüedad), para resolverlas antes de ejecutar.

## Reglas
- **Solo auditar + proponer en esta sesión. NO borres, muevas ni reescribas nada hasta que yo apruebe.**
- Local only. NO git push / deploy.
- En la futura fase de cambios: backup antes de tocar; reescribir links internos a destinos canónicos; quitar redirects que ya no hagan falta.
- Comunícate conmigo en español; el informe interno puede ir en español.

Empieza confirmando el plan de auditoría y luego ejecútala completa.
