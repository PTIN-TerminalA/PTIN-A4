import {View, Image, StyleSheet, Text, useColorScheme} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams} from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { Fragment, useState } from 'react';
import { BoardingPass} from '@/app/flightInfo/boardingPass';
import { BoardingPasses } from './boardingPassesInfoTest';
import {Colors} from '@/constants/Colors';
import { format } from 'date-fns';
import QRCode from 'react-native-qrcode-svg';

export default function FlightInfoScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const boxColor = isDarkMode ? '#333333' : '#D0D0D0';
  const textColor = isDarkMode ? Colors.dark.text : Colors.light.text;
  const { id } = useLocalSearchParams<{ id: string}>();
  const separatorColor = boxColor;
  const boardingPass = BoardingPasses.find(p => p.id === id) as BoardingPass;

  if (!boardingPass) {
    return (
      <View>
        <ThemedText type="title">NOT FOUND</ThemedText>
      </View>
    );
  }
  else {
    return (
      <Fragment>
        {/* Titol de la pantalla */}
        <Stack.Screen
          options={{
            headerTitle: () => <ThemedText style={{fontSize: 20}} type='bold'>Targeta d'embarcament</ThemedText>,
            headerTitleAlign: 'left'
          }}
        >
        </Stack.Screen>
        
        {/* Contingut de la pantalla */}
        <SafeAreaView style={styles.container}>
          <View style={[styles.flightBox, {borderColor: boxColor}]}>
            
            {/* Información inicial (imatge...) */}
            <View style={styles.rowBox}>
              <Image source={boardingPass.airlineImage} style={[styles.airlineImage, {borderColor: boxColor}]} ></Image>
              <View style={styles.flightTextInfo}>
                <ThemedText style={[{ color: textColor }, { fontSize: 20 }]} type="defaultSemiBold">{boardingPass.airline}</ThemedText>
                <ThemedText style={{ color: textColor }} type="default">{boardingPass.route.origin} - {boardingPass.route.destination}</ThemedText>
              </View>
            </View>

            {/* Separador */}
            <View style={[styles.separator, {backgroundColor: separatorColor}]}></View>

            {/* Primera fila d'informació */}
            <View style={styles.rowBox}>
              <View style={styles.innerBox}>
                <ThemedText type="default">PASSATGER</ThemedText>
                <ThemedText type="defaultSemiBold">{boardingPass.passenger.name}</ThemedText>
              </View>
              <View style={styles.innerBox}>
                <ThemedText type="default">NUM VOL</ThemedText>
                <ThemedText type="defaultSemiBold">{boardingPass.flightNumber}</ThemedText>
              </View>
            </View>

            {/* Segona fila d'informació */}
            <View style={styles.rowBox}>
              <View style={styles.innerBox}>
                <ThemedText type="default">SEIENT</ThemedText>
                <ThemedText type="defaultSemiBold">{boardingPass.passenger.seat}</ThemedText>
              </View>
              <View style={styles.innerBox}>
                <ThemedText type="default">PORTA</ThemedText>
                <ThemedText type="defaultSemiBold">{boardingPass.route.gate}</ThemedText>
              </View>
              <View style={styles.innerBox}>
                <ThemedText type="default">TERMINAL</ThemedText>
                <ThemedText type="defaultSemiBold">{boardingPass.route.terminal}</ThemedText>
              </View>
            </View>
            
            {/* Tercera fila d'informació */}
            <View style={styles.rowBox}>
              <View style={styles.innerBox}>
                <ThemedText type="default">DESDE</ThemedText>
                <ThemedText type="defaultSemiBold">{boardingPass.route.originName}</ThemedText>
              </View>
              <View style={styles.innerBox}>
                <ThemedText type="default">TEMPS DE SORTIDA</ThemedText>
                <ThemedText type="defaultSemiBold">{format(boardingPass.route.departureTime,"d-M-yyyy HH:mm")}</ThemedText>
              </View>
            </View>

            {/* Quarta fila d'informació */}
            <View style={styles.rowBox}>
              <View style={styles.innerBox}>
                <ThemedText type="default">DESDE</ThemedText>
                <ThemedText type="defaultSemiBold">{boardingPass.route.destinationName}</ThemedText>
              </View>
              <View style={styles.innerBox}>
                <ThemedText type="default">TEMPS DE D'ARRIBADA</ThemedText>
                <ThemedText type="defaultSemiBold">{format(boardingPass.route.arrivalTime,"d-M-yyyy HH:mm")}</ThemedText>
              </View>
            </View>

            {/* Codi QR */}
          </View>
        </SafeAreaView> 
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center'
  },

  flightBox: {
    width: 345,
    height: 650,
    borderWidth: 4,
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderRadius: 30,
  },

  rowBox: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  innerBox: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 15,
    marginRight: 15,
  },

  separator: {
    height: 4,
    marginVertical: 10,
    alignSelf: 'center',
    width: '100%',

  },

  airlineImage: {
    width: 60,
    height: 60,
    borderWidth: 4,
    borderRadius: 30,
    marginLeft: 15,
    marginRight: 15,
  },

  flightTextInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
  },

});
