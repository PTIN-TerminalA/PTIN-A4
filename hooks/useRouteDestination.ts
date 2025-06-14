import { useState, useEffect, useMemo } from "react";
import { getRoutePoints, Point } from "@/api/route";

const imageWidth = 1027;
const imageHeight = 664;

function normalizePointsRoute(points: Point[]): Point[] {
  return points.map(({ x, y }) => ({
    x: x * imageWidth,
    y: (1-y) * imageHeight,
  }));
}

function arrayToPoints(arr: [number, number][]): Point[] {
  return arr.map(([x, y]) => ({ x, y }));
}

export function useRouteDestination(origin: Point | null, destination: Point | null) {
  const [route, setRoute] = useState<Point[]>([]);
  const [temps, setTemps] = useState<string | null>(null);

  useEffect(() => {
    if (!origin || !destination) {
      setRoute([]);
      return;
    }

    const controller = new AbortController();
    const fetchRoute = async () => {
      const res = await getRoutePoints(origin, destination, controller.signal);
      if (res?.path && res?.length > 0) {
        const points: Point[] = arrayToPoints(res.path); // la API treballa amb arrays
        const normalized = normalizePointsRoute(points); // adaptem coordenades a les del nostre mapa
        setRoute(normalized);
        setTemps(res.temps)
      }
    };

    fetchRoute();

    return () => {
      controller.abort(); // Cancel·la la petició si l’efecte es reinicia o es desmonta el component
    };
  }, [origin, destination]);

  return {route, temps};
}