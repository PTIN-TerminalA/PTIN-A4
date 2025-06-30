//import React, { useState, useRef, useEffect } from "react";
//import {
//  View,
//  Text,
//  TextInput,
//  TouchableOpacity,
//  FlatList,
//  KeyboardAvoidingView,
//  Platform,
//  StyleSheet,
//  useColorScheme,
//} from "react-native";
//import { Ionicons } from "@expo/vector-icons";
//import { Colors } from "@/constants/Colors";
//import {
//  ExpoSpeechRecognitionModule,
//  useSpeechRecognitionEvent,
//} from "expo-speech-recognition";
//import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
//
//const getMicrophonePermission = async () => {
//  const permissionType = Platform.select({
//    ios: PERMISSIONS.IOS.MICROPHONE,
//    android: PERMISSIONS.ANDROID.RECORD_AUDIO,
//  });
//
//  const status = await check(permissionType!);
//
//  if (status === RESULTS.GRANTED) return true;
//
//  if (status === RESULTS.DENIED || status === RESULTS.LIMITED) {
//    const newStatus = await request(permissionType!);
//    return newStatus === RESULTS.GRANTED;
//  }
//
//  return false;
//};
//
//type Message = {
//  id: string;
//  text: string;
//  sender: "user" | "bot";
//};
//
//export default function ChatScreen() {
//  const colorScheme = useColorScheme();
//  const isDarkMode = colorScheme === "dark";
//
//  const themeColors = {
//    background: isDarkMode ? Colors.dark.background : Colors.light.background,
//    inputBackground: isDarkMode ? "#1e1e1e" : "#fff",
//    inputBorder: isDarkMode ? "#333" : "#ccc",
//    textColor: isDarkMode ? "#fff" : "#000",
//    userBubble: Colors.primari,
//    botBubble: isDarkMode ? "#333" : "#E5E5EA",
//  };
//
//  const [messages, setMessages] = useState<Message[]>([]);
//  const [inputText, setInputText] = useState("");
//  const [isRecording, setIsRecording] = useState(false);
//  const [error, setError] = useState<string | undefined>();
//  const flatListRef = useRef<FlatList>(null);
//
//  useEffect(() => {
//    const startSub = ExpoSpeechRecognitionModule.addListener("start", () => {
//      setInputText("");
//      setError(undefined);
//      setIsRecording(true);
//    });
//
//    const endSub = ExpoSpeechRecognitionModule.addListener("end", () => {
//      setIsRecording(false);
//    });
//
//    const resultSub = ExpoSpeechRecognitionModule.addListener(
//      "result",
//      (event) => {
//        const spokenText = event.results[0]?.transcript;
//        if (spokenText) {
//          const userMessage: Message = {
//            id: Date.now().toString(),
//            text: spokenText,
//            sender: "user",
//          };
//          setMessages((prev) => [...prev, userMessage]);
//
//          setTimeout(() => {
//            const botMessage: Message = {
//              id: (Date.now() + 1).toString(),
//              text: "¡Mensaje recibido!",
//              sender: "bot",
//            };
//            setMessages((prev) => [...prev, botMessage]);
//            flatListRef.current?.scrollToEnd({ animated: true });
//          }, 800);
//        }
//        setIsRecording(false);
//      }
//    );
//
//    const errorSub = ExpoSpeechRecognitionModule.addListener(
//      "error",
//      (event) => {
//        console.log(
//          "Error code:",
//          event.error,
//          "Error message:",
//          event.message
//        );
//        setError(event.message);
//        setIsRecording(false);
//      }
//    );
//
//    return () => {
//      startSub.remove();
//      endSub.remove();
//      resultSub.remove();
//      errorSub.remove();
//    };
//  }, []);
//  const toggleRecording = async () => {
//    try {
//      if (isRecording) {
//        await ExpoSpeechRecognitionModule.stop();
//        setIsRecording(false);
//      } else {
//        console.log("Checking microphone permission...");
//        const hasPermission = await getMicrophonePermission();
//
//        if (!hasPermission) {
//          setError(
//            "Permís de micròfon no concedit. Activa-ho als ajustaments."
//          );
//          return;
//        }
//
//        await ExpoSpeechRecognitionModule.start({
//          lang: "es-ES",
//          interimResults: false,
//          continuous: false,
//        });
//
//        setIsRecording(true);
//      }
//    } catch (err) {
//      console.error("Error al iniciar reconocimiento:", err);
//      setError("Error desconegut al iniciar el reconeixement.");
//      setIsRecording(false);
//    }
//  };
//
//  const sendMessage = () => {
//    if (!inputText.trim()) return;
//
//    const userMessage: Message = {
//      id: Date.now().toString(),
//      text: inputText,
//      sender: "user",
//    };
//
//    setMessages((prev) => [...prev, userMessage]);
//    setInputText("");
//
//    setTimeout(() => {
//      const botMessage: Message = {
//        id: (Date.now() + 1).toString(),
//        text: "¡Mensaje recibido!",
//        sender: "bot",
//      };
//      setMessages((prev) => [...prev, botMessage]);
//      flatListRef.current?.scrollToEnd({ animated: true });
//    }, 800);
//  };
//
//  const renderItem = ({ item }: { item: Message }) => (
//    <View
//      style={[
//        styles.messageContainer,
//        {
//          alignSelf: item.sender === "user" ? "flex-end" : "flex-start",
//          backgroundColor:
//            item.sender === "user"
//              ? themeColors.userBubble
//              : themeColors.botBubble,
//        },
//      ]}
//    >
//      <Text style={[styles.messageText, { color: themeColors.textColor }]}>
//        {item.text}
//      </Text>
//    </View>
//  );
//
//  return (
//    <KeyboardAvoidingView
//      style={[styles.container, { backgroundColor: themeColors.background }]}
//      behavior={Platform.OS === "ios" ? "padding" : undefined}
//      keyboardVerticalOffset={90}
//    >
//      <FlatList
//        ref={flatListRef}
//        data={messages}
//        renderItem={renderItem}
//        keyExtractor={(item) => item.id}
//        contentContainerStyle={styles.chat}
//        onContentSizeChange={() =>
//          flatListRef.current?.scrollToEnd({ animated: true })
//        }
//      />
//
//      <View
//        style={[
//          styles.inputContainer,
//          {
//            backgroundColor: themeColors.inputBackground,
//            borderTopColor: themeColors.inputBorder,
//          },
//        ]}
//      >
//        <TextInput
//          value={inputText}
//          onChangeText={setInputText}
//          placeholder="Escribe un mensaje..."
//          placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
//          style={[
//            styles.input,
//            {
//              backgroundColor: themeColors.inputBackground,
//              borderColor: themeColors.inputBorder,
//              color: themeColors.textColor,
//            },
//          ]}
//        />
//        <TouchableOpacity onPress={toggleRecording} style={styles.iconButton}>
//          <Ionicons
//            name={isRecording ? "mic" : "mic-outline"}
//            size={24}
//            color={isRecording ? "#FF3B30" : "#555"}
//          />
//        </TouchableOpacity>
//        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
//          <Ionicons name="send" size={22} color="#fff" />
//        </TouchableOpacity>
//      </View>
//    </KeyboardAvoidingView>
//  );
//}
//
//const styles = StyleSheet.create({
//  container: { flex: 1 },
//  chat: { padding: 10, paddingBottom: 70 },
//  messageContainer: {
//    padding: 10,
//    marginVertical: 4,
//    maxWidth: "75%",
//    borderRadius: 12,
//  },
//  messageText: { fontSize: 16 },
//  inputContainer: {
//    flexDirection: "row",
//    padding: 10,
//    borderTopWidth: 1,
//    alignItems: "center",
//  },
//  input: {
//    flex: 1,
//    borderRadius: 20,
//    borderWidth: 1,
//    paddingHorizontal: 15,
//    paddingVertical: 8,
//  },
//  sendButton: {
//    backgroundColor: Colors.primari,
//    marginLeft: 8,
//    padding: 10,
//    borderRadius: 50,
//  },
//  iconButton: { marginLeft: 8 },
//});

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

    const botReply = await sendMessage(inputText);

    addMessage({
      id: (Date.now() + 1).toString(),
      text: botReply,
      sender: "bot",
    });

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
      <Text
        variant="bodyMedium"
        style={{
          color: item.sender === "user" ? "white" : Colors[colorScheme].text,
        }}
      >
        {item.text}
      </Text>
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
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chat}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        <View style={styles.inputRow}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Escriu un missatge..."
            mode="outlined"
            outlineStyle={{ borderRadius: 24 }}
            outlineColor="transparent"
            activeOutlineColor={Colors[colorScheme].button}
            style={[styles.input, { backgroundColor: Colors[colorScheme].box }]}
          />
          <IconButton
            icon={isRecording ? "microphone" : "microphone-outline"}
            onPress={() => toggleRecording()}
            iconColor={
              isRecording
                ? Color(Colors[colorScheme].text)
                    .mix(Color(Colors[colorScheme].button), 0.8)
                    .rgb()
                    .string()
                : Colors[colorScheme].text
            }
          />
          <IconButton icon="send" onPress={handleSend} />
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
    padding: 12,
    marginVertical: 4,
    maxWidth: "75%",
    borderRadius: 16,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingTop: 16,
    gap: 4,
  },
  input: {
    flex: 1,
    borderRadius: 16,
  },
});
