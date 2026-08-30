# 03 — Information Architecture

## Sitemap (MVP)

```
/                           Homepage
│
├── /explore                Explore (alias ของ homepage หรือ redirect)
│
├── /categories
│   └── /[category]         Category listing (e.g. /categories/network)
│
├── /concepts
│   ├── /                     All concepts
│   └── /[slug]               Concept detail (e.g. /concepts/api)
│
├── /visualize
│   └── /[slug]               Standalone visualization (e.g. /visualize/http-flow)
│
├── /scenarios
│   ├── /                     Scenario listing
│   └── /[slug]               Scenario detail (e.g. /scenarios/login)
│
├── /graph                    Knowledge Graph (full page)
│
└── /roadmap                  Learning Roadmap (Post-MVP: show placeholder)
```

### Post-MVP Routes

```
/profile                      User profile + progress
/simulate/[slug]              Simulation Lab
/compare/[pair]               Compare Mode (e.g. /compare/jwt-vs-session)
/systems/[slug]               System Explorer
/debug/[error]                Debugging Explorer
/projects/[slug]              Project Anatomy
```

---

## Navigation Structure

### Primary Nav (Navbar)

```
[Logo: DEV ATLAS]    Explore    Learn    Visualize    Scenarios    Graph    [🔍 Search]    [Profile*]

* Profile = Post-MVP (MVP: ซ่อนหรือ disabled)
```

### Secondary Nav (Sidebar — Desktop only)

```
CATEGORIES
──────────
🌐 Network
💻 Programming
🗄️ Database
🔐 Security
🤖 AI
☁️ Cloud
⚙️ DevOps
📡 IoT

QUICK LINKS
───────────
📖 All Concepts
🗺️ Roadmap
🕸️ Knowledge Graph
```

### Mobile Nav

- Hamburger menu → Sheet/Drawer
- Bottom tab bar (optional Post-MVP): Explore | Learn | Graph | Search

---

## Content Model

### Concept Schema

ทุก Concept ใช้ Schema เดียวกัน — นี่คือหัวใจของ Content System

```typescript
interface Concept {
  // Meta
  slug: string;
  title: string;
  fullName?: string;          // e.g. "Application Programming Interface"
  summary: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;           // category slug
  tags: string[];
  icon?: string;

  // Content Sections
  sections: ConceptSection[];

  // Relationships
  related: string[];          // concept slugs
  prerequisites?: string[];   // concept slugs (Post-MVP)

  // Media
  visualization?: string;     // visualization slug (if exists)
  simulation?: string;        // simulation slug (Post-MVP)

  // Learning
  quiz?: QuizQuestion[];      // Post-MVP
}

interface ConceptSection {
  type: SectionType;
  title?: string;
  content: string;            // Markdown
  items?: string[];           // for key_components, common_confusion
}

type SectionType =
  | "overview"
  | "what_is"
  | "why"
  | "how_it_works"
  | "key_components"
  | "real_world_example"
  | "common_confusion";
```

### Category Schema

```typescript
interface Category {
  slug: string;
  name: string;
  icon: string;
  description: string;
  color: string;              // theme color for UI
}
```

### Relation Schema

```typescript
interface ConceptRelation {
  source: string;             // concept slug
  target: string;             // concept slug
  type: RelationType;
  label?: string;
}

type RelationType =
  | "uses"                    // API uses HTTP
  | "returns"                 // API returns JSON
  | "requires"                // API requires Authentication
  | "part_of"                 // JWT part_of Authentication
  | "related"                 // generic relation
  | "builds_on";              // HTTPS builds_on HTTP
```

### Visualization Schema

```typescript
interface Visualization {
  slug: string;
  title: string;
  description: string;
  conceptSlug: string;        // primary concept
  nodes: FlowNode[];
  steps: FlowStep[];
}

interface FlowNode {
  id: string;
  label: string;
  description: string;        // shown on click
  type: "client" | "server" | "database" | "network" | "service" | "device";
  position: { x: number; y: number };
}

interface FlowStep {
  id: string;
  from: string;               // node id
  to: string;                 // node id
  label: string;              // e.g. "HTTP Request"
  description: string;        // step explanation
  duration?: number;          // animation ms
}
```

### Scenario Schema

```typescript
interface Scenario {
  slug: string;
  title: string;              // "What happens when you login?"
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  icon: string;
  concepts: string[];         // involved concept slugs
  visualization: string;      // visualization slug (multi-step flow)
  steps: ScenarioStep[];
}

interface ScenarioStep {
  order: number;
  title: string;
  description: string;
  conceptSlug?: string;       // link to concept
  highlightNodes?: string[];    // nodes to highlight in visualization
}
```

---

## Page Templates

### 1. Homepage (`/`)

```
┌─────────────────────────────────────────────┐
│ Navbar                                      │
├─────────────────────────────────────────────┤
│                                             │
│              DEV ATLAS                      │
│     Understand Technology Visually          │
│                                             │
│     [ 🔍 Search technology...          ]    │
│                                             │
├─────────────────────────────────────────────┤
│ Categories (8-card grid)                    │
│ [Network] [Programming] [Database] ...      │
├─────────────────────────────────────────────┤
│ Popular Concepts                            │
│ [API] [JSON] [JWT] [HTTP] [Docker] [Git]   │
├─────────────────────────────────────────────┤
│ Explore Flows (Scenarios preview)           │
│ 🌐 Open a website?  🔐 Login?  📡 IoT?     │
├─────────────────────────────────────────────┤
│ Featured Visualization                      │
│ [HTTP Request Flow — interactive preview]   │
├─────────────────────────────────────────────┤
│ Footer                                      │
└─────────────────────────────────────────────┘
```

### 2. Concept Page (`/concepts/[slug]`)

```
┌─────────────────────────────────────────────┐
│ Breadcrumb: Home > Network > HTTP           │
├─────────────────────────────────────────────┤
│ HTTP                                        │
│ HyperText Transfer Protocol                 │
│ [beginner] [Network]                        │
├─────────────────────────────────────────────┤
│ Summary: ...                                │
├─────────────────────────────────────────────┤
│ ┌─ What is it? ─────────────────────────┐  │
│ │ Content (markdown)                     │  │
│ └────────────────────────────────────────┘  │
│ ┌─ Why do we need it? ──────────────────┐  │
│ │ Content                                │  │
│ └────────────────────────────────────────┘  │
│ ┌─ How does it work? ───────────────────┐  │
│ │ Content + [Inline Visualization]       │  │
│ └────────────────────────────────────────┘  │
│ ┌─ Key Components ──────────────────────┐  │
│ │ • Request  • Response  • Headers       │  │
│ └────────────────────────────────────────┘  │
│ ┌─ Real-world Example ──────────────────┐  │
│ │ Content                                │  │
│ └────────────────────────────────────────┘  │
│ ┌─ Common Confusion ────────────────────┐  │
│ │ HTTP vs HTTPS clarification            │  │
│ └────────────────────────────────────────┘  │
├─────────────────────────────────────────────┤
│ Related Concepts                            │
│ [HTTPS] [API] [DNS] [TCP] [JSON]           │
├─────────────────────────────────────────────┤
│ [View in Knowledge Graph →]                 │
└─────────────────────────────────────────────┘
```

### 3. Knowledge Graph (`/graph`)

```
┌─────────────────────────────────────────────┐
│ Knowledge Graph                             │
│ [🔍 Search concept...]  [Filter: Category]  │
├─────────────────────────────────────────────┤
│                                             │
│         [Interactive React Flow Graph]      │
│                                             │
│    Click node → highlight connections       │
│    Double-click → navigate to concept       │
│                                             │
├─────────────────────────────────────────────┤
│ Selected: API                               │
│ Connected: HTTP, JSON, Authentication       │
└─────────────────────────────────────────────┘
```

### 4. Scenario Page (`/scenarios/[slug]`)

```
┌─────────────────────────────────────────────┐
│ What happens when you login?                │
│ [intermediate] [Security]                   │
├─────────────────────────────────────────────┤
│ Concepts involved:                          │
│ [Frontend] [API] [Auth] [JWT] [Database]   │
├─────────────────────────────────────────────┤
│                                             │
│     [Full-width Visualization Player]       │
│     ▶ Play  ⏸ Pause  ↺ Reset               │
│     Step 3/7: Server validates credentials  │
│                                             │
├─────────────────────────────────────────────┤
│ Step-by-step breakdown:                     │
│ 1. User enters credentials → [Frontend]     │
│ 2. Frontend sends to API → [API]            │
│ 3. Server validates → [Authentication]      │
│ ...                                         │
└─────────────────────────────────────────────┘
```

---

## URL Strategy

| Pattern | Example | Rendering |
|---------|---------|-----------|
| `/concepts/[slug]` | `/concepts/api` | SSG from JSON |
| `/categories/[slug]` | `/categories/network` | SSG |
| `/visualize/[slug]` | `/visualize/http-flow` | SSG |
| `/scenarios/[slug]` | `/scenarios/login` | SSG |
| `/graph` | `/graph` | Client-side (React Flow) |
| `/graph?focus=api` | `/graph?focus=api` | Client-side with query |

**SEO:** ทุก Concept/Scenario page ใช้ `generateStaticParams` + metadata

---

## Search Architecture (MVP)

```
User types query
       │
       ▼
Client-side filter
       │
       ├── Match title (weight: 3)
       ├── Match summary (weight: 2)
       ├── Match tags (weight: 2)
       └── Match category (weight: 1)
       │
       ▼
Sorted results → Command Palette UI
       │
       ▼
Navigate to /concepts/[slug]
```

**Post-MVP:** Fuse.js for fuzzy search → Supabase full-text → Semantic/AI search
