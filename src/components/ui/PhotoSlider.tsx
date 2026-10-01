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

interface PhotoSliderProps {
  photos: string[];
  /** ✅ Индекс главного фото (аватара) — отмечается зелёной точкой */
  mainIndex?: number;
  /** Стартовый слайд */
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
      <View style={[styles.placeholderWrap, { height }]}>
        {placeholder ?? (
          <Ionicons name="image-outline" size={48} color="#BACAD6" />
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

            // ✅ Логика цвета:
            //   current        → синяя
            //   main (не current) → зелёная
            //   остальные      → светло-серая
            const dotStyle = isCurrent
              ? styles.dotCurrent
              : isMain
                ? styles.dotMain
                : styles.dotDefault;

            return <View key={i} style={[styles.dot, dotStyle]} />;
          })}
        </View>
      )}
    </View>
  );
}

const DOT_SIZE = 10;

const styles = StyleSheet.create({
  placeholderWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F4F8',
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
    // ✅ Единая обводка, чтобы точки на светлом фоне фото были заметны
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  dotDefault: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  dotCurrent: {
    // ✅ Синяя — текущий слайд
    backgroundColor: '#208AEF',
    borderColor: '#FFFFFF',
  },
  dotMain: {
    // ✅ Зелёная — главное фото (когда оно НЕ текущее)
    backgroundColor: '#27AE60',
    borderColor: '#FFFFFF',
  },
});