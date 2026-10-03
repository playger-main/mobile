// src/components/ui/CalendarEvents.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { ServerEventItem } from '@/effector/events/async/events';
import { useTranslation } from '@/i18n';

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

  // ✅ Синхронно — до того, как <Calendar> прочитает defaultLocale
  LocaleConfig.defaultLocale = lang;

  const markedDates = allEvents.reduce((acc: any, event) => {
    acc[event.date] = {
      marked: true,
      dotColor: '#208AEF',
    };
    return acc;
  }, {});

  markedDates[selectedDate] = {
    ...markedDates[selectedDate],
    selected: true,
    selectedColor: '#208AEF',
    selectedTextColor: '#FFFFFF',
  };

  return (
    <View style={styles.container}>
      <Calendar
        key={lang}
        current={selectedDate}
        onDayPress={(day: DateData) => onDateChange(day.dateString)}
        markedDates={markedDates}
        firstDay={1}
        theme={{
          backgroundColor: '#FFFFFF',
          calendarBackground: '#FFFFFF',
          textSectionTitleColor: '#6080A8',
          selectedDayBackgroundColor: '#208AEF',
          selectedDayTextColor: '#FFFFFF',
          todayTextColor: '#208AEF',
          todayBackgroundColor: '#e1e6ead8',
          dayTextColor: '#334A77',
          textDisabledColor: '#BACAD6',
          dotColor: '#208AEF',
          arrowColor: '#6080A8',
          monthTextColor: '#334A77',
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E6F4FE',
    paddingBottom: 4,
  },
});