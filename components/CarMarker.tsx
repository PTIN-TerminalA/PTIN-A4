import { transform } from "@babel/core";
import React from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";
import { RotateInUpRight } from "react-native-reanimated";

type Props = {
  x: number;
  y: number;
  scale: number;
  rotation?: number;
  visible?: boolean;
  onPress?: () => void;
};

const ICON_SIZE = 64;

const CarMarker: React.FC<Props> = ({
  x,
  y,
  scale,
  visible = true,
  rotation = 0,
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
          transform: [{ rotate: `${rotation ?? 0}deg` }],
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
