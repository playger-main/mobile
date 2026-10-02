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

export default function ChangeEmailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

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

  // ✅ Обратный отсчёт для кнопки "Resend"
  useEffect(() => {
    if (step !== 'code') return;
    if (countdown === 0) return;
    const timer = setInterval(() => setCountdown((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [step, countdown]);

  const handleRequest = async () => {
    const trimmed = newEmail.trim().toLowerCase();

    if (!trimmed) {
      setErrorMessage('Please enter a new email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrorMessage('Please enter a valid email.');
      return;
    }
    if (trimmed === (user?.email ?? '').toLowerCase()) {
      setErrorMessage('This is already your current email.');
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
          : String(raw || 'Failed to send code.'),
      );
    }
  };

  const handleConfirm = async () => {
    if (code.length !== 6) {
      setErrorMessage('Please enter the 6-digit code.');
      return;
    }

    setErrorMessage(null);

    try {
      await confirmChange(code.trim());
      Alert.alert('Success', 'Your email has been updated.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e: any) {
      const raw = e?.response?.data?.message ?? e?.message;
      setErrorMessage(
        Array.isArray(raw)
          ? raw.join('\n')
          : String(raw || 'Invalid or expired code.'),
      );
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    try {
      await requestChange(newEmail);
      setCountdown(60);
      setErrorMessage(null);
      Alert.alert('Sent', 'A new code has been sent to your email.');
    } catch (e: any) {
      const raw = e?.response?.data?.message ?? e?.message;
      setErrorMessage(
        Array.isArray(raw)
          ? raw.join('\n')
          : String(raw || 'Failed to resend.'),
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
      {/* =============== HEADER =============== */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <Pressable
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={24} color="#006EE6" />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Change email</Text>
          <Text style={styles.headerSubtitle}>
            {step === 'email' ? 'Step 1 of 2' : 'Step 2 of 2'}
          </Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconBlock}>
          <Ionicons
            name={step === 'email' ? 'mail-outline' : 'mail-open-outline'}
            size={32}
            color="#FFFFFF"
          />
        </View>

        {step === 'email' ? (
          <>
            <Text style={styles.formTitle}>Enter new email</Text>
            <Text style={styles.formSubtitle}>
              We'll send a verification code to this address. Your current email
              stays active until you confirm the change.
            </Text>

            {errorMessage && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}

            <TextInput
              style={styles.inputField}
              value={newEmail}
              onChangeText={(t) => {
                setNewEmail(t);
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
                <Text style={styles.primaryButtonText}>Send code</Text>
              )}
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.formTitle}>Verify new email</Text>
            <Text style={styles.formSubtitle}>
              We sent a 6-digit code to{' '}
              <Text style={styles.emailHighlight}>{newEmail}</Text>
            </Text>

            {errorMessage && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}

            <TextInput
              style={styles.codeInput}
              value={code}
              onChangeText={(t) => {
                setCode(t.replace(/\D/g, ''));
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
                <Text style={styles.primaryButtonText}>Confirm change</Text>
              )}
            </Pressable>

            <View style={styles.resendBlock}>
              {countdown > 0 ? (
                <Text style={styles.resendTimer}>
                  Resend code in {countdown}s
                </Text>
              ) : (
                <Pressable onPress={handleResend}>
                  <Text style={styles.resendLink}>Resend code</Text>
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

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },

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
  emailHighlight: {
    color: '#208AEF',
    fontWeight: '700',
  },
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

  resendBlock: {
    alignItems: 'center',
    marginTop: 20,
  },
  resendTimer: {
    fontSize: 14,
    color: '#BACAD6',
    fontWeight: '500',
  },
  resendLink: {
    fontSize: 14,
    color: '#208AEF',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
