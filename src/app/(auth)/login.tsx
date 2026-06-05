import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Keyboard, Pressable, KeyboardAvoidingView, ScrollView, Platform, BackHandler } from 'react-native';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { Image } from 'expo-image';
import { useAuthStore } from '@/store/authStore';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { Button } from '@/components/ui/Button';
import { HelpModal } from '@/components/ui/HelpModal';
import { Loader } from '@/components/ui/Loader';
import { validatePhone, parsePhoneNumber } from '@/utils/validation';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  useAndroidBack(() => {
    BackHandler.exitApp();
  });
  const router = useSafeRouter();
  const { sendOtp, isLoading, error, clearError, otpSent } = useAuthStore();

  const [phone, setPhone] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  // When OTP is sent, advance to OTP entry screen
  useEffect(() => {
    if (otpSent) {
      router.replace('/(auth)/otp');
    }
  }, [otpSent]);

  const handleSend = async () => {
    clearError();
    const { localNumber } = parsePhoneNumber(phone);
    // Validate length 10
    if (localNumber.length !== 10) {
      useAuthStore.setState({ error: 'Please enter a valid 10‑digit mobile number' });
      return;
    }
    if (!validatePhone(phone)) {
      useAuthStore.setState({ error: 'Please enter a valid 10‑digit mobile number' });
      return;
    }
    await sendOtp(phone);
  };

  const handleHelp = () => setShowHelp(true);

  return (
    <Pressable onPress={Keyboard.dismiss} accessible={false} style={{ flex: 1 }}>
      <GradientBackground style={styles.container}>
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              bounces={false}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.topSection}>
                <View style={styles.headerRow}>
                  <View style={{ flex: 1 }} />
                  <Button title="Help" onPress={handleHelp} variant="gradient" size="sm" />
                </View>

                <View style={styles.logoWrapper}>
                  <Image 
                    source={require('../../../assets/images/logo.png')} 
                    style={styles.icon}
                    contentFit="contain"
                  />
                </View>
              </View>

              <Card style={styles.card} variant="default">
                <PhoneInput
                  label="What's your mobile number*"
                  required
                  value={phone}
                  onChangeText={(text) => {
                    clearError();
                    setPhone(text);
                  }}
                  placeholder="00000 00000"
                  error={error}
                />

                <Button title="Next ➔" onPress={handleSend} isLoading={isLoading} variant="primary" />

                <Text style={styles.termsText}>
                  By continuing, you confirm that you are 18 years of age and agree to the Terms & Conditions and Privacy Policy
                </Text>
              </Card>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>

        <HelpModal visible={showHelp} onClose={() => setShowHelp(false)} />
        <Loader visible={isLoading} message="Sending OTP…" />
      </GradientBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between', // Push top section up and card down
  },
  topSection: {
    paddingHorizontal: 24,
    paddingTop: 60, // Give some space for safe area / status bar
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  card: {
    width: '100%',
    padding: 24,
    paddingBottom: 60, // Extra padding at bottom for keyboard/safe area
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    boxShadow: '0px -2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  logoWrapper: {
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    width: 140,
    height: 140,
  },
  logo: {
    width: 120,
    height: 50,
  },
  termsText: {
    fontSize: 12,
    color: '#64748B', // Slate 500
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 18,
  }
});
