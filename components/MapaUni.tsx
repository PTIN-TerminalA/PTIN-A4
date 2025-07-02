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
import { useHeading } from "@/hooks/useHeading";
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

const screen = Dimensions.get("window"); //Escala para que la imagen encaje verticalmente
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
  const heading = useHeading();

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
  /*useEffect(() => {
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
  return (
    <ThemedView style={styles.container}>
      <ImageZoom
        {...({
          cropWidth: screen.width,
          cropHeight: screen.height,
          imageWidth: displayedWidth,
          imageHeight: screen.height,
          minScale: 0.3,
          maxScale: 3,
          enableCenterFocus: false,
          useNativeDriver: true,
        } as any)} // Patch perquè no dongui error amb el tipus
      >
        <View style={{ width: displayedWidth, height: screen.height }}>
          {/* Imagen de fondo */}
          <Image
            source={require("@/assets/images/planol.png")}
            style={{ width: displayedWidth, height: screen.height }}
            resizeMode="cover"
          />
          {services &&
            services.map((service) => (
              <MapMarker
                key={service.id}
                x={service.location_x * imageWidth}
                y={service.location_y * imageHeight}
                scale={scale}
                onPress={() => onServicePress(service)}
              />
            ))}
          {
            <View
              pointerEvents="box-none"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: displayedWidth,
                height: screen.height,
              }}
            >
              <Svg
                pointerEvents="box-none"
                width={displayedWidth}
                height={screen.height}
                style={{ position: "absolute", top: 0, left: 0 }}
              >
                {normalizedZones.map((zone, idx) => {
                  const pointsStr = zone.positions
                    .map(
                      ([x, y]) => `${x * displayedWidth},${y * screen.height}`
                    )
                    .join(" ");

                  return (
                    <Polygon
                      key={idx}
                      pointerEvents="auto"
                      points={pointsStr}
                      fill="rgba(160, 160, 240, 0.05)"
                      stroke="blue"
                      strokeWidth={2}
                      onPress={() => {
                        console.log("pressed polygon");
                        const service = services?.find(
                          (s) => s.name === zone.name
                        );
                        if (service) onServicePress(service);
                      }}
                    />
                  );
                })}
              </Svg>
            </View>
          }

          {userLocation && (
            <UserMarker
              x={userLocation.x * imageWidth}
              y={userLocation.y * imageHeight}
              scale={scale}
              imageHeight={imageHeight}
              heading={heading}
            />
          )}

          {carPos && carPos.visible && (
            // console.log("car: ", carPos),
            <CarMarker
              x={carPos.x * imageWidth}
              y={carPos.y * imageHeight}
              rotation={carPos.rotation}
              scale={scale}
              onPress={() => console.log("Cotxe clicat")}
            />
          )}

          {/** Visualització de la ruta en el MapaUni */}
          {routePoints && routePoints.length > 1 && (
            <Svg
              width={displayedWidth}
              height={screen.height}
              style={{ position: "absolute", top: 0, left: 0 }}
              pointerEvents="none" // Per poder seleccionar altres Markers del mapa mentre visualitzo la ruta
            >
              <Polyline
                points={routePoints
                  .map((point) => `${point.x * scale},${point.y * scale}`)
                  .join(" ")}
                fill="none"
                stroke="blue"
                strokeWidth={3}
              />
            </Svg>
          )}
        </View>
      </ImageZoom>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MapaUni;
