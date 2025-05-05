import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useAuth } from '@/hooks/useAuth'; // Hook de autenticación
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { Styles } from '@/constants/Styles';
import { Colors, tintColorDark } from '@/constants/Colors';
import { ThemedPressable } from "@/components/ThemedPressable";

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
        <View style={[styles.textBox, { marginBottom: 1 }]}>
          <ThemedText style={{color: textColor}} type="default">{user?.birthDate || "2000-12-12"}</ThemedText>
        </View>
        {/* Botó Editar Data de naixement */}
        <ThemedPressable type="button" onPress={() => router.push("/edit-birthdate")}  style={{ marginTop: -15 }}>
          {<ThemedText type="bold" style={{textAlign:'center', fontSize:16}}>Actualitzar data de naixement</ThemedText>}
        </ThemedPressable>

        {/* Capsa DNI */}
        <View style={styles.textBox}>
          <ThemedText style={{color: textColor}} type="default">{user?.dni || "36328819C"}</ThemedText>
        </View>
        {/* Botón Editar DNI */}
        <ThemedPressable type="button" onPress={() => {}} style={{ marginTop: -15 }}>
          <ThemedText type="bold" style={{textAlign:'center', fontSize:16}}>Actualitzar DNI</ThemedText>
        </ThemedPressable>

        {/* Capsa Telèfon */}
        <View style={styles.textBox}>
          <ThemedText style={{color: textColor}} type="default">{user?.phone || "+34645108922"}</ThemedText>
        </View>
        {/* Botón Editar Telèfon */}
        <ThemedPressable type="button" onPress={() => {}} style={{ marginTop: -15 }}>
          <ThemedText type="bold" style={{textAlign:'center', fontSize:16}}>Actualitzar telèfon</ThemedText>
        </ThemedPressable>

        {/* Capsa Gènere */}
        <View style={styles.textBox}>
          <ThemedText style={{color: textColor}} type="default">{user?.gender || "(Desconegut)"}</ThemedText>
        </View>
        {/* Botón Editar Gènere */}
        <ThemedPressable type="button" onPress={() => {}} style={{ marginTop: -15 }}>
          <ThemedText type="bold" style={{textAlign:'center', fontSize:16}}>Actualitzar gènere</ThemedText>
        </ThemedPressable>

        {/* Botó Editar Nom */}
        <ThemedPressable type="button" onPress={() => router.push("/edit-name")}>
          <ThemedText type="bold" style={{textAlign:'center', fontSize:16}}>Actualitzar nom</ThemedText>
        </ThemedPressable>

        {/* Botón Editar Correu */}
        <ThemedPressable type="button" onPress={() => {}}>
          <ThemedText type="bold" style={{textAlign:'center', fontSize:16}}>Actualitzar correu</ThemedText>
        </ThemedPressable>

        {/* Botón Editar Contrasenya */}
        <ThemedPressable type="button" onPress={() => router.push("/edit-password")}>
          <ThemedText type="bold" style={{textAlign:'center', fontSize:16}}>Actualitzar contrasenya</ThemedText>
        </ThemedPressable>

        {/* Botón de Cerrar Sesión */}
        <ThemedPressable type="button_secundari" onPress={logout}>
          <ThemedText type="bold" style={{textAlign:'center', fontSize:16}}>Tancar sessió</ThemedText>
        </ThemedPressable>
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
    gap: 18,
    paddingTop: 40,
    paddingBottom: 160,
  },
  header: {
    backgroundColor: Colors.primari,
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
  textBox: {
    backgroundColor: 'transparent',
    padding: 5,
    paddingVertical: 10, // más altura
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 10,
    width: '90%',
    borderColor: Colors.primari,
    borderWidth: 1,
    alignItems: 'center',
  },
});
