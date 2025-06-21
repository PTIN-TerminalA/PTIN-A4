import React from "react";
import { Dimensions, Image, } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import Svg, { Polygon } from "react-native-svg";
import { useCanvasGestures } from "@/hooks/useCanvasGestures";
import {
  normalizeRotatedZones,
  normalizeZones,
} from "@/hooks/useNormalizedZones";
import { zones } from "@/constants/mocks/zones";
import { useServiceContext } from "@/contexts/ServiceContext";
import { InfoModal } from "@/components/InfoModal";



export default function MVPMapaInteractiu() {
  const [selectedService, setSelectedService] = React.useState<any>(null);
  const [modalVisible, setModalVisible] = React.useState(false);

  const onServicePress = (service: any) => {
    setSelectedService(service);
    setModalVisible(true);
  };
  const { services, loading: servicesLoading } = useServiceContext();

    const normalizedZones = normalizeRotatedZones(zones);
    
    const mapImage = require("@/assets/images/planol.png");
const imageInfo = Image.resolveAssetSource(mapImage);

const imageWidth = imageInfo.width;
const imageHeight = imageInfo.height;
const NUM_CARS = 10;
console.log("Image info:", imageInfo);
const screen = Dimensions.get("window");

//Escala para que la imagen encaje verticalmente
const scale = screen.height / imageHeight;
const displayedWidth = imageWidth * scale;
const { gesture, animatedStyle, isPanning } = useCanvasGestures();
console.log(services, "Services from context");
return (
    <ThemedView style={{ flex: 1 }}>
     <InfoModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={() => {
          console.log("Service selected:", selectedService);
          // Aquí podrías navegar a una pantalla de confirmació o demanar el cotxe
          setModalVisible(false);
        }}
        /** Si no s'ha seleccionat un destí el modal canvia */
        imageUrl={selectedService?.ad_path || "@/assets/images/planol.png"}
        title={selectedService?.name || "Demana un cotxe"}
        minutesText={selectedService == null ? "" : "2 min"} // Opcional, si ho calcules
        distanceText={selectedService == null ? "" : "500 m"} // Opcional, si ho calcules
        buttonText="Demanar cotxe"
        description={
          selectedService?.description ||
          "Primer selecciona un destí dins la terminal A"
        }
      />
  <GestureDetector gesture={gesture}>
    <Animated.View style={[{ flex: 1 }, animatedStyle]}>
      <Image
        source={require("@/assets/images/planol.png")}
        
            />

            <Svg
                            pointerEvents="box-none"
                            width='500%'
                            height='200%'
                            style={{ position: "absolute", top: 0, left: 0 }}
                          >
                            {normalizedZones.map((zone, idx) => {
                              const pointsStr = zone.positions
                                .map(
                                  ([x, y]) => `${x * imageWidth},${y * imageHeight}`
                                )
                                .join(" ");
            
                              return (
                                <Polygon
                                  key={idx}
                                  pointerEvents="box-none"
                                  points={pointsStr}
                                  fill="none"
                                  stroke="none"
                                  strokeWidth={2}
                                  onPressIn={() => {
                                    console.log("pressed polygon",zone.name);
                                    const service = services?.find(
                                        (s) => s.name === zone.name
                                        );
                                    
                                        if (service) {
                                            setTimeout(() => {
                                                if (!isPanning.value) {
                                                    onServicePress(service);
                                                }
                                            }, 100); // Delay to ensure the modal opens after the gesture ends
                                        }
                                    
                                  }}
                                />
                              );
                            })}
                          </Svg>

    </Animated.View>
  </GestureDetector>
  </ThemedView>
);
}