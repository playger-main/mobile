// src/components/ui/EventProgressBar.tsx
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTranslation } from '@/i18n';

interface EventProgressBarProps {
  currentPlayers: number;
  maxPlayers: number;
}

export default function EventProgressBar({
  currentPlayers,
  maxPlayers,
}: EventProgressBarProps) {
  const { t } = useTranslation();

  const spotsLeft = maxPlayers - currentPlayers;
  const progressPercent = Math.min(100, (currentPlayers / maxPlayers) * 100);

  const spotsKey =
    spotsLeft === 1 ? 'eventProgress.spotsLeft_one' : 'eventProgress.spotsLeft_other';

  const spotsText =
    spotsLeft > 0
      ? t(spotsKey, { count: spotsLeft })
      : t('eventProgress.noSpotsLeft');

  return (
    <View style={styles.progressSection}>
      <View style={styles.progressLabels}>
        <Text style={styles.spotsLeftText}>{spotsText}</Text>
        <Text style={styles.progressCountText}>
          {currentPlayers}/{maxPlayers}
        </Text>
      </View>
      <View style={styles.progressBarTrack}>
        <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressSection: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6F4FE',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  spotsLeftText: { fontSize: 13, fontWeight: '700', color: '#27AE60' },
  progressCountText: { fontSize: 12, fontWeight: '600', color: '#BACAD6' },
  progressBarTrack: {
    width: '100%',
    height: 6,
    backgroundColor: '#F0F6FC',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#27AE60',
    borderRadius: 3,
  },
});
