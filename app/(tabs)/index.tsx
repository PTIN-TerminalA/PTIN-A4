import {
  View,
  TouchableOpacity,
  useColorScheme,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import React, { useEffect, useState } from "react";
import { router, useRootNavigationState, useLocalSearchParams } from "expo-router";
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

import { RatingModal } from '@/components/RatingModal';
import { useAuth } from "@/hooks/useAuth";
import { useServiceContext } from "@/contexts/ServiceContext";
import { useTags } from "@/hooks/useTags";
import { set } from "date-fns";
import { SearchBar } from "@/components/MapSearchBar";

const localImage = require("@/assets/images/planol.png");

// const isLoggedIn = false; // ho haurem de canviar amb la logica d'autenticacio
const isLoggedIn = false; //Momentani per l'entry point cap al home (index) i no cap a profile
export function login() {
  router.replace("/(auth)"); // /(auth)
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

  const location =  useUserLocation(4000);
  const defaultLocation = {
    x: 0.21,
    y: 0.8
  };
  let userLocation = defaultLocation; // NOMÉS PER PROVES: comentar quan estiguem a la uni i es vulgui fer servir la ubicació real
  if (location.location !== null)  userLocation = location.location;
  userLocation = defaultLocation;
  const inversUserLocation = { x: userLocation.x, y: (1 - userLocation.y) }; // Invertim l'origen de coordenades per a que sigui compatible amb altres apis

  const { services, loading: servicesLoading } = useServiceContext();
  const { tags, loading: tagsLoading } = useTags();

  const {
    rideResponse,
    reservationMessage,
    nearestService,
    setRide,
    startRide,
    endRide,
    clearRideResponse,
  } = useRideRequest();

  const [rideStage, setRideStage] = useState<"select" | "preview" | "confirm" | "inside">("select");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [previewService, setPreviewService] = useState<Service | null>(null);
  const [confirmedService, setConfirmedService] = useState<Service | null>(null); 

  const [nearest, setNearestService] = useState<Service | null>(null); 
  
  const { tagId } = useNFCListener();
  const [car, setCar] = useState("");

  const { gate, destinationName, fromNotification } = useLocalSearchParams();
  const [triggeredFromNotification, setTriggeredFromNotification] = useState(false);

  /*useEffect(() => {
    // console.log("services: ", services);
    // console.log("El servicio: ", gate);
    // const fakeLocation = {
    //   x: 0.5, 
    //   y: 0.5
    // };
    // console.log("La ubicacion del usuario: ", userLocation);
    if (fromNotification === 'true' && destinationName && gate && userLocation && !triggeredFromNotification && services && services.length > 0 ) {
      // console.log("Iniciant reserva per notificació:", destinationName, gate);
      setTriggeredFromNotification(true);
      
      //Busca un servei amb el mateix nom
      const matchingService = services.find(s => s.name.toLowerCase() === (typeof gate === 'string' ? gate.toLowerCase() : ''));
      console.log("El servicio: ", matchingService);
      if (matchingService) {
        setSelectedService(matchingService);
        //setConfirmedService(matchingService);
        setRideStage("select");
        setRide(userLocation, matchingService.name);
        setModalVisible(true); 
      } else {
        console.warn("No s'ha trobat un servei coincident per:", destinationName);
      }
    }
  }, [fromNotification, destinationName, gate, services, userLocation, triggeredFromNotification]);*/

  const { token } = useAuth();
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  
  
  useEffect(() => {
    if (tagId) {
      console.log("Tag ID detected:", tagId);
      // cridem al back
    }}, [tagId]);

  useEffect(() => { // Quan fem la reserva guardem l'id del cotxe assignat
    if (rideResponse) {
      setCar(rideResponse.car_id); // Guardem l'id del cotxe assignat
      console.log("CAR és: ", rideResponse.car_id);
    }
  }, [rideResponse]);

  const carData = useCarLocation((rideStage == "confirm" || rideStage == "inside") ? car : null);
  const [lastCarPos, setLastCarPos] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [prevCarPos, setPrevCarPos] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  useEffect(() => {
    if (carData) {
      const currentPos = {
        x: carData.position.x,
        y: 1 - carData.position.y, 
      };

      setPrevCarPos(lastCarPos);
      setLastCarPos(currentPos);
    }
  }, [carData]);
  function calculateRotationAngle(prev: { x: number, y: number }, last: { x: number, y: number }) {
    const dx = last.x - prev.x;
    const dy = last.y - prev.y;

    const angleRadians = Math.atan2(dy, dx);
    const angleDegrees = angleRadians * (180 / Math.PI) + 90;

    return angleDegrees;
  }
  const rotation = (lastCarPos && prevCarPos) ? 
    calculateRotationAngle(prevCarPos, lastCarPos) : 0;
  const carState = carData?.state; // estats del cotxe: "stopped" o "moving"
  const carPos = carData
  ? {
      id: carData.car_id,
      x: lastCarPos?.x,
      y: lastCarPos?.y,
      rotation: rotation,
      visible: true,
    }
  : null;

  const [disabled, setDisabled] = useState(true); // Controla la usabilitat del botó per evitar confirmacions múltiples o prematures


  // El cotxe pot estar "stopped" no perquè ha finalitzat un trajecte donat
  // sinò que pot haver trobat un obstacle. Per tant, mirem si el punt on
  // s'ha aturat és el mateix o similar al punt on finalitza el seu trajecte.
  function sonPuntsSimilars(p1: { x: number, y: number }, p2: { x: number, y: number }): boolean {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const distancia = Math.sqrt(dx * dx + dy * dy);
    return distancia < 0.05; // Marge d'error trobat a les proves, es pot ajustar
  }
  useEffect(() => {
    if (rideStage === "confirm" && carState && carState === "stopped" && 
      nearest && sonPuntsSimilars(lastCarPos, { x: nearest.location_x, y: nearest.location_y })) {
      setDisabled(false); // Habilitem el botó quan el cotxe està aturat (esperant) perque l'usuari pugui confirmar que està a dins
      alert("El cotxe t'espera al punt de recollida.");

    } else if (rideStage === "inside" && carState && carState === "stopped" &&
      confirmedService && sonPuntsSimilars(lastCarPos, { x: confirmedService.location_x, y: confirmedService.location_y })) {
      endRide(); // Quan el cotxe està aturat i l'usuari està a dins, finalitzem la reserva
      setRatingModalVisible(true); // valorar ruta
      // Reiniciem els estats per a la propera reserva
      setDisabled(false);
      setRideStage("select");
      setConfirmedService(null);
      setPreviewService(null);
      setSelectedService(null);
      setNearestService(null);
      setCar("");
    }
  }, [carState]);

  // Gestió de la ruta i el temps estimat per a mostrar al mapa segons els estats
  const { origen, desti} = React.useMemo(() => {
    let origen = { x: 0.5066077922077928, y: 0.86 };
    let desti = { x: 0.5066077922077928, y: 0.86 };
    
    if (rideStage === "preview" && nearest && previewService) {
      origen = { x: nearest.location_x, y: nearest.location_y };
      desti = { x: previewService.location_x, y: previewService.location_y };
    } else if (rideStage === "confirm" && carData && nearest) {
      origen = { x: carData.position.x, y: (1-carData.position.y) }; // Per anular l'efecte de la inversió de coordenades de route.ts ja que carData té coordenades normals
      desti = { x: nearest.location_x, y: nearest.location_y };
    } else if (rideStage === "inside" && carData && confirmedService) {
      origen = { x: carData.position.x, y: (1-carData.position.y) };
      desti = { x: confirmedService.location_x, y: confirmedService.location_y };
    }

    return { origen, desti };
  }, [rideStage, nearest, previewService, carData, confirmedService]);

  const routeData = useRouteDestination(
    rideStage == "select" ? null : origen, 
    rideStage == "select" ? null : desti
  );

  // Gestió dels markers del mapa per veure origen i destí
  const markedServices: Service[] | null = (() => {
    if (rideStage === "preview") {
      return [nearest, previewService].filter((s): s is Service => Boolean(s));
    } else if (rideStage === "confirm") {
      return [nearest].filter((s): s is Service => Boolean(s));
    } else if (rideStage === "inside") {
      return [confirmedService].filter((s): s is Service => Boolean(s));
    }
    return null;
  })();

  const handlerScannerPress = () => {
    {
      /* TODO */
    }
    console.log("Scanner Pressed");
    router.push({
      pathname: "/flightInfo/scanBoardingPass",
    });
  };

  
  // useEffect(() => {
  //   if (!isLoggedIn && rootNavigationState?.key) {
  //     // no crec que sigui el millor approach
  //     login();
  //   }
  // }, [rootNavigationState?.key]);

  // Per canviar el previewservice de seguida i per tant el confirmedservice que cal per la reserva
  // useEffect(() => {
  //   if (rideStage === "preview") {
  //     console.log("nearest:", nearest);
  //     console.log("selectedService:", selectedService);
  //     console.log("previewService:", previewService);
  //   }
  // }, [rideStage, selectedService, previewService]);

  if (servicesLoading || tagsLoading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  if (!services) {
    return <ThemedText>Error loading services</ThemedText>;
  }
  //console.log("Rendering services:", services?.length); No cal mostrar tantes vegades el rendering services perquè omple el log d'això
  return (
    <ThemedView style={styles.container}>
      {reservationMessage && (
        <View style={styles.messageContainer}>
          <ThemedText>{reservationMessage}</ThemedText>
        </View>
      )}
      <SearchBar options={services} setSelected={setSelectedService} setVisible={setModalVisible}/>

      <MapaUni
        services={markedServices}
        onServicePress={(service) => {
          setSelectedService(service);
          setModalVisible(true);
        }}
        carPos={carPos}
        userLocation={(rideStage == "inside") ? null : userLocation}
        // no fa falta pintar ruta quan s'apropa el cotxe, només mostrem temps estimat
        routePoints={routeData?.route && (rideStage != "confirm" && rideStage != "select") ? routeData.route : []}     
      />

      {/* Mostrem el temps estimat si hi ha */}
      {routeData?.temps && (rideStage === "preview" || (rideStage === "confirm") || rideStage === "inside") && 
      (<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
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
      { !disabled && (<ThemedPressable // Botó només visible quan estigui habilitat
        onPress={() => {
          // console.log("PRESSED")
          if (rideStage === "select") {
            setModalVisible(true);
          } else if (rideStage === "preview") {
            setConfirmedService(previewService);
            setRideStage("confirm");

            if (previewService  && userLocation) {
              // Ocultem el botó 'Confirma que ets a dins' fins que el cotxe arribi al punt de recollida
              setDisabled(true);
              setRide(inversUserLocation, previewService.name);
            }
          } else if (rideStage === "confirm") {
            console.log("Has confirmat el viatge a:", confirmedService?.name);
            setRideStage("inside");
            setDisabled(true); // durant el viatge no es pot tornar a confirmar
            startRide();
          }
        }}
        disabled={disabled}
        type="button"
      >
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
          <Image 
            source={require('../../assets/images/Icons/car.png')} 
            style={{width: 40, height: 40, marginRight: 25, 
            tintColor: colorScheme == 'dark' ? Colors.dark.text : Colors.light.text}}/>
          {/* <ThemedText type="bold">Selecciona un destí</ThemedText> */}
          {rideStage === "select" && <ThemedText type="bold">Selecciona un destí</ThemedText>}
          {rideStage === "preview" && <ThemedText type="bold">Confirma el viatge</ThemedText>}
          {rideStage === "confirm" && <ThemedText type="bold">Confirma que ets a dins</ThemedText>}
          </View>
      </ThemedPressable>)}
      
      {/* Modal de valoració */}
      <RatingModal
        visible={ratingModalVisible}
        onClose={() => {
          setRatingModalVisible(false);
          clearRideResponse(); // netegem la resposta de la reserva
        }}
        token={token? token : ""}
        scheduledTime={rideResponse?.reservation?.scheduled_time ?? ""}
      />

      {/* Modal personalizado */}
      <InfoModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={async () => {
          try {
            if ((rideStage === "select" || rideStage === "preview") && userLocation) {
              const { nearest_service_id } = await nearestService(inversUserLocation);
              const nearest_service = services?.find((service: Service) => service.id === nearest_service_id) ?? null;
              setNearestService(nearest_service);
              setPreviewService(selectedService);
              Promise.resolve().then(() => setRideStage("preview")); //Per que s'esperi a l'assignació de nearest i selected                     
            }
          } catch (error) {
            console.error("Error al seleccionar servei: ", error);
          } finally {
            setModalVisible(false);
            setDisabled(false);
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
    backgroundColor: "white",
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
