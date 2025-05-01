import {View, Image, StyleSheet, TouchableOpacity, useColorScheme, ScrollView} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link} from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { useState } from 'react';
import {Colors} from '@/constants/Colors'
import { BoardingPasses } from '@/flightData/boardingPassesInfoTest'

export default function FlightsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const buttonColor = isDarkMode ? Colors.secundari : Colors.primari;
  const boxColor = isDarkMode ? Colors.dark.box : Colors.light.box;
  const textColor = isDarkMode ? Colors.dark.text : Colors.light.text;
  const borderColor1 = isDarkMode ? Colors.dark.box_border : Colors.light.box_border;
  const borderColor2 = isDarkMode ? Colors.dark.box : Colors.light.box;
  const buttonIcon = isDarkMode ? require('@/assets/images/Icons/scanner_DarkMode.png') : require('@/assets/images/Icons/scanner_LightMode.png');
  const [isScrolling, setIsScrolling] = useState(false);
  {/* Prova de boarding passes*/}


  const handlerScannerPress = () => {
    {/* TODO */}
    console.log('Scanner Pressed');
    router.push({
      pathname: '/flightInfo/scanBoardingPass',
    })
  }

  const handleScrollBegin = () => {
    setIsScrolling(true)
  }

  const handleScrollEnd = () => {
    setIsScrolling(false)
  }

  const handlerBoardingPassPress = (id: string) => {
    if (!isScrolling) {
      console.log('ticket d\'embarcament seleccionat')
      {/* TODO */}
      router.push({
        pathname: '/flightInfo',
        params: {id},
      })
    }
  }

  return (
    <SafeAreaView style={[styles.container]}>
      <ScrollView showsVerticalScrollIndicator={false} onScrollBeginDrag={handleScrollBegin} onScrollEndDrag={handleScrollEnd}
        onMomentumScrollBegin={handleScrollBegin} onMomentumScrollEnd={handleScrollEnd} scrollEventThrottle={16}
      >
        <View style={{height: 15}}></View>
        {/* 
          Renderitzat del historial de tickets. Si la posició del contenidor es parella,
          es renderitzarà amb el fons tranparent. En canvi, si es imparella, es renderitzarà
          amb el fons de color primari o secundari (depenent de si es light o dark theme)
        */}
        {BoardingPasses.map(( boardingPass, index )=> (
          <Link style={styles.scrollContent} key={boardingPass.id} href={{pathname: '/flightInfo',params: {id: boardingPass.id}}}>
            <TouchableOpacity onPress={() => handlerBoardingPassPress(boardingPass.id)}
              style={[styles.flightBox, {backgroundColor: index % 2 == 0 ? 'transparent' : boxColor}, {borderColor: index % 2 == 0 ? borderColor1 : borderColor2}]}>
              <Image source={boardingPass.airlineImage} style={[styles.airlineImage, {borderColor: boxColor}]} ></Image>
              <View style={styles.flightTextInfo}>
                <ThemedText style={[{color: textColor}, {fontSize: 20}]} type="defaultSemiBold">{boardingPass.airline}</ThemedText>
                <ThemedText style={{ color: textColor }} type="default">{boardingPass.route.origin} - {boardingPass.route.destination}</ThemedText>
              </View>
            </TouchableOpacity>
          </Link>
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
    alignItems: 'center'
  },

  scrollContent: {
    padding: 15,
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
