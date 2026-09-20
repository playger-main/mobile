// src/components/ui/AuthWelcome.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient'; // ✅ ДОБАВИЛИ НА ТИВНЫЙ ГРАДИЕНТ

interface AuthWelcomeProps {
  onGetStarted: () => void;
  bottomInset: number;
}

export default function AuthWelcome({ onGetStarted, bottomInset }: AuthWelcomeProps) {
  const navigation = useNavigation();
  const { height: windowHeight } = useWindowDimensions();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Контейнер картинки (42% высоты экрана) */}
      <View style={[styles.imageContainer, { height: windowHeight * 0.42 }]}>
        <Image 
          source={require('../../assets/images/onboarding-sports.png')} 
          style={styles.image} 
          resizeMode="cover"
        />
        
        {/* ✅ ИСПРАВЛЕНИЕ: ЭФФЕКТ ТУМАНА ИЗ МАКЕТА */}
        {/* Накладываем нативный градиент, который плавно растворяет фото в белый фон */}
        <LinearGradient
          colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.5)', '#FFFFFF']}
          style={styles.imageFadeGradient}
        />
      </View>

      {/* Контентная часть */}
      <View style={[styles.content, { paddingBottom: bottomInset + 16 }]}>
        <View>
          <Text style={styles.title}>Discover sports near you.</Text>
          <Text style={styles.subtitle}>
            Sign in to join games, create events and save favourite grounds.
          </Text>

          {/* Список преимуществ */}
          <View style={styles.bulletList}>

            {/* 1. Блок Календаря */}
            <View style={styles.bulletItem}>
                <View style={[styles.bulletIconContainer, { backgroundColor: '#EBF3FF' }]}>
                <Ionicons name="calendar" size={16} color="#208AEF" />
                </View>
                <Text style={styles.bulletText}>Join local games in one tap</Text>
            </View>

            {/* 2. Блок Избранного (Сердце) */}
            <View style={styles.bulletItem}>
                <View style={[styles.bulletIconContainer, { backgroundColor: '#EAF9F5' }]}>
                <Ionicons name="heart-outline" size={16} color="#27AE60" />
                </View>
                <Text style={styles.bulletText}>Save the grounds you love</Text>
            </View>

            {/* 3. Блок Кубка */}
            <View style={styles.bulletItem}>
                <View style={[styles.bulletIconContainer, { backgroundColor: '#FFF0E6' }]}>
                <Ionicons name="trophy-outline" size={16} color="#FF8000" />
                </View>
                <Text style={styles.bulletText}>Host and manage your own events</Text>
            </View>

          </View>
        </View>

        {/* Синяя кнопка Get Started */}
        <Pressable style={styles.primaryButton} onPress={onGetStarted}>
          <Ionicons name="log-in-outline" size={20} color="#FFFFFF" style={styles.iconMargin} />
          <Text style={styles.primaryButtonText}>Get started</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  imageContainer: { 
    width: '100%', 
    position: 'relative' 
  },
  image: { 
    width: '100%', 
    height: '100%' 
  },
  
  // ✅ ОБНОВЛЕННЫЕ СТИЛИ ДЛЯ ТУМАНА
  imageFadeGradient: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    height: 200, // Увеличили высоту зоны размытия, чтобы туман ложился мягче
  },
  
  content: { 
    flex: 1, 
    paddingHorizontal: 24, 
    justifyContent: 'space-between',    
  },
  title: { 
    fontSize: 24, 
    fontWeight: '800', 
    color: '#000000', 
    letterSpacing: -0.5 
  },
  subtitle: { 
    fontSize: 15, 
    color: '#6080A8', 
    lineHeight: 22, 
    marginTop: 12 
  },
  bulletList: { 
    gap: 16, 
    marginTop: 28 
  },
  bulletItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 14 
  },
  bulletIconContainer: { 
    width: 38, 
    height: 38, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  bulletText: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#334A77' 
  },
  primaryButton: { 
    width: '100%', 
    height: 52, 
    backgroundColor: '#006EE6', 
    borderRadius: 14, 
    alignItems: 'center', 
    justifyContent: 'center', 
    flexDirection: 'row' 
  },
  primaryButtonText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: '700' 
  },
  iconMargin: { 
    marginRight: 6 
  }
});
