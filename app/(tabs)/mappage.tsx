import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Modal from "react-native-modal";
import { Button } from "react-native-paper";
import React, { useState } from "react";
import {
  StyleSheet,
  Dimensions,
  Image,
  Pressable,
  View,
  Text,
} from "react-native";
import Animated from "react-native-reanimated";
import { useCanvasGestures } from "@/hooks/useCanvasGestures";
import { GestureDetector } from "react-native-gesture-handler";
import Svg, { Polygon } from "react-native-svg";
import { zones } from "@/constants/mocks/zones";
import { normalizeRotatedZones } from "@/hooks/useNormalizedZones";
import AutocompleteSearch from "./five";
import { Service } from "@/constants/mocks/mockTypes";
import { useRideRequest } from "@/hooks/useRideRequest";
import { useNFCListener } from "@/hooks/useNFCListener";
import { InfoModal } from "@/components/InfoModal";
import { useUserLocation } from "@/hooks/useUserLocation";
import { useServiceContext } from "@/contexts/ServiceContext";
import { useCarLocation } from "@/hooks/useCarLocation";
import UserMarker from "@/components/UserMarker";
import CarMarker from "@/components/CarMarker";
import { Colors } from "@/constants/Colors";

const localImage = require("@/assets/images/planol.png");

export default function MapPage() {
  const {
    rideResponse,
    reservationMessage,
    nearestService,
    setRide,
    startRide,
  } = useRideRequest();
  const [car, setCar] = useState("");
  const mapImage = require("@/assets/images/planol.png");
  const { gesture, animatedStyle, isPanning, zoomTo } = useCanvasGestures();
  const [modalVisible, setModalVisible] = useState(false);
  const normalizedZones = normalizeRotatedZones(zones);
  const constant = 0.1;
  const imageWidth = 600 * constant;
  const imageHeight = 400 * constant;
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [confirmedService, setConfirmedService] = useState<Service | null>(
    null
  );
  const [nearest, setNearestService] = useState<Service | null>(null);
  const [rideStage, setRideStage] = useState<
    "select" | "preview" | "confirm" | "inside"
  >("select");
  const { services, loading: servicesLoading } = useServiceContext();
  const { location: userLocation } = useUserLocation(4000);
  const ride = useRideRequest();
  const carData = useCarLocation(
    rideStage == "confirm" || rideStage == "inside" ? car : null
  );
  const carState = carData?.state; // estats del cotxe: "stopped" o "moving"
  const carPos = carData // ubicació del cotxe
    ? {
        id: carData?.car_id,
        x: carData?.position.x,
        y: 1 - carData?.position.y,
        rotation: 0, // o el valor real si ho tenim
        visible: true, // o alguna lògica per mostrar/ocultar
      }
    : null;
  const { tagId } = useNFCListener();
  const [startingTrip, setStartingTrip] = useState(false);
  const screen = Dimensions.get("window");
  const [previewService, setPreviewService] = useState<Service | null>(null);

  // Scale to fit vertically
  //const scale = screen.height / imageHeight;
  const scale = 6.8;
  const displayedWidth = imageWidth * scale;
  // Define the Zone type above the component
  type Zone = {
    name: string;
    positions: [number, number][];
  };

  const getZoneCenter = (zone: any): [number, number] => {
    const sum = zone.positions.reduce(
      ([accX, accY]: [number, number], [x, y]: [number, number]) => [
        accX + x,
        accY + y,
      ],
      [0, 0]
    );
    const len = zone.positions.length;
    return [sum[0] / len, sum[1] / len];
  };
  console.log(userLocation, "User Location");
  return (
    <>
      <AutocompleteSearch
        options={services?.map((s) => s.name) || []}
        setModalVisible={setModalVisible}
        setService={(name: string) => {
          // busca el Service amb aquest nom
          const svc =
            services?.find(
              (s) => s.name.toLowerCase() === name.toLowerCase()
            ) ?? null;
          setSelectedService(svc);
        }}
      />
      <Button
        style={{
          marginTop: 200,
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1000,
        }}
        onPress={() => {
          console.log("Button Pressed");
          const zoneName = "Nike";
          const zone = normalizedZones.find((z) => z.name === zoneName);
          const [x, y] = zone.positions[0];
          const x1 = x * displayedWidth;
          const y1 = y * imageHeight * scale;
          console.log("Zone found:", zone, x1, y1);
          const x2 = x1 * 2 * 0.68;
          const y2 = y1 * 2 * 0.68;
          const midx = (600 * 0.68) / 2;
          const midy = (400 * 0.68) / 2;
          const x3 = x1 < midx ? x1 + 600 * 0.68 : -(x1 + 600 * 0.68);
          const y3 = y1 < midy ? y1 + 400 * 0.68 : -(y1 + 400 * 0.68);
          //const [x, y] = getZoneCenter(zone);
          console.log("Center coordinates:", x3, y3);
          console.log("Image dimensions:", imageWidth, imageHeight);
          console.log("Scale factor:", scale);
          zoomTo(x3, y3, 3);
        }}
      >
        <Text>Zoom</Text>
      </Button>
      {modalVisible && (
        <View>
          <Pressable
            style={styles.overlay}
            onPress={() => {
              setModalVisible(false);
            }}
          />
          <InfoModal
            isVisible={modalVisible}
            onClose={() => setModalVisible(false)}
            onSelect={async () => {
              try {
                if (
                  (rideStage === "select" || rideStage === "preview") &&
                  userLocation
                ) {
                  const { nearest_service_id } =
                    await nearestService(userLocation);
                  const nearest_service =
                    services?.find(
                      (service: Service) => service.id === nearest_service_id
                    ) ?? null;
                  setNearestService(nearest_service);
                  setPreviewService(selectedService);
                  Promise.resolve().then(() => setRideStage("preview")); //Per que s'esperi a l'assignació de nearest i selected
                }
              } catch (error) {
                console.error("Error al seleccionar servei: ", error);
              } finally {
                setModalVisible(false);
              }
            }}
            /** Si no s'ha seleccionat un destí el modal canvia */
            imageUrl={selectedService?.ad_path || localImage}
            title={selectedService?.name || "Demana un cotxe"} // Previsualitza ruta nou nom
            minutesText={selectedService == null ? "" : "2min"} // Opcional, si ho calcules    ride.time
            distanceText={selectedService == null ? "" : "500 m"} // Opcional, si ho calcules
            buttonText="Previsualitza ruta"
            description={
              selectedService?.description ||
              "Primer selecciona un destí dins la terminal A"
            }
          />
        </View>
      )}
      <ThemedView
        style={{
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        <GestureDetector gesture={gesture}>
          <View style={{ overflow: "hidden" }}>
            <Animated.View
              style={[
                {
                  backgroundColor: "white",
                  alignItems: "center",
                  justifyContent: "center",
                },
                animatedStyle, // conté translateX, translateY
              ]}
            >
              <View
                style={{
                  justifyContent: "center",

                  flex: 1,
                }}
                pointerEvents="box-none"
              >
                <Image
                  source={mapImage}
                  style={{
                    width: 600 * 0.68,
                    height: 400 * 0.68,
                    resizeMode: "cover",
                  }}
                />
                {userLocation && (
                  <View
                    style={{
                      left: userLocation.x * 600 * 0.68 - 12 / 2,
                      top: -400 * 0.68 + userLocation.y * 400 * 0.68 - 12 / 2,
                      width: 12,
                      height: 12,
                      borderRadius: 12 / 2,
                      backgroundColor: Colors.basic,
                      borderColor: Colors.primari,
                      borderWidth: 2,
                    }}
                  ></View>
                )}

                {carPos && carPos.visible && (
                  // console.log("car: ", carPos),

                  <Pressable
                    onPress={() => console.log("Cotxe clicat")}
                    style={{
                      left: carPos.x * 600 * 0.68,
                      top: -400 * 0.68 + carPos.y * 400 * 0.68,
                      transform: [{ rotate: `${carPos.rotation ?? 0}deg` }],
                    }}
                  >
                    <Image
                      source={require("@/assets/images/Icons/carIcon.png")} // <-- Aquesta hauria de ser la icona del cotxe
                      resizeMode="contain"
                    />
                  </Pressable>
                )}
                <Svg
                  width={600 * 0.68}
                  height={400 * 0.68}
                  style={{
                    position: "absolute",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {normalizedZones.map((zone, idx) => {
                    const pointsStr = zone.positions
                      .map(
                        ([x, y]) =>
                          `${x * displayedWidth},${y * imageHeight * scale}`
                      )
                      .join(" ");

                    return (
                      <Polygon
                        key={idx}
                        points={pointsStr}
                        fill="none"
                        stroke="none"
                        strokeWidth={1}
                        onPressIn={() => {
                          setTimeout(() => {
                            if (!isPanning.value) {
                              // busca si zonee esta a services
                              // Versió segura i senzilla
                              const service =
                                services?.find(
                                  (s) =>
                                    s.name.toLowerCase() ===
                                    zone.name.toLowerCase()
                                ) ?? null;
                              console.log("Service found:", service);
                              setSelectedService(service);

                              setModalVisible(true);
                              console.log("Polygon pressed:", zone.name);
                            }
                          }, 100);
                        }}
                      />
                    );
                  })}
                </Svg>
              </View>
            </Animated.View>
          </View>
        </GestureDetector>

        {/* Modal */}
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
    zIndex: 1001,
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 1000,
  },
});
