import React, { useEffect, useState } from 'react';
import { View, Image, Dimensions, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const IMAGE_URL = 'https://i.imgur.com/abc123.png'; // reemplaza con tu plano
const NUM_CARS = 10;

const LAT_CENTER = 37.78825;
const LNG_CENTER = -122.4324;
const LAT_DELTA = 0.01;
const LNG_DELTA = 0.01;

const generateInitialPositions = () =>
  Array.from({ length: NUM_CARS }, () => ({
    latitude: LAT_CENTER + (Math.random() - 0.5) * (LAT_DELTA / 2),
    longitude: LNG_CENTER + (Math.random() - 0.5) * (LNG_DELTA / 2),
  }));

const colors = ['red', 'blue', 'green', 'orange', 'purple', 'yellow', 'pink', 'teal', 'brown', 'black'];

export default function IndoorMap() {
  const [carPositions, setCarPositions] = useState(generateInitialPositions());

  useEffect(() => {
    const interval = setInterval(() => {
      setCarPositions((prev) =>
        prev.map((pos) => ({
          latitude: Math.min(LAT_CENTER + LAT_DELTA / 2, Math.max(LAT_CENTER - LAT_DELTA / 2, pos.latitude + (Math.random() - 0.5) * 0.0005)),
          longitude: Math.min(LNG_CENTER + LNG_DELTA / 2, Math.max(LNG_CENTER - LNG_DELTA / 2, pos.longitude + (Math.random() - 0.5) * 0.0005)),
        }))
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {/* Imagen de fondo simulando el plano */}
      <Image source={require('@/assets/images/mapa_universitat.jpg') } style={styles.mapImage} />

      {/* Capa superior: mapa invisible con marcadores */}
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: LAT_CENTER,
          longitude: LNG_CENTER,
          latitudeDelta: LAT_DELTA,
          longitudeDelta: LNG_DELTA,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
        pointerEvents="none" // hace el mapa completamente no interactivo
      >
        {carPositions.map((pos, i) => (
          <Marker
            key={i}
            coordinate={pos}
            anchor={{ x: 0.5, y: 0.5 }}
            tracksViewChanges={false}
          >
            <View
              style={{
                width: 20,
                height: 20,
                backgroundColor: colors[i % colors.length],
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#fff',
              }}
            />
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover',
  },
});