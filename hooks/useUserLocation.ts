import { useState, useEffect } from "react";
import { Platform, PermissionsAndroid } from "react-native";
import WifiManager from "react-native-wifi-reborn";
import { API_URL } from '@/api/Api';


type Measurement = {
  bssid: string;
  rssi: number;
};

type Position = {
  x: number;
  y: number;
};

export function useUserLocation(scanInterval = 3000) {
  const [location, setLocation] = useState<Position | null>(null);

  const localizeUser = async (measurements: Measurement[]): Promise<Position | null> => {
    try {
      console.log("Crida getUserPosition des de A4", measurements)
      const response = await fetch(`${API_URL}/api/getUserPosition`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ measure: measurements }),
      });
      
      const data = await response.json();
      console.log("DATA: ", data);
      return data;

    } catch (error) {
      console.error("No user localized", error);
      return null;
    }
  };
  
  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS !== "android") return;

      const permissions = [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];
      permissions.push(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
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
        // const wifiList = await WifiManager.reScanAndLoadWifiList();
        const wifiListRaw = await WifiManager.reScanAndLoadWifiList();
        const wifiList = typeof wifiListRaw === 'string' ? JSON.parse(wifiListRaw) : wifiListRaw;

        // if (wifiList) {
        //   const wifiSimplifiedList: Measurement[] = wifiList.map((wifi) => ({
        //     bssid: wifi.BSSID.replace(/:/g, ''), // Remove ":"
        //     rssi: wifi.level ?? -100,
        //   }));
        if (Array.isArray(wifiList)) {
          const wifiSimplifiedList: Measurement[] = wifiList.map((wifi) => ({
            bssid: wifi.BSSID.replace(/:/g, ''),
            rssi: wifi.level ?? -100,
          }));
          
          const pos = await localizeUser(wifiSimplifiedList);
          
          if (pos) 
            setLocation(pos);
        
          console.log("Wifi scan result:", wifiSimplifiedList);

          }

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
