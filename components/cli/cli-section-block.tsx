import { RichContent } from "@/components/cli/rich-content";
import type { ConceptSection } from "@/types/concept";

const sectionMeta: Record<
  ConceptSection["type"],
  { label: string; emoji: string }
> = {
  overview: { label: "ภาพรวม", emoji: "📋" },
  what_is: { label: "คืออะไร", emoji: "🟢" },
  why: { label: "ทำไมต้องใช้", emoji: "🟡" },
  how_it_works: { label: "วิธีใช้ / Syntax", emoji: "⌨️" },
  key_components: { label: "Flags & Options", emoji: "🧩" },
  real_world_example: { label: "ตัวอย่างจริง", emoji: "🌍" },
  common_confusion: { label: "ข้อควรระวัง", emoji: "⚠️" },
  analogy: { label: "เปรียบเทียบกับชีวิตจริง", emoji: "💡" },
};

interface CliSectionBlockProps {
  section: ConceptSection;
}

export function CliSectionBlock({ section }: CliSectionBlockProps) {
  const meta = sectionMeta[section.type];
  const isSyntax = section.type === "how_it_works" || section.type === "real_world_example";

  return (
    <section
      className={`rounded-xl border p-6 ${
        isSyntax ? "callout-accent" : "surface-muted"
      }`}
    >
      <h2 className="mb-4 text-lg font-semibold tracking-tight">
        {meta.emoji} {section.title ?? meta.label}
      </h2>

      {section.content && (
        <RichContent content={section.content} className="prose-content text-[0.9375rem] leading-relaxed" />
      )}

      {section.items && section.items.length > 0 && (
        <ul className="mt-4 space-y-2">
          {section.items.map((item) => (
            <li
              key={item}
              className="flex gap-2.5 rounded-md bg-background/60 px-3 py-2 text-sm leading-relaxed"
            >
              <span className="shrink-0 font-mono text-primary">›</span>
              <RichContent content={item} className="min-w-0 flex-1" />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
