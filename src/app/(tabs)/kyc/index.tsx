import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { TimelineTracker } from '@/components/ui/TimelineTracker';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BackArrowIcon, BadgeCheckIcon, DocumentIcon, EyeIcon, UploadIcon } from '@/components/ui/Icons';
import { useDocStore } from '@/store/docStore';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import Svg, { Path } from 'react-native-svg';

const CloseXIcon = ({ size = 24, color = '#0F172A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const DOC_INFO: Record<string, { number: string; verifiedDate: string; frontLabel: string; backLabel: string }> = {
  'Aadhaar Card': {
    number: '86293424XXXX',
    verifiedDate: 'Verified on 15 Oct 2024',
    frontLabel: 'Front Aadhaar Card Image',
    backLabel: 'Back Aadhaar Card Image',
  },
  'PAN Card': {
    number: 'ABCDE1234F',
    verifiedDate: 'Verified on 12 Oct 2024',
    frontLabel: 'PAN Card Image',
    backLabel: '',
  },
  'Police Clearance': {
    number: 'PC/2024/78901',
    verifiedDate: 'Pending verification',
    frontLabel: 'Police Clearance Certificate',
    backLabel: '',
  },
  'Driving License (DL)': {
    number: 'DL-1420110012345',
    verifiedDate: 'Rejected — Please re-upload',
    frontLabel: 'Front Driving License Image',
    backLabel: 'Back Driving License Image',
  },
  'Other Documents': {
    number: '—',
    verifiedDate: 'Not uploaded',
    frontLabel: 'Other Document Image',
    backLabel: '',
  },
};

interface DocumentCardProps {
  title: string;
  status: string;
  onViewPress: () => void;
  onActionPress: () => void;
}

function DocumentCard({ title, status, onViewPress, onActionPress }: DocumentCardProps) {
  const statusUpper = status.toUpperCase();
  const isRejected = statusUpper === 'REJECTED';
  const isNotUploaded = statusUpper === 'NOT UPLOADED';
  const isApproved = statusUpper === 'APPROVED';
  const needsAction = isRejected || isNotUploaded;

  const iconBg = isApproved ? '#DCFCE7' : isRejected ? '#FEE2E2' : '#EEF2FF';
  const iconColor = isApproved ? '#22C55E' : isRejected ? '#EF4444' : '#4338CA';

  return (
    <View style={styles.docGroup}>
      <View style={styles.docCard}>
        <View style={styles.docCardTop}>
          <View style={[styles.docIconWrapper, { backgroundColor: iconBg }]}>
            <DocumentIcon size={20} color={iconColor} />
          </View>
          <View style={styles.docInfo}>
            <Text style={styles.docTitle}>{title}</Text>
            <StatusBadge status={status} variant="pill" style={{ alignSelf: 'flex-start', marginTop: 4 }} />
          </View>
        </View>
        {isApproved && (
          <>
            <View style={styles.docCardDivider} />
            <TouchableOpacity style={styles.viewDocBtn} onPress={onViewPress} activeOpacity={0.7}>
              <EyeIcon size={15} color="#4338CA" />
              <Text style={styles.viewDocText}>View Document</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      {needsAction && (
        <TouchableOpacity style={styles.actionBtn} onPress={onActionPress} activeOpacity={0.8}>
          <UploadIcon size={16} color="#FFFFFF" />
          <Text style={styles.actionBtnText}>
            {isRejected ? 'Re-upload' : 'Upload'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function KycDocumentCenter() {
  useAndroidBack();
  const router = useSafeRouter();
  const { aadhaarStatus, panStatus, policeClearanceStatus, drivingLicenseStatus, otherDocsStatus } = useDocStore();
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  const getDocStatus = (docTitle: string) => {
    switch (docTitle) {
      case 'Aadhaar Card': return aadhaarStatus;
      case 'PAN Card': return panStatus;
      case 'Police Clearance': return policeClearanceStatus;
      case 'Driving License (DL)': return drivingLicenseStatus;
      case 'Other Documents': return otherDocsStatus;
      default: return 'Not uploaded';
    }
  };

  const requiredStatuses = [aadhaarStatus, panStatus, policeClearanceStatus, drivingLicenseStatus];
  const allApproved = requiredStatuses.every(s => s.toUpperCase() === 'APPROVED');
  const anySubmitted = requiredStatuses.some(s => s.toUpperCase() !== 'NOT UPLOADED');
  const anyPending = requiredStatuses.some(s => s.toUpperCase() === 'PENDING');

  const step2State = anyPending ? 'active' : anySubmitted ? 'completed' : 'pending';
  const step3State = allApproved ? 'completed' : 'pending';

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>KYC Documents</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Timeline */}
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

          {/* Congratulations card — only when all approved */}
          {allApproved && (
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
          )}

          {/* Documents white panel */}
          <View style={styles.documentsPanel}>
            <Text style={styles.infoText}>
              Manage your uploaded documents below. Ensure all required documents are approved to start receiving bookings.
            </Text>

            <DocumentCard
              title="Aadhaar Card"
              status={aadhaarStatus}
              onViewPress={() => setSelectedDoc('Aadhaar Card')}
              onActionPress={() => router.push(`/(tabs)/upload?flow=kyc&doc=${encodeURIComponent('Aadhaar Card')}`)}
            />
            <DocumentCard
              title="PAN Card"
              status={panStatus}
              onViewPress={() => setSelectedDoc('PAN Card')}
              onActionPress={() => router.push(`/(tabs)/upload?flow=kyc&doc=${encodeURIComponent('PAN Card')}`)}
            />
            <DocumentCard
              title="Police Clearance"
              status={policeClearanceStatus}
              onViewPress={() => setSelectedDoc('Police Clearance')}
              onActionPress={() => router.push(`/(tabs)/upload?flow=kyc&doc=${encodeURIComponent('Police Clearance')}`)}
            />
            <DocumentCard
              title="Driving License (DL)"
              status={drivingLicenseStatus}
              onViewPress={() => setSelectedDoc('Driving License (DL)')}
              onActionPress={() => router.push(`/(tabs)/upload?flow=kyc&doc=${encodeURIComponent('Driving License (DL)')}`)}
            />
            <DocumentCard
              title="Other Documents"
              status={otherDocsStatus}
              onViewPress={() => setSelectedDoc('Other Documents')}
              onActionPress={() => router.push(`/(tabs)/upload?flow=kyc&doc=${encodeURIComponent('Other Documents')}`)}
            />
          </View>

        </ScrollView>
      </SafeAreaView>

      {/* Document Preview Modal */}
      <Modal
        visible={!!selectedDoc}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedDoc(null)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFillObject} activeOpacity={1} onPress={() => setSelectedDoc(null)} />
          <View style={styles.modalContent}>
            {selectedDoc && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedDoc}</Text>
                  <TouchableOpacity onPress={() => setSelectedDoc(null)} style={styles.closeBtn}>
                    <CloseXIcon size={22} color="#0F172A" />
                  </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
                  <View style={{ alignSelf: 'flex-start', marginBottom: 16 }}>
                    <StatusBadge status={getDocStatus(selectedDoc)} variant="pill" />
                  </View>
                  {DOC_INFO[selectedDoc]?.number && DOC_INFO[selectedDoc].number !== '—' && (
                    <View style={styles.numberBox}>
                      <View style={styles.numberBoxAccent} />
                      <Text style={styles.numberText}>{DOC_INFO[selectedDoc].number}</Text>
                    </View>
                  )}
                  <Text style={styles.verifiedDateText}>{DOC_INFO[selectedDoc]?.verifiedDate}</Text>
                  {DOC_INFO[selectedDoc]?.frontLabel && (
                    <View style={styles.imageSection}>
                      <Text style={styles.imageLabel}>{DOC_INFO[selectedDoc].frontLabel}</Text>
                      <View style={styles.imageBox}>
                        <View style={styles.placeholderImg}>
                          <Text style={styles.placeholderText}>FRONT IMAGE</Text>
                        </View>
                      </View>
                    </View>
                  )}
                  {DOC_INFO[selectedDoc]?.backLabel ? (
                    <View style={styles.imageSection}>
                      <Text style={styles.imageLabel}>{DOC_INFO[selectedDoc].backLabel}</Text>
                      <View style={styles.imageBox}>
                        <View style={styles.placeholderImg}>
                          <Text style={styles.placeholderText}>BACK IMAGE</Text>
                        </View>
                      </View>
                    </View>
                  ) : null}
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

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

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  closeBtn: { padding: 4 },
  modalScroll: { paddingBottom: 16 },
  numberBox: {
    flexDirection: 'row',
    width: '100%',
    height: 48,
    borderWidth: 1.5,
    borderColor: '#0F172A',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    marginBottom: 12,
  },
  numberBoxAccent: {
    width: 12,
    height: '100%',
    backgroundColor: '#1A0FA3',
  },
  numberText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 2,
    marginRight: 12,
  },
  verifiedDateText: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 20,
  },
  imageSection: { marginBottom: 20 },
  imageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  imageBox: {
    width: '100%',
    height: 180,
    borderWidth: 2,
    borderColor: 'rgba(26, 15, 163, 0.12)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  placeholderImg: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#94A3B8',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1.5,
  },
});

