import Link from "next/link";
import {
  Brain,
  Cloud,
  Code,
  Cpu,
  Database,
  GitBranch,
  Globe,
  Radio,
  Settings,
  Shield,
  Terminal,
} from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllCategories, getConceptsByCategory } from "@/lib/content/get-concepts";

const iconMap = {
  globe: Globe,
  code: Code,
  database: Database,
  shield: Shield,
  brain: Brain,
  cloud: Cloud,
  settings: Settings,
  radio: Radio,
  terminal: Terminal,
  "git-branch": GitBranch,
  cpu: Cpu,
} as const;

export function CategoryGrid() {
  const categories = getAllCategories();

  return (
    <section className="container px-4 py-12">
      <h2 className="mb-6 text-xl font-semibold">สำรวจตามหมวด</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => {
          const Icon = iconMap[category.icon as keyof typeof iconMap] ?? Globe;
          const count = getConceptsByCategory(category.slug).length;

          return (
            <Link key={category.slug} href={`/categories/${category.slug}`}>
              <Card className="h-full interactive-card">
                <CardHeader>
                  <div
                    className="mb-2 flex size-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <Icon className="size-5" style={{ color: category.color }} aria-hidden="true" />
                  </div>
                  <CardTitle as="h3" className="flex items-center justify-between text-base">
                    {category.name}
                    <span className="text-xs font-normal text-muted-foreground">{count}</span>
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
