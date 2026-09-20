// src/app/(drawer)/(tabs)/profile.tsx
import React, { useState } from 'react';
import { StyleSheet, Pressable, KeyboardAvoidingView, Platform, Alert, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Effector core state bindings
import { signUpFx, signInFx, verifyCodeFx, resendCodeFx } from '@/effector/events/async/auth';
import { $authStep, $userSession, $isAuthSubmitting } from '@/effector/store';
import { setAuthStep, logout } from '@/effector/events/sync';

// Decoupled sub-component modules
import AuthWelcome from '@/components/ui/AuthWelcome';
import AuthSignIn from '@/components/ui/AuthSignIn';
import AuthSignUp from '@/components/ui/AuthSignUp';
import AuthVerifyCode from '@/components/ui/AuthVerifyCode';
import UserProfile from '@/components/ui/UserProfile';

export default function ProfileHubScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  // Local interface states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string>('');

  // Global store parameter resolution hooks
  const { currentStep, user, isSubmitting, changeStep, handleLogout } = useUnit({
    currentStep: $authStep,
    user: $userSession,
    isSubmitting: $isAuthSubmitting,
    changeStep: setAuthStep,
    handleLogout: logout,
  });

  const navigateToHome = () => router.replace('/(drawer)/(tabs)');

  // 1. AUTHORIZED USER MODE (PROFILE PANEL)
  if (user) {
    return <UserProfile user={user} onLogout={handleLogout} />;
  }

  // 2. BASELINE ONBOARDING OVERLAY MODE (WELCOME SLIDER)
  if (currentStep === 'welcome') {
    return <AuthWelcome onGetStarted={() => changeStep('signin')} bottomInset={insets.bottom} />;
  }

  // 3. REGISTRATION ENGINE INTERACTION PIPELINE
  const handleSignUp = async (fullName: string, email: string, password: string) => {
    try {
      setErrorMessage(null);
      setPendingEmail(email.trim()); // Save reference context for verification layout steps
      await signUpFx({ username: fullName.trim(), email: email.trim(), password });
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'Registration failure encountered.');
    }
  };

  // 4. SMART LOGIN TRAPPING & INTERCEPTION INTERACTIVE RULES
  const handleSignIn = async (email: string, password: string) => {
    try {
      setErrorMessage(null);
      await signInFx({ user: email.trim(), password });
      navigateToHome();
    } catch (err: any) {
      const serverMessage = err?.response?.data?.message || '';
      const statusCode = err?.response?.status;

      // Detect unconfirmed profile indicators inside returning network layers
      if (
        statusCode === 400 || 
        serverMessage.toLowerCase().includes('confirm') || 
        serverMessage.toLowerCase().includes('подтвержд')
      ) {
        setPendingEmail(email.trim()); // Anchor fallback email target pointer
        changeStep('verify');          // Pivot screen focus to code inputs immediately
        setErrorMessage('Your account is unverified. We have dispatched a new secure code.');
        
        // Push a fresh verification combination update down via the NestJS dispatch queue
        resendCodeFx(email.trim()).catch(() => {});
      } else {
        setErrorMessage(serverMessage || 'Invalid email or security credentials provided.');
      }
    }
  };

  // 5. SECURE DIGITAL RESEND TRIGGER PIPELINE
  const handleResendCodeCall = async () => {
    if (!pendingEmail) {
      setErrorMessage('Missing target contextual email token references.');
      return;
    }
    try {
      setErrorMessage(null);
      await resendCodeFx(pendingEmail);
      Alert.alert('Code Dispatched', 'A new 6-digit tracking code has been forwarded to your inbox.');
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'Failed to dispatch notification sequence.');
    }
  };

  // 6. CODE VALIDATION TRANSACTION HANDLER
  const handleVerifyCodeSubmit = async (code: string) => {
    try {
      setErrorMessage(null);
      await verifyCodeFx(code);
      Alert.alert('Verification Success', 'Account activated successfully! Please sign in.', [
        { text: 'OK', onPress: () => changeStep('signin') }
      ]);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'Invalid or expired entry code string token.');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      {/* Universal fallback back-dismiss target button layout */}
      <Pressable 
        style={[styles.closeButton, { top: insets.top + 12 }]} 
        onPress={() => { changeStep('welcome'); setErrorMessage(null); }}
        hitSlop={12}
      >
        <Ionicons name="close" size={24} color="#334A77" />
      </Pressable>

      {/* Screen layout choice resolution split routing trees */}
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

      {currentStep === 'verify' && (
        <AuthVerifyCode 
          onSubmit={handleVerifyCodeSubmit}
          onResendCode={handleResendCodeCall}
          onBackToSignUp={() => { changeStep('signup'); setErrorMessage(null); }}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  closeButton: { 
    position: 'absolute', 
    right: 16, 
    padding: 8, 
    zIndex: 10 
  },
});
