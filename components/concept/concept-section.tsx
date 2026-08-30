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
        <div className="prose-content space-y-3 whitespace-pre-line">
          {section.content}
        </div>
      )}

      {section.items && section.items.length > 0 && (
        <ul className="mt-3 space-y-2.5">
          {section.items.map((item) => (
            <li key={item} className="prose-content flex gap-2.5">
              <span className="text-primary">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
