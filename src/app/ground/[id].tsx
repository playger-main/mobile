// src/app/ground/[id].tsx
import React, { useCallback, useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';
import { Ionicons } from '@expo/vector-icons';

import { fetchGroundByIdFx } from '@/effector/events/async/grounds';
import { fetchEventsByGroundIdFx } from '@/effector/events/async/events';
import PhotoSlider from '@/components/ui/PhotoSlider';

import {
  $currentGround,
  $currentGroundEvents,
  $isGroundDetailLoading,
  $userSession,
  $userLocation,
  $cityCenter,
  $groundReviewStats,
  fetchGroundReviewsFx,
} from '@/effector/store';
import { toggleFavoriteInStore } from '@/effector/events/sync';
import { getBadgeStyle } from '@/constants/badgeStyle';
import { getSportKey } from '@/constants/sports';
import { getAmenityIcon, getAmenityKey } from '@/constants/amenities';
import { getSurfaceKey } from '@/constants/surface';
import { getEventStatus } from '@/utils/eventStatus';
import { navigateToGroundOnMap } from '@/utils/navigateToGround';
import { calculateDistance, formatDistance } from '@/utils/distance';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

export default function GroundDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { colors } = useTheme();

  const {
    ground,
    events,
    isLoading,
    toggleFavorite,
    user,
    userLocation,
    cityCenter,
  } = useUnit({
    ground: $currentGround,
    events: $currentGroundEvents,
    isLoading: $isGroundDetailLoading,
    toggleFavorite: toggleFavoriteInStore,
    user: $userSession,
    userLocation: $userLocation,
    cityCenter: $cityCenter,
  });

  const reviewStats = useUnit($groundReviewStats);
  const fetchReviews = useUnit(fetchGroundReviewsFx);

  const [showHistory, setShowHistory] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (id) {
        fetchGroundByIdFx(id);
        fetchEventsByGroundIdFx(id);
        fetchReviews(id);
      }
    }, [id]),
  );

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(drawer)/(tabs)');
  };

  const { activeEvents, upcomingEvents, pastEvents } = useMemo(() => {
    const active: typeof events = [];
    const upcoming: typeof events = [];
    const past: typeof events = [];

    for (const e of events) {
      const status = getEventStatus(e.date, e.startTime, e.duration);
      if (status === 'active') active.push(e);
      else if (status === 'upcoming') upcoming.push(e);
      else past.push(e);
    }

    past.sort((a, b) => {
      const da = new Date(`${a.date}T${a.startTime}`).getTime();
      const db = new Date(`${b.date}T${b.startTime}`).getTime();
      return db - da;
    });

    return { activeEvents: active, upcomingEvents: upcoming, pastEvents: past };
  }, [events]);

  if (isLoading || !ground) {
    return (
      <View
        style={[styles.loaderContainer, { backgroundColor: colors.background }]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const formatEventDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return { day: '??', month: '—' };
      const day = date.getDate().toString();
      const month = date
        .toLocaleString('en-US', { month: 'short' })
        .toUpperCase();
      return { day, month };
    } catch {
      return { day: '00', month: '—' };
    }
  };

  const distanceMeters = (() => {
    const origin = userLocation ?? cityCenter;
    if (!origin || !ground.geolocation?.lat || !ground.geolocation?.lng) {
      return ground.distanceMeters;
    }
    return calculateDistance(
      origin.latitude,
      origin.longitude,
      Number(ground.geolocation.lat),
      Number(ground.geolocation.lng),
    );
  })();
  const displayDistance =
    formatDistance(distanceMeters) ?? t('distance.nearby');

  const amenitiesList: string[] = Array.isArray(ground.amenities)
    ? ground.amenities
    : [];
  const sportsList: string[] =
    Array.isArray(ground.kindofsport) && ground.kindofsport.length > 0
      ? ground.kindofsport
      : [];
  const surfacesList: string[] = Array.isArray(ground.coverage)
    ? ground.coverage
    : [];

  const photosList: string[] =
    Array.isArray(ground.photos) && ground.photos.length > 0
      ? ground.photos
      : ground.avatar
        ? [ground.avatar]
        : [];

  const mainPhotoIndex = (() => {
    if (!ground.avatar) return 0;
    const idx = photosList.indexOf(ground.avatar);
    return idx >= 0 ? idx : 0;
  })();

  const hasCoordinates =
    !!ground.geolocation?.lat && !!ground.geolocation?.lng;
  const isCreator = user?.id === ground.creator?.id;
  const isModerator =
    user?.role?.includes('moderator') || user?.role?.includes('admin');
  const canEdit = isCreator || isModerator;

  const hasReviews = reviewStats.totalReviews > 0;

  const renderEventCard = (event: any) => {
    const dateInfo = formatEventDate(event.date);
    const players = event.currentPlayers ?? 0;
    const maxPlayers = event.maxPlayers ?? 0;

    return (
      <Pressable
        key={event.id}
        style={[
          styles.eventCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
        onPress={() => router.push(`/event/${event.id}`)}
      >
        <View
          style={[
            styles.eventDateBadge,
            { backgroundColor: colors.primaryBg },
          ]}
        >
          <Text style={[styles.eventDateText, { color: colors.primary }]}>
            {dateInfo.day}
          </Text>
          <Text style={[styles.eventMonthText, { color: colors.primary }]}>
            {dateInfo.month}
          </Text>
        </View>

        <View style={styles.eventInfo}>
          <Text
            style={[styles.eventTitle, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {event.name}
          </Text>
          <View style={styles.eventMeta}>
            <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.eventMetaText, { color: colors.textSecondary }]}>
              {event.startTime} • {event.duration || '—'}
            </Text>
            <Ionicons
              name="people-outline"
              size={14}
              color={colors.textSecondary}
              style={{ marginLeft: 12 }}
            />
            <Text style={[styles.eventMetaText, { color: colors.textSecondary }]}>
              {players}/{maxPlayers}
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <PhotoSlider
            key={photosList.join('|')}
            photos={photosList}
            mainIndex={mainPhotoIndex}
            initialIndex={mainPhotoIndex}
            height={260}
          />

          <View style={[styles.headerOverlay, { top: insets.top + 12 }]}>
            <Pressable
              onPress={handleBack}
              style={[styles.iconButton, { backgroundColor: colors.surface }]}
              hitSlop={8}
            >
              <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
            </Pressable>
            <View style={styles.headerRight}>
              {canEdit && (
                <Pressable
                  onPress={() => router.push(`/ground/edit?id=${ground.id}`)}
                  style={[
                    styles.iconButton,
                    { marginRight: 8, backgroundColor: colors.surface },
                  ]}
                  hitSlop={8}
                >
                  <Ionicons
                    name="create-outline"
                    size={22}
                    color={colors.textPrimary}
                  />
                </Pressable>
              )}
              <Pressable
                onPress={() => toggleFavorite(ground.id)}
                style={[styles.iconButton, { backgroundColor: colors.surface }]}
                hitSlop={8}
              >
                <Ionicons
                  name={ground.isFavorite ? 'heart' : 'heart-outline'}
                  size={22}
                  color={ground.isFavorite ? colors.danger : colors.textPrimary}
                />
              </Pressable>
            </View>
          </View>

          {ground.confirmed === false && (
            <View style={[styles.pendingBadge, { backgroundColor: colors.warning }]}>
              <Ionicons name="time-outline" size={12} color="#FFFFFF" />
              <Text style={styles.pendingBadgeText}>
                {t('grounds.pendingLong')}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.sportsRow}>
            {sportsList.length > 0 ? (
              sportsList.map((sportId) => {
                const style = getBadgeStyle(sportId);
                const label = t(getSportKey(sportId));
                return (
                  <View
                    key={sportId}
                    style={[styles.sportBadge, { backgroundColor: style.bg }]}
                  >
                    <View
                      style={[styles.sportDot, { backgroundColor: style.text }]}
                    />
                    <Text style={[styles.sportText, { color: style.text }]}>
                      {label.toUpperCase()}
                    </Text>
                  </View>
                );
              })
            ) : (
              <View
                style={[
                  styles.sportBadge,
                  { backgroundColor: colors.surfaceSecondary },
                ]}
              >
                <Text style={[styles.sportText, { color: colors.textSecondary }]}>
                  {t('sport.all').toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          <Pressable
            style={styles.ratingBlock}
            onPress={() =>
              router.push({
                pathname: '/reviews/ground/[id]',
                params: { id: ground.id },
              })
            }
            hitSlop={4}
          >
            <Ionicons name="star" size={16} color="#FFCC00" />
            {hasReviews ? (
              <>
                <Text style={[styles.ratingText, { color: colors.textPrimary }]}>
                  {reviewStats.avgRating.toFixed(1)}{' '}
                  <Text style={[styles.reviewsText, { color: colors.textTertiary }]}>
                    ({reviewStats.totalReviews})
                  </Text>
                </Text>
                <Text style={[styles.seeAllText, { color: colors.primary }]}>
                  {t('reviews.seeAll')}
                </Text>
              </>
            ) : (
              <Text style={[styles.noReviewsText, { color: colors.primary }]}>
                {t('reviews.noReviewsYet')}
              </Text>
            )}
            <Ionicons
              name="chevron-forward"
              size={14}
              color={colors.textTertiary}
              style={{ marginLeft: 4 }}
            />
          </Pressable>

          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {ground.name}
          </Text>
          <Text style={[styles.address, { color: colors.textSecondary }]}>
            <Ionicons
              name="location-outline"
              size={14}
              color={colors.textSecondary}
            />{' '}
            {ground.address || t('grounds.noAddress')}
          </Text>

          <View style={styles.mapRow}>
            {hasCoordinates ? (
              <Pressable
                style={[
                  styles.showOnMapButton,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() =>
                  navigateToGroundOnMap(
                    ground.geolocation!.lat,
                    ground.geolocation!.lng,
                  )
                }
              >
                <Ionicons name="map-outline" size={16} color={colors.primary} />
                <Text style={[styles.showOnMapText, { color: colors.primary }]}>
                  {t('groundDetail.showOnMap')}
                </Text>
              </Pressable>
            ) : (
              <View />
            )}
            <View style={styles.distanceBlock}>
              <Ionicons
                name="navigate-outline"
                size={14}
                color={colors.textSecondary}
              />
              <Text style={[styles.distanceText, { color: colors.textSecondary }]}>
                {displayDistance}
              </Text>
            </View>
          </View>

          {surfacesList.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                {t('groundDetail.surface')}
              </Text>
              <View style={styles.surfacesWrap}>
                {surfacesList.map((cov, idx) => (
                  <View
                    key={`${cov}-${idx}`}
                    style={[
                      styles.surfaceChip,
                      { backgroundColor: colors.primaryBg },
                    ]}
                  >
                    <Ionicons
                      name="layers-outline"
                      size={13}
                      color={colors.primary}
                    />
                    <Text
                      style={[styles.surfaceChipText, { color: colors.textPrimary }]}
                    >
                      {t(getSurfaceKey(cov))}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}

          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {t('groundDetail.about')}
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {ground.description || t('groundDetail.noDescription')}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {t('groundForm.amenities')}
          </Text>
          {amenitiesList.length > 0 ? (
            <View style={styles.amenitiesContainer}>
              {amenitiesList.map((amenity, idx) => (
                <View
                  key={`${amenity}-${idx}`}
                  style={[
                    styles.amenityChip,
                    { backgroundColor: colors.primaryBg },
                  ]}
                >
                  <Ionicons
                    name={getAmenityIcon(amenity) as any}
                    size={14}
                    color={colors.primary}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[styles.amenityText, { color: colors.textPrimary }]}
                  >
                    {t(getAmenityKey(amenity))}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={[styles.emptyAmenities, { color: colors.textTertiary }]}>
              {t('groundDetail.noAmenities')}
            </Text>
          )}

          {activeEvents.length > 0 && (
            <>
              <View style={styles.sectionHeaderRow}>
                <View style={[styles.liveDot, { backgroundColor: colors.accent }]} />
                <Text
                  style={[
                    styles.sectionTitle,
                    { marginBottom: 0, marginTop: 0, color: colors.textPrimary },
                  ]}
                >
                  {t('groundDetail.liveNow', { count: activeEvents.length })}
                </Text>
              </View>
              <View style={{ marginTop: 12 }}>
                {activeEvents.map(renderEventCard)}
              </View>
            </>
          )}

          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {t('groundDetail.upcomingEvents', {
              count: upcomingEvents.length,
            })}
          </Text>
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map(renderEventCard)
          ) : (
            <Text style={[styles.emptyEvents, { color: colors.textTertiary }]}>
              {t('groundDetail.noUpcoming')}
            </Text>
          )}

          {pastEvents.length > 0 && (
            <>
              <Pressable
                style={[
                  styles.historyToggle,
                  { backgroundColor: colors.surfaceSecondary },
                ]}
                onPress={() => setShowHistory((v) => !v)}
              >
                <View style={styles.historyToggleLeft}>
                  <Ionicons
                    name="time-outline"
                    size={18}
                    color={colors.textSecondary}
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={[styles.historyToggleText, { color: colors.textSecondary }]}
                  >
                    {t('groundDetail.history', { count: pastEvents.length })}
                  </Text>
                </View>
                <Ionicons
                  name={showHistory ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={colors.textSecondary}
                />
              </Pressable>

              {showHistory && (
                <View style={{ marginTop: 4 }}>
                  {pastEvents.map(renderEventCard)}
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: insets.bottom + 12,
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
        ]}
      >
        <Pressable
          style={[
            styles.createEventButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.primary,
            },
          ]}
          onPress={() => {
            if (user) {
              router.push({
                pathname: '/event/create',
                params: { groundId: ground.id },
              });
            } else {
              Alert.alert(
                t('common.authRequired'),
                t('groundDetail.createEventAuthHint'),
                [
                  { text: t('common.cancel'), style: 'cancel' },
                  {
                    text: t('common.signIn'),
                    onPress: () => router.push('/(drawer)/(tabs)/profile'),
                  },
                ],
              );
            }
          }}
        >
          <Ionicons
            name="calendar-outline"
            size={18}
            color={colors.primary}
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.createEventButtonText, { color: colors.primary }]}>
            {t('groundDetail.createEventButton')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageContainer: { width: '100%', height: 260, position: 'relative' },
  headerOverlay: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 10,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pendingBadge: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  pendingBadgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  contentContainer: { paddingHorizontal: 16, paddingTop: 16 },
  sportsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  sportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sportDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  sportText: { fontSize: 11, fontWeight: '700' },
  ratingBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  ratingText: { fontSize: 14, fontWeight: '700' },
  reviewsText: { fontWeight: '400' },
  seeAllText: { fontSize: 13, fontWeight: '600' },
  noReviewsText: { fontSize: 13, fontWeight: '600' },
  title: { fontSize: 24, fontWeight: '800', marginTop: 4 },
  address: { fontSize: 14, marginTop: 4 },
  mapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 12,
  },
  showOnMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  showOnMapText: { fontSize: 13, fontWeight: '600' },
  distanceBlock: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  distanceText: { fontSize: 13, fontWeight: '600' },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
    marginBottom: 12,
  },
  liveDot: { width: 8, height: 8, borderRadius: 4 },
  description: { fontSize: 14, lineHeight: 20 },
  surfacesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  surfaceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  surfaceChipText: { fontSize: 13, fontWeight: '500' },
  amenitiesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  amenityText: { fontSize: 13, fontWeight: '500' },
  emptyAmenities: { fontSize: 13, fontStyle: 'italic' },
  eventCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  eventDateBadge: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventDateText: { fontSize: 16, fontWeight: '800' },
  eventMonthText: { fontSize: 9, fontWeight: '700' },
  eventInfo: { flex: 1, marginLeft: 12 },
  eventTitle: { fontSize: 14, fontWeight: '600' },
  eventMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  eventMetaText: { fontSize: 12, marginLeft: 4 },
  emptyEvents: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 4,
  },
  historyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 24,
  },
  historyToggleLeft: { flexDirection: 'row', alignItems: 'center' },
  historyToggleText: { fontSize: 14, fontWeight: '700' },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    zIndex: 99,
  },
  createEventButton: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  createEventButtonText: { fontSize: 15, fontWeight: '600' },
});