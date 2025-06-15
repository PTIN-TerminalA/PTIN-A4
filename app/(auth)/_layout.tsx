import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Inicia sessió", headerShown: false }}
      />
      <Stack.Screen
        name="register"
        options={{ title: "Registra’t", headerShown: false }}
      />
    </Stack>
  );
}
