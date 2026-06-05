import { useSafeRouter } from '@/hooks/useSafeRouter';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {  useLocalSearchParams } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Input } from '@/components/ui/Input';
import { SelectInput } from '@/components/ui/SelectInput';
import { Button } from '@/components/ui/Button';
import { ImageUploadCard } from '@/components/ui/ImageUploadCard';
import { ShieldCheckIcon, ClockCircleIcon, BuildingIcon, BackArrowIcon } from '@/components/ui/Icons';
import { InfoAlert } from '@/components/ui/InfoAlert';
import { useDocStore } from '@/store/docStore';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';
import { SelectOptionsModal } from '@/components/common/SelectOptionsModal';

const DOCUMENT_TYPES = [
  { label: 'Aadhaar Card', value: 'Aadhaar Card' },
  { label: 'PAN Card', value: 'PAN Card' },
  { label: 'Voter ID', value: 'Voter ID' },
  { label: 'Passport', value: 'Passport' },
  { label: 'Driving License', value: 'Driving License' }
];

const BIZ_DOCUMENT_TYPES = [
  { label: 'Business License', value: 'Business License' },
  { label: 'GST Registration Certificate', value: 'GST Registration Certificate' },
  { label: 'Certificate of Incorporation', value: 'Certificate of Incorporation' },
  { label: 'Partnership Deed', value: 'Partnership Deed' }
];

export default function DocumentUploadScreen() {
  useAndroidBack();
  const router = useSafeRouter();
  const { flow, readonly, error } = useLocalSearchParams<{ flow: string, readonly?: string, error?: string }>();
  const isReadonly = readonly === 'true';
  const { updateDocStatus } = useDocStore();

  const isBusiness = flow === 'business';

  const [docType, setDocType] = useState(isBusiness ? 'Business License' : 'National ID Card');
  const [docNumber, setDocNumber] = useState('');
  const [bizName, setBizName] = useState(isBusiness ? 'e.g. Acme Corp' : '');
  const [docModalVisible, setDocModalVisible] = useState(false);

  const handleSubmit = async () => {
    if (isBusiness) {
      updateDocStatus('businessVerification', 'Pending');
      await StorageService.updateMandatoryFlowStep('businessDocumentUpload', 'reviewing');
      router.push('/(tabs)/services');
    } else {
      let key = 'otherDocs';
      if (docType === 'National ID Card' || docType === 'Aadhaar Card') {
        key = 'aadhaar';
      } else if (docType === 'PAN Card') {
        key = 'pan';
      } else if (docType === 'Driving License') {
        key = 'drivingLicense';
      } else if (docType === 'Police Clearance') {
        key = 'policeClearance';
      }
      updateDocStatus(key, 'Pending');
      await StorageService.updateMandatoryFlowStep('kycUpload', 'reviewing');
      router.back();
    }
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isBusiness ? 'Upload Business Document' : 'Upload KYC Document'}
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            
            {/* Top Info Section */}
            <View style={styles.topSection}>
              <View style={styles.iconWrapper}>
                {isBusiness ? (
                  <BuildingIcon size={24} color="#4338CA" />
                ) : (
                  <ShieldCheckIcon size={24} color="#4338CA" />
                )}
              </View>
              <Text style={styles.verifyTitle}>
                {isBusiness ? 'Business Verification' : 'Verify Your Identity'}
              </Text>
              <Text style={styles.verifyDesc}>
                {isBusiness 
                  ? 'Upload official business documents to verify your business profile and unlock all features.'
                  : 'Please provide your official identification document to complete your partner profile.'}
              </Text>
              <View style={styles.pendingPill}>
                <ClockCircleIcon size={14} color="#4338CA" />
                <Text style={styles.pendingPillText}>Pending Verification</Text>
              </View>
            </View>

            {error === 'true' && (
              <View style={{ marginBottom: 16 }}>
                <InfoAlert message="Your uploaded document was rejected. Please upload a clearer copy." />
              </View>
            )}

            {/* Document Info */}
            <Text style={styles.sectionTitle}>
              {isBusiness ? 'BUSINESS DETAILS' : 'DOCUMENT INFO'}
            </Text>
            
            {isBusiness && (
              <Input
                label="Business Name *"
                placeholder="e.g. Acme Corp"
                value={bizName}
                onChangeText={setBizName}
                editable={!isReadonly}
              />
            )}

            <SelectInput
              label="Document Type *"
              placeholder="Select"
              value={docType}
              onPress={() => setDocModalVisible(true)} 
              disabled={isReadonly}
            />

            <Input
              label="Document Number *"
              placeholder={isBusiness ? "e.g. BL-987654321" : "e.g. A12345678"}
              value={docNumber}
              onChangeText={setDocNumber}
              editable={!isReadonly}
            />

            {/* Document Images */}
            <Text style={[styles.sectionTitle, { marginTop: 8 }]}>DOCUMENT IMAGES</Text>
            <Text style={styles.sectionDesc}>
              {isBusiness 
                ? 'Please provide clear images of your official business documents.' 
                : 'Ensure all text is clearly visible and there is no glare.'}
            </Text>

            <Text style={styles.uploadLabel}>{isBusiness ? 'Front Image' : 'Front Side'}</Text>
            <ImageUploadCard 
              label={isReadonly ? "Uploaded" : "Tap to upload"}
              subLabel={isReadonly ? "" : "PNG, JPG up to 5MB"}
              onPress={() => router.push('/(dashboard)/coming-soon')}
              style={styles.uploadCard}
            />

            <Text style={styles.uploadLabel}>{isBusiness ? 'Back Image' : 'Back Side'}</Text>
            <ImageUploadCard 
              label={isReadonly ? "Uploaded" : "Tap to upload"}
              subLabel={isReadonly ? "" : "PNG, JPG up to 5MB"}
              onPress={() => router.push('/(dashboard)/coming-soon')}
              style={styles.uploadCard}
            />

            {!isReadonly && (
              <Button 
                title={isBusiness ? "Submit Documents" : "Submit for Verification"} 
                onPress={handleSubmit} 
                variant="primary" 
                style={styles.submitBtn} 
              />
            )}

          </View>
        </ScrollView>
      <SelectOptionsModal
        visible={docModalVisible}
        onClose={() => setDocModalVisible(false)}
        title="Select Document Type"
        options={isBusiness ? BIZ_DOCUMENT_TYPES : DOCUMENT_TYPES}
        onSelect={(value) => setDocType(value)}
      />
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
    
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A', // Changed to dark color for contrast against gradient
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginTop: 12,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF', // light indigo
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
