import { View, Text, Image, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useAuth } from '@/hooks/useAuth'; // Hook de autenticación
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { Styles } from '@/constants/Styles';
import { Colors } from '@/constants/Colors';

export default function ProfileScreen() {
  const { user, logout } = useAuth(); // Obtiene los datos del usuario autenticado
  const router = useRouter();
  const colorScheme = useColorScheme(); // 'light' o 'dark'
  const backgroundColor = colorScheme === 'dark' ? '#121212' : '#fff';

  return (
    <View style={[styles.container, {backgroundColor}]}>
      {/* Sección superior */}
      <View style={styles.header}>
        <Image 
          source={user?.avatar ? { uri: user.avatar } : require('@/assets/images/Icons/user.png') } 
          style={styles.avatar} 
        />
        <ThemedText style={{color: '#fff'}} type="subtitle">{user?.name || "Nom"}</ThemedText>
        <ThemedText style={{color: '#fff'}} type="default">{user?.email || "email@gmail.com"}</ThemedText>
      </View>

      {/* Botón Editar Perfil */}
      <TouchableOpacity style={styles.editButton} onPress={() => router.push("/edit-password")}>
        <ThemedText style={{color: '#fff'}} type="defaultSemiBold">Actualitzar contrasenya</ThemedText>
      </TouchableOpacity>

      {/* Botó Actualitzar Nom */}
      <TouchableOpacity style={styles.editButton} onPress={() => router.push("/edit-name")}>
        <ThemedText style={{color: '#fff'}} type="defaultSemiBold">Actualitzar nom</ThemedText>
      </TouchableOpacity>

      {/* Botó Actualitzar Data de naixement */}
      <TouchableOpacity style={styles.editButton} onPress={() => router.push("/edit-birthdate")}>
        <ThemedText style={{color: '#fff'}} type="defaultSemiBold">Actualitzar data naixement</ThemedText>
      </TouchableOpacity>

      {/* Botón de Cerrar Sesión */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <ThemedText style={{color: '#fff'}} type="defaultSemiBold">Log Out</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: Colors.secundari,
    alignItems: 'center',
    paddingVertical: 100,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginBottom: 10,
    resizeMode: 'cover'
  },
  editButton: {
    ...Styles.button,
    backgroundColor: Colors.primari,
    padding: 12,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 30,
    width: '80%',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: Colors.secundari,
    padding: 12,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 15,
    width: '80%',
    alignItems: 'center',
  },
});
