# 07 — Wireframes (MVP Pages)

## Design Direction

| Aspect | Choice |
|--------|--------|
| Theme | Dark mode primary (developer-friendly) |
| Style | Clean, minimal, content-focused |
| Colors | Category-coded accents on neutral dark base |
| Typography | Inter (body) + JetBrains Mono (code) |
| Spacing | Generous whitespace, readable line-height |
| Animation | Subtle, purposeful (not decorative) |

### Color Tokens

```
Background:     #0A0A0B (near black)
Surface:        #141415 (cards)
Border:         #27272A (subtle)
Text Primary:   #FAFAFA
Text Secondary: #A1A1AA
Accent:         #3B82F6 (blue — primary action)
Category colors:
  Network:      #3B82F6 (blue)
  Programming:  #8B5CF6 (purple)
  Database:     #10B981 (green)
  Security:     #EF4444 (red)
  AI:           #F59E0B (amber)
  Cloud:        #06B6D4 (cyan)
  DevOps:       #F97316 (orange)
  IoT:          #EC4899 (pink)
```

---

## Page 1: Homepage (`/`)

### Desktop (1440px)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ [◆ DEV ATLAS]     Explore  Learn  Visualize  Scenarios  Graph  [🔍]  │
├────────┬─────────────────────────────────────────────────────────────────┤
│        │                                                                 │
│ CATE-  │                    ◆ DEV ATLAS                                 │
│ GORIES │           Understand Technology Visually                         │
│        │                                                                 │
│ 🌐 Net │         ┌─────────────────────────────────────┐                │
│ 💻 Pro │         │  🔍  Search technology...            │                │
│ 🗄️ DB  │         └─────────────────────────────────────┘                │
│ 🔐 Sec │                                                                 │
│ 🤖 AI  │  ─────────── Explore by Category ───────────                    │
│ ☁️ Clo │                                                                 │
│ ⚙️ Dev │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐             │
│ 📡 IoT │  │ 🌐      │ │ 💻      │ │ 🗄️      │ │ 🔐      │             │
│        │  │ Network │ │Program- │ │Database │ │Security │             │
│ ────── │  │         │ │ ming    │ │         │ │         │             │
│        │  └─────────┘ └─────────┘ └─────────┘ └─────────┘             │
│ 📖 All │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐             │
│ 🗺️ Road│  │ 🤖      │ │ ☁️      │ │ ⚙️      │ │ 📡      │             │
│ 🕸️ Grap│  │ AI      │ │ Cloud   │ │ DevOps  │ │ IoT     │             │
│        │  └─────────┘ └─────────┘ └─────────┘ └─────────┘             │
│        │                                                                 │
│        │  ─────────── Popular Concepts ──────────                      │
│        │                                                                 │
│        │  [API]  [JSON]  [JWT]  [HTTP]  [DNS]  [Docker]               │
│        │                                                                 │
│        │  ─────────── What Happens When? ──────────                     │
│        │                                                                 │
│        │  ┌──────────────────┐ ┌──────────────────┐ ┌───────────────┐  │
│        │  │ 🌐 Open a       │ │ 🔐 Login?        │ │ 📡 IoT sends  │  │
│        │  │    website?      │ │                  │ │    data?      │  │
│        │  │                  │ │ 7 steps · Auth   │ │ 5 steps · MQTT│  │
│        │  └──────────────────┘ └──────────────────┘ └───────────────┘  │
│        │                                                                 │
│        │  ─────────── Featured: HTTP Request Flow ──────────             │
│        │                                                                 │
│        │  ┌─────────────────────────────────────────────────────────┐  │
│        │  │  Browser ──Request──▶ Server ──Query──▶ Database       │  │
│        │  │                    ◀──Response──                          │  │
│        │  │                                          [▶ Play Flow]    │  │
│        │  └─────────────────────────────────────────────────────────┘  │
│        │                                                                 │
├────────┴─────────────────────────────────────────────────────────────────┤
│  DEV ATLAS © 2026  ·  Built for developers, by developers             │
└──────────────────────────────────────────────────────────────────────────┘
```

### Mobile (375px)

```
┌─────────────────────────┐
│ ☰  DEV ATLAS       🔍  │
├─────────────────────────┤
│                         │
│      ◆ DEV ATLAS        │
│  Understand Technology  │
│       Visually          │
│                         │
│ ┌─────────────────────┐ │
│ │ 🔍 Search...        │ │
│ └─────────────────────┘ │
│                         │
│ ── Categories ──        │
│ ┌───────┐ ┌───────┐   │
│ │🌐 Net │ │💻 Pro │   │
│ └───────┘ └───────┘   │
│ ┌───────┐ ┌───────┐   │
│ │🗄️ DB  │ │🔐 Sec │   │
│ └───────┘ └───────┘   │
│        (scroll →)       │
│                         │
│ ── Popular ──           │
│ [API] [JSON] [HTTP]    │
│ [JWT] [DNS] [TCP]      │
│                         │
│ ── Scenarios ──         │
│ ┌─────────────────────┐ │
│ │ 🌐 Open a website?  │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ 🔐 Login?           │ │
│ └─────────────────────┘ │
│                         │
└─────────────────────────┘
```

---

## Page 2: Concept Detail (`/concepts/[slug]`)

### Desktop

```
┌──────────────────────────────────────────────────────────────────────────┐
│ [Navbar]                                                                 │
├────────┬─────────────────────────────────────────────────────────────────┤
│        │  Home  ›  Network  ›  HTTP                                     │
│ Side-  │                                                                 │
│ bar    │  ┌─────────────────────────────────────────────────────────┐  │
│        │  │                                                         │  │
│        │  │  HTTP                                                   │  │
│        │  │  HyperText Transfer Protocol                              │  │
│        │  │                                                         │  │
│        │  │  [● beginner]  [🌐 Network]                           │  │
│        │  │                                                         │  │
│        │  │  Protocol สำหรับส่งข้อมูลระหว่าง Client กับ Server      │  │
│        │  │                                                         │  │
│        │  └─────────────────────────────────────────────────────────┘  │
│        │                                                                 │
│        │  ┌─ 🟢 What is it? ──────────────────────────────────────┐  │
│        │  │                                                         │  │
│        │  │  HTTP (HyperText Transfer Protocol) คือโปรโตคอลที่ใช้   │  │
│        │  │  สำหรับการสื่อสารระหว่าง Client (เช่น Browser) กับ     │  │
│        │  │  Server บนอินเทอร์เน็ต...                               │  │
│        │  │                                                         │  │
│        │  └─────────────────────────────────────────────────────────┘  │
│        │                                                                 │
│        │  ┌─ 🟡 Why do we need it? ────────────────────────────────┐  │
│        │  │                                                         │  │
│        │  │  ทุกครั้งที่คุณเปิดเว็บ ดู YouTube หรือใช้ App          │  │
│        │  │  ข้อมูลต้องถูกส่งจาก Server มายัง Device ของคุณ...      │  │
│        │  │                                                         │  │
│        │  └─────────────────────────────────────────────────────────┘  │
│        │                                                                 │
│        │  ┌─ 🔵 How does it work? ─────────────────────────────────┐  │
│        │  │                                                         │  │
│        │  │  ┌─────────────────────────────────────────────────┐   │  │
│        │  │  │                                                 │   │  │
│        │  │  │   [Browser] ──Request──▶ [Server]              │   │  │
│        │  │  │              ◀─Response──                     │   │  │
│        │  │  │                                                 │   │  │
│        │  │  │   ▶ ⏸  ↺   Step 1/4: HTTP Request              │   │  │
│        │  │  │                                                 │   │  │
│        │  │  │                        [Expand Full View →]    │   │  │
│        │  │  └─────────────────────────────────────────────────┘   │  │
│        │  │                                                         │  │
│        │  └─────────────────────────────────────────────────────────┘  │
│        │                                                                 │
│        │  ┌─ Key Components ───────────────────────────────────────┐  │
│        │  │  • Request    • Response    • Headers    • Methods   │  │
│        │  └─────────────────────────────────────────────────────────┘  │
│        │                                                                 │
│        │  ┌─ ⚠️ Common Confusion ─────────────────────────────────┐  │
│        │  │  HTTP vs HTTPS: HTTP ไม่เข้ารหัส  HTTPS เข้ารหัสด้วย TLS│  │
│        │  └─────────────────────────────────────────────────────────┘  │
│        │                                                                 │
│        │  ── Related Concepts ──                                          │
│        │  [HTTPS]  [API]  [DNS]  [TCP]  [JSON]                          │
│        │                                                                 │
│        │  [🕸️ View in Knowledge Graph →]                                │
│        │                                                                 │
└────────┴─────────────────────────────────────────────────────────────────┘
```

---

## Page 3: Category (`/categories/[category]`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ [Navbar]                                                                 │
├────────┬─────────────────────────────────────────────────────────────────┤
│        │                                                                 │
│ Side-  │  🌐 Network                                                    │
│ bar    │  How devices communicate over networks                         │
│        │                                                                 │
│        │  ── 5 Concepts ──                                              │
│        │                                                                 │
│        │  ┌─────────────────────┐  ┌─────────────────────┐             │
│        │  │ HTTP                │  │ HTTPS               │             │
│        │  │ HyperText Transfer  │  │ HTTP Secure         │             │
│        │  │ [● beginner]        │  │ [● beginner]        │             │
│        │  │ Protocol สำหรับ...   │  │ Encrypted version..│             │
│        │  └─────────────────────┘  └─────────────────────┘             │
│        │                                                                 │
│        │  ┌─────────────────────┐  ┌─────────────────────┐             │
│        │  │ DNS                 │  │ TCP                 │             │
│        │  │ Domain Name System  │  │ Transmission Ctrl   │             │
│        │  │ [● beginner]        │  │ [● intermediate]    │             │
│        │  └─────────────────────┘  └─────────────────────┘             │
│        │                                                                 │
│        │  ┌─────────────────────┐                                       │
│        │  │ MQTT                │                                       │
│        │  │ Message Queue...    │                                       │
│        │  │ [● intermediate]    │                                       │
│        │  └─────────────────────┘                                       │
│        │                                                                 │
└────────┴─────────────────────────────────────────────────────────────────┘
```

---

## Page 4: Visualization (`/visualize/[slug]`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ [Navbar]                                                                 │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  HTTP Request Flow                                                       │
│  See how a browser communicates with a server                            │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                                                                    │  │
│  │                                                                    │  │
│  │     ┌──────────┐         ┌──────────┐         ┌──────────┐       │  │
│  │     │          │ Request │          │  Query  │          │       │  │
│  │     │ Browser  │────────▶│  Server  │────────▶│ Database │       │  │
│  │     │          │◀────────│          │◀────────│          │       │  │
│  │     │          │Response │          │ Result  │          │       │  │
│  │     └──────────┘         └──────────┘         └──────────┘       │  │
│  │                                                                    │  │
│  │                    ● ──── ● ──── ○ ──── ○                         │  │
│  │                    (step progress dots)                            │  │
│  │                                                                    │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  ◀ Prev    ▶ Play    Next ▶    ↺ Reset          Step 2/4          │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌─ Step Explanation ────────────────────────────────────────────────┐  │
│  │                                                                    │  │
│  │  Step 2: Server receives HTTP Request                              │  │
│  │                                                                    │  │
│  │  Server รับ Request จาก Browser แล้วประมวลผล เช่น ค้นหาข้อมูล     │  │
│  │  จาก Database หรือรัน business logic                               │  │
│  │                                                                    │  │
│  │  Related: [Server] [API] [Backend]                                 │  │
│  │                                                                    │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  [← Back to HTTP Concept]                                                │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Page 5: Knowledge Graph (`/graph`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ [Navbar]                                                                 │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Knowledge Graph                                                         │
│  Explore how technology concepts connect                                 │
│                                                                          │
│  [🔍 Search concept...]  [All ▾] [Network ▾] [Security ▾]  [Reset]     │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                                                                    │  │
│  │                    ┌───────┐                                       │  │
│  │                    │  DNS  │                                       │  │
│  │                    └───┬───┘                                       │  │
│  │                        │                                           │  │
│  │              ┌─────────┴─────────┐                                 │  │
│  │              │                   │                                 │  │
│  │         ┌────┴────┐        ┌────┴────┐                            │  │
│  │         │  HTTP   │────────│  HTTPS  │                            │  │
│  │         └────┬────┘        └─────────┘                            │  │
│  │              │                                                     │  │
│  │    ┌─────────┼─────────┐                                          │  │
│  │    │         │         │                                          │  │
│  │ ┌──┴──┐  ┌──┴──┐  ┌──┴──────┐                                   │  │
│  │ │ API │  │ JSON│  │   TCP   │                                   │  │
│  │ └──┬──┘  └─────┘  └─────────┘                                   │  │
│  │    │                                                               │  │
│  │ ┌──┴──────────┐                                                   │  │
│  │ │Authentication│                                                   │  │
│  │ └──────┬───────┘                                                   │  │
│  │        │                                                           │  │
│  │   ┌────┴────┐                                                     │  │
│  │   │   JWT   │  ← highlighted (selected)                           │  │
│  │   └─────────┘                                                     │  │
│  │                                                                    │  │
│  │  [Zoom +] [-] [Fit]                                               │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌─ Selected: JWT ──────────────────────────────────────────────────┐  │
│  │  JSON Web Token — ใช้สำหรับยืนยันตัวตนแบบ stateless              │  │
│  │  Connected: Authentication, API, HTTPS                             │  │
│  │  [Open Concept →]  [Show Path to HTTP →]                           │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Page 6: Scenario (`/scenarios/[slug]`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ [Navbar]                                                                 │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  🔐 What happens when you login?                                        │
│  [● intermediate]  [Security]                                          │
│                                                                          │
│  Follow the complete authentication flow from login form to dashboard    │
│                                                                          │
│  Concepts: [Frontend] [API] [Authentication] [JWT] [Database]            │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                                                                    │  │
│  │  [User] → [Frontend] → [API] → [Auth] → [DB] → [JWT] → [Dashboard]│  │
│  │                                                                    │  │
│  │  ▶ Play   ⏸ Pause   ↺ Reset              Step 4/7                 │  │
│  │                                                                    │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌─ Step-by-Step ────────────────────────────────────────────────────┐  │
│  │                                                                    │  │
│  │  ✅ 1. User enters email & password in login form     [Frontend]  │  │
│  │  ✅ 2. Frontend sends credentials to API endpoint      [API]       │  │
│  │  ✅ 3. API forwards to authentication service          [Auth]      │  │
│  │  ▶  4. Server queries database for user record         [Database]  │  │
│  │  ○  5. Password verified, JWT token generated          [JWT]       │  │
│  │  ○  6. Token returned to frontend                      [API]       │  │
│  │  ○  7. Frontend stores token & redirects to dashboard  [Frontend]  │  │
│  │                                                                    │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  [← All Scenarios]                                                       │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Page 7: Search (Command Palette)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                    ┌────────────────────────────────┐                    │
│                    │  🔍  jwt                     ✕ │                    │
│                    ├────────────────────────────────┤                    │
│                    │                                │                    │
│                    │  CONCEPTS                      │                    │
│                    │  ┌────────────────────────────┐│                    │
│                    │  │ 🔐 JWT                     ││                    │
│                    │  │    JSON Web Token           ││                    │
│                    │  │    Security · intermediate  ││                    │
│                    │  └────────────────────────────┘│                    │
│                    │  ┌────────────────────────────┐│                    │
│                    │  │ 🔐 Authentication          ││                    │
│                    │  │    Verify user identity     ││                    │
│                    │  │    Security · beginner      ││                    │
│                    │  └────────────────────────────┘│                    │
│                    │                                │                    │
│                    │  CATEGORIES                    │                    │
│                    │  🔐 Security                   │                    │
│                    │                                │                    │
│                    │  ↑↓ navigate  ↵ select  esc close│                    │
│                    └────────────────────────────────┘                    │
│                                                                          │
│              (overlay on current page, dimmed background)                │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Page 8: 404 Not Found

```
┌──────────────────────────────────────────────────────────────────────────┐
│ [Navbar]                                                                 │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                                                                          │
│                          404                                             │
│                   Concept not found                                      │
│                                                                          │
│              The concept you're looking for                              │
│              doesn't exist in DEV ATLAS yet.                           │
│                                                                          │
│              [← Back to Explore]                                         │
│                                                                          │
│              Popular: [API] [HTTP] [JSON] [JWT]                        │
│                                                                          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Component Inventory (from Wireframes)

| Component | Used In | Priority |
|-----------|---------|----------|
| `Navbar` | All pages | P0 |
| `Sidebar` | Desktop layout | P0 |
| `Footer` | All pages | P0 |
| `Hero` | Homepage | P0 |
| `SearchCommand` | Global (Cmd+K) | P0 |
| `CategoryCard` | Homepage, Category | P0 |
| `ConceptCard` | Category, Homepage | P0 |
| `ConceptHeader` | Concept page | P0 |
| `ConceptSection` | Concept page | P0 |
| `RelatedConcepts` | Concept page | P0 |
| `FlowPlayer` | Visualize, Concept, Scenario | P1 |
| `FlowControls` | FlowPlayer | P1 |
| `ExplanationPanel` | FlowPlayer | P1 |
| `KnowledgeGraph` | Graph page | P1 |
| `GraphPanel` | Graph page | P1 |
| `ScenarioCard` | Homepage, Scenarios list | P1 |
| `ScenarioSteps` | Scenario page | P1 |
| `Breadcrumb` | Concept, Category | P0 |
| `Badge` | Difficulty, Category tags | P0 |
| `NotFound` | 404 | P0 |

---

## Responsive Breakpoints

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | < 768px | No sidebar, hamburger menu, single column |
| Tablet | 768–1024px | Collapsible sidebar, 2-column grids |
| Desktop | > 1024px | Fixed sidebar, 3-4 column grids |

---

## Interaction Notes

| Element | Interaction |
|---------|------------|
| Category card | Hover: lift + glow → Click: navigate |
| Concept card | Hover: border highlight → Click: navigate |
| Search | Cmd+K / Ctrl+K global shortcut |
| Flow player | Space = play/pause, Arrow keys = step |
| Graph node | Click = select + highlight, Double-click = navigate |
| Related chip | Click = navigate to concept |
| Sidebar category | Click = filter / navigate to category page |
