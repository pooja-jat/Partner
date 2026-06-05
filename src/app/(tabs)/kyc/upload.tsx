import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Input } from '@/components/ui/Input';
import { SelectInput } from '@/components/ui/SelectInput';
import { Button } from '@/components/ui/Button';
import { ImageUploadCard } from '@/components/ui/ImageUploadCard';
import { ShieldCheckIcon, ClockCircleIcon, BackArrowIcon } from '@/components/ui/Icons';
import { COLORS } from '@/constants';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';
import { useAuthStore } from '@/store/authStore';
import { SelectOptionsModal } from '@/components/common/SelectOptionsModal';
import { completeStepAndNavigate } from '@/utils/onboarding';

const DOCUMENT_TYPES = [
  { label: 'Aadhaar Card', value: 'Aadhaar Card' },
  { label: 'PAN Card', value: 'PAN Card' },
  { label: 'Voter ID', value: 'Voter ID' },
  { label: 'Passport', value: 'Passport' },
  { label: 'Driving License', value: 'Driving License' }
];

export default function UploadKycDocument() {
  useAndroidBack(() => router.replace('/(tabs)'));
  const router = useSafeRouter();
  const [docType, setDocType] = useState('National ID Card');
  const [docNumber, setDocNumber] = useState('');
  const [docModalVisible, setDocModalVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const role = useAuthStore(state => state.role);

  const handleSubmit = async () => {
    setIsLoading(true);
    await StorageService.setKycStatus({ status: 'reviewing', documents: [{ type: docType, number: docNumber }] });
    
    setTimeout(async () => {
      setIsLoading(false);
      await completeStepAndNavigate('kycUpload', router, 'reviewing');
    }, 1500);
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Verify Document</Text>
        </View>

        <View style={styles.card}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Top Info Section */}
          <View style={styles.topSection}>
            <View style={styles.shieldIconWrapper}>
              <ShieldCheckIcon size={24} color="#0F172A" />
            </View>
            <Text style={styles.verifyTitle}>Verify Your Identity</Text>
            <Text style={styles.verifyDesc}>
              Please provide your official identification document to complete your partner profile.
            </Text>
            <View style={styles.pendingPill}>
              <ClockCircleIcon size={14} color="#4338CA" />
              <Text style={styles.pendingPillText}>Pending Verification</Text>
            </View>
          </View>

          {/* Document Info */}
          <Text style={styles.sectionTitle}>DOCUMENT INFO</Text>
          
          <SelectInput
            label="Document Type"
            required={true}
            value={docType}
            placeholder="Select"
            onPress={() => setDocModalVisible(true)}
          />

          <Input
            label="Document Number"
            required={true}
            placeholder="e.g. A12345678"
            value={docNumber}
            onChangeText={setDocNumber}
          />

          {/* Document Images */}
          <Text style={[styles.sectionTitle, { marginTop: 8 }]}>DOCUMENT IMAGES</Text>
          <Text style={styles.sectionDesc}>Ensure all text is clearly visible and there is no glare.</Text>

          <Text style={styles.uploadLabel}>Front Side</Text>
          <ImageUploadCard 
            label="Tap to upload"
            subLabel="PNG, JPG up to 5MB"
            onPress={() => router.push('/(dashboard)/coming-soon')}
            style={[styles.uploadCard, { backgroundColor: '#FFFFFF' }]}
          />

          <Text style={styles.uploadLabel}>Back Side</Text>
          <ImageUploadCard 
            label="Tap to upload"
            subLabel="PNG, JPG up to 5MB"
            onPress={() => router.push('/(dashboard)/coming-soon')}
            style={[styles.uploadCard, { backgroundColor: '#FFFFFF' }]}
          />

          <Text style={styles.uploadLabel}>Selfie Photo</Text>
          <ImageUploadCard 
            label="Tap to take photo"
            subLabel="Clear face visibility required"
            onPress={() => router.push('/(dashboard)/coming-soon')}
            style={[styles.uploadCard, { backgroundColor: '#FFFFFF' }]}
          />

          <Text style={styles.uploadLabel}>Video KYC</Text>
          <ImageUploadCard 
            label="Tap to record video"
            subLabel="Read the script shown on screen"
            onPress={() => router.push('/(dashboard)/coming-soon')}
            style={[styles.uploadCard, { backgroundColor: '#FFFFFF' }]}
          />

          <Button 
            title="Submit for Verification" 
            onPress={handleSubmit} 
            isLoading={isLoading}
            variant="primary" 
            style={[styles.submitBtn, { backgroundColor: 'rgba(26, 15, 163, 1.00)' }]} 
          />

          </ScrollView>
        </View>
          <SelectOptionsModal
            visible={docModalVisible}
            onClose={() => setDocModalVisible(false)}
            title="Select Document Type"
            options={DOCUMENT_TYPES}
            onSelect={(value) => setDocType(value)}
          />
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: {
    flex: 1,
    
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A' },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  shieldIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  verifyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  verifyDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  pendingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#E0E7FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  pendingPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4338CA',
    marginLeft: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  sectionDesc: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 16,
    marginTop: -8,
  },
  uploadLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
  },
  uploadCard: {
    marginBottom: 20,
  },
  submitBtn: {
    marginTop: 12,
  },
});
