// src/components/ui/ClusterGroundsSheet.tsx
import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';

import {
  ACTIVITY_COLORS,
  ACTIVITY_LABELS,
} from '@/utils/groundActivity';
import { getBadgeStyle } from '@/constants/badgeStyle';
import { getSportLabel } from '@/constants/sports';
import { GroundMapMarker } from '@/types/map';

interface ClusterGroundsSheetProps {
  visible: boolean;
  grounds: GroundMapMarker[];
  onClose: () => void;
  onSelect: (ground: GroundMapMarker) => void;
}

export default function ClusterGroundsSheet({
  visible,
  grounds,
  onClose,
  onSelect,
}: ClusterGroundsSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['45%', '80%'], []);

  useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => {
        bottomSheetRef.current?.snapToIndex(0);
      });
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose={true}
      onClose={onClose}
      backgroundStyle={styles.background}
      handleComponent={() => (
        <View style={styles.handleContainer}>
          <View style={styles.handlePill} />
        </View>
      )}
    >
      <BottomSheetFlatList
        data={grounds}
        keyExtractor={(item: GroundMapMarker) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {grounds.length} {grounds.length === 1 ? 'ground' : 'grounds'} nearby
            </Text>
            <Text style={styles.headerSubtitle}>Tap one to open details</Text>
          </View>
        }
        renderItem={({ item }: { item: GroundMapMarker }) => {
          // ✅ Метаданные — как в основном списке (CardGround)
          const activityColors = ACTIVITY_COLORS[item.activityLevel];
          const sportBadgeStyle = getBadgeStyle(item.sportId);
          const sportLabel = getSportLabel(item.sportId);
          const activityLabel = ACTIVITY_LABELS[item.activityLevel];

          return (
            <Pressable style={styles.row} onPress={() => onSelect(item)}>
              {/* ✅ Миниатюра площадки (avatar) — как в CardGround */}
                <View style={styles.imageContainer}>
                {item.avatar ? (
                    <Image source={{ uri: item.avatar }} style={styles.image} />
                ) : (
                    <View style={[styles.image, styles.imagePlaceholder]}>
                    <Ionicons name="image-outline" size={22} color="#BACAD6" />
                    </View>
                )}

                {/* Индикатор активности (цветная точка) в углу обложки */}
                <View
                    style={[
                    styles.activityIndicator,
                    {
                        backgroundColor: activityColors.bg,
                        borderColor: '#FFFFFF',
                    },
                    ]}
                />
                </View>

              {/* Информация о площадке */}
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.name}
                </Text>
                {item.address ? (
                  <Text style={styles.address} numberOfLines={1}>
                    {item.address}
                  </Text>
                ) : null}

                {/* Теги: спорт (цвет по id) + активность */}
                <View style={styles.tagsRow}>
                  <View
                    style={[
                      styles.sportTag,
                      { backgroundColor: sportBadgeStyle.bg },
                    ]}
                  >
                    <View
                      style={[
                        styles.sportDot,
                        { backgroundColor: sportBadgeStyle.text },
                      ]}
                    />
                    <Text
                      style={[styles.sportTagText, { color: sportBadgeStyle.text }]}
                    >
                      {sportLabel.toUpperCase()}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.activityTag,
                      { backgroundColor: activityColors.bg + '22' },
                    ]}
                  >
                    <View
                      style={[
                        styles.activityDot,
                        { backgroundColor: activityColors.bg },
                      ]}
                    />
                    <Text
                      style={[styles.activityTagText, { color: activityColors.bg }]}
                    >
                      {activityLabel}
                    </Text>
                  </View>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={16} color="#BACAD6" />
            </Pressable>
          );
        }}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    shadowColor: '#334A77',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 16,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handlePill: {
    width: 55,
    height: 4,
    backgroundColor: '#BACAD6',
    borderRadius: 2,
  },
  header: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F6FC',
    marginBottom: 4,
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#334A77' },
  headerSubtitle: {
    fontSize: 12,
    color: '#BACAD6',
    fontWeight: '500',
    marginTop: 2,
  },
  listContent: { paddingHorizontal: 16, paddingBottom: 32 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F6FC',
    gap: 12,
  },

  // ✅ Миниатюра (обложка площадки)
  imageContainer: {
    position: 'relative',
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F0F4F8',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  activityIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },

  // Информация
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: '700', color: '#334A77' },
  address: { fontSize: 12, color: '#6080A8', marginTop: 2 },

  // Теги
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  sportTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sportDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 4,
  },
  sportTagText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  activityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activityDot: { width: 5, height: 5, borderRadius: 2.5 },
  activityTagText: { fontSize: 9, fontWeight: '700' },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F4F8',
},
});