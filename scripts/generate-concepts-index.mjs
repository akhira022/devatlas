import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const conceptsDir = path.join(__dirname, "..", "data", "concepts");

const fixes = {
  "ci-cd": "ciCd",
  "gh-cli": "ghCli",
  oop: "oop",
  "ps-invoke-webrequest": "psInvokeWebrequest",
  "ps-resolve-dnsname": "psResolveDnsname",
  "ps-test-netconnection": "psTestNetconnection",
  switch: "networkSwitch",
  "cloud-computing": "cloudComputing",
  "data-structure": "dataStructure",
  "edge-computing": "edgeComputing",
  "edge-device-hardware": "edgeDeviceHardware",
  "graph-structure": "graphStructure",
  "hash-table": "hashTable",
  "linked-list": "linkedList",
  "load-balancer": "loadBalancer",
  "machine-learning": "machineLearning",
  "neural-network": "neuralNetwork",
  "object-storage": "objectStorage",
  "prompt-engineering": "promptEngineering",
  "virtual-machine": "virtualMachine",
  "bios-uefi": "biosUefi",
  "boot-process": "bootProcess",
  "data-center": "dataCenter",
  "display-monitor": "displayMonitor",
  "fine-tuning": "fineTuning",
  "github-pr": "githubPr",
  "git-add": "gitAdd",
  "git-branch": "gitBranch",
  "git-checkout": "gitCheckout",
  "git-clone": "gitClone",
  "git-commit": "gitCommit",
  "git-diff": "gitDiff",
  "git-fetch": "gitFetch",
  "git-init": "gitInit",
  "git-log": "gitLog",
  "git-merge": "gitMerge",
  "git-pull": "gitPull",
  "git-push": "gitPush",
  "git-rebase": "gitRebase",
  "git-remote": "gitRemote",
  "git-stash": "gitStash",
  "git-status": "gitStatus",
  "hypervisor-host": "hypervisorHost",
  "iot-gateway": "iotGateway",
  "peripheral-io": "peripheralIo",
  "rack-server": "rackServer",
  "raspberry-pi": "raspberryPi",
  "secure-boot": "secureBoot",
  "win-cd": "winCd",
  "win-copy": "winCopy",
  "win-del": "winDel",
  "win-dir": "winDir",
  "win-findstr": "winFindstr",
  "win-ipconfig": "winIpconfig",
  "win-mkdir": "winMkdir",
  "win-netstat": "winNetstat",
  "win-npm": "winNpm",
  "win-nslookup": "winNslookup",
  "win-ping": "winPing",
  "win-tracert": "winTracert",
  "win-type": "winType",
  "win-where": "winWhere",
};

function importName(base) {
  if (fixes[base]) return fixes[base];
  return base.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
}

const files = fs
  .readdirSync(conceptsDir)
  .filter((f) => f.endsWith(".json"))
  .sort();

const importLines = files.map((f) => {
  const base = f.replace(".json", "");
  return `import ${importName(base)} from "./${base}.json";`;
});

const arrayLines = files.map((f) => {
  const base = f.replace(".json", "");
  return `  ${importName(base)},`;
});

const content = `${importLines.join("\n")}
import type { Concept } from "@/types/concept";

export const concepts: Concept[] = [
${arrayLines.join("\n")}
] as Concept[];
`;

fs.writeFileSync(path.join(conceptsDir, "index.ts"), content);
console.log(`Wrote index.ts with ${files.length} concepts`);
