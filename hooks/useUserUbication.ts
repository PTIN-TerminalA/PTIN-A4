import { useState, useEffect } from "react";
import { Platform, PermissionsAndroid } from "react-native";
import WifiManager from "react-native-wifi-reborn";

type Measurement = {
  bssid: string;
  rssi: number;
};

type Position = {
  x: number;
  y: number;
};

export function useUserUbication(scanInterval = 3000) {
  const [location, setLocation] = useState(null); // Això hauran de ser les coordenades del mapa
  
  const localizeUser = async (measurements: Measurement[]): Promise<Position | null> => {
    try {
      const response = await fetch("http://192.168.1.10:8000/localize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ measure: measurements }),
      });

      if (!response.ok) {
        console.error("API response error");
        return null;
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error calling API:", error);
      return null;
    }
  };
  
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
          bssid: wifi.BSSID,
          rssi: wifi.level,
        }));
        const pos = await localizeUser(wifiSimplifiedList);
        if (pos) {
          setLocation(pos);
        }
        console.log("Wifi scan result:", wifiSimplifiedList);
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
