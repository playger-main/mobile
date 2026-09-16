import React from 'react';
import { useColorScheme } from 'react-native';
// ✅ ИСПРАВЛЕНИЕ: Импортируем темы напрямую из expo-router
import { Stack, ThemeProvider, DarkTheme, DefaultTheme } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Используем встроенный ThemeProvider от expo-router */}
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          {/* Главный экран — это группа нашего Drawer */}
          <Stack.Screen name="(drawer)" />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
