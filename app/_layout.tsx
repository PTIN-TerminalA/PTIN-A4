import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useFlightNotifications } from "@/hooks/useFlightNotifications";
import { ServiceProvider } from "@/contexts/ServiceContext";
import { useRecommendationNotifications } from "@/hooks/useRecommendationNotifications";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider } from "react-native-paper";
import * as NavigationBar from 'expo-navigation-bar';
import { setStatusBarHidden } from "expo-status-bar";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Light": require("../assets/fonts/Roboto-Light.ttf"),
    "Roboto-Italic": require("../assets/fonts/Roboto-Italic.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      console.log("Fontrs carregades");
      SplashScreen.hideAsync();
      NavigationBar.setPositionAsync("absolute");
      NavigationBar.setVisibilityAsync("visible");
      NavigationBar.setBackgroundColorAsync("transparent")
      NavigationBar.setBehaviorAsync("inset-swipe");
      setStatusBarHidden(true, "none");
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  
 
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AuthProvider>
          <ServiceProvider>
            <MainLayout />
          </ServiceProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

function MainLayout() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  useFlightNotifications();
  useRecommendationNotifications();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {user ? <Stack.Screen name="(tabs)" /> : <Stack.Screen name="(auth)" />}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar translucent backgroundColor="transparent" style="auto" />
    </ThemeProvider>
  );
}
