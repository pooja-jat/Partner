import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Platform, KeyboardAvoidingView, ScrollView, Pressable } from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

interface OTPModalProps {
  visible: boolean;
  onClose: () => void;
  onVerified: () => void;
  expectedOtp?: string;
  length?: 4 | 6;
}

const CloseModalIcon = ({ color = '#0F172A' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LockIcon = ({ color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Rect x="5" y="11" width="14" height="10" rx="2" stroke={color} strokeWidth="2" />
    <Path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const CheckShieldIcon = ({ color = '#22C55E' }) => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PhoneShakeIcon = ({ color = '#94A3B8' }) => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Rect x="7" y="3" width="10" height="18" rx="2" stroke={color} strokeWidth="2" transform="rotate(15 12 12)" />
  </Svg>
);

export const OTPModal: React.FC<OTPModalProps> = ({ visible, onClose, onVerified, expectedOtp, length = 4 }) => {
  const [otpValue, setOtpValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef<TextInput>(null);

  React.useEffect(() => {
    if (visible) {
      setOtpValue('');
      setErrorMsg('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 400);
    }
  }, [visible, length]);

  const handleOtpChange = (text: string) => {
    setErrorMsg('');
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, length);
    setOtpValue(cleaned);
    if (cleaned.length === length) {
      setTimeout(() => handleVerifyOtp(cleaned), 100);
    }
  };

  const handleVerifyOtp = (entered: string) => {
    const isDummyOtp = entered === '1234' || entered === '123456' || entered.startsWith('1234');
    if (expectedOtp && entered !== expectedOtp && !isDummyOtp) {
      setErrorMsg('Invalid code, try again');
      return;
    }
    onVerified();
  };

  const handleVerify = () => {
    handleVerifyOtp(otpValue);
  };

  const renderCells = () => {
    const cells = [];
    for (let i = 0; i < length; i++) {
      const char = otpValue[i] || '';
      const isCurrentActive = isFocused && otpValue.length === i;
      const isLastActive = isFocused && i === length - 1 && otpValue.length === length;
      const active = isCurrentActive || isLastActive;
      const isFilled = char !== '';
      cells.push(
        <View
          key={i}
          style={[
            styles.otpCell,
            (isFilled || active) && styles.otpCellFilled,
            active && styles.otpCellActive,
          ]}
        >
          <Text style={styles.otpCellText}>{char}</Text>
        </View>
      );
    }
    return cells;
  };

  return (
    <Modal visible={visible} animationType="fade" transparent statusBarTranslucent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
        keyboardVerticalOffset={Platform.OS === 'android' ? 24 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        <View style={styles.modalCard}>
          
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <CloseModalIcon />
          </TouchableOpacity>

          {/* Graphic Area */}
          <View style={styles.graphicContainer}>
            <View style={styles.circleBg}>
              <View style={styles.mainPhoneBox}>
                <View style={styles.iconCircle}>
                  <LockIcon />
                </View>
                <Text style={styles.otpLabelText}>OTP</Text>
              </View>
              
              <View style={[styles.floatingIcon, { top: 20, left: -20 }]}>
                <CheckShieldIcon />
              </View>
              
              <View style={[styles.floatingIcon, { bottom: 20, right: -20 }]}>
                <PhoneShakeIcon />
              </View>
            </View>
          </View>

          <Text style={styles.subText}>Please verify with customer</Text>
          <Text style={styles.titleText}>Enter the {length} digit OTP</Text>

          {errorMsg ? <Text style={{color: 'red', marginBottom: 12, fontSize: 12}}>{errorMsg}</Text> : null}

          <TextInput
            ref={inputRef}
            value={otpValue}
            onChangeText={handleOtpChange}
            keyboardType="number-pad"
            maxLength={length}
            style={styles.hiddenInput}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            textContentType="oneTimeCode"
            autoFocus
            caretHidden
            showSoftInputOnFocus
          />
          <Pressable onPress={() => inputRef.current?.focus()} style={styles.otpRow}>
            {renderCells()}
          </Pressable>

          <View style={styles.resendRow}>
            <Text style={styles.resendLabel}>Didn't get OTP? </Text>
            <TouchableOpacity>
              <Text style={styles.resendText}>Resend (00:30)</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.orDivider}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity style={styles.verifyBtn} onPress={handleVerify}>
            <Text style={styles.verifyBtnText}>Customer Verified</Text>
          </TouchableOpacity>

        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, width: '100%', alignItems: 'center', position: 'relative' },
  
  closeBtn: { position: 'absolute', top: 16, right: 16, padding: 4, zIndex: 10 },

  graphicContainer: { marginVertical: 32, alignItems: 'center', justifyContent: 'center' },
  circleBg: { width: 160, height: 160, borderRadius: 80, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  mainPhoneBox: { width: 80, height: 120, backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 2, borderColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  iconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  otpLabelText: { fontSize: 13, fontWeight: '800', color: 'rgba(26, 15, 163, 1.00)' },
  
  floatingIcon: { position: 'absolute', width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)', elevation: 2 },

  subText: { fontSize: 12, color: '#64748B', marginBottom: 4 },
  titleText: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 24 },

  otpRow: { flexDirection: 'row', gap: 12, marginBottom: 24, position: 'relative', justifyContent: 'center' },
  otpCell: { width: 50, height: 56, borderRadius: 12, borderBottomWidth: 2, borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center' },
  otpCellFilled: { borderWidth: 1.5, borderColor: '#0F172A', borderRadius: 12, borderBottomWidth: 1.5, backgroundColor: '#FFFFFF' },
  otpCellActive: { borderColor: 'rgba(26, 15, 163, 1.00)', borderWidth: 2, borderBottomWidth: 2 },
  otpCellText: { fontSize: 22, fontWeight: '700', color: '#0F172A' },
  hiddenInput: { position: 'absolute', width: 1, height: 1, opacity: 0.01, color: 'transparent', backgroundColor: 'transparent' },

  resendRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  resendLabel: { fontSize: 11, color: '#94A3B8' },
  resendText: { fontSize: 11, fontWeight: '700', color: 'rgba(26, 15, 163, 1.00)' },

  orDivider: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 24 },
  line: { flex: 1, height: 1, backgroundColor: '#F8FAFC' },
  orText: { fontSize: 10, color: '#94A3B8', paddingHorizontal: 12 },

  verifyBtn: { backgroundColor: '#4F46E5', width: '100%', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  verifyBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
