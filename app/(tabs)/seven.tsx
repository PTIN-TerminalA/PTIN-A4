import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Modal from "react-native-modal";
import { Button } from "react-native-paper";
import React, { useState } from "react";
import {
  StyleSheet,
  Dimensions,
  Image,
  Pressable,
  View,
  Text,
} from "react-native";
import Animated from "react-native-reanimated";
import { useCanvasGestures } from "@/hooks/useCanvasGestures";
import { GestureDetector } from "react-native-gesture-handler";
import Svg, { Polygon } from "react-native-svg";
import { zones } from "@/constants/mocks/zones";
import { normalizeRotatedZones } from "@/hooks/useNormalizedZones";
import AutocompleteSearch from "./five";
export default function Six() {
  const mapImage = require("@/assets/images/planol.png");
  const { gesture, animatedStyle, isPanning, zoomTo } = useCanvasGestures();
  const [modalVisible, setModalVisible] = useState(false);
  const normalizedZones = normalizeRotatedZones(zones);
  const constant = 0.1;
  const imageWidth = 600 * constant;
  const imageHeight = 400 * constant;
  const screen = Dimensions.get("window");
  // Scale to fit vertically
  //const scale = screen.height / imageHeight;
  const scale = 6.8;
  const displayedWidth = imageWidth * scale;
  // Define the Zone type above the component
  type Zone = {
    name: string;
    positions: [number, number][];
  };

  const getZoneCenter = (zone: any): [number, number] => {
    const sum = zone.positions.reduce(
      ([accX, accY]: [number, number], [x, y]: [number, number]) => [
        accX + x,
        accY + y,
      ],
      [0, 0]
    );
    const len = zone.positions.length;
    return [sum[0] / len, sum[1] / len];
  };
  return (
    <>
      <AutocompleteSearch />
      <Button
        style={{
          marginTop: 200,
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1000,
        }}
        onPress={() => {
          console.log("Button Pressed");
          const zoneName = "Nike";
          const zone = normalizedZones.find((z) => z.name === zoneName);
          const [x, y] = zone.positions[0];
          const x1 = x * displayedWidth;
          const y1 = y * imageHeight * scale;
          console.log("Zone found:", zone, x1, y1);
          const x2 = x1 * 2 * 0.68;
          const y2 = y1 * 2 * 0.68;
          const midx = (600 * 0.68) / 2;
          const midy = (400 * 0.68) / 2;
          const x3 = x1 < midx ? x1 + 600 * 0.68 : -(x1 + 600 * 0.68);
          const y3 = y1 < midy ? y1 + 400 * 0.68 : -(y1 + 400 * 0.68);
          //const [x, y] = getZoneCenter(zone);
          console.log("Center coordinates:", x3, y3);
          console.log("Image dimensions:", imageWidth, imageHeight);
          console.log("Scale factor:", scale);
          zoomTo(x3, y3, 3);
        }}
      >
        <Text>Zoom</Text>
      </Button>
      {modalVisible && (
        <View>
          <Pressable
            style={styles.overlay}
            onPress={() => {
              setModalVisible(false);
            }}
          />
          <Modal
            isVisible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            onBackdropPress={() => setModalVisible(false)}
            onSwipeComplete={() => setModalVisible(false)}
            swipeDirection="down"
            propagateSwipe
            style={styles.modal}
          >
            <ThemedView style={{ padding: 20 }}>
              <ThemedText type="title">Modal Title</ThemedText>
              <ThemedText type="default">This is a modal content.</ThemedText>
              <Button
                onPress={() => {
                  console.log("Modal Button Pressed");
                  setModalVisible(false);
                }}
              >
                <ThemedText>Close Modal</ThemedText>
              </Button>
            </ThemedView>
          </Modal>
        </View>
      )}
      <ThemedView
        style={{
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        <GestureDetector gesture={gesture}>
          <View style={{ overflow: "hidden" }}>
            <Animated.View
              style={[
                {
                  backgroundColor: "white",
                  alignItems: "center",
                  justifyContent: "center",
                },
                animatedStyle, // conté translateX, translateY
              ]}
            >
              <View
                style={{
                  justifyContent: "center",

                  flex: 1,
                }}
                pointerEvents="box-none"
              >
                <Image
                  source={mapImage}
                  style={{
                    width: 600 * 0.68,
                    height: 400 * 0.68,
                    resizeMode: "cover",
                  }}
                />
                <Svg
                  width={600 * 0.68}
                  height={400 * 0.68}
                  style={{
                    position: "absolute",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {normalizedZones.map((zone, idx) => {
                    const pointsStr = zone.positions
                      .map(
                        ([x, y]) =>
                          `${x * displayedWidth},${y * imageHeight * scale}`
                      )
                      .join(" ");

                    return (
                      <Polygon
                        key={idx}
                        points={pointsStr}
                        fill="none"
                        stroke="none"
                        strokeWidth={1}
                        onPressIn={() => {
                          setTimeout(() => {
                            if (!isPanning.value) {
                              setModalVisible(true);
                              console.log("Polygon pressed:", zone.name);
                            }
                          }, 100);
                        }}
                      />
                    );
                  })}
                </Svg>
              </View>
            </Animated.View>
          </View>
        </GestureDetector>

        {/* Modal */}
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
    zIndex: 1001,
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 1000,
  },
});
