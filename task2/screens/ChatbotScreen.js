import React, { useState, useRef, useEffect } from 'react';
import {View,Text,TextInput,TouchableOpacity,ScrollView,StyleSheet,
KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GoogleGenerativeAI } from '@google/generative-ai';

const ChatbotScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef();

 
  const API_KEY = 'AIzaSyBmHuBr496sfJsXAI8J7jPDjclkrYClMWA';

  useEffect(() => {
    setMessages([
      {
        id: '1',
        text: 'Hello! I am your AI assistant powered by Google Gemini. How can I help you today?',
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
  },
   []);

  const formatBotResponse = (text) => {
   
    let formatted = text;
    
  //formatting part for bullet points and numbered lists
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '●$1');
    formatted = formatted.replace(/^\* /gm, '• ');
    formatted = formatted.replace(/\n\* /g, '\n• ');
    formatted = formatted.replace(/^\d+\. /gm, (match) => match);
    
    return formatted;
  };

  const getGeminiResponse = async (userMessage) => {
    try {
      const models = [
        'gemini-2.5-flash',
        'gemini-2.0-flash',
        'gemini-2.5-pro',
        'gemini-flash-latest',
        'gemini-2.0-flash-lite'
      ];

      let lastError = null;

      for (const modelName of models) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${API_KEY}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        text: userMessage + "\n\nPlease format your response with proper bullet points (•) and numbered lists. Use clear formatting.",
                      },
                    ],
                  },
                ],
              }),
            }
          );

          const data = await response.json();

          if (response.ok && data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            console.log(`Success with model: ${modelName}`);
            const rawText = data.candidates[0].content.parts[0].text;
            return formatBotResponse(rawText);
          }

          lastError = data.error?.message || 'Unknown error';
          console.log(` Model ${modelName} failed:`, lastError);
        } catch (err) {
          lastError = err.message;
          console.log(` Model ${modelName} error:`, err.message);
          continue;
        }
      }

      throw new Error(lastError || 'All models failed');
      
    } catch (error) {
      console.error('Error getting Gemini response:', error);
      
     
      if (error.message.includes('API_KEY_INVALID') || error.message.includes('API key not valid')) {
        return ' API Key is invalid. Please verify your Google Gemini API key.';
      } else if (error.message.includes('not found') || error.message.includes('404')) {
        return ' No models available for your API key. Please:\n\n1. Wait 2-5 minutes if key is new\n2. Or create a new API key at:\naistudio.google.com/app/apikey';
      } else if (error.message.includes('quota') || error.message.includes('429')) {
        return ' API quota exceeded. Free tier: 15 requests/min. Please wait.';
      } else if (error.message.includes('PERMISSION_DENIED')) {
        return ' Permission denied. Enable Generative Language API.';
      }
      
      return `Error: ${error.message}\n\nTry creating a new API key.`;
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    const botResponse = await getGeminiResponse(userMessage.text);

    const botMessage = {
      id: (Date.now() + 1).toString(),
      text: botResponse,
      sender: 'bot',
      timestamp: new Date(),
    };

    
    setMessages((prev) => [...prev, botMessage]);
    setIsLoading(false);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const renderMessage = (message) => {
    const isUser = message.sender === 'user';

    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.botMessageContainer,
        ]}
      >
        {!isUser && (
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>🤖</Text>
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.botBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userText : styles.botText,
            ]}
          >
            {message.text}
          </Text>
          <Text
            style={[
              styles.timestamp,
              isUser ? styles.userTimestamp : styles.botTimestamp,
            ]}
          >
            {formatTime(message.timestamp)}
          </Text>
        </View>
        {isUser && (
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>👤</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.map((message) => renderMessage(message))}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.loadingText}>AI is typing...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          multiline
          maxLength={2000}
          textAlignVertical="top"
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading}
        >
          <Ionicons
            name="send"
            size={24}
            color={inputText.trim() ? '#007AFF' : '#CCC'}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  botMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  avatar: {
    fontSize: 18,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  userText: {color: '#FFFFFF',
  },
  botText: {color: '#000000',
  },
  timestamp: {fontSize: 11, marginTop: 4,
  },
  userTimestamp: { color: 'rgba(255, 255, 255, 0.7)', textAlign: 'right',
  },
  botTimestamp: { color: '#999',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 44,
    maxHeight: 120,
    marginRight: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default ChatbotScreen;