import { 
    TouchableOpacity, 
    Image, 
    StyleSheet, 
    ImageSourcePropType,
    ViewStyle,
    View,
    TextStyle
  } from 'react-native';
  import {ThemedText} from './ThemedText';
  import { Colors } from '@/constants/Colors';
  import { useColorScheme } from '@/hooks/useColorScheme';
  
  interface DirectionButtonProps {
    onPress?: () => void;
    buttonStyle?: object; 
    textStyle?: TextStyle; 
    iconSize?: number;
    iconSource?: ImageSourcePropType;
    label?: string;
  }
  
  export default function DirectionButton({
    onPress,
    buttonStyle = {},
    textStyle = {},
    iconSize = 20,
    iconSource,
    label = 'Com arribar',
  }: DirectionButtonProps) {
    const colorScheme = useColorScheme();
  
    const defaultIconSource = 
      colorScheme === 'dark'
        ? require('@/assets/images/Icons/navigate_darktheme.png')
        : require('@/assets/images/Icons/navigate_lighttheme.png');
  
    return (
        <TouchableOpacity
          style={[
            styles.directionButton,
            { backgroundColor: Colors[colorScheme ?? 'light'].button },
            buttonStyle, 
          ]}
          onPress={onPress}
        >
          <ThemedText
            style={[styles.buttonText, textStyle]}
            type="bold"
          >
            {label}
          </ThemedText>
  
          <Image
            source={iconSource ?? defaultIconSource}
            style={[styles.directionIcon, { width: iconSize, height: iconSize }]}
          />
        </TouchableOpacity>
    );
  }
  
  const styles = StyleSheet.create({
    outerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
      },
    directionButton: {
        borderRadius: 30,
        height: 30,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 8,
      },
    buttonText: {
      fontSize: 15,
      textAlign: 'center',
    },
    directionIcon: {
        height: '90%',
        width: 30,
        resizeMode: 'contain'
      }
  });