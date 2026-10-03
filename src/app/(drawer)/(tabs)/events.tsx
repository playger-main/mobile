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
import { useTheme } from '@/hooks/useTheme';

export default function EventsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();

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
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: colors.listBackground },
      ]}
    >
      <View
        style={[
          styles.header,
          {
            borderColor: colors.borderSubtle,
            backgroundColor: colors.listBackground,
          },
        ]}
      >
        <View style={styles.headerSpacer} />
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          {t('events.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <CalendarEvents
        selectedDate={selectedDate}
        allEvents={allEvents}
        onDateChange={changeDate}
      />

      {isLoading && allEvents.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <View
          style={[
            styles.listWrapper,
            { backgroundColor: colors.listBackground },
          ]}
        >
          <ListEvents events={dayEvents} selectedDate={selectedDate} />
        </View>
      )}

      <Pressable
        style={[
          styles.fabButton,
          {
            bottom: insets.bottom + 16,
            backgroundColor: colors.primary,
            shadowColor: colors.shadow,
          },
        ]}
        onPress={handleCreateEventPress}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 48,
  },
  headerSpacer: { width: 32 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listWrapper: { flex: 1 },
  fabButton: {
    position: 'absolute',
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 99,
  },
});