import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Input } from '@/components/ui/Input';
import { SelectInput } from '@/components/ui/SelectInput';
import { Button } from '@/components/ui/Button';
import { ImageUploadCard } from '@/components/ui/ImageUploadCard';
import { BuildingIcon, ClockCircleIcon, BackArrowIcon } from '@/components/ui/Icons';
import { useDocStore } from '@/store/docStore';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';
import { SelectOptionsModal } from '@/components/common/SelectOptionsModal';
import { RoleAccessGuard } from '@/components/common/RoleAccessGuard';
import { completeStepAndNavigate } from '@/utils/onboarding';

const BIZ_DOCUMENT_TYPES = [
  { label: 'Business License', value: 'Business License' },
  { label: 'GST Registration Certificate', value: 'GST Registration Certificate' },
  { label: 'Certificate of Incorporation', value: 'Certificate of Incorporation' },
  { label: 'Partnership Deed', value: 'Partnership Deed' }
];

export default function BusinessVerificationUpload() {
  const router = useSafeRouter();
  const { updateDocStatus } = useDocStore();
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    const checkApproval = async () => {
      const session = await StorageService.getUserSession();
      if (session?.isApproved) {
        setIsApproved(true);
      }
    };
    checkApproval();
  }, []);

  useAndroidBack(() => {
    if (isApproved) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  });

  const [bizName, setBizName] = useState('e.g. Acme Corp');
  const [docType, setDocType] = useState('Business License');
  const [docNumber, setDocNumber] = useState('');
  const [docModalVisible, setDocModalVisible] = useState(false);

  const handleSubmit = async () => {
    if (isApproved) {
      updateDocStatus('businessVerification', 'Pending');
      router.back();
    } else {
      // Update store state to simulate submission
      updateDocStatus('businessVerification', 'Pending');
      await completeStepAndNavigate('businessDocumentUpload', router, 'reviewing');
    }
  };

  return (
    <RoleAccessGuard allowedRoles={['BSP', 'BS']}>
      <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => {
            if (isApproved) {
              router.back();
            } else {
              router.replace('/(tabs)');
            }
          }} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Business Documents</Text>
        </View>

        <View style={styles.card}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Top Info Section */}
          <View style={styles.topSection}>
            <View style={styles.iconWrapper}>
              <BuildingIcon size={24} color="#0F172A" />
            </View>
            <Text style={styles.verifyTitle}>Business Verification</Text>
            <Text style={styles.verifyDesc}>
              Upload official business documents to verify your business profile and unlock all features.
            </Text>
            <View style={styles.pendingPill}>
              <ClockCircleIcon size={14} color="#4338CA" />
              <Text style={styles.pendingPillText}>Pending Verification</Text>
            </View>
          </View>

          {/* Business Details */}
          <Text style={styles.sectionTitle}>BUSINESS DETAILS</Text>
          
          <Input
            label="Business Name *"
            placeholder="e.g. Acme Corp"
            value={bizName}
            onChangeText={setBizName}
          />

          <SelectInput
            label="Document Type *"
            placeholder="Select"
            value={docType}
            onPress={() => setDocModalVisible(true)}
          />

          <Input
            label="Document Number *"
            placeholder="e.g. BL-987654321"
            value={docNumber}
            onChangeText={setDocNumber}
          />

          {/* Document Images */}
          <Text style={[styles.sectionTitle, { marginTop: 8 }]}>DOCUMENT IMAGES</Text>
          <Text style={styles.sectionDesc}>Please provide clear images of your official business documents.</Text>

          <Text style={styles.uploadLabel}>Front Image</Text>
          <ImageUploadCard 
            label="Tap to upload"
            subLabel="PNG, JPG up to 5MB"
            onPress={() => router.push('/(dashboard)/coming-soon')}
            style={styles.uploadCard}
          />

          <Text style={styles.uploadLabel}>Back Image</Text>
          <ImageUploadCard 
            label="Tap to upload"
            subLabel="PNG, JPG up to 5MB"
            onPress={() => router.push('/(dashboard)/coming-soon')}
            style={styles.uploadCard}
          />

          <Button 
            title={isApproved ? "Save Changes" : "Submit Documents"} 
            onPress={handleSubmit} 
            variant="primary" 
            style={styles.submitBtn} 
          />

          </ScrollView>
        </View>
          <SelectOptionsModal
            visible={docModalVisible}
            onClose={() => setDocModalVisible(false)}
            title="Select Document Type"
            options={BIZ_DOCUMENT_TYPES}
            onSelect={(value) => setDocType(value)}
          />
          </SafeAreaView>
        </GradientBackground>
    </RoleAccessGuard>
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
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9', // light slate
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
