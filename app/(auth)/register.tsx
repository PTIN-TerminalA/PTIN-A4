import { ScrollView, StyleSheet, Button, StatusBar, TextInput, SafeAreaView, Text, Modal, TouchableOpacity, useColorScheme, View, Image, Alert} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedPressable } from "@/components/ThemedPressable";
import { useState } from "react";
import { SelectList } from 'react-native-dropdown-select-list';
import { useAuth } from "@/hooks/useAuth";
import {Colors} from "@/constants/Colors"

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [dni, setDni] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const { register, logout } = useAuth();
  const inputText = useColorScheme() === 'dark' ? Colors.dark.text : Colors.light.text;

  const handleRegister = async (email: string, password: string, confirmPassword: string, name: string, dni: string, phone: string, birthDate: string, gender: string) => {
    // Comprovem si falta algun camp
    if (!email) {
      Alert.alert("Error", "Falta el camp: correu electrònic");
      return;
    }
    if (!password) {
      Alert.alert("Error", "Falta el camp: contrasenya");
      return;
    }
    if (!confirmPassword) {
      Alert.alert("Error", "Falta el camp: confirmar contrasenya");
      return;
    }
    if (!name) {
      Alert.alert("Error", "Falta el camp: nom");
      return;
    }
    if (!dni) {
      Alert.alert("Error", "Falta el camp: DNI");
      return;
    }
    if (!phone) {
      Alert.alert("Error", "Falta el camp: telèfon");
      return;
    }
    if (!birthDate) {
      Alert.alert("Error", "Falta el camp: data de naixement");
      return;
    }
    if (!gender) {
      Alert.alert("Error", "Falta el camp: gènere");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Les contrasenyes no coincideixen");
      return;
    }
  
    try {
      // 1: Register the user (create the user and get the access token)
      const userResponse = await fetch("http://192.168.1.61:8000/api/register", {
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
      const userIdResponse = await fetch(`http://192.168.1.61:8000/api/get_user_id?token=${token}`);
      if (!userIdResponse.ok) {
        const errorData = await userIdResponse.json();
        throw new Error(errorData.detail || "Error obtenint l'ID de l'usuari");
      }
      const userIdData = await userIdResponse.json();
      const userId = userIdData.user_id;
  
      // 3: Register the regular user
      const regularResponse = await fetch("http://192.168.1.61:8000/api/register-regular", {
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
      // login(email);
      register(name, email, dni, phone, birthDate, gender);  
  
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
          placeholderTextColor={Colors.input_text}
          autoCorrect={false} 
          autoCapitalize="none"
          onChangeText={setEmail}
        />
        <ThemedTextInput
          placeholder="Contrasenya"
          placeholderTextColor={Colors.input_text}
          secureTextEntry 
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={setPassword}
        />
        <ThemedTextInput 
          placeholder="Repeteix Contrasenya"
          placeholderTextColor={Colors.input_text}
          secureTextEntry 
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={setConfirmPassword}
        />
        <ThemedTextInput 
          placeholder="Nom"
          placeholderTextColor={Colors.input_text}
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={setName}
        />
        <ThemedTextInput 
          placeholder="DNI"
          placeholderTextColor={Colors.input_text}
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={setDni}
        />
        <ThemedTextInput 
          placeholder="Telèfon"
          placeholderTextColor={Colors.input_text}
          autoCorrect={false} 
          autoCapitalize="none"
          onChangeText={setPhone}
        />
        <ThemedTextInput 
          placeholder="Data de naixement (YYYY-MM-DD)" 
          placeholderTextColor={Colors.input_text}
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={setBirthDate}
        />
        {/* DESPLEGABLE DEL GÈNERE */}
        <SelectList
          setSelected={setGender}
          data={[
            { key: 'male', value: 'Masculí' },
            { key: 'female', value: 'Femení' },
            { key: 'other', value: 'Altre' },
            { key: 'rather_not_to_say', value: 'Prefereixo no dir' }
          ]}
          save="key"
          defaultOption={{ key: gender, value: '' }}
          placeholder="Selecciona Gènere"
          inputStyles={{
            color: gender ? inputText : Colors.input_text,
            borderColor: 'white',
            borderWidth: 1, 
            borderRadius: 10, 
            padding: 6, 
            height: 50,
            width: '90%',
            justifyContent: 'center', 
          }}
          dropdownStyles={{
            backgroundColor: 'lightgrey', 
            borderWidth: 1, 
            borderRadius: 10, 
          }}
          dropdownTextStyles={{
            color: 'white', 
          }}
          arrowicon={<Text style={{ color: Colors.input_text }}>↓</Text>} 
          search={false}
        />
        {/********************/}
        <ThemedPressable onPress={() => handleRegister(email, password, confirmPassword, name, dni, phone, birthDate, gender)}>
          <ThemedText type="bold" style={{textAlign:'center', fontSize:16}}>
            Registra't!
          </ThemedText>
        </ThemedPressable>
        <ThemedText style={{textAlign:'center', fontSize:10, color: 'lightgray'}}>
          En registrar-te, acceptes les nostres condicions 
          del servei i la política de privadesa
        </ThemedText>
        <TouchableOpacity onPress={logout}>
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
