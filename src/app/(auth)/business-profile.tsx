import React, { useState, useEffect } from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity, ScrollView,
  Platform, KeyboardAvoidingView, TextInput, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';
import { RoleAccessGuard } from '@/components/common/RoleAccessGuard';
import { completeStepAndNavigate } from '@/utils/onboarding';
import Svg, { Path } from 'react-native-svg';

const BuildingIcon = ({ size = 16, color = '#4338CA' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 21h18M3 7l9-4 9 4M4 7v14M20 7v14M8 10h2m-2 4h2m4-4h2m-2 4h2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PhoneIcon = ({ size = 16, color = '#4338CA' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.38 21 3 13.62 3 4.5a1 1 0 011-1H7.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.24 1.02l-2.21 2.2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ShieldIcon = ({ size = 16, color = '#4338CA' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronDown = ({ size = 16, color = '#94A3B8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BUSINESS_TYPES = [
  'LLC', 'Sole Proprietorship', 'Partnership', 'Corporation', 'Non-Profit', 'Other'
];

interface FieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: any;
  required?: boolean;
}

function Field({ label, placeholder, value, onChangeText, keyboardType, required }: FieldProps) {
  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldLabel}>{label}{required && <Text style={styles.required}> *</Text>}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType || 'default'}
      />
    </View>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <View style={styles.sectionHeaderRow}>
      <View style={styles.sectionIconWrapper}>{icon}</View>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );
}

export default function BusinessProfileScreen() {
  const router = useSafeRouter();
  const [isApproved, setIsApproved] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  useEffect(() => {
    StorageService.getUserSession().then(s => {
      if (s?.isApproved) setIsApproved(true);
    });
  }, []);

  useAndroidBack(() => {
    if (isApproved) router.back();
    else router.replace('/(tabs)');
  });

  const [form, setForm] = useState({
    businessName: '',
    businessType: '',
    establishedYear: '',
    numEmployees: '',
    businessEmail: '',
    businessPhone: '',
    websiteUrl: '',
    gstNumber: '',
    panNumber: '',
    registrationNumber: '',
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!form.businessName.trim()) {
      Alert.alert('Required', 'Please enter Business Name.');
      return;
    }
    if (isApproved) {
      router.back();
    } else {
      await completeStepAndNavigate('businessProfile', router, 'reviewing');
    }
  };

  return (
    <RoleAccessGuard allowedRoles={['BSP', 'BS']}>
      <GradientBackground style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>

            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => isApproved ? router.back() : router.replace('/(tabs)')} style={styles.backBtn}>
                <BackArrowIcon size={22} color="#0F172A" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Business Setup</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

              {/* Title block */}
              <Text style={styles.pageTitle}>Business Details</Text>
              <Text style={styles.pageSubtitle}>
                Enter your company details for verification. This information will be linked to your branches and services.
              </Text>

              <View style={styles.section}>

                {/* Basic Information */}
                <SectionHeader icon={<BuildingIcon />} title="Basic Information" />
                <View style={styles.sectionDivider} />

                <Field
                  label="Business Name"
                  placeholder="e.g. Acme Services"
                  value={form.businessName}
                  onChangeText={t => update('businessName', t)}
                  required
                />

                <View style={styles.fieldWrapper}>
                  <Text style={styles.fieldLabel}>Business Type</Text>
                  <TouchableOpacity
                    style={[styles.input, styles.dropdownTrigger]}
                    onPress={() => setShowTypeDropdown(v => !v)}
                    activeOpacity={0.8}
                  >
                    <Text style={form.businessType ? styles.dropdownValue : styles.dropdownPlaceholder}>
                      {form.businessType || 'Select Type (e.g. LLC, Sole…)'}
                    </Text>
                    <ChevronDown />
                  </TouchableOpacity>
                  {showTypeDropdown && (
                    <View style={styles.dropdownList}>
                      {BUSINESS_TYPES.map(t => (
                        <TouchableOpacity
                          key={t}
                          style={styles.dropdownItem}
                          onPress={() => { update('businessType', t); setShowTypeDropdown(false); }}
                        >
                          <Text style={styles.dropdownItemText}>{t}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                <View style={styles.row}>
                  <View style={[styles.fieldWrapper, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.fieldLabel}>Established Year</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="YYYY"
                      placeholderTextColor="#94A3B8"
                      value={form.establishedYear}
                      onChangeText={t => update('establishedYear', t)}
                      keyboardType="numeric"
                      maxLength={4}
                    />
                  </View>
                  <View style={[styles.fieldWrapper, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.fieldLabel}>No. of Employees</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter"
                      placeholderTextColor="#94A3B8"
                      value={form.numEmployees}
                      onChangeText={t => update('numEmployees', t)}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                {/* Contact Information */}
                <SectionHeader icon={<PhoneIcon />} title="Contact Information" />
                <View style={styles.sectionDivider} />

                <Field
                  label="Business Email"
                  placeholder="contact@company.com"
                  value={form.businessEmail}
                  onChangeText={t => update('businessEmail', t)}
                  keyboardType="email-address"
                />
                <Field
                  label="Business Phone"
                  placeholder="+1 (555) 000-0000"
                  value={form.businessPhone}
                  onChangeText={t => update('businessPhone', t)}
                  keyboardType="phone-pad"
                />
                <Field
                  label="Website URL"
                  placeholder="https://www.company.com"
                  value={form.websiteUrl}
                  onChangeText={t => update('websiteUrl', t)}
                  keyboardType="url"
                />

                {/* Legal & Verification */}
                <SectionHeader icon={<ShieldIcon />} title="Legal & Verification" />
                <View style={styles.sectionDivider} />
                <Text style={styles.legalNote}>These details will be securely stored for the process.</Text>

                <Field
                  label="GST Number"
                  placeholder="Enter GSTIN"
                  value={form.gstNumber}
                  onChangeText={t => update('gstNumber', t)}
                />
                <Field
                  label="PAN Number"
                  placeholder="Enter PAN"
                  value={form.panNumber}
                  onChangeText={t => update('panNumber', t)}
                />
                <Field
                  label="Registration Number"
                  placeholder="Enter CIN / Registration No."
                  value={form.registrationNumber}
                  onChangeText={t => update('registrationNumber', t)}
                />

              </View>

              {/* Submit */}
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
                <Text style={styles.submitBtnText}>
                  {isApproved ? 'Save Changes' : 'Submit for Verification'}
                </Text>
              </TouchableOpacity>

            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </GradientBackground>
    </RoleAccessGuard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: 'transparent' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backBtn: { marginRight: 14 },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 19,
    marginBottom: 24,
  },

  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginTop: 10,
    marginBottom: 14,
  },

  legalNote: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 14,
    lineHeight: 17,
  },

  fieldWrapper: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 13,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },

  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownPlaceholder: {
    fontSize: 13,
    color: '#94A3B8',
    flex: 1,
  },
  dropdownValue: {
    fontSize: 13,
    color: '#0F172A',
    flex: 1,
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginTop: 4,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownItemText: {
    fontSize: 13,
    color: '#0F172A',
  },

  row: {
    flexDirection: 'row',
    marginBottom: 0,
  },

  submitBtn: {
    backgroundColor: '#1A0FA3',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
