import { View, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { useState } from 'react';
import { Colors, tintColorDark } from "@/constants/Colors";
import { Styles } from "@/constants/Styles";
import { ThemedPressable } from "@/components/ThemedPressable";

export default function EditBirthDateScreen() {
  const router = useRouter();

  const [newDate, setNewDate] = useState('');

  const handleChangeDate = () => {
    // Lògica backend per actualitzar la data de naixement

    if(newDate){
      alert('Data de naixement actualitzada correctament');
      router.replace('/profile'); // Redirigeix directament al perfil
    } else {
      alert('Si us plau, introdueix la nova data de naixement');
    }
  }
  const handleFormattedDate = (text: string) => {
    // Eliminá cualquier cosa que no sea número
    const numeric = text.replace(/\D/g, "").slice(0, 8);

    // Formateá como DD/MM/AAAA
    let formatted = numeric;
    if (numeric.length >= 5) {
      formatted = `${numeric.slice(0, 2)}/${numeric.slice(2, 4)}/${numeric.slice(4)}`;
    } else if (numeric.length >= 3) {
      formatted = `${numeric.slice(0, 2)}/${numeric.slice(2)}`;
    }

    setNewDate(formatted);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={[{textAlign: 'center'}, {marginBottom: 20}]} type="subtitle">
        Actualitzar data de naixement
        </ThemedText>

      <ThemedTextInput
        placeholder="DD/MM/AAAA"
        value={newDate}
        onChangeText={handleFormattedDate}
        autoCorrect={false}
        inputMode='numeric'
      />

      <ThemedPressable type="button" onPress={handleChangeDate}>
        <ThemedText type="bold" style={{textAlign:'center', fontSize:16}}>Canviar data</ThemedText>
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
  }
});
//[Styles.button, {backgroundColor: Colors.secundari}, {width: '80%'},{marginTop: 20}]}