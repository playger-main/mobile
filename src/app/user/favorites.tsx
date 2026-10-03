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

import CardGround from '@/components/ui/CardGround';
import {
  $myFavoriteGrounds,
  $isMyFavoritesLoading,
  fetchMyFavoriteGroundsFx,
  removeFavoriteFx,
} from '@/effector/store';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

export default function FavoriteGroundsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();

  const grounds = useUnit($myFavoriteGrounds);
  const isLoading = useUnit($isMyFavoritesLoading);
  const fetchFavorites = useUnit(fetchMyFavoriteGroundsFx);
  const removeFavorite = useUnit(removeFavoriteFx);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleToggleFavorite = (groundId: string) => {
    Alert.alert(
      t('favorites.removeTitle'),
      t('favorites.removeHint'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.remove'),
          style: 'destructive',
          onPress: async () => {
            try {
              await removeFavorite(groundId);
            } catch (e: any) {
              const raw = e?.response?.data?.message ?? e?.message;
              Alert.alert(
                t('common.error'),
                Array.isArray(raw)
                  ? raw.join('\n')
                  : String(raw || t('common.tryAgain')),
              );
            }
          },
        },
      ],
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.listBackground }]}
    >
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 6,
            backgroundColor: colors.background,
            borderColor: colors.borderSubtle,
          },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={24} color={colors.primaryDark} />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            {t('favorites.title')}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textTertiary }]}>
            {t('favorites.count', { count: grounds.length })}
          </Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      {isLoading && grounds.length === 0 ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
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
              <Ionicons
                name="heart-outline"
                size={48}
                color={colors.textTertiary}
              />
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                {t('favorites.empty')}
              </Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {t('favorites.emptyHint')}
              </Text>
              <Pressable
                style={[
                  styles.emptyButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={() => router.push('/(drawer)/(tabs)')}
              >
                <Text style={styles.emptyButtonText}>
                  {t('favorites.browseButton')}
                </Text>
              </Pressable>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backButton: { padding: 4 },
  headerTitleContainer: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  headerSubtitle: { fontSize: 12, fontWeight: '500', marginTop: 1 },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listContent: { padding: 16 },
  emptyBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyTitle: { fontSize: 17, fontWeight: '700', marginTop: 12 },
  emptyText: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  emptyButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});