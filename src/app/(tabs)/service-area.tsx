import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon, DownloadExcelIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { DefineOperationalAreaModal } from '@/components/common/DefineOperationalAreaModal';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';
import { completeStepAndNavigate } from '@/utils/onboarding';

const DUMMY_AREAS = [
  { 
    id: '1', 
    branchName: 'Name', 
    status: 'Active',
    distance: 'Distance in kms',
    placeName: 'Place Name',
    country: 'Country Name',
    state: 'State Name',
    locationType: 'Location type',
    district: 'District Name',
    city: 'City Name'
  },
  { 
    id: '2', 
    branchName: 'Name', 
    status: 'Active',
    distance: 'Distance in kms',
    placeName: 'Place Name',
    country: 'Country Name',
    state: 'State Name',
    locationType: 'Location type',
    district: 'District Name',
    city: 'City Name'
  },
  { 
    id: '3', 
    branchName: 'Name', 
    status: 'Active',
    distance: 'Distance in kms',
    placeName: 'Place Name',
    country: 'Country Name',
    state: 'State Name',
    locationType: 'Location type',
    district: 'District Name',
    city: 'City Name'
  },
];

export default function ServiceAreaScreen() {
  useAndroidBack(() => router.replace('/(tabs)'));
  const router = useSafeRouter();
  const [filter, setFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'update'>('create');
  const [selectedArea, setSelectedArea] = useState<any>(null);

  const handleBack = () => {
    router.replace('/(tabs)');
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

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>List of Operational Area</Text>
          <TouchableOpacity style={styles.helpButton} onPress={() => router.push('/(dashboard)/help')}>
            <Text style={styles.helpText}>Help</Text>
          </TouchableOpacity>
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

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.excelButton}>
            <DownloadExcelIcon size={14} color="#3B82F6" />
            <Text style={styles.excelText}>Excel</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
          {DUMMY_AREAS.map((area) => (
            <View key={area.id} style={styles.card}>
              <View style={styles.cardHeaderLeft}>
                <Text style={styles.branchName}>Branch Name : {area.branchName}</Text>
                <Text style={[styles.statusText, area.status === 'Active' ? styles.statusActive : styles.statusInactive]}>
                  {area.status}
                </Text>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.detailRow}>
                  <View style={styles.bullet} />
                  <Text style={styles.detailText}>Service Distance : {area.distance}</Text>
                </View>
                <View style={styles.detailRow}>
                  <View style={styles.bullet} />
                  <Text style={styles.detailText}>Place name : {area.placeName}</Text>
                </View>
                <View style={styles.detailRow}>
                  <View style={styles.bullet} />
                  <Text style={styles.detailText}>Country : {area.country}</Text>
                </View>
                <View style={styles.detailRow}>
                  <View style={styles.bullet} />
                  <Text style={styles.detailText}>State : {area.state}</Text>
                </View>
                <View style={styles.detailRow}>
                  <View style={styles.bullet} />
                  <Text style={styles.detailText}>Location type : {area.locationType}</Text>
                </View>
                <View style={styles.detailRow}>
                  <View style={styles.bullet} />
                  <Text style={styles.detailText}>District : {area.district}</Text>
                </View>
                <View style={styles.detailRow}>
                  <View style={styles.bullet} />
                  <Text style={styles.detailText}>City : {area.city}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(area)}>
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <Button 
            title="+ Add operational area" 
            onPress={handleAdd} 
            variant="primary" 
            style={{ backgroundColor: 'rgba(26, 15, 163, 1.00)', marginBottom: 12 }}
          />
          <Button 
            title="Continue" 
            onPress={async () => {
              await completeStepAndNavigate('partnerServiceAreaCreation', router, 'completed');
            }} 
            variant="primary" 
          />
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
  safeArea: { flex: 1,  },
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

  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 20, marginBottom: 12 },
  excelButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, gap: 6, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)', elevation: 2 },
  excelText: { color: '#3B82F6', fontSize: 13, fontWeight: '500' },

  listContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  
  card: { position: 'relative', backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, marginBottom: 12, boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)', elevation: 2 },
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
  editBtnText: { fontSize: 12, fontWeight: '600', color: '#0F172A' },

  footer: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 16 }
});
