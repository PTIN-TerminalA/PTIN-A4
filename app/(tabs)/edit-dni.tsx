import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { ThemedPressable } from '@/components/ThemedPressable';
import { useAuth } from '@/hooks/useAuth';
import { updateDni } from '@/api/auth';
import { Colors } from '@/constants/Colors';

export default function EditDniScreen() {
  const { user, token } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const [dni, setDni] = useState(user?.dni || '');

  const inputTextColor =
    colorScheme === 'dark' ? Colors.dark.text : Colors.light.text;
  const backgroundColor =
    colorScheme === 'dark' ? Colors.dark.background : Colors.light.background;

  const handleSave = async () => {
    if (!dni) {
      Alert.alert('Error', 'Si us plau, introdueix el teu DNI');
      return;
    }

    try {
      if (!token) {
        throw new Error('No autenticat');
      }

      await updateDni(token, dni);
      Alert.alert('Èxit', 'DNI actualitzat correctament');
      router.replace('/profile');
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedSafeAreaView style={[styles.container, { backgroundColor }]}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <ThemedText
            type="title"
            style={{ textAlign: 'center', paddingTop: 60, paddingBottom: 50 }}
          >
            Editar DNI
          </ThemedText>

          <ThemedTextInput
            placeholder="DNI"
            placeholderTextColor={Colors.input_text}
            value={dni}
            onChangeText={setDni}
            style={styles.textInput}
            autoCapitalize="none"
          />

          <ThemedPressable type="button" onPress={handleSave} style={styles.button}>
            <ThemedText type="bold" style={{ textAlign: 'center', fontSize: 16 }}>
              Desa Canvis
            </ThemedText>
          </ThemedPressable>
        </ScrollView>
      </ThemedSafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: StatusBar.currentHeight,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 0,
    borderRadius: 10,
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    paddingLeft: 10,
    height: 50,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
  },

});