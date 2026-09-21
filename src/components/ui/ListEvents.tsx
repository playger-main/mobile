// src/components/ui/ListEvents.tsx
import React from 'react';
import { FlatList, View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // ✅ ДОБАВИЛИ ИМПОРТ РОУТЕРА
import { ServerEventItem } from '@/effector/events/async/events';
import { getBadgeStyle } from '@/constants/badgeStyle';

interface ListEventsProps {
  events: ServerEventItem[];
  selectedDate: string;
}

export default function ListEvents({ events, selectedDate }: ListEventsProps) {
  const router = useRouter(); // ✅ ИНИЦИАЛИЗИРОВАЛИ РОУТЕР
  
  const getHeaderDateTitle = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    const today = new Date();
    const isToday = eventDate.toDateString() === today.toDateString();
    const month = eventDate.toLocaleString('en-US', { month: 'short' });
    const day = eventDate.getDate();
    return `${isToday ? 'Today' : eventDate.toLocaleString('en-US', { weekday: 'short' })} • ${month} ${day}`;
  };

  const renderEventCard = ({ item }: { item: ServerEventItem }) => {
    const sportTag = item.ground?.kindofsport?.[0] || 'Sport';
    const currentBadgeStyle = getBadgeStyle(sportTag);

    return (
      // ✅ ИСПРАВЛЕНИЕ: Обернули карточку в Pressable для перехода по ID события
      <Pressable 
        style={styles.card} 
        onPress={() => router.push(`/event/${item.id}`)}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.sportBadge, {backgroundColor: currentBadgeStyle.bg}]}>
            <View style={[styles.sportDot, {backgroundColor: currentBadgeStyle.text}]} />
            <Text style={[styles.sportText, {color: currentBadgeStyle.text}]}>{sportTag.toUpperCase()}</Text>
          </View>
          <Text style={styles.timeText}>{item.startTime}</Text>
        </View>

        <Text style={styles.eventName}>{item.name}</Text>
        
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color="#6080A8" />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.ground?.name || 'Unknown Ground'}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.metaInfoRow}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color="#6080A8" />
              <Text style={styles.metaText}>{item.duration}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={14} color="#6080A8" />
              <Text style={styles.metaText} numberOfLines={1}>by {item.creator.name}</Text>
            </View>
          </View>

          <View style={styles.spotsBadge}>
            <Text style={styles.spotsText}>Active</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.id}
      renderItem={renderEventCard}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      ListHeaderComponent={
        <View style={styles.listHeader}>
          <Text style={styles.headerTitle}>
            {getHeaderDateTitle(selectedDate)}{' '}
            <Text style={styles.countText}>· {events.length} {events.length === 1 ? 'event' : 'events'}</Text>
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
  
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E6F4FE',
    shadowColor: '#334A77',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sportBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF0E6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  sportDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF8000', marginRight: 6 },
  sportText: { fontSize: 11, fontWeight: '700', color: '#FF8000' },
  timeText: { fontSize: 16, fontWeight: '800', color: '#334A77' },
  
  eventName: { fontSize: 16, fontWeight: '700', color: '#334A77', marginBottom: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  locationText: { fontSize: 13, color: '#6080A8', flex: 1 },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F0F6FC', paddingTop: 12 },
  metaInfoRow: { flexDirection: 'row', gap: 14, flex: 1, marginRight: 8 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: '#6080A8', fontWeight: '500', maxWidth: 90 },
  
  spotsBadge: { backgroundColor: '#EAF9F5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  spotsText: { color: '#27AE60', fontSize: 11, fontWeight: '700' },
  
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 40, gap: 8 },
  emptyText: { fontSize: 14, color: '#BACAD6', fontWeight: '500' },
});
