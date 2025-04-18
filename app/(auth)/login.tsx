import { StyleSheet, Button, StatusBar, TextInput, SafeAreaView, Text, Modal, TouchableOpacity, useColorScheme, View, Image, Alert} from "react-native";
import {useState} from 'react'
import { ThemedText } from '@/components/ThemedText';
import { router } from "expo-router";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedPressable } from "@/components/ThemedPressable";

import {Colors} from "@/constants/Colors"
import {Styles} from "@/constants/Styles"

export function homepage() {
  router.replace("/(tabs)");
}
export function register() {
  router.replace("/(auth)/register");
}



export default function HomeScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch("http://192.168.1.61:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      console.log("logged in! Token:", data.access_token);
    }
    catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert("Login error", error.message);
      }
      else {
        console.error('unknown error', error);
      }
    }
  };


  return (
    <ThemedSafeAreaView style= {{ flex: 1, backgroundColor: "light", paddingTop: '15%'}}>
      <ThemedText type="title" style= {{paddingTop: 70, paddingBottom:40, textAlign:"center", fontSize: 32, lineHeight: 32}}> 
        Flysy
      </ThemedText>
      <ThemedText type="bold" style= {{textAlign:'center', fontSize:16, paddingBottom: 7, borderEndStartRadius:10}}>
        Iniciar sessió
      </ThemedText>
      <ThemedText style= {{ textAlign:'center', paddingBottom: 10,borderEndStartRadius:10, paddingLeft: '10%', paddingRight: '10%'}}>
        Introdueix el teu correu electronic i contrasenya per iniciar sessió
      </ThemedText>
      {/* CAPSA CORREU */}
      <ThemedTextInput
        placeholder="email@domain.com" 
        placeholderTextColor={'lightgray'} 
        autoCorrect={false} 
        autoCapitalize="none"
        onChangeText={setEmail}
      />
      {/* CAPSA CONSTRASENYA */}
      <ThemedTextInput 
        placeholder="Contrasenya"
        placeholderTextColor={'lightgray'} 
        secureTextEntry 
        autoCorrect={false}
        autoCapitalize="none"
        onChangeText={setPassword}
      />
      {/* BOTÓ INICI SESSIÓ */}
      <ThemedPressable onPress={() => handleLogin(email, password)}>
        <ThemedText type="bold" style={{textAlign:'center', fontSize:16}}>
          Iniciar sessió
        </ThemedText>
      </ThemedPressable>
      {/* HR (LÍNIA HORITZONTAL)*/}
      <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 15, marginHorizontal: '5%'}}>
        <View style={{flex: 1, height: 1, backgroundColor: 'lightgrey'}} />
        <ThemedText style={{paddingHorizontal: 10, color: 'grey', fontSize: 16}}>o</ThemedText>
        <View style={{flex: 1, height: 1, backgroundColor: 'lightgrey'}} />
      </View>

      {/* BOTÓ CONTINUA AMB GOOGLE */}
      <ThemedPressable
        onPress={register}
        type="button_alt"
      >
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
          <Image 
            source={require('../../assets/images/Icons/google.png')} 
            style={{width: 24, height: 24, marginRight: 10}}
          />
          <ThemedText type="bold" style={{fontSize:16}}>
            Continua amb Google
          </ThemedText>
        </View>
      </ThemedPressable>
      {/* BOTÓ CONTINUA AMB APPLE */}
      <ThemedPressable
        onPress={register}
        type="button_alt"
      >
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
          <Image 
            source={useColorScheme() === 'dark' 
              ? require('../../assets/images/Icons/apple_white.png')
              : require('../../assets/images/Icons/apple.png')
            } 
            style={{width: 20.22, height: 24, marginRight: 10}}
          />
          <ThemedText type="bold" style={{textAlign:'center', fontSize:16}}>
            Continua amb Apple
          </ThemedText>
        </View>
      </ThemedPressable>
      <ThemedText style= {{ textAlign:'center', paddingBottom: 10,borderEndStartRadius:10, marginLeft: '5%', marginRight: '5%', fontSize: 13, color: 'grey'}}>
        En fer clic a iniciar sessió acceptes les nostres{' '}
        <ThemedText type="bold" style={{color: 'grey'}}>Condicions del servei</ThemedText>{' '} 
        i la{' '}
        <ThemedText type="bold" style={{color: 'grey'}}>Política de privadesa</ThemedText>
      </ThemedText>
      {/* BOTÓ CREA UN COMPTE */}
      <TouchableOpacity onPress={register}>
        <ThemedText type="bold" style={{textAlign:'center', fontSize:16, marginTop:15}}>
          Crea un compte
        </ThemedText>
      </TouchableOpacity>
    </ThemedSafeAreaView>
    
  );
}
const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight
  },
  input:{
    height: 40,
    margin: 20,
    padding: 10,
    borderWidth: 1
  },
});