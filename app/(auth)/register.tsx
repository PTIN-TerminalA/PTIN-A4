import { ScrollView, StyleSheet, ActivityIndicator, StatusBar, Text, useColorScheme, Alert} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedPressable } from "@/components/ThemedPressable";
import { useState } from "react";
import { SelectList } from 'react-native-dropdown-select-list';
import { useAuth } from "@/hooks/useAuth";
import { createDebouncedAction } from '@/api/Debounce';
import {Colors} from "@/constants/Colors"

export default function RegisterScreen() {
  const [loading, setLoading] = useState(false);
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
  const backgroundColor = useColorScheme() === 'dark' ? Colors.dark.background : Colors.light.background;

  const handleRegister = async (email: string, password: string, confirmPassword: string, name: string, dni: string, phone: string, birthDate: string, gender: string) => {
    // Comprovem si falta algun camp
    if (!email || !password || !confirmPassword || !name || !dni || !phone || !birthDate || !gender) {
      Alert.alert("Error", "Tots els camps són obligatoris");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Les contrasenyes no coincideixen");
      return;
    }

    setLoading(true);
    try {
      await register(email, password, name, dni, phone, birthDate, gender);
    } catch (err) {
      console.error('Error de registre', err);
    } finally {
      setLoading(false);
    }
  };  

  // wrapper debounce per al register
  const debouncedRegister = createDebouncedAction(handleRegister); 

  return (
    <ThemedSafeAreaView style={[styles.container, { backgroundColor }]}>
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
          // style={{width:'100%', alignSelf: 'center', borderRadius: 15}}
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
            borderColor: useColorScheme() === 'dark' ? 'white' : 'black',
            borderWidth: 1, 
            borderRadius: 10, 
            padding: 10, 
            paddingHorizontal: 10,
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
          boxStyles={{
            borderColor: 'transparent',
            paddingHorizontal: 10,
          }}
          arrowicon={<Text style={{ color: Colors.input_text }}>↓</Text>}
          search={false}
        />
        {/********************/}
        {/** BOTÓ DE REGISTRE */}
        <ThemedPressable
          type="button"
          onPress={() => debouncedRegister(email, password, confirmPassword, name, dni, phone, birthDate, gender)}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="lightgrey" /> // Spinner Carregant
          ) : (
            <ThemedText type="bold" style={{textAlign:'center', fontSize:16}}>
              Registra't!
            </ThemedText>
          )}
        </ThemedPressable>

        <ThemedText style={{textAlign:'center', fontSize:10, color: 'lightgray'}}>
          En registrar-te, acceptes les nostres condicions 
          del servei i la política de privadesa
        </ThemedText>
        
        {/** BOTÓ D'INICIAR SESSIÓ */}
        <ThemedPressable 
          type="button_secundari"
          onPress={logout}>
          <ThemedText type="bold" style={{textAlign:'center', fontSize:16}}>
            Iniciar Sessió
          </ThemedText>
        </ThemedPressable>
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
    paddingTop: StatusBar.currentHeight
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 200,
  },
});
