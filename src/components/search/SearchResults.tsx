import type { Location } from "../../types/location";

export function SearchResults({
  results,
  onSelect,
}: {
  results: Location[];
  onSelect: (location: Location) => void;
}) {
  if (!results.length) return null;

  return (
    <ul className="search-results" role="listbox" aria-label="Search results">
      {results.map((location) => {
        const sub = [location.region, location.country].filter(Boolean).join(", ");
        return (
          <li key={`${location.latitude}-${location.longitude}`} role="option" aria-selected="false">
            <button
              type="button"
              className="search-result-item"
              onClick={() => onSelect(location)}
            >
              <div className="search-result-info">
                <strong className="search-result-name">{location.name}</strong>
                {sub && <span className="search-result-sub">{sub}</span>}
              </div>
              <span className="search-result-arrow" aria-hidden="true">→</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

