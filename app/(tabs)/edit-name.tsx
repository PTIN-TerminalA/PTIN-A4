import { View, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { useState } from 'react';

export default function EditNameScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#121212' : '#fff';

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
    <View style={[styles.container, {backgroundColor}]}>
      <ThemedText style={{color: '#fff', textAlign: 'center'}} type="subtitle">Actualitzar nom</ThemedText>

      <ThemedTextInput
        placeholder="Nou nom"
        value={newName}
        onChangeText={setNewName}
        autoCorrect={false}
        autoCapitalize="words"
        style={styles.input}
      />

      <TouchableOpacity style={styles.confirmButton} onPress={handleChangeName}>
        <ThemedText style={{color: '#fff'}} type="defaultSemiBold">Canviar nom</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  confirmButton: {
    backgroundColor: '#023047',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    textAlign: 'center',
  }
});
