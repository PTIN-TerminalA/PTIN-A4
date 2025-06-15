import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';


import {makeValoration} from '@/hooks/useValoration';
import { useServiceContext } from '@/contexts/ServiceContext';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedPressable } from '@/components/ThemedPressable';
import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from '@/components/ThemedTextInput';

const RatingScreen = () => {
  const [stars, setStars] = useState('');
  const [comment, setComment] = useState('');
  const { id } = useLocalSearchParams<{ id: string }>();
  const { services } = useServiceContext();
  const service = services?.find((p) => p.id === Number(id));


  const handleSubmit = () => {
    const starNum = parseInt(stars);
    if (isNaN(starNum) || starNum < 1 || starNum > 5) {
      Alert.alert('Error', 'Siusplau ingreseu un nombre entre 1 i 5.');
      return;
    }

    Alert.alert('Valoració enviada', `Estrelles: ${starNum}\nComentaris: ${comment}`);
    if (service){
      makeValoration(service?.id, starNum, comment)
    }
    router.push("..");
  };

  return (
    <View style={styles.container}>
      <ThemedText type = "title">
        Valora {service?.name}
      </ThemedText>
      <Text style={styles.label}>Rating (1-5):</Text>
      <ThemedTextInput
        style={styles.input}
        keyboardType="numeric"
        value={stars}
        onChangeText={setStars}
        placeholder="Ej: 5"
        maxLength={1}
      />

      <Text style={[styles.label]}>Comentaris:</Text>
      <ThemedTextInput
        style={[styles.input, styles.textArea]}
        value={comment}
        onChangeText={setComment}
        placeholder="Escriu els teus comentaris"
        multiline
        numberOfLines={4}
      />

      <ThemedPressable  onPress={handleSubmit} >
        <ThemedText type="bold">
          Confirmar valoració
        </ThemedText>
      </ThemedPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 15,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default RatingScreen;
