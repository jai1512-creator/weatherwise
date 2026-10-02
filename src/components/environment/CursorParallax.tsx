import type { ReactNode } from "react";
import { useCursorParallax } from "../../hooks/useCursorParallax";
export function CursorParallax({ children }: { children: ReactNode }) { const ref = useCursorParallax(); return <div ref={ref} className="cursor-parallax">{children}</div>; }

