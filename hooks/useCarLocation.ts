import { useState, useEffect } from "react";
import { API_URL } from "@/api/Api";

interface CarLocation {
  car_id: string;
  position: {
    x: number;
    y: number;
  };
  state: string; // { moving, stopped }
}

export function useCarLocation(carId: string | null) {
  const [location, setLocation] = useState<CarLocation | null>(null);

  useEffect(() => {
    if (!carId) return;
    // else console.log('CAR_ID:', carId);
    let interval: NodeJS.Timeout;

    const fetchLocation = async () => {
      try {
        const response = await fetch(`https://flysy.software/api/cotxe/${carId}/status`);

        console.log("Resposta de l'API:", response.status, response.statusText);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const data: CarLocation = JSON.parse(await response.text());
        // console.log("La data que s'assigna a la ubicació del cotxe és: ", data);
        setLocation(data);
      } catch (err: any) {
        console.error("Error al obtenir la localització del cotxe:", err.message);
        // console.log("Assignem a la ubicació del cotxe NULL")
        setLocation(null);
        // clearInterval(interval);
      }

      // return () => clearInterval(interval);
    };

    fetchLocation();
    interval = setInterval(fetchLocation, 1000); // cada segon
    return () => clearInterval(interval);
  },  [carId]);


  console.log("La localització del cotxe és: ", location?.position);
  return location;
}