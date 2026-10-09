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
import { useTheme } from '@/hooks/useTheme';

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
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const inputStyle = [
    styles.inputField,
    {
      color: colors.textPrimary,
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
  ];

  const inputWithIconStyle = [
    styles.inputWithIcon,
    {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
  ];

  // ✅ №20: кнопка активна только при заполненных полях
  const canSubmit =
    email.trim().length > 0 &&
    password.length > 0 &&
    !isSubmitting;

  const submitBtnBg = canSubmit ? colors.primaryDark : colors.disabledBg;
  const submitBtnTextColor = canSubmit ? '#FFFFFF' : colors.textTertiary;

  return (
    <View style={[styles.formContainer, { backgroundColor: colors.listBackground }]}>
      <View style={[styles.logoIconBlock, { backgroundColor: colors.primary }]}>
        <Ionicons name="basketball" size={32} color="#FFFFFF" />
      </View>

      <Text style={[styles.formTitle, { color: colors.textPrimary }]}>
        {t('auth.signIn.title')}
      </Text>
      <Text style={[styles.formSubtitle, { color: colors.textSecondary }]}>
        {t('auth.signIn.subtitle')}
      </Text>

      {errorMessage && (
        <Text style={[styles.errorText, { color: colors.danger }]}>
          {errorMessage}
        </Text>
      )}

      <View style={styles.inputGroup}>
        <TextInput
          style={inputStyle}
          placeholder={t('auth.email')}
          placeholderTextColor={colors.textTertiary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
        />

        <View style={inputWithIconStyle}>
          <TextInput
            style={[styles.inputFieldInner, { color: colors.textPrimary }]}
            placeholder={t('auth.password')}
            placeholderTextColor={colors.textTertiary}
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
              color={colors.textSecondary}
            />
          </Pressable>
        </View>

        <Pressable
          onPress={onForgotPassword}
          style={styles.forgotButton}
          hitSlop={6}
        >
          <Text style={[styles.forgotText, { color: colors.primary }]}>
            {t('auth.forgotPassword')}
          </Text>
        </Pressable>
      </View>

      <Pressable
        style={[styles.primaryButton, { backgroundColor: submitBtnBg }]}
        onPress={() => onSubmit(email, password)}
        disabled={!canSubmit}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={[styles.primaryButtonText, { color: submitBtnTextColor }]}>
            {t('auth.signIn.button')}
          </Text>
        )}
      </Pressable>

      <View style={styles.toggleRow}>
        <Text style={[styles.toggleText, { color: colors.textSecondary }]}>
          {t('auth.signIn.newTo')}
        </Text>
        <Pressable onPress={onSwitchToSignUp}>
          <Text style={[styles.toggleLink, { color: colors.primary }]}>
            {t('auth.signIn.createAccount')}
          </Text>
        </Pressable>
      </View>

      <Pressable style={styles.guestButton} onPress={onContinueAsGuest}>
        <Text style={[styles.guestButtonText, { color: colors.textTertiary }]}>
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
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputFieldInner: { flex: 1, fontSize: 15, height: '100%' },
  eyeButton: { padding: 4, marginLeft: 4 },
  forgotButton: { alignSelf: 'flex-end', marginTop: -4 },
  forgotText: { fontSize: 13, fontWeight: '600' },
  primaryButton: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  toggleRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  toggleText: { fontSize: 14 },
  toggleLink: { fontSize: 14, fontWeight: '700' },
  guestButton: { alignItems: 'center', marginTop: 24 },
  guestButtonText: {
    fontSize: 13,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});