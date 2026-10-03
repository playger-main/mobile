// src/components/ui/ParticipantsModal.tsx
import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTranslation } from '@/i18n';

interface Player {
  id: string;
  name: string;
  avatar?: string | null;
}

interface ParticipantsModalProps {
  visible: boolean;
  players: Player[];
  creatorId?: string;
  maxPlayers: number;
  onClose: () => void;
  onPlayerPress?: (player: Player) => void;
}

export default function ParticipantsModal({
  visible,
  players,
  creatorId,
  maxPlayers,
  onClose,
  onPlayerPress,
}: ParticipantsModalProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isExpanded, setIsExpanded] = React.useState(false);

  const snapPoints = useMemo(() => ['50%', '94%'], []);

  useEffect(() => {
    if (visible) {
      setIsExpanded(false);
      requestAnimationFrame(() => {
        bottomSheetRef.current?.snapToIndex(0);
      });
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  if (!visible) return null;

  const sorted = [...players].sort((a, b) => {
    if (a.id === creatorId) return -1;
    if (b.id === creatorId) return 1;
    return 0;
  });

  const handleToggleExpand = () => {
    if (isExpanded) {
      bottomSheetRef.current?.snapToIndex(0);
      setIsExpanded(false);
    } else {
      bottomSheetRef.current?.snapToIndex(1);
      setIsExpanded(true);
    }
  };

  const renderPlayer = ({ item }: { item: Player }) => {
    const isCreator = item.id === creatorId;
    const initial = item.name?.charAt(0).toUpperCase() || '?';
    const hasAvatar = !!item.avatar;

    return (
      <Pressable
        style={styles.playerRow}
        onPress={() => onPlayerPress?.(item)}
        disabled={!onPlayerPress}
      >
        <View style={[styles.avatar, isCreator && styles.avatarCreator]}>
          {hasAvatar ? (
            <Image
              key={item.avatar!}
              source={{ uri: item.avatar! }}
              style={styles.avatarImage}
            />
          ) : (
            <Text style={styles.avatarText}>{initial}</Text>
          )}
        </View>

        <View style={styles.playerInfo}>
          <View style={styles.playerNameRow}>
            <Text style={styles.playerName} numberOfLines={1}>
              {item.name}
            </Text>
            {isCreator && (
              <View style={styles.creatorBadge}>
                <Ionicons name="star" size={10} color="#FFFFFF" />
                <Text style={styles.creatorBadgeText}>
                  {t('participants.creator')}
                </Text>
              </View>
            )}
          </View>
        </View>

        {onPlayerPress && (
          <Ionicons name="chevron-forward" size={16} color="#BACAD6" />
        )}
      </Pressable>
    );
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose={true}
      onClose={onClose}
      onChange={(index) => setIsExpanded(index === 1)}
      backgroundStyle={styles.background}
      handleComponent={() => (
        <View style={styles.handleContainer}>
          <View style={styles.handlePill} />
        </View>
      )}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>{t('participants.title')}</Text>
          <Text style={styles.headerSubtitle}>
            {t('participants.count', {
              count: players.length,
              max: maxPlayers,
            })}
          </Text>
        </View>

        <Pressable
          onPress={handleToggleExpand}
          style={styles.expandButton}
          hitSlop={10}
        >
          <Ionicons
            name={isExpanded ? 'contract-outline' : 'expand-outline'}
            size={18}
            color="#208AEF"
          />
        </Pressable>

        <Pressable onPress={onClose} style={styles.closeButton} hitSlop={10}>
          <Ionicons name="close" size={20} color="#6080A8" />
        </Pressable>
      </View>

      {sorted.length > 0 ? (
        <BottomSheetFlatList
          data={sorted}
          keyExtractor={(item: Player) => item.id}
          renderItem={renderPlayer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 32 },
          ]}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={42} color="#BACAD6" />
          <Text style={styles.emptyText}>{t('participants.empty')}</Text>
          <Text style={styles.emptySubtext}>
            {t('participants.emptyHint')}
          </Text>
        </View>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#334A77',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 16,
  },
  handleContainer: { alignItems: 'center', paddingVertical: 10 },
  handlePill: {
    width: 55,
    height: 4,
    backgroundColor: '#BACAD6',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F6FC',
    gap: 8,
  },
  headerLeft: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#334A77' },
  headerSubtitle: {
    fontSize: 13,
    color: '#BACAD6',
    fontWeight: '500',
    marginTop: 2,
  },
  expandButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F6FC',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F6FC',
  },
  listContent: { paddingVertical: 8 },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E6F4FE',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarCreator: { backgroundColor: '#006EE6' },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarText: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  playerInfo: { flex: 1 },
  playerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334A77',
    flexShrink: 1,
  },
  creatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#006EE6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  creatorBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F6FC',
    marginLeft: 74,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 6,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6080A8',
    marginTop: 8,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#BACAD6',
    textAlign: 'center',
  },
});
