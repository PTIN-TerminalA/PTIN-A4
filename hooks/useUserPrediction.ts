import { useState, useEffect, useRef } from "react";
import { Magnetometer, Accelerometer } from "expo-sensors";

type Position = {
  x: number;
  y: number;
};

export function useUserPrediction(initial: Position) {
  const [position, setPosition] = useState<Position>(initial);
  const [heading, setHeading] = useState<number>(0);
  const [velocity, setVelocity] = useState<number>(0);
  const prevTime = useRef(Date.now());

  useEffect(() => {
    const subscription = Magnetometer.addListener((data) => {
      if (data.x !== 0 || data.y !== 0) {
        let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
        angle = angle >= 0 ? angle : 360 + angle;
        setHeading(angle);
      }
    });

    Magnetometer.setUpdateInterval(100);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    let lastStepTime = 0;
    const STEP_THRESHOLD = 1.2;

    const subscription = Accelerometer.addListener((data) => {
      const magnitude = Math.sqrt(
        data.x * data.x + data.y * data.y + data.z * data.z
      );

      const now = Date.now();

      if (magnitude > STEP_THRESHOLD && now - lastStepTime > 300) {
        const stepLength = 0.75;
        const stepInterval = (now - prevTime.current) / 1000;
        if (stepInterval > 0) {
          setVelocity(stepLength / stepInterval);
        }
        lastStepTime = now;
        prevTime.current = now;
      }
    });

    Accelerometer.setUpdateInterval(100);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const deltaTime = (now - prevTime.current) / 1000;
      prevTime.current = now;

      const headingRad = (heading * Math.PI) / 180;
      const dx = Math.cos(headingRad);
      const dy = Math.sin(headingRad);

      setPosition((pos) => ({
        x: pos.x + velocity * dx * deltaTime,
        y: pos.y + velocity * dy * deltaTime,
      }));
    }, 100);

    return () => clearInterval(interval);
  }, [heading, velocity]);

  return {
    position,
    heading,
    velocity,
  };
}
