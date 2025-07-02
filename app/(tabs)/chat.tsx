import React, { useRef, useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  View,
  useColorScheme,
  StyleSheet,
} from "react-native";
import {
  TextInput,
  IconButton,
  useTheme,
  MD3Colors,
  Surface,
  Text,
} from "react-native-paper";
import { Message, useChat } from "@/contexts/ChatContext";
import { useBotMessage } from "@/hooks/useChat";
import { ExpoSpeechRecognitionModule } from "expo-speech-recognition";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import Color from "color";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import ThinkingDots from "@/components/ThinkingDots";
import Markdown from 'react-native-markdown-display';

const getMicrophonePermission = async () => {
  const permissionType = Platform.select({
    ios: PERMISSIONS.IOS.MICROPHONE,
    android: PERMISSIONS.ANDROID.RECORD_AUDIO,
  });

  const status = await check(permissionType!);

  if (status === RESULTS.GRANTED) return true;

  if (status === RESULTS.DENIED || status === RESULTS.LIMITED) {
    const newStatus = await request(permissionType!);
    return newStatus === RESULTS.GRANTED;
  }

  return false;
};

export default function ChatScreen() {
  const { messages, addMessage } = useChat();
  const { sendMessage, loading } = useBotMessage();
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() || "light";

  const handleSend = async () => {
  if (!inputText.trim()) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    text: inputText,
    sender: "user",
  };

  addMessage(userMessage);
  setInputText("");

  try {
    const botReply = await sendMessage(inputText);
    console.log("bot reply: ", botReply)
    addMessage({
      id: (Date.now() + 1).toString(),
      text: botReply,
      sender: "bot",
    });
  } catch (err) {
    console.error("Bot message error:", err);
    addMessage({
      id: (Date.now() + 2).toString(),
      text: "Error: no s'ha pogut contactar amb l'assistent.",
      sender: "bot",
    });
  }

  flatListRef.current?.scrollToEnd({ animated: true });
};


  useEffect(() => {
    const startSub = ExpoSpeechRecognitionModule.addListener("start", () => {
      setInputText("");
      setError(undefined);
      setIsRecording(true);
    });

    const endSub = ExpoSpeechRecognitionModule.addListener("end", () => {
      setIsRecording(false);
    });

    // const resultSub = ExpoSpeechRecognitionModule.addListener(
    //   "result",
    //   (event) => {
    //     const spokenText = event.results[0]?.transcript;
    //     if (spokenText) {
    //       const userMessage: Message = {
    //         id: Date.now().toString(),
    //         text: spokenText,
    //         sender: "user",
    //       };
    //       addMessage(userMessage);

    //       setTimeout(() => {
    //         const botMessage: Message = {
    //           id: (Date.now() + 1).toString(),
    //           text: "¡Mensaje recibido!",
    //           sender: "bot",
    //         };
    //         addMessage(botMessage);
    //         flatListRef.current?.scrollToEnd({ animated: true });
    //       }, 800);
    //     }
    //     setIsRecording(false);
    //   }
    // );
    const resultSub = ExpoSpeechRecognitionModule.addListener(
      "result",
      (event) => {
        const spokenText = event.results[0]?.transcript;
        if (spokenText) {
          setInputText(spokenText); // Just fill the input
        }
        setIsRecording(false);
      }
    );

    const errorSub = ExpoSpeechRecognitionModule.addListener(
      "error",
      (event) => {
        console.log("Error:", event.error, event.message);
        setError(event.message);
        setIsRecording(false);
      }
    );

    return () => {
      startSub.remove();
      endSub.remove();
      resultSub.remove();
      errorSub.remove();
    };
  }, []);

  const toggleRecording = async () => {
    try {
      if (isRecording) {
        await ExpoSpeechRecognitionModule.stop();
        setIsRecording(false);
      } else {
        const hasPermission = await getMicrophonePermission();
        if (!hasPermission) {
          setError(
            "Permís de micròfon no concedit. Activa-ho als ajustaments."
          );
          return;
        }

        await ExpoSpeechRecognitionModule.start({
          lang: "es-ES",
          interimResults: false,
          continuous: false,
        });

        setIsRecording(true);
      }
    } catch (err) {
      console.error("Error al iniciar reconocimiento:", err);
      setError("Error desconegut al iniciar el reconeixement.");
      setIsRecording(false);
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <Surface
      style={[
        styles.bubble,
        {
          alignSelf: item.sender === "user" ? "flex-end" : "flex-start",
          backgroundColor:
            item.sender === "user"
              ? Color(Colors.primari)
                  .mix(Color(Colors[colorScheme].box), 0.3)
                  .rgb()
                  .string()
              : Colors[colorScheme].box,
        },
      ]}
      elevation={1}
    >
      <Markdown
        style={{
          body: {
            color: item.sender === "user" ? "white" : Colors[colorScheme].text,
            fontSize: 16,
            lineHeight: 22,
          },
        }}
      >
      {item.text.replace(/\\n/g, '`\n')}
      </Markdown>
    </Surface>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={0} // Tweak if input is still hidden under keyboard
    >
      <SafeAreaView style={[{ flex: 1 }]}>
        <FlatList
          ref={flatListRef}
          data={[...messages].reverse()}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chat}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToOffset({offset: 0, animated: true })
          }
          onLayout={() => flatListRef.current?.scrollToOffset({offset: 0, animated: false })}
          inverted={true}
        />

        {loading && (
          <View style={{ paddingHorizontal: 12, paddingBottom: 4, flexDirection: 'row', alignItems: 'center' }}>
            <ThinkingDots />
          </View>
        )}
        <View style={styles.inputRow}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Escriu un missatge..."
            mode="outlined"
            outlineStyle={{ borderRadius: 30 }}
            outlineColor="transparent"
            activeOutlineColor={Colors[colorScheme].button}
            style={[styles.input, { backgroundColor: Colors[colorScheme].box }]}
            disabled={loading}
          />
          <IconButton
            icon={isRecording ? "microphone" : "microphone-outline"}
            onPress={() => toggleRecording()}
            disabled={loading}
            iconColor={
              isRecording
                ? Color(Colors[colorScheme].text)
                    .mix(Color(Colors[colorScheme].button), 0.8)
                    .rgb()
                    .string()
                : Colors[colorScheme].text
            }
            rippleColor={Color(Colors.primari).mix(Color(Colors[colorScheme].box),0.5).rgb().string()}
          />
          <IconButton 
            icon="send" 
            onPress={handleSend} 
            disabled={loading}
            rippleColor={Color(Colors.primari).mix(Color(Colors[colorScheme].box),0.5).rgb().string()}
           />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  chat: {
    padding: 10,
    paddingBottom: 70,
  },
  bubble: {
    paddingHorizontal: 8,
    paddingVertical: 0,
    marginVertical: 10,
    maxWidth: "75%",
    borderRadius: 30,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingTop: 16,
    gap: 8,
  },
  input: {
    flex: 1,
  },
});
