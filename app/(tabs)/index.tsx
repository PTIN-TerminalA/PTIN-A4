import {View,TouchableOpacity, ScrollView, useColorScheme, Image, StyleSheet, Dimensions} from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useEffect, useState } from "react";
import { router, useRootNavigationState } from "expo-router";

import { Colors } from "@/constants/Colors"
import { ThemedPressable } from "@/components/ThemedPressable";
import { InfoModal } from "@/components/InfoModal";
import MapaUni from "@/components/MapaUni";

const localImage = require("@/assets/images/mapa_universitat_v2.jpg");

// const isLoggedIn = false; // ho haurem de canviar amb la logica d'autenticacio
const isLoggedIn = true; //Momentani per l'entry point cap al home (index) i no cap a profile 
export function login() {
  router.replace("/(auth)/login");
}

export default function HomeScreen() {
  const rootNavigationState = useRootNavigationState();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const buttonColor = isDarkMode ? Colors.secundari : Colors.primari;
  const buttonIcon = isDarkMode ? require('@/assets/images/Icons/scanner_DarkMode.png') : require('@/assets/images/Icons/scanner_LightMode.png');
  const {height} = Dimensions.get("window");
  const [modalVisible, setModalVisible] = useState(false);
  
  const handlerScannerPress = () => {
    {/* TODO */}
    console.log('Scanner Pressed');
    router.push({
      pathname: '/flightInfo/scanBoardingPass',
    })
  }

  useEffect(() => {
    if (!isLoggedIn && rootNavigationState?.key) {
      // no crec que sigui el millor approach
      login();
    }
  }, [rootNavigationState?.key]);


  return (
    <View style={styles.container}>
      <MapaUni/>

      {/* Botó per escannejar */}
      <TouchableOpacity style={[styles.scannButton,{backgroundColor: buttonColor}]} onPress={handlerScannerPress}>
        <Image source={buttonIcon} style={[styles.scannIconButton]}>
        </Image>
      </TouchableOpacity>

      {/* Botón que abre el modal */}
      <ThemedPressable onPress={() => setModalVisible(true)} type="button">
        <ThemedText type="bold">Provar Modal</ThemedText>
      </ThemedPressable>

      {/* Modal personalizado */}
      <InfoModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={() => {
          console.log("Has seleccionado este lugar");
          setModalVisible(false);
        }}
        imageUrl={Image.resolveAssetSource(localImage).uri}
        title="Gate"
        minutesText="1 min"
        distanceText="500 m"
        buttonText="Triar"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative'
  },
  contentContainer: {
    flexGrow: 1,
  },

  scannButton: {
    width: 55,
    height: 55,
    position: 'absolute',
    bottom: 30,
    right: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scannIconButton: {
    width: 40,
    height: 40,
  },
})