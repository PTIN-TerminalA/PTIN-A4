import { Animated, View, Image, StyleSheet, TouchableOpacity, useColorScheme, ScrollView, NativeSyntheticEvent, NativeScrollEvent} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link} from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { useRef, useState } from 'react';
import {Colors} from '@/constants/Colors'
import { BoardingPasses } from '@/flightData/boardingPassesInfoTest'

export default function FlightsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const buttonColor = isDarkMode ? Colors.primari : Colors.primari;
  const boxColor = isDarkMode ? '#2E2E2E' : '#D3D3D3';
  const textColor = isDarkMode ? Colors.dark.text : Colors.light.text;
  const buttonIcon = isDarkMode ? require('@/assets/images/Icons/scanner_DarkMode.png') : require('@/assets/images/Icons/scanner_LightMode.png');
  const [showText, setShowText] = useState(true);
  const scrollOffset = useRef(0);
  const buttonMaxWidth = 137;
  const buttonWidth = useRef(new Animated.Value(buttonMaxWidth)).current; 


  const handlerScannerPress = () => {
    {/* TODO */}
    console.log('Scanner Pressed');
    router.push({
      pathname: '/flightInfo/scanBoardingPass',
    })
  }

  
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const diff = currentOffset - scrollOffset.current;
    const threshold = 10;

    if (Math.abs(diff) < threshold) return;

    const direction = diff > 0 ? 'down': 'up'
    scrollOffset.current = currentOffset

    if (direction === 'down' && showText) {
      setShowText(false);
      Animated.timing(buttonWidth, {
        toValue: 60,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else if (direction === 'up' && !showText) {
      setShowText(true);
      Animated.timing(buttonWidth, {
        toValue: buttonMaxWidth,
        duration: 200,
        useNativeDriver: false,
      }).start();

    }

  }

  const handlerBoardingPassPress = (id: string) => {
    console.log('ticket d\'embarcament seleccionat')
    router.push({
      pathname: '/flightInfo',
      params: {id},
    })
  }

  return (
    <SafeAreaView style={[styles.container]}>
      <ScrollView showsVerticalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={16}
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
              style={[styles.flightBox, {backgroundColor: index % 2 == 0 ? 'transparent' : boxColor}, {borderColor: boxColor}]}>
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
      <Animated.View style={[styles.animatedView,{width: buttonWidth},{backgroundColor: buttonColor}]}>
        <TouchableOpacity style={styles.scannButton} onPress={handlerScannerPress}>
          <Image source={buttonIcon} style={[styles.scannIconButton]}></Image>
          {showText && (
            <ThemedText numberOfLines={1} ellipsizeMode='clip' style={{ color: textColor, marginLeft: 10 ,flexShrink: 1}} type="defaultSemiBold">Escaneja</ThemedText>
          )}
        </TouchableOpacity>
      </Animated.View>
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
    borderRadius: 20,
  },

  animatedView: {
    width: 55,
    height: 55,
    position: 'absolute',
    bottom: 30,
    right: 20,
    borderRadius: 20,
    alignItems: 'baseline',
    overflow: 'hidden',
    justifyContent: 'center',
  },

  scannButton: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
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
