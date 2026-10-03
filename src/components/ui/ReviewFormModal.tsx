// src/components/ui/ReviewFormModal.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  Keyboard,
} from 'react-native';
import BottomSheet, {
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';

import StarRating from './StarRating';
import {
  $myReview,
  createReviewFx,
  updateReviewFx,
} from '@/effector/store';
import { GroundReview } from '@/effector/events/async/reviews';

interface ReviewFormModalProps {
  visible: boolean;
  groundId: string;
  /**
   * ✅ Опционально: если передан — форма работает с ним (для экрана "My reviews").
   * Если не передан — берёт из глобального $myReview (для детальной площадки).
   */
  initialReview?: GroundReview | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ReviewFormModal({
  visible,
  groundId,
  initialReview,
  onClose,
  onSuccess,
}: ReviewFormModalProps) {
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['60%', '90%'], []);

  const storeReview = useUnit($myReview);
  const isCreating = useUnit(createReviewFx.pending);
  const isUpdating = useUnit(updateReviewFx.pending);
  const createReview = useUnit(createReviewFx);
  const updateReview = useUnit(updateReviewFx);

  // ✅ Приоритет: initialReview > storeReview
  const myReview = initialReview ?? storeReview;
  const isEditing = !!myReview;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const isSubmitting = isCreating || isUpdating;

  // ✅ Заполняем форму при открытии
  useEffect(() => {
    if (!visible) return;
    if (myReview) {
      setRating(myReview.rating);
      setComment(myReview.comment ?? '');
    } else {
      setRating(0);
      setComment('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, myReview?.id]);

  useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => {
        bottomSheetRef.current?.snapToIndex(0);
      });
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  if (!visible) return null;

  const handleSubmit = async () => {
    Keyboard.dismiss();

    if (rating < 1) {
      Alert.alert('Rating required', 'Please select at least 1 star.');
      return;
    }

    try {
      if (isEditing && myReview) {
        await updateReview({
          reviewId: myReview.id,
          rating,
          comment: comment.trim(),
        });
      } else {
        await createReview({
          groundId,
          rating,
          comment: comment.trim() || undefined,
        });
      }
      onSuccess?.();
      onClose();
    } catch (e: any) {
      const raw = e?.response?.data?.message ?? e?.message;
      Alert.alert(
        'Error',
        Array.isArray(raw) ? raw.join('\n') : String(raw || 'Try again.'),
      );
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose={true}
      onClose={onClose}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backgroundStyle={styles.sheetBackground}
      handleComponent={() => (
        <View style={styles.handleContainer}>
          <View style={styles.handlePill} />
        </View>
      )}
    >
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>
            {isEditing ? 'Edit your review' : 'Write a review'}
          </Text>
          <Pressable onPress={onClose} hitSlop={10} style={styles.closeBtn}>
            <Ionicons name="close" size={20} color="#6080A8" />
          </Pressable>
        </View>

        <Text style={styles.label}>Your rating</Text>
        <View style={styles.ratingRow}>
          <StarRating value={rating} size={36} onChange={setRating} />
        </View>
        <Text style={styles.ratingHint}>
          {rating === 0 && 'Tap a star to rate'}
          {rating === 1 && 'Poor'}
          {rating === 2 && 'Fair'}
          {rating === 3 && 'Good'}
          {rating === 4 && 'Very good'}
          {rating === 5 && 'Excellent!'}
        </Text>

        <Text style={styles.label}>Comment (optional)</Text>
        <BottomSheetTextInput
          style={styles.textarea}
          value={comment}
          onChangeText={setComment}
          placeholder="Share your experience with other players…"
          placeholderTextColor="#BACAD6"
          multiline
          maxLength={500}
          textAlignVertical="top"
        />
        <Text style={styles.counter}>{comment.length}/500</Text>

        <Pressable
          style={[
            styles.submitBtn,
            (rating < 1 || isSubmitting) && styles.submitBtnDisabled,
          ]}
          onPress={handleSubmit}
          disabled={rating < 1 || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.submitBtnText}>
              {isEditing ? 'Save changes' : 'Post review'}
            </Text>
          )}
        </Pressable>

        <View style={{ height: insets.bottom + 8 }} />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleContainer: { alignItems: 'center', paddingVertical: 10 },
  handlePill: {
    width: 55,
    height: 4,
    backgroundColor: '#BACAD6',
    borderRadius: 2,
  },
  content: { paddingHorizontal: 20 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: { fontSize: 18, fontWeight: '700', color: '#334A77' },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F6FC',
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    marginTop: 4,
  },
  ratingRow: { alignItems: 'center', paddingVertical: 6 },
  ratingHint: {
    textAlign: 'center',
    fontSize: 13,
    color: '#6080A8',
    fontWeight: '600',
    marginTop: 6,
    marginBottom: 16,
  },

  textarea: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#E6F4FE',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#334A77',
    backgroundColor: '#FFFFFF',
    lineHeight: 20,
    textAlignVertical: 'top',
  },
  counter: {
    fontSize: 11,
    color: '#BACAD6',
    fontWeight: '500',
    textAlign: 'right',
    marginTop: 4,
    marginBottom: 16,
  },

  submitBtn: {
    height: 50,
    borderRadius: 14,
    backgroundColor: '#006EE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnDisabled: { backgroundColor: '#BACAD6' },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
}); 