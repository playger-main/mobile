// src/components/ui/PendingGroundCard.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getBadgeStyle } from '@/constants/badgeStyle';
import { getSportKey } from '@/constants/sports';
import { ExtendedGroundItem } from './CardGround';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

interface PendingGroundCardProps {
  item: ExtendedGroundItem;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onPress: () => void;
  isProcessing?: boolean;
}

export default function PendingGroundCard({
  item,
  onApprove,
  onReject,
  onPress,
  isProcessing = false,
}: PendingGroundCardProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const sportsList: string[] =
    Array.isArray(item.kindofsport) && item.kindofsport.length > 0
      ? item.kindofsport
      : [];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.warning + '55',
          shadowColor: colors.shadow,
        },
      ]}
    >
      <Pressable style={styles.topSection} onPress={onPress}>
        <Image
          source={{ uri: item.avatar || 'https://unsplash.com' }}
          style={[styles.image, { backgroundColor: colors.surfaceSecondary }]}
        />
        <View style={styles.info}>
          <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.address, { color: colors.textSecondary }]} numberOfLines={1}>
            {item.address || t('grounds.noAddress')}
          </Text>

          {sportsList.length > 0 && (
            <View style={styles.sportsRow}>
              {sportsList.slice(0, 2).map((sportId, idx) => {
                const style = getBadgeStyle(sportId);
                const label = t(getSportKey(sportId));
                return (
                  <View
                    key={`${sportId}-${idx}`}
                    style={[styles.categoryBadge, { backgroundColor: style.bg }]}
                  >
                    <View style={[styles.categoryDot, { backgroundColor: style.text }]} />
                    <Text style={[styles.categoryText, { color: style.text }]}>
                      {label.toUpperCase()}
                    </Text>
                  </View>
                );
              })}
              {sportsList.length > 2 && (
                <View style={[styles.moreBadge, { backgroundColor: colors.primaryBg }]}>
                  <Text style={[styles.moreBadgeText, { color: colors.textSecondary }]}>
                    +{sportsList.length - 2}
                  </Text>
                </View>
              )}
            </View>
          )}

          {item.creator?.name && (
            <Text style={[styles.creatorText, { color: colors.textTertiary }]}>
              {t('pendingGround.byCreator', { name: item.creator.name })}
            </Text>
          )}
        </View>
      </Pressable>

      <View style={[styles.actions, { borderTopColor: colors.borderSubtle }]}>
        <Pressable
          style={[
            styles.actionButton,
            { backgroundColor: colors.dangerBg, borderRightColor: colors.borderSubtle },
          ]}
          onPress={() => onReject(item.id)}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color={colors.danger} />
          ) : (
            <>
              <Ionicons name="close-circle-outline" size={18} color={colors.danger} />
              <Text style={[styles.rejectText, { color: colors.danger }]}>
                {t('moderation.reject')}
              </Text>
            </>
          )}
        </Pressable>

        <Pressable
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={() => onApprove(item.id)}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
              <Text style={styles.approveText}>{t('moderation.approve')}</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  topSection: { flexDirection: 'row', padding: 12 },
  image: { width: 90, height: 90, borderRadius: 12 },
  info: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  title: { fontSize: 15, fontWeight: '700' },
  address: { fontSize: 12, marginTop: 2 },
  sportsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 6 },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryDot: { width: 5, height: 5, borderRadius: 2.5, marginRight: 4 },
  categoryText: { fontSize: 9, fontWeight: '700' },
  moreBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  moreBadgeText: { fontSize: 9, fontWeight: '700' },
  creatorText: { fontSize: 11, fontWeight: '500', marginTop: 4 },
  actions: { flexDirection: 'row', borderTopWidth: 1 },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRightWidth: 1,
  },
  rejectText: { fontSize: 13, fontWeight: '700' },
  approveText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
});