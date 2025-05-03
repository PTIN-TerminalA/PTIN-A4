// hooks/useROuteDestination.ts
import { useMemo } from "react";

interface Point {
  x: number;
  y: number;
}

export function useRouteDestination(origin: Point | null, destination: Point | null) {
  const route = useMemo(() => {
    if (!origin || !destination) return [];

    const points: Point[] = [];
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      points.push({
        x: origin.x + t * (destination.x - origin.x),
        y: origin.y + t * (destination.y - origin.y),
      });
    }
    return points;
  }, [origin, destination]);

  return route;
}
