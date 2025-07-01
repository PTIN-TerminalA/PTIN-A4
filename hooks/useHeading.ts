import { magnetometer, setUpdateIntervalForType, SensorTypes } from "react-native-sensors";
import { map, filter } from "rxjs/operators";
import { useEffect, useState } from "react";

export function useHeading() {
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.magnetometer, 100); // 100ms

    const subscription = magnetometer
      .pipe(
        filter(({ x, y, z }) => x !== 0 && y !== 0),
        map(({ x, y }) => {
          let angle = Math.atan2(y, x) * (180 / Math.PI);
          let heading = angle >= 0 ? 360 - angle : -angle;
          return heading;
        })
      )
      .subscribe(setHeading);

    return () => subscription.unsubscribe();
  }, []);

  return heading;
}

