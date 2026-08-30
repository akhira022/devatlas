# 01 — Vision & Problem Statement

## One-Liner

**DEV ATLAS** คือแพลตฟอร์มเรียนรู้เทคโนโลยีแบบ Interactive ที่เชื่อมศัพท์ กระบวนการ และภาพรวมระบบเข้าด้วยกัน

---

## Problem Statement

### สิ่งที่เกิดขึ้นจริง

เมื่อคนเริ่มเรียน Development พวกเขามักเจอ **Knowledge Fragmentation**:

```
เรียน React → เจอ API → API ส่ง JSON → ต้อง Auth → ใช้ JWT → HTTP → HTTPS → TCP/IP
```

แต่ละ Tutorial สอนแยกกัน ผู้เรียนได้ **ศัพท์** แต่ไม่ได้ **แผนที่**

### Pain Points

| ปัญหา | ผลกระทบ |
|-------|---------|
| รู้ศัพท์แยกกัน | จำได้แต่เชื่อมไม่ได้ |
| เรียนตาม Tutorial | เข้าใจขั้นตอน แต่ไม่เข้าใจ "ทำไม" |
| ไม่เห็นภาพการทำงาน | ไม่รู้ว่า Request ไปไหน กลับมายังไง |
| ไม่รู้ความสัมพันธ์ | ไม่รู้ว่า API เกี่ยวกับ HTTP ยังไง |

### คำถามที่ผู้เรียนถามบ่อย

- "API คืออะไร ต่างจาก Backend ยังไง?"
- "JWT ไปอยู่ตรงไหนในระบบ Login?"
- "พอเปิดเว็บ ข้างหลังเกิดอะไรขึ้นบ้าง?"
- "MQTT กับ HTTP ใช้ต่างกันตอนไหน?"

---

## Solution

DEV ATLAS แก้ด้วย **3 โหมดการเรียนรู้** ที่เชื่อมกัน:

```
        LEARN          SEE           TRY
          │              │             │
    Dictionary      Visualize     Simulation
    Roadmap         Flow          Playground
    Concepts        Architecture  Interact
          │              │             │
          └──────────────┼─────────────┘
                         │
                    UNDERSTAND
```

### Value Proposition

> **จาก "รู้คำ" → "เข้าใจระบบ" → "ลองได้จริง"**

---

## Target Users

### Primary — Beginner Developer

| ลักษณะ | ความต้องการ |
|--------|------------|
| นักเรียน / นักศึกษา / มือใหม่ | เข้าใจศัพท์พื้นฐาน |
| เรียนจาก Tutorial / YouTube | ต้องการบริบทและภาพรวม |
| ยังไม่เคยทำ Project จริง | ต้องการเห็น Flow ก่อนลงมือ |

**Job to be done:** "ผมไม่รู้ว่า API คืออะไร — อยากเข้าใจแบบเห็นภาพ"

### Secondary — Intermediate Developer

| ลักษณะ | ความต้องการ |
|--------|------------|
| เขียนโค้ดได้แล้ว | เข้าใจระบบลึกขึ้น |
| ทำงานกับ Stack ใหม่ | ต้องการ Mental Model เร็ว |
| Debug ปัญหา | ต้องการเข้าใจ Flow ทั้งระบบ |

**Job to be done:** "ผมใช้ JWT ได้ แต่อยากรู้ว่ามันเดินทางยังไงในระบบ"

---

## Success Metrics (MVP)

| Metric | Target |
|--------|--------|
| Concept Pages | 15–20 หน้า |
| Visualizations | 3 flows (HTTP, DNS, MQTT) |
| Scenarios | 3 end-to-end stories |
| Time on Concept Page | > 2 นาที (engagement) |
| Related Concept Click-through | > 30% |

---

## Differentiation

| แพลตฟอร์มอื่น | DEV ATLAS |
|--------------|-----------|
| MDN / Docs — อ้างอิง | อธิบาย + เชื่อมโยง |
| YouTube — Linear | Interactive + กลับมาดูได้ |
| Tutorial — ทำตาม | เข้าใจ "ทำไม" + ภาพรวม |
| Wikipedia — Text-heavy | Visual-first + ลองเล่นได้ |

**จุดเด่นหลัก:** Knowledge Graph ที่เชื่อม Concept ทุกตัว + Visualization Engine เดียวใช้ได้หลาย Flow
