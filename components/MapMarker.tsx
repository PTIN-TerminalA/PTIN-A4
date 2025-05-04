import React from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";

type Props = {
  x: number;
  y: number;
  scale: number;
  onPress?: () => void;
};

const ICON_SIZE = 64;

const MapMarker: React.FC<Props> = ({ x, y, scale, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.marker,
        {
          left: x * scale - ICON_SIZE / 2,
          top: y * scale - ICON_SIZE / 2,
        },
      ]}
    >
      <Image
        source={require("@/assets/images/Icons/marker.png")}
        style={styles.icon}
        resizeMode="contain"
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  marker: {
    position: "absolute",
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
});

export default MapMarker;
