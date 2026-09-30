// src/components/ui/ListEvents.tsx
import React from 'react';
import { FlatList, View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ServerEventItem } from '@/effector/events/async/events';
import { getBadgeStyle } from '@/constants/badgeStyle';
import { getSportLabel } from '@/constants/sports';
import {
  getEventStatus,
  getEventStatusLabel,
  getEventStatusStyle,
} from '@/utils/eventStatus';

interface ListEventsProps {
  events: ServerEventItem[];
  selectedDate: string;
}

export default function ListEvents({ events, selectedDate }: ListEventsProps) {
  const router = useRouter();

  const getHeaderDateTitle = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    const today = new Date();
    const isToday = eventDate.toDateString() === today.toDateString();
    const month = eventDate.toLocaleString('en-US', { month: 'short' });
    const day = eventDate.getDate();
    return `${isToday ? 'Today' : eventDate.toLocaleString('en-US', { weekday: 'short' })} • ${month} ${day}`;
  };

  const renderEventCard = ({ item }: { item: ServerEventItem }) => {
    const sportsList: string[] =
      Array.isArray(item.ground?.kindofsport) && item.ground.kindofsport.length > 0
        ? item.ground.kindofsport
        : [];

    const status = getEventStatus(item.date, item.startTime, item.duration);
    const statusStyle = getEventStatusStyle(status);
    const statusLabel = getEventStatusLabel(status);

    return (
      <Pressable
        style={styles.card}
        onPress={() => router.push(`/event/${item.id}`)}
      >
        <View style={styles.cardHeader}>
          {/* ✅ 2 тега + +N */}
          <View style={styles.sportsRow}>
            {sportsList.length > 0 ? (
              sportsList.slice(0, 2).map((sportId, idx) => {
                const style = getBadgeStyle(sportId);
                const label = getSportLabel(sportId);
                return (
                  <View
                    key={`${sportId}-${idx}`}
                    style={[styles.sportBadge, { backgroundColor: style.bg }]}
                  >
                    <View
                      style={[styles.sportDot, { backgroundColor: style.text }]}
                    />
                    <Text style={[styles.sportText, { color: style.text }]}>
                      {label.toUpperCase()}
                    </Text>
                  </View>
                );
              })
            ) : (
              <View style={[styles.sportBadge, { backgroundColor: '#F0F4F8' }]}>
                <Text style={[styles.sportText, { color: '#6080A8' }]}>SPORT</Text>
              </View>
            )}

            {sportsList.length > 2 && (
              <View style={styles.moreBadge}>
                <Text style={styles.moreBadgeText}>+{sportsList.length - 2}</Text>
              </View>
            )}
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
              <Text style={styles.metaText} numberOfLines={1}>
                by {item.creator.name}
              </Text>
            </View>
          </View>

          <View style={[styles.spotsBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.spotsText, { color: statusStyle.text }]}>
              {statusLabel}
            </Text>
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },

  sportsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    flex: 1,
  },
  sportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sportDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  sportText: { fontSize: 11, fontWeight: '700' },
  moreBadge: {
    backgroundColor: '#F0F6FC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    justifyContent: 'center',
  },
  moreBadgeText: { fontSize: 11, fontWeight: '700', color: '#6080A8' },

  timeText: { fontSize: 16, fontWeight: '800', color: '#334A77' },

  eventName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334A77',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  locationText: { fontSize: 13, color: '#6080A8', flex: 1 },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F6FC',
    paddingTop: 12,
  },
  metaInfoRow: { flexDirection: 'row', gap: 14, flex: 1, marginRight: 8 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: {
    fontSize: 12,
    color: '#6080A8',
    fontWeight: '500',
    maxWidth: 90,
  },

  spotsBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  spotsText: { fontSize: 11, fontWeight: '700' },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    gap: 8,
  },
  emptyText: { fontSize: 14, color: '#BACAD6', fontWeight: '500' },
});