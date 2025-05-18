import { API_URL } from './Api';

export interface Point {
  x: number;
  y: number;
}

// Invertim coordenada Y per adaptar-nos al sistema de l'API de l'A5
const normalizeCoordinatesPos = (point: Point): Point => ({
  x: point.x,
  y: 1 - point.y
});

export async function getRoutePoints(
  origin: Point, destination: Point, signal?: AbortSignal): 
  Promise<[number, number][] | null> {

  try {
    const start = normalizeCoordinatesPos(origin);
    const goal = normalizeCoordinatesPos(destination);

    const response = await fetch(`${API_URL}/api/shortest-path`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ // la API del A3 accepta arrays no Points
        start : [start.x, start.y], 
        goal: [goal.x, goal.y]
      }),
    });
    
    if (!response.ok) {
      console.error("Error del servidor:", response.status);
      return null;
    }

    const data = await response.json();
    return data.path ?? null;

  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log("Petició cancel·lada");
    } else {
      console.error("Error al cridar a la API:", error);
    }
    return null;
  }
}