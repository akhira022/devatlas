/**
 * Polish and refine all website content — concepts, visualizations, scenarios.
 * Run: node scripts/polish-content.mjs
 */
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

function fixTypos(text) {
  return text.replaceAll("อนุญาิ", "อนุญาต");
}

function mergeSections(existing, additions) {
  const byType = new Map(existing.map((s) => [s.type, s]));
  for (const [type, section] of Object.entries(additions)) {
    if (!byType.has(type)) {
      byType.set(type, { type, ...section });
    } else {
      const cur = byType.get(type);
      const curLen = (cur.content?.length ?? 0) + (cur.items?.join("").length ?? 0);
      const newLen = (section.content?.length ?? 0) + (section.items?.join("").length ?? 0);
      if (newLen > curLen + 40) {
        byType.set(type, { type, ...section });
      }
    }
  }
  return SECTION_ORDER.filter((t) => byType.has(t)).map((t) => byType.get(t));
}

/** Richer content for concepts with terse sections */
const POLISH = {
  motherboard: {
    what_is: {
      content:
        "Motherboard (Mainboard) คือแผงวงจรพิมพ์ (PCB) หลักที่เชื่อมทุก component เข้าด้วยกัน — มี CPU socket, RAM slots, chipset, M.2/SATA connectors, PCIe slots และ I/O panel\n\nForm factor ยอดนิยม: ATX, Micro-ATX, Mini-ITX — กำหนดขนาดเคสและจำนวน expansion ที่ใส่ได้",
    },
    why: {
      content:
        "Motherboard เป็นฐานของทุก build — เลือกผิดแล้วอาจใส่ CPU/RAM ไม่ได้หรือขยายอนาคตยาก:\n\n- กำหนด CPU socket (AM5, LGA1700) และ RAM generation (DDR4/DDR5)\n- จำนวน PCIe/M.2 slots สำหรับ GPU และ SSD\n- VRM quality ส่งผลต่อ overclock และ stability\n- I/O ports (USB-C, 2.5G LAN) ตามความต้องการใช้งาน",
    },
    how_it_works: {
      content:
        "1. ติด CPU ลง socket — chipset จัดการ communication bus\n2. เสียบ RAM ลง DIMM slots — dual-channel ให้ bandwidth สูงขึ้น\n3. ต่อ storage ผ่าน M.2 NVMe หรือ SATA\n4. ใส่การ์ดขยายใน PCIe (GPU, NIC, capture card)\n5. PSU จ่ายไฟผ่าน 24-pin ATX + CPU 8-pin\n6. BIOS/UEFI ตั้งค่า boot order, XMP profile, fan curve",
    },
    real_world_example: {
      content:
        "Build workstation สำหรับ ML:\n\n1. เลือก board รองรับ dual GPU (PCIe x16 + x16 หรือ x8/x8)\n2. ตรวจ QVL ว่า RAM 128GB kit รองรับ\n3. M.2 slot อย่างน้อย 2 ตัว — OS + dataset\n4. 2.5G Ethernet onboard สำหรับ NAS transfer",
    },
  },
  psu: {
    what_is: {
      content:
        "PSU (Power Supply Unit) แปลงไฟฟ้า AC จากปลั๊กเป็น DC หลายแรงดัน (+12V, +5V, +3.3V) ให้ motherboard, CPU, GPU และอุปกรณ์ภายในเคส\n\nมี rating 80 Plus (Bronze → Titanium) วัดประสิทธิภาพการแปลงพลังงาน — Gold ขึ้นไปเหมาะ build ทั่วไป",
    },
    why: {
      content:
        "PSU คุณภาพต่ำเสี่ยงต่อความเสียหายของ component ทั้งระบบ:\n\n- Wattage ต้องรองรับ peak load (CPU + GPU พร้อมกัน) + headroom 20%\n- Server ใช้ redundant PSU — สลับตัวใดตัวหนึ่งได้โดยไม่ดับ\n- Modular cable ช่วยจัดการสายและ airflow ในเคส",
    },
    how_it_works: {
      content:
        "1. รับ AC 110V/220V จากปลั๊กไฟ\n2. แปลงและจ่าย DC ผ่าน rail (+12V สำหรับ GPU/CPU, +5V/+3.3V สำหรับ board)\n3. ATX 24-pin จ่าย motherboard, 8-pin CPU, PCIe 6+2-pin ให้การ์ดจอ\n4. PSU ปรับ output ตาม load จริง — ไม่ได้จ่ายเต็ม wattage ตลอดเวลา",
    },
  },
  nic: {
    what_is: {
      content:
        "NIC (Network Interface Card) คือฮาร์ดแวร์ที่เชื่อมเครื่องเข้าเครือข่าย — อาจเป็น chip บน motherboard (onboard), การ์ด PCIe แยก หรือ WiFi module\n\nทุก NIC มี MAC address ไม่ซ้ำกัน ใช้ระบุตัวตนที่ Layer 2 (Ethernet)",
    },
    why: {
      content:
        "NIC เป็นจุดเชื่อมระหว่าง OS กับสาย/คลื่นเครือข่าย:\n\n- Server ใช้ 10G/25G NIC สำหรับ throughput สูง\n- Bonding/teaming หลาย NIC เพิ่ม redundancy\n- Container และ VM สร้าง virtual NIC (veth, bridge) แยก network namespace",
    },
    how_it_works: {
      content:
        "1. OS โหลด driver ควบคุม NIC\n2. NIC ส่ง/รับ Ethernet frames พร้อม MAC ของตัวเอง\n3. ARP แปลง IP → MAC ใน LAN\n4. IP layer จัดการ routing ข้าม subnet\n5. Virtual NIC ใน Docker/K8s แยก traffic ของแต่ละ container",
    },
  },
  router: {
    what_is: {
      content:
        "Router คืออุปกรณ์เครือข่ายที่ forward packet ระหว่าง network ต่างกัน — มักเป็น gateway ของบ้าน/ออฟฟิศ ออกสู่ internet\n\nทำหน้าที่ routing (เลือกเส้นทาง), NAT (แปลง private IP → public IP) และมักรวม DHCP, firewall, WiFi AP",
    },
    why: {
      content:
        "LAN ใช้ private IP (192.168.x.x) ไม่สามารถออก internet โดยตรง — router เป็นสะพาน:\n\n- แจก IP ให้ device ผ่าน DHCP\n- NAT ให้หลายเครื่องใช้ public IP เดียว\n- แยก broadcast domain จาก ISP network",
    },
    how_it_works: {
      content:
        "1. รับ frame จาก LAN interface\n2. ดู destination IP ในตาราง routing\n3. ถ้าปลายทางอยู่นอก LAN — แปลง source IP ด้วย NAT\n4. Forward packet ออก WAN interface\n5. รับ reply จาก internet แล้วส่งกลับ device ที่ถูกต้อง",
    },
  },
  switch: {
    what_is: {
      content:
        "Network Switch เชื่อมอุปกรณ์หลายตัวใน LAN โดย forward frame ไปยัง port ที่มี MAC ปลายทาง — ต่างจาก hub ที่ broadcast ทุก port\n\nManaged switch ตั้ง VLAN, QoS, port mirroring ได้; unmanaged ใช้ plug-and-play",
    },
    why: {
      content:
        "Switch ลด collision และเพิ่ม bandwidth — แต่ละ port ได้ full duplex:\n\n- ออฟฟิศ/บ้านขนาดใหญ่ต้องมี switch แยกจาก router\n- Data center ใช้ switch ความเร็ว 25G/100G\n- VLAN แยก traffic (guest WiFi vs internal server)",
    },
    how_it_works: {
      content:
        "1. รับ Ethernet frame ที่ port ใด port หนึ่ง\n2. ดู destination MAC ในตาราง MAC address\n3. Forward ไปเฉพาะ port ที่มี MAC นั้น\n4. ถ้าไม่รู้ MAC — flood ทุก port (ยกเว้น port ต้นทาง)\n5. เรียนรู้ MAC จาก source address ของ frame ที่ผ่าน",
    },
  },
  esp32: {
    what_is: {
      content:
        "ESP32 คือ microcontroller จาก Espressif ที่รวม dual-core CPU, WiFi 802.11 และ Bluetooth/BLE ในชิปเดียว — โปรแกรมได้ด้วย Arduino IDE, PlatformIO หรือ ESP-IDF (native SDK)\n\nราคาถูก (หลักร้อยบาท) จึงเป็นตัวเลือกยอดนิยมสำหรับ IoT prototype และ smart home",
    },
    why: {
      content:
        "ESP32 เหมาะโปรเจกต์ที่ต้องการ WiFi + sensor โดยไม่ต้องต่อ Raspberry Pi:\n\n- Smart home sensor ส่ง MQTT ไป Home Assistant\n- BLE beacon และ wearable prototype\n- Deep sleep ลดพลังงาน — ทำงานด้วย battery นาน\n- OTA update อัปเดต firmware ผ่าน WiFi",
    },
    how_it_works: {
      content:
        "1. เขียน firmware (C/C++ ใน Arduino หรือ ESP-IDF)\n2. Flash ลง board ผ่าน USB\n3. ตั้งค่า WiFi credentials (WiFiManager หรือ hardcode)\n4. อ่าน sensor ผ่าน GPIO/ADC/I2C\n5. ส่งข้อมูลด้วย MQTT, HTTP หรือ WebSocket\n6. Deep sleep เมื่อไม่มีงาน — ตื่นตาม timer หรือ interrupt",
    },
  },
  arduino: {
    what_is: {
      content:
        "Arduino คือแพลตฟอร์ม embedded แบบ open-source — board (เช่น Uno, Nano) + IDE ที่เขียน sketch ด้วย C++ แบบง่าย\n\nเหมาะเรียนรู้ electronics และ prototype ก่อนย้ายไป production board",
    },
    why: {
      content:
        "Arduino ลด barrier ในการเริ่มต้น hardware programming:\n\n- ecosystem ใหญ่ — shield และ library มากมาย\n- ไม่ต้องตั้งค่า OS — flash แล้วรัน\n- community และ tutorial ภาษาไทย/อังกฤษเยอะ\n- bridge สู่ ESP32, STM32 เมื่อต้องการ WiFi หรือ performance",
    },
    how_it_works: {
      content:
        "1. เขียน sketch ใน Arduino IDE\n2. Compile และ upload ผ่าน USB\n3. `setup()` รันครั้งเดียวตอน boot, `loop()` รันซ้ำ\n4. อ่าน/เขียน digital และ analog pin\n5. ใช้ library สำหรับ sensor, motor, display",
    },
  },
  "raspberry-pi": {
    what_is: {
      content:
        "Raspberry Pi คือ single-board computer (SBC) ขนาดเครดิตการ์ด รัน Linux เต็มรูปแบบ — มี GPIO สำหรับต่อ sensor และ actuator\n\nต่างจาก Arduino/ESP32 ที่เป็น MCU — Pi เหมาะงานที่ต้องการ OS, networking และ processing มากกว่า",
    },
    why: {
      content:
        "Pi เหมาะ gateway, media server, และ IoT hub:\n\n- รัน Docker, Python, Node.js ได้\n- Home Assistant, Pi-hole, NAS lightweight\n- GPIO + camera module สำหรับ computer vision\n- ราคาถูกกว่า PC สำหรับ edge processing",
    },
    how_it_works: {
      content:
        "1. Flash OS (Raspberry Pi OS) ลง microSD\n2. Boot แล้วตั้งค่า WiFi/SSH\n3. รัน service (MQTT broker, web server)\n4. อ่าน sensor ผ่าน GPIO หรือ USB\n5. ส่งข้อมูลขึ้น cloud หรือแสดง dashboard local",
    },
  },
  "secure-boot": {
    what_is: {
      content:
        "Secure Boot คือกลไกใน UEFI ที่ตรวจลายเซ็นดิจิทัลของ bootloader และ OS kernel ก่อนโหลด — ป้องกัน rootkit และ bootkit ที่แทรกก่อน OS ทำงาน",
    },
    why: {
      content:
        "ถ้า malware แทรกตั้งแต่ boot ระดับ firmware — antivirus ใน OS อาจไม่เห็น:\n\n- Secure Boot อนุญาตเฉพาะ binary ที่ vendor ลงนาม\n- มาตรฐานใน Windows 11 และ enterprise laptop\n- ทำงานร่วมกับ TPM สำหรับ disk encryption",
    },
    how_it_works: {
      content:
        "1. UEFI firmware มี public key ของ vendor (Microsoft, Linux distro)\n2. Bootloader ต้องมีลายเซ็นที่ถูกต้อง\n3. ถ้า signature ไม่ตรง — ปฏิเสธ boot\n4. ลำดับ: firmware → signed bootloader → signed kernel\n5. ปิด Secure Boot ได้ใน BIOS สำหรับ dual-boot หรือ custom kernel",
    },
  },
  tpm: {
    what_is: {
      content:
        "TPM (Trusted Platform Module) คือชิปฮาร์ดแวร์ที่เก็บ cryptographic keys และบันทึก measurement ของ boot process — อาจเป็น discrete chip หรือ firmware TPM (fTPM) บน CPU",
    },
    why: {
      content:
        "TPM ทำให้ encryption key ไม่ถูกดึงออกจากเครื่องง่าย ๆ:\n\n- BitLocker, LUKS disk encryption ผูกกับ TPM\n- Windows Hello และ enterprise attestation\n- ตรวจจับการเปลี่ยน firmware/bootloader (PCR values)",
    },
    how_it_works: {
      content:
        "1. แต่ละ boot stage ส่ง hash ไป TPM (PCR extend)\n2. OS ขอ unwrap encryption key — TPM ตรวจ PCR ตรงกับตอน seal หรือไม่\n3. ถ้า boot chain ถูกแก้ — key ไม่ถูกปล่อย\n4. Remote attestation พิสูจน์ว่าเครื่อง boot ถูกต้อง",
    },
  },
  asic: {
    what_is: {
      content:
        "ASIC (Application-Specific Integrated Circuit) คือชิปที่ออกแบบวงจรเฉพาะสำหรับ algorithm หนึ่ง — เร็วและประหยัดพลังงานกว่า CPU/GPU สำหรับงานนั้น แต่ยืดหยุ่นไม่ได้",
    },
    why: {
      content:
        "เมื่อ algorithm นิ่งและ volume สูง — ASIC คุ้มกว่า:\n\n- Bitcoin mining (SHA-256 ASIC)\n- AI inference ใน data center (TPU, NPU)\n- Network packet processing ใน router\n- ต้นทุน R&D สูง — เหมาะ production scale",
    },
    how_it_works: {
      content:
        "1. ออกแบบวงจร digital สำหรับ algorithm เป้าหมาย\n2. Tape-out ส่งโรงงานผลิตชิป\n3. ชิปทำงานเฉพาะ function ที่ออกแบบ — ไม่รันโปรแกรมทั่วไป\n4. Performance/Watt สูงกว่า FPGA/CPU มากสำหรับงานเฉพาะ",
    },
  },
  fpga: {
    what_is: {
      content:
        "FPGA (Field-Programmable Gate Array) คือชิปที่ปรับ logic gate ได้หลังผลิต — โหลด bitstream จาก HDL (Verilog/VHDL) แทนการผลิต ASIC ใหม่",
    },
    why: {
      content:
        "FPGA เหมาะ prototype และ workload ที่เปลี่ยนบ่อย:\n\n- ทดสอบ circuit ก่อน tape-out ASIC\n- Signal processing, networking pipeline\n- ช้ากว่า ASIC แต่ยืดหยุ่นกว่า\n- ใช้ใน data center acceleration (Microsoft Catapult)",
    },
    how_it_works: {
      content:
        "1. เขียน HDL อธิบาย logic\n2. Synthesis แปลงเป็น netlist\n3. Place & route ลง FPGA fabric\n4. โหลด bitstream — ชิปทำงานตาม design\n5. เปลี่ยน design ได้โดย reflash ไม่ต้องผลิตชิปใหม่",
    },
  },
  "peripheral-io": {
    what_is: {
      content:
        "Peripheral I/O คือพอร์ตและบัสที่ motherboard ใช้ต่ออุปกรณ์ภายนอก — USB, HDMI, DisplayPort, audio jack, Ethernet และ header ภายใน (USB front panel, RGB)",
    },
    why: {
      content:
        "I/O กำหนดว่าต่อ monitor, keyboard, storage external และอุปกรณ์อื่นได้อย่างไร:\n\n- USB version (2.0/3.2/4) ส่งผลต่อความเร็ว transfer\n- Thunderbolt รวม USB + DisplayPort + power\n- Front panel header ต่อพอร์ตด้านหน้าเคส",
    },
    how_it_works: {
      content:
        "1. CPU/chipset มี controller สำหรับแต่ละบัส\n2. USB device ลงทะเบียนกับ OS driver\n3. Display output จาก iGPU หรือ dGPU ผ่าน HDMI/DP\n4. Audio codec แปลง digital → analog สำหรับหูฟัง",
    },
  },
  "display-monitor": {
    what_is: {
      content:
        "Monitor แสดงภาพจาก GPU ผ่าน HDMI, DisplayPort หรือ USB-C — มี panel type (IPS, VA, OLED), resolution, refresh rate และ color gamut ต่างกัน",
    },
    why: {
      content:
        "Monitor ส่งผลต่อ productivity และ experience โดยตรง:\n\n- 144Hz+ เหมาะ gaming และ animation\n- 4K + ขนาดใหญ่เหมาะ coding และ design\n- Color accuracy สำคัญสำหรับ photo/video\n- Dual monitor เพิ่มพื้นที่ทำงาน",
    },
    how_it_works: {
      content:
        "1. GPU render frame เป็น pixel buffer\n2. ส่งผ่าน DisplayPort/HDMI cable\n3. Monitor scaler แปลง signal เป็น panel native resolution\n4. Backlight (LED) ส่องผ่าน LCD/OLED pixels\n5. Refresh ตาม Hz rating (60/144/240 ครั้ง/วินาที)",
    },
  },
  "edge-device-hardware": {
    what_is: {
      content:
        "Edge device hardware คือเครื่อง compute ที่ติดตั้งใกล้แหล่งข้อมูล (โรงงาน, ร้านค้า, กล้อง CCTV) แทนส่งทุกอย่างไป cloud — อาจเป็น industrial gateway, NUC หรือ ruggedized box",
    },
    why: {
      content:
        "Latency และ bandwidth จำกัดเมื่อส่ง raw data ขึ้น cloud:\n\n- ประมวลผล video analytics ที่ edge\n- ทำงานต่อได้เมื่อ internet ขาด\n- ลดค่า egress cloud\n- ข้อมูล sensitive ไม่ออกจาก site",
    },
    how_it_works: {
      content:
        "1. รับข้อมูลจาก sensor/camera local\n2. รัน inference หรือ rule engine บน device\n3. ส่งเฉพาะ alert/summary ขึ้น cloud\n4. รับคำสั่งกลับ (update model, config)\n5. อาจ sync เมื่อมี connectivity",
    },
  },
  "hypervisor-host": {
    what_is: {
      content:
        "Hypervisor host คือเครื่อง server ที่รัน hypervisor (ESXi, KVM, Hyper-V) เพื่อสร้างและจัดการ virtual machine หลายตัวบน hardware ชุดเดียว",
    },
    why: {
      content:
        "Virtualization แยก workload โดยไม่ต้องซื้อ server แยกทุก service:\n\n- ใช้ resource (CPU/RAM) ร่วมกันอย่างมีประสิทธิภาพ\n- Snapshot และ migrate VM ระหว่าง host\n- Lab และ dev environment แยกจาก production",
    },
    how_it_works: {
      content:
        "1. Hypervisor จัดการ CPU/RAM allocation ให้แต่ละ VM\n2. Virtual NIC และ virtual disk แยก I/O\n3. Host OS หรือ bare-metal hypervisor ควบคุม hardware\n4. VM รัน guest OS แยกกัน — isolated จากกัน",
    },
  },
  "data-center": {
    what_is: {
      content:
        "Data center คืออาคารหรือพื้นที่ที่รวม server, network และ storage จำนวนมาก — มีระบบไฟฟ้า (UPS, generator), cooling และ physical security",
    },
    why: {
      content:
        "Cloud และ enterprise ต้องการ infrastructure ที่เชื่อถือได้:\n\n- Redundant power และ network\n- PUE (Power Usage Effectiveness) วัดประสิทธิภาพพลังงาน\n- Compliance (SOC2, ISO 27001) สำหรับข้อมูลสำคัญ\n- Scale เป็น rack หรือหลายพัน rack",
    },
    how_it_works: {
      content:
        "1. Rack จัด server เป็นแถว (hot/cold aisle)\n2. PDU จ่ายไฟ, UPS สำรองเมื่อไฟดับ\n3. CRAC/HVAC ระบายความร้อน\n4. Spine-leaf network เชื่อมทุก rack\n5. Remote hands และ monitoring 24/7",
    },
  },
  raid: {
    what_is: {
      content:
        "RAID (Redundant Array of Independent Disks) รวมหลาย disk ทำงานเป็นชุดเดียว — เพิ่มความเร็ว (striping) หรือ redundancy (mirroring/parity) ตาม level (RAID 0/1/5/6/10)",
    },
    why: {
      content:
        "Disk เสียได้ — RAID ลด downtime และ data loss:\n\n- RAID 1 mirror — disk หนึ่งเสียยัง boot ได้\n- RAID 5/6 — parity ชดเชย disk ที่เสีย\n- RAID 10 — performance + redundancy สำหรับ database",
    },
    how_it_works: {
      content:
        "1. RAID controller (hardware หรือ software) จัดการ disk array\n2. Striping แบ่งข้อมูลข้าม disk — อ่านเร็วขึ้น\n3. Mirroring คัดลอกข้อมูลไป disk คู่\n4. เมื่อ disk เสีย — rebuild จาก parity หรือ mirror\n5. ไม่แทน backup offsite — RAID กับ backup ต่างกัน",
    },
  },
  "win-cd": {
    why: {
      content:
        "cd (Change Directory) เป็นคำสั่งพื้นฐานบน Windows CMD — ต้องใช้ก่อนรันสคริปต์ ดูไฟล์ หรือ build โปรเจกต์ในโฟลเดอร์ที่ถูกต้อง\n\nPowerShell ใช้ `Set-Location` (alias `cd`) ซึ่งทำงานคล้ายกันแต่รองรับ path object และ pipeline",
    },
  },
  "win-dir": {
    why: {
      content:
        "dir ช่วยสำรวจโครงสร้างไฟล์บน Windows ก่อน copy, edit หรือรันโปรแกรม — เทียบเท่า `ls` บน Unix\n\nรู้ว่ามีไฟล์อะไรในโฟลเดอร์ ช่วยลดการพิมพ์ path ผิดและ debug ปัญหา \"file not found\"",
    },
  },
  "win-mkdir": {
    why: {
      content:
        "mkdir สร้างโครงสร้างโฟลเดอร์สำหรับโปรเจกต์ใหม่ — จัดระเบียบไฟล์ตั้งแต่เริ่มต้น\n\nPowerShell รองรับ `New-Item -ItemType Directory` และสร้าง path ซ้อนกันด้วย `-Force`",
    },
  },
  "win-type": {
    why: {
      content:
        "type แสดงเนื้อหาไฟล์ข้อความใน CMD — ใช้ดู config, log หรือ script อย่างรวดเร็วโดยไม่เปิด editor\n\nเทียบเท่า `cat` บน Unix; PowerShell ใช้ `Get-Content`",
    },
  },
  "win-copy": {
    why: {
      content:
        "copy คัดลอกไฟล์หรือโฟลเดอร์ — สำรองข้อมูล สร้าง template หรือ deploy artifact\n\nPowerShell ใช้ `Copy-Item` ที่รองรับ recursive และ pipeline",
    },
  },
  "win-del": {
    why: {
      content:
        "del ลบไฟล์ที่ไม่ต้องการ — ล้าง temp, build artifact หรือไฟล์ที่สร้างผิด\n\nระวัง: ไม่มี recycle bin ใน CMD แบบ GUI — ลบแล้วกู้ยาก",
    },
  },
  "win-findstr": {
    why: {
      content:
        "findstr ค้นหาข้อความในไฟล์บน Windows — เทียบเท่า grep บน Unix\n\nใช้กรอง log, หา error code หรือ config value ในไฟล์ขนาดใหญ่",
    },
  },
  "win-where": {
    why: {
      content:
        "where หา path ของ executable ใน PATH — ตรวจว่าติดตั้ง Node, Python หรือ Git แล้วหรือยัง\n\nเทียบเท่า `which` บน Unix",
    },
  },
  "win-ipconfig": {
    why: {
      content:
        "ipconfig ดูการตั้งค่าเครือข่องของ Windows — IP, subnet mask, default gateway และ DNS\n\nใช้ debug ปัญหา \"ไม่มี internet\" หรือ IP conflict เป็นขั้นตอนแรก",
    },
  },
  "win-nslookup": {
    why: {
      content:
        "nslookup ทดสอบ DNS resolution บน Windows — ตรวจว่า domain แปลงเป็น IP ได้หรือไม่\n\nใช้ debug ปัญหาเว็บเปิดไม่ได้หลังตรวจ ping และ ipconfig",
    },
  },
  "win-tracert": {
    why: {
      content:
        "tracert ติดตามเส้นทาง packet ไปปลายทาง — หา hop ที่ latency สูงหรือ packet หาย\n\nเทียบเท่า traceroute บน Unix — ใช้ debug routing และ ISP issue",
    },
  },
  "win-netstat": {
    why: {
      content:
        "netstat แสดง port ที่ listen และ connection ที่ active — หา process ที่ใช้ port ซ้ำหรือตรวจ suspicious connection\n\nDev ใช้บ่อยเมื่อ port 3000 ถูกจองอยู่แล้ว",
    },
  },
  "win-npm": {
    why: {
      content:
        "npm บน Windows ทำงานเหมือนบน Unix — จัดการ dependencies ของ Node.js project\n\nต้องติดตั้ง Node.js ก่อน แล้วใช้ npm install / npm run ในโฟลเดอร์โปรเจกต์",
    },
  },
  "ps-resolve-dnsname": {
    why: {
      content:
        "Resolve-DnsName เป็น cmdlet PowerShell สำหรับ DNS lookup — ได้ผลลัพธ์แบบ object แทน text ธรรมดา\n\nใช้ใน script automation และ pipeline ได้สะดวกกว่า nslookup",
    },
  },
  "ps-test-netconnection": {
    why: {
      content:
        "Test-NetConnection ทดสอบ connectivity บน PowerShell — ping, TCP port test และ traceroute ในคำสั่งเดียว\n\nทดแทน ping/telnet แบบเก่าและได้ output ที่ parse ง่าย",
    },
  },
};

// Polish stats
let conceptsPolished = 0;
const conceptsDir = path.join(dataDir, "concepts");

for (const file of fs.readdirSync(conceptsDir).filter((f) => f.endsWith(".json"))) {
  const filePath = path.join(conceptsDir, file);
  let raw = fs.readFileSync(filePath, "utf8");
  const fixed = fixTypos(raw);
  if (fixed !== raw) {
    fs.writeFileSync(filePath, fixed);
    conceptsPolished++;
  }

  const concept = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const supplement = POLISH[concept.slug];
  if (supplement) {
    const before = JSON.stringify(concept.sections);
    concept.sections = mergeSections(concept.sections ?? [], supplement);
    if (JSON.stringify(concept.sections) !== before) {
      fs.writeFileSync(filePath, `${JSON.stringify(concept, null, 2)}\n`);
      conceptsPolished++;
    }
  }
}

// Polish visualizations
let vizPolished = 0;
const vizDir = path.join(dataDir, "visualizations");
for (const file of fs.readdirSync(vizDir).filter((f) => f.endsWith(".json"))) {
  const filePath = path.join(vizDir, file);
  let raw = fs.readFileSync(filePath, "utf8");
  const fixed = fixTypos(raw);
  if (fixed !== raw) {
    fs.writeFileSync(filePath, fixed);
    vizPolished++;
  }
}

// Polish scenarios
let scenariosPolished = 0;
const scenariosDir = path.join(dataDir, "scenarios");
for (const file of fs.readdirSync(scenariosDir).filter((f) => f.endsWith(".json"))) {
  const filePath = path.join(scenariosDir, file);
  let raw = fs.readFileSync(filePath, "utf8");
  const fixed = fixTypos(raw);
  if (fixed !== raw) {
    fs.writeFileSync(filePath, fixed);
    scenariosPolished++;
  }
}

console.log(`Polished ${conceptsPolished} concept files`);
console.log(`Polished ${vizPolished} visualization files`);
console.log(`Polished ${scenariosPolished} scenario files`);
