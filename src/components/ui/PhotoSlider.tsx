// src/components/ui/PhotoSlider.tsx
import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  useWindowDimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/hooks/useTheme';

interface PhotoSliderProps {
  photos: string[];
  mainIndex?: number;
  initialIndex?: number;
  height?: number;
  placeholder?: React.ReactNode;
}

export default function PhotoSlider({
  photos,
  mainIndex = -1,
  initialIndex = 0,
  height = 260,
  placeholder,
}: PhotoSliderProps) {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const scrollRef = useRef<ScrollView | null>(null);
  const safeIndex = Math.max(0, Math.min(initialIndex, photos.length - 1));
  const [currentIndex, setCurrentIndex] = useState(safeIndex);

  const showDots = photos.length > 1;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / width);
    if (idx !== currentIndex) setCurrentIndex(idx);
  };

  if (photos.length === 0) {
    return (
      <View
        style={[
          styles.placeholderWrap,
          { height, backgroundColor: colors.surfaceSecondary },
        ]}
      >
        {placeholder ?? (
          <Ionicons
            name="image-outline"
            size={48}
            color={colors.textTertiary}
          />
        )}
      </View>
    );
  }

  return (
    <View style={{ height }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        contentOffset={{ x: safeIndex * width, y: 0 }}
      >
        {photos.map((uri, i) => (
          <Image
            key={`${uri}-${i}`}
            source={{ uri }}
            style={{ width, height }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {showDots && (
        <View style={styles.dotsRow} pointerEvents="none">
          {photos.map((_, i) => {
            const isCurrent = i === currentIndex;
            const isMain = i === mainIndex && !isCurrent;

            const bg = isCurrent
              ? '#208AEF'
              : isMain
                ? '#27AE60'
                : 'rgba(0, 0, 0, 0.35)';

            return (
              <View
                key={i}
                style={[styles.dot, { backgroundColor: bg }]}
              />
            );
          })}
        </View>
      )}
    </View>
  );
}

const DOT_SIZE = 8;

const styles = StyleSheet.create({
  placeholderWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsRow: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 2,
  },
});