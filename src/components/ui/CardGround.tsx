// src/components/ui/CardGround.tsx
import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUnit } from 'effector-react';

import { getBadgeStyle } from '@/constants/badgeStyle';
import { getSportKey } from '@/constants/sports';
import {
  $userLocation,
  $cityCenter,
  $upcomingEventsCountByGround,
} from '@/effector/store';
import { calculateDistance, formatDistance } from '@/utils/distance';
import { useTranslation } from '@/i18n';

export interface ExtendedGroundItem {
  id: string;
  name: string;
  kindofsport: string[];
  coverage: string[];
  amenities?: string[];
  description: string | null;
  confirmed?: boolean;
  createdAt: string;
  updatedAt: string;
  address: string | null;
  geolocation: { lat: string; lng: string } | null;
  avatar: string | null;
  photos?: string[];
  eventsCount: number;
  isFavorite: boolean;
  avgRating: number;
  distanceMeters?: number;
  creator?: { id: string; name: string } | null;
}

interface CardGroundProps {
  item: ExtendedGroundItem;
  onPress: () => void;
  onToggleFavorite: (groundId: string, isFavorite: boolean) => void;
}

export default function CardGround({
  item,
  onPress,
  onToggleFavorite,
}: CardGroundProps) {
  const { t } = useTranslation();
  const userLocation = useUnit($userLocation);
  const cityCenter = useUnit($cityCenter);
  const upcomingByGround = useUnit($upcomingEventsCountByGround);

  const [imageError, setImageError] = useState(false);
  useEffect(() => {
    setImageError(false);
  }, [item.avatar]);

  const sportsList: string[] = useMemo(() => {
    if (Array.isArray(item.kindofsport) && item.kindofsport.length > 0) {
      return item.kindofsport;
    }
    return [];
  }, [item.kindofsport]);

  const upcomingCount = upcomingByGround[item.id] ?? 0;

  const distanceMeters = useMemo(() => {
    const origin = userLocation ?? cityCenter;
    if (!origin || !item.geolocation?.lat || !item.geolocation?.lng) {
      return item.distanceMeters;
    }
    return calculateDistance(
      origin.latitude,
      origin.longitude,
      Number(item.geolocation.lat),
      Number(item.geolocation.lng),
    );
  }, [userLocation, cityCenter, item.geolocation, item.distanceMeters]);

  const displayDistance =
    formatDistance(distanceMeters) ?? t('distance.nearby');
  const showImage = !!item.avatar && !imageError;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        {showImage ? (
          <Image
            key={item.avatar!}
            source={{ uri: item.avatar! }}
            style={styles.image}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={28} color="#BACAD6" />
          </View>
        )}

        {upcomingCount > 0 && (
          <View style={styles.compactEventBadge}>
            <Ionicons
              name="calendar"
              size={11}
              color="#FFFFFF"
              style={styles.badgeIcon}
            />
            <Text style={styles.compactEventText}>{upcomingCount}</Text>
          </View>
        )}

        {item.confirmed === false && (
          <View style={styles.pendingBadge}>
            <Ionicons name="time-outline" size={11} color="#FFFFFF" />
            <Text style={styles.pendingBadgeText}>
              {t('grounds.pendingBadge')}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {item.name}
          </Text>
          <Pressable
            onPress={() => onToggleFavorite(item.id, item.isFavorite)}
            style={styles.favoriteButton}
            hitSlop={8}
          >
            <Ionicons
              name={item.isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={item.isFavorite ? '#FF3B30' : '#BACAD6'}
            />
          </Pressable>
        </View>

        <Text style={styles.address} numberOfLines={1}>
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
                  <View
                    style={[styles.categoryDot, { backgroundColor: style.text }]}
                  />
                  <Text style={[styles.categoryText, { color: style.text }]}>
                    {label.toUpperCase()}
                  </Text>
                </View>
              );
            })}
            {sportsList.length > 2 && (
              <View style={styles.moreBadge}>
                <Text style={styles.moreBadgeText}>
                  +{sportsList.length - 2}
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.footerRow}>
          <View style={styles.ratingBlock}>
            <Ionicons name="star" size={14} color="#FFCC00" />
            <Text style={styles.ratingText}>
              {item.avgRating ? item.avgRating.toFixed(1) : '0.0'}{' '}
              <Text style={styles.reviewsText}>({item.eventsCount || 0})</Text>
            </Text>
          </View>

          <View style={styles.distanceBlock}>
            <Ionicons name="location-outline" size={14} color="#6080A8" />
            <Text style={styles.distanceText}>{displayDistance}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E6F4FE',
    shadowColor: '#334A77',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    width: 90,
    height: 90,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F0F4F8',
  },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F4F8',
  },
  compactEventBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#34C759',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  badgeIcon: { marginRight: 3 },
  compactEventText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  pendingBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#FF8000',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    zIndex: 1,
  },
  pendingBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  infoContainer: { flex: 1, marginLeft: 12, justifyContent: 'space-between' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334A77',
    flex: 1,
    marginRight: 8,
  },
  favoriteButton: { padding: 2 },
  address: { fontSize: 13, color: '#6080A8', marginTop: -2 },
  sportsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 6,
  },
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
    backgroundColor: '#F0F6FC',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    justifyContent: 'center',
  },
  moreBadgeText: { fontSize: 9, fontWeight: '700', color: '#6080A8' },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  ratingBlock: { flexDirection: 'row', alignItems: 'center' },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334A77',
    marginLeft: 4,
  },
  reviewsText: { color: '#BACAD6', fontWeight: '400' },
  distanceBlock: { flexDirection: 'row', alignItems: 'center' },
  distanceText: {
    fontSize: 12,
    color: '#6080A8',
    marginLeft: 2,
    fontWeight: '500',
  },
});