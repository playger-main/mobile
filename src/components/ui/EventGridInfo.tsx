// src/components/ui/EventGridInfo.tsx
import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  getEventStatusLabelKey,
  getEventStatusStyle,
  EventStatus,
} from '@/utils/eventStatus';
import { getSkillLevelKey } from '@/constants/skillLevels';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

interface EventGridInfoProps {
  date: string;
  startTime: string;
  duration: string;
  level: string;
  currentPlayers: number;
  maxPlayers: number;
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
  const { t } = useTranslation();
  const { theme, colors } = useTheme();

  const statusStyle = getEventStatusStyle(status, theme);
  const statusLabel = t(getEventStatusLabelKey(status));
  const levelLabel = t(getSkillLevelKey(level));

  const showInTime = status === 'active';
  const showInDate = status !== 'active';

  const PlayersCard = onPlayersPress ? Pressable : View;

  const cardBaseStyle = {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  };

  return (
    <View style={styles.gridContainer}>
      <View style={styles.gridRow}>
        <View style={[styles.infoCard, cardBaseStyle]}>
          <View style={styles.cardHeaderRow}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={[styles.cardLabel, { color: colors.textTertiary }]}>
              {t('eventGrid.date')}
            </Text>

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
          <Text
            style={[styles.cardValue, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {date}
          </Text>
        </View>

        <View style={[styles.infoCard, cardBaseStyle]}>
          <View style={styles.cardHeaderRow}>
            <Ionicons
              name="time-outline"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={[styles.cardLabel, { color: colors.textTertiary }]}>
              {t('eventGrid.time')}
            </Text>

            {showInTime && (
              <View
                style={[
                  styles.inlineBadge,
                  { backgroundColor: statusStyle.bg },
                ]}
              >
                <View
                  style={[styles.liveDot, { backgroundColor: statusStyle.text }]}
                />
                <Text
                  style={[styles.inlineBadgeText, { color: statusStyle.text }]}
                >
                  {statusLabel}
                </Text>
              </View>
            )}
          </View>
          <Text
            style={[styles.cardValue, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {startTime} · {duration}
          </Text>
        </View>
      </View>

      <View style={styles.gridRow}>
        <View style={[styles.infoCard, cardBaseStyle]}>
          <View style={styles.cardHeaderRow}>
            <Ionicons
              name="stats-chart-outline"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={[styles.cardLabel, { color: colors.textTertiary }]}>
              {t('eventGrid.level')}
            </Text>
          </View>
          <Text
            style={[styles.cardValue, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {levelLabel}
          </Text>
        </View>

        <PlayersCard
          style={[
            styles.infoCard,
            cardBaseStyle,
            onPlayersPress && {
              borderColor: colors.primary,
              backgroundColor: colors.primaryBg,
            },
          ]}
          onPress={onPlayersPress}
        >
          <View style={styles.cardHeaderRow}>
            <Ionicons
              name="people-outline"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={[styles.cardLabel, { color: colors.textTertiary }]}>
              {t('eventGrid.players')}
            </Text>
            {onPlayersPress && (
              <Ionicons
                name="chevron-forward"
                size={12}
                color={colors.textTertiary}
                style={{ marginLeft: 'auto' }}
              />
            )}
          </View>
          <Text
            style={[styles.cardValue, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
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
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  cardLabel: { fontSize: 12, fontWeight: '500' },
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
  liveDot: { width: 5, height: 5, borderRadius: 2.5 },
  cardValue: { fontSize: 14, fontWeight: '700' },
});