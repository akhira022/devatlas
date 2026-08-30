import { ProtocolPulseCard } from "@/components/network/protocol-pulse-card";
import { PROTOCOL_PULSES } from "@/lib/network/protocol-pulses";

export function ProtocolPulseGrid() {
  return (
    <section className="mb-10">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Protocol Animations</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          {PROTOCOL_PULSES.length} หัวข้อ — ดู packet วิ่งระหว่างจุดเชื่อมต่อ กดการ์ดเพื่อเปิด
          flow แบบละเอียด
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {PROTOCOL_PULSES.map((pulse) => (
          <ProtocolPulseCard key={pulse.id} pulse={pulse} />
        ))}
      </div>
    </section>
  );
}
