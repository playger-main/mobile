// src/app/_layout.tsx
import React, { useEffect } from 'react';
import {
  useColorScheme,
  View,
  ActivityIndicator,
  AppState,
} from 'react-native';
import { Stack, ThemeProvider, DarkTheme, DefaultTheme } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useUnit } from 'effector-react';

import {
  hydrateSessionFx,
  $isHydrating,
  hydrateSettingsFx,
  fetchGroundsFx,
  fetchAllEventsFx,
  requestUserLocationFx,
  checkLocationPermissionFx,
  detectCityFx,
  $appLanguage,
} from '@/effector/store';

import { DEFAULT_CITY_CENTER } from '@/constants/location';
import { registerCalendarLocales, setCalendarLocale } from '@/i18n';

// ✅ Регистрируем локали календаря ДО первого рендера
registerCalendarLocales();

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const { isHydrating } = useUnit({
    isHydrating: $isHydrating,
  });

  // ✅ Текущий язык приложения — для синхронизации локали календаря
  const appLanguage = useUnit($appLanguage);

  const [fontsLoaded, fontError] = useFonts({
    ...Ionicons.font,
  });

  // ✅ Гидратация при старте
  useEffect(() => {
    hydrateSessionFx();
    hydrateSettingsFx();

    // Запрос локации + определение города
    (async () => {
      try {
        const status = await checkLocationPermissionFx();
        if (status === 'denied') return;

        const result = await requestUserLocationFx();
        if (result?.location) {
          detectCityFx(result.location);
        } else {
          detectCityFx(DEFAULT_CITY_CENTER);
        }
      } catch {}
    })();
  }, []);

  // ✅ Синхронизируем активную локаль календаря с текущим языком
  useEffect(() => {
    setCalendarLocale(appLanguage);
  }, [appLanguage]);

  // ✅ AppState — при возврате в приложение обновляем данные
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        console.log('[AppState] App is active → refreshing data');
        // Перепроверяем сессию (мог протухнуть токен)
        hydrateSessionFx();
        // Подтягиваем свежие данные
        fetchGroundsFx();
        fetchAllEventsFx();
      }
    });

    return () => subscription.remove();
  }, []);

  // Скрываем Splash Screen
  useEffect(() => {
    const assetsReady = fontsLoaded || fontError;
    if (assetsReady && !isHydrating) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError, isHydrating]);

  if ((!fontsLoaded && !fontError) || isHydrating) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
        }}
      >
        <ActivityIndicator size="large" color="#208AEF" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar style="auto" />

        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(drawer)" />
          <Stack.Screen name="ground/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="ground/create" options={{ headerShown: false }} />
          <Stack.Screen name="ground/edit" options={{ headerShown: false }} />
          <Stack.Screen name="ground/moderation" options={{ headerShown: false }} />
          <Stack.Screen name="reviews/ground/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="event/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="event/create" options={{ headerShown: false }} />
          <Stack.Screen name="event/edit" options={{ headerShown: false }} />
          <Stack.Screen name="user/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="user/edit" options={{ headerShown: false }} />
          <Stack.Screen name="user/change-email" options={{ headerShown: false }} />
          <Stack.Screen name="user/joined" options={{ headerShown: false }} />
          <Stack.Screen name="user/favorites" options={{ headerShown: false }} />
          <Stack.Screen name="user/created" options={{ headerShown: false }} />
          <Stack.Screen name="user/reviews" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}