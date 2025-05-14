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

export function useUserLocation(scanInterval = 3000) {
  
  const [location, setLocation] = useState<Position | null>({
    x: 0.49207792207792206,
    y: 0.05923279428356525,
  });
  
  return { location }; // Retornarem les coordenades per poder-ho visualitzar al mapa
}
