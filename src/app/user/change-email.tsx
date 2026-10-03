// src/app/user/change-email.tsx
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUnit } from 'effector-react';
import { Ionicons } from '@expo/vector-icons';

import {
  $userSession,
  requestEmailChangeFx,
  confirmEmailChangeFx,
} from '@/effector/store';
import { useTranslation } from '@/i18n';

export default function ChangeEmailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();

  const user = useUnit($userSession);
  const isRequesting = useUnit(requestEmailChangeFx.pending);
  const isConfirming = useUnit(confirmEmailChangeFx.pending);

  const requestChange = useUnit(requestEmailChangeFx);
  const confirmChange = useUnit(confirmEmailChangeFx);

  const [step, setStep] = useState<'email' | 'code'>('email');
  const [newEmail, setNewEmail] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (step !== 'code') return;
    if (countdown === 0) return;
    const timer = setInterval(() => setCountdown((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [step, countdown]);

  const handleRequest = async () => {
    const trimmed = newEmail.trim().toLowerCase();

    if (!trimmed) {
      setErrorMessage(t('profile.changeEmail.enterEmail'));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrorMessage(t('profile.changeEmail.invalidEmail'));
      return;
    }
    if (trimmed === (user?.email ?? '').toLowerCase()) {
      setErrorMessage(t('profile.changeEmail.sameEmail'));
      return;
    }

    setErrorMessage(null);

    try {
      await requestChange(trimmed);
      setNewEmail(trimmed);
      setStep('code');
      setCountdown(60);
      setCode('');
    } catch (e: any) {
      const raw = e?.response?.data?.message ?? e?.message;
      setErrorMessage(
        Array.isArray(raw)
          ? raw.join('\n')
          : String(raw || t('common.tryAgain')),
      );
    }
  };

  const handleConfirm = async () => {
    if (code.length !== 6) {
      setErrorMessage(t('profile.changeEmail.enterCode'));
      return;
    }

    setErrorMessage(null);

    try {
      await confirmChange(code.trim());
      Alert.alert(
        t('profile.changeEmail.successTitle'),
        t('profile.changeEmail.successMessage'),
        [{ text: t('common.ok'), onPress: () => router.back() }],
      );
    } catch (e: any) {
      const raw = e?.response?.data?.message ?? e?.message;
      setErrorMessage(
        Array.isArray(raw)
          ? raw.join('\n')
          : String(raw || t('auth.error.invalidCode')),
      );
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    try {
      await requestChange(newEmail);
      setCountdown(60);
      setErrorMessage(null);
      Alert.alert(t('auth.error.codeSent'), t('auth.error.newCodeSent'));
    } catch (e: any) {
      const raw = e?.response?.data?.message ?? e?.message;
      setErrorMessage(
        Array.isArray(raw)
          ? raw.join('\n')
          : String(raw || t('common.tryAgain')),
      );
    }
  };

  const handleBack = () => {
    if (step === 'code') {
      setStep('email');
      setCode('');
      setErrorMessage(null);
      return;
    }
    router.back();
  };

  const isSubmitting = isRequesting || isConfirming;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <Pressable
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={24} color="#006EE6" />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>
            {t('profile.changeEmail.title')}
          </Text>
          <Text style={styles.headerSubtitle}>
            {step === 'email'
              ? t('profile.changeEmail.step1')
              : t('profile.changeEmail.step2')}
          </Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconBlock}>
          <Ionicons
            name={step === 'email' ? 'mail-outline' : 'mail-open-outline'}
            size={32}
            color="#FFFFFF"
          />
        </View>

        {step === 'email' ? (
          <>
            <Text style={styles.formTitle}>
              {t('profile.changeEmail.enterNew')}
            </Text>
            <Text style={styles.formSubtitle}>
              {t('profile.changeEmail.enterNewHint')}
            </Text>

            {errorMessage && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}

            <TextInput
              style={styles.inputField}
              value={newEmail}
              onChangeText={(v) => {
                setNewEmail(v);
                setErrorMessage(null);
              }}
              placeholder="newemail@gmail.com"
              placeholderTextColor="#BACAD6"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
            />

            <Pressable
              style={[
                styles.primaryButton,
                (!newEmail.trim() || isSubmitting) && styles.buttonDisabled,
              ]}
              onPress={handleRequest}
              disabled={!newEmail.trim() || isSubmitting}
            >
              {isRequesting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {t('profile.changeEmail.sendButton')}
                </Text>
              )}
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.formTitle}>
              {t('profile.changeEmail.verifyTitle')}
            </Text>
            <Text style={styles.formSubtitle}>
              {t('profile.changeEmail.verifyHint', { email: newEmail })}
            </Text>

            {errorMessage && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}

            <TextInput
              style={styles.codeInput}
              value={code}
              onChangeText={(v) => {
                setCode(v.replace(/\D/g, ''));
                setErrorMessage(null);
              }}
              placeholder="000000"
              placeholderTextColor="#BACAD6"
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
            />

            <Pressable
              style={[
                styles.primaryButton,
                (code.length < 6 || isSubmitting) && styles.buttonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={code.length < 6 || isSubmitting}
            >
              {isConfirming ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {t('profile.changeEmail.confirmButton')}
                </Text>
              )}
            </Pressable>

            <View style={styles.resendBlock}>
              {countdown > 0 ? (
                <Text style={styles.resendTimer}>
                  {t('auth.verify.resendIn', { count: countdown })}
                </Text>
              ) : (
                <Pressable onPress={handleResend}>
                  <Text style={styles.resendLink}>
                    {t('auth.reset.resend')}
                  </Text>
                </Pressable>
              )}
            </View>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
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
  backButton: { padding: 4 },
  headerTitleContainer: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#334A77' },
  headerSubtitle: {
    fontSize: 12,
    color: '#BACAD6',
    fontWeight: '500',
    marginTop: 1,
  },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 40 },
  iconBlock: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#208AEF',
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
  emailHighlight: { color: '#208AEF', fontWeight: '700' },
  errorText: {
    color: '#FF3B30',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
  },
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
    marginBottom: 20,
  },
  codeInput: {
    width: '100%',
    height: 56,
    borderWidth: 1,
    borderColor: '#E6F4FE',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 8,
    textAlign: 'center',
    color: '#334A77',
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
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
  resendBlock: { alignItems: 'center', marginTop: 20 },
  resendTimer: { fontSize: 14, color: '#BACAD6', fontWeight: '500' },
  resendLink: {
    fontSize: 14,
    color: '#208AEF',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});