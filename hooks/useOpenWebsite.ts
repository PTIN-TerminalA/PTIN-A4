import { Linking, Alert, Platform } from 'react-native';
import { useCallback } from 'react';

const useOpenWebsite = () => {
  const openWebsite = useCallback(async (url: string) => {
    
    // Validate and format URL
    const formatUrl = (rawUrl: string): string | null => {
      if (!rawUrl) return null;
      let formatted = rawUrl.trim();
      if (!/^https?:\/\//i.test(formatted)) {
        formatted = `https://${formatted}`;
      }
      return formatted;
    };

    const formattedUrl = formatUrl(url);
    if (!formattedUrl) {
      Alert.alert('Error', 'Invalid website URL');
      return;
    }

    try {
      // Check if device can handle the URL
      const canOpen = await Linking.canOpenURL(formattedUrl);
      
      if (!canOpen) {
        throw new Error('No app can handle this request');
      }

      // Open URL
      await Linking.openURL(formattedUrl);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to open website';
      
      Alert.alert(
        'Cannot Open Website',
        errorMessage,
        [{ text: 'OK' }],
        { cancelable: true }
      );
      console.error('URL Open Error:', error);
    }
  }, []);

  return openWebsite;
};

export default useOpenWebsite;