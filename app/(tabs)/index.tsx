import {useColorScheme, Image, StyleSheet, Platform, TouchableOpacity, View, SafeAreaView, StatusBar } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useEffect } from "react";
import { router, useRootNavigationState } from "expo-router";

import { Colors } from "@/constants/Colors"
import { GestureHandlerRootView, Pressable, ScrollView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";

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

  useEffect(() => {
    if (!isLoggedIn && rootNavigationState?.key) {
      // no crec que sigui el millor approach
      login();
    }
  }, [rootNavigationState?.key]);

  const handlerScannerPress = () => {
    {/* TODO */}
  }

  return (
    <GestureHandlerRootView>
        <ScrollView>
          <Image source={require("@/assets/images/mapa_universitat_v2.jpg")}>
          </Image>
          </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({

    container: {
      flex: 1,
      paddingTop: StatusBar.currentHeight,
    },
    scrollView: {
      backgroundColor: 'pink',
    },
    text: {
      fontSize: 42,
      padding: 12,
    },

});
