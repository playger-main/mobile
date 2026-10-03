// src/components/ui/CalendarEvents.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { ServerEventItem } from '@/effector/events/async/events';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

interface CalendarEventsProps {
  selectedDate: string;
  allEvents: ServerEventItem[];
  onDateChange: (date: string) => void;
}

export default function CalendarEvents({
  selectedDate,
  allEvents,
  onDateChange,
}: CalendarEventsProps) {
  const { lang } = useTranslation();
  const { theme, colors } = useTheme();

  // ✅ Синхронно — до того, как <Calendar> прочитает defaultLocale
  LocaleConfig.defaultLocale = lang;

  const markedDates = allEvents.reduce((acc: any, event) => {
    acc[event.date] = {
      marked: true,
      dotColor: colors.primary,
    };
    return acc;
  }, {});

  markedDates[selectedDate] = {
    ...markedDates[selectedDate],
    selected: true,
    selectedColor: colors.primary,
    selectedTextColor: '#FFFFFF',
  };

  // ✅ Фон «сегодня» — мягкий оттенок primary в тёмной теме
  const todayBackgroundColor =
    theme === 'dark' ? colors.primaryBg : '#E1E6EAD8';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderColor: colors.borderSubtle,
        },
      ]}
    >
      <Calendar
        key={`${lang}-${theme}`}
        current={selectedDate}
        onDayPress={(day: DateData) => onDateChange(day.dateString)}
        markedDates={markedDates}
        firstDay={1}
        theme={{
          backgroundColor: colors.background,
          calendarBackground: colors.background,
          textSectionTitleColor: colors.textSecondary,
          selectedDayBackgroundColor: colors.primary,
          selectedDayTextColor: '#FFFFFF',
          todayTextColor: colors.primary,
          todayBackgroundColor,
          dayTextColor: colors.textPrimary,
          textDisabledColor: colors.textTertiary,
          dotColor: colors.primary,
          arrowColor: colors.textSecondary,
          monthTextColor: colors.textPrimary,
          textDayFontWeight: '600',
          textMonthFontWeight: '800',
          textDayHeaderFontWeight: '700',
          textDayFontSize: 14,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 12,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingBottom: 4,
  },
});