import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
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
      <View style={[styles.header, { padding: 10 }]}>
        <Image 
          source={user?.avatar ? { uri: user.avatar } : require('@/assets/images/Icons/user.png') } 
          style={styles.avatar} 
        />
        <ThemedText style={{color: '#fff'}} type="subtitle">{user?.name || "Nom"}</ThemedText>
        <ThemedText style={{color: '#fff'}} type="default">{user?.email || "email@gmail.com"}</ThemedText>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Capsa Data de naixement */}
        <View style={styles.textBox}>
          <ThemedText style={{color: Colors.primari}} type="defaultSemiBold">{user?.birthDate || "2000-12-12"}</ThemedText>
        </View>
        {/* Botó Editar Data de naixement */}
        <TouchableOpacity style={styles.editButton} onPress={() => router.push("/edit-birthdate")}>
          <ThemedText style={{color: '#fff'}} type="defaultSemiBold">Actualitzar data naixement</ThemedText>
        </TouchableOpacity>

        {/* Capsa DNI */}
        <View style={styles.textBox}>
          <ThemedText style={{color: Colors.primari}} type="defaultSemiBold">{user?.dni || "36328819C"}</ThemedText>
        </View>
        {/* Botón Editar DNI */}
        <TouchableOpacity style={styles.editButton} onPress={() => {}}>
          <ThemedText style={{color: '#fff'}} type="defaultSemiBold">Actualitzar DNI</ThemedText>
        </TouchableOpacity>

        {/* Capsa Telèfon */}
        <View style={styles.textBox}>
          <ThemedText style={{color: Colors.primari}} type="defaultSemiBold">{user?.phone || "+34645108922"}</ThemedText>
        </View>
        {/* Botón Editar Telèfon */}
        <TouchableOpacity style={styles.editButton} onPress={() => {}}>
          <ThemedText style={{color: '#fff'}} type="defaultSemiBold">Actualitzar telèfon</ThemedText>
        </TouchableOpacity>

        {/* Capsa Gènere */}
        <View style={styles.textBox}>
          <ThemedText style={{color: Colors.primari}} type="defaultSemiBold">{user?.gender || "(Desconegut)"}</ThemedText>
        </View>
        {/* Botón Editar Gènere */}
        <TouchableOpacity style={styles.editButton} onPress={() => {}}>
          <ThemedText style={{color: '#fff'}} type="defaultSemiBold">Actualitzar gènere</ThemedText>
        </TouchableOpacity>

        {/* Botó Editar Nom */}
        <TouchableOpacity style={styles.editButton} onPress={() => router.push("/edit-name")}>
          <ThemedText style={{color: '#fff'}} type="defaultSemiBold">Actualitzar nom</ThemedText>
        </TouchableOpacity>

        {/* Botón Editar Correu */}
        <TouchableOpacity style={styles.editButton} onPress={() => {}}>
          <ThemedText style={{color: '#fff'}} type="defaultSemiBold">Actualitzar correu</ThemedText>
        </TouchableOpacity>

        {/* Botón Editar Contrasenya */}
        <TouchableOpacity style={styles.editButton} onPress={() => router.push("/edit-password")}>
          <ThemedText style={{color: '#fff'}} type="defaultSemiBold">Actualitzar contrasenya</ThemedText>
        </TouchableOpacity>

        {/* Botón de Cerrar Sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <ThemedText style={{color: '#fff'}} type="defaultSemiBold">Log Out</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    padding: 20,
    gap: 10,
    paddingTop: 40,
    paddingBottom: 150,
  },
  header: {
    backgroundColor: Colors.secundari,
    alignItems: 'center',
    paddingVertical: 60,
    height: 250,
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
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  textBox: {
    ...Styles.button,
    backgroundColor: '#FFFFFF',
    padding: 5,
    borderRadius: 1,
    alignSelf: 'center',
    marginTop: 10,
    width: '80%',
    borderColor: Colors.primari,
    borderWidth: 1,
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
