import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import { LatLng, LeafletView, MapMarker } from 'react-native-leaflet-view';

const DEFAULT_LOCATION = {
  latitude: -23.5489,
  longitude: -46.6388
}
const App: React.FC = () => {
  const [webViewContent, setWebViewContent] = useState<string | null>(null);
  useEffect(() => {
    let isMounted = true;

    const loadHtml = async () => {
      try {
        const path = require("../../assets/leafletown.html");
        const asset = Asset.fromModule(path);
        await asset.downloadAsync();
        const htmlContent = await FileSystem.readAsStringAsync(asset.localUri!);

        if (isMounted) {
          setWebViewContent(htmlContent);
        }
      } catch (error) {
        Alert.alert('Error loading HTML', JSON.stringify(error));
        console.error('Error loading HTML:', error);
      }
    };

    loadHtml();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!webViewContent) {
    return <ActivityIndicator size="large" />
  }
  
  return (
    <LeafletView
      source={{ html: webViewContent}} //html: webViewContent
      mapCenterPosition={{
        lat: 500,//DEFAULT_LOCATION.latitude,
        lng: 500,//DEFAULT_LOCATION.longitude,
      }}
    >  
    </LeafletView>
  );
}

export default App;