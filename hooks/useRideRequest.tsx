import { useState } from "react";
import { Service } from "@/constants/mocks/mockTypes";
import { useCarLocation } from "@/hooks/useCarLocation";
import { useUserLocation } from "@/hooks/useUserLocation";
import { API_URL } from "@/constants/Api";
import { request } from "react-native-permissions";
import { useAuth } from "./useAuth";

// Stype RideStatus = "idle" | "setted" | "requested" | "arriving" | "enroute" | "completed";

type RoutePoint = {
  x: number;
  y: number;
};

type Location = {
  x: number;
  y: number;
};

export interface RideData { // doc ruoute a MongoDB
  _id: string;
  user_id: number;
  start_location: string;
  end_location: string;
  scheduled_time: string; // ISO string
  state: string;          // "Solicitat", "Esperant", "En curs", "Disponible"
  car_id: string;
}

export interface RideResponse {
  message: string;
  data: RideData;
  car_id: string;
}

// Add a small offset to avoid obstacles
function adjustCoordinates(location: Location): Location {
  // Add a small random offset to avoid obstacles
  // const offset = 0.01; // 1% of the map size
  return {
    x: 0.5066077922077928,
    y: 0.9
  };
}

export const useRideRequest = () => {
  /*
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
  */
  const { token } = useAuth();
  const [reservationMessage, setReservationMessage] = useState<string | null>(null); //useState<string | null>(null)
  const [rideResponse, setRideResponse] = useState<RideResponse | null>(null);

  const setRide = async (location: Location, end_location: String) => {
    if (!location || !end_location) return; // per seguretat
    console.log("Starting testReserve");
    console.log("Request payload:", {
      location: { x: location.x, y: location.y },
      end_location: end_location,
    });
    
    try {
      const response = await fetch("https://flysy.software/api/reserves/app-basic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          location: { x: location.x, y: location.y },
          end_location: end_location,
        }),
      });

      console.log("Response status:", response.status);
      // const data: RideResponse = await response.json();
      // console.log("Response data:", data);      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, detail: ${errorData.detail || 'No detail provided'}`);
      }
      
      const text = await response.text();
      console.log("Raw response:", text);
      
      if (!text) {
        throw new Error("Empty response received");
      }
      
      try {
        const data: RideResponse = JSON.parse(text);
        console.log("Response data:", data);

        if (data.message) {
          setReservationMessage(data.message);
          setRideResponse(data);
        }
      } catch (parseError) {
        console.error("JSON Parse error:", parseError);
        throw new Error(`Invalid JSON response: ${text}`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setReservationMessage("Error al reservar el viatge. Si us plau, torna-ho a provar.");
    } 
  };

  const startRide = async (destination: Location) => {
    try {
      const response = await fetch("https://flysy.software/api/inicia-trajecte", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          destination: { x: destination.x, y: destination.y }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al iniciar el trajecte");
      }

      const data = await response.json();
      console.log("Trajecte iniciat:", data);
      return data;
    } catch (error) {
      console.error("Error a startRide:", error);
      throw error;
    }
  };


  /*
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
  */

  const nearestService = async (location: Location) => {
    try {
      console.log("Original location:", location);
      
      const response = await fetch("https://flysy.software/api/getNearestService", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(location),
      });
      // if (!response.ok) throw new Error("No s'ha pogut obtenir el servei més proper");
      if (!response.ok) {
        console.error("API Response not OK:", response.status, response.statusText);
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error("No s'ha pogut obtenir el servei més proper");
      }
  
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
      const response = await fetch("https://flysy.software/api/getServices");
  
      if (!response.ok) throw new Error("Error obtenint serveis");
  
      const data = await response.json();
      console.log("Serveis disponibles:", data);
      return data;
    } catch (error) {
      console.error("Error a services:", error);
      return [];
    }
  };

  /*
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
  */

  /*
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
  */

  /*
  const cancelRide = () => {
    setDestination(null);
    setOrigin(null);
    setStatus("idle");
    setRoute(null);
  };
  */

  return {
    // isSetting,
    // status,
    // destination,
    // origin,
    // route,
    setRide,
    // releaseRide,
    nearestService,
    services,
    // runningRide,
    // requestedRide,
    // cancelRide,
    reservationMessage,
    rideResponse,
  };
};