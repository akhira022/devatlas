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

import { getAllCategories } from "@/lib/content/get-concepts";
import { cn } from "@/lib/utils";

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

interface SidebarProps {
  className?: string;
  mobile?: boolean;
}

export function Sidebar({ className, mobile }: SidebarProps) {
  const categories = getAllCategories();

  return (
    <aside
      className={cn(
        "flex w-60 shrink-0 flex-col border-r border-border/60 bg-muted/40 dark:bg-card/50",
        className,
      )}
    >
      <div className="p-4">
        {!mobile && (
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Categories
          </p>
        )}
        <nav aria-label="หมวดหมู่" className="space-y-1">
          {categories.map((category) => {
            const Icon = iconMap[category.icon as keyof typeof iconMap] ?? Globe;

            return (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Icon
                  className="size-4"
                  style={{ color: category.color }}
                  aria-hidden="true"
                />
                {category.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto border-t border-border/60 p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          ลิงก์ด่วน
        </p>
        <nav aria-label="ลิงก์ด่วน" className="space-y-1 text-sm">
          <Link
            href="/concepts"
            className="block rounded-md px-2.5 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            Concept ทั้งหมด
          </Link>
          <Link
            href="/learn"
            className="block rounded-md px-2.5 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            เส้นทางเรียน
          </Link>
          <Link
            href="/decide"
            className="block rounded-md px-2.5 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            ช่วยเลือกเทคโนโลยี
          </Link>
          <Link
            href="/quiz"
            className="block rounded-md px-2.5 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            แบบทดสอบ
          </Link>
          <Link
            href="/graph"
            className="block rounded-md px-2.5 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            Knowledge Graph
          </Link>
        </nav>
      </div>
    </aside>
  );
}
