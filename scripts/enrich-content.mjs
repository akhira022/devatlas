import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");

const SECTION_ORDER = [
  "what_is",
  "why",
  "how_it_works",
  "key_components",
  "real_world_example",
  "common_confusion",
];

/** Sections to merge per concept slug (only missing types are added). */
const SUPPLEMENTS = {
  arp: {
    key_components: {
      items: [
        "ARP Request — broadcast ถามว่าใครมี IP นี้",
        "ARP Reply — ตอบกลับพร้อม MAC address",
        "ARP Cache — เก็บ IP→MAC ชั่วคราวในเครื่อง",
        "Gratuitous ARP — ประกาศ IP/MAC ของตัวเอง",
        "ARP Table — ตาราง mapping ใน router/switch",
      ],
    },
    real_world_example: {
      content:
        "เมื่อ laptop (192.168.1.50) จะส่งข้อมูลไป router (192.168.1.1) ครั้งแรก:\n\n1. Laptop รู้ IP ปลายทาง แต่ยังไม่รู้ MAC ของ router\n2. ส่ง ARP Request broadcast: \"Who has 192.168.1.1?\"\n3. Router ตอบ ARP Reply: \"192.168.1.1 is at AA:BB:CC:DD:EE:FF\"\n4. Laptop เก็บใน ARP cache แล้วส่ง Ethernet frame ไปยัง MAC นั้น\n5. ครั้งถัดไปใช้ cache โดยไม่ต้อง ARP ใหม่ (จนกว่า cache จะหมดอายุ)",
    },
    common_confusion: {
      items: [
        "ARP ใช้ใน LAN เท่านั้น — ข้าม router ใช้ IP routing แทน",
        "ARP ≠ DNS — ARP แปลง IP→MAC, DNS แปลง domain→IP",
        "ARP spoofing คือการปลอม ARP Reply เพื่อแทรกกลาง (man-in-the-middle)",
      ],
    },
  },
  authentication: {
    how_it_works: {
      content:
        "ลำดับทั่วไปเมื่อ user login:\n\n1. User ส่ง credentials (email/password, OAuth token, biometric)\n2. Server ตรวจสอบกับ Database หรือ Identity Provider\n3. ถ้าถูกต้อง — สร้าง session หรือ JWT token\n4. Client เก็บ token/session และส่งไปกับ request ถัดไป\n5. Server ตรวจสอบ token ก่อนประมวลผลทุก request",
    },
    key_components: {
      items: [
        "Credentials — สิ่งที่พิสูจน์ตัวตน (password, token, certificate)",
        "Identity Provider (IdP) — ระบบยืนยันตัวตน (Google, Auth0, Keycloak)",
        "Session / Token — หลักฐานว่า login แล้ว (JWT, session cookie)",
        "Multi-Factor Authentication (MFA) — ยืนยันหลายชั้น",
        "Password Hashing — เก็บ password แบบ hash ไม่เก็บ plain text",
      ],
    },
    real_world_example: {
      content:
        "Login ด้วย Google บนเว็บ e-commerce:\n\n1. กด \"Sign in with Google\" → redirect ไป Google\n2. Google ยืนยันตัวตน (password + 2FA ถ้ามี)\n3. Google ส่ง authorization code กลับมาเว็บ\n4. Backend แลก code เป็น access token และดึง profile\n5. สร้าง JWT ของเว็บเอง → user login สำเร็จ",
    },
  },
  authorization: {
    why: {
      content:
        "Authentication บอกว่า user คือใคร แต่ไม่บอกว่าทำอะไรได้ — Authorization ป้องกัน:\n\n- User ธรรมดาเข้าถึง admin panel\n- ลบข้อมูลของคนอื่น\n- ดูข้อมูลที่ไม่มีสิทธิ์\n\nทุกระบบที่มี role ต่างกัน (admin, editor, viewer) ต้องมี authorization",
    },
    how_it_works: {
      content:
        "1. หลัง authentication สำเร็จ — ระบบรู้ user identity\n2. ตรวจสอบ role/permission ของ user (จาก Database หรือ token claims)\n3. เปรียบเทียบกับ action ที่ขอ (เช่น DELETE /users/123)\n4. อนุญาต (200) หรือปฏิเสธ (403 Forbidden)\n\nรูปแบบยอดนิยม: RBAC (Role-Based), ABAC (Attribute-Based), ACL (Access Control List)",
    },
    key_components: {
      items: [
        "Role — ชุดสิทธิ์ (admin, editor, viewer)",
        "Permission — สิทธิ์เฉพาะ action (read, write, delete)",
        "Policy — กฎตัดสินว่าใครทำอะไรได้",
        "Scope — ขอบเขตสิทธิ์ (OAuth scope: read:profile)",
        "403 Forbidden — response เมื่อไม่มีสิทธิ์",
      ],
    },
    common_confusion: {
      items: [
        "Authentication ≠ Authorization — login สำเร็จไม่ได้แปลว่าทำทุกอย่างได้",
        "401 Unauthorized มักหมายถึงยังไม่ login, 403 Forbidden หมายถึง login แล้วแต่ไม่มีสิทธิ์",
        "JWT อาจมี claims สำหรับ authorization (role, permissions)",
      ],
    },
  },
  cdn: {
    key_components: {
      items: [
        "Edge Server — server ใกล้ user เก็บ cache",
        "Origin Server — server ต้นทางที่เก็บไฟล์จริง",
        "Cache TTL — ระยะเวลาเก็บ cache",
        "DNS Routing — ชี้ user ไป edge ที่ใกล้ที่สุด",
        "Purge / Invalidation — ล้าง cache เมื่ออัปเดตเนื้อหา",
      ],
    },
    common_confusion: {
      items: [
        "CDN ≠ Hosting — CDN cache เนื้อหาจาก origin ไม่ได้แทนที่ server หลัก",
        "CDN ช่วย static files เป็นหลัก — dynamic API อาจไม่ cache",
        "Cloudflare, Akamai, AWS CloudFront เป็น CDN provider ยอดนิยม",
      ],
    },
  },
  "ci-cd": {
    key_components: {
      items: [
        "CI Pipeline — build, test อัตโนมัติทุก commit",
        "CD Pipeline — deploy ไป staging/production",
        "Build Agent / Runner — เครื่องที่รัน pipeline",
        "Artifact — ผลลัพธ์จาก build (Docker image, binary)",
        "Git Hook / Webhook — trigger pipeline เมื่อ push code",
      ],
    },
    common_confusion: {
      items: [
        "CI ≠ CD — CI คือ integrate & test, CD คือ deliver/deploy",
        "GitHub Actions, GitLab CI, Jenkins เป็น CI/CD tools",
        "CI/CD ไม่ได้แทน testing ด้วยมือ — ยังต้องเขียน test ที่ดี",
      ],
    },
  },
  "cloud-computing": {
    how_it_works: {
      content:
        "1. ผู้ใช้สมัครบัญชีกับ Cloud Provider (AWS, GCP, Azure)\n2. สร้าง resource ผ่าน Console, CLI หรือ API (VM, database, storage)\n3. Provider จัดสรร resource จาก data center กลาง\n4. จ่ายตามการใช้งาน (pay-as-you-go) — ชั่วโมง, GB, request\n5. Scale up/down ได้ทันทีโดยไม่ต้องซื้อ hardware",
    },
    real_world_example: {
      content:
        "Startup เปิดตัวแอปใหม่:\n\n- เริ่มด้วย AWS EC2 instance เล็ก ๆ ($10/เดือน)\n- ใช้ RDS สำหรับ PostgreSQL แทนติดตั้งเอง\n- เก็บรูป user บน S3\n- เมื่อ user เพิ่ม → เพิ่ม instance หรือใช้ auto-scaling\n- ไม่ต้องซื้อ server หรือจ้างทีมดูแล data center",
    },
  },
  cors: {
    key_components: {
      items: [
        "Origin — protocol + domain + port ของหน้าเว็บ",
        "Preflight Request — OPTIONS ก่อน POST/custom headers",
        "Access-Control-Allow-Origin — header บอกว่าอนุญาต origin ไหน",
        "Access-Control-Allow-Methods — HTTP methods ที่อนุญาต",
        "Access-Control-Allow-Headers — custom headers ที่อนุญาต",
      ],
    },
    real_world_example: {
      content:
        "Frontend อยู่ที่ app.example.com เรียก API ที่ api.example.com:\n\n1. Browser ส่ง OPTIONS preflight ไป api.example.com\n2. API ตอบ Allow-Origin: https://app.example.com\n3. Browser ส่ง POST /api/orders พร้อม JSON\n4. API ประมวลผลและตอบกลับ\n\nถ้า API ไม่ตั้ง CORS headers → Browser บล็อก response แม้ server ตอบ 200",
    },
  },
  database: {
    how_it_works: {
      content:
        "1. Application ส่ง query ผ่าน driver/ORM\n2. Database engine parse และ optimize query\n3. ค้นหา/เขียนข้อมูลใน storage (disk/memory)\n4. ใช้ index เพื่อค้นหาเร็วขึ้น\n5. ส่งผลลัพธ์กลับเป็น rows/JSON\n6. Transaction รับประกัน ACID (Atomicity, Consistency, Isolation, Durability)",
    },
    key_components: {
      items: [
        "Table / Collection — โครงสร้างเก็บข้อมูล",
        "Schema — กำหนด column และ type",
        "Index — เร่งการค้นหา",
        "Query Language — SQL หรือ query API",
        "Transaction — ชุด operation ที่สำเร็จหรือล้มเหลวพร้อมกัน",
      ],
    },
    common_confusion: {
      items: [
        "Database ≠ File storage — Database query และ index ได้, file อ่านทั้งไฟล์",
        "SQL ≠ NoSQL — ไม่ใช่ SQL ดีกว่าเสมอ, เลือกตาม use case",
        "Redis เป็น in-memory store — มักใช้ cache มากกว่า primary database",
      ],
    },
  },
  deployment: {
    how_it_works: {
      content:
        "1. Developer push code ไป Git repository\n2. CI/CD pipeline build application (compile, bundle)\n3. รัน automated tests\n4. สร้าง artifact (Docker image, static files)\n5. Deploy ไป server/cloud (rolling update, blue-green)\n6. Health check ยืนยันว่า service ทำงาน\n7. Rollback ถ้า deploy ล้มเหลว",
    },
    common_confusion: {
      items: [
        "Deploy ≠ Release — deploy คือนำ code ขึ้น server, release คือเปิดให้ user ใช้",
        "Staging environment ใช้ทดสอบก่อน production",
        "Zero-downtime deployment ใช้ load balancer สลับ traffic ทีละส่วน",
      ],
    },
  },
  dhcp: {
    real_world_example: {
      content:
        "เชื่อมมือถือ WiFi ที่บ้าน:\n\n1. มือถือส่ง DHCP Discover (broadcast)\n2. Router (DHCP server) ตอบ Offer: 192.168.1.105, mask /24, gateway 192.168.1.1, DNS 8.8.8.8\n3. มือถือส่ง Request ยืนยันใช้ IP นั้น\n4. Router ส่ง Acknowledge — lease 24 ชม.\n5. มือถือออกเน็ตได้ทันทีโดยไม่ต้องตั้ง IP เอง",
    },
  },
  dns: {
    why: {
      content:
        "คนจำ google.com ได้ง่ายกว่า 142.250.80.46 — DNS ทำให้:\n\n- ใช้ชื่อที่จำง่ายแทน IP\n- เปลี่ยน IP server ได้โดย user ไม่ต้องรู้\n- Load balance ด้วยหลาย IP ต่อ domain เดียว\n- เป็นจุดเริ่มต้นทุกการเชื่อมต่อบนเว็บ",
    },
    key_components: {
      items: [
        "A Record — แปลง domain เป็น IPv4",
        "AAAA Record — แปลง domain เป็น IPv6",
        "CNAME — alias ชี้ไป domain อื่น",
        "MX Record — mail server ของ domain",
        "TTL — ระยะเวลา cache DNS",
      ],
    },
    real_world_example: {
      content:
        "พิมพ์ github.com ใน browser:\n\n1. Browser ถาม OS resolver → ถาม router → ถาม ISP DNS\n2. ISP ถาม Root DNS → .com TLD → GitHub authoritative DNS\n3. ได้ IP 140.82.x.x\n4. Browser เชื่อมต่อ IP นั้นด้วย HTTPS\n5. ผลลัพธ์ cache ตาม TTL (เช่น 300 วินาที) — ครั้งถัดไปเร็วขึ้น",
    },
    common_confusion: {
      items: [
        "DNS ≠ DHCP — DNS แปลงชื่อ→IP, DHCP แจก IP",
        "DNS propagation ใช้เวลาเมื่อเปลี่ยน record — ไม่ได้เปลี่ยนทันทีทั่วโลก",
        "8.8.8.8 (Google) และ 1.1.1.1 (Cloudflare) เป็น public DNS resolver",
      ],
    },
  },
  docker: {
    key_components: {
      items: [
        "Image — template อ่านอย่างเดียวสำหรับสร้าง container",
        "Container — instance ที่รัน application",
        "Dockerfile — คำสั่ง build image",
        "Registry — ที่เก็บ image (Docker Hub)",
        "Volume — เก็บข้อมูลถาวรนอก container",
      ],
    },
    real_world_example: {
      content:
        "Deploy Node.js API:\n\n1. เขียน Dockerfile: FROM node:20, COPY code, RUN npm install\n2. docker build -t my-api .\n3. docker run -p 3000:3000 my-api\n4. API รันใน container แยกจาก host — environment เหมือนกันทุกเครื่อง\n5. Push image ไป registry → CI/CD pull และ deploy บน production",
    },
  },
  "edge-computing": {
    how_it_works: {
      content:
        "1. IoT device ส่งข้อมูลไป Edge node (gateway ใกล้ device)\n2. Edge node ประมวลผลเบื้องต้น (filter, aggregate, alert)\n3. ส่งเฉพาะข้อมูลสำคัญไป Cloud สำหรับ analytics ระยะยาว\n4. ตอบกลับ device ได้เร็ว (local decision) โดยไม่รอ cloud\n5. ลด bandwidth และ latency เมื่อเทียบกับส่งทุกอย่างไป cloud",
    },
    key_components: {
      items: [
        "Edge Node / Gateway — ประมวลผลใกล้แหล่งข้อมูล",
        "IoT Device / Sensor — แหล่งข้อมูล",
        "Local Processing — วิเคราะห์บน edge",
        "Cloud Sync — ส่งข้อมูลสรุปขึ้น cloud",
        "Latency Reduction — ตอบสนองเร็วกว่า round-trip ไป cloud",
      ],
    },
  },
  encryption: {
    how_it_works: {
      content:
        "Symmetric (AES):\n- ใช้ key เดียว encrypt/decrypt — เร็ว ใช้เข้ารหัสข้อมูลจำนวนมาก\n\nAsymmetric (RSA, ECC):\n- ใช้ public key encrypt, private key decrypt — ใช้แลก key ใน TLS handshake\n\nTLS ผสมทั้งสอง: asymmetric แลก session key → symmetric เข้ารหัสข้อมูลจริง",
    },
    key_components: {
      items: [
        "Plaintext / Ciphertext — ข้อมูลก่อนและหลังเข้ารหัส",
        "Encryption Key — รหัสลับสำหรับเข้า/ถอดรหัส",
        "Algorithm — AES, RSA, ChaCha20",
        "Certificate — ยืนยัน public key ของ server",
        "End-to-End Encryption — เฉพาะผู้ส่งและผู้รับอ่านได้",
      ],
    },
  },
  firewall: {
    how_it_works: {
      content:
        "1. Packet เข้ามาที่ firewall\n2. ตรวจสอบตาม rules จากบนลงล่าง (first match)\n3. เปรียบเทียบ source/dest IP, port, protocol\n4. Action: Allow, Deny, หรือ Log\n5. Stateful firewall ติดตาม connection state — อนุญาต reply ของ connection ที่เริ่มจากภายใน",
    },
    real_world_example: {
      content:
        "Firewall บริษัท:\n\n- อนุญาต inbound port 443 (HTTPS) จาก internet\n- บล็อก inbound port 22 (SSH) จากภายนอก\n- อนุญาต outbound ทุก port สำหรับพนักงาน\n- บล็อก access ไป social media ในเวลาทำงาน\n- WAF ตรวจ HTTP request ป้องกัน SQL injection",
    },
    common_confusion: {
      items: [
        "Firewall ≠ Antivirus — firewall กรอง traffic, antivirus สแกน malware",
        "Windows Firewall / iptables เป็น host firewall, อุปกรณ์เครือข่ายเป็น network firewall",
        "เปิด port ทุกอันปลอดภัยกว่า — principle of least privilege",
      ],
    },
  },
  git: {
    how_it_works: {
      content:
        "1. git init — สร้าง repository\n2. แก้ไขไฟล์ → git add (stage changes)\n3. git commit — บันทึก snapshot พร้อม message\n4. git push — ส่ง commits ไป remote (GitHub)\n5. git pull — ดึง changes จาก remote\n6. git branch / merge — ทำงานคู่ขนานและรวม code",
    },
    common_confusion: {
      items: [
        "Git ≠ GitHub — Git เป็น tool, GitHub เป็น hosting service",
        "commit ≠ push — commit บันทึก local, push ส่งขึ้น remote",
        "merge conflict เกิดเมื่อสองคนแก้บรรทัดเดียวกัน — ต้องแก้ด้วยมือ",
      ],
    },
  },
  graphql: {
    how_it_works: {
      content:
        "1. Client ส่ง POST /graphql พร้อม query ระบุ fields ที่ต้องการ\n2. GraphQL server parse query\n3. Resolver แต่ละ field ดึงข้อมูลจาก database/service\n4. Server รวมผลลัพธ์เป็น JSON ตรงตาม query\n5. Client ได้เฉพาะ fields ที่ขอ — ไม่ over-fetch หรือ under-fetch",
    },
    key_components: {
      items: [
        "Query — อ่านข้อมูล",
        "Mutation — เขียน/แก้ไขข้อมูล",
        "Schema — กำหนด type และ fields",
        "Resolver — function ดึงข้อมูลแต่ละ field",
        "Single Endpoint — มักใช้ POST /graphql เดียว",
      ],
    },
    real_world_example: {
      content:
        "Mobile app ต้องการ user name และ posts:\n\nREST: GET /users/1 แล้ว GET /users/1/posts — 2 requests, ได้ข้อมูลเกิน\n\nGraphQL:\n```\nquery { user(id: 1) { name posts { title } } }\n```\n→ 1 request, ได้เฉพาะ name และ posts.title",
    },
  },
  hashing: {
    key_components: {
      items: [
        "Hash Function — แปลง input เป็น fixed-size output",
        "Salt — random string เพิ่มก่อน hash password",
        "One-way — ถอนกลับไม่ได้",
        "Collision Resistance — input ต่างกันได้ hash ซ้ำยาก",
        "Algorithm — SHA-256, bcrypt, Argon2",
      ],
    },
    real_world_example: {
      content:
        "เก็บ password ใน Database:\n\n1. User สมัครด้วย password \"hello123\"\n2. Server สร้าง salt แบบ random\n3. Hash ด้วย bcrypt(salt + password) → $2b$12$...\n4. เก็บเฉพาะ hash + salt ใน DB — ไม่เก็บ password จริง\n5. Login: hash password ที่กรอก + salt แล้วเปรียบเทียบกับที่เก็บ",
    },
  },
  http: {
    real_world_example: {
      content:
        "เปิดหน้าข่าว bbc.com:\n\n1. Browser ส่ง GET https://bbc.com/news HTTP/1.1\n2. Headers: Host, User-Agent, Accept, Cookie\n3. Server ตอบ 200 OK + HTML\n4. Browser parse HTML → พบ <link> CSS และ <script> JS\n5. ส่ง GET requests เพิ่มสำหรับ assets ทั้งหมด\n6. Render หน้าข่าวที่เห็นบนหน้าจอ",
    },
  },
  https: {
    how_it_works: {
      content:
        "1. Client ส่ง ClientHello (TLS version, cipher suites)\n2. Server ตอบ ServerHello + Certificate\n3. Client ตรวจ certificate กับ CA\n4. แลก session key (encrypted)\n5. ส่ง HTTP request ผ่าน encrypted channel\n6. Server ตอบ encrypted HTTP response",
    },
    key_components: {
      items: [
        "TLS Handshake — ตั้ง encrypted connection",
        "SSL Certificate — ยืนยันตัวตน server",
        "Port 443 — default สำหรับ HTTPS",
        "Padlock Icon — browser แสดงเมื่อ connection ปลอดภัย",
        "HSTS — บังคับใช้ HTTPS ต่อเนื่อง",
      ],
    },
    real_world_example: {
      content:
        "Login ธนาคารออนไลน์:\n\n1. พิมพ์ https://bank.com — browser ตรวจ certificate\n2. TLS handshake สร้าง encrypted tunnel\n3. กรอก username/password — ส่งผ่าน encrypted HTTP POST\n4. คนแทรกกลางอ่าน packet ไม่ได้ (เห็นแค่ encrypted data)\n5. Server ตอบ session cookie ผ่าน encrypted channel",
    },
    common_confusion: {
      items: [
        "HTTPS ≠ ปลอดภัย 100% — ยังโดน phishing site ที่มี certificate ได้",
        "Self-signed certificate — browser แจ้งเตือน, ไม่เหมาะ production",
        "HTTP redirect ไป HTTPS — ควรใช้ 301 + HSTS",
      ],
    },
  },
  jwt: {
    real_world_example: {
      content:
        "Login API แล้วเรียก protected endpoint:\n\n1. POST /login {email, password} → ได้ JWT\n2. JWT มี 3 ส่วน: header.payload.signature (base64)\n3. เก็บ JWT ใน localStorage หรือ httpOnly cookie\n4. GET /api/profile Header: Authorization: Bearer <jwt>\n5. Server verify signature → อ่าน userId จาก payload → ตอบข้อมูล profile",
    },
  },
  kubernetes: {
    how_it_works: {
      content:
        "1. ส่ง manifest (YAML) ไป API server\n2. Scheduler เลือก node ที่เหมาะสม\n3. kubelet บน node สร้าง pod จาก container image\n4. Service ให้ stable IP/DNS สำหรับ pods\n5. Ingress จัดการ external traffic\n6. Controller รักษา desired state — ถ้า pod ตาย สร้างใหม่",
    },
    real_world_example: {
      content:
        "Deploy web app 3 replicas:\n\n```yaml\nreplicas: 3\nimage: myapp:v2\n```\n\n- K8s สร้าง 3 pods กระจายบน nodes\n- 1 pod crash → K8s สร้างใหม่อัตโนมัติ\n- Rolling update: deploy v3 ทีละ pod — zero downtime\n- Horizontal Pod Autoscaler เพิ่ม pods เมื่อ CPU สูง",
    },
  },
  llm: {
    key_components: {
      items: [
        "Transformer Architecture — โครงสร้างหลักของ LLM สมัยใหม่",
        "Token — หน่วยข้อความที่ model ประมวลผล",
        "Context Window — จำนวน token สูงสุดต่อ request",
        "Prompt — คำสั่ง/ข้อความ input",
        "Fine-tuning — ปรับ model สำหรับ domain เฉพาะ",
      ],
    },
    real_world_example: {
      content:
        "ใช้ ChatGPT ช่วยเขียน code:\n\n1. ส่ง prompt: \"เขียน Python function เรียง list\"\n2. LLM แปลงข้อความเป็น tokens\n3. ทำนาย token ถัดไปทีละตัว (autoregressive)\n4. ตอบกลับเป็น code พร้อมคำอธิบาย\n5. Token limit กำหนดความยาว conversation ได้",
    },
  },
  "load-balancer": {
    how_it_works: {
      content:
        "1. Client ส่ง request ไป IP ของ load balancer (VIP)\n2. LB เลือก backend server ตาม algorithm (round-robin, least connections)\n3. Forward request ไป server ที่เลือก\n4. Server ตอบกลับผ่าน LB → client\n5. Health check ตรวจ server — ถอด server ที่ล้มออกจาก pool",
    },
    real_world_example: {
      content:
        "เว็บขายของช่วง flash sale:\n\n- 3 app servers หลัง load balancer เดียว\n- LB แจก traffic round-robin\n- Server 2 ล้ม → health check ตรวจพบ → ไม่ส่ง traffic ไป\n- เพิ่ม server 4 ชั่วคราว → register กับ LB\n- User เห็น domain เดียว ไม่รู้ว่ามีหลาย server",
    },
    common_confusion: {
      items: [
        "Load Balancer ≠ Reverse Proxy — LB เน้นกระจาย load, proxy เน้น forward/cache",
        "Layer 4 LB ดู IP/port, Layer 7 LB ดู HTTP path/header",
        "AWS ALB, Nginx, HAProxy เป็น load balancer ยอดนิยม",
      ],
    },
  },
  "machine-learning": {
    key_components: {
      items: [
        "Training Data — ข้อมูลสำหรับสอน model",
        "Features — ตัวแปร input ที่ model ใช้",
        "Model — สมการ/โครงข่ายที่เรียนรู้จาก data",
        "Loss Function — วัดว่า model พลาดแค่ไหน",
        "Inference — ใช้ model ทำนายข้อมูลใหม่",
      ],
    },
    real_world_example: {
      content:
        "ระบบแนะนำสินค้า:\n\n1. เก็บประวัติการซื้อและ click ของ user\n2. Train model หา pattern \"คนซื้อ A มักซื้อ B\"\n3. Deploy model บน server\n4. User เปิดหน้าสินค้า A → model แนะนำ B, C\n5. Retrain เป็นระยะด้วยข้อมูลใหม่",
    },
    common_confusion: {
      items: [
        "ML ≠ AI — ML เป็นสาขาย่อยของ AI",
        "Training ≠ Inference — training ใช้เวลานาน, inference ต้องเร็ว",
        "Overfitting — model จำ training data แต่ทำนายข้อมูลใหม่ไม่ได้",
      ],
    },
  },
  mqtt: {
    real_world_example: {
      content:
        "Smart home temperature sensor:\n\n1. Sensor publish ไป topic home/living-room/temp ทุก 30 วินาที\n2. MQTT broker (เช่น Mosquitto) รับและกระจาย\n3. Mobile app subscribe topic นั้น — ได้ค่าอุณหภูมิ real-time\n4. ถ้า temp > 30°C → automation subscribe แล้วเปิดแอร์\n5. QoS 1 รับประกันว่า message ถึง broker อย่างน้อยครั้งหลง",
    },
  },
  nat: {
    how_it_works: {
      content:
        "1. Device ใน LAN (192.168.1.50) ส่ง packet ไป internet\n2. Router แทนที่ source IP เป็น public IP ของ router\n3. บันทึก mapping ใน NAT table (private IP:port ↔ public port)\n4. Response กลับมาที่ public IP → router แปลงกลับเป็น private IP\n5. ส่งต่อให้ device ที่ถูกต้อง",
    },
    key_components: {
      items: [
        "Private IP — ที่อยู่ภายใน LAN (192.168.x.x)",
        "Public IP — ที่อยู่บน internet จาก ISP",
        "NAT Table — mapping connection",
        "Port Forwarding — ชี้ inbound port เข้า device เฉพาะ",
        "PAT/NAPT — หลาย private IP ใช้ public IP เดียว",
      ],
    },
    real_world_example: {
      content:
        "บ้านมี 5 อุปกรณ์ แต่ ISP ให้ IP เดียว:\n\n- ทุกเครื่องได้ private IP จาก router (DHCP)\n- ออกเน็ตผ่าน NAT — internet เห็น IP เดียวของ router\n- เล่นเกม online: router ใช้ NAT table ส่ง response กลับเครื่องที่ถูก\n- เปิด port 25565 สำหรับ Minecraft server → port forwarding",
    },
  },
  "neural-network": {
    real_world_example: {
      content:
        "จำแนกรูปแมว vs สุนัข:\n\n1. Input: รูป 224×224 pixels\n2. Convolutional layers ดึง features (หู, จมูก, ขน)\n3. Fully connected layers รวม features\n4. Output layer: ความน่าจะเป็น [แมว: 0.92, สุนัข: 0.08]\n5. Train ด้วยรูปที่ label แล้ว — ปรับ weights ลด error",
    },
    common_confusion: {
      items: [
        "Neural Network ≠ LLM — LLM เป็น neural network ขนาดใหญ่สำหรับภาษา",
        "Deep Learning = neural network หลาย layer",
        "Black box — อธิบายว่าทำไมทำนายแบบนั้นได้ยาก",
      ],
    },
  },
  nosql: {
    how_it_works: {
      content:
        "1. Application ส่ง document/key-value query\n2. NoSQL engine ค้นหาตาม key, index หรือ aggregation pipeline\n3. ไม่บังคับ schema — เพิ่ม field ได้ยืดหยุ่น\n4. Scale แนวนอน (sharding) ง่ายกว่า SQL บางกรณี\n5. Trade-off: ยืดหยุ่นและ scale ได้ดี แต่ transaction ซับซ้อนกว่า SQL",
    },
    key_components: {
      items: [
        "Document Store — MongoDB (JSON-like documents)",
        "Key-Value Store — Redis, DynamoDB",
        "Column Store — Cassandra",
        "Graph Database — Neo4j",
        "Flexible Schema — ไม่ต้องกำหนด column ล่วงหน้า",
      ],
    },
    real_world_example: {
      content:
        "MongoDB เก็บ user profiles:\n\n```json\n{ \"_id\": 1, \"name\": \"Alice\", \"tags\": [\"dev\", \"music\"] }\n{ \"_id\": 2, \"name\": \"Bob\", \"company\": \"Acme\" }\n```\n\n- Document แต่ละอันมี structure ต่างกันได้\n- Query: db.users.find({ tags: \"dev\" })\n- เหมาะข้อมูลที่ structure เปลี่ยนบ่อย",
    },
  },
  oauth: {
    key_components: {
      items: [
        "Authorization Server — ออก token (Google, GitHub)",
        "Resource Server — API ที่ป้องกันด้วย token",
        "Client App — แอปที่ขอเข้าถึง",
        "Authorization Code — code ชั่วคราวแลก token",
        "Scope — สิทธิ์ที่ขอ (email, profile)",
      ],
    },
    real_world_example: {
      content:
        "\"Login with Google\" บนเว็บ:\n\n1. เว็บ redirect ไป accounts.google.com\n2. User login และอนุญาต scope ที่ขอ\n3. Google redirect กลับพร้อม authorization code\n4. Backend แลก code เป็น access token (client secret ใช้ฝั่ง server)\n5. ใช้ token ดึง profile — ไม่ต้องเก็บ Google password",
    },
  },
  orm: {
    how_it_works: {
      content:
        "1. กำหนด Model class map กับ table (User → users)\n2. ORM แปลง method เป็น SQL: User.findAll() → SELECT * FROM users\n3. Object ใน code ↔ row ใน database\n4. Relationship: user.posts → JOIN query อัตโนมัติ\n5. Migration จัดการ schema changes",
    },
    key_components: {
      items: [
        "Model — class แทน table",
        "Query Builder — สร้าง SQL จาก method chain",
        "Migration — version control สำหรับ schema",
        "Relationship Mapping — hasMany, belongsTo",
        "N+1 Problem — query ซ้ำเมื่อ load relations (ใช้ eager loading แก้)",
      ],
    },
    common_confusion: {
      items: [
        "ORM ≠ Database — ORM เป็น abstraction layer บน SQL database",
        "Raw SQL ยังใช้ได้เมื่อ query ซับซ้อน",
        "Prisma, Sequelize, Hibernate เป็น ORM ยอดนิยม",
      ],
    },
  },
  proxy: {
    how_it_works: {
      content:
        "1. Client ตั้ง proxy address แทนเชื่อมตรง server\n2. Client ส่ง request ไป proxy\n3. Proxy forward request ไป server จริง (อาจแก้ headers)\n4. Server ตอบ proxy → proxy ส่งต่อ client\n5. Forward proxy: อยู่ฝั่ง client, Reverse proxy: อยู่ฝั่ง server",
    },
    key_components: {
      items: [
        "Forward Proxy — แทน client ออก internet",
        "Reverse Proxy — รับ request แทน backend servers",
        "Caching — เก็บ response ลด load",
        "SSL Termination — ถอดรหัส HTTPS ที่ proxy",
        "Nginx, Squid — proxy software ยอดนิยม",
      ],
    },
    real_world_example: {
      content:
        "บริษัทใช้ forward proxy:\n\n- พนักงานเข้า internet ผ่าน proxy เท่านั้น\n- Proxy บล็อกเว็บที่ไม่เกี่ยวข้อง\n- Log การเข้าเว็บทั้งหมด\n\nNginx reverse proxy:\n\n- Client เห็น nginx.com เท่านั้น\n- Nginx กระจายไป 3 backend servers\n- Cache static files ลด load backend",
    },
  },
  rag: {
    key_components: {
      items: [
        "Document Store — แหล่งความรู้ (PDF, wiki, database)",
        "Embedding — แปลงข้อความเป็น vector",
        "Vector Database — ค้นหาเอกสารที่ใกล้เคียง",
        "Retriever — ดึง context ที่เกี่ยวข้อง",
        "LLM — สร้างคำตอบจาก context + prompt",
      ],
    },
    common_confusion: {
      items: [
        "RAG ≠ Fine-tuning — RAG ดึงข้อมูลภายนอก, fine-tuning เปลี่ยน model",
        "RAG ลด hallucination — ตอบจากเอกสารจริง",
        "Chunk size ส่งผลต่อความแม่นยำของ retrieval",
      ],
    },
  },
  redis: {
    how_it_works: {
      content:
        "1. Client ส่ง command (SET, GET, HSET) ผ่าน TCP\n2. Redis ประมวลผลใน memory — ตอบใน microsecond\n3. Optional persistence (RDB snapshot, AOF log)\n4. รองรับ data structures: string, hash, list, set, sorted set\n5. Pub/Sub และ TTL สำหรับ cache expiration",
    },
    key_components: {
      items: [
        "In-Memory Store — ข้อมูลใน RAM เร็วมาก",
        "Key-Value — GET/SET พื้นฐาน",
        "TTL — หมดอายุอัตโนมัติ (cache)",
        "Pub/Sub — publish/subscribe messaging",
        "Persistence — RDB / AOF กู้ข้อมูลหลัง restart",
      ],
    },
  },
  rest: {
    how_it_works: {
      content:
        "1. Resource แต่ละอย่างมี URI (เช่น /users/1)\n2. HTTP method กำหนด action: GET อ่าน, POST สร้าง, PUT/PATCH แก้, DELETE ลบ\n3. Stateless — ทุก request มีข้อมูลครบ ไม่พึ่ง session บน server\n4. Response มักเป็น JSON + status code\n5. HATEOAS (optional) — response มี links ไป resource ที่เกี่ยวข้อง",
    },
    real_world_example: {
      content:
        "REST API สำหรับ blog:\n\n- GET /posts — รายการโพสต์\n- GET /posts/42 — โพสต์ id 42\n- POST /posts — สร้างโพสต์ใหม่\n- PUT /posts/42 — แก้โพสต์\n- DELETE /posts/42 — ลบโพสต์\n\nStatus: 200 OK, 201 Created, 404 Not Found",
    },
  },
  saas: {
    how_it_works: {
      content:
        "1. Provider สร้าง software บน cloud infrastructure\n2. User สมัครผ่านเว็บ — ไม่ต้องติดตั้ง\n3. Multi-tenant: หลายลูกค้าใช้ instance เดียว แยก data\n4. จ่าย subscription รายเดือน/ปี\n5. Provider ดูแล update, security, scaling",
    },
    key_components: {
      items: [
        "Multi-tenancy — ลูกค้าหลายรายใช้ platform เดียว",
        "Subscription — จ่ายรายเดือนแทนซื้อขาด",
        "Cloud-hosted — เข้าถึงผ่าน browser",
        "Automatic Updates — provider อัปเดตให้",
        "SLA — ข้อตกลง uptime และ support",
      ],
    },
    real_world_example: {
      content:
        "ใช้ Slack ในบริษัท:\n\n- ไม่ต้องติดตั้ง server เอง\n- สมัคร workspace → invite ทีม\n- จ่ายต่อ user/เดือน\n- Slack อัปเดต feature ให้อัตโนมัติ\n- ข้อมูลแยกตาม workspace (tenant)",
    },
  },
  sensor: {
    key_components: {
      items: [
        "Transducer — แปลง physical signal เป็น electrical",
        "Analog/Digital Output — ค่าที่อ่านได้",
        "Sampling Rate — ความถี่ในการวัด",
        "Calibration — ปรับค่าให้แม่นยำ",
        "IoT Gateway — ส่งข้อมูล sensor ขึ้น cloud",
      ],
    },
    real_world_example: {
      content:
        "Smart farm วัดความชื้นดิน:\n\n1. Soil moisture sensor วัดทุก 5 นาที\n2. ส่งค่าผ่าน MQTT ไป gateway\n3. ถ้าความชื้น < 30% → สั่งเปิดสปริงเกอร์\n4. ข้อมูลสะสมใน cloud สำหรับ dashboard\n5. Farmer ดูกราฟผ่าน mobile app",
    },
    common_confusion: {
      items: [
        "Sensor ≠ Actuator — sensor วัด, actuator ทำ action (มอเตอร์, สปริงเกอร์)",
        "IoT sensor มักใช้พลังงานต่ำและส่งข้อมูลเป็นระยะ",
        "Edge processing ลดการส่งข้อมูลดิบทั้งหมดขึ้น cloud",
      ],
    },
  },
  serverless: {
    how_it_works: {
      content:
        "1. เขียน function (เช่น AWS Lambda handler)\n2. Upload ไป cloud provider\n3. กำหนด trigger (HTTP, queue, schedule)\n4. เมื่อมี event → provider spin up container รัน function\n5. จ่ายตาม execution time (ms) และ memory\n6. Scale อัตโนมัติ — 0 ถึง thousands concurrent",
    },
    key_components: {
      items: [
        "Function — โค้ดที่รันเมื่อมี event",
        "Trigger — HTTP, S3 upload, cron, queue message",
        "Cold Start — delay ครั้งแรกหลัง idle",
        "Pay-per-use — จ่ายตาม invocation + duration",
        "AWS Lambda, Cloudflare Workers — ตัวอย่าง platform",
      ],
    },
  },
  smtp: {
    key_components: {
      items: [
        "Mail Client — ส่งอีเมล (Outlook, Gmail app)",
        "SMTP Server — รับและส่งต่ออีเมล",
        "MX Record — DNS บอก mail server ของ domain",
        "Port 25/587 — SMTP ports (587 ใช้ TLS)",
        "IMAP/POP3 — ดึงอีเมลฝั่งผู้รับ",
      ],
    },
    real_world_example: {
      content:
        "ส่งอีเมลจาก you@gmail.com ไป friend@company.com:\n\n1. Gmail SMTP รับอีเมลจากคุณ\n2. ถาม DNS MX ของ company.com\n3. ส่งต่อไป mail server ของ company.com\n4. friend ดึงอีเมลด้วย IMAP\n5. SPF/DKIM ช่วยป้องกัน spam และปลอม sender",
    },
    common_confusion: {
      items: [
        "SMTP ส่งอีเมล, IMAP/POP3 รับอีเมล",
        "SMTP ≠ HTTP — คนละ protocol คนละ port",
        "Port 25 มักถูก ISP บล็อก — ใช้ 587 + TLS แทน",
      ],
    },
  },
  sql: {
    how_it_works: {
      content:
        "1. เขียน SQL query: SELECT name FROM users WHERE age > 18\n2. Query parser ตรวจ syntax\n3. Query optimizer เลือก execution plan (ใช้ index ไหม)\n4. Engine อ่านข้อมูลจาก disk/memory\n5. ส่ง result set กลับเป็น table rows\n6. INSERT/UPDATE/DELETE เปลี่ยนข้อมูลใน transaction",
    },
    real_world_example: {
      content:
        "E-commerce ดึงสินค้าขายดี:\n\n```sql\nSELECT p.name, SUM(o.quantity) AS sold\nFROM products p\nJOIN order_items o ON p.id = o.product_id\nGROUP BY p.id\nORDER BY sold DESC\nLIMIT 10;\n```\n\n→ 10 สินค้าที่ขายมากสุด จาก join 3 tables",
    },
  },
  sse: {
    how_it_works: {
      content:
        "1. Client เปิด EventSource ไป GET /events\n2. Server ตอบ Content-Type: text/event-stream\n3. Connection ค้างไว้ — server push event เป็น text:\n   data: {\"price\": 100}\n\n4. Client รับ event ผ่าน onmessage\n5. Connection ปิดเมื่อ client ปิดหรือ timeout",
    },
    key_components: {
      items: [
        "EventSource API — browser API สำหรับ SSE",
        "text/event-stream — content type",
        "Unidirectional — server → client เท่านั้น",
        "Auto Reconnect — browser reconnect เมื่อขาด",
        "Event ID — รองรับ resume หลัง reconnect",
      ],
    },
    real_world_example: {
      content:
        "Dashboard ราคาหุ้น real-time:\n\n1. Browser เปิด EventSource('/api/stocks/stream')\n2. Server push ราคาใหม่ทุกวินาที\n3. JavaScript อัปเดตกราฟโดยไม่ refresh หน้า\n4. ง่ายกว่า WebSocket สำหรับ one-way push\n5. ทำงานผ่าน HTTP/2 ได้ดี",
    },
  },
  tcp: {
    key_components: {
      items: [
        "Three-Way Handshake — SYN, SYN-ACK, ACK",
        "Sequence Number — เรียงลำดับ packet",
        "Acknowledgment — ยืนยันการรับ",
        "Port — แยก service (80 HTTP, 443 HTTPS)",
        "Connection State — ESTABLISHED, CLOSE_WAIT",
      ],
    },
    real_world_example: {
      content:
        "ดาวน์โหลดไฟล์ 100MB:\n\n1. TCP handshake สร้าง connection\n2. Server แบ่งไฟล์เป็น packets ส่งทีละส่วน\n3. Client ACK ทุก packet ที่รับถูก\n4. Packet หาย → TCP retransmit\n5. ครบทุก packet → ประกอบไฟล์สมบูรณ์\n6. FIN handshake ปิด connection",
    },
  },
  tls: {
    how_it_works: {
      content:
        "TLS Handshake (simplified):\n\n1. ClientHello — ส่ง supported ciphers\n2. ServerHello + Certificate\n3. Client ตรวจ certificate, สร้าง pre-master secret\n4. ทั้งสองฝั่ง derive session keys\n5. Finished messages ยืนยัน handshake\n6. ส่ง application data ผ่าน symmetric encryption",
    },
    real_world_example: {
      content:
        "เปิด https://google.com:\n\n1. Browser ตรวจ certificate ออกโดย Google Trust Services\n2. TLS 1.3 handshake เสร็จใน ~50ms\n3. ทุก HTTP request/response เข้ารหัส\n4. Padlock แสดงใน address bar\n5. Certificate หมดอายุทุก ~90 วัน — ต้อง renew (มักอัตโนมัติด้วย Let's Encrypt)",
    },
    common_confusion: {
      items: [
        "TLS แทน SSL — SSL 3.0 ล้าสมัย, ใช้ TLS 1.2+",
        "TLS ≠ HTTPS — TLS เป็น protocol, HTTPS คือ HTTP over TLS",
        "Self-signed cert ใช้ทดสอบได้ แต่ browser ไม่ trust",
      ],
    },
  },
  udp: {
    how_it_works: {
      content:
        "1. Application ส่ง datagram พร้อม port ปลายทาง\n2. UDP เพิ่ม header (source port, dest port, length, checksum)\n3. ส่งทันที — ไม่มี handshake\n4. ปลายทางรับได้หรือไม่ก็ได้ — ไม่มี ACK\n5. Application ต้องจัดการ reliability เองถ้าต้องการ",
    },
    key_components: {
      items: [
        "Datagram — หน่วยส่งอิสระ ไม่เชื่อมต่อ",
        "Port — แยก application (53 DNS, 53 UDP)",
        "Checksum — ตรวจ error (optional ใน IPv4)",
        "No Connection State — ไม่ติดตาม session",
        "Low Latency — ไม่มี handshake overhead",
      ],
    },
    real_world_example: {
      content:
        "Video call (Zoom/Meet):\n\n- เสียง/ภาพส่ง UDP — สูญหาย frame นึงยอมรับได้\n- ความล่าช้าต่ำสำคัญกว่าความครบถ้วน\n- ถ้าใช้ TCP: packet หายต้องรอ retransmit → ภาพค้าง\n- DNS query ก็ใช้ UDP — ข้อความสั้น, ต้องการความเร็ว",
    },
  },
  vpn: {
    how_it_works: {
      content:
        "1. Client ติดตั้ง VPN software\n2. สร้าง encrypted tunnel ไป VPN server\n3. Traffic ทั้งหมด (หรือบางส่วน) ส่งผ่าน tunnel\n4. VPN server decrypt แล้ว forward ไป internet\n5. Response กลับผ่าน tunnel — ISP เห็นแค่ VPN server IP",
    },
    key_components: {
      items: [
        "VPN Client — software บนอุปกรณ์",
        "VPN Server — ปลายทาง tunnel",
        "Encrypted Tunnel — WireGuard, OpenVPN, IPSec",
        "Tunnel Interface — virtual network adapter",
        "Split Tunneling — บาง traffic ผ่าน VPN บางส่วนไม่ผ่าน",
      ],
    },
    real_world_example: {
      content:
        "ทำงานจากบ้าน เข้า corporate network:\n\n1. เปิด VPN client → เชื่อม office VPN server\n2. Traffic ไป internal tools (Jira, Git) ผ่าน encrypted tunnel\n3. เข้าถึง resource ที่ block จาก public internet\n4. IT policy บังคับ VPN ก่อนเข้าระบบภายใน\n5. Public WiFi ปลอดภัยขึ้น — traffic เข้ารหัสถึง VPN server",
    },
  },
  websocket: {
    key_components: {
      items: [
        "Upgrade Header — HTTP → WebSocket handshake",
        "Full-Duplex — ส่งรับพร้อมกันสองทาง",
        "Persistent Connection — ไม่ปิดหลังแต่ละ message",
        "ws:// / wss:// — protocol (wss = secure)",
        "Frame — หน่วยข้อมูลย่อยใน connection",
      ],
    },
    real_world_example: {
      content:
        "แชท real-time ในเว็บ:\n\n1. HTTP upgrade เป็น WebSocket ที่ wss://chat.app/ws\n2. Connection ค้างไว้ตลอด session\n3. ส่งข้อความทันทีทั้งสองฝั่ง — ไม่ต้อง poll\n4. Server push typing indicator, online status\n5. ปิด tab → connection ปิด",
    },
  },
};

function mergeSections(existing, additions) {
  const byType = new Map(existing.map((s) => [s.type, s]));

  for (const [type, section] of Object.entries(additions)) {
    if (!byType.has(type)) {
      byType.set(type, { type, ...section });
    }
  }

  return SECTION_ORDER.filter((t) => byType.has(t)).map((t) => byType.get(t));
}

function fixTyposInValue(value) {
  if (typeof value === "string") {
    return value.replaceAll("อนุญาิ", "อนุญาต");
  }
  if (Array.isArray(value)) {
    return value.map(fixTyposInValue);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, fixTyposInValue(v)]),
    );
  }
  return value;
}

// Enrich concepts
const conceptsDir = path.join(dataDir, "concepts");
let enrichedCount = 0;

for (const file of fs.readdirSync(conceptsDir).filter((f) => f.endsWith(".json"))) {
  const filePath = path.join(conceptsDir, file);
  let concept = JSON.parse(fs.readFileSync(filePath, "utf8"));
  concept = fixTyposInValue(concept);

  const supplement = SUPPLEMENTS[concept.slug];
  if (supplement) {
    const before = concept.sections.length;
    concept.sections = mergeSections(concept.sections, supplement);
    if (concept.sections.length > before) enrichedCount++;
  }

  fs.writeFileSync(filePath, `${JSON.stringify(concept, null, 2)}\n`);
}

// Fix typos in visualizations, scenarios, categories
for (const sub of ["visualizations", "scenarios"]) {
  const dir = path.join(dataDir, sub);
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    const filePath = path.join(dir, file);
    const data = fixTyposInValue(JSON.parse(fs.readFileSync(filePath, "utf8")));
    fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
  }
}

console.log(`Enriched ${enrichedCount} concept files`);
console.log("Fixed typos across concepts, visualizations, and scenarios");
