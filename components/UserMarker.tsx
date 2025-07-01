import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Colors } from "@/constants/Colors";
import Color from "color";

type Props = {
  x: number;
  y: number;
  scale: number;
  imageHeight: number;
  heading: number;
};

const CIRCLE_SIZE = 20;
const TRIANGLE_HEIGHT = 20;

const UserMarker: React.FC<Props> = ({ x, y, scale, imageHeight, heading }) => {
  // Use a ref for the animated rotation value
  const rotationAnim = useRef(new Animated.Value(0)).current;

  // Keep track of previous heading to animate from there
  const prevHeading = useRef(0);

  useEffect(() => {
    // Calculate shortest rotation direction to avoid large spins
    let start = prevHeading.current;
    let end = heading;

    // Normalize angles to [0, 360)
    start = start % 360;
    end = end % 360;

    // Calculate shortest rotation distance (-180 to 180)
    let diff = end - start;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    const finalHeading = start + diff;

    // Animate rotation from current to new heading
    Animated.timing(rotationAnim, {
      toValue: finalHeading,
      duration: 300,
      useNativeDriver: true,
    }).start();

    prevHeading.current = finalHeading;
  }, [heading]);

  // Interpolate rotationAnim to rotation string with deg
  const rotate = rotationAnim.interpolate({
    inputRange: [-360, 360],
    outputRange: ["-360deg", "360deg"],
  });

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
      <Animated.View style={[styles.rotator, { transform: [{ rotate }] }]}>
        <View style={styles.triangle} />
      </Animated.View>
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
    borderWidth: 1,
  },
  triangle: {
    position: "absolute",
    top: CIRCLE_SIZE / 1.5,
    width: 0,
    height: 0,
    borderLeftWidth: CIRCLE_SIZE / 1.5,
    borderRightWidth: CIRCLE_SIZE / 1.5,
    borderBottomWidth: TRIANGLE_HEIGHT * 2,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: Color(Colors.primari).alpha(0.6).rgb().string(),
  },
});

export default UserMarker;
