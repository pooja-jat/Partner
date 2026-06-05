import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon, DownloadExcelIcon } from '@/components/ui/Icons';
import { BranchModal } from '@/components/common/BranchModal';
import { useBranchStore } from '@/store/branchStore';
import { Button } from '@/components/ui/Button';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { RoleAccessGuard } from '@/components/common/RoleAccessGuard';
import { completeStepAndNavigate } from '@/utils/onboarding';

export default function BranchListScreen() {
  useAndroidBack(() => router.replace('/(tabs)'));
  const router = useSafeRouter();
  const { branches, initialize, updateBranch, addBranch } = useBranchStore();
  const [filter, setFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'update'>('create');
  const [selectedBranch, setSelectedBranch] = useState<any>(null);

  useEffect(() => {
    initialize();
  }, []);

  const filteredBranches = branches.filter(b => {
    if (filter === 'Active') return b.isActive;
    if (filter === 'Inactive') return !b.isActive;
    return true;
  });

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.branchName}>Branch Name : {item.name}</Text>
        <Text style={[styles.statusText, !item.isActive && styles.statusInactive]}>
          {item.isActive ? 'Active' : 'Inactive'}
        </Text>
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>• Branch Manager Name : {item.managerName}</Text>
        <Text style={styles.detailText}>• Branch Email ID : {item.email}</Text>
        <Text style={styles.detailText}>• Branch Mobile No : {item.mobile}</Text>
        <Text style={styles.detailText}>• Branch Address : {item.address}</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.editButton}
        onPress={() => {
          setModalMode('update');
          setSelectedBranch(item);
          setIsModalVisible(true);
        }}
      >
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <RoleAccessGuard allowedRoles={['BSP', 'BS']}>
      <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>List of parter services</Text>
          <TouchableOpacity style={styles.helpButton} onPress={() => router.push('/(dashboard)/help')}>
            <Text style={styles.helpText}>Help</Text>
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <View style={styles.filterContainer}>
          <View style={styles.tabsRow}>
            {['All', 'Active', 'Inactive'].map((tab) => (
              <TouchableOpacity 
                key={tab} 
                style={[styles.tab, filter === tab && styles.activeTab]}
                onPress={() => setFilter(tab as any)}
              >
                <Text style={[styles.tabText, filter === tab && styles.activeTabText]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Excel Button */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.excelButton}>
            <DownloadExcelIcon size={16} color="#3B82F6" />
            <Text style={styles.excelText}>Excel</Text>
          </TouchableOpacity>
        </View>

        {/* List */}
        <FlatList
          data={filteredBranches}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No branches found.</Text>
          }
        />
        
        <View style={styles.footer}>
          <Button 
            title="+ Add Branch" 
            onPress={() => {
              setModalMode('create');
              setSelectedBranch(null);
              setIsModalVisible(true);
            }} 
            variant="outline" 
            style={{ marginBottom: 12 }}
          />
          <Button 
            title="Continue" 
            onPress={async () => {
              await completeStepAndNavigate('branchCreation', router, 'completed');
            }} 
            variant="primary" 
          />
        </View>
      </SafeAreaView>

      <BranchModal 
        visible={isModalVisible} 
        onClose={() => {
          setIsModalVisible(false);
          setTimeout(() => setSelectedBranch(null), 300); // clear after animation
        }} 
        mode={modalMode} 
        initialData={selectedBranch}
        onSubmit={(data) => {
          if (modalMode === 'update') {
            updateBranch(selectedBranch.id, data);
          } else {
            addBranch(data);
          }
        }}
      />
    </GradientBackground>
    </RoleAccessGuard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1,  },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '500', color: '#0F172A' },
  helpButton: { backgroundColor: '#FF8A00', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  helpText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  filterContainer: { paddingHorizontal: 20, marginBottom: 12 },
  tabsRow: { flexDirection: 'row', gap: 8 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFFFFF' },
  activeTab: { backgroundColor: 'rgba(26, 15, 163, 1.00)' },
  tabText: { color: '#64748B', fontSize: 14, fontWeight: '500' },
  activeTabText: { color: '#FFFFFF' },
  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 20, marginBottom: 12 },
  excelButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 4 },
  excelText: { color: '#3B82F6', fontSize: 14, fontWeight: '500' },
  listContent: { paddingHorizontal: 20, paddingBottom: 40, gap: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, position: 'relative' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  branchName: { fontSize: 14, fontWeight: '600', color: '#334155' },
  statusText: { fontSize: 12, fontWeight: '600', color: '#22C55E' },
  statusInactive: { color: '#EF4444' },
  detailsContainer: { gap: 6, paddingRight: 60 },
  detailText: { fontSize: 12, color: '#334155', lineHeight: 18 },
  editButton: { position: 'absolute', right: 20, top: 40, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6 },
  editButtonText: { fontSize: 12, color: '#0F172A', fontWeight: '500' },
  emptyText: { textAlign: 'center', color: '#64748B', marginTop: 40 },
  footer: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 16 }
});
