import { View, Text, Image, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { useState } from 'react';
import { Colors } from "@/constants/Colors"
import { Styles } from "@/constants/Styles"

export default function ProfileScreen() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleChangePassword = () => {
    //backend
    
    if(currentPassword && newPassword){
      alert('Contrasenya actualitzada correctament');
      router.back();
    }else {
      alert('Si us plau completa tots els camps');
    }
  }

  return (
    
    <ThemedView style={styles.container}> 
      <ThemedText style={{color: '#fff'}} type="subtitle">Actualitzar contrasenya</ThemedText>
      <ThemedTextInput style={Styles.textInput}
              placeholder="Anterior contrasenya" 
              secureTextEntry 
              value={currentPassword}
              onChangeText={setCurrentPassword}
              autoCorrect={false}
              autoCapitalize="none"
      />

      <ThemedTextInput style={Styles.textInput}
              placeholder="Nova contrasenya" 
              secureTextEntry 
              value={newPassword}
              onChangeText={setNewPassword}
              autoCorrect={false}
              autoCapitalize="none"
      />

      <TouchableOpacity style={styles.confirmButton} onPress={handleChangePassword}>
        <ThemedText style={{color: '#fff'}} type="defaultSemiBold">Canviar contrasenya</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 20
  },
  confirmButton: {
      ...Styles.button,
      backgroundColor: Colors.secundari,
      marginTop: 20,
      width: '80%',
  },
});
