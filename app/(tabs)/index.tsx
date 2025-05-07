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
import { ThemedView } from "@/components/ThemedView";
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
  const carLocation = useCarLocation();
  const ride = useRideRequest();

  const handlerScannerPress = () => {
    {
      /* TODO */
    }
    console.log("Scanner Pressed");
    router.push({
      pathname: "/flightInfo/scanBoardingPass",
    });
  };

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
      />
      
      {/* Botó per escannejar */}
      <TouchableOpacity
        style={[styles.scannButton, { backgroundColor: buttonColor }]}
        onPress={handlerScannerPress}
      >
        <Image source={buttonIcon} style={[styles.scannIconButton]}></Image>
      </TouchableOpacity>

      {/* Botón que abre el modal */}
      <ThemedPressable onPress={() => setModalVisible(true)} type="button">
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
          <Image 
            source={require('../../assets/images/Icons/car.png')} 
            style={{width: 40, height: 40, marginRight: 25, 
            tintColor: useColorScheme() == 'dark' ? Colors.dark.text : Colors.light.text}}/>
          <ThemedText type="bold">Selecciona un destí</ThemedText>
          </View>
      </ThemedPressable>

      {/* Modal personalizado */}
      <InfoModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={() => {
          console.log("Has seleccionat:", selectedService?.name);
          if (selectedService && userLocation) {
            ride.requestRide(selectedService, userLocation);
          }
          setModalVisible(false);
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
