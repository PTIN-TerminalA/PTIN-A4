import { normalizeZones } from "@/hooks/useNormalizedZones";
import React, { useRef, useState } from "react";
import { Pressable, View, StyleSheet, Text } from "react-native";
import { GestureResponderEvent } from "react-native-modal";
import Svg, { Circle, Polygon } from "react-native-svg";

type Position = [number, number];
function isPointInPolygon(point: Position, polygon: Position[]): boolean {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    const intersect =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi + 0.000001) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}
export type Zone = {
  name: string;
  type: string;
  positions: Position[];
  info: string;
};

type ZoneViewerProps = {
  zones: Zone[];
  onZonePress: (zone: Zone) => void;
  width: number;
  height: number;
  debug: boolean;
};

export const ZoneViewer: React.FC<ZoneViewerProps> = ({
  zones,
  onZonePress,
  width,
  height,
  debug = false, // Default to false
}) => {
  const normalizedZones = normalizeZones(zones);
  const containerRef = useRef<View>(null);
  const [lastTouch, setLastTouch] = useState<Position | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");

  const handlePress = (event: GestureResponderEvent) => {
    if (!containerRef.current) return;

    containerRef.current.measure((x, y, w, h, pageX, pageY) => {
      const touchX = event.nativeEvent.pageX - pageX;
      const touchY = event.nativeEvent.pageY - pageY;
      setLastTouch([touchX, touchY]);

      let debugText = `Touch: ${touchX.toFixed(1)}, ${touchY.toFixed(1)}\n`;
      let hitZone: Zone | null = null;

      for (const zone of normalizedZones) {
        const scaledPolygon = zone.positions.map(
          ([x, y]): Position => [x * width, y * height]
        );

        const isInside = isPointInPolygon([touchX, touchY], scaledPolygon);
        debugText += `Zone ${zone.name}: ${isInside ? "HIT" : "miss"}\n`;

        if (isInside && !hitZone) {
          hitZone = zone;
        }
      }

      setDebugInfo(debugText);

      if (hitZone) {
        console.log(`Pressed zone: ${hitZone.name}`);
        onZonePress(hitZone);
      }
    });
  };

  return (
    <View
      ref={containerRef}
      style={[styles.container, { width, height }]}
      onStartShouldSetResponder={() => true}
      onResponderRelease={handlePress}
    >
      <Svg width={width} height={height} style={styles.svg}>
        {normalizedZones.map((zone, idx) => (
          <Polygon
            key={`zone-${idx}`}
            points={zone.positions
              .map(([x, y]) => `${x * width},${y * height}`)
              .join(" ")}
            fill="rgba(100, 200, 255, 0.3)"
            stroke="rgba(0, 100, 255, 0.8)"
            strokeWidth={2}
          />
        ))}

        {debug && lastTouch && (
          <>
            <Circle
              cx={lastTouch[0]}
              cy={lastTouch[1]}
              r={10}
              fill="rgba(255, 0, 0, 0.5)"
            />
            <Circle
              cx={lastTouch[0]}
              cy={lastTouch[1]}
              r={4}
              fill="rgba(255, 255, 255, 1)"
            />
          </>
        )}
      </Svg>

      {debug && (
        <View style={styles.debugOverlay}>
          <Text style={styles.debugText}>{debugInfo}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  svg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  debugOverlay: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 10,
    borderRadius: 5,
  },
  debugText: {
    color: "white",
    fontSize: 12,
  },
});
