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
  const {location: userLocation} =  useUserLocation(4000);
  if (userLocation?.y === 0.8879929798169748) {
    userLocation.y = 0.86;
    userLocation.x = 0.3066077922077928
  }
  const { services, loading: servicesLoading } = useServiceContext();
  const { tags, loading: tagsLoading } = useTags();

  const {
    rideResponse,
    reservationMessage,
    nearestService,
    setRide,
    
  } = useRideRequest();

  const [rideStage, setRideStage] = useState<"select" | "preview" | "confirm" | "inside">("select");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [previewService, setPreviewService] = useState<Service | null>(null);
  const [confirmedService, setConfirmedService] = useState<Service | null>(null); 
  // const [startingTrip, setStartingTrip] = useState(false);
  const [nearest, setNearestService] = useState<Service | null>(null); 
  
  const { tagId } = useNFCListener();
  const [car, setCar] = useState("");

  const { gate, destinationName, fromNotification } = useLocalSearchParams();
  const [triggeredFromNotification, setTriggeredFromNotification] = useState(false);

  useEffect(() => {
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
  }, [fromNotification, destinationName, gate, services, userLocation, triggeredFromNotification]);

  const { token } = useAuth();
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  
  
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
      console.log("CAR és: ", rideResponse.car_id);
    }
  }, [rideResponse]);

  const carData = useCarLocation(car);
  if(carData) console.log("carData: ", carData);
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
  
  // Enable button in select and preview stages
  useEffect(() => {
    if (rideStage != "inside") {
      setDisabled(false);
    }
  }, [rideStage]);

  useEffect(() => {
    if (carState && carState === "Esperant") {
      setDisabled(false); // Habilitem el botó quan el cotxe està esperant perque l'usuari pugui confirmar que està a dins
      alert("El cotxe t'espera al punt de recollida.");
    } else if (carState && carState === "Disponible") { // El cotxe està disponible per a un nou viatge PERQUÈ JA HEM ARRIBAT AL NOSTRE DESTÍ
      // LEO -> mostrat missatge de confirmació que hem arribat al destí
      setRatingModalVisible(true); // valorar ruta
      setDisabled(false); // Tornem a habilitar el botó per a que l'usuari pugui seleccionar un nou destí
    }
  }, [carState]);

  // Gestió de la ruta i el temps estimat per a mostrar al mapa segons els estats
  const [origen, setOrigen] = useState({ x: -1, y: 0.86 });
  const [desti, setDesti] = useState({ x: 0.5066077922077928, y: 0.86 });
  
  // useEffect(() => {
  //   if (rideStage === "preview" && nearest && previewService) {
  //     console.log("S'HA CANVIAT --------")
  //     setOrigen({ x: nearest.location_x, y: nearest.location_y });
  //     setDesti({ x: previewService.location_x, y: previewService.location_y });
  //   } else if (rideStage === "confirm" && carData && nearest) {
  //     setOrigen({ x: carData.position.x, y: carData.position.y });
  //     setDesti({ x: nearest.location_x, y: nearest.location_y });
  //   } else if (rideStage === "inside" && carData && confirmedService) {
  //     setOrigen({ x: carData.position.x, y: carData.position.y });
  //     setDesti({ x: confirmedService.location_x, y: confirmedService.location_y });
  //   }
  // }, [rideStage, nearest, previewService, carData, confirmedService]);

  useEffect(() => {
    console.log("[DEBUG] rideStage:", rideStage);
    console.log("[DEBUG] nearest:", nearest?.name);
    console.log("[DEBUG] previewService:", previewService?.name);
  }, [rideStage, nearest, previewService]);

  useEffect(() => {
    if (
      rideStage === "preview" &&
      nearest &&
      previewService
    ) {
      console.log("Canvien origen i destí i s'obté la ruta amb useRouteDestination");
      setOrigen({ x: nearest.location_x, y: nearest.location_y });
      setDesti({ x: previewService.location_x, y: previewService.location_y });
    }
  }, [rideStage, nearest, previewService]);  

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

      <MapaUni
        services={services}
        onServicePress={(service) => {
          setSelectedService(service);
          setModalVisible(true);
        }}
        carPos={carPos}
        userLocation={userLocation}
        // no fa falta pintar ruta quan s'apropa el cotxe, només mostrem temps estimat
        routePoints={routeData?.route && (rideStage != "confirm" && rideStage != "select") ? routeData.route : []}
        // Mostrem la ruta només quan estem en select o confirm
        // routePoints={(rideStage === "select" || rideStage === "confirm") ? routeData.route : []} 
        // Mostrem la ruta sempre que tinguem routeData
        // routePoints={routeData.route ? routeData.route : []} 
        // routePoints={routeData.route && (rideStage != "confirm" || rideStage === "select") ? routeData.route : []}
                
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
          console.log("PRESSED")
          if (rideStage === "select") {
            setModalVisible(true);
            // Only calculate route when ThemedPressable is pressed in select stage
            // const newRouteData = useRouteDestination(origen, desti);
            // setRouteData(newRouteData);
          } else if (rideStage === "preview") {
            console.log("Already on preview")
            setConfirmedService(previewService);
            setRideStage("confirm");
            console.log("BEFORE_BOOKING:", confirmedService, "PREVIEW_SERVICE", previewService);
            console.log("BEFORE_BOOKING:", userLocation);
            if (previewService  && userLocation) {
              console.log("UserLocation:", userLocation);
              console.log("ConfirmedServiceName:", previewService.name)
              setRide(userLocation, previewService.name)
            }
            // Ocultem el botó 'Confirma que ets a dins' fins que el cotxe arribi al punt de recollida
            setDisabled(true); 
          } else if (rideStage === "confirm") {
            console.log("Has confirmat el viatge a:", confirmedService?.name);
            setRideStage("inside");
            setDisabled(true); // durant el viatge no es pot tornar a confirmar
            // ride.startRide();
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
          {rideStage === "inside" && <ThemedText type="bold">Confirma que ets a dins</ThemedText>}
          </View>
      </ThemedPressable>
      
      {/* Modal de valoració */}
      <RatingModal
        visible={ratingModalVisible}
        onClose={() => setRatingModalVisible(false)}
        token={token? token : ""}
        scheduledTime={rideResponse?.data?.scheduled_time ?? ""}
      />

      {/* Modal personalizado */}
      <InfoModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={async () => {
          try {
            if (rideStage === "select" && userLocation) {
              const { nearest_service_id } = await nearestService(userLocation);
              const nearest_service = services?.find((service: Service) => service.id === nearest_service_id) ?? null;
              setNearestService(nearest_service);
              setPreviewService(selectedService);
              Promise.resolve().then(() => setRideStage("preview")); //Per que s'esperi a l'assignació de nearest i selected
              console.log("Nearest service:", nearest_service?.name, " amb posicions: ", nearest_service?.location_x, nearest_service?.location_y);
              console.log("Has seleccionat:", selectedService?.name, " amb posicions: ", selectedService?.location_x, selectedService?.location_y);                       
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
