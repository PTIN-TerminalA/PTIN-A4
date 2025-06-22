import React from "react";
import { Dimensions, Image, Text, Button, Modal } from "react-native";
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
import { set } from "date-fns";
export default function MVPMapaInteractiu() {
  const [selectedService, setSelectedService] = React.useState<any>(null);
  const [modalVisible, setModalVisible] = React.useState(false);

  const onServicePress = (service: any) => {
    console.log("Opening modal for service:", service);
    setSelectedService(service);
    setModalVisible(true);
  };

  const { services, loading: servicesLoading } = useServiceContext();
  const normalizedZones = normalizeRotatedZones(zones);
  
  const mapImage = require("@/assets/images/planol.png");
  const imageInfo = Image.resolveAssetSource(mapImage);

  const imageWidth = imageInfo.width;
  const imageHeight = imageInfo.height;
  const screen = Dimensions.get("window");

  // Scale to fit vertically
  const scale = screen.height / imageHeight;
  const displayedWidth = imageWidth * scale;
  const { gesture, animatedStyle, isPanning } = useCanvasGestures();

  console.log("Modal visible:", modalVisible);
  console.log("Selected service:", selectedService);

  return (
    <>
        <GestureDetector gesture={gesture}>

      <ThemedView style={{ flex: 1 }}>
          <Animated.View style={[{ flex: 1 }, animatedStyle]}>
            <Image
              source={require("@/assets/images/planol.png")}
              style={{
                width: displayedWidth,
                height: screen.height,
                resizeMode: 'cover'
              }}
            />

            <Svg
              // Remove pointerEvents="box-none" to allow touch events
              width={displayedWidth}
              height={screen.height}
              style={{ position: "absolute", top: 0, left: 0 }}
            >
              {normalizedZones.map((zone, idx) => {
                const pointsStr = zone.positions
                  .map(
                    ([x, y]) => `${x * displayedWidth},${y * screen.height}`
                  )
                  .join(" ");

                return (
                  <Polygon
                    key={idx}
                    // Remove pointerEvents="box-none" to allow touch events
                    points={pointsStr}
                    fill="rgba(255, 0, 0, 0.1)" // Add a semi-transparent fill for debugging
                    stroke="red"
                    strokeWidth={1}
                    onPressIn={() => {
                      setTimeout(() => {
                        if (!isPanning.value) {
                          setModalVisible(true);
                      console.log("Polygon pressed:", zone.name);
                        }}, 100); // Delay to allow for panning
                      /*const service = services?.find(
                        (s) => s.name === zone.name
                      );
                      
                      if (service) {
                        // Remove the setTimeout and isPanning check for now
                        onServicePress(service);
                      } else {
                        console.log("No service found for zone:", zone.name);
                      }*/
                    }}
                  />
                );
              })}
            </Svg>
          </Animated.View>
      </ThemedView>
        </GestureDetector>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          console.log("Modal closed");
          setModalVisible(false);
        }}
      >
        <ThemedView style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 10,
          margin: 20,
          minHeight: 200,
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}>
          <Text style={{ fontSize: 18, marginBottom: 20 }}>
            Hola
          </Text>
          <Button onPress={() => {
            console.log("Button pressed");
            setModalVisible(false);
          }} title="Tancar" />
        </ThemedView>
      </Modal>
    </>
  );
}