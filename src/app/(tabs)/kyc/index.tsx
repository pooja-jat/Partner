import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Card } from '@/components/ui/Card';
import { TimelineTracker } from '@/components/ui/TimelineTracker';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { BackArrowIcon, BadgeCheckIcon, DocumentIcon, EyeIcon, UploadIcon } from '@/components/ui/Icons';
import { useDocStore } from '@/store/docStore';
import { useAndroidBack } from '@/hooks/useAndroidBack';

interface DocumentCardProps {
  title: string;
  status: string;
  onPress: () => void;
}

function DocumentCard({ title, status, onPress }: DocumentCardProps) {
  const isActionNeeded = status.toUpperCase() === 'REJECTED' || status.toUpperCase() === 'NOT UPLOADED';

  return (
    <View style={styles.docCard}>
      <View style={styles.docCardTop}>
        <View style={styles.docIconWrapper}>
          <DocumentIcon size={24} color="#4338CA" />
        </View>
        <View style={styles.docInfo}>
          <Text style={styles.docTitle}>{title}</Text>
          <StatusBadge status={status} variant="pill" style={{ alignSelf: 'flex-start', marginTop: 4 }} />
        </View>
      </View>
      <View style={styles.docCardDivider} />
      <TouchableOpacity 
        style={[styles.docActionBtn, isActionNeeded && styles.docActionBtnPrimary]} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        {isActionNeeded ? (
          <UploadIcon size={16} color="#FFFFFF" />
        ) : (
          <EyeIcon size={16} color="#0F172A" />
        )}
        <Text style={[styles.docActionText, isActionNeeded && styles.docActionTextPrimary]}>
          {isActionNeeded ? (status.toUpperCase() === 'REJECTED' ? 'Re-upload' : 'upload') : 'View Document'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function KycDocumentCenter() {
  useAndroidBack();
  const router = useSafeRouter();
  const { aadhaarStatus, panStatus, policeClearanceStatus, drivingLicenseStatus, otherDocsStatus } = useDocStore();

  const handleBack = () => {
    router.back();
  };

  const goToUpload = () => {
    router.push('/(tabs)/upload?flow=kyc');
  };

  const goToView = () => {
    router.push('/(tabs)/kyc/view');
  };

  const handleNext = () => {
    router.push('/(tabs)/business');
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Document center</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.timelineWrapper}>
            <TimelineTracker 
              theme="light"
              steps={[
                { id: '1', label: 'Details Submitted', subLabel: 'Completed', state: 'completed' },
                { id: '2', label: 'Under Review', subLabel: 'In Progress', state: 'active' },
                { id: '3', label: 'Approved', subLabel: 'Completed', state: 'pending' },
              ]} 
            />
          </View>

          {/* Congratulations Card */}
          <Card style={styles.card} variant="default">
            <View style={styles.congratsRow}>
              <View style={styles.congratsIconWrapper}>
                <BadgeCheckIcon size={48} color="rgba(26, 15, 163, 1.00)" />
              </View>
              <View style={styles.congratsTextWrapper}>
                <Text style={styles.congratsTitle}>Congratulations</Text>
                <Text style={styles.congratsSubtitle}>Your KYC is approved</Text>
                <Text style={styles.congratsDesc}>
                  You can now get rewards by sharing your referral code with your friends.
                </Text>
              </View>
            </View>
          </Card>

          <View style={styles.documentsContainer}>
            <Text style={styles.infoText}>
              Manage your uploaded documents below. Ensure all required documents are approved to start receiving bookings.
            </Text>

            <DocumentCard title="Aadhaar Card" status={aadhaarStatus} onPress={goToView} />
            <DocumentCard title="PAN Card" status={panStatus} onPress={() => router.push('/(dashboard)/coming-soon')} />
            <DocumentCard title="Police Clearance" status={policeClearanceStatus} onPress={() => router.push('/(dashboard)/coming-soon')} />
            <DocumentCard title="Driving License (DL)" status={drivingLicenseStatus} onPress={goToUpload} />
            <DocumentCard title="Other Documents" status={otherDocsStatus} onPress={goToUpload} />
          </View>
          
          <Button 
            title="Next" 
            onPress={handleNext} 
            variant="primary" 
            style={{ marginHorizontal: 20, marginTop: 16 }} 
          />

        </ScrollView>
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
    paddingVertical: 16,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  timelineWrapper: {
    width: '100%',
    paddingVertical: 16,
    marginBottom: 8,
  },
  card: {
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
  },
  congratsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  congratsIconWrapper: {
    marginRight: 16,
  },
  congratsTextWrapper: {
    flex: 1,
  },
  congratsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  congratsSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4338CA', // Indigo
    marginBottom: 4,
  },
  congratsDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },
  documentsContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    minHeight: 500,
  },
  infoText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 24,
  },
  docCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9', // very light slate
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 1,
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)',
  },
  docCardTop: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  docIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF', // light indigo
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  docInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  docTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  docCardDivider: {
    height: 1,
    backgroundColor: '#F8FAFC',
  },
  docActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#F8FAFC', // light grey for view
  },
  docActionBtnPrimary: {
    backgroundColor: 'rgba(26, 15, 163, 1.00)', // dark blue for upload
  },
  docActionText: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  docActionTextPrimary: {
    color: '#FFFFFF',
  },
});
