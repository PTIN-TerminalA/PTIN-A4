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
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  //Una nou estat pel servei al que sí volem anar i no seleccionem i prou.
  //Pel cas d'un viatge on demanem cap a un destí i abans de confirmar mirem 
  // un altre servei (canvia el selectedservice però no volem que ho faci el confirmedservice)
  const [confirmedService, setConfirmedService] = useState<Service | null>(null); 
  const [startingTrip, setStartingTrip] = useState(false);
  const ride = useRideRequest();
  const [rideStage, setRideStage] = useState<"select" | "confirm" | "inside">("select");
  const { tagId } = useNFCListener();
  const [car, setCar] = useState("");

  useEffect(() => {
    if (tagId) {
      console.log("Tag ID detected:", tagId);
      // cridem al back
    }}, [tagId]);

  const handlerScannerPress = () => {
    {
      /* TODO */
    }
    console.log("Scanner Pressed");
    router.push({
      pathname: "/flightInfo/scanBoardingPass",
    });
  };
  
  const routePoints = useRouteDestination( //fake route
     userLocation ?? null,
     confirmedService ? { x: confirmedService.x, y: confirmedService.y } : null,
  );
  
  // const carLocation = useCarLocation(); //Usamos la asignació de abajo para que la imagen del coche vaya hasta el destino.
  const carLocation = useCarLocation(routePoints, startingTrip);

  useEffect(() => {
    if (!isLoggedIn && rootNavigationState?.key) {
      // no crec que sigui el millor approach
      login();
    }
  }, [rootNavigationState?.key]);

  return (
    <ThemedView style={styles.container}>
      <MapaUni
        services={services}
        onServicePress={(service) => {
          setSelectedService(service);
          setModalVisible(true);
        }}
        carPos={carLocation.location}
        userLocation={userLocation}
        routePoints={routePoints ?? []} //fake route

      />
      
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
          } else if (rideStage === "confirm") {
            console.log("Has confirmat el viatge a:", confirmedService?.name);
            setRideStage("inside");
            // CAMBIAMOS EL COCHE A ESTADO SOLICITADO
            // PUT /cotxe/{cotxe_id}/solicitat ----------
          } else if (rideStage === "inside") {
            console.log("Ets a dins del vehicle cap a:", confirmedService?.name);
            console.log("Començant viatge");
            setStartingTrip(true);
            if (confirmedService  && userLocation) {
              //CAMBIA EL ESTADO DEL COCHE A en curs
              // PUT /cotxe/{cotxe_id}/en_curs ------------
              ride.setRide(userLocation, confirmedService.name);
              // CAMBIA EL ESTADO DEL COCHE A DISPONIBLE DESPUÉS DE 30 SEGUNDOS PORQUE ENTENDEMOS QUE HA LLEGADO YA AL DESTINO
              // PUT /cotxe/{cotxe_id}/disponible
            }
            setRideStage("select");
            // setConfirmedService(null);
            setSelectedService(null);
          }
        }}
        type="button"
      >
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
          <Image 
            source={require('../../assets/images/Icons/car.png')} 
            style={{width: 40, height: 40, marginRight: 25, 
            tintColor: useColorScheme() == 'dark' ? Colors.dark.text : Colors.light.text}}/>
          {/* <ThemedText type="bold">Selecciona un destí</ThemedText> */}
          {rideStage === "select" && <ThemedText type="bold">Selecciona un destí</ThemedText>}
          {rideStage === "confirm" && <ThemedText type="bold">Confirma el viatge</ThemedText>}
          {rideStage === "inside" && <ThemedText type="bold">Confirma que ets a dins</ThemedText>}
          </View>
      </ThemedPressable>

      {/* Modal personalizado */}
      <InfoModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={async () => {
          try {
            if (rideStage === "select") {
              setConfirmedService(selectedService); // confirmamos este como destino real
              setStartingTrip(false); 
              console.log("Has seleccionat:", selectedService?.name);
              setRideStage("confirm");
              //HACER EL MUESTREO DE RUTA
              console.log("MOSTRAR RUTA 1") //Es lo mismo que mostrar ruta 2, solo un log para saber que aquí se tiene que mostrar ya que es antes de confirmar
              //RESERVA EL COCHE
                // Si hi havia un cotxe reservat es cancela i torna a posar a disponible
                
                if(car !== "") {
                  console.log("Torna a estar disponible el cotxe: ", car)
                  // PUT /cotxe/{cotxe_id}/disponible ----------
                  await ride.releaseRide(car);
                  setCar("");
                } 
                // POST /api/getNearestService -----------
                // if (!userLocation) { PARA PONER USERLOCATION Y NO LA FAKE. PONGO LA FAKE PQ A MI (LEO) LA USERLOCATION NO ME FUNCIONA, A JOEL SI
                //   console.error("Ubicació de l'usuari no disponible");
                //   return;
                // }
                const fakeUserLocation = {
                  x: 0.5, // coordenada X
                  y: 0.5   // coordenada Y
                };
                // const nearest = await ride.nearestService(fakeUserLocation);
                // const nearestServiceId = nearest?.nearest_service_id;

                // if (!nearestServiceId) {
                //   console.error("No s'ha pogut obtenir el servei més proper");
                //   return;
                // }
                // // GET /api/getServices -----------
                // const allServices = await ride.services();
                // // Miramos el nombre del servicio con el id que hemos obtenido en getNearestService
                // const serviceFound = allServices.find(
                //   (service: Service) => service.id === nearestServiceId
                // );
                // if (!serviceFound) {
                //   console.error("No s'ha trobat el servei amb id:", nearestServiceId);
                //   return;
                // }
                // POST /reserves/usuari ---------------
                if(!confirmedService) {
                  console.error("No s'ha trobat el servei destí:");
                  return;
                }
                ride.setRide(fakeUserLocation, confirmedService.name);
            }
            else if (rideStage === "confirm" || rideStage === "inside") {
              if (selectedService?.id !== confirmedService?.id) {
                console.log("Has seleccionat:", selectedService?.name);
                setConfirmedService(selectedService);
                setRideStage("confirm");
                //HACER EL MUESTREO DE RUTA
                console.log("MOSTRAR RUTA 2")
                //RESERVA EL COCHE
                // Si hi havia un cotxe reservat es cancela i torna a posar a disponible
                
                if(car !== "") {
                  console.log("Torna a estar disponible el cotxe: ", car)
                  // PUT /cotxe/{cotxe_id}/disponible ----------
                  await ride.releaseRide(car);
                  setCar("");
                } 
                // // POST /api/getNearestService -----------
                // // if (!userLocation) { PARA PONER USERLOCATION Y NO LA FAKE. PONGO LA FAKE PQ A MI (LEO) LA USERLOCATION NO ME FUNCIONA, A JOEL SI
                // //   console.error("Ubicació de l'usuari no disponible");
                // //   return;
                // // }
                const fakeUserLocation = {
                  x: 0.5, // coordenada X
                  y: 0.5   // coordenada Y
                };
                // const nearest = await ride.nearestService(fakeUserLocation);
                // const nearestServiceId = nearest?.nearest_service_id;

                // if (!nearestServiceId) {
                //   console.error("No s'ha pogut obtenir el servei més proper");
                //   return;
                // }
                // // GET /api/getServices -----------
                // const allServices = await ride.services();
                // // Miramos el nombre del servicio con el id que hemos obtenido en getNearestService
                // const serviceFound = allServices.find(
                //   (service: Service) => service.id === nearestServiceId
                // );
                // if (!serviceFound) {
                //   console.error("No s'ha trobat el servei amb id:", nearestServiceId);
                //   return;
                // }
                // if(!confirmedService) {
                //   console.error("No hi ha un servei de destí");
                //   return;
                // }
                // // POST /reserves/usuari ---------------
                if(!selectedService) {
                  console.error("No s'ha trobat el servei destí:");
                  return;
                }
                await ride.setRide(fakeUserLocation, selectedService.name);
              }
            }
          } catch (error) {
            console.error("Error al seleccionar servei: ", error);
          } finally {
            setModalVisible(false);
          }
        }}
        
        /** Si no s'ha seleccionat un destí el modal canvia */
        imageUrl={selectedService?.ad_path || localImage}
        title={selectedService?.name || "Demana un cotxe"}
        minutesText={selectedService == null ? "" : "2 min"} // Opcional, si ho calcules
        distanceText={selectedService == null ? "" : "500 m"} // Opcional, si ho calcules
        buttonText="Demanar cotxe"
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
});
