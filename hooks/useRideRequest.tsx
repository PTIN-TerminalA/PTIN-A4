import { useState } from "react";
import { Service } from "@/constants/mocks/mockTypes";
import { useCarLocation } from "@/hooks/useCarLocation";
import { useUserLocation } from "@/hooks/useUserLocation";
import { API_URL } from "@/constants/Api";

type RideStatus = "idle" | "requested" | "arriving" | "enroute" | "completed";

type RoutePoint = {
  x: number;
  y: number;
};

interface UserLocation {
  x: number;
  y: number;
}

export interface Ride {
  origin: RoutePoint;
  destination: Service;
  status: RideStatus;
  route: RoutePoint[]; // O null al principio
}

export const useRideRequest = () => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [destination, setDestination] = useState<Service | null>(null);
  const [origin, setOrigin] = useState<RoutePoint | null>(null);
  const [status, setStatus] = useState<RideStatus>("idle");
  const [route, setRoute] = useState<RoutePoint[] | null>(null);
  const [newBooking, setNewBooking] = useState({
    user_email: "a4@gmail.com",
    start_location: "Porta A1",
    end_location: "McDonald's",
    scheduled_time: "2025-05-04T14:00:00Z",
    state: "En curs"
  });
  const token = "token";

  const requestRide = async (to: Service, from: RoutePoint) => {
    if (!to || !from) return; // per seguretat
    
    setIsRequesting(true);
    setDestination(to);
    setStatus("requested");

    try {
      // Realizar la solicitud HTTP al backend para registrar el viaje
      const response = await fetch(`${API_URL}/reserves/usuari`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newBooking),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al solicitar el viaje");
      }
      setStatus("arriving");
      console.log("Viaje solicitado con éxito:", data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error al solicitar el viaje:", error.message);
        setStatus("idle");
      }
    } finally {
      setIsRequesting(false);
    }
    // // Simulació de crida a la API
    // setTimeout(() => {
    //   setStatus("arriving");
    //   setIsRequesting(false);
    // }, 1000);
  }

  const cancelRide = () => {
    setDestination(null);
    setOrigin(null);
    setStatus("idle");
    setRoute(null);
  };

  return {
    isRequesting,
    status,
    destination,
    origin,
    route,
    requestRide,
    cancelRide,
  };
};