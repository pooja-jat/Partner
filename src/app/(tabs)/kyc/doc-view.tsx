import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import { useDocStore } from '@/store/docStore';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import Svg, { Path } from 'react-native-svg';

const CheckIcon = () => (
  <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
    <Path d="M5 13l4 4L19 7" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const DOC_NUMBERS: Record<string, string> = {
  'Aadhaar Card': '86293424XXXX',
  'PAN Card': 'ABCDE1234F',
  'Police Clearance': 'PC/2024/78901',
  'Driving License (DL)': 'DL-1420110012345',
  'Other Documents': '—',
};

const URI_KEY_MAP: Record<string, keyof ReturnType<typeof useDocStore.getState>> = {
  'Aadhaar Card': 'aadhaarUri',
  'PAN Card': 'panUri',
  'Police Clearance': 'policeClearanceUri',
  'Driving License (DL)': 'drivingLicenseUri',
  'Other Documents': 'otherDocsUri',
};

export default function DocViewScreen() {
  useAndroidBack();
  const router = useSafeRouter();
  const { title } = useLocalSearchParams<{ title: string }>();
  const store = useDocStore();

  const uriKey = title ? URI_KEY_MAP[title] : null;
  const uploadedUri = uriKey ? (store[uriKey] as string | null) : null;
  const docNumber = title ? (DOC_NUMBERS[title] || '—') : '—';

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Card 1 — verified info */}
          <View style={styles.verifiedCard}>
            <View style={styles.verifiedIconCircle}>
              <CheckIcon />
            </View>
            <Text style={styles.verifiedCardTitle}>Your {title} is verified</Text>
            <View style={styles.docNumberBox}>
              <View style={styles.docNumberAccent} />
              <Text style={styles.docNumberText} numberOfLines={1}>{docNumber}</Text>
            </View>
            <Text style={styles.verifiedOnText}>Verified on</Text>
          </View>

          {/* Card 2 — Front image */}
          <View style={styles.imageCard}>
            <Text style={styles.imgLabel}>Front {title} Image</Text>
            <View style={styles.imgBox}>
              {uploadedUri ? (
                <Image source={{ uri: uploadedUri }} style={styles.docImage} resizeMode="cover" />
              ) : (
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderText}>FRONT</Text>
                </View>
              )}
            </View>
          </View>

          {/* Card 3 — Back image */}
          <View style={styles.imageCard}>
            <Text style={styles.imgLabel}>Back {title} Image</Text>
            <View style={styles.imgBox}>
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>BACK</Text>
              </View>
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
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
  backButton: { marginRight: 12 },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  verifiedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    alignItems: 'center',
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  imageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  verifiedIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  verifiedCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 18,
  },
  docNumberBox: {
    flexDirection: 'row',
    width: '100%',
    height: 36,
    borderWidth: 1.5,
    borderColor: '#0F172A',
    borderRadius: 6,
    overflow: 'hidden',
    alignItems: 'center',
    marginBottom: 8,
  },
  docNumberAccent: {
    width: 8,
    height: '100%',
    backgroundColor: '#1A0FA3',
  },
  docNumberText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 1,
  },
  verifiedOnText: {
    fontSize: 11,
    color: '#22C55E',
    fontWeight: '600',
    marginBottom: 14,
  },
  viewCardBtn: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#4338CA',
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: 'center',
  },
  viewCardBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4338CA',
  },

  imgLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  imgBox: {
    width: '100%',
    height: 180,
    borderWidth: 1.5,
    borderColor: 'rgba(26, 15, 163, 0.12)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  docImage: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#94A3B8',
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 1.5,
  },
});
