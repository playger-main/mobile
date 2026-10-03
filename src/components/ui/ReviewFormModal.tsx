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
import BottomSheet, { BottomSheetTextInput } from '@gorhom/bottom-sheet';
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
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

interface ReviewFormModalProps {
  visible: boolean;
  groundId: string;
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
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['56%', '90%'], []);

  const storeReview = useUnit($myReview);
  const isCreating = useUnit(createReviewFx.pending);
  const isUpdating = useUnit(updateReviewFx.pending);
  const createReview = useUnit(createReviewFx);
  const updateReview = useUnit(updateReviewFx);

  const myReview = initialReview ?? storeReview;
  const isEditing = !!myReview;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const isSubmitting = isCreating || isUpdating;
  const canSubmit = rating >= 1 && !isSubmitting;

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
      Alert.alert(
        t('reviewForm.ratingRequired'),
        t('reviewForm.selectAtLeast1'),
      );
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
        t('common.error'),
        Array.isArray(raw) ? raw.join('\n') : String(raw || t('common.tryAgain')),
      );
    }
  };

  const ratingHintText = (() => {
    if (rating === 0) return t('reviewForm.tapToRate');
    if (rating === 1) return t('reviewForm.poor');
    if (rating === 2) return t('reviewForm.fair');
    if (rating === 3) return t('reviewForm.good');
    if (rating === 4) return t('reviewForm.veryGood');
    return t('reviewForm.excellent');
  })();

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
      backgroundStyle={{
        backgroundColor: colors.surface,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderWidth: 1,
        borderBottomWidth: 0,
        borderColor: colors.border,
      }}
      handleComponent={() => (
        <View style={styles.handleContainer}>
          <View
            style={[styles.handlePill, { backgroundColor: colors.textTertiary }]}
          />
        </View>
      )}
    >
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {isEditing ? t('reviewForm.editTitle') : t('reviewForm.title')}
          </Text>
          <Pressable
            onPress={onClose}
            hitSlop={10}
            style={[
              styles.closeBtn,
              { backgroundColor: colors.surfaceSecondary },
            ]}
          >
            <Ionicons name="close" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        <Text style={[styles.label, { color: colors.textPrimary }]}>
          {t('reviewForm.yourRating')}
        </Text>
        <View style={styles.ratingRow}>
          <StarRating value={rating} size={36} onChange={setRating} />
        </View>
        <Text style={[styles.ratingHint, { color: colors.textSecondary }]}>
          {ratingHintText}
        </Text>

        <Text style={[styles.label, { color: colors.textPrimary }]}>
          {t('reviewForm.comment')}
        </Text>
        <BottomSheetTextInput
          style={[
            styles.textarea,
            {
              color: colors.textPrimary,
              backgroundColor: colors.surfaceSecondary,
              borderColor: colors.border,
            },
          ]}
          value={comment}
          onChangeText={setComment}
          placeholder={t('reviewForm.commentPlaceholder')}
          placeholderTextColor={colors.textTertiary}
          multiline
          maxLength={500}
          textAlignVertical="top"
        />
        <Text style={[styles.counter, { color: colors.textTertiary }]}>
          {comment.length}/500
        </Text>

        <Pressable
          style={[
            styles.submitBtn,
            { backgroundColor: colors.primaryDark },
          ]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={[styles.submitBtnText, { color: '#FFFFFF' }]}>
              {isEditing
                ? t('common.saveChanges')
                : t('reviewForm.postButton')}
            </Text>
          )}
        </Pressable>

        <View style={{ height: insets.bottom + 8 }} />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  handleContainer: { alignItems: 'center', paddingVertical: 10 },
  handlePill: {
    width: 55,
    height: 4,
    borderRadius: 2,
  },
  content: { paddingHorizontal: 20 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: { fontSize: 18, fontWeight: '700' },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 4,
  },
  ratingRow: { alignItems: 'center', paddingVertical: 6 },
  ratingHint: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
    marginBottom: 16,
  },
  textarea: {
    minHeight: 100,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    lineHeight: 20,
    textAlignVertical: 'top',
  },
  counter: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'right',
    marginTop: 4,
    marginBottom: 16,
  },
  submitBtn: {
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: { fontSize: 16, fontWeight: '700' },
});