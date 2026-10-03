// src/components/ui/AuthVerifyCode.tsx
import React, { useState, useEffect } from 'react';
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

interface AuthVerifyCodeProps {
  onSubmit: (code: string) => void;
  onResendCode: () => void;
  onBackToSignUp: () => void;
  isSubmitting: boolean;
  errorMessage: string | null;
}

export default function AuthVerifyCode({
  onSubmit,
  onResendCode,
  onBackToSignUp,
  isSubmitting,
  errorMessage,
}: AuthVerifyCodeProps) {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown === 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResendPress = () => {
    onResendCode();
    setCountdown(60);
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.logoIconBlock}>
        <Ionicons name="mail-open-outline" size={32} color="#FFFFFF" />
      </View>

      <Text style={styles.formTitle}>{t('auth.verify.title')}</Text>
      <Text style={styles.formSubtitle}>{t('auth.verify.subtitle')}</Text>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <View style={styles.inputGroup}>
        <TextInput
          style={styles.inputField}
          placeholder="000000"
          placeholderTextColor="#BACAD6"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
          textContentType="oneTimeCode"
          autoComplete="one-time-code"
        />
      </View>

      <Pressable
        style={[
          styles.primaryButton,
          (isSubmitting || code.length < 6) && styles.buttonDisabled,
        ]}
        onPress={() => onSubmit(code.trim())}
        disabled={isSubmitting || code.length < 6}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.primaryButtonText}>
            {t('auth.verify.button')}
          </Text>
        )}
      </Pressable>

      <View style={styles.resendContainer}>
        {countdown > 0 ? (
          <Text style={styles.resendTimerText}>
            {t('auth.verify.resendIn', { count: countdown })}
          </Text>
        ) : (
          <Pressable onPress={handleResendPress}>
            <Text style={styles.resendLinkText}>
              {t('auth.verify.resend')}
            </Text>
          </Pressable>
        )}
      </View>

      <Pressable style={styles.backButton} onPress={onBackToSignUp}>
        <Text style={styles.backButtonText}>
          {t('auth.verify.backToRegistration')}
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
    height: 52,
    borderWidth: 1,
    borderColor: '#E6F4FE',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 6,
    textAlign: 'center',
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
  resendContainer: { alignItems: 'center', marginTop: 20 },
  resendTimerText: {
    fontSize: 14,
    color: '#BACAD6',
    fontWeight: '500',
  },
  resendLinkText: {
    fontSize: 14,
    color: '#208AEF',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  backButton: { alignItems: 'center', marginTop: 24 },
  backButtonText: {
    fontSize: 14,
    color: '#6080A8',
    fontWeight: '600',
  },
});