// src/app/user/favorites.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUnit } from 'effector-react';
import { Ionicons } from '@expo/vector-icons';

import CardGround, {
  ExtendedGroundItem,
} from '@/components/ui/CardGround';
import {
  $myFavoriteGrounds,
  $isMyFavoritesLoading,
  fetchMyFavoriteGroundsFx,
  removeFavoriteFx,
  toggleFavoriteInStore,
} from '@/effector/store';

export default function FavoriteGroundsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const grounds = useUnit($myFavoriteGrounds);
  const isLoading = useUnit($isMyFavoritesLoading);
  const fetchFavorites = useUnit(fetchMyFavoriteGroundsFx);
  const removeFavorite = useUnit(removeFavoriteFx);
  const toggleInStore = useUnit(toggleFavoriteInStore);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleToggleFavorite = (groundId: string) => {
    Alert.alert(
      'Remove from favourites?',
      'This ground will no longer appear in your favourites list.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeFavorite(groundId);
              // ✅ Синхронизируем флаг в общем сторе площадок
              toggleInStore(groundId);
            } catch (e: any) {
              const raw = e?.response?.data?.message ?? e?.message;
              Alert.alert(
                'Error',
                Array.isArray(raw) ? raw.join('\n') : String(raw || 'Try again.'),
              );
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={24} color="#006EE6" />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Favourite grounds</Text>
          <Text style={styles.headerSubtitle}>
            {grounds.length} saved
          </Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      {isLoading && grounds.length === 0 ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#208AEF" />
        </View>
      ) : (
        <FlatList
          data={grounds}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CardGround
              item={{ ...item, isFavorite: true }}
              onPress={() => router.push(`/ground/${item.id}`)}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyBlock}>
              <Ionicons name="heart-outline" size={48} color="#BACAD6" />
              <Text style={styles.emptyTitle}>No favourites yet</Text>
              <Text style={styles.emptyText}>
                Tap the heart icon on any ground to save it here.
              </Text>
              <Pressable
                style={styles.emptyButton}
                onPress={() => router.push('/(drawer)/(tabs)')}
              >
                <Text style={styles.emptyButtonText}>Browse grounds</Text>
              </Pressable>
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
  backButton: { padding: 4 },
  headerTitleContainer: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#334A77' },
  headerSubtitle: {
    fontSize: 12,
    color: '#BACAD6',
    fontWeight: '500',
    marginTop: 1,
  },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listContent: { padding: 16 },
  emptyBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#334A77',
    marginTop: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#6080A8',
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#208AEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
