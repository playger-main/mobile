// src/components/ui/AuthForgotPassword.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '@/i18n';

interface AuthForgotPasswordProps {
  onSubmit: (email: string) => void;
  onBackToSignIn: () => void;
  isSubmitting: boolean;
  errorMessage: string | null;
}

export default function AuthForgotPassword({
  onSubmit,
  onBackToSignIn,
  isSubmitting,
  errorMessage,
}: AuthForgotPasswordProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');

  const canSubmit = email.trim().length > 0 && !isSubmitting;

  return (
    <View style={styles.formContainer}>
      <View style={styles.logoIconBlock}>
        <Ionicons name="key-outline" size={32} color="#FFFFFF" />
      </View>

      <Text style={styles.formTitle}>{t('auth.forgot.title')}</Text>
      <Text style={styles.formSubtitle}>{t('auth.forgot.subtitle')}</Text>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <View style={styles.inputGroup}>
        <TextInput
          style={styles.inputField}
          placeholder={t('auth.email')}
          placeholderTextColor="#BACAD6"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus
        />
      </View>

      <Pressable
        style={[styles.primaryButton, !canSubmit && styles.buttonDisabled]}
        onPress={() => onSubmit(email.trim())}
        disabled={!canSubmit}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.primaryButtonText}>
            {t('auth.forgot.sendCode')}
          </Text>
        )}
      </Pressable>

      <Pressable style={styles.backButton} onPress={onBackToSignIn}>
        <Text style={styles.backButtonText}>
          {t('auth.forgot.backToSignIn')}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logoIconBlock: {
    width: 56,
    height: 56,
    backgroundColor: '#208AEF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#334A77',
    marginBottom: 6,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#6080A8',
    lineHeight: 20,
    marginBottom: 20,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
  },
  inputGroup: { gap: 12, marginBottom: 24 },
  inputField: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#E6F4FE',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#334A77',
    backgroundColor: '#FFFFFF',
  },
  primaryButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#208AEF',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonDisabled: { backgroundColor: '#BACAD6' },
  backButton: { alignItems: 'center', marginTop: 24 },
  backButtonText: {
    fontSize: 14,
    color: '#6080A8',
    fontWeight: '600',
  },
});