import { View, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { useState } from 'react';
import { Colors, tintColorDark } from "@/constants/Colors";
import { Styles } from "@/constants/Styles";
import { ThemedPressable } from "@/components/ThemedPressable";

export default function EditNameScreen() {
  const router = useRouter();

  const [newName, setNewName] = useState('');

  const handleChangeName = () => {
    // Lògica backend per actualitzar el nom

    if(newName){
      alert('Nom actualitzat correctament');
      router.replace('/profile'); // Redirigeix directament al perfil
    } else {
      alert('Si us plau, introdueix el nou nom');
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={[{textAlign: 'center'}, {marginBottom: 20}]} type="subtitle">Actualitzar nom</ThemedText>

      <ThemedTextInput
        placeholder="Nou nom"
        value={newName}
        onChangeText={setNewName}
        autoCorrect={false}
        autoCapitalize="words"
      />

      <ThemedPressable type="button" onPress={handleChangeName}>
        <ThemedText type="bold" style={{textAlign:'center', fontSize:16}}>Canviar nom</ThemedText>
      </ThemedPressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
});
//[Styles.button, {backgroundColor: Colors.secundari}, {width: '80%'},{marginTop: 20}]}