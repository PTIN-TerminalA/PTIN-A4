import { Pressable, type PressableProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import { Styles } from "@/constants/Styles";
import { ThemedText } from "./ThemedText";

export type ThemedPressableProps = PressableProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "button" | "button_secundari" | "button_alt";
  title?: string;
};

export function ThemedPressable({
  style,
  lightColor,
  darkColor,
  type="button",
  title,
  ...rest
}: ThemedPressableProps) {
  //const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor },type);

  const textColor =
  type === "button"
    ? useThemeColor({ light: lightColor, dark: darkColor }, "button_text")
    : type === "button_secundari"
    ? useThemeColor({ light: lightColor, dark: darkColor }, "button_secundari_text")
    : useThemeColor({ light: lightColor, dark: darkColor }, "button_alt_text");
    
  return (<Pressable style={[
    type === "button" && {
      backgroundColor: useThemeColor({ light: lightColor, dark: darkColor }, "button"),
    },
    type === "button_secundari" && {
      backgroundColor: useThemeColor({ light: lightColor, dark: darkColor }, "button_secundari"),
    },
    type === "button_alt" && {
      backgroundColor: useThemeColor({ light: lightColor, dark: darkColor }, "button_alt"),
    },    
    Styles.button,
    style, //style = Styles.button,
  ]}
    {...rest}
    >
    {title && (
      <ThemedText style={{ color: textColor, fontWeight: "bold" }}>
        {title}
      </ThemedText>
    )}
    
    {rest.children}
  </Pressable>
  );
}
