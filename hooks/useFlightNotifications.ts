import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { BoardingPasses } from '@/flightData/boardingPassesInfoTest';

export function useFlightNotifications() {
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
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.HIGH,
        });
      }
    };

    setupNotifications();

    const interval = setInterval(() => {
      const now = new Date();
      BoardingPasses.forEach(pass => {
        const boardingTime = new Date(pass.boardingTime);
        const departureTime = new Date(pass.route.departureTime);
        const tenMinBefore = new Date(departureTime.getTime() - 10 * 60 * 1000);

        const nowSeconds = Math.floor(now.getTime() / 1000);

        if (Math.floor(boardingTime.getTime() / 1000) === nowSeconds) {
          Notifications.scheduleNotificationAsync({
            content: {
              title: "Porta d'embarcament oberta",
              body: `L'embarcament per al teu vol ${pass.route.destinationName} ha començat a la porta ${pass.route.gate}.`,
            },
            trigger: null,
          });
        }

        if (Math.floor(tenMinBefore.getTime() / 1000) === nowSeconds) {
          Notifications.scheduleNotificationAsync({
            content: {
              title: "Queden 10 minuts",
              body: `El teu vol ${pass.route.destinationName} està a punt de sortir per la porta ${pass.route.gate}.`,
            },
            trigger: null,
          });
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);
}
