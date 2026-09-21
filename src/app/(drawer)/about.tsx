// src/app/(drawer)/about.tsx
import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Безопасный возврат назад на мобильных устройствах и в Web
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(drawer)/(tabs)/profile');
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. Кастомный Toolbar Шапки */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <Pressable onPress={handleBack} style={styles.backButton} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color="#006EE6" />
        </Pressable>
        <Text style={styles.headerTitle}>About</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
      >
        {/* 2. Логотип приложения (Волейбольный мяч в синем квадрате) */}
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Ionicons name="basketball-outline" size={36} color="#FFFFFF" />
          </View>
        </View>

        {/* 3. Описание проекта */}
        <Text style={styles.title}>PlayG</Text>
        <Text style={styles.tagline}>Find grounds. Join the game.</Text>
        
        <Text style={styles.description}>
          PlayG helps you discover outdoor sports grounds near you and join local games. 
          Explore the map, find a court or pitch, and jump into events hosted by your 
          community — or start your own in a few taps.
        </Text>

        {/* 4. Блок карточек преимуществ */}
        <View style={styles.featuresList}>
          
          {/* Discover grounds */}
          <View style={styles.featureCard}>
            <View style={[styles.iconBadge, { backgroundColor: '#EBF3FF' }]}>
              <Ionicons name="location" size={22} color="#006EE6" />
            </View>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>Discover grounds</Text>
              <Text style={styles.featureSubtitle}>Maps, search and ratings for spots near you.</Text>
            </View>
          </View>

          {/* Join events */}
          <View style={styles.featureCard}>
            <View style={[styles.iconBadge, { backgroundColor: '#EBF3FF' }]}>
              <Ionicons name="information-circle" size={22} color="#006EE6" />
            </View>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>Join events</Text>
              <Text style={styles.featureSubtitle}>Find games by day, sport and skill level.</Text>
            </View>
          </View>

          {/* Play together */}
          <View style={styles.featureCard}>
            <View style={[styles.iconBadge, { backgroundColor: '#EBF3FF' }]}>
              <Ionicons name="shield-checkmark" size={20} color="#006EE6" />
            </View>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>Play together</Text>
              <Text style={styles.featureSubtitle}>A friendly, community-first experience.</Text>
            </View>
          </View>

        </View>

        {/* 5. Подпись Версии сборки внизу */}
        <Text style={styles.versionText}>Version 1.0.0 · Made for players</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  
  // Стили шапки навигации
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
  backButton: { 
    padding: 4 
  },
  headerTitle: { 
    fontSize: 17, 
    fontWeight: '700', 
    color: '#334A77',
    textAlign: 'center'
  },
  headerSpacer: { 
    width: 32 
  },

  scrollContent: { 
    paddingHorizontal: 24, 
    paddingTop: 32 
  },

  // Блок логотипа
  logoContainer: { 
    alignItems: 'flex-start',
    marginBottom: 20 
  },
  logoBox: { 
    width: 64, 
    height: 64, 
    backgroundColor: '#006EE6', // Оригинальный синий цвет из вашего Welcome
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: '#006EE6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3
  },

  // Текстовые блоки заголовков
  title: { 
    fontSize: 26, 
    fontWeight: '800', 
    color: '#000000',
    letterSpacing: -0.5
  },
  tagline: { 
    fontSize: 15, 
    fontWeight: '500',
    color: '#6080A8', 
    marginTop: 4,
    marginBottom: 20
  },
  description: { 
    fontSize: 14, 
    color: '#6080A8', 
    lineHeight: 22,
    marginBottom: 28
  },

  // Сетка карточек возможностей
  featuresList: { 
    gap: 12,
    marginBottom: 40
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6F4FE',
    borderRadius: 14,
    padding: 14,
  },
  iconBadge: { 
    width: 36, 
    height: 36, 
    borderRadius: 10, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  featureInfo: { 
    flex: 1, 
    marginLeft: 14 
  },
  featureTitle: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#334A77' 
  },
  featureSubtitle: { 
    fontSize: 12, 
    color: '#6080A8', 
    marginTop: 2 
  },

  // Текст футера
  versionText: { 
    fontSize: 12, 
    color: '#BACAD6', 
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 10
  },
});
