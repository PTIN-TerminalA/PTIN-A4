import { useEffect, useState } from "react";
import { Magnetometer, Accelerometer } from "expo-sensors";

export const useHeading = () => {
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    let accelData = { x: 0, y: 0, z: 0 };
    let magData = { x: 0, y: 0, z: 0 };

    const accelSub = Accelerometer.addListener((data) => {
      accelData = data;
      updateHeading();
    });
    const magSub = Magnetometer.addListener((data) => {
      magData = data;
      updateHeading();
    });

    Accelerometer.setUpdateInterval(100);
    Magnetometer.setUpdateInterval(100);

    function updateHeading() {
      const { x: ax, y: ay, z: az } = accelData;
      const { x: mx, y: my, z: mz } = magData;

      // Normalize accelerometer vector
      const normAccel = Math.sqrt(ax * ax + ay * ay + az * az);
      const axn = ax / normAccel;
      const ayn = ay / normAccel;
      const azn = az / normAccel;

      // Calculate pitch and roll
      const pitch = Math.asin(-axn);
      const roll = Math.asin(ayn / Math.cos(pitch));

      // Tilt compensation for magnetometer
      const magX = mx * Math.cos(pitch) + mz * Math.sin(pitch);
      const magY =
        mx * Math.sin(roll) * Math.sin(pitch) +
        my * Math.cos(roll) -
        mz * Math.sin(roll) * Math.cos(pitch);

      let angle = Math.atan2(magY, magX) * (180 / Math.PI);

      // Convert from [-180,180] to [0,360]
      angle = (angle + 360) % 360;

      setHeading(angle);
    }

    return () => {
      accelSub.remove();
      magSub.remove();
    };
  }, []);

  return heading;
};
