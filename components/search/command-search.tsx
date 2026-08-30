"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { getSearchSuggestions, searchContent } from "@/lib/content/search";

export function CommandSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchContent(query), [query]);
  const suggestions = useMemo(() => getSearchSuggestions(), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const trimmedQuery = query.trim();
  const conceptResults = results.filter((result) => result.type === "concept");
  const categoryResults = results.filter((result) => result.type === "category");
  const pageResults = results.filter((result) => result.type === "page");
  const hasResults = results.length > 0;
  const showSuggestions = !trimmedQuery || !hasResults;

  const navigateToResult = (href: string) => {
    router.push(href);
    setOpen(false);
    setQuery("");
  };

  return (
    <>
      <Button
        variant="outline"
        className="hidden h-9 w-56 justify-start gap-2 text-muted-foreground md:inline-flex"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" aria-hidden="true" />
        <span>ค้นหาเทคโนโลยี...</span>
        <kbd className="ml-auto rounded border bg-muted px-1.5 text-xs" aria-hidden="true">
          ⌘K
        </kbd>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" aria-hidden="true" />
        <span className="sr-only">ค้นหา</span>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) {
            setQuery("");
          }
        }}
        commandProps={{ shouldFilter: false }}
      >
        <CommandInput
          placeholder="Search concepts, categories..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {!trimmedQuery && (
            <p className="px-3 py-2 text-xs text-muted-foreground">
              Search by concept name, category, or technology keyword.
            </p>
          )}

          {trimmedQuery && !hasResults && (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              No results found for &ldquo;{trimmedQuery}&rdquo;.
            </p>
          )}

          {conceptResults.length > 0 && (
            <CommandGroup heading="Concepts">
              {conceptResults.map((result) => (
                <CommandItem
                  key={result.slug}
                  value={`concept-${result.slug}`}
                  onSelect={() => navigateToResult(result.href)}
                >
                  <div>
                    <p className="font-medium">{result.title}</p>
                    <p className="text-xs text-muted-foreground">{result.subtitle}</p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {categoryResults.length > 0 && (
            <>
              {conceptResults.length > 0 && <CommandSeparator />}
              <CommandGroup heading="Categories">
                {categoryResults.map((result) => (
                  <CommandItem
                    key={result.slug}
                    value={`category-${result.slug}`}
                    onSelect={() => navigateToResult(result.href)}
                  >
                    <div>
                      <p className="font-medium">{result.title}</p>
                      <p className="text-xs text-muted-foreground">{result.subtitle}</p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {pageResults.length > 0 && (
            <>
              {(conceptResults.length > 0 || categoryResults.length > 0) && (
                <CommandSeparator />
              )}
              <CommandGroup heading="Pages">
                {pageResults.map((result) => (
                  <CommandItem
                    key={`${result.type}-${result.slug}`}
                    value={`page-${result.slug}`}
                    onSelect={() => navigateToResult(result.href)}
                  >
                    <div>
                      <p className="font-medium">{result.title}</p>
                      <p className="text-xs text-muted-foreground">{result.subtitle}</p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {showSuggestions && (
            <>
              {(conceptResults.length > 0 || categoryResults.length > 0 || pageResults.length > 0) && (
                <CommandSeparator />
              )}
              <CommandGroup
                heading={trimmedQuery ? "Try searching for" : "Suggested searches"}
              >
                {suggestions.map((suggestion) => (
                  <CommandItem
                    key={suggestion.query}
                    value={`suggestion-${suggestion.query}`}
                    onSelect={() => setQuery(suggestion.query)}
                  >
                    <Search className="size-4 text-muted-foreground" />
                    <span>{suggestion.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
