import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getAllConcepts } from "@/lib/content/get-concepts";

export default function NotFound() {
  const concepts = getAllConcepts().slice(0, 4);

  return (
    <div className="container flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Page not found</h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist in DEV ATLAS yet.
      </p>
      <Button className="mt-6" render={<Link href="/" />}>
        Back to Explore
      </Button>

      {concepts.length > 0 && (
        <div className="mt-8">
          <p className="mb-3 text-sm text-muted-foreground">Popular concepts:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {concepts.map((concept) => (
              <Button
                key={concept.slug}
                variant="outline"
                size="sm"
                render={<Link href={`/concepts/${concept.slug}`} />}
              >
                {concept.title}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
