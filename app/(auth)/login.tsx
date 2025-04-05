import { StyleSheet, Button, StatusBar, TextInput, SafeAreaView, Text, Modal, TouchableOpacity } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { router } from "expo-router";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedTextInput } from "@/components/ThemedTextInput";

export function homepage() {
  router.replace("/(tabs)/profile");
}
export function register() {
  router.replace("/(auth)/register");
}
export default function HomeScreen() {
  return (
    <ThemedSafeAreaView style= {{ flex: 1, backgroundColor: "light", padding: 60}}>
      <ThemedText type="title" style= {{paddingTop: 60,paddingBottom:80}}> 
        Benvingut a Flysy!
      </ThemedText>
      <ThemedText style= {{textAlign:'center', fontWeight:'bold', fontSize:16, paddingBottom: 10,borderEndStartRadius:10}}>
        Iniciar sessió
      </ThemedText>
      <ThemedText style= {{ textAlign:'center', paddingBottom: 10,borderEndStartRadius:10}}>
        Introdueix el teu correu electronic i contrasenya per iniciar sessió
      </ThemedText>
      <ThemedTextInput
        placeholder="email@domain.com" 
        autoCorrect={false} 
        autoCapitalize="none"
      />
      <ThemedTextInput 
        placeholder="Contrasenya" 
        secureTextEntry 
        autoCorrect={false}
        autoCapitalize="none"
      />
      <Button
        nextFocusDown={40}
        onPress={() => {
            console.log('Registre Completat!');
            homepage();
        }}
        title="Iniciar Sessió"
      />
      <ThemedText style={{textAlign:'center', fontSize:10, color: 'lightgray'}}>
        En fer clic a iniciar sessió, acceptes les nostres Condicions 
        del servei i la politica de privadesa
      </ThemedText>
      <TouchableOpacity onPress={register}>
        <ThemedText style={{textAlign:'center', fontWeight: 'bold', fontSize:16, marginTop:15}}>
          Crear un compte
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
  box:{
    height: 40,
    backgroundColor: 'lightgray',
    textAlign: 'center',
    textAlignVertical: 'center',
    margin: 5
  }

});