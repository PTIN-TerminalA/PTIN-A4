import {
  ScrollView,
  View,
  Switch,
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Pressable,
} from "react-native";
import { useAuth } from "@/hooks/useAuth"; // Hook de autenticación
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { Colors, tintColorDark } from "@/constants/Colors";
import { ThemedPressable } from "@/components/ThemedPressable";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Button, IconButton } from "react-native-paper";
import Color from "color";
import { HorizontalDivider } from "@/components/HorizontalDivider";
import React from "react";

export default function ProfileScreen() {
  const { user, logout, deleteAccount } = useAuth(); // Obtiene los datos del usuario autenticado
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme(); // 'light' o 'dark'
  const themedColors = Colors[colorScheme || "light"];

  const fields = [
    {
      label: "NOM",
      value: user?.name || "Nom Usuari",
      onPress: () => router.push("/profilescreens/edit-profile"),
    },
    {
      label: "CORREU ELECTRÒNIC",
      value: user?.email || "email@gmail.com",
      onPress: () => router.push("/profilescreens/edit-profile"),
    },
    {
      label: "DNI",
      value: user?.dni || "*********",
      onPress: () => router.push("/profilescreens/edit-dni"),
    },
    {
      label: "CONTRASENYA",
      value: "**************",
      onPress: () => router.push("/profilescreens/edit-profile"),
    },
    {
      label: "DATA DE NAIXEMENT",
      value: user?.birthDate || "2000-12-12",
      onPress: () => router.push("/profilescreens/edit-profile"),
    },
    {
      label: "TELÈFON",
      value: user?.phone || "+34645108922",
      onPress: () => router.push("/profilescreens/edit-profile"),
    },
    {
      label: "GÈNERE",
      value: user?.gender || "(Desconegut)",
      onPress: () => router.push("/profilescreens/edit-profile"),
    },
  ];

  const backgroundColor =
    colorScheme === "dark" ? Colors.dark.background : Colors.light.background;
  const textColor =
    colorScheme === "dark" ? Colors.dark.text : Colors.light.text;
  const boxBackgroudColor =
    colorScheme === "dark" ? Colors.dark.box : Colors.light.box;

  return (
    <View style={[styles.container]}>
      <View>
        <View
          style={[
            styles.topScreen,
            { paddingTop: insets.top + 8 },
            { backgroundColor: themedColors.box },
          ]}
        >
          <Image
            source={
              user?.avatar
                ? { uri: user.avatar }
                : require("@/assets/images/Icons/user.png")
            }
            style={styles.avatar}
          />
          <View
            style={{ flexDirection: "column", marginLeft: 16, flexShrink: 1 }}
          >
            <ThemedText type="title" numberOfLines={1} ellipsizeMode="tail">
              {user?.name}
            </ThemedText>
            <ThemedText type="subtitle" numberOfLines={1} ellipsizeMode="tail">
              {user?.email}
            </ThemedText>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            { paddingBottom: insets.bottom + 200 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {fields.map(({ label, value, onPress }, index) => (
            <React.Fragment key={index}>
              <View style={styles.box}>
                <View style={styles.boxInfoSection}>
                  <ThemedText style={{ color: textColor }} type="default">
                    {label}
                  </ThemedText>
                  <ThemedText style={{ color: textColor }} type="bold">
                    {value}
                  </ThemedText>
                </View>
                <IconButton
                  icon="chevron-right"
                  onPress={onPress}
                  rippleColor={Color(themedColors.button)
                    .alpha(0.5)
                    .rgb()
                    .string()}
                />
              </View>

              {index !== fields.length - 1 && (
                <HorizontalDivider marginVertical={0} />
              )}
            </React.Fragment>
          ))}

          <Button
            icon="logout"
            onPress={() => router.replace("/(auth)")}
            style={{
              marginTop: 50,
            }}
            rippleColor={Color(themedColors.button).alpha(0.5).rgb().string()}
            labelStyle={{
              color: themedColors.text,
            }}
          >
            Tancar Sessió
          </Button>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /*** ESTIL CAPSA */
  box: {
    width: "100%",
    padding: 15,
    borderRadius: 30,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
  },
  boxInfoSection: {
    flex: 2,
  },
  boxTextContainer: {
    flex: 1,
  },
  boxLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  boxValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 0,
    borderRadius: 10,
    minHeight: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  /********** */
  container: {
    flex: 1,
    position: "relative",
  },
  scrollContainer: {
    padding: 20,
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: Colors.primari,
    resizeMode: "cover",
  },
  topScreen: {
    width: "100%",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
  },
});
