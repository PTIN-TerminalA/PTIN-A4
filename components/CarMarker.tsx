import React from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";

type Props = {
  x: number;
  y: number;
  scale: number;
  visible?: boolean;
  onPress?: () => void;
};

const ICON_SIZE = 64;

const CarMarker: React.FC<Props> = ({
  x,
  y,
  scale,
  visible = true,
  onPress,
}) => {
  if (!visible) return null;

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
        source={require("@/assets/images/Icons/carIcon.png")} // <-- Aquesta hauria de ser la icona del cotxe
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

export default CarMarker;
