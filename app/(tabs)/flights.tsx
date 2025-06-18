import {
  Animated,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Link } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { useRef, useState } from "react";
import { Colors } from "@/constants/Colors";
import { BoardingPasses } from "@/flightData/boardingPassesInfoTest";
import { AnimatedFAB } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ThemedFAB from "@/components/ThemedFAB";

export default function FlightsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const buttonColor = Colors.primari;
  const boxColor = isDarkMode ? Colors.dark.box : Colors.light.box;
  const textColor = isDarkMode ? Colors.dark.text : Colors.light.text;
  const borderColor = isDarkMode ? Colors.dark.box : Colors.light.box;
  const buttonIcon = Colors[colorScheme ?? "light"].tint;
  const [showText, setShowText] = useState(true);

  const onPressScanner = () => {
    console.log("Scanner Pressed");
    router.push({ pathname: "/flightInfo/scanBoardingPass" });
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = Math.floor(e.nativeEvent.contentOffset.y ?? 0);
    setShowText(y <= 0);
  };

  const handlerBoardingPassPress = (id: string) => {
    console.log("ticket d'embarcament seleccionat");
    router.push({
      pathname: "/flightInfo",
      params: { id },
    });
  };

  return (
    <SafeAreaView edges={["top"]} style={[styles.container]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={{ height: 15 }}></View>
        {/* 
          Renderitzat del historial de tickets. Si la posició del contenidor es parella,
          es renderitzarà amb el fons tranparent. En canvi, si es imparella, es renderitzarà
          amb el fons de color primari o secundari (depenent de si es light o dark theme)
        */}
        {BoardingPasses.map((boardingPass, index) => (
          <Link
            style={styles.scrollContent}
            key={boardingPass.id}
            href={{ pathname: "/flightInfo", params: { id: boardingPass.id } }}
          >
            <TouchableOpacity
              onPress={() => handlerBoardingPassPress(boardingPass.id)}
              style={[
                styles.flightBox,
                { backgroundColor: index % 2 == 0 ? "transparent" : boxColor },
                { borderColor: borderColor },
              ]}
            >
              <Image
                source={boardingPass.airlineImage}
                style={[styles.airlineImage, { borderColor: boxColor }]}
              ></Image>
              <View style={styles.flightTextInfo}>
                <ThemedText
                  style={[{ color: textColor }, { fontSize: 20 }]}
                  type="defaultSemiBold"
                >
                  {boardingPass.airline}
                </ThemedText>
                <ThemedText style={{ color: textColor }} type="default">
                  {boardingPass.route.origin} - {boardingPass.route.destination}
                </ThemedText>
              </View>
            </TouchableOpacity>
          </Link>
        ))}
        {/* Marge extra per sota del ScrollView */}
        <View style={{ height: 150 }}></View>
      </ScrollView>
      {/* Botó per escannejar */}
      <ThemedFAB
        visible={true}
        animateFrom="right"
        extended={showText}
        label="Escaneja"
        iconMode="dynamic"
        style={[{ backgroundColor: buttonColor }]}
        size={40}
        color={buttonIcon}
        onPress={onPressScanner}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },

  scrollContent: {
    alignItems: "center",
    flexGrow: 1,
    alignSelf: "center",
    padding: 15,
  },

  flightBox: {
    width: 345,
    height: 85,
    borderWidth: 1,
    marginBottom: 30,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
  },

  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    height: 56,
    borderRadius: 28,
    minWidth: 56,
    maxWidth: 200,
    justifyContent: "center", // Ensure contents are centered vertically
    alignItems: "center", // Center horizontally
    paddingHorizontal: 16,
    flexDirection: "row", // Important for icon+text layout
  },

  airlineImage: {
    width: 60,
    height: 60,
    borderWidth: 4,
    borderRadius: 30,
    marginLeft: 15,
    marginRight: 15,
  },

  flightTextInfo: {
    flexDirection: "column",
    justifyContent: "center",
  },
});
