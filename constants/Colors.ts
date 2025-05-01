/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

export const tintColorLight = "#000";
export const tintColorDark = "#fff";

export const Colors = {
  basic: "#8ecae6",
  primari: "#219ebc",
  secundari: "#023047",
  accent_primari: "#ffb703",
  accent_secundari: "#fb8500",

  input_background: "transparent", // also card_background
  input_border: "#000", 
  input_text: "#d3d3d3", // also card_text

  alert: "#fb8500",

  light: {
    text: "#000",
    background: "#fff",
    button: "#219EBC",
    button_secundari: "#d3d3d3",
    button_alt:"#d3d3d3",
    tint: tintColorLight,
    iconActive: "#000",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    box_border: "#000", // card_border
    box: "#d3d3d3", // card_secundari and card_secundari_border
  },
  dark: {
    text: "#fff",
    background: "#000",
    button: "#219EBC",
    button_secundari: "#2e2e2e",
    button_alt: "#2e2e2e",
    tint: tintColorDark,
    iconActive: "#fff",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    box_border: "#d3d3d3", // card_border
    box: "#d3d3d3", // card_secundari
  },
};
