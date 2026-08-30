# 06 — Database Schema

## Strategy

| Phase | Storage | Purpose |
|-------|---------|---------|
| **MVP (v1.0)** | JSON files in `/data` | Content, relations, visualizations |
| **v1.1** | Supabase PostgreSQL | Users, progress, bookmarks |
| **v2.0+** | Supabase PostgreSQL | Content migration + CMS |

> MVP ไม่ต้อง setup database — แต่ออกแบบ schema ไว้ก่อนเพื่อ migration ง่าย

---

## MVP: JSON File Structure

### `data/categories.json`

```json
[
  {
    "slug": "network",
    "name": "Network",
    "icon": "globe",
    "description": "How devices communicate over networks",
    "color": "#3B82F6"
  }
]
```

### `data/concepts/api.json`

```json
{
  "slug": "api",
  "title": "API",
  "fullName": "Application Programming Interface",
  "summary": "ระบบสำหรับให้โปรแกรมสื่อสารกัน",
  "difficulty": "beginner",
  "category": "programming",
  "tags": ["backend", "interface", "communication"],
  "sections": [
    {
      "type": "what_is",
      "content": "API คือชุดของกฎและข้อตกลง..."
    },
    {
      "type": "why",
      "content": "เพราะโปรแกรมต่าง ๆ ต้องสื่อสารกัน..."
    }
  ],
  "related": ["http", "json", "backend", "authentication"],
  "visualization": "http-flow"
}
```

### `data/relations.json`

```json
[
  {
    "source": "api",
    "target": "http",
    "type": "uses",
    "label": "uses"
  },
  {
    "source": "api",
    "target": "json",
    "type": "returns",
    "label": "returns"
  }
]
```

---

## Post-MVP: PostgreSQL Schema (Supabase)

### Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│   users      │       │  user_progress   │       │   concepts   │
├──────────────┤       ├──────────────────┤       ├──────────────┤
│ id (PK)      │──┐    │ id (PK)          │    ┌──│ id (PK)      │
│ username     │  │    │ user_id (FK)     │────┘  │ title        │
│ avatar_url   │  │    │ concept_id (FK)  │───────│ slug (UNIQUE)│
│ created_at   │  │    │ completed        │       │ summary      │
└──────────────┘  │    │ completed_at     │       │ difficulty   │
                  │    │ bookmarked       │       │ category_id  │
                  │    └──────────────────┘       │ content      │
                  │                               │ created_at   │
                  │    ┌──────────────────┐       │ updated_at   │
                  │    │ user_bookmarks   │       └──────┬───────┘
                  │    ├──────────────────┤              │
                  └────│ user_id (FK)     │              │
                       │ concept_id (FK)  │──────────────┘
                       │ created_at       │
                       └──────────────────┘

┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│  categories  │       │concept_relations │       │  scenarios   │
├──────────────┤       ├──────────────────┤       ├──────────────┤
│ id (PK)      │──┐    │ id (PK)          │       │ id (PK)      │
│ name         │  │    │ source_id (FK)   │──┐    │ title        │
│ slug (UNIQUE)│  │    │ target_id (FK)   │──┤    │ slug (UNIQUE)│
│ icon         │  │    │ relation_type    │  │    │ description  │
│ description  │  │    └──────────────────┘  │    │ difficulty   │
└──────────────┘  │                          │    │ config (JSON)│
                  └──────────────────────────┘    └──────────────┘

┌──────────────┐       ┌──────────────────┐
│ visualizations│      │  simulations     │
├──────────────┤       ├──────────────────┤
│ id (PK)      │       │ id (PK)          │
│ title        │       │ title            │
│ slug (UNIQUE)│       │ type             │
│ config (JSON)│       │ config (JSON)    │
│ concept_id   │       │ concept_id (FK)  │
└──────────────┘       └──────────────────┘
```

---

## Table Definitions

### `categories`

```sql
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  icon        TEXT NOT NULL,
  description TEXT,
  color       TEXT DEFAULT '#6B7280',
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

**Seed data:**

| slug | name | icon |
|------|------|------|
| network | Network | globe |
| programming | Programming | code |
| database | Database | database |
| security | Security | shield |
| ai | AI | brain |
| cloud | Cloud | cloud |
| devops | DevOps | settings |
| iot | IoT | radio |

---

### `concepts` ⭐

```sql
CREATE TABLE concepts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  full_name   TEXT,
  summary     TEXT NOT NULL,
  difficulty  TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  content     JSONB NOT NULL DEFAULT '{}',
  tags        TEXT[] DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- content JSONB structure:
-- {
--   "sections": [
--     { "type": "what_is", "content": "..." },
--     { "type": "why", "content": "..." }
--   ]
-- }

CREATE INDEX idx_concepts_slug ON concepts(slug);
CREATE INDEX idx_concepts_category ON concepts(category_id);
CREATE INDEX idx_concepts_difficulty ON concepts(difficulty);
CREATE INDEX idx_concepts_content ON concepts USING GIN(content);
```

---

### `concept_relations` ⭐⭐⭐

```sql
CREATE TABLE concept_relations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id       UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  target_id       UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  relation_type   TEXT NOT NULL CHECK (relation_type IN (
    'uses', 'returns', 'requires', 'part_of', 'related', 'builds_on'
  )),
  label           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),

  UNIQUE(source_id, target_id, relation_type)
);

CREATE INDEX idx_relations_source ON concept_relations(source_id);
CREATE INDEX idx_relations_target ON concept_relations(target_id);
```

**Example data:**

| source | target | type | label |
|--------|--------|------|-------|
| api | http | uses | uses |
| api | json | returns | returns |
| api | authentication | requires | requires |
| jwt | authentication | part_of | part of |
| https | http | builds_on | builds on |

---

### `scenarios`

```sql
CREATE TABLE scenarios (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  difficulty  TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  icon        TEXT,
  config      JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- config JSONB:
-- {
--   "concepts": ["frontend", "api", "authentication", "jwt", "database"],
--   "visualization": "login-flow",
--   "steps": [
--     { "order": 1, "title": "...", "description": "...", "conceptSlug": "frontend" }
--   ]
-- }
```

---

### `visualizations`

```sql
CREATE TABLE visualizations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  concept_id  UUID REFERENCES concepts(id) ON DELETE SET NULL,
  config      JSONB NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- config JSONB:
-- {
--   "nodes": [{ "id": "browser", "label": "Browser", "type": "client", "position": { "x": 0, "y": 0 } }],
--   "steps": [{ "id": "step1", "from": "browser", "to": "server", "label": "HTTP Request" }]
-- }
```

---

### `simulations` (Post-MVP)

```sql
CREATE TABLE simulations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  type        TEXT NOT NULL,  -- 'mqtt', 'http', 'dns'
  concept_id  UUID REFERENCES concepts(id) ON DELETE SET NULL,
  config      JSONB NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

---

### `users` (Supabase Auth — v1.1)

```sql
-- Managed by Supabase Auth
-- Extended via profiles table:

CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username    TEXT UNIQUE,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);
```

---

### `user_progress` (v1.1)

```sql
CREATE TABLE user_progress (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  concept_id  UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  completed   BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT now(),

  UNIQUE(user_id, concept_id)
);

CREATE INDEX idx_progress_user ON user_progress(user_id);
```

---

### `user_bookmarks` (v1.1)

```sql
CREATE TABLE user_bookmarks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  concept_id  UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT now(),

  UNIQUE(user_id, concept_id)
);
```

---

## Row Level Security (Supabase)

```sql
-- Public read for content tables
ALTER TABLE concepts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Concepts are publicly readable"
  ON concepts FOR SELECT USING (true);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are publicly readable"
  ON categories FOR SELECT USING (true);

ALTER TABLE concept_relations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Relations are publicly readable"
  ON concept_relations FOR SELECT USING (true);

-- User-specific tables
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own progress"
  ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE USING (auth.uid() = user_id);

ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own bookmarks"
  ON user_bookmarks FOR ALL USING (auth.uid() = user_id);
```

---

## Migration Path: JSON → Database

```
Step 1: MVP ships with JSON files
Step 2: Create Supabase tables (schema above)
Step 3: Write seed script:
        data/concepts/*.json → INSERT INTO concepts
        data/relations.json  → INSERT INTO concept_relations
Step 4: Update Content Engine:
        getConcept(slug) → fetch from Supabase instead of JSON
Step 5: Keep JSON as fallback / for local dev
```

### Seed Script Concept

```typescript
// scripts/seed-database.ts
import { createClient } from '@supabase/supabase-js';
import concepts from '../data/concepts';
import relations from '../data/relations.json';

async function seed() {
  const supabase = createClient(url, key);

  for (const concept of concepts) {
    await supabase.from('concepts').upsert({
      slug: concept.slug,
      title: concept.title,
      content: { sections: concept.sections },
      // ...
    });
  }

  for (const rel of relations) {
    // resolve slugs to IDs, then insert
  }
}
```

---

## Data Volume Estimates

| Entity | MVP | v1.0 | v2.0 | v3.0 |
|--------|-----|------|------|------|
| Concepts | 15 | 20 | 100 | 1000+ |
| Relations | ~40 | ~60 | ~300 | ~3000 |
| Visualizations | 3 | 5 | 20 | 50+ |
| Scenarios | 3 | 5 | 15 | 30+ |
| Users | 0 | 0 | 100 | 10,000+ |

> 15 concepts + 40 relations = JSON files ยังเร็วกว่า DB มาก ไม่ต้องรีบ migrate
