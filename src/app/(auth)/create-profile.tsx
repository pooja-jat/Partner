import { useSafeRouter } from '@/hooks/useSafeRouter';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Platform, Switch } from 'react-native';
import {  useLocalSearchParams } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { SelectInput } from '@/components/ui/SelectInput';
import { Button } from '@/components/ui/Button';
import { BackArrowIcon, UploadIcon, PlusIcon, ChevronDownIcon } from '@/components/ui/Icons';
import { COLORS } from '@/constants';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';
import { SelectOptionsModal } from '@/components/common/SelectOptionsModal';
import { DatePickerModal } from '@/components/ui/DatePickerModal';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateProfileScreen() {
  useAndroidBack();
  const router = useSafeRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isReadOnly = mode === 'view';

  const [modalType, setModalType] = useState<string | null>(null);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [dateValue, setDateValue] = useState(new Date());
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState(false);

  const getOptions = () => {
    switch (modalType) {
      case 'gender': return [{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }, { label: 'Other', value: 'Other' }];
      case 'country': return [{ label: 'India', value: 'India' }, { label: 'United States', value: 'United States' }, { label: 'Canada', value: 'Canada' }];
      case 'state': return [{ label: 'Gujarat', value: 'Gujarat' }, { label: 'Maharashtra', value: 'Maharashtra' }, { label: 'Delhi', value: 'Delhi' }];
      case 'district': return [{ label: 'Ahmedabad', value: 'Ahmedabad' }, { label: 'Surat', value: 'Surat' }, { label: 'Pune', value: 'Pune' }];
      case 'city': return [{ label: 'Ahmedabad City', value: 'Ahmedabad City' }, { label: 'Gandhinagar', value: 'Gandhinagar' }];
      default: return [];
    }
  };

  const getModalTitle = () => {
    switch (modalType) {
      case 'gender': return 'Select Gender';
      case 'country': return 'Select Country';
      case 'state': return 'Select State';
      case 'district': return 'Select District';
      case 'city': return 'Select City';
      default: return '';
    }
  };

  const handleSelect = (val: string) => {
    if (modalType) {
      updateForm(modalType as any, val);
    }
    setModalType(null);
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (date) {
      setDateValue(date);
      const formatted = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
      updateForm('dob', formatted);
    }
  };

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    useWhatsApp: true,
    dob: '',
    gender: '',
    businessName: '',
    address: '',
    country: '',
    state: '',
    district: '',
    city: '',
    pincode: '',
  });

  const updateForm = (key: keyof typeof form, value: string | boolean) => {
    if (isReadOnly) return;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const loadProfile = async () => {
      const session = await StorageService.getUserSession();
      setUserRole(session?.role || null);
      if (session?.isApproved) {
        setIsApproved(true);
      }

      const profile = await StorageService.getPartnerProfile();
      if (profile) {
        setForm((prev) => ({ ...prev, ...profile }));
      }
    };
    loadProfile();
  }, []);

  const handleBack = () => {
    if (isApproved) {
      router.back();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(auth)/role-selection');
    }
  };

  const handleSave = async () => {
    await StorageService.setPartnerProfile(form);
    if (isApproved) {
      router.back();
    } else {
      const { completeStepAndNavigate } = require('@/utils/onboarding');
      await completeStepAndNavigate('partnerProfile', router, 'reviewing');
    }
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topSection}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{isApproved ? 'Edit Profile' : 'Create Profile'}</Text>
        </View>

        <Card style={styles.card} variant="default">
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            {/* Upload Photo Section */}
            <View style={styles.uploadSection}>
              <View style={styles.uploadCircle}>
                <UploadIcon size={24} color="#94A3B8" />
                <Text style={styles.uploadText}>UPLOAD</Text>
                
                <View style={styles.plusBadge}>
                  <PlusIcon size={12} color="#FFFFFF" />
                </View>
              </View>
              <Text style={styles.uploadSubtitle}>Add a professional photo for your ID</Text>
            </View>

            {/* Personal Details */}
            <Text style={styles.sectionTitle}>Personal Details</Text>
            <View style={styles.divider} />

            <View style={styles.row}>
              <View style={styles.flex1}>
                <Input
                  label="First Name"
                  placeholder="John"
                  value={form.firstName}
                  editable={!isReadOnly}
                  pointerEvents={isReadOnly ? 'none' : 'auto'}
                  onChangeText={(t) => updateForm('firstName', t)}
                />
              </View>
              <View style={styles.flex1}>
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  value={form.lastName}
                  editable={!isReadOnly}
                  pointerEvents={isReadOnly ? 'none' : 'auto'}
                  onChangeText={(t) => updateForm('lastName', t)}
                />
              </View>
            </View>

            <Input
              label="Email Address"
              placeholder="john.doe@example.com"
              keyboardType="email-address"
              value={form.email}
              editable={!isReadOnly}
              pointerEvents={isReadOnly ? 'none' : 'auto'}
              onChangeText={(t) => updateForm('email', t)}
            />

            <View style={styles.toggleContainer}>
              <View style={styles.toggleTextContainer}>
                <Text style={styles.toggleTitle}>Use as WhatsApp Number</Text>
                <Text style={styles.toggleSubtitle}>Get important alerts via WhatsApp</Text>
              </View>
              <Switch
                value={form.useWhatsApp}
                onValueChange={(v) => updateForm('useWhatsApp', v)}
                trackColor={{ false: '#E2E8F0', true: COLORS.primary }}
                thumbColor="#FFFFFF"
                disabled={isReadOnly}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.flex1}>
                <TouchableOpacity activeOpacity={0.7} onPress={() => !isReadOnly && setDatePickerVisible(true)}>
                  <Input
                    label="Date of Birth"
                    placeholder="DD/MM/YYYY"
                    value={form.dob}
                    editable={false}
                    pointerEvents="none"
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.flex1}>
                    <SelectInput
                      label="Gender"
                      value={form.gender}
                      placeholder="Select"
                      onPress={() => !isReadOnly && setModalType('gender')}
                      style={{ marginBottom: 12 }}
                      required={false}
                      disabled={isReadOnly}
                    />
              </View>
            </View>

            {/* Business & Location */}
            <Text style={[styles.sectionTitle, { marginTop: 8 }]}>
              {userRole === 'ISP' ? 'Location Details' : 'Business & Location'}
            </Text>
            <View style={styles.divider} />

            {userRole !== 'ISP' && (
              <Input
                label="Business Name"
                placeholder="e.g. John Logistics"
                value={form.businessName}
                editable={!isReadOnly}
                pointerEvents={isReadOnly ? 'none' : 'auto'}
                onChangeText={(t) => updateForm('businessName', t)}
              />
            )}

            <Input
              label="Full Address"
              placeholder="Street address, apartment, suite"
              value={form.address}
              editable={!isReadOnly}
              pointerEvents={isReadOnly ? 'none' : 'auto'}
              onChangeText={(t) => updateForm('address', t)}
            />

            <View style={styles.row}>
              <View style={styles.flex1}>
                    <SelectInput
                      label="Country"
                      value={form.country}
                      placeholder="Select"
                      onPress={() => !isReadOnly && setModalType('country')}
                      style={{ marginBottom: 12 }}
                      required={false}
                      disabled={isReadOnly}
                    />
              </View>
              <View style={styles.flex1}>
                    <SelectInput
                      label="State"
                      value={form.state}
                      placeholder="Select"
                      onPress={() => !isReadOnly && setModalType('state')}
                      style={{ marginBottom: 12 }}
                      required={false}
                      disabled={isReadOnly}
                    />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.flex1}>
                    <SelectInput
                      label="District"
                      value={form.district}
                      placeholder="Select"
                      onPress={() => !isReadOnly && setModalType('district')}
                      style={{ marginBottom: 12 }}
                      required={false}
                      disabled={isReadOnly}
                    />
              </View>
              <View style={styles.flex1}>
                    <SelectInput
                      label="City"
                      value={form.city}
                      placeholder="Select"
                      onPress={() => !isReadOnly && setModalType('city')}
                      style={{ marginBottom: 12 }}
                      required={false}
                      disabled={isReadOnly}
                    />
              </View>
            </View>

            <Input
              label="Pincode / ZIP"
              placeholder="123456"
              keyboardType="numeric"
              value={form.pincode}
              editable={!isReadOnly}
              pointerEvents={isReadOnly ? 'none' : 'auto'}
              onChangeText={(t) => updateForm('pincode', t)}
            />

            {!isReadOnly && (
              <Button
                title={isApproved ? "Save Changes" : "Save and Continue"}
                onPress={handleSave}
                variant="primary"
                style={styles.saveBtn}
              />
            )}

          </ScrollView>
        </Card>
      </SafeAreaView>

      <DatePickerModal
        visible={datePickerVisible}
        value={dateValue}
        onChange={handleDateChange}
        onClose={() => setDatePickerVisible(false)}
        maximumDate={new Date()}
      />

      <SelectOptionsModal
        visible={!!modalType}
        onClose={() => setModalType(null)}
        title={getModalTitle()}
        options={getOptions()}
        onSelect={handleSelect}
      />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    ...Platform.select({
      web: {
        width: '100%',
        maxWidth: 600,
        alignSelf: 'center',
        paddingHorizontal: 20,
      },
    }),
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  card: {
    flex: 1,
    width: '92%',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginBottom: 16,
    boxShadow: '0px -2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingBottom: 0,
  },
  uploadSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
    backgroundColor: '#F8FAFC',
  },
  uploadText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 4,
  },
  plusBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  uploadSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginTop: 8,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  flex1: {
    flex: 1,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#FAFAFA',
  },
  toggleTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  toggleSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
  },
  saveBtn: {
    marginTop: 12,
    marginBottom: 12,
  },
});
