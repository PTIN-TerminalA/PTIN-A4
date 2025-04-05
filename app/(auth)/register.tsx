import { Button, StyleSheet, TextInput } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";

export function homepage() {
  router.replace("/(tabs)/profile");
}

export default function RegisterScreen() {
  return (
    <ThemedSafeAreaView style={styles.container}>
      <ThemedText type="title" style= {{textAlign:'center', paddingTop: 60,paddingBottom:80}}> 
        Benvingut a Flysy!
      </ThemedText>
      <ThemedText style= {{textAlign:'center', fontWeight:'bold', fontSize:16, paddingBottom: 10,borderEndStartRadius:10}}>
        Registrat
      </ThemedText>
      <ThemedText style= {{textAlign:'center', paddingBottom: 10,borderEndStartRadius:10}}>
        Introdueix el teu correu electronic i crea una contrasenya per registrar-te
      </ThemedText>
      <TextInput 
        style={styles.input} 
        placeholder="email@domain.com" 
        autoCorrect={false} 
        autoCapitalize="none"
      />
      <TextInput 
        style={styles.input} 
        placeholder="Contrasenya" 
        secureTextEntry 
        autoCorrect={false}
        autoCapitalize="none"
      />
      <TextInput 
        style={styles.input} 
        placeholder="Repeteix Contrasenya" 
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
        title="Registrat!"
      />
      <ThemedText style={{textAlign:'center', fontSize:10, color: 'lightgray'}}>
        En registrar-te, acceptes les nostres Condicions 
        del servei i la politica de privadesa
      </ThemedText>
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
  input:{
    height: 40,
    margin: 20,
    padding: 10,
    borderWidth: 1
  },
});
