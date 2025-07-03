import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import Color from "color";

const CIRCLE_SIZE = 20;
const TRIANGLE_HEIGHT = 20;
const INTERPOLATION_DURATION = 4000; // 4 seconds in ms
const MAX_HUMAN_SPEED = 1.5; // max speed in meters per second

export type UserMarkerProps = {
  x: number;
  y: number;
  scale: number;
  imageHeight: number;
  heading: number;
};

const UserMarker: React.FC<UserMarkerProps> = ({
  x,
  y,
  scale,
  imageHeight,
  heading,
}) => {
  const rotationAnim = useRef(new Animated.Value(heading)).current;

  const prev = useRef<{ x: number; y: number; timestamp: number } | null>(null);
  const prevHeading = useRef<number>(heading);

  const colorScheme = useColorScheme();
   // Animated values for position
  const animX = useRef(new Animated.Value(x)).current;
  const animY = useRef(new Animated.Value(y)).current;

  // Animated value for rotation

  // Keep previous position & timestamp for velocity calculation

  const themedColors = Colors[colorScheme || "dark"];

  useEffect(() => {
    const now = Date.now();

    if (prev.current) {
      const dt = (now - prev.current.timestamp) / 1000; // seconds elapsed
      const dx = x - prev.current.x;
      const dy = y - prev.current.y;

      // Calculate velocity components (meters per second)
      let vx = dx / dt;
      let vy = dy / dt;

      // Calculate speed magnitude
      const speed = Math.sqrt(vx * vx + vy * vy);

      // Cap speed at max human walking speed
      if (speed > MAX_HUMAN_SPEED) {
        const scaleFactor = MAX_HUMAN_SPEED / speed;
        vx *= scaleFactor;
        vy *= scaleFactor;
      }

      // Predict next position based on velocity and interpolation duration
      const predictTime = INTERPOLATION_DURATION / 1000; // seconds
      const predictedX = x + vx * predictTime;
      const predictedY = y + vy * predictTime;

      // Animate to predicted position smoothly over interpolation duration
      Animated.timing(animX, {
        toValue: predictedX,
        duration: INTERPOLATION_DURATION,
        useNativeDriver: false,
      }).start();

      Animated.timing(animY, {
        toValue: predictedY,
        duration: INTERPOLATION_DURATION,
        useNativeDriver: false,
      }).start();
    } else {
      // First render, just set values immediately
      animX.setValue(x);
      animY.setValue(y);
    }

    prev.current = { x, y, timestamp: now };
  }, [x, y]);

  useEffect(() => {
    let start = prevHeading.current % 360;
    let end = heading % 360;
    let diff = end - start;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    const finalHeading = start + diff;

    Animated.timing(rotationAnim, {
      toValue: finalHeading,
      duration: 300,
      useNativeDriver: true,
    }).start();

    prevHeading.current = finalHeading;
  }, [heading]);

  const rotate = rotationAnim.interpolate({
    inputRange: [-360, 360],
    outputRange: ["-360deg", "360deg"],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            {
              translateX: Animated.subtract(
                Animated.multiply(animX, scale),
                CIRCLE_SIZE / 2
              ),
            },
            {
              translateY: Animated.subtract(
                Animated.multiply(
                  Animated.subtract(imageHeight, animY),
                  scale
                ),
                CIRCLE_SIZE / 2
              ),
            },
          ],
        },
      ]}
    >
      <Animated.View
        style={{
          width: CIRCLE_SIZE,
          height: CIRCLE_SIZE,
          borderRadius: CIRCLE_SIZE / 2,
          backgroundColor: Colors.primari,
          borderColor: "white",
          borderWidth: 1,
        }}
      />
      <Animated.View style={[styles.rotator, { transform: [{ rotate }] }]}>
        <Animated.View
          style={{
            position: "absolute",
            top: CIRCLE_SIZE / 1.5,
            width: 0,
            height: 0,
            borderLeftWidth: CIRCLE_SIZE / 1.5,
            borderRightWidth: CIRCLE_SIZE / 1.5,
            borderBottomWidth: TRIANGLE_HEIGHT * 2,
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderBottomColor: Color(Colors.primari).alpha(0.7).rgb().string(),
          }}
        />
      </Animated.View>
    </Animated.View>
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
});

export default UserMarker;