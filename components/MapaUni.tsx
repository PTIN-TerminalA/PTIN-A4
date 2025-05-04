import React, { useEffect, useState } from 'react';
import { View, Image, Dimensions, StyleSheet } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';

interface Car {
  x: number;
  y: number;
}

interface MapaUniProps {
  userLocation: { x: number; y: number } | null; 
}

const imageWidth = 1027;
const imageHeight = 664;
const NUM_CARS = 10;

const screen = Dimensions.get('window');

//Escala para que la imagen encaje verticalmente
const scale = screen.height / imageHeight;
const displayedWidth = imageWidth * scale;

const MapaUni: React.FC<MapaUniProps> = ({ userLocation }) => {
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
          x: Math.max(0, Math.min(imageWidth, car.x + (Math.random() - 0.5) * 10)),
          y: Math.max(0, Math.min(imageHeight, car.y + (Math.random() - 0.5) * 10)),
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <ImageZoom
        cropWidth={screen.width}
        cropHeight={screen.height}
        imageWidth={displayedWidth}
        imageHeight={screen.height}
        minScale={1}
        maxScale={3}
        enableCenterFocus={false}
        useNativeDriver={true}
      >
        <View style={{ width: displayedWidth, height: screen.height }}>
          {/* Imagen de fondo */}
          <Image
            source={require('@/assets/images/planol.png')}
            style={{ width: displayedWidth, height: screen.height }}
            resizeMode="cover"
          />

          {/* Puntos coches */}
          {carPositions.map((car, index) => (
            <View
              key={index}
              style={{
                position: 'absolute',
                left: car.x * scale - 7.5,
                top: car.y * scale - 7.5,
                width: 15,
                height: 15,
                borderRadius: 7.5,
                backgroundColor: 'red',
                borderColor: 'white',
                borderWidth: 1,
              }}
            />
          ))}
          
          {/* Posición del usuario */}
          {userLocation && (
            <View
              style={{
                position: 'absolute',
                left: userLocation.x * imageWidth * scale - 10,
                top: userLocation.y * imageHeight * scale - 10,
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: 'blue',
                borderColor: 'white',
                borderWidth: 2,
              }}
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
    backgroundColor: '#000',
  },
});

export default MapaUni;