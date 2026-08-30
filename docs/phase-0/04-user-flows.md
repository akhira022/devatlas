# 04 — User Flows

## Personas

### Persona A: "น้องมิ้นท์" — Beginner

- ปี 2 คณะ IT, เรียน React มา 2 สัปดาห์
- เจอคำว่า "API" ใน Tutorial แต่ไม่เข้าใจ
- ใช้มือถือ 70% / Laptop 30%

### Persona B: "พี่บอล" — Intermediate

- Junior Dev 1 ปี, ทำ Frontend เป็นหลัก
- ต้อง integrate Auth แต่ไม่เข้าใจ JWT flow
- ใช้ Laptop 90%

---

## Flow 1: First Visit — Discovery

**Persona:** น้องมิ้นท์  
**Goal:** เข้าใจว่า DEV ATLAS คืออะไร + หา Concept แรก

```
Landing (/)
    │
    ├── เห็น Hero + Search bar
    │
    ├── Scroll ดู Categories
    │       │
    │       └── กด "🌐 Network"
    │               │
    │               └── /categories/network
    │                       │
    │                       └── เห็นรายการ: HTTP, DNS, TCP...
    │                               │
    │                               └── กด "HTTP"
    │                                       │
    │                                       └── /concepts/http ✅
    │
    ├── หรือ: กด Popular Concept "API"
    │       └── /concepts/api ✅
    │
    └── หรือ: กด Scenario "What happens when you open a website?"
            └── /scenarios/open-website ✅
```

**Success:** ผู้ใช้เข้าหน้า Concept หรือ Scenario ภายใน 30 วินาที

---

## Flow 2: Search-Driven Learning

**Persona:** น้องมิ้นท์  
**Goal:** ค้นหา "JWT" แล้วเข้าใจ

```
Any page
    │
    └── กด Search (Cmd+K / คลิก search bar)
            │
            └── Command Palette เปิด
                    │
                    └── พิมพ์ "jwt"
                            │
                            └── ผลลัพธ์:
                                ├── JWT (Security)
                                └── Authentication (Security)
                                        │
                                        └── เลือก "JWT"
                                                │
                                                └── /concepts/jwt
                                                        │
                                                        ├── อ่าน What is it?
                                                        ├── อ่าน Why?
                                                        ├── ดู Visualization (JWT flow)
                                                        ├── กด Related: "Authentication"
                                                        │       └── /concepts/authentication
                                                        └── กด "View in Graph"
                                                                └── /graph?focus=jwt
```

**Success:** ผู้ใช้เรียน JWT → เข้าใจ Auth → เห็นใน Graph ภายใน 5 นาที

---

## Flow 3: Deep Dive via Visualization

**Persona:** พี่บอล  
**Goal:** เข้าใจ HTTP Request/Response flow

```
/concepts/http
    │
    ├── Scroll ถึง "How does it work?"
    │       │
    │       └── Inline Visualization (mini)
    │               │
    │               └── กด "Expand" / "Full view"
    │                       │
    │                       └── /visualize/http-flow
    │
    └── Full Visualization Page
            │
            ├── กด ▶ Play → ดู animation step-by-step
            ├── กด Step 3 → อ่าน explanation panel
            ├── คลิก Node "Server" → ดู detail popup
            ├── กด ⏸ Pause → ศึกษา
            └── กด ↺ Reset → ดูซ้ำ
```

**Success:** ผู้ใช้เล่น visualization ครบทุก step และเข้าใจ flow

---

## Flow 4: Scenario Learning (End-to-End)

**Persona:** น้องมิ้นท์  
**Goal:** เข้าใจว่า "Login" เกิดอะไรขึ้นบ้าง

```
/scenarios (หรือ Homepage → Explore Flows)
    │
    └── เลือก "What happens when you login?"
            │
            └── /scenarios/login
                    │
                    ├── เห็น Concepts involved (chips)
                    │       └── กด "JWT" chip → /concepts/jwt
                    │
                    ├── กด ▶ Play บน Visualization
                    │       │
                    │       ├── Step 1: User enters credentials
                    │       ├── Step 2: Frontend → API
                    │       ├── Step 3: Validate in Database
                    │       ├── Step 4: Generate JWT
                    │       ├── Step 5: Return token
                    │       └── Step 6: Store & redirect
                    │
                    └── อ่าน Step-by-step breakdown ด้านล่าง
                            │
                            └── กด concept link ในแต่ละ step
```

**Success:** ผู้ใช้เข้าใจ Login flow ทั้งระบบ + รู้ว่า JWT อยู่ตรงไหน

---

## Flow 5: Knowledge Graph Exploration

**Persona:** พี่บอล  
**Goal:** เห็นภาพรวมว่า Network concepts เชื่อมกันยังไง

```
/graph
    │
    ├── เห็น graph ทั้งหมด (15 nodes)
    │
    ├── Filter: Category = "Network"
    │       └── Graph แสดงเฉพาะ Network nodes
    │
    ├── คลิก Node "API"
    │       │
    │       ├── Highlight: HTTP, JSON, Authentication
    │       ├── Panel แสดง: API summary + related list
    │       └── กด "Open Concept" → /concepts/api
    │
    ├── Search: "dns"
    │       └── Graph zoom to DNS + highlight connections
    │
    └── Double-click "HTTP"
            └── Navigate to /concepts/http
```

**Success:** ผู้ใช้เห็น mental model ของ technology landscape

---

## Flow 6: Category Browsing

**Persona:** น้องมิ้นท์  
**Goal:** สำรวจหมวด Security

```
Sidebar → กด "🔐 Security"
    │
    └── /categories/security
            │
            ├── Header: Security concepts
            ├── Cards:
            │   ├── Authentication [beginner]
            │   ├── Authorization [beginner]
            │   └── JWT [intermediate]
            │
            └── กด JWT card
                    └── /concepts/jwt
```

---

## Flow 7: Related Concept Chain (Rabbit Hole)

**Persona:** ทั้งสอง  
**Goal:** เรียนรู้ต่อเนื่องผ่าน Related links

```
/concepts/api
    │
    └── Related: HTTP
            │
            └── /concepts/http
                    │
                    └── Related: DNS
                            │
                            └── /concepts/dns
                                    │
                                    └── Related: TCP
                                            │
                                            └── /concepts/tcp
```

**Design note:** แสดง breadcrumb trail / "You came from: API → HTTP → DNS" (Post-MVP)

---

## Error & Edge Case Flows

### Search — No Results

```
Search "blockchain"
    │
    └── ไม่มีผลลัพธ์
            │
            └── แสดง:
                "No concepts found for 'blockchain'"
                Popular: [API] [HTTP] [JSON]
                Browse categories →
```

### Concept — Not Found

```
/concepts/nonexistent
    │
    └── 404 page
            │
            └── "Concept not found"
                [← Back to Explore]
                Popular concepts...
```

### Visualization — No Data

```
/concepts/client (ไม่มี visualization)
    │
    └── Section "How does it work?" = text only
        ไม่แสดง empty visualization placeholder
```

---

## User Flow Diagram (Core Loop)

```
                    ┌──────────────┐
                    │   LANDING    │
                    │      /       │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
         [Search]    [Category]    [Scenario]
              │            │            │
              ▼            ▼            ▼
         ┌─────────────────────────────────┐
         │         CONCEPT PAGE            │
         │       /concepts/[slug]          │
         └──────────┬──────────────────────┘
                    │
         ┌──────────┼──────────┐
         ▼          ▼          ▼
   [Visualize]  [Related]   [Graph]
         │          │          │
         ▼          ▼          ▼
   /visualize   /concepts   /graph
   /[slug]      /[slug]
         │          │          │
         └──────────┼──────────┘
                    │
                    ▼
              UNDERSTAND ✓
```

---

## Post-MVP Flows (Reference)

### Flow 8: Save Progress (v1.1)

```
Login → Browse concept → Mark complete → Profile shows progress
```

### Flow 9: Simulation (v1.2)

```
/concepts/mqtt → "Try it" → /simulate/mqtt → User changes topic/message → See result
```

### Flow 10: Compare (v1.3)

```
/concepts/jwt → Related → "Compare with Session" → /compare/jwt-vs-session
```
