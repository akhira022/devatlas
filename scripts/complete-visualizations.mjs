/**
 * Creates missing visualization JSON files and links all concepts.
 * Run: node scripts/complete-visualizations.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const vizDir = path.join(__dirname, "..", "data", "visualizations");
const conceptsDir = path.join(__dirname, "..", "data", "concepts");

const NEW_VISUALIZATIONS = {
  "grep-flow": {
    slug: "grep-flow",
    title: "Text Search with grep",
    description: "ค้นหา pattern ในไฟล์หรือ pipe output — กรอง log และหาโค้ด",
    conceptSlug: "grep",
    protocol: "Shell",
    category: "cli",
    nodes: [
      { id: "user", label: "User", description: "พิมพ์คำสั่ง grep", type: "client", position: { x: 0, y: 120 } },
      { id: "shell", label: "Shell", description: "รัน grep บนไฟล์หรือ stdin", type: "service", position: { x: 280, y: 120 } },
      { id: "files", label: "Files / stdin", description: "แหล่งข้อความที่ค้นหา", type: "database", position: { x: 560, y: 120 } },
    ],
    steps: [
      { id: "gr-1", from: "user", to: "shell", label: "grep pattern", packet: 'grep "error" app.log', description: "ส่ง pattern และชื่อไฟล์ให้ grep", duration: 1100 },
      { id: "gr-2", from: "shell", to: "files", label: "Read", packet: "อ่านทีละบรรทัด", description: "grep เปิดไฟล์และอ่านเนื้อหา", duration: 1100 },
      { id: "gr-3", from: "files", to: "shell", label: "Lines", packet: "บรรทัดที่ match", description: "ส่งบรรทัดที่ตรง pattern กลับ", duration: 1100 },
      { id: "gr-4", from: "shell", to: "user", label: "Output", packet: "ERROR: timeout…", description: "แสดงผลบรรทัดที่พบ — หรือว่างถ้าไม่เจอ", duration: 1000 },
    ],
  },
  "file-read-flow": {
    slug: "file-read-flow",
    title: "Read File Contents",
    description: "cat / type — แสดงเนื้อหาไฟล์ใน terminal",
    conceptSlug: "cat",
    protocol: "Shell",
    category: "cli",
    nodes: [
      { id: "user", label: "User", description: "ต้องการดูเนื้อหาไฟล์", type: "client", position: { x: 0, y: 120 } },
      { id: "shell", label: "Shell", description: "cat หรือ type", type: "service", position: { x: 280, y: 120 } },
      { id: "fs", label: "File", description: "ไฟล์บน disk", type: "database", position: { x: 560, y: 120 } },
    ],
    steps: [
      { id: "fr-1", from: "user", to: "shell", label: "cat file", packet: "cat config.json", description: "ระบุไฟล์ที่ต้องการอ่าน", duration: 1100 },
      { id: "fr-2", from: "shell", to: "fs", label: "Open", packet: "read bytes", description: "เปิดไฟล์และอ่านเนื้อหาทั้งหมด", duration: 1100 },
      { id: "fr-3", from: "fs", to: "shell", label: "Content", packet: "{ \"port\": 3000 }", description: "ส่งเนื้อหาไฟล์กลับ shell", duration: 1100 },
      { id: "fr-4", from: "shell", to: "user", label: "Print", packet: "stdout", description: "พิมพ์เนื้อหาลง terminal", duration: 1000 },
    ],
  },
  "file-ops-flow": {
    slug: "file-ops-flow",
    title: "File Operations",
    description: "copy, delete, chmod — จัดการไฟล์และสิทธิ์",
    conceptSlug: "chmod",
    protocol: "Shell",
    category: "cli",
    nodes: [
      { id: "user", label: "User", description: "จัดการไฟล์", type: "client", position: { x: 0, y: 120 } },
      { id: "shell", label: "Shell", description: "คำสั่ง file ops", type: "service", position: { x: 280, y: 120 } },
      { id: "fs", label: "File System", description: "inode, permissions", type: "database", position: { x: 560, y: 120 } },
    ],
    steps: [
      { id: "fo-1", from: "user", to: "shell", label: "copy", packet: "cp src dst", description: "คัดลอกไฟล์ไปปลายทางใหม่", duration: 1100 },
      { id: "fo-2", from: "shell", to: "fs", label: "Write", packet: "สร้างไฟล์ใหม่", description: "ระบบไฟล์เขียนข้อมูลลง disk", duration: 1100 },
      { id: "fo-3", from: "user", to: "shell", label: "chmod", packet: "chmod +x script.sh", description: "เปลี่ยน permission bits", duration: 1100 },
      { id: "fo-4", from: "shell", to: "fs", label: "Perm", packet: "rwxr-xr-x", description: "อัปเดตสิทธิ์อ่าน/เขียน/รัน", duration: 1100 },
      { id: "fo-5", from: "user", to: "fs", label: "delete", packet: "rm file.txt", description: "ลบไฟล์ออกจาก directory", duration: 1000 },
    ],
  },
  "file-search-flow": {
    slug: "file-search-flow",
    title: "Find Executable Path",
    description: "where — หา path ของโปรแกรมใน PATH",
    conceptSlug: "win-where",
    protocol: "Shell",
    category: "cli",
    nodes: [
      { id: "user", label: "User", description: "หาว่าโปรแกรมอยู่ที่ไหน", type: "client", position: { x: 0, y: 120 } },
      { id: "shell", label: "where / which", description: "ค้นหาใน PATH", type: "service", position: { x: 280, y: 120 } },
      { id: "path", label: "PATH dirs", description: "โฟลเดอร์ใน environment PATH", type: "database", position: { x: 560, y: 120 } },
    ],
    steps: [
      { id: "fs-1", from: "user", to: "shell", label: "where node", packet: "where node", description: "ถามว่า executable ชื่อ node อยู่ที่ไหน", duration: 1100 },
      { id: "fs-2", from: "shell", to: "path", label: "Scan", packet: "C:\\Program Files\\…", description: "สแกนแต่ละโฟลเดอร์ใน PATH", duration: 1100 },
      { id: "fs-3", from: "path", to: "shell", label: "Match", packet: "node.exe found", description: "พบไฟล์ที่ตรงชื่อ", duration: 1100 },
      { id: "fs-4", from: "shell", to: "user", label: "Result", packet: "C:\\…\\node.exe", description: "แสดง path เต็มของ executable", duration: 1000 },
    ],
  },
  "ip-config-flow": {
    slug: "ip-config-flow",
    title: "Network Interface Config",
    description: "ifconfig / ipconfig — ดู IP, MAC, gateway ของเครื่อง",
    conceptSlug: "ifconfig",
    protocol: "Network",
    category: "cli",
    nodes: [
      { id: "user", label: "User", description: "ตรวจสอบ network ของเครื่อง", type: "client", position: { x: 0, y: 120 } },
      { id: "cmd", label: "ifconfig/ipconfig", description: "คำสั่งดู interface", type: "service", position: { x: 280, y: 120 } },
      { id: "nic", label: "Network Stack", description: "OS network interfaces", type: "network", position: { x: 560, y: 120 } },
    ],
    steps: [
      { id: "ip-1", from: "user", to: "cmd", label: "ipconfig", packet: "ipconfig /all", description: "รันคำสั่งดูการตั้งค่าเครือข่าย", duration: 1100 },
      { id: "ip-2", from: "cmd", to: "nic", label: "Query", packet: "interfaces?", description: "ถาม OS ว่ามี interface อะไรบ้าง", duration: 1100 },
      { id: "ip-3", from: "nic", to: "cmd", label: "Info", packet: "192.168.1.50", description: "ได้ IP, subnet mask, gateway, DNS", duration: 1100 },
      { id: "ip-4", from: "cmd", to: "user", label: "Display", packet: "Ethernet adapter…", description: "แสดงรายละเอียดแต่ละ interface", duration: 1000 },
    ],
  },
  "netstat-flow": {
    slug: "netstat-flow",
    title: "Network Connections",
    description: "netstat — ดู port ที่เปิดและ connection ที่ active",
    conceptSlug: "netstat",
    protocol: "TCP/UDP",
    category: "cli",
    nodes: [
      { id: "user", label: "User", description: "ตรวจสอบ connection", type: "client", position: { x: 0, y: 120 } },
      { id: "cmd", label: "netstat", description: "แสดง socket table", type: "service", position: { x: 280, y: 120 } },
      { id: "kernel", label: "Network Stack", description: "TCP/UDP state ใน kernel", type: "network", position: { x: 560, y: 120 } },
    ],
    steps: [
      { id: "ns-1", from: "user", to: "cmd", label: "netstat -an", packet: "netstat -tuln", description: "ขอรายการ connection และ listening port", duration: 1100 },
      { id: "ns-2", from: "cmd", to: "kernel", label: "Query", packet: "socket table", description: "อ่านตาราง socket จาก kernel", duration: 1100 },
      { id: "ns-3", from: "kernel", to: "cmd", label: "Entries", packet: ":443 LISTEN", description: "ส่งรายการ port, state, remote address", duration: 1100 },
      { id: "ns-4", from: "cmd", to: "user", label: "Output", packet: "0.0.0.0:3000", description: "แสดงผล — ใช้ debug port conflict", duration: 1000 },
    ],
  },
  "traceroute-flow": {
    slug: "traceroute-flow",
    title: "Traceroute Path",
    description: "traceroute / tracert — ติดตามเส้นทาง packet ไปปลายทาง",
    conceptSlug: "traceroute",
    protocol: "ICMP/UDP",
    category: "cli",
    nodes: [
      { id: "host", label: "Your PC", description: "เริ่ม traceroute", type: "client", position: { x: 0, y: 120 } },
      { id: "hop1", label: "Router 1", description: "hop แรก — มักเป็น gateway", type: "network", position: { x: 240, y: 60 } },
      { id: "hop2", label: "Router 2", description: "ISP backbone", type: "network", position: { x: 480, y: 120 } },
      { id: "target", label: "Destination", description: "server ปลายทาง", type: "server", position: { x: 720, y: 120 } },
    ],
    steps: [
      { id: "tr-1", from: "host", to: "hop1", label: "TTL=1", packet: "probe", description: "ส่ง packet TTL=1 — หยุดที่ router แรก", duration: 1100 },
      { id: "tr-2", from: "hop1", to: "host", label: "Reply", packet: "10ms", description: "router ตอบ Time Exceeded + IP", duration: 1100 },
      { id: "tr-3", from: "host", to: "hop2", label: "TTL=2", packet: "probe", description: "เพิ่ม TTL ทีละ hop จนถึงปลายทาง", duration: 1100 },
      { id: "tr-4", from: "host", to: "target", label: "TTL=n", packet: "probe", description: "packet ถึง destination สำเร็จ", duration: 1100 },
      { id: "tr-5", from: "target", to: "host", label: "Done", packet: "45ms total", description: "แสดงเส้นทางและ latency แต่ละ hop", duration: 1000 },
    ],
  },
  "npm-flow": {
    slug: "npm-flow",
    title: "npm Install Flow",
    description: "npm install — ดาวน์โหลด dependencies จาก registry",
    conceptSlug: "npm",
    protocol: "npm",
    category: "cli",
    nodes: [
      { id: "dev", label: "Developer", description: "รัน npm install", type: "client", position: { x: 0, y: 120 } },
      { id: "npm", label: "npm CLI", description: "อ่าน package.json", type: "service", position: { x: 260, y: 120 } },
      { id: "registry", label: "npm Registry", description: "registry.npmjs.org", type: "server", position: { x: 520, y: 60 } },
      { id: "node_modules", label: "node_modules", description: "โฟลเดอร์ dependencies", type: "database", position: { x: 520, y: 180 } },
    ],
    steps: [
      { id: "npm-1", from: "dev", to: "npm", label: "npm install", packet: "npm install", description: "อ่าน package.json และ lock file", duration: 1100 },
      { id: "npm-2", from: "npm", to: "registry", label: "Fetch", packet: "GET react@18", description: "ดาวน์โหลด package tarball จาก registry", duration: 1200 },
      { id: "npm-3", from: "registry", to: "npm", label: "Tarball", packet: ".tgz", description: "ได้ package และ dependencies ซ้อน", duration: 1100 },
      { id: "npm-4", from: "npm", to: "node_modules", label: "Extract", packet: "node_modules/", description: "แตกไฟล์ลง node_modules", duration: 1100 },
      { id: "npm-5", from: "node_modules", to: "dev", label: "Ready", packet: "added 142 pkgs", description: "พร้อม import ในโปรเจกต์", duration: 1000 },
    ],
  },
  "network-connect-flow": {
    slug: "network-connect-flow",
    title: "TCP Connection Test",
    description: "nc / telnet — ทดสอบเชื่อมต่อ port โดยตรง",
    conceptSlug: "nc",
    protocol: "TCP",
    category: "cli",
    nodes: [
      { id: "client", label: "Client", description: "nc หรือ telnet", type: "client", position: { x: 0, y: 120 } },
      { id: "network", label: "Network", description: "TCP handshake", type: "network", position: { x: 320, y: 120 } },
      { id: "server", label: "Server :port", description: "service ที่ listen", type: "server", position: { x: 640, y: 120 } },
    ],
    steps: [
      { id: "nc-1", from: "client", to: "network", label: "SYN", packet: "nc host 443", description: "ส่ง TCP SYN ไป port ปลายทาง", duration: 1100 },
      { id: "nc-2", from: "network", to: "server", label: "Forward", packet: "SYN", description: "packet ไปถึง server", duration: 1100 },
      { id: "nc-3", from: "server", to: "client", label: "SYN-ACK", packet: "connected", description: "server ตอบรับ — connection สำเร็จ", duration: 1100 },
      { id: "nc-4", from: "client", to: "server", label: "Data", packet: "GET / …", description: "ส่งข้อมูลทดสอบหรือ HTTP request", duration: 1000 },
    ],
  },
  "whois-flow": {
    slug: "whois-flow",
    title: "WHOIS Lookup",
    description: "whois — ดูข้อมูลการจดทะเบียน domain",
    conceptSlug: "whois",
    protocol: "WHOIS",
    category: "cli",
    nodes: [
      { id: "user", label: "User", description: "สอบถามข้อมูล domain", type: "client", position: { x: 0, y: 120 } },
      { id: "whois", label: "whois client", description: "CLI whois", type: "service", position: { x: 260, y: 120 } },
      { id: "registry", label: "WHOIS Server", description: "registry ของ TLD", type: "server", position: { x: 520, y: 120 } },
    ],
    steps: [
      { id: "wh-1", from: "user", to: "whois", label: "whois", packet: "whois example.com", description: "ระบุ domain ที่ต้องการสอบถาม", duration: 1100 },
      { id: "wh-2", from: "whois", to: "registry", label: "Query", packet: "example.com?", description: "เชื่อมต่อ WHOIS server ของ TLD", duration: 1100 },
      { id: "wh-3", from: "registry", to: "whois", label: "Record", packet: "Registrar, dates…", description: "ได้ข้อมูล registrant, expiry, nameservers", duration: 1100 },
      { id: "wh-4", from: "whois", to: "user", label: "Display", packet: "text output", description: "แสดงผลข้อมูล domain registration", duration: 1000 },
    ],
  },
  "git-diff-flow": {
    slug: "git-diff-flow",
    title: "Git Diff",
    description: "เปรียบเทียบการเปลี่ยนแปลงระหว่าง working tree, staging และ commits",
    conceptSlug: "git-diff",
    protocol: "Git",
    category: "git-github",
    nodes: [
      { id: "dev", label: "Developer", description: "review ก่อน commit", type: "client", position: { x: 0, y: 120 } },
      { id: "working", label: "Working Tree", description: "ไฟล์ที่แก้แล้ว", type: "service", position: { x: 260, y: 60 } },
      { id: "staging", label: "Staging", description: "git add แล้ว", type: "service", position: { x: 260, y: 180 } },
      { id: "head", label: "HEAD", description: "commit ล่าสุด", type: "database", position: { x: 520, y: 120 } },
    ],
    steps: [
      { id: "gd-1", from: "dev", to: "working", label: "git diff", packet: "unstaged", description: "เปรียบ working tree กับ staging", duration: 1100 },
      { id: "gd-2", from: "working", to: "dev", label: "- / + lines", packet: "diff output", description: "แสดงบรรทัดที่เพิ่ม/ลบ", duration: 1100 },
      { id: "gd-3", from: "dev", to: "staging", label: "--staged", packet: "staged diff", description: "เปรียบ staging กับ HEAD", duration: 1100 },
      { id: "gd-4", from: "staging", to: "head", label: "Compare", packet: "git diff HEAD", description: "ดูทุกการเปลี่ยนแปลงที่จะ commit", duration: 1000 },
    ],
  },
  "git-log-flow": {
    slug: "git-log-flow",
    title: "Git Log History",
    description: "ดูประวัติ commit — ใครแก้อะไรเมื่อไหร่",
    conceptSlug: "git-log",
    protocol: "Git",
    category: "git-github",
    nodes: [
      { id: "dev", label: "Developer", description: "git log", type: "client", position: { x: 0, y: 120 } },
      { id: "git", label: "Git", description: "อ่าน .git/objects", type: "service", position: { x: 280, y: 120 } },
      { id: "history", label: "Commit History", description: "linked commits", type: "database", position: { x: 560, y: 120 } },
    ],
    steps: [
      { id: "gl-1", from: "dev", to: "git", label: "git log", packet: "git log --oneline", description: "ขอรายการ commit จาก HEAD ย้อนหลัง", duration: 1100 },
      { id: "gl-2", from: "git", to: "history", label: "Traverse", packet: "parent pointers", description: "เดินตาม parent commit ทีละตัว", duration: 1100 },
      { id: "gl-3", from: "history", to: "git", label: "Commits", packet: "hash, author, date", description: "รวบรวม metadata แต่ละ commit", duration: 1100 },
      { id: "gl-4", from: "git", to: "dev", label: "Display", packet: "abc1234 fix api", description: "แสดง log — กรองด้วย --author, --grep ได้", duration: 1000 },
    ],
  },
  "git-stash-flow": {
    slug: "git-stash-flow",
    title: "Git Stash",
    description: "เก็บงานค้างชั่วคราวแล้วกลับมาใช้ทีหลัง",
    conceptSlug: "git-stash",
    protocol: "Git",
    category: "git-github",
    nodes: [
      { id: "dev", label: "Developer", description: "ต้องสลับ branch ด่วน", type: "client", position: { x: 0, y: 120 } },
      { id: "working", label: "Working Tree", description: "มีการแก้ค้าง", type: "service", position: { x: 280, y: 60 } },
      { id: "stash", label: "Stash Stack", description: "เก็บงานชั่วคราว", type: "database", position: { x: 280, y: 180 } },
      { id: "branch", label: "Other Branch", description: "switch ไปทำงานอื่น", type: "service", position: { x: 560, y: 120 } },
    ],
    steps: [
      { id: "gs-1", from: "dev", to: "stash", label: "git stash", packet: "git stash push", description: "เก็บการแก้ไขลง stash stack", duration: 1100 },
      { id: "gs-2", from: "working", to: "stash", label: "Save", packet: "WIP on main", description: "working tree สะอาด — พร้อม switch branch", duration: 1100 },
      { id: "gs-3", from: "dev", to: "branch", label: "switch", packet: "git switch hotfix", description: "ทำงานอื่นโดยไม่ commit งานค้าง", duration: 1100 },
      { id: "gs-4", from: "stash", to: "working", label: "git stash pop", packet: "restore changes", description: "นำงานจาก stash กลับมา apply", duration: 1000 },
    ],
  },
  "sensor-flow": {
    slug: "sensor-flow",
    title: "Sensor Data Flow",
    description: "จาก sensor วัดค่า → microcontroller → cloud",
    conceptSlug: "sensor",
    protocol: "IoT",
    category: "iot",
    nodes: [
      { id: "env", label: "Environment", description: "อุณหภูมิ, ความชื้น, แสง", type: "device", position: { x: 0, y: 120 } },
      { id: "sensor", label: "Sensor", description: "แปลงค่าทางกายภาพเป็นสัญญาณ", type: "device", position: { x: 220, y: 120 } },
      { id: "mcu", label: "Microcontroller", description: "ESP32 / Arduino", type: "client", position: { x: 440, y: 120 } },
      { id: "cloud", label: "Cloud / MQTT", description: "เก็บและแสดงผล", type: "server", position: { x: 660, y: 120 } },
    ],
    steps: [
      { id: "sf-1", from: "env", to: "sensor", label: "Measure", packet: "28°C", description: "sensor วัดค่าจากสิ่งแวดล้อม", duration: 1100 },
      { id: "sf-2", from: "sensor", to: "mcu", label: "Analog/Digital", packet: "ADC read", description: "MCU อ่านค่าผ่าน GPIO/I2C/SPI", duration: 1100 },
      { id: "sf-3", from: "mcu", to: "cloud", label: "Publish", packet: "MQTT temp=28", description: "ส่งข้อมูลขึ้น broker หรือ HTTP API", duration: 1100 },
      { id: "sf-4", from: "cloud", to: "mcu", label: "Alert", packet: "threshold OK", description: "cloud/dashboard แสดงผลหรือ trigger action", duration: 1000 },
    ],
  },
  "edge-computing-flow": {
    slug: "edge-computing-flow",
    title: "Edge vs Cloud Processing",
    description: "ประมวลผลใกล้ sensor ลด latency และ bandwidth",
    conceptSlug: "edge-computing",
    protocol: "IoT",
    category: "iot",
    nodes: [
      { id: "sensor", label: "IoT Device", description: "ส่งข้อมูลดิบ", type: "device", position: { x: 0, y: 120 } },
      { id: "edge", label: "Edge Node", description: "gateway ประมวลผล local", type: "service", position: { x: 280, y: 120 } },
      { id: "cloud", label: "Cloud", description: "analytics ระยะยาว", type: "server", position: { x: 560, y: 120 } },
    ],
    steps: [
      { id: "ec-1", from: "sensor", to: "edge", label: "Raw data", packet: "video frame", description: "device ส่งข้อมูลไป edge gateway", duration: 1100 },
      { id: "ec-2", from: "edge", to: "edge", label: "Process", packet: "detect motion", description: "ประมวลผล local — filter, aggregate, ML inference", duration: 1200 },
      { id: "ec-3", from: "edge", to: "sensor", label: "Fast response", packet: "turn on light", description: "ตอบกลับ device ทันทีโดยไม่รอ cloud", duration: 1100 },
      { id: "ec-4", from: "edge", to: "cloud", label: "Summary", packet: "alert event", description: "ส่งเฉพาะผลลัพธ์สำคัญขึ้น cloud", duration: 1000 },
    ],
  },
  "motherboard-flow": {
    slug: "motherboard-flow",
    title: "Motherboard Connections",
    description: "แผงวงจรหลักเชื่อม CPU, RAM, storage และ expansion",
    conceptSlug: "motherboard",
    protocol: "Hardware",
    category: "hardware",
    nodes: [
      { id: "mb", label: "Motherboard", description: "PCB หลัก + chipset", type: "device", position: { x: 280, y: 120 } },
      { id: "cpu", label: "CPU", description: "socket บน board", type: "device", position: { x: 0, y: 40 } },
      { id: "ram", label: "RAM", description: "DIMM slots", type: "database", position: { x: 0, y: 200 } },
      { id: "pcie", label: "GPU / PCIe", description: "expansion card", type: "device", position: { x: 560, y: 60 } },
      { id: "storage", label: "M.2 / SATA", description: "SSD/HDD", type: "database", position: { x: 560, y: 180 } },
    ],
    steps: [
      { id: "mb-1", from: "cpu", to: "mb", label: "Mount", packet: "CPU socket", description: "ติด CPU ลง socket — chipset จัดการ bus", duration: 1100 },
      { id: "mb-2", from: "ram", to: "mb", label: "Install", packet: "DDR5 DIMM", description: "เสียบ RAM ลง slot — memory controller บน CPU/chipset", duration: 1100 },
      { id: "mb-3", from: "storage", to: "mb", label: "Connect", packet: "NVMe M.2", description: "ต่อ SSD ผ่าน M.2 หรือ SATA", duration: 1100 },
      { id: "mb-4", from: "pcie", to: "mb", label: "PCIe x16", packet: "GPU slot", description: "การ์ดจอหรือ NIC ใน PCIe slot", duration: 1100 },
      { id: "mb-5", from: "mb", to: "cpu", label: "Power/Data", packet: "VRM delivery", description: "board จ่ายไฟและส่งสัญญาณระหว่างทุก component", duration: 1000 },
    ],
  },
  "network-hardware-flow": {
    slug: "network-hardware-flow",
    title: "Network Hardware Topology",
    description: "NIC → switch → router — เชื่อมเครื่องเข้าเครือข่าย",
    conceptSlug: "nic",
    protocol: "Ethernet",
    category: "hardware",
    nodes: [
      { id: "pc", label: "PC", description: "เครื่อง client", type: "client", position: { x: 0, y: 120 } },
      { id: "nic", label: "NIC", description: "Network Interface Card", type: "network", position: { x: 200, y: 120 } },
      { id: "switch", label: "Switch", description: "เชื่อมอุปกรณ์ใน LAN", type: "network", position: { x: 400, y: 120 } },
      { id: "router", label: "Router", description: "gateway ออก internet", type: "network", position: { x: 600, y: 120 } },
      { id: "internet", label: "Internet", description: "WAN", type: "server", position: { x: 800, y: 120 } },
    ],
    steps: [
      { id: "nh-1", from: "pc", to: "nic", label: "Frames", packet: "Ethernet", description: "OS ส่ง frame ผ่าน NIC", duration: 1100 },
      { id: "nh-2", from: "nic", to: "switch", label: "LAN", packet: "MAC address", description: "switch forward frame ไป port ที่ถูก", duration: 1100 },
      { id: "nh-3", from: "switch", to: "router", label: "Gateway", packet: "192.168.1.1", description: "traffic ข้าม subnet ไป router", duration: 1100 },
      { id: "nh-4", from: "router", to: "internet", label: "NAT", packet: "public IP", description: "router แปลง private IP ออก WAN", duration: 1000 },
    ],
  },
  "embedded-board-flow": {
    slug: "embedded-board-flow",
    title: "Embedded Development Board",
    description: "Arduino / ESP32 / Raspberry Pi — โปรแกรมและต่อ sensor",
    conceptSlug: "esp32",
    protocol: "GPIO",
    category: "hardware",
    nodes: [
      { id: "dev", label: "Developer", description: "เขียน firmware", type: "client", position: { x: 0, y: 120 } },
      { id: "ide", label: "IDE / flasher", description: "Arduino IDE, esptool", type: "service", position: { x: 240, y: 120 } },
      { id: "board", label: "ESP32 / Pi", description: "development board", type: "device", position: { x: 480, y: 120 } },
      { id: "sensor", label: "Sensors", description: "GPIO, I2C, SPI", type: "device", position: { x: 720, y: 120 } },
    ],
    steps: [
      { id: "eb-1", from: "dev", to: "ide", label: "Write code", packet: "sketch.ino", description: "เขียนโปรแกรมอ่าน sensor / WiFi", duration: 1100 },
      { id: "eb-2", from: "ide", to: "board", label: "Flash", packet: "USB upload", description: "อัปโหลด firmware ลง board", duration: 1200 },
      { id: "eb-3", from: "board", to: "sensor", label: "Read", packet: "DHT22 data", description: "board อ่านค่าจาก sensor ที่ต่อ", duration: 1100 },
      { id: "eb-4", from: "sensor", to: "board", label: "Values", packet: "temp=28°C", description: "ส่งข้อมูลกลับ MCU ประมวลผลต่อ", duration: 1000 },
    ],
  },
  "server-infra-flow": {
    slug: "server-infra-flow",
    title: "Server Infrastructure",
    description: "rack → RAID → data center — โครงสร้าง server ระดับองค์กร",
    conceptSlug: "rack-server",
    protocol: "Infrastructure",
    category: "hardware",
    nodes: [
      { id: "dc", label: "Data Center", description: "อาคาร + power + cooling", type: "server", position: { x: 0, y: 120 } },
      { id: "rack", label: "Rack", description: "42U server rack", type: "device", position: { x: 240, y: 120 } },
      { id: "server", label: "Server", description: "1U/2U machine", type: "server", position: { x: 480, y: 60 } },
      { id: "raid", label: "RAID Array", description: "redundant disks", type: "database", position: { x: 480, y: 180 } },
    ],
    steps: [
      { id: "si-1", from: "dc", to: "rack", label: "Power/Cool", packet: "PDU, HVAC", description: "data center จ่ายไฟและระบายความร้อน", duration: 1100 },
      { id: "si-2", from: "rack", to: "server", label: "Mount", packet: "slide rails", description: "ติด server ลง rack unit", duration: 1100 },
      { id: "si-3", from: "server", to: "raid", label: "Storage", packet: "RAID 10", description: "หลาย disk ทำงานร่วมกัน — fault tolerance", duration: 1100 },
      { id: "si-4", from: "raid", to: "server", label: "I/O", packet: "redundant read", description: "RAID controller จัดการ read/write และ rebuild", duration: 1000 },
    ],
  },
  "peripheral-flow": {
    slug: "peripheral-flow",
    title: "Peripherals & Power",
    description: "PSU จ่ายไฟ → motherboard → monitor และอุปกรณ์ต่อพ่วง",
    conceptSlug: "psu",
    protocol: "Hardware",
    category: "hardware",
    nodes: [
      { id: "psu", label: "PSU", description: "Power Supply Unit", type: "device", position: { x: 0, y: 120 } },
      { id: "mb", label: "Motherboard", description: "รับไฟ 24-pin", type: "device", position: { x: 280, y: 120 } },
      { id: "io", label: "I/O Ports", description: "USB, HDMI, audio", type: "network", position: { x: 520, y: 60 } },
      { id: "monitor", label: "Monitor", description: "แสดงผล", type: "client", position: { x: 520, y: 180 } },
    ],
    steps: [
      { id: "pf-1", from: "psu", to: "mb", label: "12V/5V", packet: "ATX power", description: "PSU แปลง AC เป็น DC จ่าย motherboard", duration: 1100 },
      { id: "pf-2", from: "mb", to: "io", label: "USB", packet: "keyboard/mouse", description: "peripheral ต่อผ่าน USB port", duration: 1100 },
      { id: "pf-3", from: "mb", to: "monitor", label: "HDMI/DP", packet: "display signal", description: "GPU/onboard ส่งภาพไป monitor", duration: 1100 },
      { id: "pf-4", from: "io", to: "mb", label: "Input", packet: "HID events", description: "ข้อมูลจาก keyboard/mouse กลับ CPU", duration: 1000 },
    ],
  },
  "security-hardware-flow": {
    slug: "security-hardware-flow",
    title: "Hardware Security Boot",
    description: "Secure Boot + TPM — ยืนยัน firmware และเก็บ keys",
    conceptSlug: "secure-boot",
    protocol: "UEFI",
    category: "hardware",
    nodes: [
      { id: "uefi", label: "UEFI Firmware", description: "boot firmware", type: "service", position: { x: 0, y: 120 } },
      { id: "tpm", label: "TPM Chip", description: "Trusted Platform Module", type: "device", position: { x: 280, y: 60 } },
      { id: "bootloader", label: "Bootloader", description: "signed binary", type: "service", position: { x: 280, y: 180 } },
      { id: "os", label: "OS Kernel", description: "Windows / Linux", type: "server", position: { x: 560, y: 120 } },
    ],
    steps: [
      { id: "sh-1", from: "uefi", to: "bootloader", label: "Verify", packet: "signature check", description: "Secure Boot ตรวจลายเซ็น bootloader", duration: 1100 },
      { id: "sh-2", from: "uefi", to: "tpm", label: "PCR extend", packet: "measurement", description: "บันทึก hash ของ firmware ลง TPM", duration: 1100 },
      { id: "sh-3", from: "bootloader", to: "os", label: "Load", packet: "kernel.img", description: "bootloader โหลด OS kernel ที่เชื่อถือได้", duration: 1100 },
      { id: "sh-4", from: "tpm", to: "os", label: "Seal keys", packet: "BitLocker", description: "TPM เก็บ encryption keys — ปลดล็อกเมื่อ boot ถูกต้อง", duration: 1000 },
    ],
  },
  "specialized-chip-flow": {
    slug: "specialized-chip-flow",
    title: "ASIC vs FPGA",
    description: "ชิปเฉพาะทาง — ASIC ประมวลผลคงที่ vs FPGA ปรับแต่งได้",
    conceptSlug: "asic",
    protocol: "Silicon",
    category: "hardware",
    nodes: [
      { id: "design", label: "Design", description: "algorithm / circuit", type: "client", position: { x: 0, y: 120 } },
      { id: "asic", label: "ASIC", description: "Application-Specific IC", type: "device", position: { x: 320, y: 60 } },
      { id: "fpga", label: "FPGA", description: "Field-Programmable Gate Array", type: "device", position: { x: 320, y: 180 } },
      { id: "output", label: "Compute", description: "hash / signal processing", type: "server", position: { x: 600, y: 120 } },
    ],
    steps: [
      { id: "sc-1", from: "design", to: "asic", label: "Tape-out", packet: "fixed circuit", description: "ออกแบบวงจรเฉพาะ — ผลิตครั้งเดียว เร็วและประหยัดพลังงาน", duration: 1200 },
      { id: "sc-2", from: "asic", to: "output", label: "Run", packet: "SHA-256", description: "ASIC ทำงานเฉพาะ algorithm ที่ออกแบบ", duration: 1100 },
      { id: "sc-3", from: "design", to: "fpga", label: "Synthesize", packet: "HDL bitstream", description: "FPGA โหลด configuration ใหม่ได้", duration: 1100 },
      { id: "sc-4", from: "fpga", to: "output", label: "Reconfig", packet: "prototype", description: "เหมาะ prototype — เปลี่ยน logic โดยไม่ผลิตชิปใหม่", duration: 1000 },
    ],
  },
};

const VIZ_LINKS = {
  // Programming
  array: "array-flow",
  stack: "stack-flow",
  tree: "tree-flow",
  "linked-list": "linked-list-flow",
  "hash-table": "hash-table-flow",
  "data-structure": "array-flow",
  heap: "tree-flow",
  queue: "stack-flow",
  "graph-structure": "tree-flow",
  oop: "oop-flow",

  // Git & GitHub
  "git-commit": "git-commit-flow",
  "git-add": "git-commit-flow",
  "git-status": "git-commit-flow",
  "git-merge": "git-merge-flow",
  "git-rebase": "git-merge-flow",
  "git-branch": "git-branch-flow",
  "git-checkout": "git-branch-flow",
  "git-push": "git-push-flow",
  "git-pull": "git-push-flow",
  "git-fetch": "git-push-flow",
  "git-init": "git-workflow-flow",
  "git-clone": "git-workflow-flow",
  "git-remote": "git-push-flow",
  "github-pr": "git-workflow-flow",
  "gh-cli": "git-workflow-flow",
  "git-diff": "git-diff-flow",
  "git-log": "git-log-flow",
  "git-stash": "git-stash-flow",

  // CLI — navigation
  cd: "cli-navigation-flow",
  ls: "cli-navigation-flow",
  pwd: "cli-navigation-flow",
  mkdir: "cli-navigation-flow",
  "win-cd": "cli-navigation-flow",
  "win-dir": "cli-navigation-flow",
  "win-mkdir": "cli-navigation-flow",

  // CLI — network
  curl: "curl-request-flow",
  wget: "curl-request-flow",
  ping: "ping-test-flow",
  "win-ping": "ping-test-flow",
  "ps-test-netconnection": "ping-test-flow",
  "ps-invoke-webrequest": "curl-request-flow",
  ssh: "ssh-flow",
  scp: "ssh-flow",
  dig: "dns-flow",
  nslookup: "dns-flow",
  host: "dns-flow",
  "win-nslookup": "dns-flow",
  "ps-resolve-dnsname": "dns-flow",
  ifconfig: "ip-config-flow",
  "win-ipconfig": "ip-config-flow",
  netstat: "netstat-flow",
  "win-netstat": "netstat-flow",
  traceroute: "traceroute-flow",
  "win-tracert": "traceroute-flow",
  nc: "network-connect-flow",
  telnet: "network-connect-flow",

  // CLI — files & search
  grep: "grep-flow",
  "win-findstr": "grep-flow",
  cat: "file-read-flow",
  "win-type": "file-read-flow",
  chmod: "file-ops-flow",
  "win-copy": "file-ops-flow",
  "win-del": "file-ops-flow",
  "win-where": "file-search-flow",
  whois: "whois-flow",
  npm: "npm-flow",
  "win-npm": "npm-flow",

  // Hardware
  "boot-process": "boot-process-flow",
  "bios-uefi": "boot-process-flow",
  cpu: "cpu-memory-flow",
  ram: "cpu-memory-flow",
  storage: "cpu-memory-flow",
  gpu: "cpu-memory-flow",
  motherboard: "motherboard-flow",
  nic: "network-hardware-flow",
  router: "network-hardware-flow",
  switch: "network-hardware-flow",
  esp32: "embedded-board-flow",
  arduino: "embedded-board-flow",
  "raspberry-pi": "embedded-board-flow",
  "rack-server": "server-infra-flow",
  "data-center": "server-infra-flow",
  raid: "server-infra-flow",
  psu: "peripheral-flow",
  "display-monitor": "peripheral-flow",
  "peripheral-io": "peripheral-flow",
  "secure-boot": "security-hardware-flow",
  tpm: "security-hardware-flow",
  asic: "specialized-chip-flow",
  fpga: "specialized-chip-flow",
  "hypervisor-host": "cloud-vm-flow",
  "edge-device-hardware": "iot-gateway-flow",

  // IoT
  sensor: "sensor-flow",
  "edge-computing": "edge-computing-flow",

  // DevOps
  "ci-cd": "deploy-flow",
};

// Write new visualization files
let created = 0;
for (const [filename, data] of Object.entries(NEW_VISUALIZATIONS)) {
  const filePath = path.join(vizDir, `${filename}.json`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
    created++;
  }
}
console.log(`Created ${created} new visualization files`);

// Link concepts
let linked = 0;
for (const file of fs.readdirSync(conceptsDir).filter((f) => f.endsWith(".json"))) {
  const filePath = path.join(conceptsDir, file);
  const concept = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const viz = VIZ_LINKS[concept.slug];
  if (viz && concept.visualization !== viz) {
    concept.visualization = viz;
    fs.writeFileSync(filePath, `${JSON.stringify(concept, null, 2)}\n`);
    linked++;
  }
}
console.log(`Linked ${linked} concepts to visualizations`);

// Stats
const concepts = fs
  .readdirSync(conceptsDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(conceptsDir, f), "utf8")));
const withViz = concepts.filter((c) => c.visualization).length;
console.log(`Coverage: ${withViz}/${concepts.length} concepts have visualization`);
