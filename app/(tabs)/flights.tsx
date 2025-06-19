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
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { useState } from "react";
import { Colors } from "@/constants/Colors";
import { BoardingPasses } from "@/flightData/boardingPassesInfoTest";
import { AnimatedFAB, FAB } from "react-native-paper";

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
        <View style={{ height: 15 }} />

        <View style={styles.boardingPassList}>
          {BoardingPasses.map((boardingPass) => (
            <TouchableOpacity
              key={boardingPass.id}
              onPress={() => handlerBoardingPassPress(boardingPass.id)}
              style={[
                styles.flightBox,
                { backgroundColor: boxColor, borderColor },
              ]}
            >
              <Image
                source={boardingPass.airlineImage}
                style={[styles.airlineImage, { borderColor: boxColor }]}
              />
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
          ))}
        </View>

        <View style={{ height: 150 }} />
      </ScrollView>
      {/* Botó per escannejar */}
      {/*<FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: buttonColor }]}
        onPress={() => onPressScanner()}
        color={buttonIcon}
        size={"large"}
        visible={showText}
      />*/}
      <AnimatedFAB
        icon={"plus"}
        label={"Afegeix un pase"}
        extended={showText}
        onPress={() => console.log("Pressed")}
        animateFrom={"right"}
        style={[styles.fab, { backgroundColor: buttonColor }]}
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
    alignSelf: "center",
    width: "100%",
    padding: 15,
  },

  flightBox: {
    width: "90%",
    height: 85,
    borderWidth: 1,
    marginBottom: 30,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 30,
  },

  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 16,
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

  boardingPassList: {
    alignItems: "center",
    width: "100%",
  },
});
