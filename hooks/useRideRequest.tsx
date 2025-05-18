import { useState } from "react";
import { Service } from "@/constants/mocks/mockTypes";
import { useCarLocation } from "@/hooks/useCarLocation";
import { useUserLocation } from "@/hooks/useUserLocation";
import { API_URL } from "@/constants/Api";
import { request } from "react-native-permissions";
import { useAuth } from "./useAuth";

type RideStatus = "idle" | "setted" | "requested" | "arriving" | "enroute" | "completed";

type RoutePoint = {
  x: number;
  y: number;
};

interface UserLocation {
  x: number;
  y: number;
}

type Location = {
  x: number;
  y: number;
};

export interface Ride {
  origin: RoutePoint;
  destination: Service;
  status: RideStatus;
  route: RoutePoint[]; // O null al principio
}

export const useRideRequest = () => {
  const [isSetting, setIsSetting] = useState(false);
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
  const { token } = useAuth();

  const setRide = async (location: Location, end_location: String) => {
    if (!location || !end_location) return; // per seguretat
    
    try {
      // Realizar la solicitud HTTP al backend para registrar el viaje
      const response = await fetch(`${API_URL}/reserves/app`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({location, end_location}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al solicitar el viaje");
      }
      console.log("Viaje solicitado con éxito:", data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error al solicitar el viaje:", error.message);
      }
    } finally {
      setIsSetting(false);
    }
  }

  const releaseRide = async (cotxe_id: String) => {
    try {
      const response = await fetch(`${API_URL}/cotxe/${cotxe_id}/disponible`, {
        method: "PUT",
      });
  
      if (!response.ok) throw new Error("Error al alliberar el cotxe");
  
      const data = await response.json();
      console.log("Cotxe alliberat:", data);
      return data;
    } catch (error) {
      console.error("Error a releaseRide:", error);
      return null;
    }
  }

  const nearestService = async (location: Location) => {
    try {
      const response = await fetch(`${API_URL}/api/getNearestService`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(location),
      });
  
      if (!response.ok) throw new Error("No s'ha pogut obtenir el servei més proper");
  
      const data = await response.json();
      console.log("Servei més proper amb id:", data);
      return data;
    } catch (error) {
      console.error("Error a nearestService:", error);
      return null;
    }
  };

  const services = async () => {
    try {
      const response = await fetch(`${API_URL}/api/getServices`);
  
      if (!response.ok) throw new Error("Error obtenint serveis");
  
      const data = await response.json();
      console.log("Serveis disponibles:", data);
      return data;
    } catch (error) {
      console.error("Error a services:", error);
      return [];
    }
  };

  const runningRide = async (cotxe_id: String) => {
    try {
      const response = await fetch(`${API_URL}/cotxe/${cotxe_id}/en_curs`, {
        method: "PUT",
      });
  
      if (!response.ok) throw new Error("Error al correr el cotxe");
  
      const data = await response.json();
      console.log("Cotxe en curs:", data);
      return data;
    } catch (error) {
      console.error("Error a runningRide:", error);
      return null;
    }
  }

  const requestedRide = async (cotxe_id: String) => {
    try {
      const response = await fetch(`${API_URL}/cotxe/${cotxe_id}/solicitat`, {
        method: "PUT",
      });
  
      if (!response.ok) throw new Error("Error al solicitar el cotxe");
  
      const data = await response.json();
      console.log("Cotxe solicitat:", data);
      return data;
    } catch (error) {
      console.error("Error a requestedRide:", error);
      return null;
    }
  }





  const cancelRide = () => {
    setDestination(null);
    setOrigin(null);
    setStatus("idle");
    setRoute(null);
  };

  return {
    isSetting,
    status,
    destination,
    origin,
    route,
    setRide,
    releaseRide,
    nearestService,
    services,
    runningRide,
    requestedRide,
    cancelRide,
  };
};