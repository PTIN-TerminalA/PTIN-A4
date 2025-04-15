import { View, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { useState } from 'react';
import { Colors } from "@/constants/Colors"
import { Styles } from "@/constants/Styles"

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
        style={Styles.textInput}
      />

      <TouchableOpacity style={styles.confirmButton} onPress={handleChangeName}>
        <ThemedText style={{color: '#fff'}} type="defaultSemiBold">Canviar nom</ThemedText>
      </TouchableOpacity>
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
  confirmButton: {
    ...Styles.button,
    backgroundColor: Colors.secundari,
    marginTop: 20,
    width: '80%',
  },
});
//[Styles.button, {backgroundColor: Colors.secundari}, {width: '80%'},{marginTop: 20}]}