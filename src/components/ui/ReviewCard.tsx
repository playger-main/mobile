// src/components/ui/ReviewCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import StarRating from './StarRating';
import { GroundReview } from '@/effector/events/async/reviews';

interface ReviewCardProps {
  review: GroundReview;
  /** Показать кнопки edit/delete (для моего отзыва) */
  isMine?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const formatRelativeDate = (ts: number): string => {
  const now = Date.now();
  const diff = now - ts;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;

  const date = new Date(ts);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function ReviewCard({
  review,
  isMine = false,
  onEdit,
  onDelete,
}: ReviewCardProps) {
  const router = useRouter();

  const authorName = review.author?.name || 'Anonymous';
  const initial = authorName.charAt(0).toUpperCase();
  const hasAvatar = !!review.author?.avatar;

  return (
    <View style={[styles.card, isMine && styles.cardMine]}>
      {/* Header */}
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
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
          )}

          <View>
            <View style={styles.nameRow}>
              <Text style={styles.authorName} numberOfLines={1}>
                {authorName}
              </Text>
              {isMine && (
                <View style={styles.myBadge}>
                  <Text style={styles.myBadgeText}>YOU</Text>
                </View>
              )}
            </View>
            <Text style={styles.dateText}>
              {formatRelativeDate(review.createdAt)}
            </Text>
          </View>
        </Pressable>

        {isMine && (
          <View style={styles.actions}>
            {onEdit && (
              <Pressable onPress={onEdit} hitSlop={8} style={styles.actionBtn}>
                <Ionicons name="create-outline" size={18} color="#208AEF" />
              </Pressable>
            )}
            {onDelete && (
              <Pressable onPress={onDelete} hitSlop={8} style={styles.actionBtn}>
                <Ionicons name="trash-outline" size={18} color="#FF3B30" />
              </Pressable>
            )}
          </View>
        )}
      </View>

      {/* Stars */}
      <View style={styles.starsRow}>
        <StarRating value={review.rating} size={16} />
      </View>

      {/* Comment */}
      {review.comment && (
        <Text style={styles.comment}>{review.comment}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6F4FE',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  cardMine: {
    borderColor: '#208AEF',
    backgroundColor: '#F8FBFF',
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
    backgroundColor: '#F0F4F8',
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#208AEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334A77',
    maxWidth: 160,
  },
  myBadge: {
    backgroundColor: '#208AEF',
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
  dateText: { fontSize: 11, color: '#BACAD6', marginTop: 1 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionBtn: { padding: 6 },
  starsRow: { marginBottom: 6 },
  comment: {
    fontSize: 13,
    color: '#334A77',
    lineHeight: 19,
  },
});
