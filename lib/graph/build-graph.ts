import type { GraphData } from "@/types/graph";
import {
  getAllCategories,
  getAllConcepts,
  getAllRelations,
} from "@/lib/content/get-concepts";

const COLUMN_GAP = 220;
const ROW_GAP = 100;
const GRID_COLS = 4;

interface BuildGraphOptions {
  categorySlug?: string;
}

export function buildGraphData(options: BuildGraphOptions = {}): GraphData {
  const { categorySlug } = options;
  const allConcepts = getAllConcepts();
  const relations = getAllRelations();
  const categories = getAllCategories();

  const concepts = categorySlug
    ? allConcepts.filter((concept) => concept.category === categorySlug)
    : allConcepts;

  const conceptIds = new Set(concepts.map((concept) => concept.slug));
  const categoryOrder = categories.map((category) => category.slug);
  const grouped = new Map<string, typeof concepts>();

  for (const concept of concepts) {
    const list = grouped.get(concept.category) ?? [];
    list.push(concept);
    grouped.set(concept.category, list);
  }

  const nodes = concepts.map((concept) => {
    const list = grouped.get(concept.category) ?? [];
    const indexInCategory = list.indexOf(concept);

    if (categorySlug) {
      const col = indexInCategory % GRID_COLS;
      const row = Math.floor(indexInCategory / GRID_COLS);

      return {
        id: concept.slug,
        label: concept.title,
        category: concept.category,
        position: {
          x: col * COLUMN_GAP,
          y: row * ROW_GAP,
        },
      };
    }

    const column = Math.max(categoryOrder.indexOf(concept.category), 0);
    const row = indexInCategory;

    return {
      id: concept.slug,
      label: concept.title,
      category: concept.category,
      position: {
        x: column * COLUMN_GAP,
        y: row * ROW_GAP,
      },
    };
  });

  const edges = relations
    .filter((relation) => conceptIds.has(relation.source) && conceptIds.has(relation.target))
    .map((relation, index) => ({
      id: `edge-${index}`,
      source: relation.source,
      target: relation.target,
      label: relation.label,
      type: relation.type,
    }));

  return { nodes, edges };
}

export function getConnectedNodeIds(
  graph: GraphData,
  focusId: string,
): Set<string> {
  const connected = new Set<string>([focusId]);

  for (const edge of graph.edges) {
    if (edge.source === focusId) connected.add(edge.target);
    if (edge.target === focusId) connected.add(edge.source);
  }

  return connected;
}
