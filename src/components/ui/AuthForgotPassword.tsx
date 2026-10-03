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
import { useTheme } from '@/hooks/useTheme';

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
  const { colors } = useTheme();
  const [email, setEmail] = useState('');

  const canSubmit = email.trim().length > 0 && !isSubmitting;

  return (
    <View style={[styles.formContainer, { backgroundColor: colors.listBackground }]}>
      <View style={[styles.logoIconBlock, { backgroundColor: colors.primary }]}>
        <Ionicons name="key-outline" size={32} color="#FFFFFF" />
      </View>

      <Text style={[styles.formTitle, { color: colors.textPrimary }]}>
        {t('auth.forgot.title')}
      </Text>
      <Text style={[styles.formSubtitle, { color: colors.textSecondary }]}>
        {t('auth.forgot.subtitle')}
      </Text>

      {errorMessage && (
        <Text style={[styles.errorText, { color: colors.danger }]}>
          {errorMessage}
        </Text>
      )}

      <View style={styles.inputGroup}>
        <TextInput
          style={[
            styles.inputField,
            {
              color: colors.textPrimary,
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          placeholder={t('auth.email')}
          placeholderTextColor={colors.textTertiary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus
        />
      </View>

      <Pressable
        style={[styles.primaryButton, { backgroundColor: colors.primaryDark }]}
        onPress={() => onSubmit(email.trim())}
        disabled={!canSubmit}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={[styles.primaryButtonText, { color: '#FFFFFF' }]}>
            {t('auth.forgot.sendCode')}
          </Text>
        )}
      </Pressable>

      <Pressable style={styles.backButton} onPress={onBackToSignIn}>
        <Text style={[styles.backButtonText, { color: colors.textSecondary }]}>
          {t('auth.forgot.backToSignIn')}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  logoIconBlock: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  formTitle: { fontSize: 24, fontWeight: '800', marginBottom: 6 },
  formSubtitle: { fontSize: 14, lineHeight: 20, marginBottom: 20 },
  errorText: { fontSize: 13, fontWeight: '600', marginBottom: 12 },
  inputGroup: { gap: 12, marginBottom: 24 },
  inputField: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  primaryButton: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  backButton: { alignItems: 'center', marginTop: 24 },
  backButtonText: { fontSize: 14, fontWeight: '600' },
});