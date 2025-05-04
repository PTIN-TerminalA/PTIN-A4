import { useState } from "react";
import { Service } from "@/constants/mocks/mockTypes";
import { useCarLocation } from "@/hooks/useCarLocation";
import { useUserLocation } from "@/hooks/useUserLocation";

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

  const requestRide = async (to: Service, from: RoutePoint) => {
    if (!to || !from) return; // per seguretat
    
    setIsRequesting(true);
    setDestination(to);
    setStatus("requested");

    // Simulació de crida a la API
    setTimeout(() => {
      setStatus("arriving");
      setIsRequesting(false);
    }, 1000);
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