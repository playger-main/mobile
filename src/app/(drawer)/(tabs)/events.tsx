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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Шапка экрана */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Events</Text>
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
  header: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF' },
  headerTitle: { fontSize: 24, paddingLeft: 60, fontWeight: '800', color: '#334A77' },
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
