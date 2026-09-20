// src/app/(drawer)/(tabs)/signin.tsx
import React, { useState } from 'react';
import { StyleSheet, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Импортируем Effector
import { signUpFx, signInFx } from '@/effector/events/async/auth';
import { $authStep, $userSession, $isAuthSubmitting } from '@/effector/store';
import { setAuthStep, logout } from '@/effector/events/sync';

// Импортируем наши новые компоненты
import AuthWelcome from '@/components/ui/AuthWelcome';
import AuthSignIn from '@/components/ui/AuthSignIn';
import AuthSignUp from '@/components/ui/AuthSignUp';
import UserProfile from '@/components/ui/UserProfile';

export default function AuthHubScreen() {
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

  // 1. РЕЖИМ ЛИЧНОГО КАБИНЕТА
  if (user) {
    return <UserProfile user={user} onLogout={handleLogout} />;
  }

  // 2. РЕЖИМ ПРИВЕТСТВИЯ
  if (currentStep === 'welcome') {
    return <AuthWelcome onGetStarted={() => changeStep('signin')} bottomInset={insets.bottom} />;
  }

  // 3. РЕЖИМЫ ФОРМ ВВОДА
  const handleSignUp = async (fullName: string, email: string, password: string) => {
    try {
      setErrorMessage(null);
      await signUpFx({ username: fullName.trim(), email: email.trim(), password });
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'Registration failed.');
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      setErrorMessage(null);
      await signInFx({ email: email.trim(), password });
      navigateToHome();
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'Invalid email or password.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      {/* Кнопка закрытия (крестик) */}
      <Pressable 
        style={[styles.closeButton, { top: insets.top + 12 }]} 
        onPress={() => { changeStep('welcome'); setErrorMessage(null); }}
        hitSlop={12}
      >
        <Ionicons name="close" size={24} color="#334A77" />
      </Pressable>

      {currentStep === 'signin' ? (
        <AuthSignIn 
          onSubmit={handleSignIn}
          onSwitchToSignUp={() => { changeStep('signup'); setErrorMessage(null); }}
          onContinueAsGuest={navigateToHome}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      ) : (
        <AuthSignUp 
          onSubmit={handleSignUp}
          onSwitchToSignIn={() => { changeStep('signin'); setErrorMessage(null); }}
          onContinueAsGuest={navigateToHome}
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
