import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Path, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const InfoIcon = ({ color = '#94A3B8' }) => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Path d="M12 11V16M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function PaymentMethodScreen() {
  useAndroidBack(() => router.push('/(dashboard)/profile'));
  const router = useSafeRouter();
  const [activeTab, setActiveTab] = useState<'bank' | 'upi'>('bank');
  
  // Set to true to view the Verified state (Image 3)
  const [isVerified, setIsVerified] = useState(false);

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/(dashboard)/profile')} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} onLongPress={() => setIsVerified(!isVerified)}>Payment method</Text>
          
          <TouchableOpacity style={styles.helpBtn} onPress={() => router.push('/(dashboard)/help-advanced')}>
            <View style={StyleSheet.absoluteFill}>
              <Svg height="100%" width="100%" style={{ borderRadius: 8 }}>
                <Defs>
                  <LinearGradient id="gradHeader" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0" stopColor="#F97316" stopOpacity="1" />
                    <Stop offset="1" stopColor="#FBBF24" stopOpacity="1" />
                  </LinearGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#gradHeader)" rx="8" />
              </Svg>
            </View>
            <Text style={styles.helpBtnText}>Help</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.mainCard}>
            
            {/* Tab Switcher - only show if not verified (or we can show it but disabled) */}
            {!isVerified && (
              <View style={styles.tabContainer}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.tabBtn, activeTab === 'bank' && styles.activeTabBtn]}
                  onPress={() => setActiveTab('bank')}
                >
                  <Text style={[styles.tabText, activeTab === 'bank' && styles.activeTabText]}>Bank Account</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.tabBtn, activeTab === 'upi' && styles.activeTabBtn]}
                  onPress={() => setActiveTab('upi')}
                >
                  <Text style={[styles.tabText, activeTab === 'upi' && styles.activeTabText]}>UPI ID</Text>
                </TouchableOpacity>
              </View>
            )}

            {isVerified ? (
              // Verified Bank Account State (Image 3)
              <View>
                <Text style={styles.verifiedTitle}>Bank Account Details</Text>
                <Text style={styles.verifiedDesc}>You can't edit this account since it is already verified.</Text>
                
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Full name (Same as Bank Account)</Text>
                  <View style={styles.readOnlyInput}>
                    <Text style={styles.readOnlyText}>P ESWAR</Text>
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Account Number</Text>
                  <View style={styles.readOnlyInput}>
                    <Text style={styles.readOnlyText}>XXXXXXXXXXXXXXXX</Text>
                  </View>
                  <View style={[styles.readOnlyInput, { marginTop: 8 }]}>
                    <Text style={styles.readOnlyText}>9992505024591601</Text>
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>IFSC code</Text>
                  <View style={styles.readOnlyInput}>
                    <Text style={styles.readOnlyText}>KARB0000765</Text>
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Name of Bank</Text>
                  <View style={styles.readOnlyInput}>
                    <Text style={styles.readOnlyText}>Karnataka Bank , TIRUPATI</Text>
                  </View>
                </View>
              </View>
            ) : activeTab === 'bank' ? (
              // Editable Bank Account State (Image 1)
              <View>
                <Text style={styles.infoDesc}>Your earnings will be transferred to the account details you provide below:</Text>
                
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Full name (Same as Bank Account)</Text>
                  <TextInput style={styles.input} placeholder="Enter your name" placeholderTextColor="#94A3B8" />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Account Number</Text>
                  <TextInput style={styles.input} placeholder="Enter Account Number" placeholderTextColor="#94A3B8" keyboardType="number-pad" />
                  <TextInput style={[styles.input, { marginTop: 8 }]} placeholder="Re-Enter account number" placeholderTextColor="#94A3B8" keyboardType="number-pad" />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>IFSC code</Text>
                  <TextInput style={styles.input} placeholder="Enter IFSC Code" placeholderTextColor="#94A3B8" autoCapitalize="characters" />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Name of Bank</Text>
                  <TextInput style={styles.input} placeholder="Enter Bank name" placeholderTextColor="#94A3B8" />
                </View>

                <TouchableOpacity style={styles.confirmBtn} onPress={() => setIsVerified(true)}>
                  <Text style={styles.confirmBtnText}>CONFIRM</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Editable UPI ID State (Image 2)
              <View>
                <Text style={styles.infoDesc}>The amount will be transferred to the UPI linked bank account.</Text>

                <View style={styles.upiCard}>
                  <View style={styles.upiHeader}>
                    <Text style={styles.upiTitle}>Add UPI Account</Text>
                    <TouchableOpacity>
                      <Text style={styles.findUpiText}>Find UPI Id?</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.label}>Please enter your UPI ID</Text>
                  <TextInput style={styles.input} placeholder="Mobilenumber@upi" placeholderTextColor="#94A3B8" />

                  <View style={styles.upiHelperBox}>
                    <InfoIcon color="#94A3B8" />
                    <Text style={styles.upiHelperText}>The UPI ID is in the format of name/phonenumber@bankname</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.confirmBtn} onPress={() => setIsVerified(true)}>
                  <Text style={styles.confirmBtnText}>CONFIRM</Text>
                </TouchableOpacity>
              </View>
            )}

          </View>
        </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1,  },
  
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', flex: 1 },
  
  helpBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  helpBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },

  scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },

  mainCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20 },

  tabContainer: { flexDirection: 'row', backgroundColor: '#F8FAFC', borderRadius: 12, padding: 4, marginBottom: 20 },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
  activeTabBtn: { backgroundColor: '#FFFFFF', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)', elevation: 2 },
  tabText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  activeTabText: { color: '#0F172A', fontWeight: '700' },

  infoDesc: { fontSize: 13, color: '#334155', lineHeight: 20, marginBottom: 24 },

  verifiedTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  verifiedDesc: { fontSize: 13, color: '#94A3B8', lineHeight: 20, marginBottom: 24 },

  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 11, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 14, fontSize: 13, color: '#0F172A' },
  
  readOnlyInput: { backgroundColor: '#FAFAFA', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 14 },
  readOnlyText: { fontSize: 13, color: '#0F172A' },

  confirmBtn: { backgroundColor: 'rgba(26, 15, 163, 1.00)', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  confirmBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },

  upiCard: { borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 12, padding: 16, marginBottom: 20 },
  upiHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  upiTitle: { fontSize: 13, fontWeight: '800', color: '#0F172A' },
  findUpiText: { fontSize: 12, fontWeight: '700', color: '#4F46E5' },
  
  upiHelperBox: { flexDirection: 'row', marginTop: 12, paddingRight: 20 },
  upiHelperText: { fontSize: 11, color: '#94A3B8', lineHeight: 16, marginLeft: 8 },
});
