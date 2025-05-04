import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

const fillColor = Colors.basic;
const borderColor = Colors.primari;

type Props = {
  x: number;
  y: number;
  scale: number;
};

const SIZE = 30;

const UserMarker: React.FC<Props> = ({ x, y, scale }) => {
  return (
    <View
      style={[
        styles.marker,
        {
          left: x * scale - SIZE / 2,
          top: y * scale - SIZE / 2,
          width: SIZE,
          height: SIZE,
          borderRadius: SIZE / 2,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  marker: {
    position: "absolute",
    backgroundColor: Colors.basic,
    borderColor: Colors.primari,
    borderWidth: 2,
  },
});

export default UserMarker;
