// src/app/_layout.tsx
import React, { useEffect } from 'react';
import {
  useColorScheme,
  View,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { Stack, ThemeProvider, DarkTheme, DefaultTheme } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useUnit } from 'effector-react';

// Effector
import {
  hydrateSessionFx,
  $isHydrating,
  hydrateSettingsFx,
  requestUserLocationFx,
  checkLocationPermissionFx,
  detectCityFx,
} from '@/effector/store';

import { DEFAULT_CITY_CENTER } from '@/constants/location';

// Удерживаем Splash Screen до готовности приложения
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const { isHydrating } = useUnit({
    isHydrating: $isHydrating,
  });

  const [fontsLoaded, fontError] = useFonts({
    ...Ionicons.font,
  });

  // ✅ Гидратация сессии + настроек + проверка локации
  useEffect(() => {
    hydrateSessionFx();
    hydrateSettingsFx();

    // Проверка и запрос разрешения на локацию
    (async () => {
      try {
        const status = await checkLocationPermissionFx();

        if (status === 'denied') {
          Alert.alert(
            'Location Access',
            'PlayG works best with your location to show nearby grounds and events. Enable it in Settings?',
            [
              { text: 'Not now', style: 'cancel' },
              {
                text: 'Open Settings',
                onPress: () => {
                  if (Platform.OS === 'ios') {
                    Linking.openURL('app-settings:');
                  } else {
                    Linking.openSettings();
                  }
                },
              },
            ],
          );
          return;
        }

        const result = await requestUserLocationFx();
        if (result?.location) {
          detectCityFx(result.location);
        } else {
          detectCityFx(DEFAULT_CITY_CENTER);
        }
      } catch {
        // Игнорируем — приложение всё равно стартует
      }
    })();
  }, []);

  // Скрываем Splash Screen, когда всё готово
  useEffect(() => {
    const assetsReady = fontsLoaded || fontError;
    if (assetsReady && !isHydrating) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError, isHydrating]);

  // Fallback-загрузка
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

        {/*
          ✅ ВАЖНО: перечисляем только те экраны, которые точно существуют.
          Expo Router автоматически подхватывает все файлы из src/app/,
          но если указать Stack.Screen для несуществующего файла —
          получите "Element type is invalid".

          Если файл src/app/ground/moderation.tsx уже создан —
          раскомментируйте строку ниже.
        */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(drawer)" />
          <Stack.Screen name="event/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="event/edit" options={{ headerShown: false }} />
          <Stack.Screen name="ground/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="ground/create" options={{ headerShown: false }} />
          <Stack.Screen name="ground/edit" options={{ headerShown: false }} />
          <Stack.Screen name="ground/moderation" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}