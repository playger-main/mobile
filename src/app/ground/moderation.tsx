// src/app/ground/moderation.tsx
import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUnit } from 'effector-react';
import { Ionicons } from '@expo/vector-icons';

import PendingGroundCard from '@/components/ui/PendingGroundCard';
import { ExtendedGroundItem } from '@/components/ui/CardGround';

import {
  fetchGroundsFx,
  confirmGroundFx,
  deleteGroundFx,
} from '@/effector/events/async/grounds';
import {
  $pendingGrounds,
  $isPendingLoading,
  $userSession,
} from '@/effector/store';

export default function ModerationScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { pendingGrounds, isLoading, user } = useUnit({
    pendingGrounds: $pendingGrounds,
    isLoading: $isPendingLoading,
    user: $userSession,
  });

  // ✅ Проверка роли: только модератор/админ
  const isModerator =
    user?.role?.includes('moderator') || user?.role?.includes('admin');

  useEffect(() => {
    if (isModerator) {
      // Запрашиваем площадки (сервер для модератора отдаст все, включая pending)
      fetchGroundsFx({
        kindofsport: undefined,
        search: undefined,
      });
    }
  }, [isModerator]);

  // ✅ ЗАЩИТА: если не модератор — выкидываем
  if (!isModerator) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/(drawer)/(tabs)'))}
            style={styles.backButton}
            hitSlop={12}
          >
            <Ionicons name="chevron-back" size={24} color="#006EE6" />
          </Pressable>
          <Text style={styles.headerTitle}>Moderation</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.forbiddenContainer}>
          <Ionicons name="lock-closed-outline" size={48} color="#BACAD6" />
          <Text style={styles.forbiddenTitle}>Access denied</Text>
          <Text style={styles.forbiddenText}>
            You don't have permission to access this screen.
          </Text>
        </View>
      </View>
    );
  }

  // ✅ Обработчик Approve
  const handleApprove = async (id: string) => {
    try {
      await confirmGroundFx({ id, confirmed: true });
      Alert.alert('Approved', 'The ground is now visible to all users.');
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to approve ground.');
    }
  };

  // ✅ Обработчик Reject = удаление
  const handleReject = (id: string) => {
    Alert.alert(
      'Reject ground?',
      'This will permanently delete the ground. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject & Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteGroundFx(id);
              Alert.alert('Rejected', 'The ground has been removed.');
            } catch (err: any) {
              Alert.alert('Error', err?.response?.data?.message || 'Failed to delete ground.');
            }
          },
        },
      ],
    );
  };

  const handleOpenDetail = (item: ExtendedGroundItem) => {
    router.push(`/ground/${item.id}`);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(drawer)/(tabs)'))}
          style={styles.backButton}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={24} color="#006EE6" />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Moderation</Text>
          <Text style={styles.headerSubtitle}>
            {pendingGrounds.length} pending {pendingGrounds.length === 1 ? 'ground' : 'grounds'}
          </Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* List */}
      {isLoading && pendingGrounds.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#208AEF" />
        </View>
      ) : (
        <FlatList
          data={pendingGrounds}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PendingGroundCard
              item={item}
              onApprove={handleApprove}
              onReject={handleReject}
              onPress={() => handleOpenDetail(item)}
            />
          )}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="shield-checkmark-outline" size={48} color="#27AE60" />
              <Text style={styles.emptyTitle}>All clear!</Text>
              <Text style={styles.emptyText}>
                There are no pending grounds waiting for moderation.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#F0F6FC',
    backgroundColor: '#FFFFFF',
  },
  backButton: { padding: 4, width: 32 },
  headerTitleContainer: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#334A77' },
  headerSubtitle: { fontSize: 12, color: '#BACAD6', fontWeight: '500', marginTop: 1 },
  headerSpacer: { width: 32 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingHorizontal: 16, paddingTop: 16 },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    gap: 8,
    paddingHorizontal: 32,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#334A77', marginTop: 8 },
  emptyText: {
    fontSize: 14,
    color: '#6080A8',
    textAlign: 'center',
    lineHeight: 20,
  },
  forbiddenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 32,
  },
  forbiddenTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#334A77',
    marginTop: 8,
  },
  forbiddenText: {
    fontSize: 14,
    color: '#6080A8',
    textAlign: 'center',
    lineHeight: 20,
  },
});