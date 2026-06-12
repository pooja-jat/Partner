import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { TimelineTracker } from '@/components/ui/TimelineTracker';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BackArrowIcon, BadgeCheckIcon, DocumentIcon, EyeIcon, UploadIcon } from '@/components/ui/Icons';
import { useDocStore } from '@/store/docStore';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';

type DocKey = 'aadhaar' | 'pan' | 'policeClearance' | 'drivingLicense' | 'otherDocs';

interface DocConfig {
  title: string;
  key: DocKey;
  statusKey: keyof ReturnType<typeof useDocStore.getState>;
  uriKey: keyof ReturnType<typeof useDocStore.getState>;
}

const DOCS: DocConfig[] = [
  { title: 'Aadhaar Card',        key: 'aadhaar',         statusKey: 'aadhaarStatus',         uriKey: 'aadhaarUri' },
  { title: 'PAN Card',            key: 'pan',             statusKey: 'panStatus',             uriKey: 'panUri' },
  { title: 'Police Clearance',    key: 'policeClearance', statusKey: 'policeClearanceStatus', uriKey: 'policeClearanceUri' },
  { title: 'Driving License (DL)',key: 'drivingLicense',  statusKey: 'drivingLicenseStatus',  uriKey: 'drivingLicenseUri' },
  { title: 'Other Documents',     key: 'otherDocs',       statusKey: 'otherDocsStatus',       uriKey: 'otherDocsUri' },
];

interface DocumentCardProps {
  title: string;
  status: string;
  uploadedUri: string | null;
  onViewPress: () => void;
  onUploadPress: () => void;
}

function DocumentCard({ title, status, uploadedUri, onViewPress, onUploadPress }: DocumentCardProps) {
  const statusUpper = status.toUpperCase();
  const isRejected = statusUpper === 'REJECTED';
  const isNotUploaded = statusUpper === 'NOT UPLOADED';
  const isApproved = statusUpper === 'APPROVED';
  const hasUploaded = !!uploadedUri;

  const iconBg = isApproved ? '#DCFCE7' : isRejected ? '#FEE2E2' : '#EEF2FF';
  const iconColor = isApproved ? '#22C55E' : isRejected ? '#EF4444' : '#4338CA';

  const showUploadBtn = isNotUploaded || isRejected;
  const showViewBtn = hasUploaded || isApproved;

  return (
    <View style={styles.docGroup}>
      <View style={styles.docCard}>
        <View style={styles.docCardTop}>
          <View style={[styles.docIconWrapper, { backgroundColor: iconBg }]}>
            <DocumentIcon size={20} color={iconColor} />
          </View>
          <View style={styles.docInfo}>
            <Text style={styles.docTitle}>{title}</Text>
            {isApproved && (
              <StatusBadge status="Approved" variant="pill" style={{ alignSelf: 'flex-start', marginTop: 4 }} />
            )}
          </View>
        </View>
        {showViewBtn && (
          <>
            <View style={styles.docCardDivider} />
            <TouchableOpacity style={styles.viewDocBtn} onPress={onViewPress} activeOpacity={0.7}>
              <EyeIcon size={15} color="#4338CA" />
              <Text style={styles.viewDocText}>View Document</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      {showUploadBtn && (
        <TouchableOpacity style={styles.actionBtn} onPress={onUploadPress} activeOpacity={0.8}>
          <UploadIcon size={16} color="#FFFFFF" />
          <Text style={styles.actionBtnText}>
            {isRejected ? 'Re-upload' : 'Upload'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

interface BiometricCardProps {
  title: string;
  subtitle: string;
  status: string;
  onUploadPress: () => void;
}

function BiometricCard({ title, subtitle, status, onUploadPress }: BiometricCardProps) {
  const statusUpper = status.toUpperCase();
  const isNotUploaded = statusUpper === 'NOT UPLOADED';
  const isPending = statusUpper === 'PENDING';
  const isApproved = statusUpper === 'APPROVED';

  const iconBg = isApproved ? '#DCFCE7' : isPending ? '#FEF9C3' : '#EEF2FF';
  const iconColor = isApproved ? '#22C55E' : isPending ? '#CA8A04' : '#4338CA';

  return (
    <View style={styles.docGroup}>
      <View style={styles.docCard}>
        <View style={styles.docCardTop}>
          <View style={[styles.docIconWrapper, { backgroundColor: iconBg }]}>
            <DocumentIcon size={20} color={iconColor} />
          </View>
          <View style={styles.docInfo}>
            <Text style={styles.docTitle}>{title}</Text>
            <Text style={styles.docSubtitle}>{subtitle}</Text>
            {!isNotUploaded && (
              <StatusBadge status={status} variant="pill" style={{ alignSelf: 'flex-start', marginTop: 4 }} />
            )}
          </View>
        </View>
      </View>
      {isNotUploaded && (
        <TouchableOpacity style={styles.actionBtn} onPress={onUploadPress} activeOpacity={0.8}>
          <UploadIcon size={16} color="#FFFFFF" />
          <Text style={styles.actionBtnText}>Upload</Text>
        </TouchableOpacity>
      )}
      {isPending && (
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#CA8A04' }]} onPress={onUploadPress} activeOpacity={0.8}>
          <UploadIcon size={16} color="#FFFFFF" />
          <Text style={styles.actionBtnText}>Re-capture</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function KycDocumentCenter() {
  useAndroidBack();
  const router = useSafeRouter();
  const store = useDocStore();
  const { aadhaarStatus, panStatus, policeClearanceStatus, drivingLicenseStatus, selfieStatus, videoKycStatus } = store;

  const handleNext = async () => {
    await StorageService.updateMandatoryFlowStep('kycUpload', 'reviewing');
    const session = await StorageService.getUserSession();
    const role = session?.role;
    if (role === 'BSP' || role === 'BS') {
      router.replace('/(auth)/business-profile' as any);
    } else {
      router.replace('/(tabs)' as any);
    }
  };

  const getStatus = (cfg: DocConfig): string => store[cfg.statusKey] as string;
  const getUri = (cfg: DocConfig): string | null => store[cfg.uriKey] as string | null;

  const requiredStatuses = [aadhaarStatus, panStatus, policeClearanceStatus, drivingLicenseStatus];
  const allApproved = requiredStatuses.every(s => s.toUpperCase() === 'APPROVED');
  const anySubmitted = requiredStatuses.some(s => s.toUpperCase() !== 'NOT UPLOADED');
  const anyPending = requiredStatuses.some(s => s.toUpperCase() === 'PENDING');

  const step2State = anyPending ? 'active' : anySubmitted ? 'completed' : 'pending';
  const step3State = allApproved ? 'completed' : 'pending';

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>KYC Documents</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          <View style={styles.timelineWrapper}>
            <TimelineTracker
              theme="light"
              steps={[
                { id: '1', label: 'Details Submitted', subLabel: 'Completed', state: 'completed' },
                { id: '2', label: 'Under Review', subLabel: anyPending ? 'In Progress' : anySubmitted ? 'Completed' : 'Pending', state: step2State },
                { id: '3', label: 'Approved', subLabel: allApproved ? 'Completed' : 'Pending', state: step3State },
              ]}
            />
          </View>

          <View style={styles.congratsCard}>
            <View style={styles.congratsIconWrapper}>
              <BadgeCheckIcon size={44} color="#1A0FA3" />
            </View>
            <View style={styles.congratsTextWrapper}>
              <Text style={styles.congratsTitle}>Congratulations</Text>
              <Text style={styles.congratsSubtitle}>Your KYC is approved!</Text>
              <Text style={styles.congratsDesc}>
                You can now get rewards by sharing your referral code with your friends.
              </Text>
            </View>
          </View>

          <View style={styles.documentsPanel}>
            <Text style={styles.infoText}>
              Manage your uploaded documents below. Ensure all required documents are approved to start receiving bookings.
            </Text>

            {DOCS.map(cfg => (
              <DocumentCard
                key={cfg.key}
                title={cfg.title}
                status={getStatus(cfg)}
                uploadedUri={getUri(cfg)}
                onViewPress={() => router.push(`/(tabs)/kyc/doc-view?title=${encodeURIComponent(cfg.title)}` as any)}
                onUploadPress={() => router.push(`/(tabs)/upload?flow=kyc&doc=${encodeURIComponent(cfg.title)}` as any)}
              />
            ))}

            <BiometricCard
              title="Selfie Verification"
              subtitle="Take a live selfie to verify your identity"
              status={selfieStatus}
              onUploadPress={() => router.push('/(tabs)/kyc/verify?type=selfie' as any)}
            />
            <BiometricCard
              title="Video KYC"
              subtitle="Record a short video for identity verification"
              status={videoKycStatus}
              onUploadPress={() => router.push('/(tabs)/kyc/verify?type=video' as any)}
            />
          </View>

          <TouchableOpacity
            style={styles.nextBtn}
            activeOpacity={0.85}
            onPress={handleNext}
          >
            <Text style={styles.nextBtnText}>Next</Text>
          </TouchableOpacity>

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

  scrollContent: { paddingBottom: 40 },

  timelineWrapper: {
    paddingVertical: 12,
    marginBottom: 12,
  },

  congratsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  congratsIconWrapper: { marginRight: 14 },
  congratsTextWrapper: { flex: 1 },
  congratsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  congratsSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4338CA',
    marginBottom: 4,
  },
  congratsDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },

  documentsPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
  },
  infoText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 19,
    marginBottom: 20,
  },

  docGroup: { marginBottom: 14 },
  docCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  docCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  docIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  docInfo: { flex: 1 },
  docTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  docSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  docCardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  viewDocBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    gap: 6,
  },
  viewDocText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4338CA',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A0FA3',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 8,
    gap: 8,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },


  nextBtn: {
    backgroundColor: '#1A0FA3',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
