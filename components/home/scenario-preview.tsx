import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Cloud,
  Code,
  Cpu,
  Database,
  GitBranch,
  Globe,
  Lock,
  Package,
  Radio,
  Terminal,
} from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllScenarios } from "@/lib/content/get-scenarios";

const iconMap = {
  globe: Globe,
  lock: Lock,
  radio: Radio,
  cloud: Cloud,
  "git-branch": GitBranch,
  cpu: Cpu,
  package: Package,
  terminal: Terminal,
  code: Code,
  database: Database,
  brain: Brain,
} as const;

export function ScenarioPreview() {
  const scenarios = getAllScenarios();

  return (
    <section className="container px-4 py-12">
      <h2 className="mb-6 text-xl font-semibold">เกิดอะไรขึ้นเมื่อ…?</h2>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {scenarios.map((scenario) => {
          const Icon = iconMap[scenario.icon as keyof typeof iconMap] ?? Globe;

          return (
            <Link key={scenario.slug} href={`/scenarios/${scenario.slug}`}>
              <Card className="group h-full interactive-card">
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <CardTitle as="h3" className="flex items-start justify-between gap-2 text-base">
                    {scenario.title}
                    <ArrowRight className="size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardTitle>
                  <CardDescription>{scenario.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
