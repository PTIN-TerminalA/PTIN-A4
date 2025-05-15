import { useState, useEffect } from "react";
import NfcManager, { NfcEvents } from 'react-native-nfc-manager';
import { Alert } from "react-native";
import { TagEvent } from 'react-native-nfc-manager';


export function useNFCListener() {
  const [tagId, setTagId] = useState<string | null | undefined>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      await NfcManager.start();

      if (!(await NfcManager.isSupported())) {
        Alert.alert('NFC not supported on this device');
        return;
      }

      if (!(await NfcManager.isEnabled())) {
        Alert.alert(
          'NFC is turned off',
          'Please enable NFC in Settings to scan a tag',
          [
            { text: 'Open settings', onPress: () => NfcManager.goToNfcSetting() },
            { text: 'Cancel', style: 'cancel' },
          ],
        );
        return;
      }
      NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag:TagEvent) => {
        console.log('Discovered', tag);
        if (tag.id) {
        setTagId(tag.id); 
        }
      });
      
      await NfcManager.registerTagEvent();
    })();

    return () => {
      mounted = false;
      NfcManager.unregisterTagEvent().catch(() => {});
    };
  }, []);

  return { tagId };
}
