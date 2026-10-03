// src/app/(drawer)/(tabs)/events.tsx
import React, { useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';

import CalendarEvents from '@/components/ui/CalendarEvents';
import ListEvents from '@/components/ui/ListEvents';

import { useTranslation } from '@/i18n';

import { fetchAllEventsFx } from '@/effector/events/async/events';
import {
  $events,
  $currentDayEvents,
  $selectedDate,
  $isEventsLoading,
  $userSession,
} from '@/effector/store';
import { setSelectedDate } from '@/effector/events/sync';

export default function EventsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();

  const { allEvents, dayEvents, selectedDate, isLoading, changeDate, user } =
    useUnit({
      allEvents: $events,
      dayEvents: $currentDayEvents,
      selectedDate: $selectedDate,
      isLoading: $isEventsLoading,
      changeDate: setSelectedDate,
      user: $userSession,
    });

  useFocusEffect(
    useCallback(() => {
      fetchAllEventsFx();
    }, []),
  );

  const handleCreateEventPress = () => {
    if (user) {
      router.push('/event/create');
    } else {
      Alert.alert(
        t('event.detail.authRequired'),
        t('events.form.authRequiredHint'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('common.signIn'),
            onPress: () => router.push('/(drawer)/(tabs)/profile'),
          },
        ],
      );
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle}>{t('events.title')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <CalendarEvents
        selectedDate={selectedDate}
        allEvents={allEvents}
        onDateChange={changeDate}
      />

      {isLoading && allEvents.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#208AEF" />
        </View>
      ) : (
        <View style={styles.listWrapper}>
          <ListEvents events={dayEvents} selectedDate={selectedDate} />
        </View>
      )}

      <Pressable
        style={[styles.fabButton, { bottom: insets.bottom + 16 }]}
        onPress={handleCreateEventPress}
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
    lineHeight: 48,
  },
  headerSpacer: { width: 32 },
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