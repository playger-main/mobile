// src/components/ui/EventListCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
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

interface EventListCardProps {
  item: ServerEventItem;
  /** Показывать бейдж "Creator", если ты — автор */
  showCreatorBadge?: boolean;
  /** ID текущего пользователя (для показа бейджа автора) */
  currentUserId?: string;
  /** Показать дату в карточке (используется на экранах "мои события") */
  showDate?: boolean;
}

export default function EventListCard({
  item,
  showCreatorBadge = false,
  currentUserId,
  showDate = false,
}: EventListCardProps) {
  const router = useRouter();

  const sportsList: string[] =
    Array.isArray(item.ground?.kindofsport) && item.ground.kindofsport.length > 0
      ? item.ground.kindofsport
      : [];

  const status = getEventStatus(item.date, item.startTime, item.duration);
  const statusStyle = getEventStatusStyle(status);
  const statusLabel = getEventStatusLabel(status);

  const players = item.currentPlayers ?? 0;
  const maxPlayers = item.maxPlayers ?? 0;
  const isFull = maxPlayers > 0 && players >= maxPlayers;

  const isCreator = showCreatorBadge && item.creator?.id === currentUserId;

  // Форматируем дату для отображения
  const dateLabel = (() => {
    if (!showDate || !item.date) return null;
    try {
      const d = new Date(item.date);
      const month = d.toLocaleString('en-US', { month: 'short' });
      const day = d.getDate();
      return `${month} ${day}`;
    } catch {
      return item.date;
    }
  })();

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/event/${item.id}`)}
    >
      <View style={styles.cardHeader}>
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
              <Text style={[styles.sportText, { color: '#6080A8' }]}>
                SPORT
              </Text>
            </View>
          )}

          {sportsList.length > 2 && (
            <View style={styles.moreBadge}>
              <Text style={styles.moreBadgeText}>+{sportsList.length - 2}</Text>
            </View>
          )}

          {isCreator && (
            <View style={styles.creatorBadge}>
              <Ionicons name="star" size={9} color="#FFFFFF" />
              <Text style={styles.creatorBadgeText}>HOST</Text>
            </View>
          )}
        </View>

        <View style={styles.rightHeader}>
          {dateLabel && <Text style={styles.dateText}>{dateLabel}</Text>}
          <Text style={styles.timeText}>{item.startTime}</Text>
        </View>
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
            <Ionicons
              name={isFull ? 'people' : 'people-outline'}
              size={14}
              color={isFull ? '#FF3B30' : '#6080A8'}
            />
            <Text
              style={[styles.metaText, isFull && styles.metaTextFull]}
              numberOfLines={1}
            >
              {players}/{maxPlayers} players
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
}

const styles = StyleSheet.create({
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

  creatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#006EE6',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
  },
  creatorBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },

  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: { fontSize: 13, fontWeight: '700', color: '#6080A8' },
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
    maxWidth: 120,
  },
  metaTextFull: { color: '#FF3B30', fontWeight: '700' },

  spotsBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  spotsText: { fontSize: 11, fontWeight: '700' },
});
