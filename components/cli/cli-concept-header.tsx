import Link from "next/link";
import { ArrowLeftRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import type { Concept } from "@/types/concept";
import {
  CLI_PLATFORM_LABELS,
  getCategoryBySlug,
  getConceptBySlug,
  getSubcategoryForConcept,
} from "@/lib/content/get-concepts";
import {
  DIFFICULTY_COLORS,
  getDifficultyLabel,
} from "@/lib/difficulty-labels";

const CROSS_PLATFORM: Record<string, string> = {
  cd: "win-cd",
  "win-cd": "cd",
  ls: "win-dir",
  "win-dir": "ls",
  mkdir: "win-mkdir",
  "win-mkdir": "mkdir",
  cat: "win-type",
  "win-type": "cat",
  grep: "win-findstr",
  "win-findstr": "grep",
  ifconfig: "win-ipconfig",
  "win-ipconfig": "ifconfig",
  ping: "win-ping",
  "win-ping": "ping",
  nslookup: "win-nslookup",
  "win-nslookup": "nslookup",
  traceroute: "win-tracert",
  "win-tracert": "traceroute",
  netstat: "win-netstat",
  "win-netstat": "netstat",
  curl: "ps-invoke-webrequest",
  "ps-invoke-webrequest": "curl",
  dig: "ps-resolve-dnsname",
  "ps-resolve-dnsname": "dig",
  npm: "win-npm",
  "win-npm": "npm",
  nc: "ps-test-netconnection",
  "ps-test-netconnection": "nc",
};

interface CliConceptHeaderProps {
  concept: Concept;
}

export function CliConceptHeader({ concept }: CliConceptHeaderProps) {
  const category = getCategoryBySlug(concept.category);
  const subcategory = getSubcategoryForConcept(concept);

  const platformLabel = concept.platform ? CLI_PLATFORM_LABELS[concept.platform] : undefined;
  const counterpartSlug = CROSS_PLATFORM[concept.slug];
  const counterpart = counterpartSlug ? getConceptBySlug(counterpartSlug) : undefined;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "CLI", href: "/categories/cli" },
    ...(subcategory
      ? [
          {
            label: subcategory.name,
            href: `/categories/cli#${concept.platform}-${concept.subcategory}`,
          },
        ]
      : []),
    { label: concept.title, mono: true },
  ];

  return (
    <div className="space-y-5">
      <Breadcrumb items={breadcrumbItems} />

      <div className="terminal-panel">
        <p className="mb-1 text-xs font-medium uppercase tracking-wider opacity-60">
          {platformLabel}
        </p>
        <h1 className="font-mono text-2xl font-bold tracking-tight md:text-3xl">
          <span className="opacity-50">$ </span>
          {concept.title}
        </h1>
        {concept.fullName && (
          <p className="mt-2 text-sm opacity-60">{concept.fullName}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge className={DIFFICULTY_COLORS[concept.difficulty]}>
          {getDifficultyLabel(concept.difficulty)}
        </Badge>
        {category && (
          <Badge variant="outline" style={{ borderColor: `${category.color}40`, color: category.color }}>
            {category.name}
          </Badge>
        )}
        {subcategory && <Badge variant="secondary">{subcategory.name}</Badge>}
        {platformLabel && <Badge variant="outline">{platformLabel}</Badge>}
      </div>

      <p className="prose-content max-w-2xl text-base">{concept.summary}</p>

      {counterpart && (
        <Link
          href={`/concepts/${counterpart.slug}`}
          className="inline-flex items-center gap-2 rounded-lg border border-border/70 bg-background px-4 py-2.5 text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-accent/60"
        >
          <ArrowLeftRight className="size-4 text-primary" aria-hidden="true" />
          <span>
            ดูเวอร์ชัน{" "}
            <strong>{CLI_PLATFORM_LABELS[counterpart.platform ?? "unix"]}</strong>:{" "}
            <code className="font-mono text-primary">{counterpart.title}</code>
          </span>
        </Link>
      )}
    </div>
  );
}
