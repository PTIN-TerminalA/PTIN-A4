import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useAuth } from '@/hooks/useAuth'; // Hook de autenticación
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { Styles } from '@/constants/Styles';
import { Colors, tintColorDark } from '@/constants/Colors';

export default function ProfileScreen() {
  const { user, logout } = useAuth(); // Obtiene los datos del usuario autenticado
  const router = useRouter();
  const colorScheme = useColorScheme(); // 'light' o 'dark'
  const backgroundColor = colorScheme === 'dark' ? Colors.dark.background : Colors.light.background;
  const textColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text;

  return (
    <View style={[styles.container, {backgroundColor}]}>
      {/* Sección superior */}
      <View style={[styles.header, { padding: 10 }]}>
        <Image 
          source={user?.avatar ? { uri: user.avatar } : require('@/assets/images/Icons/user.png') } 
          style={styles.avatar} 
        />
        <ThemedText style={{color: tintColorDark}} type="subtitle">{user?.name || "Nom"}</ThemedText>
        <ThemedText style={{color: tintColorDark}} type="default">{user?.email || "email@gmail.com"}</ThemedText>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Capsa Data de naixement */}
        <View style={styles.textBox}>
          <ThemedText style={{color: textColor}} type="defaultSemiBold">{user?.birthDate || "2000-12-12"}</ThemedText>
        </View>
        {/* Botó Editar Data de naixement */}
        <TouchableOpacity style={styles.editButton} onPress={() => router.push("/edit-birthdate")}>
          <ThemedText style={{color: textColor}} type="defaultSemiBold">Actualitzar data naixement</ThemedText>
        </TouchableOpacity>

        {/* Capsa DNI */}
        <View style={styles.textBox}>
          <ThemedText style={{color: textColor}} type="defaultSemiBold">{user?.dni || "36328819C"}</ThemedText>
        </View>
        {/* Botón Editar DNI */}
        <TouchableOpacity style={styles.editButton} onPress={() => {}}>
          <ThemedText style={{color: textColor}} type="defaultSemiBold">Actualitzar DNI</ThemedText>
        </TouchableOpacity>

        {/* Capsa Telèfon */}
        <View style={styles.textBox}>
          <ThemedText style={{color: textColor}} type="defaultSemiBold">{user?.phone || "+34645108922"}</ThemedText>
        </View>
        {/* Botón Editar Telèfon */}
        <TouchableOpacity style={styles.editButton} onPress={() => {}}>
          <ThemedText style={{color: textColor}} type="defaultSemiBold">Actualitzar telèfon</ThemedText>
        </TouchableOpacity>

        {/* Capsa Gènere */}
        <View style={styles.textBox}>
          <ThemedText style={{color: textColor}} type="defaultSemiBold">{user?.gender || "(Desconegut)"}</ThemedText>
        </View>
        {/* Botón Editar Gènere */}
        <TouchableOpacity style={styles.editButton} onPress={() => {}}>
          <ThemedText style={{color: textColor}} type="defaultSemiBold">Actualitzar gènere</ThemedText>
        </TouchableOpacity>

        {/* Botó Editar Nom */}
        <TouchableOpacity style={styles.editButton} onPress={() => router.push("/edit-name")}>
          <ThemedText style={{color: textColor}} type="defaultSemiBold">Actualitzar nom</ThemedText>
        </TouchableOpacity>

        {/* Botón Editar Correu */}
        <TouchableOpacity style={styles.editButton} onPress={() => {}}>
          <ThemedText style={{color: textColor}} type="defaultSemiBold">Actualitzar correu</ThemedText>
        </TouchableOpacity>

        {/* Botón Editar Contrasenya */}
        <TouchableOpacity style={styles.editButton} onPress={() => router.push("/edit-password")}>
          <ThemedText style={{color: textColor}} type="defaultSemiBold">Actualitzar contrasenya</ThemedText>
        </TouchableOpacity>

        {/* Botón de Cerrar Sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <ThemedText style={{color: textColor}} type="defaultSemiBold">Log Out</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
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
    borderColor: tintColorDark,
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
    backgroundColor: 'transparent',
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
    backgroundColor: Colors.primari,
    padding: 12,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 15,
    width: '80%',
    alignItems: 'center',
  },
});
