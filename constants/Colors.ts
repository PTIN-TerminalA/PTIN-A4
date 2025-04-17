/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  basic: "#8ecae6",
  primari: "#219EBC",
  secundari: "#023047",
  accent_primari: "#ffb703",
  accent_secundari: "#fb8500",
  light: {
    text: "#11181C",
    background: "#fff",
    button: "#219EBC",
    button_secundari: "#023047",
    button_alt:"lightgrey",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    button: "#219EBC",
    button_secundari: "#023047",
    button_alt: "#2E2E2E",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};
