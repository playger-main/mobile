// src/components/ui/ReviewCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import StarRating from './StarRating';
import { GroundReview } from '@/effector/events/async/reviews';
import { useTranslation, useRelativeDate } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

interface ReviewCardProps {
  review: GroundReview;
  isMine?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ReviewCard({
  review,
  isMine = false,
  onEdit,
  onDelete,
}: ReviewCardProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const formatRelativeDate = useRelativeDate();

  const authorName = review.author?.name || 'Anonymous';
  const initial = authorName.charAt(0).toUpperCase();
  const hasAvatar = !!review.author?.avatar;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isMine
            ? colors.surfaceSecondary
            : colors.surface,
          borderColor: isMine ? colors.primary : colors.border,
          borderWidth: isMine ? 1.5 : 1,
        },
      ]}
    >
      <View style={styles.header}>
        <Pressable
          style={styles.authorRow}
          disabled={!review.author?.id}
          onPress={() =>
            review.author?.id &&
            router.push({
              pathname: '/user/[id]',
              params: { id: review.author.id },
            })
          }
        >
          {hasAvatar ? (
            <Image
              key={review.author!.avatar!}
              source={{ uri: review.author!.avatar! }}
              style={[
                styles.avatar,
                { backgroundColor: colors.surfaceSecondary },
              ]}
            />
          ) : (
            <View
              style={[
                styles.avatarPlaceholder,
                { backgroundColor: colors.primary },
              ]}
            >
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
          )}

          <View>
            <View style={styles.nameRow}>
              <Text
                style={[styles.authorName, { color: colors.textPrimary }]}
                numberOfLines={1}
              >
                {authorName}
              </Text>
              {isMine && (
                <View
                  style={[
                    styles.myBadge,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Text style={styles.myBadgeText}>
                    {t('reviewCard.you')}
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={[styles.dateText, { color: colors.textTertiary }]}
            >
              {formatRelativeDate(review.createdAt)}
            </Text>
          </View>
        </Pressable>

        {isMine && (
          <View style={styles.actions}>
            {onEdit && (
              <Pressable onPress={onEdit} hitSlop={8} style={styles.actionBtn}>
                <Ionicons
                  name="create-outline"
                  size={18}
                  color={colors.primary}
                />
              </Pressable>
            )}
            {onDelete && (
              <Pressable
                onPress={onDelete}
                hitSlop={8}
                style={styles.actionBtn}
              >
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color={colors.danger}
                />
              </Pressable>
            )}
          </View>
        )}
      </View>

      <View style={styles.starsRow}>
        <StarRating value={review.rating} size={16} />
      </View>

      {review.comment && (
        <Text style={[styles.comment, { color: colors.textPrimary }]}>
          {review.comment}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    maxWidth: 160,
  },
  myBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  myBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  dateText: { fontSize: 11, marginTop: 1 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionBtn: { padding: 6 },
  starsRow: { marginBottom: 6 },
  comment: {
    fontSize: 13,
    lineHeight: 19,
  },
});