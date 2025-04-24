import { Pressable, type PressableProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import { Styles } from "@/constants/Styles";

export type ThemedPressableProps = PressableProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "button" | "button_secundari" | "button_alt";
};

export function ThemedPressable({
  style,
  lightColor,
  darkColor,
  type="button",
  ...rest
}: ThemedPressableProps) {
  //const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor },type);

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
  />
  );
}
