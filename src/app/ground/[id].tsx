import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';
import { Ionicons } from '@expo/vector-icons';

import { fetchGroundByIdFx } from '@/effector/events/async/grounds';
import { $currentGround, $isGroundDetailLoading } from '@/effector/store';
import { toggleFavoriteInStore } from '@/effector/events/sync';

export default function GroundDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { ground, isLoading, toggleFavorite } = useUnit({
    ground: $currentGround,
    isLoading: $isGroundDetailLoading,
    toggleFavorite: toggleFavoriteInStore,
  });

  useEffect(() => {
    if (id) fetchGroundByIdFx(id);
  }, [id]);

  if (isLoading || !ground) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#208AEF" />
      </View>
    );
  }

  const primarySport = ground.kindofsport?.[0] || 'Sport';
  const displayDistance = ground.distanceMeters 
    ? `${(ground.distanceMeters / 1000).toFixed(1)} km away` 
    : 'Nearby';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 100 }} showsVerticalScrollIndicator={false}>
        
        {/* 1. Блок изображения площадки */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: ground.avatar }} style={styles.image} />
          
          {/* Плавающие кнопки Назад и Избранное */}
          <View style={[styles.headerOverlay, { top: insets.top + 12 }]}>
            <Pressable onPress={() => router.back()} style={styles.iconButton}>
              <Ionicons name="chevron-back" size={22} color="#334A77" />
            </Pressable>
            <Pressable onPress={() => toggleFavorite(ground.id)} style={styles.iconButton}>
              <Ionicons name={ground.isFavorite ? 'heart' : 'heart-outline'} size={22} color={ground.isFavorite ? '#FF3B30' : '#334A77'} />
            </Pressable>
          </View>
        </View>

        {/* 2. Основной контент */}
        <View style={styles.contentContainer}>
          <View style={styles.metaRow}>
            <View style={styles.sportBadge}>
              <Ionicons name="basketball-outline" size={14} color="#FF8000" style={{ marginRight: 4 }} />
              <Text style={styles.sportText}>{primarySport}</Text>
            </View>
            <View style={styles.ratingBlock}>
              <Ionicons name="star" size={16} color="#FFCC00" />
              <Text style={styles.ratingText}>
                {ground.avgRating?.toFixed(1) || '0.0'}{' '}
                <Text style={styles.reviewsText}>({ground.eventsCount || 0})</Text>
              </Text>
            </View>
          </View>

          <Text style={styles.title}>{ground.name}</Text>
          <Text style={styles.address}>
            <Ionicons name="location-outline" size={14} color="#6080A8" /> {ground.address || 'No address'}
          </Text>

          {/* 3. Две информационные карточки (Покрытие и Дистанция) */}
          <View style={styles.infoCardsRow}>
            <View style={styles.infoCard}>
              <Text style={styles.infoCardLabel}>Surface</Text>
              <Text style={styles.infoCardValue}>{ground.coverage?.[0] || 'Asphalt'}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoCardLabel}>Distance</Text>
              <Text style={styles.infoCardValue}>{displayDistance}</Text>
            </View>
          </View>

          {/* 4. Описание (About) */}
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>
            {ground.description || 'No description provided for this playground.'}
          </Text>

          {/* 5. Удобства (Amenities) */}
          {ground.amenities && ground.amenities.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.amenitiesContainer}>
                {ground.amenities.map((amenity, idx) => (
                  <View key={idx} style={styles.amenityChip}>
                    <Ionicons name="checkmark" size={12} color="#208AEF" style={{ marginRight: 4 }} />
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* 6. Список будущих событий */}
          <Text style={styles.sectionTitle}>Upcoming events ({ground.upcomingEvents?.length || 0})</Text>
          {ground.upcomingEvents && ground.upcomingEvents.length > 0 ? (
            ground.upcomingEvents.map((event) => (
              <View key={event.id} style={styles.eventCard}>
                <View style={styles.eventDateBadge}>
                  <Text style={styles.eventDateText}>{event.date.split(' ')[0]}</Text>
                  <Text style={styles.eventMonthText}>{event.date.split(' ')[1]}</Text>
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle} numberOfLines={1}>{event.title}</Text>
                  <View style={styles.eventMeta}>
                    <Ionicons name="time-outline" size={14} color="#6080A8" />
                    <Text style={styles.eventMetaText}>{event.time}</Text>
                    <Ionicons name="people-outline" size={14} color="#6080A8" style={{ marginLeft: 12 }} />
                    <Text style={styles.eventMetaText}>{event.playersCount}</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyEvents}>No planned events yet. Create one!</Text>
          )}
        </View>
      </ScrollView>

      {/* 7. Фиксированная нижняя панель — ТОЛЬКО С ОДНОЙ КНОПКОЙ, как вы просили */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable style={styles.createEventButton} onPress={() => console.log('Create event clicked')}>
          <Ionicons name="calendar-outline" size={18} color="#208AEF" style={{ marginRight: 8 }} />
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
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  headerOverlay: { position: 'absolute', left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', zIndex: 10 },
  iconButton: { width: 40, height: 40, backgroundColor: '#FFFFFF', borderRadius: 20, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  contentContainer: { paddingHorizontal: 16, paddingTop: 16 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sportBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF0E6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  sportText: { fontSize: 13, fontWeight: '600', color: '#FF8000' },
  ratingBlock: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 14, fontWeight: '700', color: '#334A77' },
  reviewsText: { color: '#BACAD6', fontWeight: '400' },
  title: { fontSize: 24, fontWeight: '800', color: '#334A77', marginTop: 8 },
  address: { fontSize: 14, color: '#6080A8', marginTop: 4 },
  infoCardsRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  infoCard: { flex: 1, padding: 12, backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#E6F4FE' },
  infoCardLabel: { fontSize: 12, color: '#BACAD6', fontWeight: '500' },
  infoCardValue: { fontSize: 15, fontWeight: '700', color: '#334A77', marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#334A77', marginTop: 20, marginBottom: 8 },
  description: { fontSize: 14, color: '#6080A8', lineHeight: 20 },
  amenitiesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  amenityChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F6FC', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  amenityText: { fontSize: 13, color: '#334A77', fontWeight: '500' },
  eventCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E6F4FE', borderRadius: 12, padding: 12, marginBottom: 10, alignItems: 'center' },
  eventDateBadge: { width: 44, height: 44, backgroundColor: '#EBF3FF', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  eventDateText: { fontSize: 16, fontWeight: '800', color: '#208AEF' },
  eventMonthText: { fontSize: 9, fontWeight: '700', color: '#208AEF', uppercase: true } as any,
  eventInfo: { flex: 1, marginLeft: 12 },
  eventTitle: { fontSize: 14, fontWeight: '600', color: '#334A77' },
  eventMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  eventMetaText: { fontSize: 12, color: '#6080A8', marginLeft: 4 },
  emptyEvents: { fontSize: 14, color: '#BACAD6', fontStyle: 'italic' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#E6F4FE' },
  createEventButton: { width: '100%', height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#208AEF', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  createEventButtonText: { color: '#208AEF', fontSize: 15, fontWeight: '600' },
});
