// src/components/ui/PhotoPicker.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

export interface PhotoInput {
  id?: string;
  uri: string;
  path?: string;
  isNew: boolean;
  isMain: boolean;
}

interface PhotoPickerProps {
  photos: PhotoInput[];
  max?: number;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onSetMain: (index: number) => void;
}

export default function PhotoPicker({
  photos,
  max = 5,
  onAdd,
  onRemove,
  onSetMain,
}: PhotoPickerProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const canAdd = photos.length < max;

  return (
    <View>
      <View style={styles.grid}>
        {photos.map((photo, index) => (
          <View
            key={`${photo.uri}-${index}`}
            style={[
              styles.tile,
              { backgroundColor: colors.surfaceSecondary },
            ]}
          >
            <Image source={{ uri: photo.uri }} style={styles.tileImage} />

            {photo.isMain && (
              <View
                style={[
                  styles.mainBadge,
                  { backgroundColor: colors.primaryDark },
                ]}
              >
                <Ionicons name="star" size={10} color="#FFFFFF" />
                <Text style={styles.mainBadgeText}>
                  {t('photos.main')}
                </Text>
              </View>
            )}

            {!photo.isMain && (
              <Pressable
                style={styles.setMainBtn}
                onPress={() => onSetMain(index)}
                hitSlop={6}
              >
                <Ionicons name="star-outline" size={14} color="#FFFFFF" />
              </Pressable>
            )}

            <Pressable
              style={[
                styles.removeBtn,
                { backgroundColor: colors.danger + 'E6' },
              ]}
              onPress={() => onRemove(index)}
              hitSlop={6}
            >
              <Ionicons name="close" size={14} color="#FFFFFF" />
            </Pressable>
          </View>
        ))}

        {canAdd && (
          <Pressable
            style={[
              styles.addTile,
              {
                borderColor: colors.primary,
                backgroundColor: colors.primaryBg,
              },
            ]}
            onPress={onAdd}
          >
            <Ionicons name="camera-outline" size={28} color={colors.primary} />
            <Text style={[styles.addTileText, { color: colors.primary }]}>
              {photos.length}/{max}
            </Text>
          </Pressable>
        )}
      </View>

      <Text style={[styles.hint, { color: colors.textTertiary }]}>
        {t('photos.hint', { max })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tile: {
    width: 90,
    height: 90,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  tileImage: { width: '100%', height: '100%' },
  mainBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  mainBadgeText: { fontSize: 9, fontWeight: '800', color: '#FFFFFF' },
  setMainBtn: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTile: {
    width: 90,
    height: 90,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addTileText: { fontSize: 11, fontWeight: '700' },
  hint: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: '500',
  },
});