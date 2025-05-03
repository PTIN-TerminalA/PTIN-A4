import { useState, useEffect } from "react";

interface CarLocation {
  id: string;
  x: number;
  y: number;
  rotation: number;
  visible: boolean;
}

export function useCarLocation(
  pollingInterval = 3000,
  carId: string = "car-1"
) {
  const [location, setLocation] = useState<CarLocation>({
    id: carId,
    x: 1027 / 2, // Al mig de la imatge inicialment
    y: 664 / 2,
    rotation: 0,
    visible: true,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // TODO: La lògica de moviment del cotxe serà una crida a la api del cloud
      setLocation((current) => generateNextPosition(current));
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [pollingInterval]);

  return { location };
}

// Aixo simula un moviment aleatori pel cotxe, quan tinguem la posicio real ens ho carreguem
function generateNextPosition(current: CarLocation): CarLocation {
  const imageWidth = 1027;
  const imageHeight = 664;
  const maxStep = 10;

  const lastX = current.x
  const lastY = current.y

  const deltaX = (Math.random() - 0.5) * 2 * maxStep;
  const deltaY = (Math.random() - 0.5) * 2 * maxStep;

  const nextX = Math.max(0, Math.min(imageWidth, current.x + deltaX));
  const nextY = Math.max(0, Math.min(imageHeight, current.y + deltaY));

  const nextRotation = Math.atan2(nextX - lastX, lastY - nextY) * (180/Math.PI)


  return {
    ...current,
    x: nextX,
    y: nextY,
    rotation: nextRotation,
  };
}
