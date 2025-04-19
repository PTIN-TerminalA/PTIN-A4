import { ScrollView, StyleSheet, Button, StatusBar, TextInput, SafeAreaView, Text, Modal, TouchableOpacity, useColorScheme, View, Image, Alert} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedPressable } from "@/components/ThemedPressable";
import { useState } from "react";

export function homepage() {
  router.replace("/(tabs)/profile");
}
export function login() {
  router.replace("/(auth)/login");
}

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [dni, setDni] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");

  const handleRegister = async (email: string, password: string, confirmPassword: string, name: string, dni: string, phone: string, birthDate: string, gender: string) => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Les contrasenyes no coincideixen");
      return;
    }
  
    try {
      // 1: Register the user (create the user and get the access token)
      const userResponse = await fetch("http://192.168.1.13:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          dni,
          email,
          password,
          usertype : 1 // Regular user type
        }),
      });

      const userData = await userResponse.json();
      if (!userResponse.ok) {
        throw new Error(userData.detail || "Error al registrar l'usuari");
      }

      // 2: Decode the access token to extract the user_id (sub)
      const token = userData.access_token;
      const userIdResponse = await fetch(`http://192.168.1.13:8000/api/get_user_id?token=${token}`);
      if (!userIdResponse.ok) {
        const errorData = await userIdResponse.json();
        throw new Error(errorData.detail || "Error obtenint l'ID de l'usuari");
      }
      const userIdData = await userIdResponse.json();
      const userId = userIdData.user_id;
  
      // 3: Register the regular user
      const regularResponse = await fetch("http://192.168.1.13:8000/api/register-regular", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,   // Use the extracted user_id
          phone_num: phone,
          birth_date: birthDate,
          identity: gender,
        }),
      });
      const regularData = await regularResponse.json();
      if (!regularResponse.ok) {
        throw new Error(regularData.detail || "Error al registrar el regular");
      }
  
      Alert.alert("Registre completat", "Usuari registrat correctament");
      homepage();
  
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error de registre", error.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  };  

  return (
    <ThemedSafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <ThemedText type="title" style= {{textAlign:'center', paddingTop: 60,paddingBottom:80}}> 
          Benvingut a Flysy!
        </ThemedText>
        <ThemedText style= {{textAlign:'center', fontWeight:'bold', fontSize:16, paddingBottom: 10,borderEndStartRadius:10}}>
          Registra't
        </ThemedText>
        <ThemedText style= {{textAlign:'center', paddingBottom: 10,borderEndStartRadius:10}}>
          Introdueix les teves dades i crea una contrasenya per registrar-te
        </ThemedText>
        <ThemedTextInput 
          placeholder="email@domain.com"
          placeholderTextColor={'lightgray'}
          autoCorrect={false} 
          autoCapitalize="none"
          onChangeText={setEmail}
        />
        <ThemedTextInput
          placeholder="Contrasenya"
          placeholderTextColor={'lightgray'}
          secureTextEntry 
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={setPassword}
        />
        <ThemedTextInput 
          placeholder="Repeteix Contrasenya"
          placeholderTextColor={'lightgray'}
          secureTextEntry 
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={setConfirmPassword}
        />
        <ThemedTextInput 
          placeholder="Nom"
          placeholderTextColor={'lightgray'}
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={setName}
        />
        <ThemedTextInput 
          placeholder="DNI"
          placeholderTextColor={'lightgray'}
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={setDni}
        />
        <ThemedTextInput 
          placeholder="Telèfon"
          placeholderTextColor={'lightgray'}
          autoCorrect={false} 
          autoCapitalize="none"
          onChangeText={setPhone}
        />
        <ThemedTextInput 
          placeholder="Data de naixement (YYYY-MM-DD)" 
          placeholderTextColor={'lightgray'}
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={setBirthDate}
        />
        <ThemedTextInput 
          placeholder="Gènere" 
          placeholderTextColor={'lightgray'}
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={setGender}
        />
        <ThemedPressable onPress={() => handleRegister(email, password, confirmPassword, name, dni, phone, birthDate, gender)}>
          <ThemedText type="bold" style={{textAlign:'center', fontSize:16}}>
            Registrat!
          </ThemedText>
        </ThemedPressable>
        <ThemedText style={{textAlign:'center', fontSize:10, color: 'lightgray'}}>
          En registrar-te, acceptes les nostres Condicions 
          del servei i la politica de privadesa
        </ThemedText>
        <TouchableOpacity onPress={login}>
          <ThemedText style={{textAlign:'center', fontWeight: 'bold', fontSize:16, marginTop:15}}>
            Iniciar Sessió
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedSafeAreaView>
  );
}
/*
<ThemedText type="title">Això és un títol</ThemedText>
<ThemedText type="subtitle">Això és un subtítol</ThemedText>
<ThemedText type="default">Text per defecte (cos)</ThemedText>
<ThemedText type="defaultSemiBold">Text semi-bold</ThemedText>
<ThemedText type="link">Text d'enllaç</ThemedText>
*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 10,
    paddingTop: 40,
  },
  scrollContainer: {
    padding: 20,
    gap: 10,
    paddingTop: 40,
    paddingBottom: 300,
  },
});
