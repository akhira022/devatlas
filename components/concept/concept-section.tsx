import { RichContent } from "@/components/cli/rich-content";
import type { ConceptSection } from "@/types/concept";

const sectionMeta: Record<
  ConceptSection["type"],
  { label: string; emoji: string }
> = {
  overview: { label: "Overview", emoji: "📋" },
  what_is: { label: "What is it?", emoji: "🟢" },
  why: { label: "Why do we need it?", emoji: "🟡" },
  how_it_works: { label: "How does it work?", emoji: "🔵" },
  key_components: { label: "Key Components", emoji: "🧩" },
  real_world_example: { label: "Real-world Example", emoji: "🌍" },
  common_confusion: { label: "Common Confusion", emoji: "⚠️" },
  analogy: { label: "เปรียบเทียบกับชีวิตจริง", emoji: "💡" },
};

interface ConceptSectionBlockProps {
  section: ConceptSection;
}

export function ConceptSectionBlock({ section }: ConceptSectionBlockProps) {
  const meta = sectionMeta[section.type];

  return (
    <section className="surface-muted p-6">
      <h2 className="mb-4 text-lg font-semibold tracking-tight">
        {meta.emoji} {section.title ?? meta.label}
      </h2>

      {section.content && (
        <RichContent
          content={section.content}
          className="prose-content text-[0.9375rem] leading-relaxed"
        />
      )}

      {section.items && section.items.length > 0 && (
        <ul className="mt-3 space-y-2.5">
          {section.items.map((item) => (
            <li key={item} className="prose-content flex gap-2.5">
              <span className="text-primary">•</span>
              <RichContent content={item} className="min-w-0 flex-1" />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
