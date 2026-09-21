// src/app/(drawer)/(tabs)/events.tsx
import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';
import { Ionicons } from '@expo/vector-icons';

import CalendarEvents from '@/components/ui/CalendarEvents';
import ListEvents from '@/components/ui/ListEvents';

// Импортируем реактивную бизнес-логику из Effector
import { fetchAllEventsFx } from '@/effector/events/async/events';
import { $events, $currentDayEvents, $selectedDate, $isEventsLoading } from '@/effector/store';
import { setSelectedDate } from '@/effector/events/sync';

export default function EventsScreen() {
  const insets = useSafeAreaInsets();

  // Извлекаем данные и функции управления из Effector сторов
  const { allEvents, dayEvents, selectedDate, isLoading, changeDate } = useUnit({
    allEvents: $events,
    dayEvents: $currentDayEvents,
    selectedDate: $selectedDate,
    isLoading: $isEventsLoading,
    changeDate: setSelectedDate,
  });

  // Запрашиваем все запланированные игры с NestJS сервера при открытии вкладки
  useEffect(() => {
    fetchAllEventsFx();
  }, []);

  return (
    // ✅ ИСПРАВЛЕНО: Заменили SafeAreaView на View для точного контроля отступов шапки
    <View style={[styles.container, { paddingTop: insets.top }]}>
      
      {/* 1. Шапка экрана (Стиль полностью идентичен About, Settings и Profile) */}
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
        onPress={() => console.log('Navigate to create event screen')}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  
  // ✅ ОБНОВЛЕНО: Стили приведены к общему корпоративному стандарту приложения
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
    lineHeight: 48,
    fontWeight: '700', 
    color: '#334A77',
    textAlign: 'center'
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
