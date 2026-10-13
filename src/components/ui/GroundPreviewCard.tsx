// src/components/ui/GroundPreviewCard.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUnit } from 'effector-react';
import { useRouter } from 'expo-router';

import SportIcon from './SportIcon';
import { ExtendedGroundItem } from './CardGround';
import { getBadgeStyle } from '@/constants/badgeStyle';
import { getSportKey } from '@/constants/sports';
import { formatDistance } from '@/utils/distance';
import {
  addFavoriteFx,
  removeFavoriteFx,
  $userSession,
} from '@/effector/store';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

interface GroundPreviewCardProps {
  ground: ExtendedGroundItem;
  onClose: () => void;
  onOpen: () => void;
}

export default function GroundPreviewCard({
  ground,
  onClose,
  onOpen,
}: GroundPreviewCardProps) {
  const { t } = useTranslation();
  const { theme, colors } = useTheme();
  const router = useRouter();

  const user = useUnit($userSession);
  const addFavorite = useUnit(addFavoriteFx);
  const removeFavorite = useUnit(removeFavoriteFx);

  const [imageError, setImageError] = React.useState(false);

  React.useEffect(() => {
    setImageError(false);
  }, [ground.avatar]);

  const showImage = !!ground.avatar && !imageError;
  const sports = Array.isArray(ground.kindofsport) ? ground.kindofsport : [];
  const displayDistance =
    formatDistance(ground.distanceMeters) ?? t('distance.nearby');
  const hasReviews = (ground.totalReviews ?? 0) > 0;

  const handleToggleFavorite = () => {
    if (!user) {
      Alert.alert(
        t('common.authRequired'),
        t('grounds.addAuthHint'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('common.signIn'),
            onPress: () => {
              onClose();
              router.push('/(drawer)/(tabs)/profile');
            },
          },
        ],
      );
      return;
    }

    if (ground.isFavorite) {
      removeFavorite(ground.id);
    } else {
      addFavorite(ground.id);
    }
  };

  const canLike = !!user;
  const isLiked = canLike && ground.isFavorite;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        },
      ]}
    >
      {/* Close */}
      <Pressable
        onPress={onClose}
        style={[styles.closeBtn, { backgroundColor: colors.surfaceSecondary }]}
        hitSlop={8}
      >
        <Ionicons name="close" size={18} color={colors.textSecondary} />
      </Pressable>

      {/* ✅ Content — без onPress (variant A) */}
      <View style={styles.content}>
        {/* Image */}
        <View
          style={[
            styles.imageContainer,
            { backgroundColor: colors.surfaceSecondary },
          ]}
        >
          {showImage ? (
            <Image
              key={ground.avatar!}
              source={{ uri: ground.avatar! }}
              style={styles.image}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons
                name="image-outline"
                size={28}
                color={colors.textTertiary}
              />
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text
              style={[styles.title, { color: colors.textPrimary }]}
              numberOfLines={1}
            >
              {ground.name}
            </Text>

            <Pressable
              onPress={handleToggleFavorite}
              hitSlop={10}
              style={styles.favoriteBtn}
            >
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={22}
                color={isLiked ? colors.danger : colors.textTertiary}
              />
            </Pressable>
          </View>

          <Text
            style={[styles.address, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {ground.address || t('grounds.noAddress')}
          </Text>

          {/* Sports */}
          {sports.length > 0 && (
            <View style={styles.sportsRow}>
              {sports.slice(0, 3).map((sportId, idx) => {
                const badge = getBadgeStyle(sportId, theme);
                const label = t(getSportKey(sportId));
                return (
                  <View
                    key={`${sportId}-${idx}`}
                    style={[
                      styles.sportBadge,
                      { backgroundColor: badge.bg },
                    ]}
                  >
                    <SportIcon id={sportId} size={11} color={badge.text} />
                    <Text
                      style={[
                        styles.sportText,
                        { color: badge.text, marginLeft: 4 },
                      ]}
                    >
                      {label.toUpperCase()}
                    </Text>
                  </View>
                );
              })}
              {sports.length > 3 && (
                <View
                  style={[
                    styles.moreBadge,
                    { backgroundColor: colors.primaryBg },
                  ]}
                >
                  <Text
                    style={[styles.moreBadgeText, { color: colors.textSecondary }]}
                  >
                    +{sports.length - 3}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Footer: rating + distance */}
          <View style={styles.footerRow}>
            <View style={styles.ratingBlock}>
              <Ionicons name="star" size={14} color="#FFCC00" />
              <Text style={[styles.ratingText, { color: colors.textPrimary }]}>
                {(ground.avgRating ?? 0).toFixed(1)}{' '}
                <Text style={[styles.reviewsText, { color: colors.textTertiary }]}>
                  ({ground.totalReviews ?? 0})
                </Text>
              </Text>
            </View>

            <View style={styles.distanceBlock}>
              <Ionicons
                name="location-outline"
                size={13}
                color={colors.textSecondary}
              />
              <Text
                style={[styles.distanceText, { color: colors.textSecondary }]}
              >
                {displayDistance}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* ✅ Кнопка «Открыть подробнее» — единственная ведущая на детали */}
      <Pressable
        style={[styles.openBtn, { backgroundColor: colors.primaryDark }]}
        onPress={onOpen}
      >
        <Text style={styles.openBtnText}>{t('grounds.openDetails')}</Text>
        <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 100,
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  content: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingRight: 32,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  favoriteBtn: { padding: 2 },
  address: { fontSize: 12, marginTop: 2 },
  sportsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 6,
  },
  sportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  sportText: { fontSize: 9, fontWeight: '700' },
  moreBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    justifyContent: 'center',
  },
  moreBadgeText: { fontSize: 9, fontWeight: '700' },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  ratingBlock: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 12, fontWeight: '600', marginLeft: 4 },
  reviewsText: { fontWeight: '400' },
  distanceBlock: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  distanceText: { fontSize: 12, fontWeight: '500' },
  openBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 42,
    borderRadius: 12,
  },
  openBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});