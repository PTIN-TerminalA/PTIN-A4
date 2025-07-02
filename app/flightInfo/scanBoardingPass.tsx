import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "react-native";
import { View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { insertFromQR } from "@/flightData/qrImporter";
import { IconButton } from "react-native-paper";

export default function ScanBoardingPassScreen() {
  const buttonColor = useThemeColor({}, "button");
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const [scanned, setScanned] = useState(false);
  const handleQRCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return; // evita múltiples escaneigs
    setScanned(true);
    //alert(`Dades escanejades: ${data}`);

    const cleaned = data.trim().replace(/^\uFEFF/, "");
    try {
      const qrContent = JSON.parse(cleaned);
      insertFromQR(qrContent);
      router.back();
    } catch (error) {
      alert("Error processant el codi QR");
      console.error("QR error:", error);
    }
  };

  if (!permission) {
    return <ThemedView style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <ThemedView style={styles.permissionContainer}>
        <IconButton
          icon="camera"
          size={32}
          iconColor="white"
          onPress={requestPermission}
          style={{ backgroundColor: buttonColor }}
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={handleQRCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      >
        {/* Framing corners */}
        <View style={styles.scanBox}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>

        {/* Close button at bottom center */}
        <View style={styles.closeButtonContainer}>
          <IconButton
            icon="close"
            size={36}
            iconColor="white"
            onPress={() => router.back()}
            style={styles.fab}
          />
        </View>
      </CameraView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanBox: {
    position: "absolute",
    top: "25%",
    left: "10%",
    width: "80%",
    aspectRatio: 1,
    borderRadius: 16,
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "white",
    borderWidth: 4,
    borderRadius: 5,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  closeButtonContainer: {
    position: "absolute",
    bottom: 36,
    width: "100%",
    alignItems: "center",
  },
  fab: {
    backgroundColor: "#1F1F1F", // Material 3 dark surface variant
    elevation: 4,
  },
});
