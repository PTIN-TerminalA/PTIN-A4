import { ScrollView, View, Switch, Image, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useAuth } from '@/hooks/useAuth'; // Hook de autenticación
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { Colors, tintColorDark } from '@/constants/Colors';
import { ThemedPressable } from "@/components/ThemedPressable";

export default function ProfileScreen() {
  const { user, logout, deleteAccount } = useAuth(); // Obtiene los datos del usuario autenticado
  const router = useRouter();
  const colorScheme = useColorScheme(); // 'light' o 'dark'
  const backgroundColor = colorScheme === 'dark' ? Colors.dark.background : Colors.light.background;
  const textColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text;
  const boxBackgroudColor = colorScheme === 'dark' ? Colors.dark.box : Colors.light.box;

  return (
    <View style={[styles.container, {backgroundColor}]}>
      {/* Sección superior */}
      <View style={[styles.header, { padding: 10 }]}>
        <Image 
          source={user?.avatar ? { uri: user.avatar } : require('@/assets/images/Icons/user.png') } 
          style={styles.avatar}/>
        <TouchableOpacity
          style={[styles.editButton, {borderColor: tintColorDark}, 
          { backgroundColor: Colors.primari }]}>
          <Image source={require('@/assets/images/Icons/edit.png')} style={[{width: 40}, {height: 40},
          {tintColor: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text}]}></Image>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">

        {/* CAPSA NOM */}
        <View style={[styles.box, {backgroundColor: boxBackgroudColor}]}>
          <View style={styles.boxInfoSection}>
            <ThemedText style={{color: textColor}} type="bold">Nom</ThemedText>
            <ThemedText style={{color: textColor}} type="default">{user?.name || "Nom Usuari"}</ThemedText>
          </View>
          <View style={styles.boxTextContainer}>
            <ThemedPressable type="button" onPress={() => router.push("/edit-name")} style={styles.button}>
              <ThemedText type="bold" style={{textAlign:'center', fontSize:16}}>Editar</ThemedText>
            </ThemedPressable>
          </View>
        </View>

        {/* CAPSA CORREU */}
        <View style={[styles.box, {backgroundColor: boxBackgroudColor}]}>
          <View style={styles.boxInfoSection}>
            <ThemedText style={{color: textColor}} type="bold">Correu electrònic</ThemedText>
            <ThemedText style={{color: textColor}} type="default">{user?.email || "email@gmail.com"}</ThemedText>
          </View>
          <View style={styles.boxTextContainer}>
            <ThemedPressable type="button" onPress={() => {}} style={styles.button}>
              <ThemedText type="bold" style={{textAlign:'center', fontSize:16}}>Editar</ThemedText>
            </ThemedPressable>
          </View>
        </View>

        {/* CAPSA DATA DE NAIXEMENT */}
        <View style={[styles.box, {backgroundColor: boxBackgroudColor}]}>
          <View style={styles.boxInfoSection}>
            <ThemedText style={{color: textColor}} type="bold">Data de naixement</ThemedText>
            <ThemedText style={{color: textColor}} type="default">{user?.birthDate || "2000-12-12"}</ThemedText>
          </View>
          <View style={styles.boxTextContainer}>
            <ThemedPressable type="button" onPress={() => router.push("/edit-birthdate")} style={styles.button}>
              <ThemedText type="bold" style={{textAlign:'center', fontSize:16}}>Editar</ThemedText>
            </ThemedPressable>
          </View>
        </View>

        {/* CAPSA TELÈFON */}
        <View style={[styles.box, {backgroundColor: boxBackgroudColor}]}>
          <View style={styles.boxInfoSection}>
            <ThemedText style={{color: textColor}} type="bold">Telèfon</ThemedText>
            <ThemedText style={{color: textColor}} type="default">{user?.phone || "+34645108922"}</ThemedText>
          </View>
          <View style={styles.boxTextContainer}>
            <ThemedPressable type="button" onPress={() => {}} style={styles.button}>
              <ThemedText type="bold" style={{textAlign:'center', fontSize:16}}>Editar</ThemedText>
            </ThemedPressable>
          </View>
        </View>

        {/* CAPSA GÈNERE */}
        <View style={[styles.box, {backgroundColor: boxBackgroudColor}]}>
          <View style={styles.boxInfoSection}>
            <ThemedText style={{color: textColor}} type="bold">Gènere</ThemedText>
            <ThemedText style={{color: textColor}} type="default">{user?.gender || "(Desconegut)"}</ThemedText>
          </View>
          <View style={styles.boxTextContainer}>
            <ThemedPressable type="button" onPress={() => router.push("/edit-birthdate")} style={styles.button}>
              <ThemedText type="bold" style={{textAlign:'center', fontSize:16}}>Editar</ThemedText>
            </ThemedPressable>
          </View>
        </View>

        {/* BOTÓ EDITAR CONTRASENYA */}
        <ThemedPressable type="button" onPress={() => router.push("/edit-password")}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <ThemedText type="bold" style={{textAlign:'center', fontSize:16}}>Editar contrasenya</ThemedText>
          </View>
        </ThemedPressable>

        {/* BOTÓ DE TANCAR SESSIÓ */}
        <ThemedPressable type="button" onPress={logout}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Image source={require('../../assets/images/Icons/logout.png')} 
              style={{width: 40, height: 40, marginRight: 25, 
              tintColor: useColorScheme() == 'dark' ? Colors.dark.text : Colors.light.text}}/>
            <ThemedText type="bold" style={{textAlign:'center', fontSize:16}}>Tancar sessió</ThemedText>
          </View>
        </ThemedPressable>

        {/* BOTÓ D'ELIMINAR COMPTE' */}
        <ThemedPressable type="button" onPress={deleteAccount}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Image source={require('../../assets/images/Icons/trash.png')} 
              style={{width: 30, height: 30, marginRight: 25, 
              tintColor: useColorScheme() == 'dark' ? Colors.dark.text : Colors.light.text}}/>
            <ThemedText type="bold" style={{textAlign:'center', fontSize:16}}>Eliminar compte</ThemedText>
          </View>
        </ThemedPressable>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  /*** ESTIL CAPSA */
  box: {
    width: '90%',
    alignSelf: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  boxInfoSection: {
    flex: 2,
  },
  boxTextContainer: {
    flex: 1,
  },
  boxLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  boxValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 0,
    borderRadius: 10,
    minHeight: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  /********** */
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  editButton: {
    width: 60,
    height: 60,
    position: 'absolute',
    bottom: 20,
    left: 145,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    padding: 20,
    gap: 5,
    paddingTop: 40,
    paddingBottom: 45,
  },
  header: {
    backgroundColor: Colors.secundari,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 50,
    height: 250,
  },
  avatar: {
    width: 155,
    height: 155,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: tintColorDark,
    marginTop: 30,
    marginLeft: 30,
    resizeMode: 'cover',
  },
});
