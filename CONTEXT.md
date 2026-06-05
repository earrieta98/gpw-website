# GPW Website (gpw-solutions.com)

Domain glossary for the Global Precision Works marketing site — a single brand presenting two manufacturing capabilities to U.S. OEM buyers who are nearshoring to Mexico. The site's job is to convert qualified buyers into RFQs.

## Language

**Capability**:
One of GPW's two manufacturing offerings, presented to buyers as a peer service line under one brand. GPW has exactly two. In the global nav each capability is its own top-level tab.
_Avoid_: Division (internal-only framing — the public site organizes by capability and industry, not by org chart)

**Contract Manufacturing**:
The capability covering precision CNC machining and related processes (milling, turning, wire EDM, sheet metal, surface finishing). **Delivery model: coordinated** — GPW owns the engineering (DFM), quality assurance, nearshoring logistics, and single-point-of-accountability customer relationship, and produces parts through a vetted **manufacturing network** of Monterrey machine shops. GPW does **not** own the machining equipment. Buyer-facing nav label: **CNC Machining**. URL: `/contract-manufacturing/`.
_Avoid_: Maquinados (internal Spanish), "CM" (internal abbreviation); claiming owned machines, machine counts, or "our shop floor" for machining

**Assembly & Integration**:
The capability covering electromechanical assembly — box build, cable & wire harness, system integration, testing & inspection, enclosure & cabinet. **Delivery model: in-house** — GPW's core capability and the focus of its capital investment; performed by GPW directly. URL: `/ems/`. Buyer-facing nav label: **Assembly & Integration**.
_Avoid_: "EMS" in buyer-facing copy (see Flagged ambiguities)

**Manufacturing network**:
The vetted set of Monterrey machine shops GPW coordinates to deliver CNC Machining. GPW manages quality, DFM, and logistics across the network; it is the prime/accountable party to the customer, not a pass-through introducer.
_Avoid_: broker, middleman, marketplace (GPW owns the quality outcome — see Flagged ambiguities)

**Single point of accountability**:
GPW's core promise across both capabilities — one contract, one quality owner, one nearshore contact — whether a part is machined through the network or assembled in-house.

**Industry**:
A buyer's end market (e.g. aerospace, medical). GPW serves one canonical set of industries shared across both capabilities; each industry has a single page covering machining and/or assembly for that market. Work is classified by the buyer's **end market**, never by the component type — a machined enclosure belongs to the industry that uses it, not to a generic "enclosure" bucket.
_Avoid_: vertical, sector (use "industry")

**Engineering Support**:
GPW's branded pre-quote service — a free Design-for-Manufacturability (DFM) review on every project, plus material-selection and process guidance. Positioned as GPW's #1 differentiator (most shops quote without reviewing). Scoped to the CNC Machining capability and surfaced under it.
_Avoid_: "DFM" as the public name (Engineering Support is the offering; DFM is one part of it)

**OEM**:
The buyer — a U.S. Original Equipment Manufacturer evaluating GPW as a nearshore supplier. The real decision-makers sit in procurement, supply chain, or engineering.
_Avoid_: client, account (use "OEM" or "buyer")

**RFQ (Request for Quote)**:
The site's primary conversion: a buyer submitting part/project details (usually with a CAD file) to receive pricing. Distinct from general Contact.
_Avoid_: "inquiry", "contact form" when the RFQ is meant

**Nearshoring**:
GPW's core value story — manufacturing in Monterrey, Mexico for U.S. OEMs (proximity, same timezone, USMCA tariff advantage) as the alternative to offshoring to China or costly domestic U.S. production.

## Industries served (canonical taxonomy)

Ten shared industries, each one page covering both capabilities where they apply:

1. **Aerospace & Defense**
2. **Automotive**
3. **Medical Devices**
4. **Industrial Equipment**
5. **Energy** — power generation, renewables, energy equipment
6. **Oil & Gas** — distinct from Energy: downhole/oilfield, NACE/corrosion-resistant, Texas/Permian proximity
7. **Telecom** — communications-network hardware (base stations, RF/5G, telecom cabinets)
8. **Electronics** — the broad default for electronic hardware that is not telecom-network or data-center (industrial/control electronics, instrumentation, connectors, general heat sinks); owns generic "electronics machining" queries
9. **AI & Server Rack** — data-center compute (server racks, rack-mount chassis, GPU/AI integration)
10. **Appliances & White Goods**

**Electronics vs Telecom vs AI & Server Rack** disambiguation: classify by the buyer's end application. The same part (e.g. a machined heat sink) is _Telecom_ if it goes in a 5G radio, _AI & Server Rack_ if it goes in a server, and _Electronics_ if it goes in general/industrial electronics. This rule prevents the three pages from competing for the same search terms.

## Flagged ambiguities

**"EMS"**: Internally means *Electromechanical* Assembly, but the industry convention is *Electronic* Manufacturing Services (PCBA / board-level), which GPW is **not** — GPW is assembly-first (box build, harness, integration). Resolution: buyer-facing label is **"Assembly & Integration"** (decided in nav model, Keller two-tab); "EMS" is retained only in the existing URL `/ems/` and internal docs, not in customer-facing copy.

**Broker vs partner**: Because CNC Machining is coordinated through the manufacturing network (GPW does not own the machines), copy risks reading as a broker/middleman — which the research shows OEM buyers distrust. Resolution: GPW is positioned as a **managed manufacturing partner** that owns the engineering, quality outcome, and accountability (the Xometry/Fictiv posture), never as a pass-through introducer. Do not state or imply GPW operates its own machining equipment; do convey ownership of DFM, QA, and delivery.

## Example dialogue

> **Engineer:** "Should the aerospace page live under the aerospace division?"
> **Domain expert:** "There's no aerospace *division*. Aerospace is an **Industry**. GPW serves it with two **Capabilities** — CNC Machining and Assembly & Integration. The page describes what GPW can make for an aerospace **OEM**, and the call to action is always an **RFQ**."
