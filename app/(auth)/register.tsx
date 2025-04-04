import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function RegisterScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Això és un títol</ThemedText>
      <ThemedText type="subtitle">Això és un subtítol</ThemedText>
      <ThemedText type="default">Text per defecte (cos)</ThemedText>
      <ThemedText type="defaultSemiBold">Text semi-bold</ThemedText>
      <ThemedText type="link">Text d'enllaç</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 10,
    paddingTop: 40,
  },
});
