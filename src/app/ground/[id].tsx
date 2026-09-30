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
} from '@/effector/store';
import { toggleFavoriteInStore } from '@/effector/events/sync';
import { getBadgeStyle } from '@/constants/badgeStyle';
import { getAmenityIcon } from '@/constants/amenities';

export default function GroundDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { ground, events, isLoading, toggleFavorite, user } = useUnit({
    ground: $currentGround,
    events: $currentGroundEvents,
    isLoading: $isGroundDetailLoading,
    toggleFavorite: toggleFavoriteInStore,
    user: $userSession,
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
      const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
      return { day, month };
    } catch {
      return { day: '00', month: 'EVT' };
    }
  };

  const primarySport =
    ground.kindofsport && ground.kindofsport.length > 0
      ? ground.kindofsport[0]
      : 'Sport';

  const currentBadgeStyle = getBadgeStyle(primarySport);

  const displayDistance = ground.distanceMeters
    ? `${(ground.distanceMeters / 1000).toFixed(1)} km away`
    : 'Nearby';

  // ✅ Удобства с сервера. Если пусто — фолбэк не показываем (или можно подставить дефолт)
  const amenitiesList: string[] =
    Array.isArray(ground.amenities) && ground.amenities.length > 0
      ? ground.amenities
      : [];

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

        {/* 2. Основная информация */}
        <View style={styles.contentContainer}>
          <View style={styles.metaRow}>
            <View style={[styles.sportBadge, { backgroundColor: currentBadgeStyle.bg }]}>
              <View style={[styles.sportDot, { backgroundColor: currentBadgeStyle.text }]} />
              <Text style={[styles.sportText, { color: currentBadgeStyle.text }]}>
                {primarySport.toUpperCase()}
              </Text>
            </View>

            <View style={styles.ratingBlock}>
              <Ionicons name="star" size={16} color="#FFCC00" />
              <Text style={styles.ratingText}>
                {ground.avgRating ? ground.avgRating.toFixed(1) : '0.0'}{' '}
                <Text style={styles.reviewsText}>({ground.eventsCount || 0})</Text>
              </Text>
            </View>
          </View>

          <Text style={styles.title}>{ground.name}</Text>
          <Text style={styles.address}>
            <Ionicons name="location-outline" size={14} color="#6080A8" />{' '}
            {ground.address || 'No address provided'}
          </Text>

          {/* 3. Мета-карточки */}
          <View style={styles.infoCardsRow}>
            <View style={styles.infoCard}>
              <Text style={styles.infoCardLabel}>Surface</Text>
              <Text style={styles.infoCardValue}>
                {ground.coverage && ground.coverage.length > 0
                  ? ground.coverage[0]
                  : 'Asphalt'}
              </Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoCardLabel}>Distance</Text>
              <Text style={styles.infoCardValue}>{displayDistance}</Text>
            </View>
          </View>

          {/* 4. About */}
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>
            {ground.description ||
              'A community-focused open court for practice and friendly team matches. Check upcoming events to join existing teams.'}
          </Text>

          {/* 5. Amenities — динамически с сервера */}
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

          {/* 6. Upcoming events */}
          <Text style={styles.sectionTitle}>Upcoming events ({events.length})</Text>

          {events.length > 0 ? (
            events.map((event) => {
              const dateInfo = formatEventDate(event.date);
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

                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color="#BACAD6"
                    style={{ marginLeft: 4 }}
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
    zIndex: 10,
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
  contentContainer: { paddingHorizontal: 16, paddingTop: 16 },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  ratingBlock: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 14, fontWeight: '700', color: '#334A77' },
  reviewsText: { color: '#BACAD6', fontWeight: '400' },
  title: { fontSize: 24, fontWeight: '800', color: '#334A77', marginTop: 8 },
  address: { fontSize: 14, color: '#6080A8', marginTop: 4 },
  infoCardsRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  infoCard: {
    flex: 1,
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6F4FE',
  },
  infoCardLabel: { fontSize: 12, color: '#BACAD6', fontWeight: '500' },
  infoCardValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334A77',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334A77',
    marginTop: 24,
    marginBottom: 12,
  },
  description: { fontSize: 14, color: '#6080A8', lineHeight: 20 },
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
