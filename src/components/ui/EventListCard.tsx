// src/components/ui/EventListCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ServerEventItem } from '@/effector/events/async/events';
import { getBadgeStyle } from '@/constants/badgeStyle';
import { getSportKey } from '@/constants/sports';
import {
  getEventStatus,
  getEventStatusLabelKey,
  getEventStatusStyle,
} from '@/utils/eventStatus';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';
import type { Language } from '@/i18n';

const LOCALE_MAP: Record<Language, string> = {
  en: 'en-US',
  ru: 'ru-RU',
  be: 'be-BY',
  lt: 'lt-LT',
  pl: 'pl-PL',
  uk: 'uk-UA',
};

interface EventListCardProps {
  item: ServerEventItem;
  showCreatorBadge?: boolean;
  currentUserId?: string;
  showDate?: boolean;
}

export default function EventListCard({
  item,
  showCreatorBadge = false,
  currentUserId,
  showDate = false,
}: EventListCardProps) {
  const router = useRouter();
  const { t, lang } = useTranslation();
  const { theme, colors } = useTheme();

  const sportsList: string[] =
    Array.isArray(item.ground?.kindofsport) && item.ground.kindofsport.length > 0
      ? item.ground.kindofsport
      : [];

  const status = getEventStatus(item.date, item.startTime, item.duration);
  const statusStyle = getEventStatusStyle(status, theme);
  const statusLabel = t(getEventStatusLabelKey(status));

  const players = item.currentPlayers ?? 0;
  const maxPlayers = item.maxPlayers ?? 0;
  const isFull = maxPlayers > 0 && players >= maxPlayers;

  const isCreator = showCreatorBadge && item.creator?.id === currentUserId;

  const dateLabel = (() => {
    if (!showDate || !item.date) return null;
    try {
      const d = new Date(item.date);
      const month = d.toLocaleString(LOCALE_MAP[lang] ?? 'en-US', {
        month: 'short',
      });
      return `${month} ${d.getDate()}`;
    } catch {
      return item.date;
    }
  })();

  return (
    <Pressable
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        },
      ]}
      onPress={() => router.push(`/event/${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.sportsRow}>
          {sportsList.length > 0 ? (
            sportsList.slice(0, 2).map((sportId, idx) => {
              const style = getBadgeStyle(sportId, theme);
              const label = t(getSportKey(sportId));
              return (
                <View
                  key={`${sportId}-${idx}`}
                  style={[styles.sportBadge, { backgroundColor: style.bg }]}
                >
                  <View style={[styles.sportDot, { backgroundColor: style.text }]} />
                  <Text style={[styles.sportText, { color: style.text }]}>
                    {label.toUpperCase()}
                  </Text>
                </View>
              );
            })
          ) : (
            <View style={[styles.sportBadge, { backgroundColor: colors.surfaceSecondary }]}>
              <Text style={[styles.sportText, { color: colors.textSecondary }]}>
                {t('sport.all').toUpperCase()}
              </Text>
            </View>
          )}

          {sportsList.length > 2 && (
            <View style={[styles.moreBadge, { backgroundColor: colors.primaryBg }]}>
              <Text style={[styles.moreBadgeText, { color: colors.textSecondary }]}>
                +{sportsList.length - 2}
              </Text>
            </View>
          )}

          {/* ✅ №17: тег "организатор" */}
          {isCreator && (
            <View style={[styles.creatorBadge, { backgroundColor: colors.primaryDark }]}>
              <Ionicons name="star" size={9} color="#FFFFFF" />
              <Text style={styles.creatorBadgeText}>{t('events.host')}</Text>
            </View>
          )}
        </View>

        <View style={styles.rightHeader}>
          {dateLabel && (
            <Text style={[styles.dateText, { color: colors.textSecondary }]}>
              {dateLabel}
            </Text>
          )}
          <Text style={[styles.timeText, { color: colors.textPrimary }]}>
            {item.startTime}
          </Text>
        </View>
      </View>

      <Text style={[styles.eventName, { color: colors.textPrimary }]}>{item.name}</Text>

      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
        <Text style={[styles.locationText, { color: colors.textSecondary }]} numberOfLines={1}>
          {item.ground?.name || t('events.unknownGround')}
        </Text>
      </View>

      <View style={[styles.cardFooter, { borderTopColor: colors.borderSubtle }]}>
        <View style={styles.metaInfoRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              {item.duration}
            </Text>
          </View>

          <View style={styles.metaItem}>
            <Ionicons
              name={isFull ? 'people' : 'people-outline'}
              size={14}
              color={isFull ? colors.danger : colors.textSecondary}
            />
            <Text
              style={[
                styles.metaText,
                { color: isFull ? colors.danger : colors.textSecondary },
                isFull && styles.metaTextFull,
              ]}
              numberOfLines={1}
            >
              {t('events.playersCount', { current: players, max: maxPlayers })}
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
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
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
  sportsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, flex: 1 },
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    justifyContent: 'center',
  },
  moreBadgeText: { fontSize: 11, fontWeight: '700' },
  creatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
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
  rightHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dateText: { fontSize: 13, fontWeight: '700' },
  timeText: { fontSize: 16, fontWeight: '800' },
  eventName: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  locationText: { fontSize: 13, flex: 1 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  metaInfoRow: { flexDirection: 'row', gap: 14, flex: 1, marginRight: 8 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, fontWeight: '500', maxWidth: 120 },
  metaTextFull: { fontWeight: '700' },
  spotsBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  spotsText: { fontSize: 11, fontWeight: '700' },
});