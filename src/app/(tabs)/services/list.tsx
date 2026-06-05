import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon, DownloadExcelIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { useServicesStore } from '@/store/servicesStore';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { RoleAccessGuard } from '@/components/common/RoleAccessGuard';
import { completeStepAndNavigate } from '@/utils/onboarding';

export default function ServicesListScreen() {
  useAndroidBack(() => router.replace('/(tabs)'));
  const router = useSafeRouter();
  const { services } = useServicesStore();
  const [filter, setFilter] = useState<'All' | 'Active' | 'Inactive'>('All');

  const filteredServices = services.filter(s => {
    if (filter === 'Active') return s.active;
    if (filter === 'Inactive') return !s.active;
    return true;
  });

  const handleEdit = (id: string) => {
    router.push(`/(tabs)/services/update?id=${id}`);
  };

  return (
    <RoleAccessGuard allowedRoles={['BSP', 'ISP']}>
      <GradientBackground style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.backButton}>
              <BackArrowIcon size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>List of parter services</Text>
          </View>
          <TouchableOpacity style={styles.helpButton} onPress={() => router.push('/(dashboard)/help')}>
            <Text style={styles.helpText}>Help</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {['All', 'Active', 'Inactive'].map(f => {
              const isActive = filter === f;
              return (
                <TouchableOpacity 
                  key={f} 
                  style={[styles.filterPill, isActive && styles.filterPillActive]}
                  onPress={() => setFilter(f as any)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{f}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.excelButton}>
            <DownloadExcelIcon size={16} color="#3B82F6" />
            <Text style={styles.excelText}>Excel</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
          {filteredServices.map(service => (
            <View key={service.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View>
                  <View style={styles.cardTitleRow}>
                    <Text style={styles.cardTitle}>{service.name}</Text>
                    {service.subServices.length > 0 && (
                      <Text style={[styles.statusText, !service.active && styles.statusTextInactive]}>
                        {service.active ? 'Active' : 'In active'}
                      </Text>
                    )}
                  </View>
                  {service.subServices.length === 0 && (
                    <Text style={styles.dateText}>
                      {service.dateAdded} <Text style={styles.dotSeparator}>•</Text> <Text style={[styles.statusText, !service.active && styles.statusTextInactive]}>{service.active ? 'Active' : 'In active'}</Text>
                    </Text>
                  )}
                </View>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(service.id)}>
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
              </View>

              {service.subServices.length > 0 && (
                <View style={styles.subServicesList}>
                  {service.subServices.map(sub => (
                    <View key={sub.id} style={styles.subRow}>
                      <Text style={styles.subDot}>•</Text>
                      <Text style={styles.subName}>{sub.name}</Text>
                      <Text style={styles.subExp}>{sub.yearsOfExperience} years</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
          {filteredServices.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No services found.</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Button 
            title="+ Add Services" 
            onPress={() => router.push('/(tabs)/services/select')} 
            variant="outline" 
            style={{ marginBottom: 12 }}
          />
          <Button 
            title="Continue" 
            onPress={async () => {
              await completeStepAndNavigate('partnerServiceSelection', router, 'completed');
            }} 
            variant="primary" 
          />
        </View>
      </SafeAreaView>
    </GradientBackground>
    </RoleAccessGuard>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent',  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  helpButton: { backgroundColor: '#F97316', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8 },
  helpText: { color: '#FFFFFF', fontWeight: '600', fontSize: 12 },
  
  filterRow: { marginBottom: 12 },
  filterScroll: { paddingHorizontal: 20, gap: 12 },
  filterPill: { paddingHorizontal: 20, paddingVertical: 8, backgroundColor: '#FFFFFF', borderRadius: 20 },
  filterPillActive: { backgroundColor: 'rgba(26, 15, 163, 1.00)' },
  filterText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  filterTextActive: { color: '#FFFFFF' },
  
  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 20, marginBottom: 16 },
  excelButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, gap: 6 },
  excelText: { fontSize: 13, fontWeight: '600', color: '#3B82F6' },
  
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, marginBottom: 16 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  statusText: { fontSize: 11, fontWeight: '700', color: '#22C55E' },
  statusTextInactive: { color: '#F59E0B' },
  dateText: { fontSize: 12, color: '#64748B' },
  dotSeparator: { marginHorizontal: 4 },
  
  editButton: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  editText: { fontSize: 13, fontWeight: '600', color: '#0F172A' },
  
  subServicesList: { marginTop: 12 },
  subRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  subDot: { fontSize: 14, color: '#64748B', marginRight: 8, marginTop: -2 },
  subName: { flex: 1, fontSize: 13, color: '#475569' },
  subExp: { fontSize: 12, color: '#94A3B8' },
  
  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#64748B' },
  
  footer: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 16 }
});
