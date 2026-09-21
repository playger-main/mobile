// src/app/_layout.tsx
import React, { useEffect } from 'react';
import { useColorScheme, View, ActivityIndicator } from 'react-native';
import { Stack, ThemeProvider, DarkTheme, DefaultTheme } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useUnit } from 'effector-react';

// Импортируем механизмы инициализации сессии из Effector
import { hydrateSessionFx, $isHydrating, hydrateSettingsFx } from '@/effector/store';

// Удерживаем Splash Screen от автоматического скрытия
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // 1. Подписываемся на состояние дешифрования токенов сессии из Effector
  const { isHydrating } = useUnit({
    isHydrating: $isHydrating,
  });

  // 2. Загрузка системных шрифтов и иконок
  const [fontsLoaded, fontError] = useFonts({
    ...Ionicons.font,
  });

  // 3. Запускаем нативную проверку защищенной памяти SecureStore при монтировании лейаута
  useEffect(() => {
    hydrateSessionFx();
    hydrateSettingsFx();
  }, []);

  // 4. Умный триггер скрытия Сплеш Скрина:
  // Прячем заставку только когда шрифты ГОТОВЫ (или упали с ошибкой) И токены полностью СЧИТАНЫ
  useEffect(() => {
    const assetsReady = fontsLoaded || fontError;
    if (assetsReady && !isHydrating) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError, isHydrating]);

  // Защитный фолбек-индикатор (на случай, если Сплеш закрылся, но дерево рендерится)
  if ((!fontsLoaded && !fontError) || isHydrating) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#208AEF" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar style="auto" />
        
        {/* Корневой стек навигаторов приложения */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(drawer)" />
          {/* Роут для детального экрана события */}
          <Stack.Screen name="event/[id]" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
