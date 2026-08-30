import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");
const conceptsDir = path.join(dataDir, "concepts");

const SECTION_ORDER = [
  "what_is",
  "why",
  "how_it_works",
  "key_components",
  "real_world_example",
  "common_confusion",
];

function mergeSections(existing, additions) {
  const byType = new Map(existing.map((s) => [s.type, s]));
  for (const [type, section] of Object.entries(additions)) {
    if (!byType.has(type)) byType.set(type, { type, ...section });
  }
  return SECTION_ORDER.filter((t) => byType.has(t)).map((t) => byType.get(t));
}

const GIT_SUPPLEMENTS = {
  "git-init": {
    why: { content: "ทุกโปรเจกต์ที่ใช้ Git ต้องเริ่มจาก init หรือ clone — init เหมาะเมื่อสร้างโปรเจกต์ใหม่ตั้งแต่ต้น\n\n- เก็บ history การเปลี่ยนแปลง\n- ทำงานร่วมกับทีมผ่าน remote\n- ใช้ branch แยก feature" },
    key_components: { items: [".git/ — โฟลเดอร์ metadata", "git init — สร้าง repo ว่าง", "git init -b main — ตั้ง default branch", "Working directory — ไฟล์ที่แก้ได้", "Staging area — ไฟล์ที่ git add แล้ว"] },
    real_world_example: { content: "เริ่ม side project:\n```\nmkdir my-api && cd my-api\ngit init -b main\necho \"# My API\" > README.md\ngit add README.md && git commit -m \"Initial commit\"\n```" },
  },
  "git-clone": {
    why: { content: "clone คือวิธีมาตรฐานในการเริ่มทำงานกับ repo ที่มีอยู่แล้ว — ได้ทั้ง code และ history ครบ\n\n- onboarding ทีมใหม่\n- CI runner ดึง source\n- fork โปรเจกต์ open source" },
    key_components: { items: ["git clone <url> — ดึง repo", "HTTPS vs SSH URL", "origin — remote default", "--depth 1 — shallow clone เร็วขึ้น", "submodule — repo ซ้อน repo"] },
    real_world_example: { content: "```\ngit clone git@github.com:org/app.git\ncd app\nnpm install && npm run dev\n```" },
  },
  "git-status": {
    why: { content: "ก่อน commit ต้องรู้ว่าไฟล์ไหนเปลี่ยน  staged หรือยัง — status ป้องกัน commit ผิดไฟล์" },
    key_components: { items: ["Untracked — ไฟล์ใหม่", "Modified — แก้แต่ยังไม่ add", "Staged — พร้อม commit", "git status -s — แบบสั้น", "git status -u — แสดง untracked ละเอียด"] },
    real_world_example: { content: "ก่อน commit ทุกครั้ง:\n```\ngit status\n# modified: src/api.ts\ngit add src/api.ts\ngit status\n# Changes to be committed: src/api.ts\n```" },
  },
  "git-add": {
    why: { content: "Git ไม่ track ทุกไฟล์อัตโนมัติ — add เลือกว่าอะไรเข้า commit ถัดไป\n\n- แยก commit เป็นหน่วยย่อย\n- ไม่ commit ไฟล์ชั่วคราว (.env, build/)" },
    key_components: { items: ["git add <file> — stage ไฟล์เดียว", "git add . — stage ทั้งหมดในโฟลเดอร์", "git add -p — stage ทีละ hunk", "git restore --staged — unstage", ".gitignore — ไฟล์ที่ไม่ track"] },
    real_world_example: { content: "```\n# แก้ 3 ไฟล์ แต่ commit แยก\ngit add src/auth.ts\ngit commit -m \"fix login\"\ngit add src/ui.tsx\ngit commit -m \"update button style\"\n```" },
  },
  "git-commit": {
    why: { content: "commit คือ snapshot ของโปรเจกต์ — ย้อนกลับได้ เปรียบเทียบได้ audit ได้" },
    key_components: { items: ["git commit -m \"message\"", "commit hash (SHA)", "git commit --amend — แก้ commit ล่าสุด", "Conventional Commits — feat:, fix:", "Author & timestamp"] },
    real_world_example: { content: "```\ngit add .\ngit commit -m \"feat: add user profile API\"\ngit log --oneline -3\n```" },
  },
  "git-diff": {
    why: { content: "review การเปลี่ยนแปลงก่อน commit หรือ merge — ลด bug จากการ commit โดยไม่ดู" },
    key_components: { items: ["git diff — unstaged changes", "git diff --staged — staged vs HEAD", "git diff main..feature — เปรียบ branch", "git diff HEAD~1 — กับ commit ก่อนหน้า", "--stat — สรุปไฟล์ที่เปลี่ยน"] },
    real_world_example: { content: "ก่อน PR:\n```\ngit diff main...feature/auth\ngit diff --staged\n```" },
  },
  "git-log": {
    why: { content: "ดู history ว่าใครแก้อะไรเมื่อไหร่ — debug regression และเข้าใจ evolution ของโปรเจกต์" },
    key_components: { items: ["git log --oneline", "git log -p — พร้อม diff", "git log --graph --all", "--author, --since", "git show <hash> — รายละเอียด commit"] },
    real_world_example: { content: "```\ngit log --oneline -10\ngit log --grep=\"fix login\" --oneline\n```" },
  },
  "git-branch": {
    why: { content: "แยกงาน feature ออกจาก main — ทีมทำงานคู่ขนานโดยไม่ชนกัน" },
    key_components: { items: ["git branch feature/x", "git branch -a — ทุก branch", "main/master — production branch", "git branch -d — ลบ branch", "HEAD — ชี้ commit ปัจจุบัน"] },
    real_world_example: { content: "```\ngit checkout -b feature/payment\ngit push -u origin feature/payment\n# ทำงาน → PR → merge → ลบ branch\n```" },
  },
  "git-checkout": {
    why: { content: "สลับ branch หรือย้อนไฟล์ — จำเป็นสำหรับ workflow หลาย feature" },
    key_components: { items: ["git checkout <branch>", "git switch <branch> — คำสั่งใหม่", "git checkout -- <file> — ทิ้งการแก้", "git checkout <hash> — detached HEAD", "git restore — แทน checkout ไฟล์"] },
    real_world_example: { content: "```\ngit switch main\ngit pull\ngit switch -c hotfix/typo\n```" },
  },
  "git-merge": {
    why: { content: "รวมงานจาก branch กลับเข้า main — จบ feature cycle" },
    key_components: { items: ["git merge feature/x", "Fast-forward merge", "3-way merge + merge commit", "Merge conflict — แก้ด้วยมือ", "git merge --abort — ยกเลิก"] },
    real_world_example: { content: "```\ngit switch main\ngit pull\ngit merge feature/auth\n# ถ้า conflict แก้ไฟล์ → git add → git commit\n```" },
  },
  "git-rebase": {
    why: { content: "ทำ history เป็นเส้นตรง — ก่อน merge PR ให้ commit เรียงสวย" },
    key_components: { items: ["git rebase main", "git rebase -i — interactive squash", "Rewrites commit history", "Conflict ระหว่าง rebase", "ห้าม rebase public branch ที่คนอื่นใช้"] },
    real_world_example: { content: "```\ngit switch feature/api\ngit rebase main\ngit push --force-with-lease\n```" },
  },
  "git-push": {
    why: { content: "ส่ง commit ขึ้น remote — backup และให้ทีม/CI เห็นงาน" },
    key_components: { items: ["git push origin <branch>", "git push -u origin branch — ตั้ง upstream", "--force-with-lease — push หลัง rebase", "rejected — ต้อง pull ก่อน", "protected branch — ห้าม push ตรง"] },
    real_world_example: { content: "```\ngit push -u origin feature/dashboard\n# เปิด PR บน GitHub\n```" },
  },
  "git-pull": {
    why: { content: "ดึงงานล่าสุดจาก remote — sync กับทีมก่อนเริ่มงาน" },
    key_components: { items: ["git pull = fetch + merge", "git pull --rebase — ประวัติตรงกว่า", "merge conflict หลัง pull", "git fetch แล้ว merge เอง", "upstream branch"] },
    real_world_example: { content: "เริ่มวันทำงาน:\n```\ngit switch main\ngit pull --rebase\n```" },
  },
  "git-fetch": {
    why: { content: "ดูว่า remote เปลี่ยนอะไรโดยไม่ merge ทันที — ปลอดภัยกว่า pull ตอน review" },
    key_components: { items: ["git fetch origin", "git fetch --all", "origin/main — remote-tracking branch", "git log origin/main..HEAD", "ไม่แก้ working directory"] },
    real_world_example: { content: "```\ngit fetch origin\ngit log HEAD..origin/main --oneline\n# ตัดสินใจ merge หรือ rebase\n```" },
  },
  "git-remote": {
    why: { content: "เชื่อม local repo กับ GitHub/GitLab — จำเป็นสำหรับ push/pull" },
    key_components: { items: ["git remote add origin <url>", "git remote -v", "origin — ชื่อ default", "git remote set-url", "หลาย remote (upstream/fork)"] },
    real_world_example: { content: "```\ngit remote add origin git@github.com:user/app.git\ngit remote -v\ngit push -u origin main\n```" },
  },
  "git-stash": {
    why: { content: "เก็บงานค้างชั่วคราวเมื่อต้อง switch branch ด่วน — ไม่ต้อง commit งานยังไม่เสร็จ" },
    key_components: { items: ["git stash", "git stash pop", "git stash list", "git stash apply", "git stash -u — รวม untracked"] },
    real_world_example: { content: "```\n# กำลังแก้ครึ่งทาง แต่ต้อง hotfix\ngit stash\ngit switch main && git pull\ngit switch feature && git stash pop\n```" },
  },
  "github-pr": {
    why: { content: "PR คือจุด review code ก่อน merge — มาตรฐานทีมและ open source" },
    key_components: { items: ["Pull Request / Merge Request", "Code review comments", "CI checks บน PR", "Draft PR", "Squash merge vs merge commit"] },
    real_world_example: { content: "1. push branch\n2. เปิด PR บน GitHub\n3. CI รัน tests\n4. reviewer approve\n5. Squash merge → main" },
  },
  "gh-cli": {
    why: { content: "ทำงาน GitHub จาก terminal — เร็วกว่าเปิด browser สำหรับ PR, issue, release" },
    key_components: { items: ["gh pr create", "gh pr checkout", "gh issue list", "gh repo clone", "gh auth login"] },
    real_world_example: { content: "```\ngh pr create --title \"Add auth\" --body \"JWT login\"\ngh pr merge 42 --squash\n```" },
  },
};

const CLI_WIN_SUPPLEMENTS = {
  "win-cd": {
    why: { content: "cmd/PowerShell ทำงาน relative กับโฟลเดอร์ปัจจุบัน — ต้อง cd ก่อนรันคำสั่งใน path ที่ถูก" },
    real_world_example: { content: "```\ncd C:\\Projects\\my-app\ncd ..          :: ขึ้นหนึ่งระดับ\ncd %USERPROFILE%\\Documents\n```" },
  },
  "win-dir": {
    why: { content: "ดูไฟล์และโฟลเดอร์บน Windows — เทียบเท่า ls บน Unix" },
    real_world_example: { content: "```\ndir\ndir /w\ndir *.json /s\n```" },
  },
  "win-mkdir": {
    why: { content: "สร้างโครงสร้างโฟลเดอร์บน Windows ก่อน copy หรือ generate ไฟล์" },
    real_world_example: { content: "```\nmkdir src\\components\nmkdir logs 2>nul\n```" },
  },
  "win-copy": {
    why: { content: "คัดลอกไฟล์/โฟลเดอร์ใน batch script และ deployment manual" },
    key_components: { items: ["copy source dest", "xcopy — โฟลเดอร์", "robocopy — sync ขั้นสูง", "/Y — ไม่ถาม overwrite", "wildcards *.txt"] },
    real_world_example: { content: "```\ncopy .env.example .env\nxcopy /E /I dist backup\n```" },
  },
  "win-del": {
    why: { content: "ลบไฟล์ชั่วคราวหรือ clean build artifacts" },
    key_components: { items: ["del file.txt", "del /Q — quiet", "rmdir /S — ลบโฟลเดอร์", "ระวัง path ก่อนลบ", "Recycle Bin ไม่ผ่าน del"] },
    real_world_example: { content: "```\ndel /Q *.log\nrmdir /S /Q node_modules\n```" },
  },
  "win-type": {
    why: { content: "อ่านเนื้อหาไฟล์ text ใน cmd — เทียบเท่า cat" },
    real_world_example: { content: "```\ntype package.json\ntype .env.example\n```" },
  },
  "win-findstr": {
    why: { content: "ค้นหาข้อความในไฟล์บน Windows — เทียบเท่า grep" },
    key_components: { items: ["findstr pattern file", "/I — case insensitive", "/S — recursive", "/N — line numbers", "regex จำกัดกว่า grep"] },
    real_world_example: { content: "```\nfindstr /S /I \"error\" *.log\nfindstr /N \"TODO\" src\\*.ts\n```" },
  },
  "win-where": {
    why: { content: "หา path ของ executable — ตรวจว่าติดตั้ง node/git หรือยัง" },
    real_world_example: { content: "```\nwhere node\nwhere git\n```" },
  },
  "win-ipconfig": {
    why: { content: "ดู IP, gateway, DNS ของเครื่อง Windows — debug network ขั้นแรก" },
    key_components: { items: ["/all — รายละเอียดเต็ม", "IPv4 Address", "Default Gateway", "DNS Servers", "ipconfig /flushdns"] },
    real_world_example: { content: "```\nipconfig\nipconfig /all\nipconfig /flushdns\n```" },
  },
  "win-ping": {
    why: { content: "ทดสอบ connectivity บน Windows — ขั้นแรกเมื่อเน็ตมีปัญหา" },
    real_world_example: { content: "```\nping -n 4 google.com\nping -t 8.8.8.8\n```" },
  },
  "win-nslookup": {
    why: { content: "ตรวจ DNS บน Windows — แยกปัญหา domain vs server" },
    real_world_example: { content: "```\nnslookup google.com\nnslookup myapp.com 8.8.8.8\n```" },
  },
  "win-tracert": {
    why: { content: "ดูเส้นทาง packet ไปปลายทาง — หา hop ที่ latency สูง" },
    key_components: { items: ["tracert host", "hop-by-hop RTT", "เทียบ traceroute บน Unix", "* * * — timeout ที่ hop", "ใช้ debug routing"] },
    real_world_example: { content: "```\ntracert google.com\n```" },
  },
  "win-netstat": {
    why: { content: "ดู port ที่เปิดและ connection ที่ active — debug service ไม่ขึ้น" },
    key_components: { items: ["netstat -an", "-ano — แสดง PID", "LISTENING", "ESTABLISHED", "หา process จาก PID ใน Task Manager"] },
    real_world_example: { content: "```\nnetstat -ano | findstr :3000\n```" },
  },
  "win-npm": {
    why: { content: "จัดการ Node packages บน Windows — เหมือน npm บน Unix แต่ path และ permission ต่างกัน" },
    real_world_example: { content: "```\nnpm install\nnpm run dev\n```" },
  },
  "ps-invoke-webrequest": {
    why: { content: "ทดสอบ HTTP API จาก PowerShell — แทน curl บน Windows" },
    key_components: { items: ["Invoke-WebRequest", "Invoke-RestMethod", "-Uri", "-Method POST", "-Body (JSON)"] },
    real_world_example: { content: "```powershell\nInvoke-RestMethod -Uri https://api.example.com/health\n```" },
  },
  "ps-resolve-dnsname": {
    why: { content: "resolve DNS ใน PowerShell — object-oriented กว่า nslookup" },
    real_world_example: { content: "```powershell\nResolve-DnsName google.com\n```" },
  },
  "ps-test-netconnection": {
    why: { content: "ทดสอบ port และ TCP connectivity — ละเอียดกว่า ping" },
    key_components: { items: ["Test-NetConnection host", "-Port 443", "TcpTestSucceeded", "PingSucceeded", "แทน telnet สมัยใหม่"] },
    real_world_example: { content: "```powershell\nTest-NetConnection google.com -Port 443\n```" },
  },
};

const PROGRAMMING_SUPPLEMENTS = {
  array: {
    key_components: { items: ["Index — O(1) access", "Dynamic resize", "Contiguous memory", "Length / size property", "Multi-dimensional (2D matrix)"] },
  },
  "linked-list": {
    key_components: { items: ["Node — data + next pointer", "Head / Tail", "Singly vs Doubly linked", "O(1) insert ถ้ามี pointer", "ไม่มี random access"] },
  },
  stack: {
    key_components: { items: ["LIFO — Last In First Out", "push / pop", "Call stack ใน runtime", "Undo operations", "O(1) push/pop"] },
  },
  queue: {
    key_components: { items: ["FIFO — First In First Out", "enqueue / dequeue", "BFS algorithm", "Task queue / message queue", "Circular buffer"] },
  },
  "hash-table": {
    key_components: { items: ["Hash function", "Bucket / slot", "Collision handling", "O(1) average lookup", "Load factor & rehash"] },
  },
  heap: {
    key_components: { items: ["Min-heap / Max-heap", "Parent-child ordering", "Priority queue", "heapify O(n)", "extract-min O(log n)"] },
  },
  tree: {
    key_components: { items: ["Root / Leaf / Internal node", "Binary tree", "BST — ordered", "Traversal: in/pre/post-order", "Height & balance"] },
  },
  "graph-structure": {
    key_components: { items: ["Vertex / Edge", "Directed vs Undirected", "Adjacency list/matrix", "Weighted edges", "Cycle detection"] },
  },
  "data-structure": {
    key_components: { items: ["Array / Linked List", "Stack / Queue", "Tree / Graph", "Hash Table", "Time & space complexity"] },
  },
  oop: {
    key_components: { items: ["Class & Object", "Encapsulation", "Inheritance", "Polymorphism", "Interface / Abstract class"] },
    real_world_example: { content: "```typescript\nclass UserService {\n  constructor(private db: Database) {}\n  async findById(id: string) { return this.db.query(...) }\n}\n```" },
  },
};

// Link visualizations to concepts
const VIZ_LINKS = {
  llm: "llm-flow",
  rag: "rag-flow",
  docker: "docker-flow",
  serverless: "serverless-flow",
  "virtual-machine": "cloud-vm-flow",
  "object-storage": "object-storage-flow",
  kubernetes: "kubernetes-flow",
  monitoring: "monitoring-flow",
  "iot-gateway": "iot-gateway-flow",
  oauth: "oauth-flow",
  database: "database-flow",
  redis: "redis-flow",
  "cloud-computing": "cloud-vm-flow",
  authentication: "login-flow",
  jwt: "jwt-flow",
  git: "git-workflow-flow",
  deployment: "deploy-flow",
  mqtt: "mqtt-flow",
  sql: "sql-query-flow",
};

let enriched = 0;
for (const file of fs.readdirSync(conceptsDir).filter((f) => f.endsWith(".json"))) {
  const filePath = path.join(conceptsDir, file);
  const concept = JSON.parse(fs.readFileSync(filePath, "utf8"));
  let changed = false;

  const supplement =
    GIT_SUPPLEMENTS[concept.slug] ??
    CLI_WIN_SUPPLEMENTS[concept.slug] ??
    PROGRAMMING_SUPPLEMENTS[concept.slug];

  if (supplement) {
    const before = concept.sections.length;
    concept.sections = mergeSections(concept.sections, supplement);
    if (concept.sections.length > before) changed = true;
    enriched++;
  }

  if (VIZ_LINKS[concept.slug] && !concept.visualization) {
    concept.visualization = VIZ_LINKS[concept.slug];
    changed = true;
  }

  if (changed) fs.writeFileSync(filePath, `${JSON.stringify(concept, null, 2)}\n`);
}

console.log(`Enriched ${enriched} concept files`);
console.log(`Linked ${Object.keys(VIZ_LINKS).length} visualizations to concepts`);
