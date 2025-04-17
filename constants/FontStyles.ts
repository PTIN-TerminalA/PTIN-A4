/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
import { StyleSheet } from "react-native";



export const FontStyles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Roboto-Light",
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Roboto-Regular",
  },
  title: {
    fontSize: 32,
    lineHeight: 32,
    fontFamily: "Roboto-Bold",
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "Roboto-Regular",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
    fontFamily: "Roboto-Italic",
  },
  bold: {
    fontFamily: "Roboto-Bold",
  }
});
