import { useState, useEffect } from "react";
import { API_URL } from "@/api/Api";

interface CarLocation {
  car_id: string;
  position: {
    x: number;
    y: number;
  };
  state: string;
}

export function useCarLocation(carId: string | null) {
  const [location, setLocation] = useState<CarLocation | null>(null);

  useEffect(() => {
    if (!carId) return;

    const fetchLocation = async () => {
      try {
        const response = await fetch("https://flysy.software/cotxe/${carId}/status");
        if (!response.ok) {
          throw new Error(`Error ${response.status}: No s'ha pogut obtenir la ubicació del cotxe.`);
        }

        const data: CarLocation = await response.json();
        setLocation(data);
      } catch (err: any) {
        setLocation(null);
      }

      const interval = setInterval(fetchLocation, 3000); // cada 3 segons
      return () => clearInterval(interval);
    };

    fetchLocation();

  },  [carId]);
  
  return location;
}