"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, GitBranch, Cloud, Code, Database, Globe, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { DecisionNode, DecisionResult, DecisionTree } from "@/types/decision-tree";

const iconMap = {
  database: Database,
  code: Code,
  globe: Globe,
  "git-branch": GitBranch,
  cloud: Cloud,
  settings: Settings,
} as const;

interface DecisionTreePlayerProps {
  tree: DecisionTree;
}

function parseNext(next: string): { type: "node" | "result"; id: string } {
  if (next.startsWith("result:")) {
    return { type: "result", id: next.slice("result:".length) };
  }
  return { type: "node", id: next };
}

export function DecisionTreePlayer({ tree }: DecisionTreePlayerProps) {
  const [currentNodeId, setCurrentNodeId] = useState(tree.startNodeId);
  const [resultId, setResultId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const nodeMap = useMemo(
    () => new Map(tree.nodes.map((n) => [n.id, n])),
    [tree.nodes],
  );
  const resultMap = useMemo(
    () => new Map(tree.results.map((r) => [r.id, r])),
    [tree.results],
  );

  const currentNode: DecisionNode | undefined = nodeMap.get(currentNodeId);
  const result: DecisionResult | undefined = resultId ? resultMap.get(resultId) : undefined;

  const handleOption = (next: string) => {
    const parsed = parseNext(next);
    if (parsed.type === "result") {
      setResultId(parsed.id);
      return;
    }
    setHistory((h) => [...h, currentNodeId]);
    setCurrentNodeId(parsed.id);
  };

  const handleBack = () => {
    if (resultId) {
      setResultId(null);
      return;
    }
    const prev = history.at(-1);
    if (!prev) return;
    setHistory((h) => h.slice(0, -1));
    setCurrentNodeId(prev);
  };

  const handleReset = () => {
    setCurrentNodeId(tree.startNodeId);
    setResultId(null);
    setHistory([]);
  };

  if (result) {
    return (
      <div className="space-y-6">
        <div className="callout-accent rounded-xl border p-6">
          <p className="text-sm font-medium text-primary">ผลลัพธ์</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">{result.title}</h2>
          <p className="prose-content mt-3 text-muted-foreground">{result.summary}</p>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">อ่านเพิ่มเติม</p>
          <div className="flex flex-wrap gap-2">
            {result.conceptSlugs.map((slug) => (
              <Button key={slug} variant="outline" size="sm" render={<Link href={`/concepts/${slug}`} />}>
                {slug}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {result.compareSlug && (
            <Button variant="secondary" render={<Link href={`/compare/${result.compareSlug}`} />}>
              เปรียบเทียบ
            </Button>
          )}
          {result.learnPathSlug && (
            <Button variant="secondary" render={<Link href={`/learn/${result.learnPathSlug}`} />}>
              เส้นทางเรียน
            </Button>
          )}
          <Button variant="ghost" onClick={handleReset}>
            เริ่มใหม่
          </Button>
        </div>
      </div>
    );
  }

  if (!currentNode) {
    return <p className="text-destructive">Decision tree configuration error.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="surface-muted p-6">
        <p className="text-sm text-muted-foreground">
          ขั้นที่ {history.length + 1}
        </p>
        <h2 className="mt-2 text-xl font-semibold">{currentNode.question}</h2>
        {currentNode.help && (
          <p className="prose-content mt-2 text-sm text-muted-foreground">{currentNode.help}</p>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {currentNode.options.map((option) => (
          <Button
            key={option.label}
            variant="outline"
            className="h-auto flex-col items-start gap-1 whitespace-normal px-4 py-4 text-left"
            onClick={() => handleOption(option.next)}
          >
            <span className="font-medium">{option.label}</span>
            {option.description && (
              <span className="text-xs font-normal text-muted-foreground">{option.description}</span>
            )}
          </Button>
        ))}
      </div>

      <div className="flex gap-2">
        {(history.length > 0 || resultId) && (
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="size-4" />
            ย้อนกลับ
          </Button>
        )}
        <Button variant="ghost" onClick={handleReset}>
          เริ่มใหม่
        </Button>
      </div>
    </div>
  );
}

interface DecisionTreeCardProps {
  tree: DecisionTree;
}

export function DecisionTreeCard({ tree }: DecisionTreeCardProps) {
  const Icon = iconMap[tree.icon as keyof typeof iconMap] ?? Settings;

  return (
    <Link href={`/decide/${tree.slug}`}>
      <div className="surface-muted group interactive-card h-full p-5">
        <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="size-5 text-primary" />
        </div>
        <h3 className="flex items-center justify-between font-semibold">
          {tree.title}
          <ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{tree.description}</p>
      </div>
    </Link>
  );
}
