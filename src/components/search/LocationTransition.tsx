export function LocationTransition({ active }: { active: boolean }) { return active ? <div className="location-transition" aria-live="polite">Updating forecast…</div> : null; }

