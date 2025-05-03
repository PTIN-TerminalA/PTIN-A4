import React, { useEffect, useState } from "react";
import { View, Image, Dimensions, StyleSheet } from "react-native";
import ImageZoom from "react-native-image-pan-zoom";
import MapMarker from "@/components/MapMarker";
import { Service } from "@/constants/mocks/mockTypes";
import CarMarker from "@/components/CarMarker";
import UserMarker from "@/components/UserMarker";

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
};

const imageWidth = 1027;
const imageHeight = 664;
const NUM_CARS = 10;

const screen = Dimensions.get("window");

//Escala para que la imagen encaje verticalmente
const scale = screen.height / imageHeight;
const displayedWidth = imageWidth * scale;

const MapaUni: React.FC<Props> = ({
  services,
  onServicePress,
  carPos,
  userLocation,
}) => {
  const [carPositions, setCarPositions] = useState<Car[]>([]);

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

  return (
    <View style={styles.container}>
      <ImageZoom
        {...({
          cropWidth: screen.width,
          cropHeight: screen.height,
          imageWidth: displayedWidth,
          imageHeight: screen.height,
          minScale: 1,
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
                x={service.x}
                y={service.y}
                scale={scale}
                onPress={() => onServicePress(service)}
              />
            ))}

          {/* Puntos coches 
          {carPositions.map((car, index) => (
            <View
              key={index}
              style={{
                position: "absolute",
                left: car.x * scale - 7.5,
                top: car.y * scale - 7.5,
                width: 15,
                height: 15,
                borderRadius: 7.5,
                backgroundColor: "red",
                borderColor: "white",
                borderWidth: 1,
              }}
            />
          ))}*/}
          {userLocation && (
            <UserMarker x={userLocation.x} y={userLocation.y} scale={scale} />
          )}

          {carPos && carPos.visible && (
            <CarMarker
              x={carPos.x}
              y={carPos.y}
              rotation={carPos.rotation}
              scale={scale}
              onPress={() => console.log("Cotxe clicat")}
            />
          )}
        </View>
      </ImageZoom>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});

export default MapaUni;
