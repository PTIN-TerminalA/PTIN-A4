import {View, Image, StyleSheet, TouchableOpacity, useColorScheme, ScrollView} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { useState } from 'react';
import {Colors} from '@/constants/Colors'

export default function FlightsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const buttonColor = isDarkMode ? Colors.secundari : Colors.primari;
  const boxColor = isDarkMode ? '#222222' : '#E3E3E3';
  const textColor = isDarkMode ? Colors.dark.text : Colors.light.text;
  const buttonIcon = isDarkMode ? require('@/assets/images/Icons/scanner_DarkMode.png') : require('@/assets/images/Icons/scanner_LightMode.png');
  const [isScrolling, setIsScrolling] = useState(false);
  {/* Prova de boarding passes*/}
  const tickets = [
    {
      id: '1',
      airline: 'Ryan Air',
      origin: 'BCN',
      destination: 'MAD',
      image: {uri: 'https://play-lh.googleusercontent.com/UlvFF-Zo2h6_8RdoMh9xWbAcaqSrsIU_yhQPOcH5rbTQ7Av9EvfWFTrAen1EX4X-JxA_'},
    },
    {
      id: '2',
      airline: 'Ryan Air',
      origin: 'MAD',
      destination: 'BCN',
      image: {uri: 'https://play-lh.googleusercontent.com/UlvFF-Zo2h6_8RdoMh9xWbAcaqSrsIU_yhQPOcH5rbTQ7Av9EvfWFTrAen1EX4X-JxA_'},
    },
    {
      id: '3',
      airline: 'Iberia',
      origin: 'GRX',
      destination: 'MAD',
      image: {uri: 'https://play-lh.googleusercontent.com/bn9i62M-CaGiVYlglz5uoDKa_uhWCRKux4_NrVqQ5R70C79v7sR88FETqlGxulDbvdk'},
    },
    {
      id: '4',
      airline: 'Iberia',
      origin: 'MAD',
      destination: 'GRX',
      image: {uri: 'https://play-lh.googleusercontent.com/bn9i62M-CaGiVYlglz5uoDKa_uhWCRKux4_NrVqQ5R70C79v7sR88FETqlGxulDbvdk'},
    },
    {
      id: '5',
      airline: 'Air China',
      origin: 'BCN',
      destination: 'HKG',
      image: {uri: 'https://play-lh.googleusercontent.com/kdbH6FdwVCbmTEJFSO_pjHQzQ0LWDM1cYE-tmv8ZPV37adZY0y9ktTyYlah4X5hgxXY'},
    },
    {
      id: '6',
      airline: 'Air China',
      origin: 'HKG',
      destination: 'BCN',
      image: {uri: 'https://play-lh.googleusercontent.com/kdbH6FdwVCbmTEJFSO_pjHQzQ0LWDM1cYE-tmv8ZPV37adZY0y9ktTyYlah4X5hgxXY'},
    },
    {
      id: '7',
      airline: 'Vueling',
      origin: 'BCN',
      destination: 'ALC',
      image: {uri: 'https://play-lh.googleusercontent.com/PUEfpx0TaaLM52ZjX70d2_HZUUvN1RJ6VwtAejTwxPIat_GMuVuGShKx2JGG38_yi7c=w600-h300-pc0xffffff-pd'},
    },
    {
      id: '8',
      airline: 'Vueling',
      origin: 'ALC',
      destination: 'BCN',
      image: {uri: 'https://play-lh.googleusercontent.com/PUEfpx0TaaLM52ZjX70d2_HZUUvN1RJ6VwtAejTwxPIat_GMuVuGShKx2JGG38_yi7c=w600-h300-pc0xffffff-pd'},
    },

  ]

  const handlerScannerPress = () => {
    {/* TODO */}
  }

  const handleScrollBegin = () => {
    setIsScrolling(true)
  }

  const handleScrollEnd = () => {
    setIsScrolling(false)
  }

  const handlerBoardingPassPress = () => {
    if (!isScrolling) {
      console.log('ticket d\'embarcament seleccionat')
      {/* TODO */}
    }
  }

  return (
    <SafeAreaView style={[styles.container]}>
      <ScrollView style={styles.scrollContent} onScrollBeginDrag={handleScrollBegin} onScrollEndDrag={handleScrollEnd}
        onMomentumScrollBegin={handleScrollBegin} onMomentumScrollEnd={handleScrollEnd} scrollEventThrottle={16}
      >
        {/* 
          Renderitzat del historial de tickets. Si la posició del contenidor es parella,
          es renderitzarà amb el fons tranparent. En canvi, si es imparella, es renderitzarà
          amb el fons de color primari o secundari (depenent de si es light o dark theme)
        */}
        {tickets.map(( ticket, index )=> (
          <TouchableOpacity onPress={handlerBoardingPassPress} 
            key={ticket.id} 
            style={[styles.flightBox, {backgroundColor: index % 2 == 0 ? 'transparent' : boxColor}, {borderColor: boxColor}]}>
            <Image source={ticket.image} style={[styles.airlineImage, {borderColor: boxColor}]} ></Image>
            <View style={styles.flightTextInfo}>
              <ThemedText style={[{color: textColor}, {fontSize: 20}]} type="defaultSemiBold">{ticket.airline}</ThemedText>
              <ThemedText style={{ color: textColor }} type="default">{ticket.origin} - {ticket.destination}</ThemedText>
            </View>
          </TouchableOpacity>
        ))}
        {/* Marge extra per sota del ScrollView */}
        <View style={{height: 150}}></View>
      </ScrollView>
      {/* Botó per escannejar */}
      <TouchableOpacity style={[styles.scannButton,{backgroundColor: buttonColor}]} onPress={handlerScannerPress}>
        <Image source={buttonIcon} style={[styles.scannIconButton]}>
        </Image>
      </TouchableOpacity>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },

  scrollContent: {
    padding: 30,
  },

  flightBox: {
    width: 345,
    height: 85,
    borderWidth: 4,
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
  },

  scannButton: {
    width: 55,
    height: 55,
    position: 'absolute',
    bottom: 30,
    right: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scannIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
