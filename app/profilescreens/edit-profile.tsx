import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
  Keyboard,
  useColorScheme,
  TouchableWithoutFeedback,
  Text,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { ThemedPressable } from '@/components/ThemedPressable';
import { SelectList } from 'react-native-dropdown-select-list';
import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/constants/Colors';

const genderOptions = [
  { key: 'male', value: 'Masculí' },
  { key: 'female', value: 'Femení' },
  { key: 'other', value: 'Altre' },
  { key: 'rather_not_to_say', value: 'Prefereixo no dir' },
];

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [birthDate, setBirthDate] = useState(user?.birthDate || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [gender, setGender] = useState(user?.gender || '');

  const inputText =
    useColorScheme() === 'dark' ? Colors.dark.text : Colors.light.text;
  const backgroundColor =
    useColorScheme() === 'dark'
      ? Colors.dark.background
      : Colors.light.background;

  const defaultGenderOption = genderOptions.find((option) => option.key === gender);

  const handleSave = async () => {
    if (!name || !birthDate || !phone || !gender) {
      Alert.alert('Error', 'Si us plau, omple tots els camps');
      return;
    }

    try {
      await updateProfile(name, birthDate, phone, gender);
      Alert.alert('Èxit', 'Perfil actualitzat correctament');
      router.replace('/profile');
    } catch (error) {
      Alert.alert('Error al actualitzar perfil', (error as Error).message);
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
            Editar Perfil
          </ThemedText>

          <ThemedTextInput
            placeholder="Nom"
            placeholderTextColor={Colors.input_text}
            value={name}
            onChangeText={setName}
            autoCapitalize="words" 
            style={styles.textInput}
          />

          <ThemedTextInput
            placeholder="Data de naixement (YYYY-MM-DD)"
            placeholderTextColor={Colors.input_text}
            value={birthDate}
            onChangeText={setBirthDate} 
            style={styles.textInput} 
            keyboardType="numeric"
          />

          <ThemedTextInput
            placeholder="Telèfon"
            placeholderTextColor={Colors.input_text}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad" 
            style={styles.textInput}
          />

          <SelectList
            setSelected={setGender}
            data={genderOptions}
            save="key"
            defaultOption={defaultGenderOption}
            placeholder="Selecciona Gènere"
            inputStyles={{
              color: gender ? inputText : Colors.input_text,
              borderColor: useColorScheme() === 'dark' ? 'white' : 'black',
              borderWidth: 1,
              borderRadius: 10,
              padding: 15,
              height: 50,
              width: '90%',
              alignSelf: 'center',
              margin: -10,
            }}
            dropdownStyles={{
              backgroundColor: 'lightgrey',
              borderWidth: 1,
              borderRadius: 10,
            }}
            dropdownTextStyles={{
              color: 'black',
            }}
            boxStyles={{
              borderColor: 'transparent',
              paddingHorizontal: 10,
              marginVertical: 15,
            }}
            arrowicon={<Text style={{ color: Colors.input_text }}>↓</Text>}
            search={false}
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
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    paddingLeft: 10,
    height: 50,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
  },
});
