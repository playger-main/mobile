// src/components/ui/AuthResetPassword.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AuthResetPasswordProps {
  email: string;
  onSubmit: (code: string, newPassword: string) => void;
  onResendCode: () => void;
  onBackToSignIn: () => void;
  isSubmitting: boolean;
  errorMessage: string | null;
}

export default function AuthResetPassword({
  email,
  onSubmit,
  onResendCode,
  onBackToSignIn,
  isSubmitting,
  errorMessage,
}: AuthResetPasswordProps) {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown === 0) return;
    const timer = setInterval(() => setCountdown((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const showMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const canSubmit =
    code.length === 6 &&
    password.length >= 6 &&
    passwordsMatch &&
    !isSubmitting;

  const handleResend = () => {
    onResendCode();
    setCountdown(60);
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.logoIconBlock}>
        <Ionicons name="lock-open-outline" size={32} color="#FFFFFF" />
      </View>

      <Text style={styles.formTitle}>Set new password</Text>
      <Text style={styles.formSubtitle}>
        We sent a 6-digit code to{' '}
        <Text style={styles.emailHighlight}>{email}</Text>. Enter it below and
        choose a new password.
      </Text>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <View style={styles.inputGroup}>
        <TextInput
          style={styles.codeInput}
          placeholder="000000"
          placeholderTextColor="#BACAD6"
          value={code}
          onChangeText={(t) => setCode(t.replace(/\D/g, ''))}
          keyboardType="number-pad"
          maxLength={6}
          autoFocus
          textContentType="oneTimeCode"
          autoComplete="one-time-code"
        />

        {/* New password */}
        <View style={styles.inputWithIcon}>
          <TextInput
            style={styles.inputFieldInner}
            placeholder="New password (min 6)"
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

        {/* Confirm new password */}
        <View style={styles.inputWithIcon}>
          <TextInput
            style={styles.inputFieldInner}
            placeholder="Confirm new password"
            placeholderTextColor="#BACAD6"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirm}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            textContentType="oneTimeCode"
            autoComplete="off"
          />
          <Pressable
            onPress={() => setShowConfirm((v) => !v)}
            hitSlop={8}
            style={styles.eyeButton}
          >
            <Ionicons
              name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#6080A8"
            />
          </Pressable>
          {passwordsMatch && (
            <Ionicons
              name="checkmark-circle"
              size={20}
              color="#27AE60"
              style={{ marginLeft: 4 }}
            />
          )}
        </View>

        {showMismatch && (
          <Text style={styles.mismatchText}>Passwords do not match</Text>
        )}
      </View>

      <Pressable
        style={[styles.primaryButton, !canSubmit && styles.buttonDisabled]}
        onPress={() => onSubmit(code.trim(), password)}
        disabled={!canSubmit}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.primaryButtonText}>Reset password</Text>
        )}
      </Pressable>

      <View style={styles.resendBlock}>
        {countdown > 0 ? (
          <Text style={styles.resendTimer}>Resend code in {countdown}s</Text>
        ) : (
          <Pressable onPress={handleResend}>
            <Text style={styles.resendLink}>Resend code</Text>
          </Pressable>
        )}
      </View>

      <Pressable style={styles.backButton} onPress={onBackToSignIn}>
        <Text style={styles.backButtonText}>← Back to sign in</Text>
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
  emailHighlight: { color: '#208AEF', fontWeight: '700' },
  errorText: {
    color: '#FF3B30',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
  },
  inputGroup: { gap: 12, marginBottom: 24 },
  codeInput: {
    width: '100%',
    height: 56,
    borderWidth: 1,
    borderColor: '#E6F4FE',
    borderRadius: 12,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 8,
    textAlign: 'center',
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
  mismatchText: {
    color: '#FF3B30',
    fontSize: 12,
    fontWeight: '600',
    marginTop: -4,
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
  resendBlock: { alignItems: 'center', marginTop: 16 },
  resendTimer: { fontSize: 13, color: '#BACAD6', fontWeight: '500' },
  resendLink: {
    fontSize: 13,
    color: '#208AEF',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  backButton: { alignItems: 'center', marginTop: 24 },
  backButtonText: { fontSize: 14, color: '#6080A8', fontWeight: '600' },
});
