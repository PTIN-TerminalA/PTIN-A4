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
import Voice from '@wdragon/react-native-voice';

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
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
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
        await Voice.stop();
        setIsRecording(false);
      } else {
        await Voice.start('es-ES'); // Cambia a 'ca-ES' si deseas usar catalán
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
      style={[
        styles.messageContainer,
        {
          alignSelf: item.sender === 'user' ? 'flex-end' : 'flex-start',
          backgroundColor:
            item.sender === 'user'
              ? themeColors.userBubble
              : themeColors.botBubble,
        },
      ]}
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
        style={[
          styles.inputContainer,
          {
            backgroundColor: themeColors.inputBackground,
            borderTopColor: themeColors.inputBorder,
          },
        ]}
      >
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Escribe un mensaje..."
          placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
          style={[
            styles.input,
            {
              backgroundColor: themeColors.inputBackground,
              borderColor: themeColors.inputBorder,
              color: themeColors.textColor,
            },
          ]}
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
  container: {
    flex: 1,
  },
  chat: {
    padding: 10,
    paddingBottom: 70,
  },
  messageContainer: {
    padding: 10,
    marginVertical: 4,
    maxWidth: '75%',
    borderRadius: 12,
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: Colors.primari,
    marginLeft: 8,
    padding: 10,
    borderRadius: 50,
  },
  iconButton: {
    marginLeft: 8,
  },
});
