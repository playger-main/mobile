// src/components/ui/ListEvents.tsx
import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ServerEventItem } from '@/effector/events/async/events';
import EventListCard from './EventListCard';
import { useTranslation } from '@/i18n';
import type { Language } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

const LOCALE_MAP: Record<Language, string> = {
  en: 'en-US',
  ru: 'ru-RU',
  be: 'be-BY',
  lt: 'lt-LT',
  pl: 'pl-PL',
  uk: 'uk-UA',
};

interface ListEventsProps {
  events: ServerEventItem[];
  selectedDate: string;
}

export default function ListEvents({ events, selectedDate }: ListEventsProps) {
  const { t, lang } = useTranslation();
  const { colors } = useTheme();

  const getHeaderDateTitle = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    const today = new Date();
    const isToday = eventDate.toDateString() === today.toDateString();

    const locale = LOCALE_MAP[lang] ?? 'en-US';
    const weekday = eventDate.toLocaleString(locale, { weekday: 'short' });
    const month = eventDate.toLocaleString(locale, { month: 'short' });
    const day = eventDate.getDate();

    const dayLabel = isToday ? t('events.today') : weekday;
    return `${dayLabel} • ${month} ${day}`;
  };

  const countKey =
    events.length === 1 ? 'events.count_one' : 'events.count_other';

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <EventListCard item={item} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      ListHeaderComponent={
        <View style={styles.listHeader}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            {getHeaderDateTitle(selectedDate)}{' '}
            <Text style={[styles.countText, { color: colors.textTertiary }]}>
              · {t(countKey, { count: events.length })}
            </Text>
          </Text>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Ionicons
            name="calendar-outline"
            size={48}
            color={colors.textTertiary}
          />
          <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
            {t('events.noEventsForDay')}
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  listContainer: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 },
  listHeader: { marginBottom: 14 },
  headerTitle: { fontSize: 15, fontWeight: '700' },
  countText: { fontWeight: '400' },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    gap: 8,
  },
  emptyText: { fontSize: 14, fontWeight: '500' },
});