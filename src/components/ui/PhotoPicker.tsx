// src/components/ui/PhotoPicker.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
  const canAdd = photos.length < max;

  return (
    <View>
      <View style={styles.grid}>
        {photos.map((photo, index) => (
          <View key={`${photo.uri}-${index}`} style={styles.tile}>
            <Image source={{ uri: photo.uri }} style={styles.tileImage} />

            {photo.isMain && (
              <View style={styles.mainBadge}>
                <Ionicons name="star" size={10} color="#FFFFFF" />
                <Text style={styles.mainBadgeText}>Main</Text>
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
              style={styles.removeBtn}
              onPress={() => onRemove(index)}
              hitSlop={6}
            >
              <Ionicons name="close" size={14} color="#FFFFFF" />
            </Pressable>
          </View>
        ))}

        {canAdd && (
          <Pressable style={styles.addTile} onPress={onAdd}>
            <Ionicons name="camera-outline" size={28} color="#208AEF" />
            <Text style={styles.addTileText}>
              {photos.length}/{max}
            </Text>
          </Pressable>
        )}
      </View>

      <Text style={styles.hint}>
        Up to {max} photos. Tap ⭐ to set as main (cover).
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tile: {
    width: 90,
    height: 90,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F0F4F8',
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
    backgroundColor: '#006EE6',
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
    backgroundColor: 'rgba(255, 59, 48, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTile: {
    width: 90,
    height: 90,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#208AEF',
    borderStyle: 'dashed',
    backgroundColor: '#F8FBFF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addTileText: { fontSize: 11, fontWeight: '700', color: '#208AEF' },
  hint: {
    marginTop: 8,
    fontSize: 11,
    color: '#BACAD6',
    fontWeight: '500',
  },
});