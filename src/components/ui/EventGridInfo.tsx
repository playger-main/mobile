// src/components/ui/EventGridInfo.tsx
import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  getEventStatusLabel,
  getEventStatusStyle,
  EventStatus,
} from '@/utils/eventStatus';

interface EventGridInfoProps {
  date: string;
  startTime: string;
  duration: string;
  level: string;
  currentPlayers: number;
  maxPlayers: number;
  /** ✅ Статус события: upcoming / active / finished */
  status: EventStatus;
  onPlayersPress?: () => void;
}

export default function EventGridInfo({
  date,
  startTime,
  duration,
  level,
  currentPlayers,
  maxPlayers,
  status,
  onPlayersPress,
}: EventGridInfoProps) {
  const statusStyle = getEventStatusStyle(status);
  const statusLabel = getEventStatusLabel(status);

  // ✅ Куда вешать бейдж: active → Time, иначе → Date
  const showInTime = status === 'active';
  const showInDate = status !== 'active';

  const PlayersCard = onPlayersPress ? Pressable : View;

  return (
    <View style={styles.gridContainer}>
      <View style={styles.gridRow}>
        {/* ✅ Date — со статусом для upcoming/finished */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="calendar-outline" size={14} color="#6080A8" />
            <Text style={styles.cardLabel}>Date</Text>

            {showInDate && (
              <View
                style={[
                  styles.inlineBadge,
                  { backgroundColor: statusStyle.bg },
                ]}
              >
                <Text
                  style={[styles.inlineBadgeText, { color: statusStyle.text }]}
                >
                  {statusLabel}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.cardValue} numberOfLines={1}>
            {date}
          </Text>
        </View>

        {/* ✅ Time — со статусом для active */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="time-outline" size={14} color="#6080A8" />
            <Text style={styles.cardLabel}>Time</Text>

            {showInTime && (
              <View
                style={[
                  styles.inlineBadge,
                  { backgroundColor: statusStyle.bg },
                ]}
              >
                <View
                  style={[
                    styles.liveDot,
                    { backgroundColor: statusStyle.text },
                  ]}
                />
                <Text
                  style={[styles.inlineBadgeText, { color: statusStyle.text }]}
                >
                  {statusLabel}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.cardValue} numberOfLines={1}>
            {startTime} · {duration}
          </Text>
        </View>
      </View>

      <View style={styles.gridRow}>
        <View style={styles.infoCard}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="stats-chart-outline" size={14} color="#6080A8" />
            <Text style={styles.cardLabel}>Level</Text>
          </View>
          <Text style={styles.cardValue} numberOfLines={1}>
            {level}
          </Text>
        </View>

        <PlayersCard
          style={[styles.infoCard, onPlayersPress && styles.infoCardClickable]}
          onPress={onPlayersPress}
        >
          <View style={styles.cardHeaderRow}>
            <Ionicons name="people-outline" size={14} color="#6080A8" />
            <Text style={styles.cardLabel}>Players</Text>
            {onPlayersPress && (
              <Ionicons
                name="chevron-forward"
                size={12}
                color="#BACAD6"
                style={{ marginLeft: 'auto' }}
              />
            )}
          </View>
          <Text style={styles.cardValue} numberOfLines={1}>
            {currentPlayers}/{maxPlayers}
          </Text>
        </PlayersCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: { gap: 12, marginBottom: 20 },
  gridRow: { flexDirection: 'row', gap: 12 },
  infoCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6F4FE',
    borderRadius: 12,
    padding: 12,
  },
  infoCardClickable: {
    borderColor: '#208AEF',
    backgroundColor: '#F8FBFF',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  cardLabel: { fontSize: 12, color: '#BACAD6', fontWeight: '500' },

  // ✅ Инлайн-бейдж статуса
  inlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  inlineBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },

  cardValue: { fontSize: 14, fontWeight: '700', color: '#334A77' },
});