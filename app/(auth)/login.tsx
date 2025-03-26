import { StyleSheet, Button, StatusBar, TextInput, SafeAreaView, Text, Modal } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { NavigationContainer } from '@react-navigation/native';
//import { createStackNavigator } from '@react-navigation/stack';
export default function HomeScreen() {
    return (
      <SafeAreaView style= {{ flex: 1, backgroundColor: "light", padding: 60}}>
        <ThemedText type="title" style= {{paddingTop: 60,paddingBottom:80}}> 
          Benvingut a Flysy!
        </ThemedText>
        <Text style= {{textAlign:'center', fontWeight:'bold', fontSize:16, paddingBottom: 10,borderEndStartRadius:10}}>
          Iniciar sessió
        </Text>
        <Text style= {{textAlign:'center', paddingBottom: 10,borderEndStartRadius:10}}>
          Introdueix el teu correu electronic i contrasenya per iniciar sessió
        </Text>
        <TextInput 
          style={style.input} 
          placeholder="email@domain.com" 
          autoCorrect={false} 
          autoCapitalize="none"
        />
        <TextInput 
          style={style.input} 
          placeholder="Contrasenya" 
          secureTextEntry 
          autoCorrect={false}
          autoCapitalize="none"
        />
        
        <Button
          nextFocusDown={40}
          onPress={() => {
              console.log('Registre Completat!');
          }}
          title="Iniciar Sessió"
        />
        <Text style={{padding: 10, alignSelf:'center'}}>
          ---------------------o---------------------
        </Text>
        <Text style={style.box}>
          Continua amb Google
        </Text>
        <Text style={style.box}>
          Continua amb Apple
        </Text>
        <Text style={{textAlign:'center', fontSize:10, color: 'lightgray'}}>
          En fer clic a iniciar sessió, acceptes les nostres Condicions 
          del servei i la politica de privadesa
        </Text>
        <Text style={{textAlign:'center', fontWeight: 'bold', fontSize:16, marginTop:15}}>
          Crear compte
        </Text>

      </SafeAreaView>
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