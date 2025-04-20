import {View, Image, StyleSheet, Text, useColorScheme, LayoutChangeEvent} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams} from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { Fragment, useState } from 'react';
import { BoardingPass} from '@/flightData/boardingPass';
import { BoardingPasses } from '../../flightData/boardingPassesInfoTest';
import {Colors} from '@/constants/Colors';
import { format } from 'date-fns';
import QRCode from 'react-native-qrcode-svg';

export default function FlightInfoScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const boxColor = isDarkMode ? '#333333' : '#D0D0D0';
  const textColor = isDarkMode ? Colors.dark.text : Colors.light.text;
  const oppositeColor = !isDarkMode ? Colors.dark.text : Colors.light.text;
  const { id } = useLocalSearchParams<{ id: string}>();
  const separatorColor = boxColor;
  const boardingPass = BoardingPasses.find(p => p.id === id) as BoardingPass;
  const logo= require('@/assets/images/logo/logo.svg')
  const [qrSize, setQrSize] = useState(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setQrSize(width * 0.9); // 90% of container width
  };

  
  
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
            headerShown: true,
            headerTitle: () => <ThemedText style={{fontSize: 20}} type='bold'>Targeta d'embarcament</ThemedText>,
            headerTitleAlign: 'left'
          }}
        >
        </Stack.Screen>
        
        {/* Contingut de la pantalla */}
        <SafeAreaView style={styles.container}>
          <View style={[styles.flightBox, {borderColor: boxColor}]}>
            
            {/* Información inicial (imatge...) */}
            <View style={styles.topBox}>
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
              <View style={[styles.innerBox, {width: '66%'}]}>
                <ThemedText type="default">PASSATGER</ThemedText>
                <ThemedText numberOfLines={1} ellipsizeMode='tail' type="defaultSemiBold">{boardingPass.passenger.name}</ThemedText>
              </View>
              <View style={[styles.innerBox, {width: '33%'}]}>
                <ThemedText type="default">NUM VOL</ThemedText>
                <ThemedText type="defaultSemiBold">{boardingPass.flightNumber}</ThemedText>
              </View>
            </View>

            {/* Segona fila d'informació */}
            <View style={styles.rowBox}>
              <View style={[styles.innerBox, {width: '33%'}]}>
                <ThemedText type="default">SEIENT</ThemedText>
                <ThemedText numberOfLines={1} ellipsizeMode='tail' type="defaultSemiBold">{boardingPass.passenger.seat}</ThemedText>
              </View>
              <View style={[styles.innerBox, {width: '33%'}]}>
                <ThemedText type="default">PORTA</ThemedText>
                <ThemedText numberOfLines={1} ellipsizeMode='tail' type="defaultSemiBold">{boardingPass.route.gate}</ThemedText>
              </View>
              <View style={[styles.innerBox, {width: '33%'}]}>
                <ThemedText type="default">TERMINAL</ThemedText>
                <ThemedText numberOfLines={1} ellipsizeMode='tail' type="defaultSemiBold">{boardingPass.route.terminal}</ThemedText>
              </View>
            </View>
            
            {/* Tercera fila d'informació */}
            <View style={styles.rowBox}>
              <View style={[styles.innerBox]}>
                <ThemedText type="default">DESDE</ThemedText>
                <ThemedText numberOfLines={1} ellipsizeMode='tail' type="defaultSemiBold">{boardingPass.route.originName}</ThemedText>
              </View>
              <View style={styles.innerBox}>
                <ThemedText type="default">TEMPS DE SORTIDA</ThemedText>
                <ThemedText type="defaultSemiBold">{format(boardingPass.route.departureTime,"d-M-yyyy H:mm")}</ThemedText>
              </View>
            </View>

            {/* Quarta fila d'informació */}
            <View style={styles.rowBox}>
              <View style={styles.innerBox}>
                <ThemedText type="default">FINS</ThemedText>
                <ThemedText numberOfLines={1} ellipsizeMode='tail' type="defaultSemiBold">{boardingPass.route.destinationName}</ThemedText>
              </View>
              <View style={styles.innerBox}>
                <ThemedText type="default">TEMPS D'ARRIBADA</ThemedText>
                <ThemedText type="defaultSemiBold">{format(boardingPass.route.arrivalTime,"d-M-yyyy H:mm")}</ThemedText>
              </View>
            </View>

            {/* Codi QR */}
            <View style={styles.qrBox} onLayout={handleLayout}>
              <QRCode value={boardingPass.qrCode} size={qrSize} logoSVG={logo} color={textColor} backgroundColor='transparent'></QRCode>
            </View>
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
    alignItems: 'center',
  },

  flightBox: {
    width: '85%',
    height: '85%',
    borderWidth: 4,
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderRadius: 30,
    padding: 20,
  },

  topBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },

  rowBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },

  innerBox: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '50%',
    marginTop: 15,
  },

  qrBox: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
    marginTop: 15,
  },

  separator: {
    height: 4,
    marginVertical: 10,
    alignSelf: 'center',
    width: '115%',

  },

  airlineImage: {
    width: 60,
    height: 60,
    borderWidth: 4,
    borderRadius: 30,
  },

  flightTextInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
  },

});
