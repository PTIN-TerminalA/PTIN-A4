// import { StyleSheet, Image, Platform } from "react-native";

// import { Collapsible } from "@/components/Collapsible";
// import { ExternalLink } from "@/components/ExternalLink";
// import ParallaxScrollView from "@/components/ParallaxScrollView";
// import { ThemedText } from "@/components/ThemedText";
// import { ThemedView } from "@/components/ThemedView";
// import { IconSymbol } from "@/components/ui/IconSymbol";
// import {Styles} from "@/constants/Styles"

// export default function TabTwoScreen() {
//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
//       headerImage={
//         <IconSymbol
//           size={310}
//           color="#808080"
//           name="chevron.left.forwardslash.chevron.right"
//           style={Styles.headerImage}
//         />
//       }
//     >
//       <ThemedView style={Styles.titleContainer}>
//         <ThemedText type="title">Chatbot messenger</ThemedText>
//       </ThemedView>
//       <ThemedText>
//         This app includes example code to help you get started.
//       </ThemedText>
//       <Collapsible title="File-based routing">
//         <ThemedText>
//           This app has two screens:{" "}
//           <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{" "}
//           and{" "}
//           <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
//         </ThemedText>
//         <ThemedText>
//           The layout file in{" "}
//           <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{" "}
//           sets up the tab navigator.
//         </ThemedText>
//         <ExternalLink href="https://docs.expo.dev/router/introduction">
//           <ThemedText type="link">Learn more</ThemedText>
//         </ExternalLink>
//       </Collapsible>
//       <Collapsible title="Android, iOS, and web support">
//         <ThemedText>
//           You can open this project on Android, iOS, and the web. To open the
//           web version, press <ThemedText type="defaultSemiBold">w</ThemedText>{" "}
//           in the terminal running this project.
//         </ThemedText>
//       </Collapsible>
//       <Collapsible title="Images">
//         <ThemedText>
//           For static images, you can use the{" "}
//           <ThemedText type="defaultSemiBold">@2x</ThemedText> and{" "}
//           <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to
//           provide files for different screen densities
//         </ThemedText>
//         <Image
//           source={require("@/assets/images/react-logo.png")}
//           style={{ alignSelf: "center" }}
//         />
//         <ExternalLink href="https://reactnative.dev/docs/images">
//           <ThemedText type="link">Learn more</ThemedText>
//         </ExternalLink>
//       </Collapsible>
//       <Collapsible title="Custom fonts">
//         <ThemedText>
//           Open <ThemedText type="defaultSemiBold">app/_layout.tsx</ThemedText>{" "}
//           to see how to load{" "}
//           <ThemedText style={{ fontFamily: "Roboto-Italic" }}>
//             custom fonts such as this one uuuuu.
//           </ThemedText>
//         </ThemedText>
//         <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
//           <ThemedText type="link">Learn more</ThemedText>
//         </ExternalLink>
//       </Collapsible>
//       <Collapsible title="Light and dark mode components">
//         <ThemedText>
//           This template has light and dark mode support. The{" "}
//           <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook
//           lets you inspect what the user's current color scheme is, and so you
//           can adjust UI colors accordingly.
//         </ThemedText>
//         <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
//           <ThemedText type="link">Learn more</ThemedText>
//         </ExternalLink>
//       </Collapsible>
//       <Collapsible title="Animations">
//         <ThemedText>
//           This template includes an example of an animated component. The{" "}
//           <ThemedText type="defaultSemiBold">
//             components/HelloWave.tsx
//           </ThemedText>{" "}
//           component uses the powerful{" "}
//           <ThemedText type="defaultSemiBold">
//             react-native-reanimated
//           </ThemedText>{" "}
//           library to create a waving hand animation.
//         </ThemedText>
//         {Platform.select({
//           ios: (
//             <ThemedText>
//               The{" "}
//               <ThemedText type="defaultSemiBold">
//                 components/ParallaxScrollView.tsx
//               </ThemedText>{" "}
//               component provides a parallax effect for the header image.
//             </ThemedText>
//           ),
//         })}
//       </Collapsible>
//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   headerImage: {
//     color: "#808080",
//     bottom: -90,
//     left: -35,
//     position: "absolute",
//   },
//   titleContainer: {
//     flexDirection: "row",
//     gap: 8,
//   },
// });










import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  useColorScheme
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import Voice from '@react-native-voice/voice' // Cambié la importación aquí
import Constants from 'expo-constants';


type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
};

export default function ChatScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const themeColors = {
    background: isDarkMode ? Colors.dark.background : Colors.light.background,
    inputBackground: isDarkMode ? '#1e1e1e' : '#fff',
    inputBorder: isDarkMode ? '#333' : '#ccc',
    textColor: isDarkMode ? '#fff' : '#000',
    userBubble: Colors.primari,
    botBubble: isDarkMode ? '#333' : '#E5E5EA',
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Voice handlers
  useEffect(() => {
    // Aquí definimos los eventos de voz
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      // Limpiamos los listeners cuando el componente se desmonte
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechResults = (e: any) => {
    const results = e.value;
    if (results && results[0]) {
      const spokenText = results[0];
      const userMessage: Message = {
        id: Date.now().toString(),
        text: spokenText,
        sender: 'user',
      };
      setMessages(prev => [...prev, userMessage]);

      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: '¡Mensaje recibido!',
          sender: 'bot',
        };
        setMessages(prev => [...prev, botMessage]);
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 800);
    }
    setIsRecording(false);
  };

  const onSpeechError = (e: any) => {
    console.error('Voice error:', e);
    setIsRecording(false);
  };

  const toggleRecording = async () => {
    try {
      if (isRecording) {
        await Voice.stop(); // Detener la grabación
        setIsRecording(false);
      } else {
        console.log('Voice:', Voice);
        console.log('Started listening 111');
        console.log(Constants.executionEnvironment); // 'expo' → estás en Expo Go, 'standalone' o 'developer' → dev client
        await Voice.start('es-ES'); // Cambia el idioma a 'es-ES' o el que prefieras
        console.log('Started listening 222');
        setIsRecording(true);
      }
    } catch (error) {
      console.error('Voice start error:', error);
      setIsRecording(false);
    }
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '¡Mensaje recibido!',
        sender: 'bot',
      };
      setMessages(prev => [...prev, botMessage]);
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 800);
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[styles.messageContainer, {
        alignSelf: item.sender === 'user' ? 'flex-end' : 'flex-start',
        backgroundColor: item.sender === 'user' ? themeColors.userBubble : themeColors.botBubble,
      }]}
    >
      <Text style={[styles.messageText, { color: themeColors.textColor }]}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: themeColors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chat}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View
        style={[styles.inputContainer, {
          backgroundColor: themeColors.inputBackground,
          borderTopColor: themeColors.inputBorder,
        }]}
      >
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Escribe un mensaje..."
          placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
          style={[styles.input, {
            backgroundColor: themeColors.inputBackground,
            borderColor: themeColors.inputBorder,
            color: themeColors.textColor,
          }]}
        />
        <TouchableOpacity onPress={toggleRecording} style={styles.iconButton}>
          <Ionicons
            name={isRecording ? 'mic' : 'mic-outline'}
            size={24}
            color={isRecording ? '#FF3B30' : '#555'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  chat: { padding: 10, paddingBottom: 70 },
  messageContainer: { padding: 10, marginVertical: 4, maxWidth: '75%', borderRadius: 12 },
  messageText: { fontSize: 16 },
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, alignItems: 'center' },
  input: { flex: 1, borderRadius: 20, borderWidth: 1, paddingHorizontal: 15, paddingVertical: 8 },
  sendButton: { backgroundColor: Colors.primari, marginLeft: 8, padding: 10, borderRadius: 50 },
  iconButton: { marginLeft: 8 },
});
