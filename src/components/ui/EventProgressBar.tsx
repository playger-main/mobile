// src/components/ui/EventProgressBar.tsx
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

interface EventProgressBarProps {
  currentPlayers: number;
  maxPlayers: number;
}

export default function EventProgressBar({
  currentPlayers,
  maxPlayers,
}: EventProgressBarProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const spotsLeft = maxPlayers - currentPlayers;
  const progressPercent = Math.min(100, (currentPlayers / maxPlayers) * 100);

  const spotsKey =
    spotsLeft === 1
      ? 'eventProgress.spotsLeft_one'
      : 'eventProgress.spotsLeft_other';

  const spotsText =
    spotsLeft > 0
      ? t(spotsKey, { count: spotsLeft })
      : t('eventProgress.noSpotsLeft');

  // ✅ Красный если мест нет, иначе акцентный
  const fillColor = spotsLeft <= 0 ? colors.danger : colors.accent;

  return (
    <View
      style={[
        styles.progressSection,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.progressLabels}>
        <Text style={[styles.spotsLeftText, { color: fillColor }]}>
          {spotsText}
        </Text>
        <Text
          style={[styles.progressCountText, { color: colors.textTertiary }]}
        >
          {currentPlayers}/{maxPlayers}
        </Text>
      </View>
      <View
        style={[
          styles.progressBarTrack,
          { backgroundColor: colors.surfaceSecondary },
        ]}
      >
        <View
          style={[
            styles.progressBarFill,
            { width: `${progressPercent}%`, backgroundColor: fillColor },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressSection: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  spotsLeftText: { fontSize: 13, fontWeight: '700' },
  progressCountText: { fontSize: 12, fontWeight: '600' },
  progressBarTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});