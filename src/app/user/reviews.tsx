// src/app/user/reviews.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUnit } from 'effector-react';
import { Ionicons } from '@expo/vector-icons';

import StarRating from '@/components/ui/StarRating';
import ReviewFormModal from '@/components/ui/ReviewFormModal';
import {
  $myReviews,
  $isMyReviewsLoading,
  fetchMyReviewsFx,
  deleteReviewFx,
} from '@/effector/store';
import { MyReview } from '@/effector/events/async/reviews';
import { useTranslation, useRelativeDate } from '@/i18n';

export default function MyReviewsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const formatRelativeDate = useRelativeDate();

  const reviews = useUnit($myReviews);
  const isLoading = useUnit($isMyReviewsLoading);
  const fetchMyReviews = useUnit(fetchMyReviewsFx);
  const deleteReview = useUnit(deleteReviewFx);

  const [editingReview, setEditingReview] = useState<MyReview | null>(null);

  useEffect(() => {
    fetchMyReviews();
  }, []);

  const handleDelete = (reviewId: string) => {
    Alert.alert(t('myReviews.deleteTitle'), t('myReviews.deleteHint'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteReview(reviewId);
          } catch {
            Alert.alert(t('common.error'), t('myReviews.deleteFailed'));
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: MyReview }) => {
    const groundName = item.ground?.name || t('events.unknownGround');
    const groundAddress = item.ground?.address || '';
    const hasPhoto = !!item.ground?.avatar;

    return (
      <View style={styles.card}>
        <Pressable
          style={styles.cardTop}
          onPress={() =>
            item.ground?.id &&
            router.push({
              pathname: '/ground/[id]',
              params: { id: item.ground.id },
            })
          }
        >
          {hasPhoto ? (
            <Image
              key={item.ground!.avatar!}
              source={{ uri: item.ground!.avatar! }}
              style={styles.groundImage}
            />
          ) : (
            <View style={styles.groundImagePlaceholder}>
              <Ionicons name="image-outline" size={24} color="#BACAD6" />
            </View>
          )}

          <View style={styles.groundInfo}>
            <Text style={styles.groundName} numberOfLines={1}>
              {groundName}
            </Text>
            {!!groundAddress && (
              <Text style={styles.groundAddress} numberOfLines={1}>
                {groundAddress}
              </Text>
            )}
            <View style={styles.ratingRow}>
              <StarRating value={item.rating} size={14} />
              <Text style={styles.dateText}>
                · {formatRelativeDate(item.createdAt)}
              </Text>
            </View>
          </View>

          <Ionicons name="chevron-forward" size={16} color="#BACAD6" />
        </Pressable>

        {item.comment && (
          <View style={styles.commentBlock}>
            <Text style={styles.commentText}>{item.comment}</Text>
          </View>
        )}

        <View style={styles.actions}>
          <Pressable
            style={styles.actionButton}
            onPress={() => setEditingReview(item)}
          >
            <Ionicons name="create-outline" size={16} color="#208AEF" />
            <Text style={[styles.actionText, { color: '#208AEF' }]}>
              {t('common.edit')}
            </Text>
          </Pressable>

          <View style={styles.actionsDivider} />

          <Pressable
            style={styles.actionButton}
            onPress={() => handleDelete(item.id)}
          >
            <Ionicons name="trash-outline" size={16} color="#FF3B30" />
            <Text style={[styles.actionText, { color: '#FF3B30' }]}>
              {t('common.delete')}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const countKey =
    reviews.length === 1 ? 'myReviews.count_one' : 'myReviews.count_other';

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={24} color="#006EE6" />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{t('myReviews.title')}</Text>
          <Text style={styles.headerSubtitle}>
            {t(countKey, { count: reviews.length })}
          </Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      {isLoading && reviews.length === 0 ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#208AEF" />
        </View>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyBlock}>
              <Ionicons name="star-outline" size={48} color="#BACAD6" />
              <Text style={styles.emptyTitle}>{t('myReviews.empty')}</Text>
              <Text style={styles.emptyText}>
                {t('myReviews.emptyHint')}
              </Text>
              <Pressable
                style={styles.emptyButton}
                onPress={() => router.push('/(drawer)/(tabs)')}
              >
                <Text style={styles.emptyButtonText}>
                  {t('myReviews.browseButton')}
                </Text>
              </Pressable>
            </View>
          }
        />
      )}

      {editingReview && (
        <ReviewFormModal
          visible={!!editingReview}
          groundId={editingReview.groundId || ''}
          initialReview={editingReview}
          onClose={() => setEditingReview(null)}
          onSuccess={() => {
            fetchMyReviews();
            setEditingReview(null);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#F0F6FC',
    backgroundColor: '#FFFFFF',
  },
  backButton: { padding: 4 },
  headerTitleContainer: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#334A77' },
  headerSubtitle: {
    fontSize: 12,
    color: '#BACAD6',
    fontWeight: '500',
    marginTop: 1,
  },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listContent: { padding: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E6F4FE',
    overflow: 'hidden',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  groundImage: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#F0F4F8',
  },
  groundImagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#F0F4F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  groundInfo: { flex: 1 },
  groundName: { fontSize: 15, fontWeight: '700', color: '#334A77' },
  groundAddress: { fontSize: 12, color: '#6080A8', marginTop: 2 },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  dateText: { fontSize: 11, color: '#BACAD6', fontWeight: '500' },
  commentBlock: { paddingHorizontal: 12, paddingBottom: 12 },
  commentText: { fontSize: 13, color: '#334A77', lineHeight: 19 },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F0F6FC',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  actionsDivider: { width: 1, backgroundColor: '#F0F6FC' },
  actionText: { fontSize: 13, fontWeight: '700' },
  emptyBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#334A77',
    marginTop: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#6080A8',
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#208AEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});