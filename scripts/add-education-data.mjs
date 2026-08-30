/**
 * Adds prerequisites, analogies, and startHere to categories.
 * Run: node scripts/add-education-data.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const conceptsDir = path.join(__dirname, "..", "data", "concepts");
const categoriesPath = path.join(__dirname, "..", "data", "categories.json");

const PREREQUISITES = {
  https: ["http", "tcp"],
  tls: ["https", "encryption"],
  graphql: ["api", "http", "json"],
  rest: ["api", "http"],
  websocket: ["http", "tcp"],
  jwt: ["authentication", "json"],
  oauth: ["authentication", "api"],
  authorization: ["authentication"],
  "git-commit": ["git-add", "git"],
  "git-merge": ["git-branch", "git-commit"],
  "git-rebase": ["git-branch", "git-commit"],
  "git-push": ["git-commit", "git-remote"],
  "git-pull": ["git-fetch", "git-merge"],
  "git-diff": ["git-status"],
  "git-stash": ["git-commit"],
  "github-pr": ["git-push", "git-branch"],
  kubernetes: ["docker", "deployment"],
  terraform: ["cloud-computing"],
  rag: ["llm", "embedding", "api"],
  "fine-tuning": ["llm", "machine-learning"],
  embedding: ["llm", "neural-network"],
  redis: ["database", "sql"],
  nosql: ["database"],
  orm: ["sql", "database"],
  "load-balancer": ["http", "tcp"],
  cdn: ["http", "dns"],
  cors: ["http", "api"],
  subnetting: ["ip"],
  arp: ["ip"],
  nat: ["ip", "router"],
  vpn: ["ip", "encryption"],
  dhcp: ["ip"],
  smtp: ["tcp"],
  sse: ["http"],
  "object-storage": ["cloud-computing"],
  serverless: ["cloud-computing", "api"],
  "virtual-machine": ["cloud-computing"],
  monitoring: ["deployment"],
  logging: ["deployment"],
  "ci-cd": ["git", "deployment"],
  "iot-gateway": ["mqtt", "sensor"],
  lorawan: ["iot-gateway", "sensor"],
  coap: ["mqtt", "sensor"],
  "edge-computing": ["sensor", "cloud-computing"],
  "git-checkout": ["git-branch"],
  curl: ["http"],
  wget: ["curl"],
  scp: ["ssh"],
  dig: ["dns"],
  nslookup: ["dns"],
  traceroute: ["ip", "ping"],
  netstat: ["tcp"],
  "win-dir": ["win-cd"],
  "win-type": ["win-dir"],
  "win-findstr": ["win-dir"],
  "heap": ["tree", "array"],
  queue: ["stack"],
  "linked-list": ["array"],
  "hash-table": ["array"],
  "graph-structure": ["tree"],
  oop: ["data-structure"],
  gpu: ["cpu"],
  ram: ["cpu"],
  storage: ["cpu"],
  motherboard: ["cpu"],
  "bios-uefi": ["boot-process"],
  router: ["nic", "ip"],
  switch: ["nic"],
  esp32: ["arduino", "sensor"],
  "raspberry-pi": ["cpu", "storage"],
  raid: ["storage"],
  "rack-server": ["cpu", "ram", "storage"],
  "secure-boot": ["bios-uefi", "tpm"],
  tpm: ["bios-uefi"],
  "hypervisor-host": ["cpu", "ram", "virtual-machine"],
};

const ANALOGIES = {
  dns: "DNS เหมือนสมุดโทรศัพท์ — คุณจำชื่อเพื่อน (domain) แต่โทรศัพท์ต้องกดเบอร์ (IP)",
  dhcp: "DHCP เหมือนพนักงานรับแขกที่โรงแรม — แจกหมายเลขห้อง (IP) ให้อัตโนมัติเมื่อเช็คอิน",
  "load-balancer": "Load balancer เหมือนพนักงานรับแขกที่แจกคิว — ส่งลูกค้าไปเคาน์เตอร์ที่ว่างที่สุด",
  cache: "Cache เหมือนโต๊ะข้างเครื่อง — เก็บของที่ใช้บ่อยไว้ใกล้มือ ไม่ต้องเดินไปห้องเก็บของทุกครั้ง",
  "git-branch": "Git branch เหมือนสำเนาเอกสาร — แก้สำเนาโดยไม่กระทบต้นฉบับ จนกว่าจะ merge กลับ",
  api: "API เหมือนเมนูอาหาร — บอกว่าสั่งอะไรได้ (endpoints) โดยไม่ต้องเข้าไปในครัว (backend)",
  firewall: "Firewall เหมือนยามประตู — ตรวจว่าใครเข้า-ออกได้ ตามกฎที่ตั้งไว้",
  proxy: "Proxy เหมือนคนกลางส่งข้อความ — คุณไม่คุยกับปลายทางโดยตรง แต่ผ่านตัวแทน",
  mqtt: "MQTT broker เหมือนวิทยุสื่อสาร — คนพูด (publish) ทุกคนที่ฟังช่องนั้น (subscribe) ได้ยิน",
  redis: "Redis เหมือนกระดานไวท์บอร์ดในห้อง — ทุกคนอ่าน/เขียนได้เร็ว แต่ข้อมูลหายเมื่อลบ",
  docker: "Docker container เหมือนห้องในโรงแรม — แยกกัน มีของครบในห้อง ย้ายไปตึกอื่น (server) ได้",
  oauth: "OAuth เหมือนบัตรแขก — Google ยืนยันตัวตนให้ แล้วเว็บอื่นให้เข้าได้โดยไม่รู้ password",
  jwt: "JWT เหมือนตั๋วคอนเสิร์ตที่มีลายน้ำ — ถือตั๋วเข้าได้ ปลอมยากเพราะมีลายเซ็น",
  tcp: "TCP เหมือนโทรศัพท์ — โทรก่อน (handshake) คุยจบก่อนวางสาย มั่นใจว่าคู่สนทนาได้ยิน",
  udp: "UDP เหมือนส่งจดหมายเปล่า — โยนเข้าตู้ไปเลย เร็วแต่ไม่รู้ว่าถึงหรือเปล่า",
};

const START_HERE = {
  network: ["http", "dns", "tcp"],
  programming: ["api", "json", "data-structure"],
  database: ["database", "sql"],
  security: ["authentication", "authorization", "https"],
  ai: ["llm", "machine-learning"],
  cloud: ["cloud-computing", "docker"],
  devops: ["git", "ci-cd", "docker"],
  iot: ["sensor", "mqtt"],
  cli: ["pwd", "ls", "cd"],
  "git-github": ["git", "git-commit", "git-branch"],
  hardware: ["cpu", "motherboard", "boot-process"],
};

let conceptUpdates = 0;

for (const file of fs.readdirSync(conceptsDir).filter((f) => f.endsWith(".json"))) {
  const filePath = path.join(conceptsDir, file);
  const concept = JSON.parse(fs.readFileSync(filePath, "utf8"));
  let changed = false;

  const prereqs = PREREQUISITES[concept.slug];
  if (prereqs && JSON.stringify(concept.prerequisites) !== JSON.stringify(prereqs)) {
    concept.prerequisites = prereqs;
    changed = true;
  }

  const analogy = ANALOGIES[concept.slug];
  if (analogy) {
    const hasAnalogy = concept.sections?.some((s) => s.type === "analogy");
    if (!hasAnalogy) {
      concept.sections = [
        ...(concept.sections ?? []).filter((s) => s.type !== "analogy"),
        { type: "analogy", content: analogy },
      ];
      // reorder: put analogy after what_is
      const order = ["what_is", "analogy", "why", "how_it_works", "key_components", "real_world_example", "common_confusion"];
      concept.sections.sort((a, b) => {
        const ai = order.indexOf(a.type);
        const bi = order.indexOf(b.type);
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      });
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, `${JSON.stringify(concept, null, 2)}\n`);
    conceptUpdates++;
  }
}

const categories = JSON.parse(fs.readFileSync(categoriesPath, "utf8"));
let catChanged = false;
for (const cat of categories) {
  const start = START_HERE[cat.slug];
  if (start && JSON.stringify(cat.startHere) !== JSON.stringify(start)) {
    cat.startHere = start;
    catChanged = true;
  }
}
if (catChanged) {
  fs.writeFileSync(categoriesPath, `${JSON.stringify(categories, null, 2)}\n`);
}

console.log(`Updated ${conceptUpdates} concepts (prerequisites + analogies)`);
console.log(`Updated categories with startHere: ${catChanged}`);
