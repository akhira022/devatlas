import {
  calculateSubnet,
  ipv4ToBinary,
  ipv4ToString,
  prefixToMask,
  wildcardFromMask,
  type SubnetResult,
} from "@/lib/netcalc/ipv4";
import { type VlsmAllocation } from "@/lib/netcalc/vlsm";

export interface CalcStep {
  id: string;
  title: string;
  /** สูตรหรือแนวคิดสั้นๆ */
  formula: string;
  /** ค่าที่นำมาใช้ */
  inputs: string[];
  /** การคำนวณทีละบรรทัด */
  work: string[];
  /** คำตอบของขั้นนี้ */
  result: string;
  tip?: string;
}

function octets(value: number): [number, number, number, number] {
  const n = value >>> 0;
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff];
}

function octetBinary(n: number): string {
  return n.toString(2).padStart(8, "0");
}

/** Octet ที่ mask ไม่ใช่ 255 และไม่ใช่ 0 ทั้ง (host bits อยู่ตรงนี้) — ถ้า /8-/24 ใช้ octet สุดท้ายที่มี host bits */
function interestingOctetIndex(prefix: number): number {
  if (prefix >= 24) return 3;
  if (prefix >= 16) return 2;
  if (prefix >= 8) return 1;
  return 0;
}

/**
 * สร้างขั้นตอนคำนวณ IPv4 subnet แบบละเอียด
 * ใช้ฝึกทำเองได้ — แสดงค่าที่นำมาใช้ สูตร และผลลัพธ์แต่ละขั้น
 */
export function explainSubnet(ip: number, prefix: number): CalcStep[] {
  const subnet = calculateSubnet(ip, prefix);
  const mask = prefixToMask(prefix);
  const network = (ip & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const wildcard = wildcardFromMask(mask);
  const hostBits = 32 - prefix;
  const total = 2 ** hostBits;

  const ipO = octets(ip);
  const maskO = octets(mask);
  const netO = octets(network);
  const bcastO = octets(broadcast);
  const wildO = octets(wildcard);
  const idx = interestingOctetIndex(prefix);
  const blockSize = 256 - maskO[idx]!;

  const steps: CalcStep[] = [
    {
      id: "given",
      title: "1. ข้อมูลตั้งต้น",
      formula: "อ่าน IP และ prefix จาก CIDR",
      inputs: [`IP = ${subnet.ip}`, `Prefix = /${prefix}`],
      work: [
        `เขียนเป็น ${subnet.ip}/${prefix}`,
        `หมายความว่า ${prefix} bit แรกเป็น network — ที่เหลือ ${hostBits} bit เป็น host`,
      ],
      result: `${subnet.ip}/${prefix}`,
    },
    {
      id: "mask",
      title: "2. หา Subnet Mask จาก prefix",
      formula: `/${prefix} → ใส่ 1 จำนวน ${prefix} ตัว แล้วตามด้วย 0`,
      inputs: [`Prefix = ${prefix}`],
      work: [
        `สร้าง bitmask: 1 ซ้ำ ${prefix} ครั้ง แล้ว 0 ซ้ำ ${hostBits} ครั้ง`,
        `แบ่งเป็น 4 octet (ละ 8 bit):`,
        ipv4ToBinary(mask),
        `แปลงแต่ละ octet จาก binary → ทศนิยม`,
      ],
      result: `Subnet Mask = ${subnet.mask}`,
      tip: `จำไว้: /24 = 255.255.255.0, /26 = 255.255.255.192, /30 = 255.255.255.252`,
    },
    {
      id: "block",
      title: "3. หา Block Size (ขนาด subnet)",
      formula: "Block Size = 256 − octet ของ mask ที่ยังไม่เต็ม",
      inputs: [
        `Mask octet ที่ ${idx + 1} = ${maskO[idx]}`,
        `(octet ที่ host bits ยังเหลืออยู่)`,
      ],
      work: [
        `256 − ${maskO[idx]} = ${blockSize}`,
        `subnet ใน octet นี้จึงกระโดดทีละ ${blockSize} เช่น 0, ${blockSize}, ${
          blockSize * 2
        }, …`,
      ],
      result: `Block Size = ${blockSize}`,
      tip:
        prefix >= 24
          ? `ใช้กับ octet สุดท้าย — เช่น /26 → 256−192 = 64`
          : `host bits อยู่ที่ octet ที่ ${idx + 1} ของ IP`,
    },
    {
      id: "network",
      title: "4. หา Network Address (IP AND Mask)",
      formula: "Network = IP AND Mask (ทำทีละ octet)",
      inputs: [
        `IP   = ${ipO.join(".")}`,
        `Mask = ${maskO.join(".")}`,
      ],
      work: [
        ...ipO.map((octet, i) => {
          const and = octet & maskO[i]!;
          return `${octet} AND ${maskO[i]} = ${and}` +
            (i === idx
              ? `   ← binary: ${octetBinary(octet)} AND ${octetBinary(maskO[i]!)} = ${octetBinary(and)}`
              : "");
        }),
        `รวมเป็น ${netO.join(".")}`,
        `หรือใช้ block: IP octet[${idx + 1}]=${ipO[idx]} อยู่ในช่วงที่เริ่มที่ ${netO[idx]} (หาร ${blockSize} แล้วปัดลง × ${blockSize})`,
      ],
      result: `Network = ${subnet.network}`,
    },
    {
      id: "broadcast",
      title: "5. หา Broadcast Address",
      formula: "Broadcast = Network + Block Size − 1  (หรือ Network OR Wildcard)",
      inputs: [
        `Network = ${subnet.network}`,
        `Block Size = ${blockSize}`,
        `Wildcard = ${subnet.wildcard}`,
      ],
      work: [
        `วิธีที่ 1 (block): ${netO[idx]} + ${blockSize} − 1 = ${bcastO[idx]} → ${subnet.broadcast}`,
        `วิธีที่ 2 (OR wildcard) ทีละ octet:`,
        ...netO.map(
          (octet, i) => `${octet} OR ${wildO[i]} = ${octet | wildO[i]!}`,
        ),
      ],
      result: `Broadcast = ${subnet.broadcast}`,
    },
  ];

  if (prefix === 32) {
    steps.push({
      id: "hosts",
      title: "6. Host range และจำนวน host",
      formula: "/32 = host เดียว",
      inputs: [`Network = ${subnet.network}`],
      work: [
        "ไม่มี host bits — IP นี้คือทั้ง network และ host",
        "Usable hosts = 1",
      ],
      result: `Host = ${subnet.firstHost} · Usable = 1`,
    });
  } else if (prefix === 31) {
    steps.push({
      id: "hosts",
      title: "6. Host range และจำนวน host (RFC 3021)",
      formula: "/31 point-to-point — ใช้ได้ทั้ง 2 address",
      inputs: [`Network = ${subnet.network}`, `Broadcast = ${subnet.broadcast}`],
      work: [
        "ปกติจะหัก network/broadcast แต่ /31 ตาม RFC 3021 ใช้ทั้งคู่เป็น host ได้",
        `First = ${subnet.firstHost}, Last = ${subnet.lastHost}`,
        "Usable hosts = 2",
      ],
      result: `${subnet.firstHost} – ${subnet.lastHost} · Usable = 2`,
    });
  } else {
    steps.push({
      id: "hosts",
      title: "6. หา Host Range และ Usable Hosts",
      formula: "First = Network+1 · Last = Broadcast−1 · Usable = 2^(32−prefix) − 2",
      inputs: [
        `Network = ${subnet.network}`,
        `Broadcast = ${subnet.broadcast}`,
        `Host bits = ${hostBits}`,
      ],
      work: [
        `First host = ${subnet.network} + 1 = ${subnet.firstHost}`,
        `Last host  = ${subnet.broadcast} − 1 = ${subnet.lastHost}`,
        `Total addresses = 2^${hostBits} = ${total}`,
        `Usable hosts = ${total} − 2 (หัก network กับ broadcast) = ${subnet.usableHosts}`,
      ],
      result: `${subnet.firstHost} – ${subnet.lastHost} · Usable = ${subnet.usableHosts}`,
      tip: "Network (.ตาม mask) และ Broadcast ใช้เป็น IP ของเครื่องไม่ได้",
    });
  }

  steps.push({
    id: "wildcard",
    title: "7. หา Wildcard Mask",
    formula: "Wildcard = NOT Mask  (หรือ 255.255.255.255 − Mask ทีละ octet)",
    inputs: [`Mask = ${subnet.mask}`],
    work: [
      ...maskO.map((octet) => `255 − ${octet} = ${255 - octet}`),
      `หรือ bitwise NOT ของ mask → ${subnet.wildcard}`,
    ],
    result: `Wildcard = ${subnet.wildcard}`,
    tip: "ใช้บ่อยใน ACL ของ Cisco — 0 = ต้องตรง, 1 = ไม่สนใจ",
  });

  steps.push({
    id: "summary",
    title: "8. สรุปคำตอบทั้งหมด",
    formula: "รวบผลจากขั้น 2–7",
    inputs: [`โจทย์: ${subnet.ip}/${prefix}`],
    work: [
      `Network    = ${subnet.network}`,
      `Broadcast  = ${subnet.broadcast}`,
      `Host range = ${subnet.firstHost} – ${subnet.lastHost}`,
      `Usable     = ${subnet.usableHosts}`,
      `Mask       = ${subnet.mask}`,
      `Wildcard   = ${subnet.wildcard}`,
    ],
    result: `${subnet.network}/${prefix} (${subnet.usableHosts} usable hosts)`,
    tip: "ปิดผลลัพธ์ด้านบน แล้วลองคำนวณเองทีละขั้น แล้วเปิดเทียบ",
  });

  return steps;
}

export function explainSameSubnet(
  ipA: number,
  ipB: number,
  prefix: number,
): CalcStep[] {
  const mask = prefixToMask(prefix);
  const netA = (ipA & mask) >>> 0;
  const netB = (ipB & mask) >>> 0;
  const match = netA === netB;
  const subnetA = calculateSubnet(ipA, prefix);
  const subnetB = calculateSubnet(ipB, prefix);

  return [
    {
      id: "given",
      title: "1. ข้อมูลตั้งต้น",
      formula: "เทียบว่า IP สองตัวอยู่วงเดียวกันภายใต้ prefix เดียวกันหรือไม่",
      inputs: [
        `IP A = ${ipv4ToString(ipA)}`,
        `IP B = ${ipv4ToString(ipB)}`,
        `Prefix = /${prefix}`,
      ],
      work: [`ใช้ mask เดียวกัน: ${ipv4ToString(mask)}`],
      result: `Mask = ${ipv4ToString(mask)}`,
    },
    {
      id: "net-a",
      title: "2. หา Network ของ IP A",
      formula: "Network A = IP A AND Mask",
      inputs: [`IP A = ${ipv4ToString(ipA)}`, `Mask = ${ipv4ToString(mask)}`],
      work: octets(ipA).map(
        (octet, i) => `${octet} AND ${octets(mask)[i]} = ${octet & octets(mask)[i]!}`,
      ),
      result: `Network A = ${subnetA.network}`,
    },
    {
      id: "net-b",
      title: "3. หา Network ของ IP B",
      formula: "Network B = IP B AND Mask",
      inputs: [`IP B = ${ipv4ToString(ipB)}`, `Mask = ${ipv4ToString(mask)}`],
      work: octets(ipB).map(
        (octet, i) => `${octet} AND ${octets(mask)[i]} = ${octet & octets(mask)[i]!}`,
      ),
      result: `Network B = ${subnetB.network}`,
    },
    {
      id: "compare",
      title: "4. เปรียบเทียบ",
      formula: "ถ้า Network A = Network B → อยู่ใน subnet เดียวกัน",
      inputs: [`Network A = ${subnetA.network}`, `Network B = ${subnetB.network}`],
      work: [
        match
          ? `${subnetA.network} = ${subnetB.network} → ตรงกัน`
          : `${subnetA.network} ≠ ${subnetB.network} → ไม่ตรงกัน`,
      ],
      result: match
        ? `อยู่ใน subnet เดียวกัน (${subnetA.network}/${prefix})`
        : `คนละ subnet — A อยู่ ${subnetA.network}/${prefix}, B อยู่ ${subnetB.network}/${prefix}`,
      tip: "บน LAN เดียวกัน (subnet เดียวกัน) ส่งตรงได้โดยไม่ผ่าน router",
    },
  ];
}

export function explainVlsmAllocation(
  name: string,
  requestedHosts: number,
  allocation: VlsmAllocation,
  previousCursor: string | null,
): CalcStep[] {
  const prefix = allocation.prefix;
  const hostBits = 32 - prefix;

  let needWork: string[];
  if (prefix === 31) {
    needWork = ["ขอ 2 hosts → ใช้ /31 (RFC 3021)"];
  } else if (prefix === 32) {
    needWork = ["ขอ 1 host → ใช้ /32"];
  } else {
    const usable = 2 ** hostBits - 2;
    needWork = [
      `ลองหา n ที่ 2^n − 2 ≥ ${requestedHosts}`,
      `ได้ host bits = ${hostBits} เพราะ 2^${hostBits} − 2 = ${usable} ≥ ${requestedHosts}`,
      `Prefix = 32 − ${hostBits} = /${prefix}`,
    ];
  }

  return [
    {
      id: `${name}-need`,
      title: `${name}: หา prefix ที่พอสำหรับ ${requestedHosts} hosts`,
      formula: "หา prefix เล็กสุดที่ Usable ≥ จำนวน host ที่ขอ",
      inputs: [`ต้องการ ${requestedHosts} usable hosts`],
      work: needWork,
      result: `ใช้ /${prefix} (mask ${allocation.mask}, usable ${allocation.usableHosts})`,
    },
    {
      id: `${name}-place`,
      title: `${name}: วาง subnet ในพื้นที่ว่าง`,
      formula: "จัดเรียงจากใหญ่→เล็ก · เริ่มจาก address ถัดจากวงก่อนหน้า (จัดขอบ block)",
      inputs: [
        previousCursor
          ? `เริ่มหลังวงก่อนหน้า ที่ ${previousCursor}`
          : "เริ่มที่ต้นเครือข่ายฐาน",
        `ขนาดบล็อก = 2^${hostBits} = ${allocation.totalAddresses}`,
      ],
      work: [
        `Network ที่จัดได้ = ${allocation.network}/${prefix}`,
        `Broadcast = ${allocation.broadcast}`,
        `Host range = ${allocation.firstHost} – ${allocation.lastHost}`,
        `Wildcard = ${allocation.wildcard}`,
      ],
      result: `${allocation.network}/${prefix}`,
      tip: "เรียงแผนกจาก host มาก→น้อยก่อน เพื่อลดเศษพื้นที่",
    },
  ];
}

/** Re-export helper for UI that already has SubnetResult */
export function explainSubnetFromResult(subnet: SubnetResult): CalcStep[] {
  // Re-parse ip string is safer via octets from result fields — reconstruct int from network+offset isn't needed
  const parts = subnet.ip.split(".").map(Number);
  const ip =
    ((parts[0]! << 24) >>> 0) +
    ((parts[1]! << 16) >>> 0) +
    ((parts[2]! << 8) >>> 0) +
    (parts[3]! >>> 0);
  return explainSubnet(ip, subnet.prefix);
}
