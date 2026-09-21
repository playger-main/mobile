// src/app/(drawer)/settings.tsx
import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUnit } from 'effector-react';

// ✅ Импортируем наши реактивные глобальные сторы
import { 
  $eventReminders, 
  $useLocation, 
  $appLanguage, 
  toggleEventReminders, 
  toggleUseLocation 
} from '@/effector/store';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // ✅ Подписываемся на Effector настройки
  const { eventReminders, useLocation, language, changeReminders, changeLocation } = useUnit({
    eventReminders: $eventReminders,
    useLocation: $useLocation,
    language: $appLanguage,
    changeReminders: toggleEventReminders,
    changeLocation: toggleUseLocation,
  });

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(drawer)/(tabs)/profile');
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. Верхний Toolbar */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable onPress={handleBack} style={styles.backButton} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color="#006EE6" />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ================= PREFERENCES SECTION ================= */}
        <Text style={styles.sectionHeader}>PREFERENCES</Text>
        <View style={styles.blockContainer}>
          {/* Event reminders */}
          <View style={styles.rowItem}>
            <View style={styles.rowLeft}>
              <Ionicons name="notifications-outline" size={20} color="#6080A8" style={styles.rowIcon} />
              <Text style={styles.rowText}>Event reminders</Text>
            </View>
            <Switch
              value={eventReminders}
              onValueChange={(value) => { changeReminders(value); }} // ✅ Вызывает событие Effector + AsyncStorage
              trackColor={{ false: '#BACAD6', true: '#27AE60' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Use my location */}
          <View style={[styles.rowItem, styles.noBorder]}>
            <View style={styles.rowLeft}>
              <Ionicons name="location-outline" size={20} color="#6080A8" style={styles.rowIcon} />
              <Text style={styles.rowText}>Use my location</Text>
            </View>
            <Switch
              value={useLocation}
              onValueChange={(value) => { changeLocation(value); }}  // ✅ Вызывает событие Effector + AsyncStorage
              trackColor={{ false: '#BACAD6', true: '#27AE60' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* ================= GENERAL SECTION ================= */}
        <Text style={styles.sectionHeader}>GENERAL</Text>
        <View style={styles.blockContainer}>
          {/* Language */}
          <Pressable style={styles.rowItem} onPress={() => console.log('Language changer pressed')}>
            <View style={styles.rowLeft}>
              <Ionicons name="globe-outline" size={20} color="#6080A8" style={styles.rowIcon} />
              <Text style={styles.rowText}>Language</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={styles.rowValueText}>{language}</Text>
            </View>
          </Pressable>

          {/* Privacy */}
          <Pressable style={[styles.rowItem, styles.noBorder]} onPress={() => console.log('Privacy pressed')}>
            <View style={styles.rowLeft}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#6080A8" style={styles.rowIcon} />
              <Text style={styles.rowText}>Privacy</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={styles.rowValueText}>Manage</Text>
            </View>
          </Pressable>
        </View>

        <Text style={styles.versionText}>PlayG · Version 1.0.0 (MVP)</Text>
      </ScrollView>
    </View>
  );
}

// ... Оставляем ваши стили styles без изменений
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingBottom: 6, borderBottomWidth: 1, borderColor: '#F0F6FC', backgroundColor: '#FFFFFF' },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#334A77', lineHeight: 48 },
  headerSpacer: { width: 32 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 20 },
  sectionHeader: { fontSize: 12, fontWeight: '700', color: '#BACAD6', letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 },
  blockContainer: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E6F4FE', borderRadius: 12, paddingHorizontal: 16, marginBottom: 24 },
  rowItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderColor: '#F0F6FC' },
  noBorder: { borderBottomWidth: 0 },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowIcon: { marginRight: 12 },
  rowText: { fontSize: 14, fontWeight: '600', color: '#000000' },
  rowRight: { flexDirection: 'row', alignItems: 'center' },
  rowValueText: { fontSize: 14, color: '#BACAD6', fontWeight: '500' },
  versionText: { fontSize: 12, color: '#BACAD6', fontWeight: '500', textAlign: 'center', marginTop: 8 }
});
