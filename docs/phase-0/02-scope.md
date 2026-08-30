# 02 — Project Scope

## Scope Philosophy

> **ทำน้อยแต่เชื่อมกันครบวงจร** — ดีกว่าทำเยอะแต่แต่ละส่วนไม่เชื่อม

---

## MVP (v1.0) — สิ่งที่ต้องจบ

### ✅ In Scope

| Feature | Detail | Priority |
|---------|--------|----------|
| Homepage | Hero, Search, Categories, Popular Concepts | P0 |
| Categories | 8 หมวด (Network, Programming, Database, Security, AI, Cloud, DevOps, IoT) | P0 |
| Concept Pages | Dynamic route `/concepts/[slug]` + Content Template | P0 |
| Content | 15 Concept แรก (ดูรายการด้านล่าง) | P0 |
| Search | Client-side search (title, summary, category) | P0 |
| Related Concepts | แสดง + link ระหว่าง Concept | P0 |
| Knowledge Graph | Basic interactive graph (React Flow) | P1 |
| Visualization Engine | Reusable flow player | P1 |
| Visualizations | HTTP, DNS, MQTT flows | P1 |
| Scenarios | 3 scenarios (Open Website, Login, IoT) | P1 |
| Responsive | Mobile + Tablet + Desktop | P0 |
| Deploy | Vercel production | P0 |

### 📦 MVP Content (15 Concepts)

```
Fundamentals (7)          Network (5)           Security (3)
───────────────          ───────────           ──────────
API                      HTTP                  Authentication
JSON                     HTTPS                 Authorization
Client                   DNS                   JWT
Server                   TCP
Frontend                 MQTT
Backend
Database
```

### 🎯 MVP Definition of Done

ผู้ใช้สามารถ:

1. ค้นหา "API" → เข้าหน้า Concept → อ่านครบทุก Section
2. กด Related Concept → ไปหน้าอื่นได้
3. ดู HTTP Flow animation พร้อม step-by-step
4. เข้า Scenario "What happens when you login?" → เห็น Flow ครบ
5. เปิด Knowledge Graph → เห็นความเชื่อมโยง + คลิกไป Concept ได้
6. ใช้งานบนมือถือได้

---

## Post-MVP (v1.1 – v2.0)

| Version | Features |
|---------|----------|
| v1.1 | Supabase Auth, Bookmark, User Progress |
| v1.2 | Simulation Lab (HTTP, MQTT interactive) |
| v1.3 | Learning Roadmap, Compare Mode |
| v2.0 | System Explorer, Debugging Explorer, Project Anatomy |

---

## Future (v3.0+)

| Feature | Notes |
|---------|-------|
| System Builder | Drag-and-drop architecture |
| AI Tutor | Context-aware Q&A |
| Community | User-contributed content |
| Mobile App | React Native / PWA |
| Advanced Gamification | Badges, streaks, leaderboards |
| 1000+ Concepts | Content at scale |

---

## ❌ Explicitly Out of Scope (MVP)

```
❌ User Authentication
❌ Database-backed content (ใช้ JSON ก่อน)
❌ Simulation Lab (ผู้ใช้ควบคุม)
❌ System Builder
❌ Debugging Explorer
❌ Compare Mode
❌ Project Anatomy
❌ AI features
❌ Community / Comments
❌ Admin CMS
❌ Mobile native app
❌ i18n (ภาษาอื่น)
```

---

## Critical Scope Decision: Content Storage

### MVP Strategy — **JSON-first**

```
data/
├── concepts/
│   ├── api.json
│   ├── http.json
│   └── ...
├── categories.json
├── relations.json
├── visualizations/
│   ├── http-flow.json
│   └── ...
└── scenarios/
    ├── open-website.json
    └── ...
```

**เหตุผล:**
- ไม่ต้อง setup Supabase ก่อน content พร้อม
- Git-versioned content = review ง่าย
- Deploy เร็ว (static generation)
- Schema ชัดก่อนย้าย DB

### Migration Path

```
Phase 1–5:  JSON files + Next.js static/SSG
Phase 6+:   Supabase for users, progress, bookmarks
Phase 8+:   Optional: migrate content to DB + Admin CMS
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Content creation ช้า | สูง | Template + เริ่ม 8 concepts ก่อน ค่อยเพิ่ม |
| Visualization Engine scope creep | สูง | 1 engine, 3 flows — ห้าม custom animation ต่อ flow |
| Feature overlap (Visualize vs Scenario) | กลาง | Scenario = multi-concept flow, Visualize = single-concept |
| Knowledge Graph ซับซ้อน | กลาง | MVP: static layout, ไม่ต้อง force-directed D3 |
| ทำ UI ก่อน content | กลาง | Sprint 2 ทำ API concept จริงพร้อม template |

---

## Revised Sprint Plan

| Sprint | Focus | Deliverable |
|--------|-------|-------------|
| **S1** | Setup + Design System + Layout + Homepage | Deployable shell |
| **S2** | Concept System + 8 concepts | `/concepts/api` ใช้งานได้ |
| **S3** | Search + Relations + Graph basic | Knowledge map ทำงาน |
| **S4** | Visualization Engine + 3 flows | HTTP/DNS/MQTT animate |
| **S5** | 3 Scenarios + 7 concepts เพิ่ม | End-to-end stories |
| **S6** | Polish + Responsive + SEO + Deploy | **MVP v1.0** |
| **S7+** | Auth + Progress + Simulation | v1.1+ |

> **เปลี่ยนจากแผนเดิม:** รวม Deploy ไว้ Sprint 6, เลื่อน Supabase ไป Sprint 7
