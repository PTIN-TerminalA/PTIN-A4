import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";

type Props = {
  x: number;
  y: number;
  scale: number;
  onPress?: () => void;
};

const ICON_SIZE = 48;

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
      <MaterialCommunityIcons name="map-marker" size={ICON_SIZE} />
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
