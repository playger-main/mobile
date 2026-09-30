// src/app/ground/[id].tsx
import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';
import { Ionicons } from '@expo/vector-icons';

import { fetchGroundByIdFx } from '@/effector/events/async/grounds';
import { fetchEventsByGroundIdFx } from '@/effector/events/async/events';

import {
  $currentGround,
  $currentGroundEvents,
  $isGroundDetailLoading,
  $userSession,
  $userLocation,
  $cityCenter,
} from '@/effector/store';
import { toggleFavoriteInStore } from '@/effector/events/sync';
import { getBadgeStyle } from '@/constants/badgeStyle';
import { getSportLabel } from '@/constants/sports';
import { getAmenityIcon } from '@/constants/amenities';
import { getSurfaceLabel } from '@/constants/surface';
import { getEventStatus, getEventStatusStyle } from '@/utils/eventStatus';
import { navigateToGroundOnMap } from '@/utils/navigateToGround';
import { calculateDistance, formatDistance } from '@/utils/distance';

export default function GroundDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { ground, events, isLoading, toggleFavorite, user, userLocation, cityCenter } =
    useUnit({
      ground: $currentGround,
      events: $currentGroundEvents,
      isLoading: $isGroundDetailLoading,
      toggleFavorite: toggleFavoriteInStore,
      user: $userSession,
      userLocation: $userLocation,
      cityCenter: $cityCenter,
    });

  useEffect(() => {
    if (id) {
      fetchGroundByIdFx(id);
      fetchEventsByGroundIdFx(id);
    }
  }, [id]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(drawer)/(tabs)');
    }
  };

  if (isLoading || !ground) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#208AEF" />
      </View>
    );
  }

  const formatEventDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return { day: '??', month: 'ED' };

      const day = date.getDate().toString();
      const month = date
        .toLocaleString('en-US', { month: 'short' })
        .toUpperCase();
      return { day, month };
    } catch {
      return { day: '00', month: 'EVT' };
    }
  };

  // ✅ Дистанция: клиентский расчёт (userLocation → cityCenter → серверная)
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

  const displayDistance = formatDistance(distanceMeters);

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

  const hasCoordinates =
    !!ground.geolocation?.lat && !!ground.geolocation?.lng;

  const isCreator = user?.id === ground.creator?.id;
  const isModerator =
    user?.role?.includes('moderator') || user?.role?.includes('admin');
  const canEdit = isCreator || isModerator;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Обложка */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: ground.avatar || 'https://unsplash.com' }}
            style={styles.image}
            resizeMode="cover"
          />

          <View style={[styles.headerOverlay, { top: insets.top + 12 }]}>
            <Pressable onPress={handleBack} style={styles.iconButton} hitSlop={8}>
              <Ionicons name="chevron-back" size={22} color="#334A77" />
            </Pressable>

            <View style={styles.headerRight}>
              {canEdit && (
                <Pressable
                  onPress={() => router.push(`/ground/edit?id=${ground.id}`)}
                  style={[styles.iconButton, { marginRight: 8 }]}
                  hitSlop={8}
                >
                  <Ionicons name="create-outline" size={22} color="#334A77" />
                </Pressable>
              )}

              <Pressable
                onPress={() => toggleFavorite(ground.id)}
                style={styles.iconButton}
                hitSlop={8}
              >
                <Ionicons
                  name={ground.isFavorite ? 'heart' : 'heart-outline'}
                  size={22}
                  color={ground.isFavorite ? '#FF3B30' : '#334A77'}
                />
              </Pressable>
            </View>
          </View>

          {ground.confirmed === false && (
            <View style={styles.pendingBadge}>
              <Ionicons name="time-outline" size={12} color="#FFFFFF" />
              <Text style={styles.pendingBadgeText}>Pending moderation</Text>
            </View>
          )}
        </View>

        {/* 2. Основная информация */}
        <View style={styles.contentContainer}>
          {/* Все виды спорта чипами */}
          <View style={styles.sportsRow}>
            {sportsList.length > 0 ? (
              sportsList.map((sportId) => {
                const style = getBadgeStyle(sportId);
                const label = getSportLabel(sportId);
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
              <View style={[styles.sportBadge, { backgroundColor: '#F0F4F8' }]}>
                <Text style={[styles.sportText, { color: '#6080A8' }]}>SPORT</Text>
              </View>
            )}
          </View>

          {/* Рейтинг */}
          <View style={styles.ratingBlock}>
            <Ionicons name="star" size={16} color="#FFCC00" />
            <Text style={styles.ratingText}>
              {ground.avgRating ? ground.avgRating.toFixed(1) : '0.0'}{' '}
              <Text style={styles.reviewsText}>({ground.eventsCount || 0})</Text>
            </Text>
          </View>

          <Text style={styles.title}>{ground.name}</Text>

          <Text style={styles.address}>
            <Ionicons name="location-outline" size={14} color="#6080A8" />{' '}
            {ground.address || 'No address provided'}
          </Text>

          {/* ✅ Одна строка: "Show on map" слева, дистанция справа */}
          <View style={styles.mapRow}>
            {hasCoordinates ? (
              <Pressable
                style={styles.showOnMapButton}
                onPress={() =>
                  navigateToGroundOnMap(
                    ground.geolocation!.lat,
                    ground.geolocation!.lng,
                  )
                }
              >
                <Ionicons name="map-outline" size={16} color="#208AEF" />
                <Text style={styles.showOnMapText}>Show on map</Text>
              </Pressable>
            ) : (
              <View />
            )}

            <View style={styles.distanceBlock}>
              <Ionicons name="navigate-outline" size={14} color="#6080A8" />
              <Text style={styles.distanceText}>{displayDistance}</Text>
            </View>
          </View>

          {/* Surface — массив покрытий */}
          {surfacesList.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Surface</Text>
              <View style={styles.surfacesWrap}>
                {surfacesList.map((cov, idx) => (
                  <View key={`${cov}-${idx}`} style={styles.surfaceChip}>
                    <Ionicons name="layers-outline" size={13} color="#208AEF" />
                    <Text style={styles.surfaceChipText}>
                      {getSurfaceLabel(cov)}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* About */}
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>
            {ground.description ||
              'A community-focused open court for practice and friendly team matches. Check upcoming events to join existing teams.'}
          </Text>

          {/* Amenities */}
          <Text style={styles.sectionTitle}>Amenities</Text>
          {amenitiesList.length > 0 ? (
            <View style={styles.amenitiesContainer}>
              {amenitiesList.map((amenity, idx) => (
                <View key={`${amenity}-${idx}`} style={styles.amenityChip}>
                  <Ionicons
                    name={getAmenityIcon(amenity) as any}
                    size={14}
                    color="#208AEF"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyAmenities}>
              No amenities listed for this ground yet.
            </Text>
          )}

          {/* Upcoming events */}
          <Text style={styles.sectionTitle}>Upcoming events ({events.length})</Text>

          {events.length > 0 ? (
            events.map((event) => {
              const dateInfo = formatEventDate(event.date);
              const status = getEventStatus(
                event.date,
                event.startTime,
                event.duration,
              );
              const statusStyle = getEventStatusStyle(status);

              return (
                <Pressable
                  key={event.id}
                  style={styles.eventCard}
                  onPress={() => router.push(`/event/${event.id}`)}
                >
                  <View style={styles.eventDateBadge}>
                    <Text style={styles.eventDateText}>{dateInfo.day}</Text>
                    <Text style={styles.eventMonthText}>{dateInfo.month}</Text>
                  </View>

                  <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle} numberOfLines={1}>
                      {event.name}
                    </Text>
                    <View style={styles.eventMeta}>
                      <Ionicons name="time-outline" size={14} color="#6080A8" />
                      <Text style={styles.eventMetaText}>
                        {event.startTime} • {event.duration || '1.5 hours'}
                      </Text>
                      <Ionicons
                        name="person-outline"
                        size={14}
                        color="#6080A8"
                        style={{ marginLeft: 12 }}
                      />
                      <Text style={styles.eventMetaText}>
                        by {event.creator?.name || 'User'}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[styles.statusDot, { backgroundColor: statusStyle.text }]}
                  />
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color="#BACAD6"
                    style={{ marginLeft: 6 }}
                  />
                </Pressable>
              );
            })
          ) : (
            <Text style={styles.emptyEvents}>
              No planned events on this court yet. Create one below!
            </Text>
          )}
        </View>
      </ScrollView>

      {/* 7. Нижняя панель с Create event */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable
          style={styles.createEventButton}
          onPress={() => {
            if (user) {
              router.push({
                pathname: '/event/create',
                params: { groundId: ground.id },
              });
            } else {
              Alert.alert(
                'Authentication Required',
                'Please sign in or create an account to organize matches on this playground.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Sign In',
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
            color="#208AEF"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.createEventButtonText}>Create event</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageContainer: { width: '100%', height: 260, position: 'relative' },
  image: { width: '100%', height: '100%' },
  headerOverlay: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#334A77',
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
    backgroundColor: '#FF8000',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  pendingBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
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
  ratingText: { fontSize: 14, fontWeight: '700', color: '#334A77' },
  reviewsText: { color: '#BACAD6', fontWeight: '400' },

  title: { fontSize: 24, fontWeight: '800', color: '#334A77', marginTop: 4 },
  address: { fontSize: 14, color: '#6080A8', marginTop: 4 },

  // ✅ Одна строка: show-on-map слева, дистанция справа
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
    borderColor: '#E6F4FE',
    backgroundColor: '#FFFFFF',
  },
  showOnMapText: { fontSize: 13, fontWeight: '600', color: '#208AEF' },

  distanceBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6080A8',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334A77',
    marginTop: 24,
    marginBottom: 12,
  },
  description: { fontSize: 14, color: '#6080A8', lineHeight: 20 },

  surfacesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  surfaceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F6FC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  surfaceChipText: {
    fontSize: 13,
    color: '#334A77',
    fontWeight: '500',
  },

  amenitiesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F6FC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  amenityText: { fontSize: 13, color: '#334A77', fontWeight: '500' },
  emptyAmenities: {
    fontSize: 13,
    color: '#BACAD6',
    fontStyle: 'italic',
  },

  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6F4FE',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  eventDateBadge: {
    width: 44,
    height: 44,
    backgroundColor: '#EBF3FF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventDateText: { fontSize: 16, fontWeight: '800', color: '#208AEF' },
  eventMonthText: { fontSize: 9, fontWeight: '700', color: '#208AEF' },
  eventInfo: { flex: 1, marginLeft: 12 },
  eventTitle: { fontSize: 14, fontWeight: '600', color: '#334A77' },
  eventMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  eventMetaText: { fontSize: 12, color: '#6080A8', marginLeft: 4 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginLeft: 8 },
  emptyEvents: {
    fontSize: 14,
    color: '#BACAD6',
    fontStyle: 'italic',
    marginTop: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E6F4FE',
    zIndex: 99,
  },
  createEventButton: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#208AEF',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },
  createEventButtonText: { color: '#208AEF', fontSize: 15, fontWeight: '600' },
});