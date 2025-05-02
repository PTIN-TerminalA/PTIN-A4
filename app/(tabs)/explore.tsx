import { View, Image, StyleSheet, TouchableOpacity, useColorScheme, ScrollView} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { useState } from 'react';
import { Colors} from '@/constants/Colors'
import { services as mockServices, services } from "@/constants/mocks/services";
import { Service } from "@/constants/mocks/mockTypes";
import { useRideRequest } from "@/hooks/useRideRequest";
import { useUserLocation } from "@/hooks/useUserLocation";

export default function ServiceScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const carButtonColor = isDarkMode ? Colors.secundari : Colors.primari;
  const carButtonIcon = require('@/assets/images/Icons/car.png');
  const router = useRouter();
  const boxColor = isDarkMode ? Colors.dark.box : Colors.light.box;
  const textColor = isDarkMode ? Colors.dark.text : Colors.light.text;
  const borderColor1 = isDarkMode ? Colors.dark.box_border : Colors.light.box_border;
  const borderColor2 = isDarkMode ? Colors.dark.box : Colors.light.box;
  const [isScrolling, setIsScrolling] = useState(false);
  const serveis = services.filter( // simulació amb els mocks
    (service) =>
      service.id === 1 || service.id === 3 || service.id === 4 // McDonalds, Zara, Starbucks
  );
  
  const ride = useRideRequest();
  const userLocation = useUserLocation();
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handlerCarPress = () => {
    {/* TO DO */}
    { /** Utilitzar useRideRequest després de seleccionar un servei */}

    console.log('Destí seleccionat');
    router.push({
      pathname: '/(tabs)',
    })
  }

  const handleScrollBegin = () => {
    setIsScrolling(true)
  }

  const handleScrollEnd = () => {
    setIsScrolling(false)
  }

  const handlerServicePress = () => {
    if (!isScrolling) {
      console.log('tenda seleccionada')
      {/* TODO */}
    }
  }

  return (
    <SafeAreaView style={[styles.container]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={handleScrollBegin}
        onScrollEndDrag={handleScrollEnd}
        onMomentumScrollBegin={handleScrollBegin}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}>

        {/* Simulació de la visualització de serveis */}
        <View style={{ height: 35 }} />
        {serveis.map((tenda, index) => (
          <View style={styles.scrollContent} key={tenda.id}>
            <TouchableOpacity
              onPress={handlerServicePress}
              style={[styles.serviceBox,
                {backgroundColor: index % 2 === 0 ? "transparent" : boxColor,
                  borderColor: index % 2 === 0 ? borderColor1 : borderColor2,},]}>
              <Image
                source={require('../../assets/images/Icons/shopping.png')}
                style={[styles.serviceImage, { borderColor: boxColor }]}
              />
              <View style={styles.serviceTextInfo}>
                <ThemedText style={[{ color: textColor, fontSize: 20 }]} type="defaultSemiBold">
                  {tenda.name}
                </ThemedText>
                <ThemedText style={{ color: textColor }} type="default">
                  {tenda.location}
                </ThemedText>
                <ThemedText style={{ color: textColor }} type="default">
                  {tenda.description}
                </ThemedText>
              </View>
            </TouchableOpacity>
            </View>
        ))}
        <View style={{ height: 150 }} />

      </ScrollView>

      {/* Botó per demanar cotxe */}
      <TouchableOpacity
        style={[styles.carButton, { backgroundColor: carButtonColor }]}
        onPress={handlerCarPress}>
        <Image source={carButtonIcon} style={[styles.carIconButton,
        {tintColor: useColorScheme() == 'dark' ? Colors.dark.text : Colors.light.text}]}></Image>
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

  serviceBox: {
    width: 345,
    height: 85,
    borderWidth: 1,
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
  },
  serviceTextInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  serviceImage: {
    width: 60,
    height: 60,
    borderWidth: 4,
    borderRadius: 30,
    marginLeft: 15,
    marginRight: 15,
  },

  carButton: {
    width: 55,
    height: 55,
    position: 'absolute',
    bottom: 30,
    right: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carIconButton: {
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
});
