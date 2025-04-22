import {View, Image, StyleSheet, Text, useColorScheme, LayoutChangeEvent, ScrollView} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams} from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { Fragment, useState, useEffect } from 'react';
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
  const { id } = useLocalSearchParams<{ id: string}>();
  const separatorColor = boxColor;
  const boardingPass = BoardingPasses.find(p => p.id === id) as BoardingPass;
  const logo= require('@/assets/images/logo/logo.svg')
  const [qrSize, setQrSize] = useState(0);
  const [departureCountdown, setDepartureCountdown] = useState('');
  const [boardingCountdown, setBoardingCountdown] = useState('');

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setQrSize(width* 0.9); // 90% of container width
  };

  useEffect(() => {
    if (!boardingPass) return;
  
    const updateCountdowns = () => {
      const now = new Date();
  
      const departure = new Date(boardingPass.route.departureTime);
      const boarding = new Date(boardingPass.boardingTime);
  
      const updateTime = (targetTime: Date) => {
        const diff = targetTime.getTime() - now.getTime();
        if (diff <= 0) return 'Ja ha passat!';
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        return `${h}h ${m}m ${s}s`;
      };
  
      setDepartureCountdown(updateTime(departure));
      setBoardingCountdown(updateTime(boarding));
    };
  
    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, [boardingPass]);
  
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
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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

              {/* Temporitzadors */}
              <ThemedText  type="defaultSemiBold">L'embarcament comença en: {boardingCountdown}</ThemedText>
              <ThemedText  type="defaultSemiBold">Temps fins la sortida: {departureCountdown}</ThemedText>

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
              
              {/* Separador */}
              <View style={[styles.separator, {backgroundColor: separatorColor}]}></View>

              {/* Codi QR */}
              <View style={styles.qrBox} onLayout={handleLayout}>
                <QRCode value={boardingPass.qrCode} size={qrSize} logoSVG={logo} color={textColor} backgroundColor='transparent'></QRCode>
              </View>
            </View>
            <View style={{height: 100}}></View>
          </ScrollView>
        </View>
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
    width: '95%',
    height: '90%',
    borderWidth: 4,
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderRadius: 30,
    padding: 15,
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
    marginTop: 25,
  },

  separator: {
    height: 4,
    marginVertical: 10,
    alignSelf: 'center',
    width: '110%',

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

  scrollContent: {
    alignItems: 'center',
  },
});
