import { useEffect, useRef } from "react";

export function useCursorParallax(enabled = true) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (
      !element ||
      !enabled ||
      typeof window === "undefined" ||
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = 0;
    let isRunning = false;

    const update = () => {
      // Smooth interpolation damping
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      element.style.setProperty("--pointer-x", currentX.toFixed(4));
      element.style.setProperty("--pointer-y", currentY.toFixed(4));

      // Continue animating until settled
      if (Math.abs(targetX - currentX) > 0.0002 || Math.abs(targetY - currentY) > 0.0002) {
        rafId = requestAnimationFrame(update);
      } else {
        isRunning = false;
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      targetX = event.clientX / window.innerWidth - 0.5;
      targetY = event.clientY / window.innerHeight - 0.5;

      if (!isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(update);
      }
    };

    const handlePointerLeave = () => {
      targetX = 0;
      targetY = 0;
      if (!isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(update);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handlePointerLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  return ref;
}

