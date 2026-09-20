// src/components/ui/AuthSignIn.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AuthSignInProps {
  onSubmit: (email: string, password: string) => void;
  onSwitchToSignUp: () => void;
  onContinueAsGuest: () => void;
  isSubmitting: boolean;
  errorMessage: string | null;
}

export default function AuthSignIn({ onSubmit, onSwitchToSignUp, onContinueAsGuest, isSubmitting, errorMessage }: AuthSignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.formContainer}>
      <View style={styles.logoIconBlock}>
        <Ionicons name="basketball" size={32} color="#FFFFFF" />
      </View>

      <Text style={styles.formTitle}>Welcome back</Text>
      <Text style={styles.formSubtitle}>Sign in to join games, save grounds and host events.</Text>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <View style={styles.inputGroup}>
        <TextInput
          style={styles.inputField}
          placeholder="Email"
          placeholderTextColor="#BACAD6"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.inputField}
          placeholder="Password"
          placeholderTextColor="#BACAD6"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <Pressable 
        style={[styles.primaryButton, isSubmitting && styles.buttonDisabled]} 
        onPress={() => onSubmit(email, password)}
        disabled={isSubmitting}
      >
        {isSubmitting ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text style={styles.primaryButtonText}>Sign in</Text>}
      </Pressable>

      <View style={styles.toggleRow}>
        <Text style={styles.toggleText}>New to PlayG? </Text>
        <Pressable onPress={onSwitchToSignUp}>
          <Text style={styles.toggleLink}>Create an account</Text>
        </Pressable>
      </View>

      <Pressable style={styles.guestButton} onPress={onContinueAsGuest}>
        <Text style={styles.guestButtonText}>Continue browsing as guest</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  logoIconBlock: { width: 56, height: 56, backgroundColor: '#208AEF', borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  formTitle: { fontSize: 24, fontWeight: '800', color: '#334A77', marginBottom: 6 },
  formSubtitle: { fontSize: 14, color: '#6080A8', lineHeight: 20, marginBottom: 20 },
  errorText: { color: '#FF3B30', fontSize: 13, fontWeight: '600', marginBottom: 12 },
  inputGroup: { gap: 12, marginBottom: 24 },
  inputField: { width: '100%', height: 48, borderWidth: 1, borderColor: '#E6F4FE', borderRadius: 12, paddingHorizontal: 16, fontSize: 15, color: '#334A77', backgroundColor: '#FFFFFF' },
  primaryButton: { width: '100%', height: 50, backgroundColor: '#208AEF', borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  buttonDisabled: { backgroundColor: '#BACAD6' },
  toggleRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  toggleText: { fontSize: 14, color: '#6080A8' },
  toggleLink: { fontSize: 14, fontWeight: '700', color: '#208AEF' },
  guestButton: { alignItems: 'center', marginTop: 24 },
  guestButtonText: { fontSize: 13, color: '#BACAD6', fontWeight: '500', textDecorationLine: 'underline' },
});
