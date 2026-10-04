import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '@shopify/restyle';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Urbanist_400Regular,
  Urbanist_500Medium,
  Urbanist_700Bold,
  Urbanist_800ExtraBold,
} from '@expo-google-fonts/urbanist';
import { Stack } from 'expo-router';
import theme from '../src/theme/theme';
import { ToastProvider } from '../src/components/Toast';

// Clear old data on first launch after code update — remove this line after testing
const CLEAR_ON_LAUNCH = true;

export default function RootLayout() {
  useEffect(() => {
    if (CLEAR_ON_LAUNCH) {
      AsyncStorage.removeItem('sledge_captures');
    }
  }, []);
  const [fontsLoaded] = useFonts({
    'Urbanist-Regular': Urbanist_400Regular,
    'Urbanist-Medium': Urbanist_500Medium,
    'Urbanist-Bold': Urbanist_700Bold,
    'Urbanist-ExtraBold': Urbanist_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator color="#53EAFD" size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        <ToastProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </ToastProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: '#0F1923',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
