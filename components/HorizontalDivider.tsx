import { Colors } from "@/constants/Colors";
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useColorScheme } from "react-native";

interface DividerProps {
  color?: string;
  thickness?: number;
  marginVertical?: number;
  width?: ViewStyle["width"];
}

export const HorizontalDivider: React.FC<DividerProps> = ({
  color,
  thickness = 1,
  marginVertical = 10,
  width = "100%",
}) => {
  const colorScheme = useColorScheme();
  const themedColors = Colors[colorScheme || "light"];
  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: color ? color : themedColors.box,
          height: thickness,
          marginVertical,
          width,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    alignSelf: "center",
  },
});
