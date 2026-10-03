// src/components/ui/AuthSignIn.tsx
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

interface AuthSignInProps {
  onSubmit: (email: string, password: string) => void;
  onSwitchToSignUp: () => void;
  onContinueAsGuest: () => void;
  onForgotPassword: () => void;
  isSubmitting: boolean;
  errorMessage: string | null;
}

export default function AuthSignIn({
  onSubmit,
  onSwitchToSignUp,
  onContinueAsGuest,
  onForgotPassword,
  isSubmitting,
  errorMessage,
}: AuthSignInProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.formContainer}>
      <View style={styles.logoIconBlock}>
        <Ionicons name="basketball" size={32} color="#FFFFFF" />
      </View>

      <Text style={styles.formTitle}>{t('auth.signIn.title')}</Text>
      <Text style={styles.formSubtitle}>{t('auth.signIn.subtitle')}</Text>

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
          autoComplete="email"
        />

        <View style={styles.inputWithIcon}>
          <TextInput
            style={styles.inputFieldInner}
            placeholder={t('auth.password')}
            placeholderTextColor="#BACAD6"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            textContentType="oneTimeCode"
            autoComplete="off"
          />
          <Pressable
            onPress={() => setShowPassword((v) => !v)}
            hitSlop={8}
            style={styles.eyeButton}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#6080A8"
            />
          </Pressable>
        </View>

        <Pressable
          onPress={onForgotPassword}
          style={styles.forgotButton}
          hitSlop={6}
        >
          <Text style={styles.forgotText}>{t('auth.forgotPassword')}</Text>
        </Pressable>
      </View>

      <Pressable
        style={[styles.primaryButton, isSubmitting && styles.buttonDisabled]}
        onPress={() => onSubmit(email, password)}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.primaryButtonText}>{t('auth.signIn.button')}</Text>
        )}
      </Pressable>

      <View style={styles.toggleRow}>
        <Text style={styles.toggleText}>{t('auth.signIn.newTo')}</Text>
        <Pressable onPress={onSwitchToSignUp}>
          <Text style={styles.toggleLink}>{t('auth.signIn.createAccount')}</Text>
        </Pressable>
      </View>

      <Pressable style={styles.guestButton} onPress={onContinueAsGuest}>
        <Text style={styles.guestButtonText}>
          {t('auth.continueAsGuest')}
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
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: '#E6F4FE',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  inputFieldInner: {
    flex: 1,
    fontSize: 15,
    color: '#334A77',
    height: '100%',
  },
  eyeButton: { padding: 4, marginLeft: 4 },
  forgotButton: { alignSelf: 'flex-end', marginTop: -4 },
  forgotText: { fontSize: 13, fontWeight: '600', color: '#208AEF' },
  primaryButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#208AEF',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  buttonDisabled: { backgroundColor: '#BACAD6' },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  toggleText: { fontSize: 14, color: '#6080A8' },
  toggleLink: { fontSize: 14, fontWeight: '700', color: '#208AEF' },
  guestButton: { alignItems: 'center', marginTop: 24 },
  guestButtonText: {
    fontSize: 13,
    color: '#BACAD6',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});