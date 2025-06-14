import {
  View,
  TouchableOpacity,
  useColorScheme,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import React, { useEffect, useState } from "react";
import { router, useRootNavigationState } from "expo-router";
import { useUserLocation } from "@/hooks/useUserLocation";
import { Colors } from "@/constants/Colors";
import { ThemedPressable } from "@/components/ThemedPressable";
import { InfoModal } from "@/components/InfoModal";
import MapaUni from "@/components/MapaUni";
import { useServices } from "@/hooks/useServices";
import { Service } from "@/constants/mocks/mockTypes";
import { useCarLocation } from "@/hooks/useCarLocation";
import { useRideRequest } from "@/hooks/useRideRequest";
import { useRouteDestination } from "@/hooks/useRouteDestination"; //fake route
import { ThemedView } from "@/components/ThemedView";
import { useNFCListener } from "@/hooks/useNFCListener";
import { getRoutePoints } from "@/api/route";

const localImage = require("@/assets/images/planol.png");

// const isLoggedIn = false; // ho haurem de canviar amb la logica d'autenticacio
const isLoggedIn = true; //Momentani per l'entry point cap al home (index) i no cap a profile
export function login() {
  router.replace("/(auth)/login");
}

export default function HomeScreen() {
  const rootNavigationState = useRootNavigationState();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const buttonColor = isDarkMode ? Colors.secundari : Colors.primari;
  const buttonIcon = isDarkMode
    ? require("@/assets/images/Icons/scanner_DarkMode.png")
    : require("@/assets/images/Icons/scanner_LightMode.png");
  const { height } = Dimensions.get("window");
  const [modalVisible, setModalVisible] = useState(false);
  const {location: userLocation} =  useUserLocation(4000);
  const { services } = useServices();

  const ride = useRideRequest();
  const { rideResponse } = useRideRequest();
  const {reservationMessage} = ride;

  const [rideStage, setRideStage] = useState<"select" | "preview" | "confirm" | "inside">("select");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [previewService, setPreviewService] = useState<Service | null>(null);
  const [confirmedService, setConfirmedService] = useState<Service | null>(null); 
  // const [startingTrip, setStartingTrip] = useState(false);
  const [nearestService, setNearestService] = useState<Service | null>(null); 
  
  const { tagId } = useNFCListener();
  const [car, setCar] = useState("");
  
  
  useEffect(() => {
    if (tagId) {
      console.log("Tag ID detected:", tagId);
      // cridem al back
    }}, [tagId]);

  useEffect(() => {
    if (reservationMessage) {
      alert(reservationMessage);
    }
  }, [reservationMessage]);

  useEffect(() => { // Quan fem la reserva guardem l'id del cotxe assignat
    if (rideResponse) {
      setCar(rideResponse.car_id);
    }
  }, [rideResponse]);

  const carData = useCarLocation(car);
  const carState = carData?.state; // estats del cotxe: "Solicitat", "En curs", "Esperant", "Disponible"
  const carPos = carData // ubicació del cotxe
  ? {
      id: carData?.car_id,
      x: carData?.position.x,
      y: carData?.position.y,
      rotation: 0, // o el valor real si ho tenim
      visible: true // o alguna lògica per mostrar/ocultar
    }
  : null;

  const [disabled, setDisabled] = useState(true); // Controla la usabilitat del botó per evitar confirmacions múltiples o prematures
  useEffect(() => {
    if (carState && carState === "Esperant") {
      setDisabled(false); // Habilitem el botó quan el cotxe està esperant perque l'usuari pugui confirmar que està a dins
      alert("El cotxe t'espera al punt de recollida.");
    } else if (carState && carState === "Disponible") { // El cotxe està disponible per a un nou viatge PERQUÈ JA HEM ARRIBAT AL NOSTRE DESTÍ
      // LEO -> mostrat missatge de confirmació que hem arribat al destí
      // MARICARMEN -> avaluar servei de Flysy
      setDisabled(false); // Tornem a habilitar el botó per a que l'usuari pugui seleccionar un nou destí
    }
  }, [carState]);

  // Gestió de la ruta i el temps estimat per a mostrar al mapa segons els estats
  let origen = {
    x: 0, 
    y: 0
  }
  let desti = {
    x: 0,
    y: 0
  }
  if (rideStage === "preview" && nearestService && previewService) {
    origen = {x: nearestService.x, y: nearestService.y};
    desti = {x: previewService.x, y: previewService.y};
  } else if (rideStage === "confirm" && carData && nearestService) {
    origen = { x: carData.position.x, y: carData.position.y };
    desti = { x: nearestService.x, y: nearestService.y };
  } else if (rideStage === "inside" && carData && confirmedService) {
    origen = { x: carData.position.x, y: carData.position.y };
    desti = { x: confirmedService.x, y: confirmedService.y };
  }
  const routeData = useRouteDestination(origen, desti);

  const handlerScannerPress = () => {
    {
      /* TODO */
    }
    console.log("Scanner Pressed");
    router.push({
      pathname: "/flightInfo/scanBoardingPass",
    });
  };

  /*
  useEffect(() => {
    if (!isLoggedIn && rootNavigationState?.key) {
      // no crec que sigui el millor approach
      login();
    }
  }, [rootNavigationState?.key]);
  */

  return (
    <ThemedView style={styles.container}>
      {reservationMessage && (
        <View style={styles.messageContainer}>
          <ThemedText>{reservationMessage}</ThemedText>
        </View>
      )}

      <MapaUni
        services={services}
        onServicePress={(service) => {
          setSelectedService(service);
          setModalVisible(true);
        }}
        carPos={carPos}
        userLocation={userLocation}
        // no fa falta pintar ruta quan s'apropa el cotxe, només mostrem temps estimat
        routePoints={routeData.route && rideStage != "confirm" ? routeData.route : []} 
      />

      {/* Mostrem el temps estimat si hi ha */}
      {routeData?.temps && (<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
          <ThemedText>
            {routeData.temps}
          </ThemedText>
      </View>)}

      {/* Botó per escannejar */}
      <TouchableOpacity
        style={[styles.scannButton, { backgroundColor: buttonColor }]}
        onPress={handlerScannerPress}
      >
        <Image source={buttonIcon} style={[styles.scannIconButton]}></Image>
      </TouchableOpacity>

      {/* Botón que abre el modal */}
      <ThemedPressable
        onPress={() => {
          if (rideStage === "select") {
            setModalVisible(true);
          } else if (rideStage === "preview") {
            setConfirmedService(previewService);
            setRideStage("confirm");
            if (confirmedService  && userLocation) {
              ride.setRide(userLocation, confirmedService.name)
            }
            // Ocultem el botó 'Confirma que ets a dins' fins que el cotxe arribi al punt de recollida
            setDisabled(true); 
          } else if (rideStage === "confirm") {
            console.log("Has confirmat el viatge a:", confirmedService?.name);
            setRideStage("inside");
            setDisabled(true); // durant el viatge no es pot tornar a confirmar
            // LEO -> /inicia-trajecte(token, coord. de servei seleccionat) > message, car_id, destinacio
          }
        }}
        disabled={disabled}
        type="button"
      >
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
          <Image 
            source={require('../../assets/images/Icons/car.png')} 
            style={{width: 40, height: 40, marginRight: 25, 
            tintColor: useColorScheme() == 'dark' ? Colors.dark.text : Colors.light.text}}/>
          {/* <ThemedText type="bold">Selecciona un destí</ThemedText> */}
          {rideStage === "select" && <ThemedText type="bold">Selecciona un destí</ThemedText>}
          {rideStage === "preview" && <ThemedText type="bold">Confirma el viatge</ThemedText>}
          {rideStage === "inside" && <ThemedText type="bold">Confirma que ets a dins</ThemedText>}
          </View>
      </ThemedPressable>



      {/* Modal personalizado */}
      <InfoModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={async () => {
          try {
            if (rideStage === "select" && userLocation) {
              const nearest_service_id = await ride.nearestService(userLocation);
              const nearest_service = services?.find((service: Service) => service.id === nearest_service_id) ?? null;
              setNearestService(nearest_service);
              setPreviewService(selectedService);
              setRideStage("preview");
              console.log("Has seleccionat:", selectedService?.name);
              /*const fakeUserLocation = {
                x: 0.5, // coordenada X
                y: 0.5   // coordenada Y
              };*/                
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
        description={selectedService?.description || "Primer selecciona un destí dins la terminal A"}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  contentContainer: {
    flexGrow: 1,
  },

  scannButton: {
    width: 55,
    height: 55,
    position: "absolute",
    bottom: 70,
    right: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  scannIconButton: {
    width: 40,
    height: 40,
  },
  messageContainer: {
    position: "absolute",
    bottom: 140,
    left: 20,
    right: 20,
    backgroundColor: "#4CAF50", // Green for success
    padding: 10,
    borderRadius: 10,
  },
  messageText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
