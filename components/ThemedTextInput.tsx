import { TextInput, type TextInputProps} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { Styles } from "@/constants/Styles";
import { FontStyles } from "@/constants/FontStyles";

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedTextInput({
  style = Styles.textInput,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <TextInput
      style={[
        { color },
        type === "default" ? FontStyles.default : undefined,
        type === "title" ? FontStyles.title : undefined,
        type === "defaultSemiBold" ? FontStyles.defaultSemiBold : undefined,
        type === "subtitle" ? FontStyles.subtitle : undefined,
        type === "link" ? FontStyles.link : undefined,
        style, 
        {borderWidth: 1},
        {borderColor: color}
      ]}
      placeholderTextColor={color}
      
      {...rest}
    />
  );
}
