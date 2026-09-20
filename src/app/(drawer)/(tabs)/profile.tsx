// src/app/(drawer)/(tabs)/profile.tsx
import React, { useState } from 'react';
import { StyleSheet, Pressable, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { signUpFx, signInFx, verifyCodeFx } from '@/effector/events/async/auth';
import { $authStep, $userSession, $isAuthSubmitting } from '@/effector/store';
import { setAuthStep, logout } from '@/effector/events/sync';

import AuthWelcome from '@/components/ui/AuthWelcome';
import AuthSignIn from '@/components/ui/AuthSignIn';
import AuthSignUp from '@/components/ui/AuthSignUp';
import AuthVerifyCode from '@/components/ui/AuthVerifyCode'; // ✅ Импортировали новый экран
import UserProfile from '@/components/ui/UserProfile';

export default function ProfileHubScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { currentStep, user, isSubmitting, changeStep, handleLogout } = useUnit({
    currentStep: $authStep,
    user: $userSession,
    isSubmitting: $isAuthSubmitting,
    changeStep: setAuthStep,
    handleLogout: logout,
  });

  const navigateToHome = () => router.replace('/(drawer)/(tabs)');

  if (user) {
    return <UserProfile user={user} onLogout={handleLogout} />;
  }

  if (currentStep === 'welcome') {
    return <AuthWelcome onGetStarted={() => changeStep('signin')} bottomInset={insets.bottom} />;
  }

  const handleSignUp = async (fullName: string, email: string, password: string) => {
    try {
      setErrorMessage(null);
      await signUpFx({ username: fullName.trim(), email: email.trim(), password });
      // После этого Effector автоматически переключит шаг на 'verify'
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'Registration failed.');
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      setErrorMessage(null);
      await signInFx({ user: email.trim(), password });
      navigateToHome();
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'Invalid email or password.');
    }
  };

  // ✅ ОБРАБОТЧИК ПРОВЕРКИ КОДА
  const handleVerifyCode = async (code: string) => {
    try {
      setErrorMessage(null);
      await verifyCodeFx(code);
      Alert.alert('Success', 'Email confirmed successfully! Please sign in.');
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'Invalid or expired code.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <Pressable 
        style={[styles.closeButton, { top: insets.top + 12 }]} 
        onPress={() => { changeStep('welcome'); setErrorMessage(null); }}
        hitSlop={12}
      >
        <Ionicons name="close" size={24} color="#334A77" />
      </Pressable>

      {currentStep === 'signin' && (
        <AuthSignIn 
          onSubmit={handleSignIn}
          onSwitchToSignUp={() => { changeStep('signup'); setErrorMessage(null); }}
          onContinueAsGuest={navigateToHome}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      )}

      {currentStep === 'signup' && (
        <AuthSignUp 
          onSubmit={handleSignUp}
          onSwitchToSignIn={() => { changeStep('signin'); setErrorMessage(null); }}
          onContinueAsGuest={navigateToHome}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      )}

      {/* ✅ ОТРЕНДЕРИЛИ ЭКРАН ВВОДА ЦИФР ИЗ ПИСЬМА */}
      {currentStep === 'verify' && (
        <AuthVerifyCode 
          onSubmit={handleVerifyCode}
          onBackToSignUp={() => { changeStep('signup'); setErrorMessage(null); }}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  closeButton: { position: 'absolute', right: 16, padding: 8, zIndex: 10 },
});
