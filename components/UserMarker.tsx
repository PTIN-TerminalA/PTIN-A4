import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import Color from "color";

type Props = {
  x: number;
  y: number;
  scale: number;
  imageHeight: number;
  heading: number;
};

const CIRCLE_SIZE = 30;
const TRIANGLE_HEIGHT = 20;
const mapRotationOffset = 45; // degrees your map is rotated clockwise from North

// Corrected heading for your marker rotation:

const UserMarker: React.FC<Props> = ({ x, y, scale, imageHeight, heading }) => {
  const correctedHeading = (heading - mapRotationOffset + 360) % 360;
  return (
    <View
      style={[
        styles.container,
        {
          left: x * scale - CIRCLE_SIZE / 2,
          top: (imageHeight - y) * scale - CIRCLE_SIZE / 2,
        },
      ]}
    >
      <View style={styles.circle} />
      {/* Rotation happens around the circle center only */}
      <View
        style={[
          styles.rotator,
          { transform: [{ rotate: `${correctedHeading}deg` }] },
        ]}
      >
        <View style={styles.triangle} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  rotator: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "flex-start",
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE + TRIANGLE_HEIGHT,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: Colors.primari,
    borderColor: "white",
    borderWidth: 2,
  },
  triangle: {
    position: "absolute",
    top: CIRCLE_SIZE,
    width: 0,
    height: 0,
    borderLeftWidth: CIRCLE_SIZE / 2.5,
    borderRightWidth: CIRCLE_SIZE / 2.5,
    borderTopWidth: TRIANGLE_HEIGHT,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: Color(Colors.primari).alpha(0.3).rgb().string(),
  },
});

export default UserMarker;
