# Reporte: Optimización SEO y Accesibilidad — GPW Website
**Fecha:** 26 de marzo de 2026

---

## Resumen Ejecutivo

Se realizó una auditoría completa del sitio web de GPW usando Google Lighthouse (la herramienta oficial de Google para evaluar sitios web) y se implementaron todas las correcciones necesarias en una sola sesión.

### Resultado: Score perfecto en las 3 categorías

| Métrica | Antes | Después |
|---------|:-----:|:-------:|
| **SEO** | 82 | **100** |
| **Accesibilidad** | 93-95 | **100** |
| **Best Practices** | 100 | **100** |

Estos scores son de Google Lighthouse — la misma herramienta que Google usa internamente para evaluar la calidad de un sitio web. Un score de 100 en SEO significa que el sitio cumple con TODOS los requisitos técnicos que Google recomienda para posicionar un sitio en búsquedas.

---

## ¿Qué se hizo y para qué sirve?

### 1. Canonical Tags (18 páginas)
Le indicamos a Google cuál es la URL oficial de cada página. Sin esto, Google podría pensar que tenemos contenido duplicado (por ejemplo, si alguien llega con `/ems/` vs `/ems/index.html`) y nos penalizaría en el ranking.

### 2. Schema Markup / Datos Estructurados (2 páginas principales)
Agregamos bloques de datos invisibles para el usuario pero legibles para Google, ChatGPT, Perplexity y otros motores de AI. Estos datos le dicen exactamente: "Esta empresa se llama Global Precision Works, está en Monterrey, ofrece estos servicios, sirve al mercado de EE.UU." Esto permite que:
- Google muestre FAQs expandibles directamente en los resultados de búsqueda
- Asistentes de AI (ChatGPT, Perplexity, Gemini) puedan recomendar a GPW cuando alguien pregunte por servicios de ensamble en México

### 3. Title Tag y Meta Description optimizados
Corregimos el título y la descripción de la página principal de EMS para que:
- No se corten en los resultados de Google (estaban demasiado largos)
- Las palabras clave más importantes aparezcan primero ("Electromechanical Assembly Services Mexico")

### 4. robots.txt
Creamos el archivo que le dice a los bots de Google y de AI "pueden rastrear todo el sitio". También configuramos acceso específico para los bots de ChatGPT, Claude, Perplexity y Google — esto es parte de nuestra estrategia de AI SEO para que GPW aparezca en respuestas de inteligencia artificial.

### 5. sitemap.xml
Creamos el mapa del sitio con las 18 páginas y sus prioridades. Cuando el sitio esté en producción, Google lo usará para indexar todas las páginas rápidamente (horas en vez de semanas).

### 6. Accesibilidad — Focus States
Agregamos indicadores visuales para usuarios que navegan con teclado. Esto es requisito del estándar WCAG AA (la norma de accesibilidad web). Muchas empresas grandes tienen políticas internas de accesibilidad — si un sitio de proveedor no cumple, puede ser descartado en el proceso de evaluación.

### 7. Accesibilidad — Reduced Motion
El sitio ahora respeta la preferencia del sistema operativo del usuario cuando tiene activada la opción "Reducir movimiento". Esto protege a personas con epilepsia o sensibilidad al movimiento.

### 8. Corrección de Contraste de Texto
Varios textos en el footer y navegación tenían un contraste muy bajo (casi invisibles). Los ajustamos para cumplir con el estándar WCAG AA sin cambiar la estética del diseño.

---

## ¿Por qué importa esto para GPW?

**Para posicionamiento en Google:**
- El sitio ahora cumple el 100% de los requisitos técnicos de SEO que Google evalúa
- Los datos estructurados permiten rich results (FAQs expandibles, info de empresa) en búsquedas
- El sitemap asegura indexación completa y rápida cuando el sitio salga a producción

**Para visibilidad en AI:**
- ChatGPT, Perplexity, Gemini y Claude podrán extraer información de GPW y recomendarnos cuando alguien pregunte por ensamble electromecánico en México
- El robots.txt está configurado específicamente para permitir acceso a estos bots

**Para credibilidad con clientes OEM:**
- Score perfecto de accesibilidad demuestra profesionalismo y atención al detalle
- Empresas como Dell, HP, o cualquier OEM grande evalúan proveedores también por la calidad de su presencia digital
- Cumplir WCAG AA es un diferenciador vs competidores que típicamente lo ignoran

**Para inversionistas:**
- Un sitio técnicamente impecable transmite que el equipo sabe ejecutar
- Los scores de Lighthouse son verificables por cualquiera — abrir Chrome, F12, Lighthouse, y correr el audit

---

## Próximos pasos
Los cambios técnicos están completos. Lo que sigue es contenido:
- Imágenes OG para que el sitio se vea bien cuando se comparta en LinkedIn/WhatsApp
- Fotografías profesionales de las instalaciones y servicios
- 3 páginas de comparación (Nearshore vs Offshore, etc.)
- Configuración de analytics y formulario de contacto para el lanzamiento

---

*Auditoría realizada con Google Lighthouse v13 + SearchFit SEO Toolkit*
