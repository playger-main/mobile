// src/app/reviews/ground/[id].tsx
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';
import { Ionicons } from '@expo/vector-icons';

import StarRating from '@/components/ui/StarRating';
import ReviewCard from '@/components/ui/ReviewCard';
import ReviewFormModal from '@/components/ui/ReviewFormModal';

import {
  $currentGround,
  $groundReviews,
  $groundReviewStats,
  $isReviewsLoading,
  $myReview,
  $userSession,
  fetchGroundReviewsFx,
  fetchMyReviewFx,
  deleteReviewFx,
} from '@/effector/store';

const formatRelativeDate = (ts: number): string => {
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;

  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function GroundReviewsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const ground = useUnit($currentGround);
  const reviews = useUnit($groundReviews);
  const reviewStats = useUnit($groundReviewStats);
  const isLoading = useUnit($isReviewsLoading);
  const myReview = useUnit($myReview);
  const user = useUnit($userSession);

  const fetchReviews = useUnit(fetchGroundReviewsFx);
  const fetchMyReview = useUnit(fetchMyReviewFx);
  const deleteReview = useUnit(deleteReviewFx);

  const [reviewFormVisible, setReviewFormVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (id) {
        fetchReviews(id);
        fetchMyReview(id);
      }
    }, [id]),
  );

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(drawer)/(tabs)');
  };

  const handleDeleteMyReview = () => {
    if (!myReview) return;
    Alert.alert('Delete your review?', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteReview(myReview.id);
            if (id) fetchReviews(id); // обновить статистику
          } catch {
            Alert.alert('Error', 'Could not delete review.');
          }
        },
      },
    ]);
  };

  const handleOpenReviewForm = () => {
    if (!user) {
      Alert.alert('Sign in required', 'Please sign in to leave a review.', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign In',
          onPress: () => router.push('/(drawer)/(tabs)/profile'),
        },
      ]);
      return;
    }
    setReviewFormVisible(true);
  };

  const hasReviews = reviewStats.totalReviews > 0;
  const groundTitle = ground?.name ?? 'Reviews';

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <Pressable
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={24} color="#006EE6" />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Reviews
          </Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {groundTitle}
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
          renderItem={({ item }) => (
            <ReviewCard
              review={item}
              // На этом экране кнопки edit/delete не нужны —
              // они есть в footer-карточке моего отзыва
              isMine={false}
            />
          )}
          ListHeaderComponent={
            hasReviews ? (
              <View style={styles.summaryBlock}>
                <Text style={styles.summaryNumber}>
                  {reviewStats.avgRating.toFixed(1)}
                </Text>
                <StarRating
                  value={Math.round(reviewStats.avgRating)}
                  size={22}
                />
                <Text style={styles.summaryCount}>
                  {reviewStats.totalReviews}{' '}
                  {reviewStats.totalReviews === 1 ? 'review' : 'reviews'}
                </Text>
              </View>
            ) : null
          }
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 140 },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyBlock}>
              <Ionicons name="star-outline" size={48} color="#BACAD6" />
              <Text style={styles.emptyTitle}>No reviews yet</Text>
              <Text style={styles.emptyText}>
                Be the first to share your experience on this ground.
              </Text>
            </View>
          }
        />
      )}

      {/* ============ STICKY FOOTER ============ */}
      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + 12 },
        ]}
      >
        {myReview ? (
          <View style={styles.myReviewCard}>
            <View style={styles.myReviewLeft}>
              <View style={styles.myReviewTopRow}>
                <StarRating value={myReview.rating} size={14} />
                <Text style={styles.myReviewDate}>
                  · {formatRelativeDate(myReview.createdAt)}
                </Text>
              </View>
              {myReview.comment ? (
                <Text style={styles.myReviewComment} numberOfLines={2}>
                  {myReview.comment}
                </Text>
              ) : (
                <Text style={styles.myReviewNoComment}>
                  No comment
                </Text>
              )}
            </View>

            <Pressable
              style={styles.footerIconBtn}
              onPress={() => setReviewFormVisible(true)}
              hitSlop={8}
            >
              <Ionicons name="create-outline" size={20} color="#208AEF" />
            </Pressable>
            <Pressable
              style={styles.footerIconBtn}
              onPress={handleDeleteMyReview}
              hitSlop={8}
            >
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.writeButton} onPress={handleOpenReviewForm}>
            <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.writeButtonText}>Write a review</Text>
          </Pressable>
        )}
      </View>

      {/* Форма отзыва */}
      <ReviewFormModal
        visible={reviewFormVisible}
        groundId={id || ''}
        onClose={() => setReviewFormVisible(false)}
        onSuccess={() => {
          if (id) {
            fetchReviews(id);
            fetchMyReview(id);
          }
        }}
      />
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
    maxWidth: 220,
  },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listContent: { padding: 16 },

  // Summary (большой рейтинг сверху)
  summaryBlock: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 8,
  },
  summaryNumber: {
    fontSize: 42,
    fontWeight: '800',
    color: '#334A77',
    lineHeight: 48,
  },
  summaryCount: {
    fontSize: 13,
    color: '#6080A8',
    fontWeight: '500',
    marginTop: 8,
  },

  // Empty state
  emptyBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
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

  // Sticky footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F6FC',
    shadowColor: '#334A77',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  writeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#006EE6',
  },
  writeButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },

  // My review card (в footer)
  myReviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FBFF',
    borderWidth: 1,
    borderColor: '#208AEF',
    borderRadius: 12,
    padding: 12,
  },
  myReviewLeft: { flex: 1 },
  myReviewTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  myReviewDate: { fontSize: 11, color: '#BACAD6', fontWeight: '500' },
  myReviewComment: {
    fontSize: 12,
    color: '#334A77',
    lineHeight: 17,
  },
  myReviewNoComment: {
    fontSize: 12,
    color: '#BACAD6',
    fontStyle: 'italic',
  },
  footerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6F4FE',
  },
});