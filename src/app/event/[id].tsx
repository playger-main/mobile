// src/app/event/[id].tsx
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';
import { Ionicons } from '@expo/vector-icons';

import { fetchEventByIdFx, toggleJoinEventFx } from '@/effector/events/async/events';
import {
  $currentEvent,
  $isEventDetailLoading,
  $userSession,
} from '@/effector/store';

import EventGridInfo from '@/components/ui/EventGridInfo';
import EventProgressBar from '@/components/ui/EventProgressBar';
import EventLocationCard from '@/components/ui/EventLocationCard';
import ParticipantsModal from '@/components/ui/ParticipantsModal';
import { getBadgeStyle } from '@/constants/badgeStyle';
import { getSportLabel } from '@/constants/sports';
import { getEventStatus } from '@/utils/eventStatus';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { event, isLoading, userSession, toggleJoin, isJoining } = useUnit({
    event: $currentEvent,
    isLoading: $isEventDetailLoading,
    userSession: $userSession,
    toggleJoin: toggleJoinEventFx,
    isJoining: toggleJoinEventFx.pending,
  });

  const [participantsVisible, setParticipantsVisible] = useState(false);

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

  const handleJoinToggleAction = async () => {
    if (!userSession) {
      Alert.alert(
        'Authentication Required',
        'Please create an account or sign in to reserve a spot in this game.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign In',
            onPress: () => router.push('/(drawer)/(tabs)/profile'),
          },
        ],
      );
      return;
    }

    try {
      await toggleJoin(event!.id);
    } catch (err: any) {
      const raw = err?.response?.data?.message ?? err?.message;
      const message = Array.isArray(raw)
        ? raw.join('\n')
        : typeof raw === 'string'
          ? raw
          : 'Could not adjust slot metrics.';
      Alert.alert('Action Failed', message);
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
  const currentPlayers = event.currentPlayers || 0;

  const sportsList: string[] =
    Array.isArray(event.ground?.kindofsport) && event.ground.kindofsport.length > 0
      ? event.ground.kindofsport
      : [];

  const status = getEventStatus(event.date, event.startTime, event.duration);
  const isFinished = status === 'finished';

  const isJoined = Array.isArray(event.players)
    ? event.players.some((p) => p.id === userSession?.id)
    : false;

  const isFull = currentPlayers >= maxPlayers;

  const isCreator = userSession?.id === event.creator?.id;
  const isModerator =
    userSession?.role?.includes('moderator') ||
    userSession?.role?.includes('admin');
  const canEdit = isCreator || isModerator;

  // Список игроков: серверный массив + гарантированно добавляем создателя
  const playersList = (() => {
    const list = Array.isArray(event.players) ? [...event.players] : [];

    if (
      event.creator?.id &&
      !list.some((p) => p.id === event.creator!.id)
    ) {
      list.unshift({
        id: event.creator.id,
        name: event.creator.name || 'Creator',
      });
    }

    return list;
  })();

  let buttonText = 'Join event';
  let buttonStyle = [styles.joinButton, styles.primaryJoinBg];
  let buttonDisabled = false;

  if (isFinished) {
    buttonText = 'Event finished';
    buttonStyle = [styles.joinButton, styles.disabledBtnBg];
    buttonDisabled = true;
  } else if (isJoined) {
    buttonText = 'Leave event';
    buttonStyle = [styles.joinButton, styles.leaveBtnBg];
  } else if (isFull) {
    buttonText = 'Game Full';
    buttonStyle = [styles.joinButton, styles.disabledBtnBg];
    buttonDisabled = true;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.customHeader, { paddingTop: insets.top + 6 }]}>
        <Pressable onPress={handleBack} style={styles.backButton} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color="#208AEF" />
        </Pressable>
        <Text style={styles.headerTitle}>Event</Text>

        {canEdit ? (
          <Pressable
            onPress={() => router.push(`/event/edit?id=${event.id}`)}
            style={styles.editButton}
            hitSlop={12}
          >
            <Ionicons name="create-outline" size={22} color="#208AEF" />
          </Pressable>
        ) : (
          <View style={{ width: 24 }} />
        )}
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Спорт + статус */}
        <View style={styles.badgesRow}>
          {sportsList.length > 0 ? (
            sportsList.slice(0, 4).map((sportId, idx) => {
              const style = getBadgeStyle(sportId);
              const label = getSportLabel(sportId);
              return (
                <View
                  key={`${sportId}-${idx}`}
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

          {sportsList.length > 4 && (
            <View style={styles.moreBadge}>
              <Text style={styles.moreBadgeText}>+{sportsList.length - 4}</Text>
            </View>
          )}         
        </View>

        <Text style={styles.title}>{event.name}</Text>

        {/* ✅ Отдельный блок "Host" — кликабельный */}
        {event.creator && (
          <Pressable
            style={styles.hostCard}
            onPress={() =>
              router.push({
                pathname: '/user/[id]',
                params: {
                  id: event.creator.id,
                  name: event.creator.name,
                },
              })
            }
          >
            <View style={styles.hostAvatar}>
              <Text style={styles.hostAvatarText}>
                {event.creator.name?.charAt(0).toUpperCase() || '?'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.hostLabel}>Hosted by</Text>
              <Text style={styles.hostName} numberOfLines={1}>
                {event.creator.name || 'User'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#BACAD6" />
          </Pressable>
        )}

        <EventGridInfo
          date={event.date}
          startTime={event.startTime}
          duration={event.duration || '60m'}
          level={event.level || 'Intermediate'}
          currentPlayers={currentPlayers}
          maxPlayers={maxPlayers}
          status={status}                              // ✅ добавили
          onPlayersPress={() => setParticipantsVisible(true)}
        />

        <EventProgressBar currentPlayers={currentPlayers} maxPlayers={maxPlayers} />

        <EventLocationCard
          name={event.ground?.name || 'Playground'}
          address={event.ground?.address || 'Address'}
          avatar={event.ground?.avatar}
          latitude={event.ground?.geolocation?.lat}
          longitude={event.ground?.geolocation?.lng}
        />

        <Text style={styles.sectionTitle}>Details</Text>
        <Text style={styles.descriptionText}>
          {event.description || 'No additional details provided for this event.'}
        </Text>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable
          style={[buttonStyle, isJoining && styles.disabledBtnBg]}
          onPress={handleJoinToggleAction}
          disabled={isJoining || buttonDisabled}
        >
          {isJoining ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={[styles.joinButtonText, isJoined && styles.leaveBtnText]}>
              {buttonText}
            </Text>
          )}
        </Pressable>
      </View>

      <ParticipantsModal
        visible={participantsVisible}
        players={playersList}
        creatorId={event.creator?.id}
        maxPlayers={maxPlayers}
        onClose={() => setParticipantsVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#F0F6FC',
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#334A77' },
  editButton: { padding: 4 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },

  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  sportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sportDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  sportText: { fontSize: 11, fontWeight: '700' },
  moreBadge: {
    backgroundColor: '#F0F6FC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  moreBadgeText: { fontSize: 11, fontWeight: '700', color: '#6080A8' },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: { fontSize: 11, fontWeight: '700' },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#334A77',
    marginBottom: 12,
  },

  // ✅ Host-карточка
  hostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E6F4FE',
    borderRadius: 12,
    marginBottom: 20,
  },
  hostAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#006EE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hostAvatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  hostLabel: {
    fontSize: 11,
    color: '#BACAD6',
    fontWeight: '500',
  },
  hostName: {
    fontSize: 14,
    color: '#334A77',
    fontWeight: '700',
    marginTop: 1,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334A77',
    marginBottom: 8,
  },
  descriptionText: { fontSize: 14, color: '#6080A8', lineHeight: 20 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#F0F6FC',
    ...Platform.select({
      ios: {
        shadowColor: '#334A77',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: -2 },
      },
      android: { elevation: 8 },
      web: { boxShadow: '0px -2px 6px rgba(51, 74, 119, 0.03)' },
    }),
  },
  joinButton: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryJoinBg: { backgroundColor: '#208AEF' },
  leaveBtnBg: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  disabledBtnBg: { backgroundColor: '#BACAD6' },
  joinButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  leaveBtnText: { color: '#FF3B30' },
});