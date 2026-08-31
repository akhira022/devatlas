"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { ConceptListPanel } from "@/components/graph/concept-list-panel";
import { ConceptNode, type ConceptNodeData } from "@/components/graph/concept-node";
import { GraphPanel } from "@/components/graph/graph-panel";
import { useTheme } from "@/components/theme/theme-provider";
import { buildGraphData, getConnectedNodeIds } from "@/lib/graph/build-graph";
import { getAllCategories } from "@/lib/content/get-concepts";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { GraphData } from "@/types/graph";

const nodeTypes = { concept: ConceptNode };

interface KnowledgeGraphProps {
  initialFocus?: string;
  initialCategory?: string;
  graphData?: GraphData;
}

export function KnowledgeGraph({
  initialFocus,
  initialCategory,
  graphData,
}: KnowledgeGraphProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const categories = getAllCategories();
  const prefersReducedMotion = useReducedMotion();
  const [categoryFilter, setCategoryFilter] = useState<string | null>(
    initialCategory ?? null,
  );
  const [focusSlug, setFocusSlug] = useState<string | null>(initialFocus ?? null);
  const [showList, setShowList] = useState(true);

  const data = useMemo(() => {
    if (graphData && !categoryFilter) return graphData;
    return buildGraphData({ categorySlug: categoryFilter ?? undefined });
  }, [graphData, categoryFilter]);

  const connectedIds = useMemo(
    () => (focusSlug ? getConnectedNodeIds(data, focusSlug) : null),
    [data, focusSlug],
  );

  const nodes: Node[] = useMemo(
    () =>
      data.nodes.map((node) => ({
        id: node.id,
        type: "concept",
        position: node.position,
        data: {
          label: node.label,
          category: node.category,
          selected: node.id === focusSlug,
          dimmed: connectedIds ? !connectedIds.has(node.id) : false,
        } satisfies ConceptNodeData,
      })),
    [data.nodes, focusSlug, connectedIds],
  );

  const edges: Edge[] = useMemo(
    () =>
      data.edges.map((edge) => {
        const isHighlighted =
          focusSlug && (edge.source === focusSlug || edge.target === focusSlug);

        return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          label: edge.label,
          animated: Boolean(isHighlighted) && !prefersReducedMotion,
          style: {
            stroke: isHighlighted ? "var(--primary)" : "var(--border)",
            strokeWidth: isHighlighted ? 2 : 1,
          },
          labelStyle: { fontSize: 12, fill: "var(--muted-foreground)" },
        };
      }),
    [data.edges, focusSlug, prefersReducedMotion],
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setFocusSlug(node.id);
  }, [setFocusSlug]);

  const onNodeDoubleClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      router.push(`/concepts/${node.id}`);
    },
    [router],
  );

  const handleCategoryChange = useCallback(
    (slug: string | null) => {
      setCategoryFilter(slug);
      setFocusSlug(null);
      const params = new URLSearchParams();
      if (slug) params.set("category", slug);
      const query = params.toString();
      router.replace(query ? `/graph?${query}` : "/graph", { scroll: false });
    },
    [router, setCategoryFilter, setFocusSlug],
  );

  const connectedLabels = useMemo(() => {
    if (!focusSlug || !connectedIds) return [];

    return data.nodes
      .filter((node) => connectedIds.has(node.id) && node.id !== focusSlug)
      .map((node) => node.label);
  }, [data.nodes, focusSlug, connectedIds]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="กรองตามหมวดหมู่"
        >
          <button
            type="button"
            onClick={() => handleCategoryChange(null)}
            aria-pressed={categoryFilter === null}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm transition-colors",
              categoryFilter === null
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            ทั้งหมด
          </button>
          {categories.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => handleCategoryChange(category.slug)}
              aria-pressed={categoryFilter === category.slug}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors",
                categoryFilter === category.slug
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {category.name}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowList((value) => !value)}
          aria-pressed={showList}
          aria-controls="concept-list-panel"
          className="ml-auto rounded-md border border-border/60 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          {showList ? "ซ่อนรายการ" : "มุมมองรายการ"}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="surface-subtle relative h-[500px] overflow-hidden">
          <p className="sr-only">
            กราฟความรู้แบบโต้ตอบ — ใช้รายการ Concept ด้านล่างเพื่อเลือกด้วยคีย์บอร์ด
          </p>
          <ReactFlow
            key={categoryFilter ?? "all"}
            colorMode={theme}
            className="h-full w-full"
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            onNodeDoubleClick={onNodeDoubleClick}
            fitView
            minZoom={0.2}
            maxZoom={1.5}
            proOptions={{ hideAttribution: true }}
          >
            <Background gap={20} size={1} color="var(--border)" />
            <Controls />
            <MiniMap nodeStrokeWidth={3} pannable zoomable />
          </ReactFlow>
        </div>

        <GraphPanel focusSlug={focusSlug} connectedSlugs={connectedLabels} />
      </div>

      {showList && (
        <ConceptListPanel
          id="concept-list-panel"
          nodes={data.nodes}
          focusSlug={focusSlug}
          onSelect={setFocusSlug}
        />
      )}
    </div>
  );
}
