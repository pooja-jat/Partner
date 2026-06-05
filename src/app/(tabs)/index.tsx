import { useSafeRouter } from '@/hooks/useSafeRouter';
import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {  useFocusEffect } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Card } from '@/components/ui/Card';
import { TimelineTracker } from '@/components/ui/TimelineTracker';
import { FlowListItem } from '@/components/ui/FlowListItem';
import { InfoAlert } from '@/components/ui/InfoAlert';
import { Button } from '@/components/ui/Button';
import { 
  BackArrowIcon, CongratsBadgeIcon,
  VerifiedIcon, ReviewingIcon, PendingYellowIcon, RejectedIcon 
} from '@/components/ui/Icons';
import { useAuthStore } from '@/store/authStore';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';
import { MandatoryFlow, UserSession, FlowStatus } from '@/types/storage.types';

const getIconForStatus = (status: FlowStatus) => {
  switch (status) {
    case 'verified':
    case 'completed':
      return <VerifiedIcon size={24} color="#22C55E" />;
    case 'rejected':
      return <RejectedIcon size={24} color="#EF4444" />;
    case 'reviewing':
      return <PendingYellowIcon size={24} color="#EAB308" />;
    default:
      return <ReviewingIcon size={24} color="#3B82F6" />;
  }
};

const ALL_FLOW_STEPS = [
  { key: 'partnerProfile', title: 'Partner Profile', subtitle: 'Verified on Oct 24', route: '/(auth)/create-profile' },
  { key: 'businessProfile', title: 'Business Profile', subtitle: 'In review', route: '/(auth)/business-profile' },
  { key: 'kycUpload', title: 'KYC Document Upload', subtitle: 'In review', route: '/(tabs)/kyc/upload' },
  { key: 'businessDocumentUpload', title: 'Business Document Upload', subtitle: 'Processing (2-3 days)', route: '/(tabs)/business/upload' },
  { key: 'branchCreation', title: 'Branch Creation', subtitle: 'Processing (2-3 days)', route: '/(tabs)/branch' },
  { key: 'partnerServiceSelection', title: 'Partner Service Selection', subtitle: 'Processing (2-3 days)', route: '/(tabs)/services' },
  { key: 'serviceBranchMapping', title: 'Service Branch Mapping', subtitle: 'Processing (2-3 days)', route: '/(tabs)/mapping' },
  { key: 'branchEmployeeMapping', title: 'Branch Employee Mapping', subtitle: 'Processing (2-3 days)', route: '/(tabs)/employee' },
  { key: 'addingEmployee', title: 'Adding Employee', subtitle: 'Processing (2-3 days)', route: '/(tabs)/add-employee' },
  { key: 'partnerServiceAreaCreation', title: 'Partner service area creation', subtitle: 'Processing (2-3 days)', route: '/(tabs)/service-area' },
  { key: 'termsAndConditions', title: 'Terms and Conditions', subtitle: 'Processing (2-3 days)', route: '/(tabs)/terms' },
  { key: 'policies', title: 'Policies', subtitle: 'Processing (2-3 days)', route: '/(tabs)/policies' },
] as const;

export default function ApplicationApprovalScreen() {
  useAndroidBack(() => {
    BackHandler.exitApp();
  });
  const router = useSafeRouter();
  const { mobileNumber } = useAuthStore();
  
  const [session, setSession] = useState<UserSession | null>(null);
  const [flowState, setFlowState] = useState<MandatoryFlow | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadState = async () => {
        const s = await StorageService.getUserSession();
        const f = await StorageService.getMandatoryFlow();
        setSession(s);
        setFlowState(f);
      };
      loadState();
    }, [])
  );

  const handleBack = () => {
    // optional back action
  };

  const handleApprove = async () => {
    if (session) {
      await StorageService.updateUserSession({ isApproved: true });
      router.replace('/(dashboard)');
    }
  };

  const handleRowPress = (route: string, status: FlowStatus) => {
    let params: any = {};
    if (status === 'rejected') {
      params.error = 'true';
    } else if (status === 'verified' || status === 'completed') {
      params.readonly = 'true';
    }

    if (route === '/(auth)/create-profile') {
      params.mode = 'view';
    }

    if (Object.keys(params).length > 0) {
      router.push({ pathname: route as any, params });
    } else {
      router.push(route as any);
    }
  };

  const role = session?.role;

  const flowSteps = useMemo(() => {
    if (!role) return [];
    const keys: string[] = [];
    if (role === 'ISP') {
      keys.push('partnerProfile', 'kycUpload', 'partnerServiceSelection', 'partnerServiceAreaCreation', 'termsAndConditions', 'policies');
    } else if (role === 'BSP') {
      keys.push('partnerProfile', 'businessProfile', 'kycUpload', 'businessDocumentUpload', 'branchCreation', 'partnerServiceSelection', 'serviceBranchMapping', 'branchEmployeeMapping', 'addingEmployee', 'partnerServiceAreaCreation', 'termsAndConditions', 'policies');
    } else if (role === 'BS') {
      keys.push('partnerProfile', 'businessProfile', 'kycUpload', 'businessDocumentUpload', 'branchCreation', 'partnerServiceAreaCreation', 'termsAndConditions', 'policies');
    }
    return ALL_FLOW_STEPS.filter(step => keys.includes(step.key));
  }, [role]);

  const isAllApproved = useMemo(() => {
    if (!flowState || flowSteps.length === 0) return false;
    const statuses = flowSteps.map(step => flowState[step.key as keyof MandatoryFlow]);
    return statuses.every(s => s === 'verified' || s === 'completed');
  }, [flowState, flowSteps]);

  if (!flowState) {
    return null;
  }

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Application</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Top Blue Status Card */}
          <View style={styles.blueCard}>
            <View style={styles.clockIconWrapper}>
              {isAllApproved ? (
                <VerifiedIcon size={24} color="#FFFFFF" />
              ) : (
                <ReviewingIcon size={24} color="#FFFFFF" />
              )}
            </View>
            <Text style={styles.blueCardTitle}>
              {isAllApproved ? 'Application Approved' : 'Application Under Review'}
            </Text>
            <Text style={styles.blueCardText}>
              {isAllApproved 
                ? 'Your application has been fully approved. You can now accept bookings.'
                : 'We have received your details and documents. Our team is currently reviewing your application.'}
            </Text>
            
            <View style={styles.timelineWrapper}>
              <TimelineTracker 
                theme="dark"
                steps={[
                  { id: '1', label: 'SUBMITTED', state: 'completed' },
                  { id: '2', label: 'REVIEWING', state: isAllApproved ? 'completed' : 'active' },
                  { id: '3', label: 'APPROVED', state: isAllApproved ? 'completed' : 'pending' },
                ]} 
              />
            </View>
          </View>

          {/* Congratulations Card */}
          {isAllApproved && (
            <Card style={styles.card} variant="default">
              <View style={styles.congratsRow}>
                <View style={styles.congratsIconWrapper}>
                  <CongratsBadgeIcon size={64} />
                </View>
                <View style={styles.congratsTextWrapper}>
                  <Text style={styles.congratsTitle}>Congratulations</Text>
                  <Text style={styles.congratsSubtitle}>Your profile is approved</Text>
                  <Text style={styles.congratsDesc}>
                    You can now get rewards by sharing your referral code with your friends.
                  </Text>
                </View>
              </View>
              <Button 
                title="Go to Dashboard" 
                onPress={() => router.replace('/(dashboard)')} 
                variant="primary" 
                style={{ marginTop: 16 }} 
              />
            </Card>
          )}

          {/* Info Alert */}
          {!isAllApproved && (
            <View style={styles.alertWrapper}>
              <InfoAlert message="You will be notified via email and SMS once your account is approved. You cannot accept bookings until verification is complete." />
            </View>
          )}

          {/* Profile Details */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>PROFILE DETAILS</Text>
            </View>
            <View style={styles.detailsBox}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Partner Name</Text>
                <Text style={styles.detailValue}>Alex Johnson</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone Number</Text>
                <Text style={styles.detailValue}>{mobileNumber || session?.phone || ''}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Partner role</Text>
                <Text style={styles.detailValue}>{role || 'Unknown'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Partner ID</Text>
                <Text style={styles.detailValue}>P-10294</Text>
              </View>
              <View style={styles.detailRowLast}>
                <Text style={styles.detailLabel}>Partner email ID</Text>
                <Text style={styles.detailValue}>alex@example.com</Text>
              </View>
            </View>
          </View>

          {/* Mandatory Flow */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>MANDATORY FLOW</Text>
            </View>
            <View style={styles.flowBox}>
              {flowSteps.map((step, index) => {
                const status = flowState[step.key as keyof MandatoryFlow];
                // Check if previous steps are all completed to enable this one
                const prevSteps = flowSteps.slice(0, index);
                const isPrevDone = prevSteps.every(s => {
                  const st = flowState[s.key as keyof MandatoryFlow];
                  return st === 'completed' || st === 'verified' || st === 'reviewing';
                });
                
                const disabled = !isPrevDone && index > 0;

                return (
                  <FlowListItem 
                    key={step.key}
                    icon={getIconForStatus(status)}
                    title={step.title}
                    subtitle={status === 'verified' || status === 'completed' ? 'Completed' : step.subtitle}
                    status={status as any}
                    isLast={index === flowSteps.length - 1}
                    onPress={disabled ? undefined : () => handleRowPress(step.route, status)}
                  />
                );
              })}
            </View>
          </View>
          
          {/* Approve Button */}
          {!isAllApproved && (
            <Button 
              title="Approve Account (Demo)" 
              onPress={handleApprove} 
              variant="primary" 
              style={{ marginTop: 8 }} 
            />
          )}
          
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1,  },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  blueCard: { backgroundColor: 'rgba(26, 15, 163, 1.00)', borderRadius: 24, padding: 24, alignItems: 'center', marginBottom: 16 },
  clockIconWrapper: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255, 255, 255, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  blueCardTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 },
  blueCardText: { fontSize: 12, color: '#CBD5E1', textAlign: 'center', lineHeight: 18, marginBottom: 24, paddingHorizontal: 8 },
  timelineWrapper: { width: '100%', paddingHorizontal: 8 },
  card: { padding: 20, marginBottom: 16, borderRadius: 16 },
  congratsRow: { flexDirection: 'row', alignItems: 'center' },
  congratsIconWrapper: { marginRight: 16 },
  congratsTextWrapper: { flex: 1 },
  congratsTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  congratsSubtitle: { fontSize: 12, fontWeight: '600', color: '#4338CA', marginBottom: 4 },
  congratsDesc: { fontSize: 11, color: '#64748B', lineHeight: 16 },
  alertWrapper: { marginBottom: 24 },
  sectionContainer: { marginBottom: 24 },
  sectionHeader: { backgroundColor: '#F8FAFC', paddingVertical: 12, paddingHorizontal: 16, borderTopLeftRadius: 12, borderTopRightRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', borderBottomWidth: 0 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#94A3B8', letterSpacing: 1 },
  detailsBox: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderBottomLeftRadius: 12, borderBottomRightRadius: 12, padding: 16, overflow: 'hidden' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  detailRowLast: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 },
  detailLabel: { fontSize: 13, color: '#64748B' },
  detailValue: { fontSize: 13, fontWeight: '600', color: '#0F172A' },
  flowBox: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderBottomLeftRadius: 12, borderBottomRightRadius: 12, overflow: 'hidden' },
});
