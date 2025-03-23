import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: "Inicia sessió" }} />
      <Stack.Screen name="register" options={{ title: "Registra’t" }} />
    </Stack>
  );
}
