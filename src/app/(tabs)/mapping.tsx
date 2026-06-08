import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon, PencilIcon, BranchIcon, OutlineStarIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { MapServicesModal } from '@/components/common/MapServicesModal';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';
import { RoleAccessGuard } from '@/components/common/RoleAccessGuard';
import { completeStepAndNavigate } from '@/utils/onboarding';

const DUMMY_MAPPINGS = [
  {
    id: '1',
    branchName: 'Name',
    category: 'Cleaning',
    status: 'Active',
    services: [
      { name: 'House cleaning', experience: '1.5 years' },
      { name: 'Office cleaning', experience: '1.5 years' },
      { name: 'Open area cleaning', experience: '1.5 years' },
      { name: 'Open area cleaning', experience: '1.5 years' },
    ]
  },
  {
    id: '2',
    branchName: 'Name',
    category: 'Cleaning',
    status: 'Active',
    services: [
      { name: 'House cleaning', experience: '1.5 years' },
      { name: 'Office cleaning', experience: '1.5 years' },
      { name: 'Open area cleaning', experience: '1.5 years' },
      { name: 'Open area cleaning', experience: '1.5 years' },
    ]
  },
  {
    id: '3',
    branchName: 'Name',
    category: 'Cleaning',
    status: 'Active',
    services: [
      { name: 'House cleaning', experience: '1.5 years' },
      { name: 'Office cleaning', experience: '1.5 years' },
      { name: 'Open area cleaning', experience: '1.5 years' },
      { name: 'Open area cleaning', experience: '1.5 years' },
    ]
  },
];

export default function MappingScreen() {
  const router = useSafeRouter();
  const [filter, setFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'update'>('create');
  const [selectedMapping, setSelectedMapping] = useState<any>(null);
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

  const handleBack = () => {
    if (isApproved) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleEdit = (mapping: any) => {
    setSelectedMapping(mapping);
    setModalMode('update');
    setModalVisible(true);
  };

  const handleAdd = () => {
    setSelectedMapping(null);
    setModalMode('create');
    setModalVisible(true);
  };

  return (
    <RoleAccessGuard allowedRoles={['BSP', 'BS']}>
      <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>List of Branch and services mapping</Text>
        </View>

        <View style={styles.filterContainer}>
          <View style={styles.tabsRow}>
            {['All', 'Active', 'Inactive'].map((tab) => (
              <TouchableOpacity 
                key={tab} 
                style={[styles.tab, filter === tab && styles.activeTab]}
                onPress={() => setFilter(tab as any)}
              >
                <Text style={[styles.tabText, filter === tab && styles.activeTabText]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
          {DUMMY_MAPPINGS.length === 0 && (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <View style={styles.emptyLargeCircle}>
                  <BranchIcon size={48} color="#3B82F6" />
                </View>
                <View style={styles.emptySmallCircle}>
                  <OutlineStarIcon size={20} color="#3B82F6" />
                </View>
              </View>
              <Text style={styles.emptyTitle}>No Mapping Added Yet</Text>
              <Text style={styles.emptySubtitle}>
                Add your branch and service mappings{'\n'}to manage them from one place
              </Text>
            </View>
          )}
          {DUMMY_MAPPINGS.map((mapping) => (
            <View key={mapping.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <Text style={styles.branchName}>Branch name : {mapping.branchName}</Text>
                  <Text style={[styles.statusText, mapping.status === 'Active' ? styles.statusActive : styles.statusInactive]}>
                    {mapping.status}
                  </Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.categoryTitle}>{mapping.category}</Text>
                <View style={styles.servicesList}>
                  {mapping.services.map((svc, index) => (
                    <View key={index} style={styles.serviceRow}>
                      <View style={styles.serviceLeft}>
                        <View style={styles.bullet} />
                        <Text style={styles.serviceName}>{svc.name}</Text>
                      </View>
                      <Text style={styles.serviceExp}>{svc.experience}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(mapping)}>
                <PencilIcon size={16} color="#0F172A" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <Button 
            title="+ Add service branch mapping" 
            onPress={handleAdd} 
            variant="primary" 
            style={{ backgroundColor: 'rgba(26, 15, 163, 1.00)', marginBottom: isApproved ? 0 : 12 }}
          />
          {!isApproved && (
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Button 
                title="Skip" 
                onPress={async () => {
                  await completeStepAndNavigate('serviceBranchMapping', router, 'completed');
                }} 
                variant="outline" 
                style={{ flex: 1 }}
              />
              <Button 
                title="Continue" 
                onPress={async () => {
                  await completeStepAndNavigate('serviceBranchMapping', router, 'completed');
                }} 
                variant="primary" 
                style={{ flex: 1 }}
              />
            </View>
          )}
        </View>
      </SafeAreaView>

      <MapServicesModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        mode={modalMode}
        initialData={selectedMapping}
        onSubmit={(data) => {
          console.log('Saved mapping:', data);
        }}
      />
    </GradientBackground>
    </RoleAccessGuard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1,  },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '600', color: '#0F172A' },
  
  filterContainer: { paddingHorizontal: 20, marginBottom: 12 },
  tabsRow: { flexDirection: 'row', gap: 8 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFFFFF' },
  activeTab: { backgroundColor: 'rgba(26, 15, 163, 1.00)' },
  tabText: { color: '#64748B', fontSize: 13, fontWeight: '500' },
  activeTabText: { color: '#FFFFFF' },

  listContainer: { paddingHorizontal: 20, paddingBottom: 40 },
  
  card: { position: 'relative', backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, marginBottom: 12, boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)', elevation: 2 },
  cardHeader: { marginBottom: 8 },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  branchName: { fontSize: 13, fontWeight: '600', color: '#0F172A' },
  statusText: { fontSize: 10, fontWeight: '700' },
  statusActive: { color: '#22C55E' },
  statusInactive: { color: '#EF4444' },
  
  cardBody: { paddingRight: 60 }, // leave space for edit button
  categoryTitle: { fontSize: 13, fontWeight: '600', color: '#0F172A', marginBottom: 8 },
  servicesList: { gap: 6 },
  serviceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  serviceLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  bullet: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#64748B', marginRight: 6 },
  serviceName: { fontSize: 11, color: '#64748B' },
  serviceExp: { fontSize: 10, color: '#64748B', width: 60, textAlign: 'right' },
  
  editBtn: { position: 'absolute', right: 20, top: '50%', transform: [{ translateY: -16 }], borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 20, padding: 8, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },

  footer: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 16 },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40, paddingTop: 60 },
  emptyIconContainer: { position: 'relative', marginBottom: 32 },
  emptyLargeCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(206, 218, 255, 0.8)', justifyContent: 'center', alignItems: 'center' },
  emptySmallCircle: { position: 'absolute', bottom: 0, right: 0, width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', elevation: 3 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: '#000000', marginBottom: 12, textAlign: 'center' },
  emptySubtitle: { fontSize: 14, color: '#94A3B8', textAlign: 'center', lineHeight: 22 },
});
