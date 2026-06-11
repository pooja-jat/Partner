import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { BackArrowIcon } from '@/components/ui/Icons';
import { ImageUploadCard } from '@/components/ui/ImageUploadCard';
import { COLORS } from '@/constants';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';
import { RoleAccessGuard } from '@/components/common/RoleAccessGuard';
import { completeStepAndNavigate } from '@/utils/onboarding';

export default function BusinessProfileScreen() {
  const router = useSafeRouter();
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

  const [form, setForm] = useState({
    businessName: '',
    gstNumber: '',
    businessPan: '',
  });

  const updateForm = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleBack = () => {
    if (isApproved) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const [uploadedDoc, setUploadedDoc] = useState(false);

  const handleDocumentPick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow gallery access to upload document.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setUploadedDoc(true);
    }
  };

  const handleSave = async () => {
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
        <View style={styles.topSection}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Business Profile</Text>
        </View>

        <Card style={styles.card} variant="default">
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            <Text style={styles.sectionTitle}>Business Details</Text>
            <View style={styles.divider} />

            <Input
              label="Business Name"
              required={true}
              placeholder="Enter Business Name"
              value={form.businessName}
              onChangeText={(t) => updateForm('businessName', t)}
            />

            <Input
              label="GST Number"
              required={true}
              placeholder="Enter GST Number "
              value={form.gstNumber}
              onChangeText={(t) => updateForm('gstNumber', t)}
            />

            <Input
              label="Business PAN"
              required={true}
              placeholder="Enter Business PAN"
              value={form.businessPan}
              onChangeText={(t) => updateForm('businessPan', t)}
            />

            <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Business Documents</Text>
            <View style={styles.divider} />

            <Text style={styles.uploadLabel}>Business Registration Document</Text>
            <ImageUploadCard
              label="Tap to upload"
              subLabel="PNG, JPG up to 5MB"
              uploaded={uploadedDoc}
              dummyImage={require('@/assets/dummy/aadhaar-front.png')}
              onPress={handleDocumentPick}
              style={[styles.uploadCard, { backgroundColor: '#FFFFFF' }]}
            />

            <Button
              title={isApproved ? "Save Changes" : "Save and Continue"}
              onPress={handleSave}
              variant="primary"
              style={styles.saveBtn}
            />

          </ScrollView>
        </Card>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
    </RoleAccessGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    
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
    width:'91%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginHorizontal: 16,
    marginBottom: 16,
    boxShadow: '0px -2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
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
  uploadLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
  },
  uploadCard: {
    marginBottom: 16,
  },
  saveBtn: {
    marginTop: 12,
  },
});
