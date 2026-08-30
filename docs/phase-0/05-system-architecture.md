# 05 — System Architecture

## High-Level Architecture

```
                         ┌─────────────┐
                         │    USER     │
                         │  (Browser)  │
                         └──────┬──────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │     NEXT.JS APP       │
                    │    (App Router)       │
                    ├───────────────────────┤
                    │                       │
                    │  ┌─────────────────┐  │
                    │  │   Pages (SSG)   │  │
                    │  │  /concepts/[slug]│  │
                    │  │  /scenarios/...  │  │
                    │  └─────────────────┘  │
                    │                       │
                    │  ┌─────────────────┐  │
                    │  │  Client Comps   │  │
                    │  │  Graph, Search  │  │
                    │  │  Viz Player     │  │
                    │  └─────────────────┘  │
                    │                       │
                    │  ┌─────────────────┐  │
                    │  │  API Routes*  │  │
                    │  │  (Post-MVP)    │  │
                    │  └─────────────────┘  │
                    │                       │
                    └───────────┬───────────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
              ▼                 ▼                 ▼
     ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
     │  JSON DATA   │  │   SUPABASE   │  │    VERCEL    │
     │  (MVP)       │  │  (Post-MVP)  │  │   (Deploy)   │
     │              │  │              │  │              │
     │ concepts/    │  │ PostgreSQL   │  │ CDN + Edge   │
     │ relations/   │  │ Auth         │  │ Analytics    │
     │ visualizations/│  │ Storage      │  │              │
     └──────────────┘  └──────────────┘  └──────────────┘
```

---

## Module Architecture

```
dev-atlas/
│
├── CONTENT LAYER          ← ข้อมูล (JSON)
│   ├── concepts
│   ├── categories
│   ├── relations
│   ├── visualizations
│   └── scenarios
│
├── CONTENT ENGINE         ← อ่าน + validate + serve content
│   ├── getConcept(slug)
│   ├── getAllConcepts()
│   ├── getRelated(slug)
│   ├── searchConcepts(query)
│   └── getVisualization(slug)
│
├── UI LAYER               ← Pages + Components
│   ├── Layout (Navbar, Sidebar, Footer)
│   ├── Concept (template + sections)
│   ├── Visualization (flow player)
│   ├── Graph (knowledge map)
│   └── Search (command palette)
│
└── ENGINE LAYER           ← Reusable engines
    ├── VisualizationEngine
    ├── GraphEngine
    └── SearchEngine
```

---

## Visualization Engine Architecture

หัวใจของระบบ — ใช้ซ้ำได้ทุก Flow

```
┌─────────────────────────────────────────────┐
│            VISUALIZATION ENGINE              │
├─────────────────────────────────────────────┤
│                                             │
│  Input: Visualization JSON                  │
│  { nodes, steps }                           │
│                                             │
│  ┌─────────────┐  ┌──────────────────────┐   │
│  │ FlowCanvas  │  │  AnimationController│   │
│  │ (React Flow)│  │  play/pause/step    │   │
│  └──────┬──────┘  └──────────┬───────────┘   │
│         │                    │               │
│  ┌──────▼──────┐  ┌─────────▼──────────┐   │
│  │ NodeRenderer│  │  StepController      │   │
│  │ (typed nodes)│  │  prev/next/reset    │   │
│  └─────────────┘  └─────────────────────┘   │
│                                             │
│  ┌─────────────┐  ┌──────────────────────┐   │
│  │ EdgeRenderer│  │  ExplanationPanel    │   │
│  │ (animated)  │  │  step description   │   │
│  └─────────────┘  └──────────────────────┘   │
│                                             │
│  Output: Interactive Flow UI                │
└─────────────────────────────────────────────┘
```

### Engine State Machine

```
        ┌───────┐
        │ IDLE  │ ← initial / reset
        └───┬───┘
            │ play()
            ▼
        ┌───────┐
   ┌───│ PLAYING│───┐
   │   └───┬───┘   │
   │ pause()│       │ step complete
   ▼       │       ▼
┌──────┐   │   ┌────────┐
│PAUSED│───┘   │ STEP_N │ ──→ STEP_N+1 ──→ ... ──→ COMPLETED
└──────┘       └────────┘
   │ play()         │ reset()
   └────────────────┘
```

### Node Types

| Type | Icon/Style | Used In |
|------|-----------|---------|
| `client` | Browser/Device | HTTP, Login |
| `server` | Server box | HTTP, API |
| `database` | Cylinder | Query flows |
| `network` | Cloud | DNS, TCP |
| `service` | Gear | Auth, Cache |
| `device` | Chip | MQTT, IoT |

---

## Knowledge Graph Engine

```
┌─────────────────────────────────────────────┐
│              GRAPH ENGINE                    │
├─────────────────────────────────────────────┤
│                                             │
│  Input:                                     │
│  - concepts[] (nodes)                       │
│  - relations[] (edges)                      │
│                                             │
│  ┌──────────────┐  ┌───────────────────┐   │
│  │ GraphLayout  │  │  GraphInteraction │   │
│  │ auto-position│  │  click/hover/zoom │   │
│  └──────┬───────┘  └────────┬──────────┘   │
│         │                   │               │
│  ┌──────▼───────────────────▼──────────┐   │
│  │         React Flow Canvas            │   │
│  │  - Custom ConceptNode component      │   │
│  │  - Custom RelationEdge component     │   │
│  │  - Highlight on select               │   │
│  │  - Filter by category                │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Output: Interactive Knowledge Map          │
└─────────────────────────────────────────────┘
```

**MVP:** Static layout (pre-calculated positions in JSON)  
**Future:** D3 force-directed layout for 100+ nodes

---

## Data Flow

### Page Load (Concept)

```
Request: GET /concepts/api
    │
    ▼
Next.js SSG (build time)
    │
    ├── Read data/concepts/api.json
    ├── Read data/relations.json → filter related
    ├── Read data/visualizations/ → find linked viz
    │
    ▼
Render ConceptPage with props
    │
    ▼
HTML sent to client
    │
    ▼
Hydrate interactive parts (viz player, etc.)
```

### Client-Side (Search)

```
User: Cmd+K → type "http"
    │
    ▼
SearchEngine.search("http")
    │
    ├── Load all concepts (bundled at build)
    ├── Filter + score
    │
    ▼
Display in Command Palette
    │
    ▼
User selects → router.push("/concepts/http")
```

### Client-Side (Graph)

```
Page: /graph?focus=api
    │
    ▼
Load concepts + relations (imported JSON)
    │
    ▼
GraphEngine.buildGraph(data)
    │
    ├── Create React Flow nodes
    ├── Create React Flow edges
    ├── Apply layout
    ├── Highlight focus node
    │
    ▼
Render interactive graph
```

---

## Tech Stack Detail

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 15.x | Framework, SSG, routing |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |
| shadcn/ui | latest | UI components |
| Framer Motion | 11.x | Animations |
| @xyflow/react | 12.x | Flow diagrams + graph |
| lucide-react | latest | Icons |
| cmdk | latest | Command palette (search) |

### NOT in MVP

| Technology | When |
|-----------|------|
| Supabase | v1.1 (auth + progress) |
| Drizzle ORM | v1.1+ (if DB content) |
| D3.js | v2.0 (complex graphs 100+ nodes) |
| Fuse.js | v1.1 (fuzzy search) |

---

## Project Structure (Final)

```
dev-atlas/
│
├── app/
│   ├── layout.tsx                 # Root layout + providers
│   ├── page.tsx                   # Homepage
│   ├── not-found.tsx
│   │
│   ├── concepts/
│   │   ├── page.tsx               # All concepts list
│   │   └── [slug]/
│   │       └── page.tsx           # Concept detail
│   │
│   ├── categories/
│   │   └── [category]/
│   │       └── page.tsx
│   │
│   ├── visualize/
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   ├── scenarios/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   └── graph/
│       └── page.tsx
│
├── components/
│   ├── ui/                        # shadcn components
│   ├── layout/
│   │   ├── navbar.tsx
│   │   ├── sidebar.tsx
│   │   └── footer.tsx
│   ├── concept/
│   │   ├── concept-header.tsx
│   │   ├── concept-section.tsx
│   │   ├── concept-card.tsx
│   │   └── related-concepts.tsx
│   ├── visualization/
│   │   ├── flow-canvas.tsx
│   │   ├── flow-player.tsx
│   │   ├── flow-controls.tsx
│   │   ├── flow-node.tsx
│   │   ├── flow-edge.tsx
│   │   └── explanation-panel.tsx
│   ├── graph/
│   │   ├── knowledge-graph.tsx
│   │   ├── concept-node.tsx
│   │   └── graph-panel.tsx
│   ├── search/
│   │   └── command-search.tsx
│   └── home/
│       ├── hero.tsx
│       ├── category-grid.tsx
│       ├── popular-concepts.tsx
│       └── scenario-preview.tsx
│
├── lib/
│   ├── content/
│   │   ├── get-concepts.ts        # Content engine
│   │   ├── get-relations.ts
│   │   └── search.ts
│   ├── visualization/
│   │   └── engine.ts              # Viz engine logic
│   └── utils.ts
│
├── types/
│   ├── concept.ts
│   ├── visualization.ts
│   ├── graph.ts
│   └── scenario.ts
│
├── data/
│   ├── categories.json
│   ├── relations.json
│   ├── concepts/
│   │   ├── api.json
│   │   ├── http.json
│   │   └── ...
│   ├── visualizations/
│   │   ├── http-flow.json
│   │   ├── dns-flow.json
│   │   └── mqtt-flow.json
│   └── scenarios/
│       ├── open-website.json
│       ├── login.json
│       └── iot-data.json
│
└── public/
    └── (static assets)
```

---

## Deployment Architecture

```
Developer
    │
    ├── git push → GitHub (main)
    │
    ▼
Vercel (auto deploy)
    │
    ├── Build: next build (SSG all pages)
    ├── CDN: static assets + pages
    └── Edge: middleware (future auth)
    │
    ▼
Production: dev-atlas.vercel.app (or custom domain)
```

### Environment Variables (Post-MVP)

```env
# v1.1+
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## Key Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Content storage | JSON files (MVP) | Fast iteration, git-versioned, no DB setup |
| Rendering | SSG | SEO, performance, concept pages are static |
| Search | Client-side (MVP) | 15-20 concepts = no server needed |
| Graph layout | Pre-calculated positions | Predictable, no D3 complexity |
| Viz engine | Config-driven JSON | One engine, many flows |
| Auth timing | Post-MVP (v1.1) | Content first, users later |
| Component library | shadcn/ui | Copy-paste, customizable, Tailwind-native |
