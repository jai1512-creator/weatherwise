import { useState, useRef, useEffect, type FormEvent } from "react";
import { useLocationSearch } from "../../hooks/useLocationSearch";
import type { Location } from "../../types/location";
import { SearchResults } from "./SearchResults";

export function LocationSearch({
  onSelect,
  onLocate,
  isLocating,
}: {
  onSelect: (location: Location) => void;
  onLocate: () => void;
  isLocating: boolean;
}) {
  const [query, setQuery] = useState("");
  const { results, search, isSearching, clearResults } = useLocationSearch();
  const containerRef = useRef<HTMLDivElement>(null);

  // Close results on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        clearResults();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        clearResults();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [clearResults]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (query.trim()) {
      void search(query.trim());
    }
  };

  const select = (location: Location) => {
    onSelect(location);
    clearResults();
    setQuery(location.name);
  };

  return (
    <section className="location-search" aria-label="Location search" ref={containerRef}>
      <form onSubmit={submit} className="location-search__form">
        <div className="location-search__input-wrapper">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search city, locality, landmark…"
            aria-label="Location query"
            className="location-search__input"
          />
          {query && (
            <button
              type="button"
              className="location-search__clear"
              onClick={() => {
                setQuery("");
                clearResults();
              }}
              aria-label="Clear search query"
            >
              ✕
            </button>
          )}
        </div>
        <button type="submit" disabled={isSearching || !query.trim()} className="button button--primary">
          {isSearching ? "Searching…" : "Search"}
        </button>
        <button
          type="button"
          onClick={onLocate}
          disabled={isLocating}
          className="button button--secondary"
          title="Use browser geolocation to get current weather"
        >
          {isLocating ? "Locating…" : "📍 Use my location"}
        </button>
      </form>
      <SearchResults results={results} onSelect={select} />
    </section>
  );
}

