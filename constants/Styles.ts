/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
import {Colors} from "@/constants/Colors"
import { StyleSheet,  useColorScheme,  type TextProps} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";


export const Styles = StyleSheet.create({
  view:{

  },
  textbox:{

  },
  textInput:{
    height: '6%',
    width: '90%',
    textAlign: 'left',
    textAlignVertical: 'center',
    margin: 10,
    marginLeft: '5%', 
    paddingLeft: '5%',
    borderRadius: 10
  },
  button:{
    margin: 10,
    borderRadius: 10, 
    height: '6%',
    width: '90%',  
    marginLeft: '5%', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
