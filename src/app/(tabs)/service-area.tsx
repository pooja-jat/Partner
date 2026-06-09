import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon, EyeIcon, PencilIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { DefineOperationalAreaModal } from '@/components/common/DefineOperationalAreaModal';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';
import { completeStepAndNavigate } from '@/utils/onboarding';
import Svg, { Path, Circle } from 'react-native-svg';

const TrashIcon = ({ size = 18, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 6H5H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6L18.1 20.1C18.0433 20.8 17.7 21.4 17.2 21.7C16.7 22 16 22 15.5 22H8.5C8 22 7.3 22 6.8 21.7C6.3 21.4 5.95667 20.8 5.9 20.1L5 6H19Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M10 11V17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M14 11V17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CloseXIcon = ({ size = 22, color = '#0F172A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

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

const INITIAL_AREAS: any[] = [
  { id: '1', branchName: 'Downtown Branch', status: 'Active', distance: '15 km', placeName: 'City Center', country: 'India', state: 'Maharashtra', locationType: 'Urban', district: 'Pune', city: 'Pune' },
  { id: '2', branchName: 'North Zone', status: 'Inactive', distance: '10 km', placeName: 'North Area', country: 'India', state: 'Maharashtra', locationType: 'Urban', district: 'Nashik', city: 'Nashik' },
];

export default function ServiceAreaScreen() {
  const router = useSafeRouter();
  const [filter, setFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [areas, setAreas] = useState<any[]>(INITIAL_AREAS);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'update'>('create');
  const [selectedArea, setSelectedArea] = useState<any>(null);
  const [isApproved, setIsApproved] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [viewArea, setViewArea] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  useEffect(() => {
    const checkApproval = async () => {
      const session = await StorageService.getUserSession();
      if (session?.isApproved) setIsApproved(true);
      if (session?.role) setRole(session.role);
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

  const confirmDelete = () => {
    if (deleteTarget) {
      setAreas(prev => prev.filter(a => a.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const filteredAreas = areas.filter(a => {
    if (filter === 'Active') return a.status === 'Active';
    if (filter === 'Inactive') return a.status === 'Inactive';
    return true;
  });

  const isEmpty = areas.length === 0;
  const isISP = role === 'ISP';

  const VIEW_FIELDS: [string, string][] = [
    ...(!isISP ? [['Branch Name', 'branchName']] : []),
    ['Service Distance', 'distance'],
    ['Place Name', 'placeName'],
    ['Country', 'country'],
    ['State', 'state'],
    ['Location Type', 'locationType'],
    ['District', 'district'],
    ['City', 'city'],
  ];

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>

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
          <View style={emptyStyles.body}>
            <EmptyIllustration />
            <Text style={emptyStyles.title}>No Service Area Added Yet</Text>
            <Text style={emptyStyles.subtitle}>
              Add locations that you frequently{'\n'}visit for quick access
            </Text>
          </View>
        ) : (
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
              {filteredAreas.map((area) => (
                <View key={area.id} style={styles.card}>
                  <View style={styles.cardHeaderRow}>
                    {!isISP && <Text style={styles.branchName}>{area.branchName}</Text>}
                    <Text style={[styles.statusText, area.status === 'Active' ? styles.statusActive : styles.statusInactive]}>
                      {area.status}
                    </Text>
                  </View>
                  <View style={styles.cardBody}>
                    {[
                      ...(!isISP ? [['Branch Name', area.branchName]] : []),
                      ['Service Distance', area.distance],
                      ['Place Name', area.placeName],
                      ['Country', area.country],
                      ['State', area.state],
                      ['Location Type', area.locationType],
                      ['District', area.district],
                      ['City', area.city],
                    ].map(([label, value]) => (
                      <View key={label} style={styles.detailRow}>
                        <View style={styles.bullet} />
                        <Text style={styles.detailText}>{label}: {value}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.cardActions}>
                    <TouchableOpacity style={styles.iconBtn} onPress={() => setViewArea(area)}>
                      <EyeIcon size={18} color="#4338CA" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn} onPress={() => handleEdit(area)}>
                      <PencilIcon size={18} color="#0F172A" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.iconBtn, styles.iconBtnDelete]} onPress={() => setDeleteTarget(area)}>
                      <TrashIcon size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </>
        )}

        <View style={styles.footer}>
          <Button
            title="+ Add Service Area"
            onPress={handleAdd}
            variant="primary"
            style={{ backgroundColor: 'rgba(26, 15, 163, 1.00)', marginBottom: isApproved ? 0 : 12 }}
          />
          {!isApproved && (
            <Button
              title="Skip / Continue"
              onPress={async () => {
                await completeStepAndNavigate('partnerServiceAreaCreation', router, 'completed');
              }}
              variant="outline"
            />
          )}
        </View>
      </SafeAreaView>

      <DefineOperationalAreaModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        mode={modalMode}
        initialData={selectedArea}
        hideBranch={isISP}
        onSubmit={(data) => {
          console.log('Saved area:', data);
        }}
      />

      {/* View Area Modal */}
      <Modal visible={!!viewArea} transparent animationType="slide" onRequestClose={() => setViewArea(null)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFillObject} activeOpacity={1} onPress={() => setViewArea(null)} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Service Area Details</Text>
              <TouchableOpacity onPress={() => setViewArea(null)} style={styles.closeBtn}>
                <CloseXIcon size={22} color="#0F172A" />
              </TouchableOpacity>
            </View>
            {viewArea && (
              <View style={styles.viewRows}>
                {VIEW_FIELDS.map(([label, key]) => (
                  <View key={key} style={styles.viewRow}>
                    <Text style={styles.viewLabel}>{label}</Text>
                    <Text style={styles.viewValue}>{viewArea[key]}</Text>
                  </View>
                ))}
                <View style={styles.viewRow}>
                  <Text style={styles.viewLabel}>Status</Text>
                  <Text style={[styles.viewValue, viewArea.status === 'Active' ? styles.activeColor : styles.inactiveColor]}>
                    {viewArea.status}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal visible={!!deleteTarget} transparent animationType="slide" onRequestClose={() => setDeleteTarget(null)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFillObject} activeOpacity={1} onPress={() => setDeleteTarget(null)} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Delete Service Area</Text>
              <TouchableOpacity onPress={() => setDeleteTarget(null)} style={styles.closeBtn}>
                <CloseXIcon size={22} color="#0F172A" />
              </TouchableOpacity>
            </View>
            <Text style={styles.deleteMsg}>
              Are you sure you want to delete <Text style={{ fontWeight: '700' }}>{deleteTarget?.branchName}</Text>? This action cannot be undone.
            </Text>
            <View style={styles.deleteActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setDeleteTarget(null)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={confirmDelete}>
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: '#0F172A' },
  helpButton: { backgroundColor: '#F97316', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  helpText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },

  filterContainer: { paddingHorizontal: 20, marginBottom: 12 },
  tabsRow: { flexDirection: 'row', gap: 8 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFFFFF', elevation: 2 },
  activeTab: { backgroundColor: '#1A0FA3', elevation: 4 },
  tabText: { color: '#64748B', fontSize: 13, fontWeight: '500' },
  activeTabText: { color: '#FFFFFF' },

  listContainer: { paddingHorizontal: 20, paddingBottom: 20, gap: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  branchName: { fontSize: 14, fontWeight: '700', color: '#0F172A', flex: 1 },
  statusText: { fontSize: 11, fontWeight: '700' },
  statusActive: { color: '#22C55E' },
  statusInactive: { color: '#EF4444' },
  cardBody: { gap: 4, marginBottom: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center' },
  bullet: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#94A3B8', marginRight: 8 },
  detailText: { fontSize: 12, color: '#475569' },
  cardActions: { flexDirection: 'row', gap: 8, justifyContent: 'flex-end', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 10 },
  iconBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  iconBtnDelete: { backgroundColor: '#FEE2E2' },

  footer: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 16 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.45)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 17, fontWeight: '700', color: '#0F172A' },
  closeBtn: { padding: 4 },
  viewRows: { gap: 4, paddingBottom: 8 },
  viewRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  viewLabel: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  viewValue: { fontSize: 13, color: '#0F172A', fontWeight: '600', maxWidth: '55%', textAlign: 'right' },
  activeColor: { color: '#22C55E' },
  inactiveColor: { color: '#EF4444' },
  deleteMsg: { fontSize: 14, color: '#475569', lineHeight: 22, marginBottom: 24 },
  deleteActions: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  cancelBtnText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  deleteBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#EF4444', alignItems: 'center' },
  deleteBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
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
