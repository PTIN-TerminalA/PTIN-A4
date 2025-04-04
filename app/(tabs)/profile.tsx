import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '@/hooks/useAuth'; // Hook de autenticación
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user, logout } = useAuth(); // Obtiene los datos del usuario autenticado
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Sección superior con fondo degradado */}
      <View style={styles.header}>
        <Image 
          source={user?.avatar ? { uri: user.avatar } : require('@/assets/images/Icons/user.png') } 
          style={styles.avatar} 
        />
        <Text style={styles.name}>{user?.name || "Nom"}</Text>
        <Text style={styles.email}>{user?.email || "email@gmail.com"}</Text>
      </View>

      {/* Botón Editar Perfil */}
      <TouchableOpacity style={styles.editButton} onPress={() => alert('Edita el perfil')}>
        <Text style={styles.editButtonText}>Edita el perfil</Text>
      </TouchableOpacity>

      {/* Botón de Cerrar Sesión */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
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
    backgroundColor: '#023047',
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
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  email: {
    fontSize: 16,
    color: '#8ECAE6',
  },
  editButton: {
    backgroundColor: '#219EBC',
    padding: 12,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 30,
    width: '80%',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#023047',
    padding: 12,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 15,
    width: '80%',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
