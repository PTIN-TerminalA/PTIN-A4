import { useState, useEffect } from "react";

interface CarLocation {
  id: string;
  x: number;
  y: number;
  visible: boolean;
}

export function useCarLocation(
  routePoints: { x: number; y: number }[] | null,
  canMove: boolean = false,
  pollingInterval = 100
) {
  const [location, setLocation] = useState<CarLocation>({
    id: "car-1",
    x: 1027 / 2,
    y: 664 / 2,
    visible: true,
  });

  const [targetIndex, setTargetIndex] = useState(0);

  useEffect(() => {
    if (canMove && routePoints && routePoints.length > 0) {
      setTargetIndex(0);
    }
  }, [canMove, routePoints]);

  useEffect(() => {
    if (!routePoints || routePoints.length < 2 || !canMove) return;

    const interval = setInterval(() => {
      setLocation((current) => {
        const target = routePoints[targetIndex];
        if (!target) return current;

        const dx = target.x - current.x;
        const dy = target.y - current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const step = 4; // pixels per interval

        if (dist < step) {
          // Llegó al punto, pasa al siguiente
          setTargetIndex((prev) =>
            prev < routePoints.length - 1 ? prev + 1 : prev
          );
          return { ...current, x: target.x, y: target.y };
        } else {
          // Avanza hacia el objetivo
          const ratio = step / dist;
          return {
            ...current,
            x: current.x + dx * ratio,
            y: current.y + dy * ratio,
          };
        }
      });
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [routePoints, targetIndex, pollingInterval, canMove]);
  
  return { location };
}

// CON ESTA OTRA FUNCIÓN useCarLocation ESTÁ LA GENERACIÓN ALEATORIA DE POSICIONES
// export function useCarLocation(
//   pollingInterval = 3000,
//   carId: string = "car-1"
// ) {
//   const [location, setLocation] = useState<CarLocation>({
//     id: carId,
//     x: 1027 / 2, // Al mig de la imatge inicialment
//     y: 664 / 2,
//     visible: true,
//   });

//   useEffect(() => {
//     const interval = setInterval(() => {
//       // TODO: La lògica de moviment del cotxe serà una crida a la api del cloud
//       setLocation((current) => generateNextPosition(current));
//     }, pollingInterval);

//     return () => clearInterval(interval);
//   }, [pollingInterval]);

//   return { location };
// }

// // Aixo simula un moviment aleatori pel cotxe, quan tinguem la posicio real ens ho carreguem
// function generateNextPosition(current: CarLocation): CarLocation {
//   const imageWidth = 1027;
//   const imageHeight = 664;
//   const maxStep = 10;

//   const deltaX = (Math.random() - 0.5) * 2 * maxStep;
//   const deltaY = (Math.random() - 0.5) * 2 * maxStep;

//   const nextX = Math.max(0, Math.min(imageWidth, current.x + deltaX));
//   const nextY = Math.max(0, Math.min(imageHeight, current.y + deltaY));

//   return {
//     ...current,
//     x: nextX,
//     y: nextY,
//   };
// }
