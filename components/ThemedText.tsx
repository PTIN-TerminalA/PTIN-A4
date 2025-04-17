import { Text, type TextProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

import { FontStyles } from "@/constants/FontStyles";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link" | "bold";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "default" ? FontStyles.default : undefined,
        type === "title" ? FontStyles.title : undefined,
        type === "defaultSemiBold" ? FontStyles.defaultSemiBold : undefined,
        type === "subtitle" ? FontStyles.subtitle : undefined,
        type === "link" ? FontStyles.link : undefined,
        type === "bold" ? FontStyles.bold : undefined,
        style,
      ]}
      {...rest}
    />
  );
}
