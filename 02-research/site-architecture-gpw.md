# Site Architecture — GPW Solutions (gpw-solutions.com)

*Phase 1.3 Deliverable — March 2026*
*Based on: Keyword Research, Competitive Analysis, Product Marketing Context*

---

## 1. Architecture Overview

**Site type:** B2B Industrial Services — Hybrid (Corporate + Two Divisions)
**Depth:** 3 levels max (3-click rule compliant)
**Total pages planned:** 31 pages (19 EMS priority + 3 corporate + 1 contract mfg placeholder + 7 blog/resources + 3 comparison pages — phased rollout)
**Primary audience:** U.S. OEM procurement/supply chain decision-makers
**Primary goal:** RFQ submissions (Request for Quote)
**Secondary goal:** Organic SEO traffic for nearshoring and assembly keywords

### Decision: URL Structure for EMS Division

After analyzing competitors and keywords, I'm using `/electromechanical-assembly/` instead of `/ems/` because:

1. **SEO value** — "electromechanical assembly" is a target keyword (100-300 mo, low competition). The URL itself carries ranking weight.
2. **Clarity** — A procurement manager instantly understands what GPW does. "EMS" is ambiguous (could be Emergency Medical Services in search).
3. **Competitive gap** — NEOTech is the only competitor with "electromechanical" in their positioning. GPW owns it in the URL structure too.
4. **Keyword alignment** — Maps directly to "electromechanical assembly services" (P1 keyword).

Contract Manufacturing stays at `/contract-manufacturing/` (placeholder, aligns with the highest-volume keyword: "contract manufacturing" at 5,000-10,000/mo).

### Decision: "Electromechanical Assembly" Keyword — No Dedicated Service Page

The keyword "electromechanical assembly" (P1, 100-300/mo) and "electromechanical assembly services" (P1, 50-100/mo) are targeted by the **EMS Division Home page** (`/electromechanical-assembly/`) — NOT by a separate service page.

Rationale:
1. **URL-level targeting** — The URL itself contains "electromechanical-assembly," which is the strongest on-page SEO signal.
2. **No cannibalization** — Creating `/electromechanical-assembly/services/electromechanical-assembly/` would cannibalize the division home page. Google would struggle to choose which to rank.
3. **The division home IS the electromechanical assembly page** — Its H1 is "Electromechanical Assembly — Built to Spec, Ready to Scale," its title tag starts with "Electromechanical Assembly Services," and its meta description targets these keywords directly.
4. **The 5 service pages are subtypes** — Box build, cable harness, system integration, testing, and enclosure assembly are all specific types of electromechanical assembly. The division home is the umbrella term; the service pages are the spokes.

This is intentional keyword architecture: the parent page ranks for the umbrella term, the child pages rank for specific service terms.

---

## 2. Page Hierarchy (ASCII Tree)

```
gpw-solutions.com (/)
│
├── Home Corporativo (/)
│
├── /electromechanical-assembly/                    ← EMS Division Home
│   │
│   ├── /electromechanical-assembly/services/
│   │   ├── /electromechanical-assembly/services/box-build-assembly/
│   │   ├── /electromechanical-assembly/services/cable-harness-assembly/
│   │   ├── /electromechanical-assembly/services/system-integration/
│   │   ├── /electromechanical-assembly/services/testing-inspection/
│   │   └── /electromechanical-assembly/services/enclosure-cabinet-assembly/
│   │
│   ├── /electromechanical-assembly/industries/
│   │   ├── /electromechanical-assembly/industries/ai-server-rack/
│   │   ├── /electromechanical-assembly/industries/industrial-equipment/
│   │   ├── /electromechanical-assembly/industries/telecom-hardware/
│   │   ├── /electromechanical-assembly/industries/medical-devices/
│   │   ├── /electromechanical-assembly/industries/automotive/
│   │   ├── /electromechanical-assembly/industries/energy/
│   │   ├── /electromechanical-assembly/industries/aerospace/
│   │   └── /electromechanical-assembly/industries/appliances-white-goods/
│   │
│   ├── /electromechanical-assembly/about/
│   │
│   └── /electromechanical-assembly/request-quote/
│
├── /contract-manufacturing/                         ← Placeholder
│   └── (contenido mínimo + CTA "Coming Soon")
│
├── /about/                                          ← Corporativo
│
├── /contact/                                        ← Corporativo
│
└── /blog/                                           ← Content Hub (futuro)
    ├── /blog/nearshoring-mexico-guide/
    ├── /blog/box-build-assembly-guide/
    ├── /blog/how-to-choose-contract-manufacturer/
    └── /blog/usmca-manufacturing-benefits/
```

### Decisiones de Arquitectura — Justificación

**¿Por qué 8 páginas de industria dedicadas?**
- GPW sirve 8 verticales y cada una merece representación equitativa en el sitio. Balance objetivo: ~40% AI/servers, ~60% otras industrias.
- El keyword research por industria (Marzo 2026) muestra que aunque los volúmenes individuales son bajos para cada vertical (B2B niche), la estrategia de long-tail combinada genera cobertura SEO significativa.
- Competidores como NEOTech (5 industry pages), PEKO (6+), y Spartronics (4) ya tienen páginas dedicadas por industria — GPW necesita paridad competitiva.
- Milwaukee Electronics y NovaLink NO tienen industry pages dedicadas — esta es una ventaja competitiva SEO para GPW.
- Cada industry page funciona como landing page para tráfico orgánico BOFU (procurement managers buscando por industria) y como trust signal para el proceso de venta.
- El sitio no debe sentirse como "una empresa de servidores AI." Las 8 páginas de industria comunican la capacidad multi-vertical de GPW.

**¿Por qué `/services/` como sub-nivel en vez de plano?**
- Agrupa lógicamente los 5 servicios bajo un hub page.
- El hub `/electromechanical-assembly/services/` captura keywords como "contract manufacturing Mexico," "electronic assembly services," y "turnkey manufacturing."
- Permite breadcrumbs claros: Home > Electromechanical Assembly > Services > Box Build Assembly.
- Los competidores (NEOTech, Milwaukee, SEACOMP) usan esta misma estructura — los procurement managers esperan navegar así.

**¿Por qué `/request-quote/` en vez de `/contact/`?**
- El CTA primario es "Submit an RFQ" (no "Contact Us" genérico).
- Alineado con el lenguaje de la audiencia (procurement managers envían RFQs, no "contactan").
- El `/contact/` corporativo existe para consultas generales. El RFQ es específico de la división EMS.

---

## 3. URL Map — Detalle Completo por Página

### 3.1 Nivel 0 — Home Corporativo

| Campo | Detalle |
|-------|---------|
| **URL** | `/` |
| **Título SEO** | GPW Solutions — Precision Manufacturing & Electromechanical Assembly in Mexico |
| **Meta Description** | GPW Solutions: contract manufacturing and electromechanical assembly from Monterrey, Mexico. CNC precision machining and full system integration for U.S. OEMs. USMCA-compliant. |
| **H1** | Precision Manufacturing & Assembly — Engineered in Mexico for U.S. OEMs |
| **Keywords primarios** | electronic manufacturing services, EMS manufacturing, electronics contract manufacturers in Mexico |
| **Keywords secundarios** | EMS provider Mexico, contract electronics manufacturer, ems manufacturing company |
| **Breadcrumb** | Home |
| **Nav location** | Logo link (siempre visible) |
| **Función** | Página paraguas. Presenta GPW como empresa con dos divisiones. Dirige tráfico a Electromechanical Assembly (CTA primario) y Contract Manufacturing (secundario). No compite por keywords específicos de servicio — eso lo hacen las páginas internas. |
| **Prioridad** | P1 |

---

### 3.2 Nivel 1 — EMS Division Home

| Campo | Detalle |
|-------|---------|
| **URL** | `/electromechanical-assembly/` |
| **Título SEO** | Electromechanical Assembly Services in Mexico — GPW Solutions |
| **Meta Description** | Full-service electromechanical assembly from Monterrey, Mexico. Box build, cable harness, system integration, AI server assembly. 2 hours from the U.S. border. Request a quote. |
| **H1** | Electromechanical Assembly — Built to Spec, Ready to Scale |
| **Keywords primarios** | electromechanical assembly, electromechanical assembly services |
| **Keywords secundarios** | electromechanical assembly company, nearshoring manufacturing |
| **Breadcrumb** | Home > Electromechanical Assembly |
| **Nav location** | Header nav principal |
| **Función** | Landing principal de la división EMS. Hero potente + resumen de servicios (links a cada servicio) + industrias atendidas + value props (nearshore, quality, speed) + CTA a Request Quote. Esta página debe convertir tráfico directo Y distribuir a subpáginas. |
| **Prioridad** | P1 |

---

### 3.3 Nivel 2 — Services Hub

| Campo | Detalle |
|-------|---------|
| **URL** | `/electromechanical-assembly/services/` |
| **Título SEO** | Contract Manufacturing Services in Mexico — Assembly, Integration & Test — GPW |
| **Meta Description** | Box build assembly, cable harness, system integration, testing, and enclosure assembly services in Monterrey, Mexico. Turnkey manufacturing for U.S. OEMs. |
| **H1** | Assembly & Integration Services |
| **Keywords primarios** | contract manufacturing Mexico, contract manufacturing, electronic assembly services |
| **Keywords secundarios** | turnkey manufacturing, turnkey assembly services, OEM manufacturing Mexico |
| **Breadcrumb** | Home > Electromechanical Assembly > Services |
| **Nav location** | Header dropdown bajo "Services" |
| **Función** | Hub page que lista todos los servicios con descripción breve + link a cada página individual. Captura keywords de alto volumen ("contract manufacturing Mexico" P1). Arquitectura hub-and-spoke: esta página es el hub, las 5 páginas de servicio son los spokes. |
| **Prioridad** | P1 |

---

### 3.4 Nivel 3 — Páginas de Servicio Individuales

#### 3.4.1 Box Build Assembly

| Campo | Detalle |
|-------|---------|
| **URL** | `/electromechanical-assembly/services/box-build-assembly/` |
| **Título SEO** | Box Build Assembly Services — Full System Assembly in Mexico — GPW |
| **Meta Description** | Complete box build assembly from Monterrey, Mexico: mechanical, electrical, cabling, firmware, testing. From BOM to finished unit under one roof. Get a quote in 48 hours. |
| **H1** | Box Build Assembly |
| **Keywords primarios** | box build assembly, box build assembly services, box build assembly manufacturers |
| **Keywords secundarios** | full box build assembly, pcb assembly and box build |
| **Breadcrumb** | Home > Electromechanical Assembly > Services > Box Build Assembly |
| **Nav location** | Header dropdown bajo "Services" |
| **Función** | Página de servicio estrella (NEOTech es el benchmark). Detalla: qué incluye el box build, proceso paso a paso, capacidades (tolerancias, estándares IPC), industrias que lo usan, por qué GPW. CTA a RFQ. |
| **Prioridad** | P1 |

#### 3.4.2 Cable & Harness Assembly

| Campo | Detalle |
|-------|---------|
| **URL** | `/electromechanical-assembly/services/cable-harness-assembly/` |
| **Título SEO** | Cable & Wire Harness Assembly — Custom Cable Manufacturing Mexico — GPW |
| **Meta Description** | Custom cable harness and wire harness assembly in Monterrey, Mexico. IPC/WHMA-A-620 certified. From prototype to production. Request a quote today. |
| **H1** | Cable & Wire Harness Assembly |
| **Keywords primarios** | cable harness assembly, wire harness assembly, cable and harness assembly |
| **Keywords secundarios** | cable harness assembly services, custom cable assembly manufacturer |
| **Breadcrumb** | Home > Electromechanical Assembly > Services > Cable & Harness Assembly |
| **Nav location** | Header dropdown bajo "Services" |
| **Función** | Página de servicio. Nota: Insight del keyword research dice que "wire harness" tiene más volumen que "cable harness" — el título y H1 usan ambos. Detalla tipos de cables/harness, certificaciones, proceso. |
| **Prioridad** | P1 |

#### 3.4.3 System Integration

| Campo | Detalle |
|-------|---------|
| **URL** | `/electromechanical-assembly/services/system-integration/` |
| **Título SEO** | System Integration Manufacturing — Full Product Assembly Mexico — GPW |
| **Meta Description** | Complete system integration: mechanical structure, component integration, cable routing, firmware loading, functional testing. One supplier, one timezone, one accountability chain. |
| **H1** | System Integration |
| **Keywords primarios** | system integration manufacturing, system integration services electronics |
| **Keywords secundarios** | (absorbe parte de "turnkey manufacturing" y "turnkey assembly services") |
| **Breadcrumb** | Home > Electromechanical Assembly > Services > System Integration |
| **Nav location** | Header dropdown bajo "Services" |
| **Función** | Diferenciador clave de GPW vs competidores que solo hacen board-level. Explica el concepto: "We build the complete product" — mechanical + electrical + cables + test + packaging. |
| **Prioridad** | P1 |

#### 3.4.4 Testing & Inspection

| Campo | Detalle |
|-------|---------|
| **URL** | `/electromechanical-assembly/services/testing-inspection/` |
| **Título SEO** | Electronics Testing & Inspection Services — Quality Assurance — GPW |
| **Meta Description** | End-of-line functional testing, burn-in, visual inspection, and quality assurance for electromechanical assemblies. IPC-certified workmanship. Monterrey, Mexico. |
| **H1** | Testing & Inspection |
| **Keywords primarios** | test and inspection services electronics |
| **Keywords secundarios** | (absorbe "burn-in," "functional testing," "quality assurance") |
| **Breadcrumb** | Home > Electromechanical Assembly > Services > Testing & Inspection |
| **Nav location** | Header dropdown bajo "Services" |
| **Función** | Refuerza confianza en calidad. Detalla: tipos de test (funcional, burn-in, visual, dimensional), estándares IPC, equipment. Importante para superar la objeción "GPW is new." |
| **Prioridad** | P2 |

#### 3.4.5 Enclosure & Cabinet Assembly

| Campo | Detalle |
|-------|---------|
| **URL** | `/electromechanical-assembly/services/enclosure-cabinet-assembly/` |
| **Título SEO** | Enclosure & Cabinet Assembly Services — Industrial Enclosures Mexico — GPW |
| **Meta Description** | Custom enclosure and cabinet assembly: rack mounting, panel wiring, component integration, labeling, and testing. Monterrey, Mexico. |
| **H1** | Enclosure & Cabinet Assembly |
| **Keywords primarios** | enclosure assembly services |
| **Keywords secundarios** | (absorbe "cabinet assembly," "rack mount assembly," "panel wiring") |
| **Breadcrumb** | Home > Electromechanical Assembly > Services > Enclosure & Cabinet Assembly |
| **Nav location** | Header dropdown bajo "Services" |
| **Función** | Complementa box build y system integration. Relevante para telecom, energy, e industrial. Volumen de keyword bajo pero alta intención. |
| **Prioridad** | P3 |

---

### 3.5 Nivel 2 — Páginas de Industria

#### 3.5.1 AI & Server Rack

| Campo | Detalle |
|-------|---------|
| **URL** | `/electromechanical-assembly/industries/ai-server-rack/` |
| **Título SEO** | AI Server Rack Assembly & Hardware Manufacturing — Mexico — GPW |
| **Meta Description** | AI server rack assembly and hardware manufacturing in Monterrey, Mexico. Purpose-built for hyperscaler and enterprise OEMs. Nearshore alternative to Asia. |
| **H1** | AI & Server Rack Assembly |
| **Keywords primarios** | AI server assembly, server rack assembly, AI hardware manufacturing |
| **Keywords secundarios** | server rack assembly manufacturer |
| **Breadcrumb** | Home > Electromechanical Assembly > Industries > AI & Server Rack |
| **Nav location** | Header nav item (pulled out of Industries dropdown) |
| **Función** | PÁGINA ESTRELLA de diferenciación. Ningún competidor mid-market tiene una página dedicada a AI server assembly. First-mover en SEO. Referencia a Foxconn/Nvidia como validación de mercado ("The world's largest companies are moving AI server assembly to Mexico — GPW brings that capability to Tier 1 and Tier 2 OEMs"). Detalla: qué ensambla GPW (rack-scale, cable routing, GPU installation, burn-in, firmware), por qué Monterrey, proceso NPI para AI hardware. |
| **Prioridad** | P1 |

#### 3.5.2 Medical Devices

| Campo | Detalle |
|-------|---------|
| **URL** | `/electromechanical-assembly/industries/medical-devices/` |
| **Título SEO** | Medical Device Contract Manufacturing Mexico — Assembly & Integration — GPW |
| **Meta Description** | Medical device and equipment assembly in Monterrey, Mexico. Controlled assembly environment, full traceability, IPC-certified workmanship. USMCA-compliant. |
| **H1** | Medical Device Assembly |
| **Keywords primarios** | medical device contract manufacturing Mexico, medical device assembly Mexico |
| **Keywords secundarios** | (absorbe variantes de "medical electronics assembly") |
| **Breadcrumb** | Home > Electromechanical Assembly > Industries > Medical Devices |
| **Nav location** | Header dropdown bajo "Industries" |
| **Función** | Captura keyword BOFU de alto valor (100-300/mo, un solo lead puede valer el esfuerzo SEO completo). Detalla: controlled environment, traceability, compliance, tipos de dispositivos. |
| **Prioridad** | P1 |

#### 3.5.3 Industrial Equipment

| Campo | Detalle |
|-------|---------|
| **URL** | `/electromechanical-assembly/industries/industrial-equipment/` |
| **Título SEO** | Industrial Equipment Assembly — Control Panels & Box Build Mexico — GPW |
| **Meta Description** | Industrial equipment assembly in Monterrey, Mexico. Control panel integration, PLC enclosure assembly, industrial automation box build. Nearshore partner for U.S. OEMs. |
| **H1** | Industrial Equipment Assembly |
| **Keywords primarios** | industrial equipment assembly, control panel assembly, industrial box build |
| **Keywords secundarios** | PLC enclosure assembly, industrial automation assembly, machinery sub-assembly |
| **Breadcrumb** | Home > Electromechanical Assembly > Industries > Industrial Equipment |
| **Nav location** | Header dropdown bajo "Industries" |
| **Función** | Captura tráfico de OEMs de equipo industrial buscando outsource de ensamble. Detalla: tipos de equipo (controles, maquinaria ligera, sub-ensambles), proceso de integración, certificaciones. Cross-links a Box Build y Enclosure Assembly. |
| **Prioridad** | P1 |

#### 3.5.4 Telecom Hardware

| Campo | Detalle |
|-------|---------|
| **URL** | `/electromechanical-assembly/industries/telecom-hardware/` |
| **Título SEO** | Telecom Equipment Assembly — Cabinet Integration & Network Hardware — GPW |
| **Meta Description** | Telecom hardware assembly and cabinet integration in Monterrey, Mexico. 5G equipment, network racks, RF modules, fiber optic cabinets. Nearshore manufacturing for telecom OEMs. |
| **H1** | Telecom Hardware Assembly |
| **Keywords primarios** | telecom equipment assembly, telecommunications cabinet assembly, telecom rack assembly |
| **Keywords secundarios** | 5G equipment assembly, network equipment box build, RF module assembly |
| **Breadcrumb** | Home > Electromechanical Assembly > Industries > Telecom Hardware |
| **Nav location** | Header dropdown bajo "Industries" |
| **Función** | Posiciona GPW para el boom de infraestructura 5G y expansión de redes. Detalla: tipos de hardware telecom (gabinetes, racks, módulos), integración de sistemas, testing RF. Cross-links a Enclosure Assembly y System Integration. |
| **Prioridad** | P1 |

#### 3.5.5 Automotive Sub-assemblies

| Campo | Detalle |
|-------|---------|
| **URL** | `/electromechanical-assembly/industries/automotive/` |
| **Título SEO** | Automotive Sub-assembly & Wire Harness Manufacturing Mexico — GPW |
| **Meta Description** | Automotive sub-assembly and wire harness manufacturing in Monterrey, Mexico. Fixtures, integration, EV components. Nearshore alternative for Tier 1 and Tier 2 OEMs. |
| **H1** | Automotive Sub-assemblies |
| **Keywords primarios** | automotive sub-assembly, automotive wire harness assembly, automotive cable assembly Mexico |
| **Keywords secundarios** | automotive fixture assembly, EV component assembly, IATF 16949 assembly |
| **Breadcrumb** | Home > Electromechanical Assembly > Industries > Automotive |
| **Nav location** | Header dropdown bajo "Industries" |
| **Función** | Capitaliza el nearshoring boom automotriz en México (FDI +20% en autopartes 2024). Nota: GPW no es Tier 1 pesado — posicionar como partner de sub-ensambles, fixtures, e integración. Cross-links a Cable & Harness Assembly. |
| **Prioridad** | P1 |

#### 3.5.6 Energy Sector

| Campo | Detalle |
|-------|---------|
| **URL** | `/electromechanical-assembly/industries/energy/` |
| **Título SEO** | Energy Equipment Assembly — Power Distribution & Renewable Energy — GPW |
| **Meta Description** | Energy equipment assembly in Monterrey, Mexico. Power distribution cabinets, solar inverter integration, EV charger assembly, switchgear. Nearshore manufacturing for energy OEMs. |
| **H1** | Energy Sector Assembly |
| **Keywords primarios** | energy equipment assembly, power distribution assembly, electrical cabinet assembly |
| **Keywords secundarios** | solar inverter assembly, EV charger assembly, switchgear assembly, energy storage integration |
| **Breadcrumb** | Home > Electromechanical Assembly > Industries > Energy |
| **Nav location** | Header dropdown bajo "Industries" |
| **Función** | Sector en crecimiento acelerado (EV chargers, renewables, battery storage). Detalla: tipos de equipo energético que GPW ensambla, testing eléctrico, cumplimiento UL/CSA. Cross-links a Enclosure Assembly y Testing & Inspection. |
| **Prioridad** | P1 |

#### 3.5.7 Aerospace Sub-assemblies

| Campo | Detalle |
|-------|---------|
| **URL** | `/electromechanical-assembly/industries/aerospace/` |
| **Título SEO** | Aerospace Sub-assembly — Electromechanical Assembly & Wire Harness — GPW |
| **Meta Description** | Aerospace electromechanical sub-assembly in Monterrey, Mexico. AS9100-ready, full traceability, mil-spec cable harness. Nearshore assembly for aerospace and defense OEMs. |
| **H1** | Aerospace Sub-assemblies |
| **Keywords primarios** | aerospace sub-assembly, aerospace electromechanical assembly, AS9100 contract manufacturer |
| **Keywords secundarios** | avionics assembly, defense electronics assembly, aerospace wire harness, mil-spec assembly |
| **Breadcrumb** | Home > Electromechanical Assembly > Industries > Aerospace |
| **Nav location** | Header dropdown bajo "Industries" |
| **Función** | Alto valor de lead aunque bajo volumen. Sector exige full traceability y certificaciones — esto refuerza la imagen de calidad de GPW. México tiene 100+ empresas aeroespaciales en Baja California sola. Cross-links a Cable & Harness y Testing & Inspection. |
| **Prioridad** | P2 |

#### 3.5.8 Appliances & White Goods

| Campo | Detalle |
|-------|---------|
| **URL** | `/electromechanical-assembly/industries/appliances-white-goods/` |
| **Título SEO** | Appliance Assembly & White Goods Manufacturing Mexico — GPW |
| **Meta Description** | Appliance and white goods assembly in Monterrey, Mexico. Sub-assemblies, wire harness, box build for home appliance OEMs. Cost-effective nearshore manufacturing. |
| **H1** | Appliances & White Goods Assembly |
| **Keywords primarios** | appliance assembly, white goods assembly, home appliance contract manufacturing |
| **Keywords secundarios** | HVAC assembly, small appliance assembly, appliance wire harness, appliance box build |
| **Breadcrumb** | Home > Electromechanical Assembly > Industries > Appliances & White Goods |
| **Nav location** | Header dropdown bajo "Industries" |
| **Función** | México es top 5 en manufactura de electrodomésticos. Samsung, Bosch, Whirlpool tienen plantas en México. Detalla: tipos de electrodomésticos, sub-ensambles específicos, volumen alto. Cross-links a Box Build y Cable & Harness. |
| **Prioridad** | P2 |

---

### 3.6 Nivel 2 — About (EMS Division)

| Campo | Detalle |
|-------|---------|
| **URL** | `/electromechanical-assembly/about/` |
| **Título SEO** | About GPW — Electromechanical Assembly in Monterrey, Mexico |
| **Meta Description** | GPW Solutions: nearshore electromechanical assembly from Monterrey, Mexico. 2 hours from the U.S. border. Engineering-driven quality, rapid NPI, dedicated program management. |
| **H1** | Why GPW — Assembly Partner, Not Just a Vendor |
| **Keywords primarios** | manufacturing in Monterrey Mexico, manufacturing companies in Monterrey Mexico, nearshoring companies |
| **Keywords secundarios** | contract manufacturing companies in Mexico, ems manufacturing company |
| **Breadcrumb** | Home > Electromechanical Assembly > About |
| **Nav location** | Header nav principal |
| **Función** | Combina "Why GPW" + location + team + capabilities overview. Responde la objeción principal: "GPW is new." Proof points: Monterrey location (2 hrs from border, map, photos), team experience, facility capacity, certifications, multi-vertical capability. Incluye sección de industrias atendidas (las que no tienen página propia). |
| **Prioridad** | P1 |

---

### 3.7 Nivel 2 — Request a Quote (EMS)

| Campo | Detalle |
|-------|---------|
| **URL** | `/electromechanical-assembly/request-quote/` |
| **Título SEO** | Request a Quote — Electromechanical Assembly Services — GPW |
| **Meta Description** | Submit an RFQ for electromechanical assembly, box build, cable harness, or system integration. Quote response within 48 hours. Monterrey, Mexico. |
| **H1** | Request a Quote |
| **Keywords primarios** | (no targeting keywords — this is a conversion page) |
| **Keywords secundarios** | — |
| **Breadcrumb** | Home > Electromechanical Assembly > Request a Quote |
| **Nav location** | Header CTA button (naranja coral #ED835E) |
| **Función** | Página de conversión. Formulario RFQ conectado a HubSpot. Campos: nombre, empresa, email, servicio de interés, volumen estimado, descripción del proyecto, upload BOM (opcional). Debajo del form: "Quote response within 48 hours" + trust signals (certifications, Monterrey location, confidentiality). |
| **Prioridad** | P1 |

---

### 3.8 Contract Manufacturing (Placeholder)

| Campo | Detalle |
|-------|---------|
| **URL** | `/contract-manufacturing/` |
| **Título SEO** | CNC Precision Machining — Contract Manufacturing Mexico — GPW Solutions |
| **Meta Description** | CNC precision machining and contract manufacturing from Monterrey, Mexico. GPW Solutions — expanding capabilities. Contact us for more information. |
| **H1** | Contract Manufacturing — CNC Precision Machining |
| **Keywords primarios** | contract manufacturing (absorbe algo de volumen del head term) |
| **Breadcrumb** | Home > Contract Manufacturing |
| **Nav location** | Header nav principal |
| **Función** | Placeholder mínimo. Descripción corta de que GPW también ofrece CNC machining. "Full section coming soon." CTA a contacto general. NO invertir tiempo aquí ahora. |
| **Prioridad** | P3 |

---

### 3.9 Páginas Corporativas

#### 3.9.1 About (Corporativo)

| Campo | Detalle |
|-------|---------|
| **URL** | `/about/` |
| **Título SEO** | About GPW Solutions — Manufacturing & Assembly in Monterrey, Mexico |
| **Meta Description** | GPW Solutions is a manufacturing company in Monterrey, Mexico offering CNC precision machining and electromechanical assembly for U.S. OEMs. |
| **H1** | About GPW Solutions |
| **Breadcrumb** | Home > About |
| **Nav location** | Footer |
| **Función** | About corporativo general: historia, misión, ubicación, equipo. Enlaza a las dos divisiones. Captura keywords: "manufacturing companies in Monterrey Mexico," "nearshoring companies." |
| **Prioridad** | P2 |

#### 3.9.2 Contact (Corporativo)

| Campo | Detalle |
|-------|---------|
| **URL** | `/contact/` |
| **Título SEO** | Contact GPW Solutions — Monterrey, Mexico |
| **Meta Description** | Contact GPW Solutions in Monterrey, Mexico. General inquiries, facility tours, and partnership opportunities. |
| **H1** | Contact Us |
| **Breadcrumb** | Home > Contact |
| **Nav location** | Footer |
| **Función** | Contacto general (no RFQ). Dirección, mapa, teléfono, email, form básico. Para consultas que no son de EMS. |
| **Prioridad** | P2 |

---

### 3.10 Blog / Resources

Blog pages se implementan en Fase 2 (los P1) y Fase 3 (los P2/P3). Las URLs se reservan en la arquitectura desde ahora.

| URL | Título SEO | Keywords Target | Prioridad | Fase |
|-----|-----------|----------------|-----------|------|
| `/blog/` | GPW Blog — Manufacturing & Nearshoring Insights | (hub page) | P2 | Fase 2 |
| `/blog/nearshoring-mexico-guide/` | Nearshoring in Mexico: The Complete Guide for U.S. OEMs (2026) | nearshoring in Mexico, nearshoring Mexico, nearshoring Mexico 2026 | P1 | Fase 2 |
| `/blog/ai-hardware-manufacturing-mexico/` | AI Hardware Manufacturing in Mexico: Why OEMs Are Moving Server Assembly Nearshore | AI hardware manufacturing, AI server assembly (informational angle) | P1 | Fase 2 |
| `/blog/mexico-manufacturing-advantages/` | Why Mexico? Manufacturing Advantages for U.S. OEMs | Mexico manufacturing advantages, nearshoring examples, reshoring vs nearshoring | P2 | Fase 2 |
| `/blog/box-build-assembly-guide/` | What Is Box Build Assembly? Complete Guide for OEMs | box build assembly process, box build assembly meaning, box build vs PCBA | P2 | Fase 3 |
| `/blog/how-to-choose-contract-manufacturer/` | How to Choose a Contract Manufacturer in Mexico | how to choose a contract manufacturer, contract manufacturing definition | P2 | Fase 3 |
| `/blog/usmca-manufacturing-benefits/` | USMCA Manufacturing Benefits: Why Mexico Is the Nearshore Choice | USMCA manufacturing benefits | P2 | Fase 3 |

### 3.11 Comparison / Alternative Pages (Fase 3)

Low volume (10-50/mo) but extremely high conversion intent — BOFU. Se implementan en Fase 3 cuando haya contenido suficiente para comparar.

| URL | Título SEO | Keywords Target | Prioridad |
|-----|-----------|----------------|-----------|
| `/vs/jabil-alternative/` | GPW vs Jabil — Agile Electromechanical Assembly for Mid-Market OEMs | Jabil alternative Mexico | P3 |
| `/vs/neotech-alternative/` | GPW vs NEOTech — AI Server Assembly + Multi-Vertical Capability | NEOTech alternative | P3 |
| `/vs/flex-alternative/` | GPW vs Flex — Focused Assembly Partner, Not a Mega-EMS | Flex manufacturing alternative | P3 |

---

## 4. Navigation Specification

### 4.1 Header Navigation

**Items (izquierda a derecha):** 8 items max, CTA rightmost.

```
[LOGO GPW] | Electromechanical Assembly | Services ▼ | Industries ▼ | AI & Server Rack | About | Contract Manufacturing | [Request a Quote]
```

**Dropdown "Services":**
- Box Build Assembly
- Cable & Harness Assembly
- System Integration
- Testing & Inspection
- Enclosure & Cabinet Assembly

**Dropdown "Industries":**
- Industrial Equipment
- Telecom Hardware
- Medical Devices
- Automotive
- Energy
- Aerospace
- Appliances & White Goods

**NOTE:** AI & Server Rack (formerly "AI & Data Center") has been pulled OUT of the Industries dropdown and given its own dedicated header nav item to reflect its strategic importance as GPW's primary differentiation and first-mover advantage in the AI/server assembly space.

**CTA Button:** "Request a Quote" — Background: #ED835E (naranja coral), Text: white. Siempre visible.

**Notas:**
- "Electromechanical Assembly" en el nav principal lleva a `/electromechanical-assembly/` (el home de la división).
- "About" lleva a `/electromechanical-assembly/about/` (el about de la división EMS, que es la prioridad). El about corporativo vive en el footer.
- "Contract Manufacturing" lleva a `/contract-manufacturing/` (placeholder).
- En mobile: hamburger menu con la misma estructura. CTA "Request a Quote" se mantiene visible fuera del hamburger.

### 4.2 Footer Navigation

```
SERVICES                          INDUSTRIES                  COMPANY                    LEGAL
Box Build Assembly                Industrial Equipment        About GPW                  Privacy Policy
Cable & Harness Assembly          Telecom Hardware            Monterrey Location          Terms of Service
System Integration                Medical Devices             Contact
Testing & Inspection              Automotive                  Blog
Enclosure & Cabinet Assembly      Energy                      Contract Manufacturing
                                  Aerospace
                                  Appliances & White Goods

AI & SERVER RACK (separate footer column linking to the AI & Server Rack nav item and industry page)

                    © 2026 GPW Solutions — Monterrey, Mexico
                    [LinkedIn Icon] [Email Icon]
```

### 4.3 Breadcrumbs

Implementación con Schema.org BreadcrumbList JSON-LD en cada página.

| Página | Breadcrumb Display |
|--------|-------------------|
| Home | Home |
| EMS Home | Home > Electromechanical Assembly |
| Services Hub | Home > Electromechanical Assembly > Services |
| Box Build | Home > Electromechanical Assembly > Services > Box Build Assembly |
| Cable & Harness | Home > Electromechanical Assembly > Services > Cable & Harness Assembly |
| System Integration | Home > Electromechanical Assembly > Services > System Integration |
| Testing & Inspection | Home > Electromechanical Assembly > Services > Testing & Inspection |
| Enclosure & Cabinet | Home > Electromechanical Assembly > Services > Enclosure & Cabinet Assembly |
| AI & Server Rack | Home > Electromechanical Assembly > AI & Server Rack |
| Industrial Equipment | Home > Electromechanical Assembly > Industries > Industrial Equipment |
| Telecom Hardware | Home > Electromechanical Assembly > Industries > Telecom Hardware |
| Medical Devices | Home > Electromechanical Assembly > Industries > Medical Devices |
| Automotive | Home > Electromechanical Assembly > Industries > Automotive |
| Energy | Home > Electromechanical Assembly > Industries > Energy |
| Aerospace | Home > Electromechanical Assembly > Industries > Aerospace |
| Appliances & White Goods | Home > Electromechanical Assembly > Industries > Appliances & White Goods |
| About EMS | Home > Electromechanical Assembly > About |
| Request Quote | Home > Electromechanical Assembly > Request a Quote |
| Contract Mfg | Home > Contract Manufacturing |
| About Corp | Home > About |
| Contact | Home > Contact |
| Blog Post | Home > Blog > [Post Title] |

---

## 5. Internal Linking Strategy

### 5.1 Hub-and-Spoke Model

**Hub:** `/electromechanical-assembly/services/` (Services Hub)
**Spokes:** Las 5 páginas de servicio individuales

Reglas:
- Cada spoke linka de vuelta al hub en la intro y en el breadcrumb.
- El hub linka a cada spoke con descripción y anchor text descriptivo.
- Los spokes se linkan entre sí donde sea natural ("Our box build assembly includes cable harness integration — learn more about our [cable & harness assembly](/electromechanical-assembly/services/cable-harness-assembly/) capabilities").

**Hub secundario:** `/electromechanical-assembly/` (EMS Home)
**Spokes:** Services Hub, Industries, About, Request Quote

### 5.2 Cross-Section Links

| Desde | Hacia | Anchor Text (ejemplo) |
|-------|-------|-----------------------|
| Box Build → AI & Server Rack | Industry page | "See how our box build capabilities serve [AI server rack OEMs](/electromechanical-assembly/industries/ai-server-rack/)" |
| Cable & Harness → AI & Server Rack | Industry page | "Custom cable harness assemblies for [AI server infrastructure](/electromechanical-assembly/industries/ai-server-rack/)" |
| AI & Server Rack → Box Build | Service page | "AI server rack assembly requires complete [box build integration](/electromechanical-assembly/services/box-build-assembly/)" |
| AI & Server Rack → System Integration | Service page | "Full [system integration](/electromechanical-assembly/services/system-integration/) from component to shipping" |
| Medical Devices → Testing & Inspection | Service page | "Medical assemblies require rigorous [testing & inspection](/electromechanical-assembly/services/testing-inspection/) protocols" |
| About → Services Hub | Services overview | "Explore our [full range of assembly services](/electromechanical-assembly/services/)" |
| Every service page → Request Quote | CTA | "Ready to start? [Request a quote](/electromechanical-assembly/request-quote/) — response within 48 hours" |
| Home Corporativo → EMS Home | Division link | "Explore our [electromechanical assembly](/electromechanical-assembly/) division" |
| Blog posts → Service pages | Contextual link | Natural links dentro del contenido del blog a servicios relevantes |
| Blog posts → AI & Server Rack | Contextual link | "For AI-specific assembly, see our [AI & Server Rack](/electromechanical-assembly/industries/ai-server-rack/) capabilities" |
| Enclosure & Cabinet → Telecom | Industries page | "Enclosure assembly for [telecom hardware](/electromechanical-assembly/industries/telecom-hardware/) including 5G cabinets" |
| Enclosure & Cabinet → Energy | Industries page | "Power distribution cabinets for the [energy sector](/electromechanical-assembly/industries/energy/)" |
| Cable & Harness → Automotive | Industries page | "Custom wire harness assembly for [automotive sub-assemblies](/electromechanical-assembly/industries/automotive/)" |
| Cable & Harness → Aerospace | Industries page | "Mil-spec cable harness for [aerospace applications](/electromechanical-assembly/industries/aerospace/)" |
| Box Build → Industrial | Industries page | "Complete box build for [industrial equipment](/electromechanical-assembly/industries/industrial-equipment/) OEMs" |
| Testing → Medical | Industries page | "Rigorous testing protocols for [medical device](/electromechanical-assembly/industries/medical-devices/) assemblies" |
| System Integration → Energy | Industries page | "Full system integration for [energy equipment](/electromechanical-assembly/industries/energy/) cabinets" |
| Box Build → Appliances | Industries page | "Box build assembly for [home appliance](/electromechanical-assembly/industries/appliances-white-goods/) OEMs" |

### 5.3 CTA Linking Pattern

Cada página de servicio e industria incluye:
1. **CTA principal** (above the fold): "Request a Quote" → `/electromechanical-assembly/request-quote/`
2. **CTA secundario** (mid-page): "Explore Our [related service]" → cross-link
3. **CTA de cierre** (bottom): "Get a Quote in 48 Hours" → `/electromechanical-assembly/request-quote/`

### 5.4 Orphan Page Check

Todas las páginas tienen al menos 2 inbound internal links:
- Breadcrumb (automático)
- Nav link (header o footer)
- Contextual links desde páginas relacionadas

No hay orphan pages en esta arquitectura.

---

## 6. Resumen de Prioridades de Implementación

### Fase inmediata (ahora) — 19 páginas

| # | Página | URL | Prioridad |
|---|--------|-----|-----------|
| 1 | Home Corporativo | `/` | P1 |
| 2 | EMS Division Home | `/electromechanical-assembly/` | P1 |
| 3 | Services Hub | `/electromechanical-assembly/services/` | P1 |
| 4 | Box Build Assembly | `/electromechanical-assembly/services/box-build-assembly/` | P1 |
| 5 | Cable & Harness Assembly | `/electromechanical-assembly/services/cable-harness-assembly/` | P1 |
| 6 | System Integration | `/electromechanical-assembly/services/system-integration/` | P1 |
| 7 | Testing & Inspection | `/electromechanical-assembly/services/testing-inspection/` | P2 |
| 8 | Enclosure & Cabinet Assembly | `/electromechanical-assembly/services/enclosure-cabinet-assembly/` | P3 |
| 9 | AI & Server Rack | `/electromechanical-assembly/industries/ai-server-rack/` | P1 |
| 10 | Industrial Equipment | `/electromechanical-assembly/industries/industrial-equipment/` | P1 |
| 11 | Telecom Hardware | `/electromechanical-assembly/industries/telecom-hardware/` | P1 |
| 12 | Medical Devices | `/electromechanical-assembly/industries/medical-devices/` | P1 |
| 13 | Automotive | `/electromechanical-assembly/industries/automotive/` | P1 |
| 14 | Energy | `/electromechanical-assembly/industries/energy/` | P1 |
| 15 | Aerospace | `/electromechanical-assembly/industries/aerospace/` | P2 |
| 16 | Appliances & White Goods | `/electromechanical-assembly/industries/appliances-white-goods/` | P2 |
| 17 | About EMS | `/electromechanical-assembly/about/` | P1 |
| 18 | Request a Quote | `/electromechanical-assembly/request-quote/` | P1 |
| 19 | Contract Manufacturing (placeholder) | `/contract-manufacturing/` | P3 |

### Fase 2 — Corporativo + Blog P1 (6 páginas)

| # | Página | URL | Prioridad |
|---|--------|-----|-----------|
| 14 | About Corporativo | `/about/` | P2 |
| 15 | Contact Corporativo | `/contact/` | P2 |
| 16 | Blog Hub | `/blog/` | P2 |
| 17 | Nearshoring Guide | `/blog/nearshoring-mexico-guide/` | P1 |
| 18 | AI Hardware Manufacturing | `/blog/ai-hardware-manufacturing-mexico/` | P1 |
| 19 | Mexico Manufacturing Advantages | `/blog/mexico-manufacturing-advantages/` | P2 |

### Fase 3 — Blog P2 + Comparison Pages (6 páginas)

| # | Página | URL | Prioridad |
|---|--------|-----|-----------|
| 20 | Box Build Guide | `/blog/box-build-assembly-guide/` | P2 |
| 21 | Selection Guide | `/blog/how-to-choose-contract-manufacturer/` | P2 |
| 22 | USMCA Benefits | `/blog/usmca-manufacturing-benefits/` | P2 |
| 23 | GPW vs Jabil | `/vs/jabil-alternative/` | P3 |
| 24 | GPW vs NEOTech | `/vs/neotech-alternative/` | P3 |
| 25 | GPW vs Flex | `/vs/flex-alternative/` | P3 |

### Fase futura — Expansión

- Más blog posts según content strategy (industry-specific articles for each vertical)
- Páginas de case studies cuando haya clientes
- Portal de cliente (si aplica)
- Industry-specific landing pages for PPC campaigns

---

## 7. Notas Técnicas

### Trailing Slash Policy
Usar trailing slash consistentemente en todas las URLs: `/electromechanical-assembly/services/box-build-assembly/`

### Canonical URLs
Cada página define su canonical URL. No duplicados.

### Hreflang
No necesario por ahora — sitio 100% en inglés para audiencia U.S.

### Robots.txt
```
User-agent: *
Allow: /
Sitemap: https://gpw-solutions.com/sitemap.xml

# Block internal search, admin, preview
Disallow: /wp-admin/
Disallow: /wp-login.php
Disallow: /?s=
```

### Sitemap XML
Incluir todas las páginas publicadas. Actualización automática con Yoast/RankMath.

### Page Speed
- Lazy loading en imágenes below the fold
- WebP format para todas las imágenes
- Comprimir CSS/JS
- Target: LCP < 2.5s, CLS < 0.1

---

*Este documento alimenta las Fases 2 (Content Strategy) y 3 (Content Creation). Cada página aquí definida se convierte en una entrada en el plan de contenido con sus keywords, copy framework, y CTA strategy.*
