import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon, PencilIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { DefineOperationalAreaModal } from '@/components/common/DefineOperationalAreaModal';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';
import { completeStepAndNavigate } from '@/utils/onboarding';
import Svg, { Path, Circle } from 'react-native-svg';

const DUMMY_AREAS: any[] = [
  { id: '1', branchName: 'Downtown Branch', status: 'Active', distance: '15 km', placeName: 'City Center', country: 'India', state: 'Maharashtra', locationType: 'Urban', district: 'Pune', city: 'Pune' },
  { id: '2', branchName: 'North Zone', status: 'Inactive', distance: '10 km', placeName: 'North Area', country: 'India', state: 'Maharashtra', locationType: 'Urban', district: 'Nashik', city: 'Nashik' },
];

const EmptyIllustration = () => (
  <View style={emptyStyles.illustrationWrap}>
    <View style={emptyStyles.outerCircle}>
      <View style={emptyStyles.innerCircle}>
        <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
            stroke="rgba(26,15,163,1)"
            strokeWidth="1.5"
            fill="rgba(26,15,163,0.12)"
          />
          <Circle cx="12" cy="9" r="2.5" stroke="rgba(26,15,163,1)" strokeWidth="1.5" />
        </Svg>
      </View>
    </View>
    <View style={emptyStyles.starBadge}>
      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
          fill="rgba(26,15,163,0.15)"
          stroke="rgba(26,15,163,1)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  </View>
);

export default function ServiceAreaScreen() {
  const router = useSafeRouter();
  const [filter, setFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'update'>('create');
  const [selectedArea, setSelectedArea] = useState<any>(null);
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    const checkApproval = async () => {
      const session = await StorageService.getUserSession();
      if (session?.isApproved) setIsApproved(true);
    };
    checkApproval();
  }, []);

  useAndroidBack(() => {
    if (isApproved) router.back();
    else router.replace('/(tabs)');
  });

  const handleBack = () => {
    if (isApproved) router.back();
    else router.replace('/(tabs)');
  };

  const handleEdit = (area: any) => {
    setSelectedArea(area);
    setModalMode('update');
    setModalVisible(true);
  };

  const handleAdd = () => {
    setSelectedArea(null);
    setModalMode('create');
    setModalVisible(true);
  };

  const isEmpty = DUMMY_AREAS.length === 0;

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEmpty ? 'Partner Service Area' : 'List of Service Area'}
          </Text>
          {!isEmpty && (
            <TouchableOpacity style={styles.helpButton} onPress={() => router.push('/(dashboard)/help')}>
              <Text style={styles.helpText}>Help</Text>
            </TouchableOpacity>
          )}
        </View>

        {isEmpty ? (
          /* ── Empty state ── */
          <View style={emptyStyles.body}>
            <EmptyIllustration />
            <Text style={emptyStyles.title}>No Service Area Added Yet</Text>
            <Text style={emptyStyles.subtitle}>
              Add locations that you frequently{'\n'}visit for quick access
            </Text>
          </View>
        ) : (
          /* ── List state ── */
          <>
            <View style={styles.filterContainer}>
              <View style={styles.tabsRow}>
                {(['All', 'Active', 'Inactive'] as const).map((tab) => (
                  <TouchableOpacity
                    key={tab}
                    style={[styles.tab, filter === tab && styles.activeTab]}
                    onPress={() => setFilter(tab)}
                    activeOpacity={1}
                  >
                    <Text style={[styles.tabText, filter === tab && styles.activeTabText]}>{tab}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
              {DUMMY_AREAS.map((area) => (
                <View key={area.id} style={styles.card}>
                  <View style={styles.cardHeaderLeft}>
                    <Text style={styles.branchName}>Name : {area.branchName}</Text>
                    <Text style={[styles.statusText, area.status === 'Active' ? styles.statusActive : styles.statusInactive]}>
                      {area.status}
                    </Text>
                  </View>
                  <View style={styles.cardBody}>
                    {[
                      ['Service Distance', area.distance],
                      ['Place name', area.placeName],
                      ['Country', area.country],
                      ['State', area.state],
                      ['Location type', area.locationType],
                      ['District', area.district],
                      ['City', area.city],
                    ].map(([label, value]) => (
                      <View key={label} style={styles.detailRow}>
                        <View style={styles.bullet} />
                        <Text style={styles.detailText}>{label} : {value}</Text>
                      </View>
                    ))}
                  </View>
                  <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(area)}>
                    <PencilIcon size={16} color="#0F172A" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            title="+ Add Service Area"
            onPress={handleAdd}
            variant="primary"
            style={{ backgroundColor: 'rgba(26, 15, 163, 1.00)', marginBottom: isApproved ? 0 : 12 }}
          />
          {!isApproved && (
            <Button
              title="Continue"
              onPress={async () => {
                await completeStepAndNavigate('partnerServiceAreaCreation', router, 'completed');
              }}
              variant="primary"
            />
          )}
        </View>
      </SafeAreaView>

      <DefineOperationalAreaModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        mode={modalMode}
        initialData={selectedArea}
        onSubmit={(data) => {
          console.log('Saved area:', data);
        }}
      />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '600', color: '#0F172A' },
  helpButton: { backgroundColor: '#F97316', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  helpText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },

  filterContainer: { paddingHorizontal: 20, marginBottom: 12 },
  tabsRow: { flexDirection: 'row', gap: 8 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFFFFF' },
  activeTab: { backgroundColor: 'rgba(26, 15, 163, 1.00)' },
  tabText: { color: '#64748B', fontSize: 13, fontWeight: '500' },
  activeTabText: { color: '#FFFFFF' },

  listContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  card: { position: 'relative', backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, marginBottom: 12, elevation: 2 },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  branchName: { fontSize: 13, fontWeight: '600', color: '#0F172A' },
  statusText: { fontSize: 10, fontWeight: '700' },
  statusActive: { color: '#22C55E' },
  statusInactive: { color: '#EF4444' },
  cardBody: { paddingRight: 60, gap: 4 },
  detailRow: { flexDirection: 'row', alignItems: 'center' },
  bullet: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#0F172A', marginRight: 8 },
  detailText: { fontSize: 11, color: '#0F172A' },
  editBtn: { position: 'absolute', right: 20, top: '50%', transform: [{ translateY: -16 }], borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6, backgroundColor: '#FFFFFF' },

  footer: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 16 },
});

const emptyStyles = StyleSheet.create({
  body: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  illustrationWrap: { position: 'relative', width: 120, height: 120, marginBottom: 28 },
  outerCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(26,15,163,0.06)', justifyContent: 'center', alignItems: 'center' },
  innerCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(26,15,163,0.1)', justifyContent: 'center', alignItems: 'center' },
  starBadge: { position: 'absolute', bottom: 4, right: 4, width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  title: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 13, color: '#94A3B8', textAlign: 'center', lineHeight: 20 },
});
