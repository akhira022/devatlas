# DEV ATLAS

> Interactive Knowledge Map for Developers

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run validate:content` | Validate concept/viz/scenario JSON |
| `npm run generate:index` | Regenerate concept/scenario/viz registries |
| `npm test` | Run unit tests |
| `npm start` | Start production server |

## Tech Stack

- Next.js 16 + TypeScript
- Tailwind CSS 4 + shadcn/ui
- Framer Motion + React Flow
- JSON content (MVP)

## Documentation

See [docs/phase-0/](./docs/phase-0/) for architecture and planning.

## Content Coverage (121 Concepts)

| Category | Count | Highlights |
|----------|-------|------------|
| Network | 22 | HTTP, HTTPS, TLS, DNS, DHCP, TCP, UDP, IP, Subnetting, ARP, NAT, WebSocket, SSE, REST, GraphQL, CORS, CDN, Load Balancer, Proxy, VPN, Firewall, SMTP |
| CLI | 39 | Unix/Linux + Windows/PowerShell commands (ls, curl, dig, ipconfig, …) |
| Git & GitHub | 19 | git init/add/commit/push, branch, merge, rebase, PR, gh CLI |
| Programming | 16 | API, JSON, Client/Server, Frontend/Backend, OOP, Data Structures |
| Security | 6 | Authentication, Authorization, JWT, OAuth, Encryption, Hashing |
| Database | 5 | Database, SQL, NoSQL, Redis, ORM |
| AI | 4 | Machine Learning, LLM, Neural Network, RAG |
| Cloud | 4 | Cloud Computing, Serverless, Docker, SaaS |
| DevOps | 3 | CI/CD, Deployment, Kubernetes |
| IoT | 3 | MQTT, Sensor, Edge Computing |

Plus **32 protocol/concept animations** and **6 interactive scenarios**.

## Project Status

- [x] Phase 0 — Planning
- [x] Phase 1 — Environment Setup
- [x] Phase 2 — Design System + Layout
- [x] Phase 3 — Homepage + Search
- [x] Phase 4 — Concept System
- [x] Phase 5 — Knowledge Graph
- [x] Phase 6 — Visualization Engine
- [x] Phase 7 — Content expansion (Network, CLI, Git, Data Structures)
- [x] Polish — Graph filter, visualize groups, SEO, CI, scenarios/viz expansion
- [ ] Phase 8 — Deploy to Vercel
