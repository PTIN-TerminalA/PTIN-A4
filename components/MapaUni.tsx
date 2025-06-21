import React, { useEffect, useState } from "react";
import { View, Image, Dimensions, StyleSheet } from "react-native";
import ImageZoom from "react-native-image-pan-zoom";
import MapMarker from "@/components/MapMarker";
import { Service } from "@/constants/mocks/mockTypes";
import { zones } from "@/constants/mocks/zones";
import CarMarker from "@/components/CarMarker";
import UserMarker from "@/components/UserMarker";
import { ThemedView } from "@/components/ThemedView";
import Svg, { G, Polygon, Polyline } from "react-native-svg";
import { TapGestureHandler } from "react-native-gesture-handler";
import {
  normalizeRotatedZones,
  normalizeZones,
} from "@/hooks/useNormalizedZones";
import { ZoneViewer } from "./ZoneOverlays";
import { useCanvasGestures } from "@/hooks/useCanvasGestures";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
interface Car {
  x: number;
  y: number;
}

type Props = {
  services: Service[] | null;
  onServicePress: (service: Service) => void;
  carPos: {
    id: string;
    x: number;
    y: number;
    rotation: number;
    visible: boolean;
  } | null;

  userLocation: {
    x: number;
    y: number;
  } | null;

  routePoints?: { x: number; y: number }[];
};

const mapImage = require("@/assets/images/planol.png");
const imageInfo = Image.resolveAssetSource(mapImage);

const imageWidth = imageInfo.width;
const imageHeight = imageInfo.height;
const NUM_CARS = 10;

const screen = Dimensions.get("window");

//Escala para que la imagen encaje verticalmente
const scale = screen.height / imageHeight;
const displayedWidth = imageWidth * scale;

const normalizedZones = normalizeRotatedZones(zones);

const MapaUni: React.FC<Props> = ({
  services,
  onServicePress,
  carPos,
  userLocation,
  routePoints,
}) => {
  const [carPositions, setCarPositions] = useState<Car[]>([]);
const { gesture, animatedStyle, isPanning } = useCanvasGestures();

  //Genera coches con posiciones aleatorias alrededor del centro
  const generatePositions = (): Car[] => {
    const cars: Car[] = [];
    for (let i = 0; i < NUM_CARS; i++) {
      cars.push({
        x: imageWidth / 2 + (Math.random() - 0.5) * 100,
        y: imageHeight / 2 + (Math.random() - 0.5) * 100,
      });
    }
    return cars;
  };

  //Movimiento de los coches
  useEffect(() => {
    setCarPositions(generatePositions());
    const interval = setInterval(() => {
      setCarPositions((cars) =>
        cars.map((car) => ({
          x: Math.max(
            0,
            Math.min(imageWidth, car.x + (Math.random() - 0.5) * 10)
          ),
          y: Math.max(
            0,
            Math.min(imageHeight, car.y + (Math.random() - 0.5) * 10)
          ),
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  {
    /*services?.forEach(service => {
    console.log('Service position:', service.location_x, service.location_y);
  });*/
  }
  return (
    <ThemedView style={styles.container}>
       <GestureDetector gesture={gesture}>
          <Animated.View style={[{ flex: 1 }, animatedStyle]}>
            <Image
              source={require("@/assets/images/planol.png")}
              
                  />
      
                  <Svg
                                  pointerEvents="box-none"
                                  width='500%'
                                  height='200%'
                                  style={{ position: "absolute", top: 0, left: 0 }}
                                >
                                  {normalizedZones.map((zone, idx) => {
                                    const pointsStr = zone.positions
                                      .map(
                                        ([x, y]) => `${x * imageWidth},${y * imageHeight}`
                                      )
                                      .join(" ");
                  
                                    return (
                                      <Polygon
                                        key={idx}
                                        pointerEvents="box-none"
                                        points={pointsStr}
                                        fill="none"
                                        stroke="none"
                                        strokeWidth={2}
                                        onPressIn={() => {
                                          console.log("pressed polygon",zone.name);
                                          const service = services?.find(
                                              (s) => s.name === zone.name
                                              );
                                          
                                              if (service) {
                                                  setTimeout(() => {
                                                      if (!isPanning.value) {
                                                          onServicePress(service);
                                                      }
                                                  }, 100); // Delay to ensure the modal opens after the gesture ends
                                              }
                                          
                                        }}
                                      />
                                    );
                                  })}
                                </Svg>
      
          </Animated.View>
        </GestureDetector>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MapaUni;
