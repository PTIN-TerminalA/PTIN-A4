import { View, Text, Image, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { useState } from 'react';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme(); 
  const backgroundColor = colorScheme === 'dark' ? '#121212' : '#fff';

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
    <View style={[styles.container, {backgroundColor}]}>
      <ThemedText style={{color: '#fff'}} type="subtitle">Actualitzar contrasenya</ThemedText>
      <ThemedTextInput 
              placeholder="Anterior contrasenya" 
              secureTextEntry 
              value={currentPassword}
              onChangeText={setCurrentPassword}
              autoCorrect={false}
              autoCapitalize="none"
      />

      <ThemedTextInput 
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignContent: 'center',
    justifyContent: 'space-evenly',
    padding: 20
  },
  confirmButton: {
    backgroundColor: '#023047',
    padding: 12,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 15,
    width: '80%',
    alignItems: 'center',
  },
});
