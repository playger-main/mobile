// src/components/ui/EventGridInfo.tsx
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EventGridInfoProps {
  date: string;
  startTime: string;
  duration: string;
  level: string;
  currentPlayers: number;
  maxPlayers: number;
}

export default function EventGridInfo({
  date,
  startTime,
  duration,
  level,
  currentPlayers,
  maxPlayers,
}: EventGridInfoProps) {
  return (
    <View style={styles.gridContainer}>
      <View style={styles.gridRow}>
        <View style={styles.infoCard}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="calendar-outline" size={14} color="#6080A8" />
            <Text style={styles.cardLabel}>Date</Text>
          </View>
          <Text style={styles.cardValue} numberOfLines={1}>{date}</Text>
        </View>
        <View style={styles.infoCard}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="time-outline" size={14} color="#6080A8" />
            <Text style={styles.cardLabel}>Time</Text>
          </View>
          <Text style={styles.cardValue} numberOfLines={1}>{startTime} · {duration}</Text>
        </View>
      </View>

      <View style={styles.gridRow}>
        <View style={styles.infoCard}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="stats-chart-outline" size={14} color="#6080A8" />
            <Text style={styles.cardLabel}>Level</Text>
          </View>
          <Text style={styles.cardValue} numberOfLines={1}>{level}</Text>
        </View>
        <View style={styles.infoCard}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="people-outline" size={14} color="#6080A8" />
            <Text style={styles.cardLabel}>Players</Text>
          </View>
          <Text style={styles.cardValue} numberOfLines={1}>{currentPlayers}/{maxPlayers}</Text>
        </View>
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
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  cardLabel: { fontSize: 12, color: '#BACAD6', fontWeight: '500' },
  cardValue: { fontSize: 14, fontWeight: '700', color: '#334A77' },
});
