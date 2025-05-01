/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#000000";
const tintColorDark = "#fff";

export const Colors = {
  basic: "#8ecae6",
  primari: "#219EBC",
  secundari: "#023047",
  accent_primari: "#ffb703",
  accent_secundari: "#fb8500",
  light: {
    text: "#000000",
    background: "#fff",
    button: "#219EBC",
    button_text: "#000000",
    button_secundari: "lightgrey",
    button_secundari_text: "#000000",
    button_alt:"#023047",
    button_alt_text: "#000000",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    button: "#219EBC",
    button_text: "#ffffff",
    button_secundari: "#2E2E2E",
    button_secundari_text: "#ffffff",
    button_alt: "#023047",
    button_alt_text: "#ffffff",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};
