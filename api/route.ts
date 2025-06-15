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
  // console.log("Origin:", origin);
  // console.log("Destination:", destination);

  try {
    const response = await fetch("https://flysy.software/api/shortest-path", {
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
      // console.error("Error del servidor:", response.status);
      const errorData = await response.json();
      console.error("Error del servidor:", response.status, errorData.detail);
      return null;
    }

    const data: RouteData = await response.json();
    return data;

  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log("Petició cancel·lada");
    } else {
      console.log("Origin:", origin);
      console.log("Destination:", destination);
      console.error("Error al cridar a la API:", error);
    }
    return null;
  }
}

export async function sendRouteRating(
  scheduled_time: string,
  rating: number,
  review: string,
  token: string
): Promise<void> {
  try {
    const response = await fetch("https://flysy.software/api/route-rate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        scheduled_time,
        rating,
        comment: review,
      }),
    });

    if (!response.ok) {
      const message = await response.text();
      console.error(response.status, message);
      return;
    }

    return;

  } catch (error: any) {
    console.error("Error al enviar la valoració:", error);
    throw error;
  }
}