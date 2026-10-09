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
import { useTheme } from '@/hooks/useTheme';

export default function ChangeEmailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();

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
  const emailCanSubmit = newEmail.trim().length > 0 && !isSubmitting;
  const codeCanSubmit = code.length === 6 && !isSubmitting;

  const emailBtnBg = emailCanSubmit ? colors.primaryDark : colors.disabledBg;
  const emailBtnTextColor = emailCanSubmit ? '#FFFFFF' : colors.textTertiary;

  const codeBtnBg = codeCanSubmit ? colors.primaryDark : colors.disabledBg;
  const codeBtnTextColor = codeCanSubmit ? '#FFFFFF' : colors.textTertiary;


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.listBackground }]}
    >
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 6,
            backgroundColor: colors.background,
            borderColor: colors.borderSubtle,
          },
        ]}
      >
        <Pressable
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            {t('profile.changeEmail.title')}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textTertiary }]}>
            {step === 'email'
              ? t('profile.changeEmail.step1')
              : t('profile.changeEmail.step2')}
          </Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.content}>
        <View
          style={[styles.iconBlock, { backgroundColor: colors.primary }]}
        >
          <Ionicons
            name={step === 'email' ? 'mail-outline' : 'mail-open-outline'}
            size={32}
            color="#FFFFFF"
          />
        </View>

        {step === 'email' ? (
          <>
            <Text style={[styles.formTitle, { color: colors.textPrimary }]}>
              {t('profile.changeEmail.enterNew')}
            </Text>
            <Text style={[styles.formSubtitle, { color: colors.textSecondary }]}>
              {t('profile.changeEmail.enterNewHint')}
            </Text>

            {errorMessage && (
              <Text style={[styles.errorText, { color: colors.danger }]}>
                {errorMessage}
              </Text>
            )}

            <TextInput
              style={[
                styles.inputField,
                {
                  color: colors.textPrimary,
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              value={newEmail}
              onChangeText={(v) => {
                setNewEmail(v);
                setErrorMessage(null);
              }}
              placeholder="newemail@gmail.com"
              placeholderTextColor={colors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
            />

            <Pressable
              style={[styles.primaryButton, { backgroundColor: emailBtnBg }]}
              onPress={handleRequest}
              disabled={!emailCanSubmit}
            >
              {isRequesting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={[styles.primaryButtonText, { color: emailBtnTextColor }]}>
                  {t('profile.changeEmail.sendButton')}
                </Text>
              )}
            </Pressable>
          </>
        ) : (
          <>
            <Text style={[styles.formTitle, { color: colors.textPrimary }]}>
              {t('profile.changeEmail.verifyTitle')}
            </Text>
            <Text style={[styles.formSubtitle, { color: colors.textSecondary }]}>
              {t('profile.changeEmail.verifyHint', { email: newEmail })}
            </Text>

            {errorMessage && (
              <Text style={[styles.errorText, { color: colors.danger }]}>
                {errorMessage}
              </Text>
            )}

            <TextInput
              style={[
                styles.codeInput,
                {
                  color: colors.textPrimary,
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              value={code}
              onChangeText={(v) => {
                setCode(v.replace(/\D/g, ''));
                setErrorMessage(null);
              }}
              placeholder="000000"
              placeholderTextColor={colors.textTertiary}
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
            />

            <Pressable
              style={[styles.primaryButton, { backgroundColor: codeBtnBg }]}
              onPress={handleConfirm}
              disabled={!codeCanSubmit}
            >
              {isConfirming ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={[styles.primaryButtonText, { color: codeBtnTextColor }]}>
                  {t('profile.changeEmail.confirmButton')}
                </Text>
              )}
            </Pressable>

            <View style={styles.resendBlock}>
              {countdown > 0 ? (
                <Text
                  style={[styles.resendTimer, { color: colors.textTertiary }]}
                >
                  {t('auth.verify.resendIn', { count: countdown })}
                </Text>
              ) : (
                <Pressable onPress={handleResend}>
                  <Text style={[styles.resendLink, { color: colors.primary }]}>
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
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backButton: { padding: 4 },
  headerTitleContainer: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 40 },
  iconBlock: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
  },
  formSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
  },
  inputField: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 20,
  },
  codeInput: {
    width: '100%',
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 8,
    textAlign: 'center',
    marginBottom: 20,
  },
  primaryButton: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  resendBlock: { alignItems: 'center', marginTop: 20 },
  resendTimer: { fontSize: 14, fontWeight: '500' },
  resendLink: {
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});