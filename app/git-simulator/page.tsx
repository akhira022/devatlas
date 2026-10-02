import type { Metadata } from "next";

import { GitSimulator } from "@/components/git-sim/git-simulator";

export const metadata: Metadata = {
  title: "Git Simulator — 10 คำสั่งที่ใช้บ่อย",
  description:
    "กดทีละคำสั่ง แล้วดูว่า working directory, staging area, local repo และ remote เปลี่ยนอย่างไร",
};

export default function GitSimulatorPage() {
  return (
    <div className="container px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Top 10 <span className="text-sky-500">Git</span> Commands
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          เลือกคำสั่งทางซ้าย หรือกด Play เพื่อดูทีละขั้น ว่าไฟล์เดินทางจาก working directory ไป
          staging, local repo และ remote อย่างไร
        </p>
      </div>
      <GitSimulator />
    </div>
  );
}
