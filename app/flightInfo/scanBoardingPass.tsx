import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'react-native';
import { View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { insertFromQR } from '@/flightData/qrImporter';

export default function ScanBoardingPassScreen(){
    const buttonColor = useThemeColor({}, 'button'); 

    const closeIcon = require('@/assets/images/Icons/close.png') 
    const flipIcon = require('@/assets/images/Icons/flip.png')
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const router = useRouter();
    const [scanned, setScanned] = useState(false);
    const handleQRCodeScanned = ({ data }: { data: string }) => {
        if (scanned) return; // evita múltiples escaneigs
        setScanned(true);
        //alert(`Dades escanejades: ${data}`);
        
        const cleaned = data.trim().replace(/^\uFEFF/, '');
        try {
          const qrContent = JSON.parse(cleaned);
          insertFromQR(qrContent);
          router.back();
          
        } catch (error) {
          alert('Error processant el codi QR');
          console.error('QR error:', error);
        }
      };
    
    if (!permission) {
        // Camera permissions are still loading.
        return (
            <ThemedView style={styles.container}>
            <ThemedText>Scan Boarding Pass</ThemedText>
            </ThemedView>
            );
      }

      if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <ThemedView style={styles.permissionContainer}>
            <ThemedText style={styles.permissionText}>
                Necessitem accés a la càmera per escanejar el codi QR
            </ThemedText>
            <TouchableOpacity onPress={requestPermission} style={[styles.permissionButton, { backgroundColor: buttonColor }]}>
                <ThemedText style={styles.permissionButtonText}>Donar permís</ThemedText>
            </TouchableOpacity>
            </ThemedView>

        );
    }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }
  return (
    <ThemedView style={styles.container}>
      <CameraView style={styles.camera} facing={facing}
      onBarcodeScanned={handleQRCodeScanned}
      barcodeScannerSettings={{ barcodeTypes: ['qr'] }}>

      <View style={styles.scanBox}>
   
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />
        </View>


      <ThemedView style={styles.buttonContainer}>

      <TouchableOpacity onPress={toggleCameraFacing}>
        <Image source={flipIcon} style={styles.icon} />
     
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.back()}>
        <Image source={closeIcon} style={styles.icon} />
      </TouchableOpacity>

    </ThemedView>
      </CameraView>
    </ThemedView>
  );


}

const styles = StyleSheet.create({
    buttonContainer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 70,
        alignItems: 'center',
        backgroundColor: 'transparent',
      },
      
      icon: {
        width: 75,
        height: 75,
        tintColor: 'white',
      },

    container: {
      flex: 1,
      justifyContent: 'center',
    },
    message: {
      textAlign: 'center',
      paddingBottom: 10,
    },
    camera: {
      flex: 1,
    },
    button: {
      flex: 1,
      alignSelf: 'flex-end',
      alignItems: 'center',
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
    },

    scanBox: {
        position: 'absolute',
        top: '25%',
        left: '10%',
        width: '80%',
        aspectRatio: 1, 
        borderRadius: 16, 
      },
      
      corner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: 'white',
        borderWidth: 4,
        borderRadius: 5, // cantonades suaus
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
      permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
      },
      
      permissionText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
      },
      
      permissionButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
      },
      
      permissionButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      
      
      
  });