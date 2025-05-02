import { useState, useEffect } from "react";
import { Platform, PermissionsAndroid } from "react-native";
import WifiManager from "react-native-wifi-reborn";

interface UserLocation {
  x: number;
  y: number;
}
export function useUserLocation(scanInterval = 3000) {
  const [location, setLocation] = useState<UserLocation | null>(null);

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS !== "android") return;

      const permissions = [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];

      if (Platform.Version >= 33) {
        permissions.push(PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES);
      }

      await PermissionsAndroid.requestMultiple(permissions);
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    const scan = async () => {
      try {
        const wifiList = await WifiManager.loadWifiList();
        const wifiSimplifiedList = wifiList.map((wifi) => ({
          ID: wifi.BSSID,
          strength: wifi.level,
        }));
        // TODO: enviar això al backend/api

        const fakePosition = {
          x: 500,
          y: 300,
        };
        setLocation(fakePosition); // Simulació de la posició
      } catch (error) {
        console.error("Wifi scan error:", error);
      }
    };
    // Primer escaneig immediat
    scan();

    const interval = setInterval(scan, scanInterval); //Cada quan tornem a calcular la posició

    // Netejar interval quan es desmunti
    return () => clearInterval(interval);
  }, []);

  return { location }; // Retornarem les coordenades per poder-ho visualitzar al mapa
}
