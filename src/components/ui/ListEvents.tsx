// src/components/ui/ListEvents.tsx
import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ServerEventItem } from '@/effector/events/async/events';
import EventListCard from './EventListCard';

interface ListEventsProps {
  events: ServerEventItem[];
  selectedDate: string;
}

export default function ListEvents({ events, selectedDate }: ListEventsProps) {
  const getHeaderDateTitle = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    const today = new Date();
    const isToday = eventDate.toDateString() === today.toDateString();
    const month = eventDate.toLocaleString('en-US', { month: 'short' });
    const day = eventDate.getDate();
    return `${isToday ? 'Today' : eventDate.toLocaleString('en-US', { weekday: 'short' })} • ${month} ${day}`;
  };

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <EventListCard item={item} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      ListHeaderComponent={
        <View style={styles.listHeader}>
          <Text style={styles.headerTitle}>
            {getHeaderDateTitle(selectedDate)}{' '}
            <Text style={styles.countText}>
              · {events.length} {events.length === 1 ? 'event' : 'events'}
            </Text>
          </Text>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={48} color="#BACAD6" />
          <Text style={styles.emptyText}>No events planned for this day</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  listContainer: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 },
  listHeader: { marginBottom: 14 },
  headerTitle: { fontSize: 15, fontWeight: '700', color: '#334A77' },
  countText: { color: '#BACAD6', fontWeight: '400' },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    gap: 8,
  },
  emptyText: { fontSize: 14, color: '#BACAD6', fontWeight: '500' },
});
