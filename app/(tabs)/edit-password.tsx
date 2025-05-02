import { View, Text, Image, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { useState } from 'react';
import { Colors, tintColorDark } from "@/constants/Colors"
import { Styles } from "@/constants/Styles"
import { ThemedPressable } from "@/components/ThemedPressable";

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
      <ThemedText style={{color: tintColorDark}} type="subtitle">Actualitzar contrasenya</ThemedText>
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

      <ThemedPressable type="button" onPress={handleChangePassword}>
        <ThemedText type="bold" style={{textAlign:'center', fontSize:16}}>Canviar contrasenya</ThemedText>
      </ThemedPressable>
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
});
