import { API_URL } from './Api';

export interface Point {
  x: number;
  y: number;
}
export interface RouteData {
  length: number;
  temps: string;
  path: [number, number][];
}
export async function getRoutePoints(
  origin: Point, destination: Point, signal?: AbortSignal): 
  Promise<RouteData | null> {

  try {
    const response = await fetch(`${API_URL}/api/shortest-path`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ // la API del A3 accepta arrays no Points
        start : [origin.x, origin.y],
        goal: [destination.x, (1-destination.y)]
      }),
    });
    
    if (!response.ok) {
      console.error("Error del servidor:", response.status);
      return null;
    }

    const data: RouteData = await response.json();
    return data;

  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log("Petició cancel·lada");
    } else {
      console.error("Error al cridar a la API:", error);
    }
    return null;
  }
}