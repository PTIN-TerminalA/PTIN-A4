import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getRecommendation } from '@/api/notification';
import { useUserLocation } from './useUserLocation';

export function useRecommendationNotifications() {
  const { location } = useUserLocation();

  useEffect(() => {
    const setupNotifications = async () => {
      await Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });

      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permís per a notificacions no concedit.');
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('recommendations', {
          name: 'Recommendations',
          importance: Notifications.AndroidImportance.HIGH,
        });
      }
    };

    const sendRecommendationNotification = async () => {
      //console.log("test location: ", location);
      if (!location) return; //Esperem a tenir ubicació
      const response = await getRecommendation({
        x: location.x,
        y: location.y,
        id: 2960,
      });
      //response.recommendation = "test";
      if (response.recommendation) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Recomanació per a tu',
            body: `Et suggerim: ${response.recommendation}`,
            sound: true,
          },
          trigger: null,
        });
      }
    };

    setupNotifications();

    // Enviar una recomendación al iniciar
    sendRecommendationNotification();

    // Repetir cada hora
    const interval = setInterval(() => {
      sendRecommendationNotification();
    }, 60 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [location]);
}
