// src/components/ui/UserProfile.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface UserProfileProps {
  user: {
    name: string;
    email: string;
    role: string[];
  };
  onLogout: () => void;
}

export default function UserProfile({ user, onLogout }: UserProfileProps) {
  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{user.name?.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.profileName}>{user.name}</Text>
        <Text style={styles.profileEmail}>{user.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{user.role?.[0]?.toUpperCase() || 'USER'}</Text>
        </View>
      </View>

      <Pressable style={styles.logoutButton} onPress={onLogout}>
        <Ionicons name="log-out-outline" size={20} color="#FF3B30" style={{ marginRight: 8 }} />
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', paddingVertical: 32 },
  profileHeader: { alignItems: 'center', marginTop: 40 },
  avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E6F4FE', alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#208AEF' },
  avatarText: { fontSize: 32, fontWeight: '800', color: '#208AEF' },
  profileName: { fontSize: 22, fontWeight: '800', color: '#334A77', marginBottom: 4 },
  profileEmail: { fontSize: 14, color: '#6080A8', marginBottom: 12 },
  roleBadge: { backgroundColor: '#EAF9F5', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  roleText: { color: '#27AE60', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 24, height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#FF3B30', backgroundColor: '#FFFFFF' },
  logoutButtonText: { color: '#FF3B30', fontSize: 15, fontWeight: '700' }
});
