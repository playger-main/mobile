// src/app/(drawer)/(tabs)/events.tsx
import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import CalendarEvents from '@/components/ui/CalendarEvents';
import ListEvents from '@/components/ui/ListEvents';

// Импортируем реактивную бизнес-логику из Effector
import { fetchAllEventsFx } from '@/effector/events/async/events';
import { $events, $currentDayEvents, $selectedDate, $isEventsLoading, $userSession } from '@/effector/store';
import { setSelectedDate } from '@/effector/events/sync';

export default function EventsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Извлекаем данные, функции управления и стор сессии пользователя
  const { allEvents, dayEvents, selectedDate, isLoading, changeDate, user } = useUnit({
    allEvents: $events,
    dayEvents: $currentDayEvents,
    selectedDate: $selectedDate,
    isLoading: $isEventsLoading,
    changeDate: setSelectedDate,
    user: $userSession, // ✅ Подключили проверку авторизации
  });

  // Запрашиваем все запланированные игры с NestJS сервера при открытии вкладки
  useEffect(() => {
    fetchAllEventsFx();
  }, []);

  // ✅ БЕЗОПАСНЫЙ ПЕРЕХОД: Контроль авторизации перед созданием матча
  const handleCreateEventPress = () => {
    if (user) {
      // Пользователь авторизован -> пускаем на форму создания
      router.push('/event/create');
    } else {
      // Пользователь зашел как гость -> выводим инфо-сообщение и редиректим на Welcome/Profile
      Alert.alert(
        'Authentication Required',
        'Please sign in or create an account to organize your own sports events.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Sign In', 
            onPress: () => router.push('/(drawer)/(tabs)/profile') // ✅ Перенаправление на экран Welcome/Входа
          }
        ]
      );
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      
      {/* 1. Шапка экрана */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle}>Events</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Интерактивный Календарь событий */}
      <CalendarEvents 
        selectedDate={selectedDate}
        allEvents={allEvents}
        onDateChange={changeDate}
      />

      {/* Список матчей на выбранный день */}
      {isLoading && allEvents.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#208AEF" />
        </View>
      ) : (
        <View style={styles.listWrapper}>
          <ListEvents 
            events={dayEvents} 
            selectedDate={selectedDate} 
          />
        </View>
      )}

      {/* Плавающая кнопка создания матча (+) */}
      <Pressable 
        style={[styles.fabButton, { bottom: insets.bottom + 16 }]}
        onPress={handleCreateEventPress} // ✅ Заменили прямой роутинг на защищенный метод
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderColor: '#F0F6FC',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: { 
    fontSize: 17, 
    fontWeight: '700', 
    color: '#334A77',
    textAlign: 'center',
    lineHeight: 48
  },
  headerSpacer: { 
    width: 32 
  },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listWrapper: { flex: 1, backgroundColor: '#F8FAFC' },
  fabButton: {
    position: 'absolute',
    right: 16,
    width: 56,
    height: 56,
    backgroundColor: '#208AEF',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#208AEF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 99,
  },
});
