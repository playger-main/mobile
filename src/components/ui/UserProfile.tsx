// src/components/ui/UserProfile.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SessionUser } from '@/effector/domains/auth';

interface UserProfileProps {
  user: SessionUser;
  onLogout: () => void;
}

export default function UserProfile({ user, onLogout }: UserProfileProps) {
  const insets = useSafeAreaInsets();

  // Получаем первую букву имени для аватара
  const avatarLetter = user.name ? user.name.charAt(0).toUpperCase() : 'P';

  // Фолбеки на данные из стора (если бэк их еще не считает, берем значения с макета)
  const joinedCount = user.joinedCount ?? 0;
  const savedCount = user.savedCount ?? 1;
  const gamesCount = user.gamesCount ?? 12;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* 1. Заголовок экрана */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* 2. Блок пользователя (Аватар + Имя + Почта) */}
        <View style={styles.userCard}>
          <View style={styles.avatarBlock}>
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>{user.name || 'Playgroundmanage'}</Text>
            <Text style={styles.userEmail} numberOfLines={1}>{user.email || 'playgroundmanage@gmail.com'}</Text>
          </View>
        </View>

        {/* 3. Сетка статистики (3 колонки) */}
        <View style={styles.statsGrid}>
          {/* Joined */}
          <View style={styles.statsCard}>
            <Ionicons name="calendar-outline" size={20} color="#208AEF" />
            <Text style={styles.statsNumber}>{joinedCount}</Text>
            <Text style={styles.statsLabel}>Joined</Text>
          </View>

          {/* Saved */}
          <View style={styles.statsCard}>
            <Ionicons name="heart-outline" size={20} color="#208AEF" />
            <Text style={styles.statsNumber}>{savedCount}</Text>
            <Text style={styles.statsLabel}>Saved</Text>
          </View>

          {/* Games */}
          <View style={styles.statsCard}>
            <Ionicons name="trophy-outline" size={20} color="#208AEF" />
            <Text style={styles.statsNumber}>{gamesCount}</Text>
            <Text style={styles.statsLabel}>Games</Text>
          </View>
        </View>

        {/* 4. Навигационное Меню-список */}
        <View style={styles.menuContainer}>
          {/* My events */}
          <Pressable style={styles.menuItem} onPress={() => console.log('My events pressed')}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="calendar-outline" size={20} color="#6080A8" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>My events</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuCountText}>{joinedCount}</Text>
              <Ionicons name="chevron-forward" size={16} color="#BACAD6" />
            </View>
          </Pressable>

          {/* Favourite grounds */}
          <Pressable style={styles.menuItem} onPress={() => console.log('Favourite grounds pressed')}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="heart-outline" size={20} color="#6080A8" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Favourite grounds</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuCountText}>{savedCount}</Text>
              <Ionicons name="chevron-forward" size={16} color="#BACAD6" />
            </View>
          </Pressable>

          {/* Settings */}
          <Pressable style={styles.menuItem} onPress={() => console.log('Settings pressed')}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="settings-outline" size={20} color="#6080A8" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#BACAD6" />
          </Pressable>

          {/* About PlayG */}
          <Pressable style={[styles.menuItem, styles.noBorder]} onPress={() => console.log('About pressed')}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="information-circle-outline" size={20} color="#6080A8" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>About PlayG</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#BACAD6" />
          </Pressable>
        </View>

        {/* 5. Кнопка выхода из системы (Log Out) */}
        <Pressable style={styles.logoutButton} onPress={onLogout}>
          <Ionicons name="log-out-outline" size={18} color="#FF3B30" style={styles.logoutIcon} />
          <Text style={styles.logoutButtonText}>Log out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  header: { 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderColor: '#F0F6FC' 
  },
  headerTitle: { 
    fontSize: 24, 
    fontWeight: '800', 
    color: '#000000' 
  },
  scrollContent: { 
    paddingHorizontal: 16, 
    paddingTop: 24,
    paddingBottom: 40
  },

  // Карточка профиля
  userCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 24 
  },
  avatarBlock: { 
    width: 64, 
    height: 64, 
    borderRadius: 32, 
    backgroundColor: '#006EE6', // Точный синий цвет круга аватара из макета
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  avatarText: { 
    fontSize: 24, 
    fontWeight: '800', 
    color: '#FFFFFF' 
  },
  userInfo: { 
    marginLeft: 16, 
    flex: 1 
  },
  userName: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#334A77' 
  },
  userEmail: { 
    fontSize: 14, 
    color: '#BACAD6', 
    marginTop: 2 
  },

  // Сетка счетчиков статистики
  statsGrid: { 
    flexDirection: 'row', 
    gap: 12, 
    marginBottom: 28 
  },
  statsCard: { 
    flex: 1, 
    backgroundColor: '#FFFFFF', 
    borderWidth: 1, 
    borderColor: '#E6F4FE', 
    borderRadius: 12, 
    paddingVertical: 14, 
    alignItems: 'center',
    justifyContent: 'center'
  },
  statsNumber: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: '#334A77', 
    marginTop: 4 
  },
  statsLabel: { 
    fontSize: 12, 
    color: '#BACAD6', 
    fontWeight: '500', 
    marginTop: 2 
  },

  // Контейнер пунктов меню списка
  menuContainer: { 
    backgroundColor: '#FFFFFF', 
    borderWidth: 1, 
    borderColor: '#E6F4FE', 
    borderRadius: 12, 
    paddingHorizontal: 16,
    marginBottom: 28
  },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingVertical: 14, 
    borderBottomWidth: 1, 
    borderColor: '#F0F6FC' 
  },
  noBorder: { 
    borderBottomWidth: 0 
  },
  menuItemLeft: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  menuIcon: { 
    marginRight: 12 
  },
  menuItemText: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#334A77' 
  },
  menuItemRight: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8 
  },
  menuCountText: { 
    fontSize: 14, 
    color: '#BACAD6', 
    fontWeight: '500' 
  },

  // Кнопка логаута
  logoutButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: 48, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#E6F4FE', 
    backgroundColor: '#FFFFFF' 
  },
  logoutIcon: { 
    marginRight: 8 
  },
  logoutButtonText: { 
    color: '#FF3B30', 
    fontSize: 15, 
    fontWeight: '700' 
  }
});
