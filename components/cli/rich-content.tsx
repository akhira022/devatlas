import { Fragment } from "react";

interface RichContentProps {
  content: string;
  className?: string;
}

function renderInline(text: string) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-primary"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return <Fragment key={index}>{part}</Fragment>;
  });
}

export function RichContent({ content, className }: RichContentProps) {
  const blocks = content.split(/```/);

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        if (index % 2 === 1) {
          return (
            <pre key={index} className="code-block my-3">
              <code>{block.trim()}</code>
            </pre>
          );
        }

        const paragraphs = block.split(/\n\n+/).filter(Boolean);

        return (
          <div key={index} className="space-y-3">
            {paragraphs.map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex} className="whitespace-pre-line">
                {renderInline(paragraph)}
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
}
