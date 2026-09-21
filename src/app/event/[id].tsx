// src/app/event/[id].tsx
import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, ActivityIndicator, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';
import { Ionicons } from '@expo/vector-icons';

import { fetchEventByIdFx } from '@/effector/events/async/events';
import { $currentEvent, $isEventDetailLoading } from '@/effector/store';

// Импортируем наши новые компоненты
import EventGridInfo from '@/components/ui/EventGridInfo';
import EventProgressBar from '@/components/ui/EventProgressBar';
import EventLocationCard from '@/components/ui/EventLocationCard';
import { getBadgeStyle } from '@/constants/badgeStyle';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { event, isLoading } = useUnit({
    event: $currentEvent,
    isLoading: $isEventDetailLoading,
  });

  useEffect(() => {
    if (id) {
      fetchEventByIdFx(id);
    }
  }, [id]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(drawer)/(tabs)/events');
    }
  };

  if (isLoading || !event) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#208AEF" />
      </View>
    );
  }

  const maxPlayers = event.maxPlayers || 14;
  const currentPlayers = event.currentPlayers || 12;
  const sportTag = event.ground?.kindofsport?.[0] || 'Sport';
  const currentBadgeStyle = getBadgeStyle(sportTag);

  return (
    <View style={styles.container}>
      {/* Шапка навигации */}
      <View style={[styles.customHeader, { paddingTop: insets.top + 6 }]}>
        <Pressable onPress={handleBack} style={styles.backButton} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color="#208AEF" />
        </Pressable>
        <Text style={styles.headerTitle}>Event</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]} 
        showsVerticalScrollIndicator={false}
      >
        {/* Тег вида спорта */}
        <View style={[styles.sportBadge, {backgroundColor: currentBadgeStyle.bg}]}>
          <View style={[styles.sportDot, {backgroundColor: currentBadgeStyle.text}]} />
          <Text style={[styles.sportText, {color: currentBadgeStyle.text}]}>{sportTag.toUpperCase()}</Text>
        </View>

        {/* Название и создатель */}
        <Text style={styles.title}>{event.name}</Text>
        <Text style={styles.hostedText}>Hosted by {event.creator?.name || 'User'}</Text>

        {/* 1. Изолированная сетка карточек */}
        <EventGridInfo 
          date={event.date}
          startTime={event.startTime}
          duration={event.duration || '60m'}
          level={event.level || 'Intermediate'}
          currentPlayers={currentPlayers}
          maxPlayers={maxPlayers}
        />

        {/* 2. Изолированный Прогресс-бар мест */}
        <EventProgressBar 
          currentPlayers={currentPlayers}
          maxPlayers={maxPlayers}
        />

        {/* 3. Изолированная Карточка локации площадки */}
        <EventLocationCard 
          name={event.ground?.name || 'Playground'}
          address={event.ground?.address || 'Address'}
          onPress={() => router.push(`/ground/${event.ground?.id}`)}
        />

        {/* Подробное описание (Details) */}
        <Text style={styles.sectionTitle}>Details</Text>
        <Text style={styles.descriptionText}>
          {event.description || 'No additional details provided for this event.'}
        </Text>
      </ScrollView>

      {/* Фиксированная нижняя панель с кнопкой */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable 
          style={styles.joinButton} 
          onPress={() => console.log('Join event action triggered for id:', event.id)}
        >
          <Text style={styles.joinButtonText}>Join event</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  customHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingBottom: 12, borderBottomWidth: 1, borderColor: '#F0F6FC' },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#334A77' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },
  sportBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF0E6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 12 },
  sportDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF8000', marginRight: 6 },
  sportText: { fontSize: 11, fontWeight: '700', color: '#FF8000' },
  title: { fontSize: 24, fontWeight: '800', color: '#334A77', marginBottom: 4 },
  hostedText: { fontSize: 14, color: '#6080A8', marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#334A77', marginBottom: 8 },
  descriptionText: { fontSize: 14, color: '#6080A8', lineHeight: 20 },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1, borderColor: '#F0F6FC',
    ...Platform.select({
      ios: { shadowColor: '#334A77', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: -2 } },
      android: { elevation: 8 },
      web: { boxShadow: '0px -2px 6px rgba(51, 74, 119, 0.03)' }
    })
  },
  joinButton: { width: '100%', height: 48, backgroundColor: '#208AEF', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  joinButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
