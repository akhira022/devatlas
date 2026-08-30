/**
 * Complete visualization links — run after complete-visualizations.mjs or standalone.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const conceptsDir = path.join(__dirname, "..", "data", "concepts");

const VIZ_LINKS = {
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
  cd: "cli-navigation-flow",
  ls: "cli-navigation-flow",
  pwd: "cli-navigation-flow",
  mkdir: "cli-navigation-flow",
  "win-cd": "cli-navigation-flow",
  "win-dir": "cli-navigation-flow",
  "win-mkdir": "cli-navigation-flow",
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
  sensor: "sensor-flow",
  "edge-computing": "edge-computing-flow",
  "ci-cd": "deploy-flow",
};

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
