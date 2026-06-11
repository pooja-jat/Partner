import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, KeyboardAvoidingView, Alert } from 'react-native';
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
import * as ImagePicker from 'expo-image-picker';

const DOCUMENT_TYPES = [
  { label: 'Aadhaar Card', value: 'Aadhaar Card' },
  { label: 'PAN Card', value: 'PAN Card' },
  { label: 'Voter ID', value: 'Voter ID' },
  { label: 'Passport', value: 'Passport' },
  { label: 'Driving License', value: 'Driving License' }
];

export default function UploadKycDocument() {
  const router = useSafeRouter();
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const session = await StorageService.getUserSession();
      if (session?.isApproved) {
        setIsApproved(true);
      }
      const kyc = await StorageService.getKycStatus();
      if (kyc && kyc.documents && kyc.documents.length > 0) {
        setDocType(kyc.documents[0].type || 'National ID Card');
        setDocNumber(kyc.documents[0].number || '');
      }
    };
    loadData();
  }, []);

  useAndroidBack(() => {
    if (isApproved) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  });

  const [docType, setDocType] = useState('National ID Card');
  const [docNumber, setDocNumber] = useState('');
  const [docModalVisible, setDocModalVisible] = useState(false);
  const [uploadedFront, setUploadedFront] = useState<string | null>(null);
  const [uploadedBack, setUploadedBack] = useState<string | null>(null);
  const [uploadedSelfie, setUploadedSelfie] = useState<string | null>(null);
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);

  const requestPermission = async (type: 'camera' | 'gallery') => {
    if (type === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === 'granted';
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === 'granted';
    }
  };

  const handleDocumentImagePick = async (side: 'front' | 'back') => {
    const granted = await requestPermission('gallery');
    if (!granted) {
      Alert.alert('Permission Required', 'Please allow gallery access to upload document.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      if (side === 'front') setUploadedFront(result.assets[0].uri);
      else setUploadedBack(result.assets[0].uri);
    }
  };

  const handleSelfiePick = async () => {
    const granted = await requestPermission('camera');
    if (!granted) {
      Alert.alert('Permission Required', 'Please allow camera access to take a selfie.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      cameraType: ImagePicker.CameraType.front,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setUploadedSelfie(result.assets[0].uri);
    }
  };

  const handleVideoKyc = async () => {
    const granted = await requestPermission('camera');
    if (!granted) {
      Alert.alert('Permission Required', 'Please allow camera access to record video KYC.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      cameraType: ImagePicker.CameraType.front,
      videoMaxDuration: 30,
      quality: ImagePicker.UIImagePickerControllerQualityType.Medium,
    });
    if (!result.canceled) {
      setUploadedVideo(result.assets[0].uri);
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const role = useAuthStore(state => state.role);

  const handleSubmit = async () => {
    if (isApproved) {
      setIsLoading(true);
      await StorageService.setKycStatus({ status: 'verified', documents: [{ type: docType, number: docNumber }] });
      setTimeout(() => {
        setIsLoading(false);
        router.back();
      }, 1000);
    } else {
      setIsLoading(true);
      await StorageService.setKycStatus({ status: 'reviewing', documents: [{ type: docType, number: docNumber }] });
      setTimeout(async () => {
        setIsLoading(false);
        await completeStepAndNavigate('kycUpload', router, 'reviewing');
      }, 1500);
    }
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
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
            placeholder="Enter Document Number"
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
            uploaded={!!uploadedFront}
            uploadedUri={uploadedFront ?? undefined}
            onPress={() => handleDocumentImagePick('front')}
            style={[styles.uploadCard, { backgroundColor: '#FFFFFF' }]}
          />

          <Text style={styles.uploadLabel}>Back Side</Text>
          <ImageUploadCard
            label="Tap to upload"
            subLabel="PNG, JPG up to 5MB"
            uploaded={!!uploadedBack}
            uploadedUri={uploadedBack ?? undefined}
            onPress={() => handleDocumentImagePick('back')}
            style={[styles.uploadCard, { backgroundColor: '#FFFFFF' }]}
          />

          <Text style={styles.uploadLabel}>Selfie Photo</Text>
          <ImageUploadCard
            label="Tap to take photo"
            subLabel="Clear face visibility required"
            uploaded={!!uploadedSelfie}
            uploadedUri={uploadedSelfie ?? undefined}
            onPress={handleSelfiePick}
            style={[styles.uploadCard, { backgroundColor: '#FFFFFF' }]}
          />

          <Text style={styles.uploadLabel}>Video KYC</Text>
          <ImageUploadCard
            label="Tap to record video"
            subLabel="Read the script shown on screen"
            uploaded={!!uploadedVideo}
            uploadedUri={uploadedVideo ?? undefined}
            onPress={handleVideoKyc}
            style={[styles.uploadCard, { backgroundColor: '#FFFFFF' }]}
          />

          <Button 
            title={isApproved ? "Save Changes" : "Submit for Verification"} 
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
        </KeyboardAvoidingView>
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
