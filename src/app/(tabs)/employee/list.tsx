import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon, DownloadExcelIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { useEmployeeStore } from '@/store/employeeStore';
import { EmployeeModal } from '@/components/common/EmployeeModal';
import { EmployeeDetailsModal } from '@/components/common/EmployeeDetailsModal';
import { EmployeeBookingsModal } from '@/components/common/EmployeeBookingsModal';
import { LocationPinIcon, OutlineStarIcon } from '@/components/ui/Icons';
import { Employee } from '@/types';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { RoleAccessGuard } from '@/components/common/RoleAccessGuard';
import { completeStepAndNavigate } from '@/utils/onboarding';

export default function EmployeeListScreen() {
  const router = useSafeRouter();
  const { employees, initialize, updateEmployee, addEmployee } = useEmployeeStore();
  const [filter, setFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'update'>('create');
  
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [isBookingsVisible, setIsBookingsVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const handleBack = () => {
    router.replace('/(tabs)');
  };

  useAndroidBack(handleBack);

  useEffect(() => {
    initialize();
  }, []);

  const filteredEmployees = employees.filter(e => {
    if (filter === 'Active') return e.isActive;
    if (filter === 'Inactive') return !e.isActive;
    return true;
  });

  const handleEdit = (item: Employee) => {
    setModalMode('update');
    setSelectedEmployee(item);
    setIsModalVisible(true);
  };

  const handleView = (item: Employee) => {
    setSelectedEmployee(item);
    setIsDetailsVisible(true);
  };

  const handleBookings = (item: Employee) => {
    setSelectedEmployee(item);
    setIsBookingsVisible(true);
  };

  const renderItem = ({ item }: { item: Employee }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.employeeName}>Employee Name : {item.name}</Text>
        <Text style={[styles.statusText, !item.isActive && styles.statusInactive]}>
          {item.isActive ? 'Active' : 'Inactive'}
        </Text>
      </View>
      
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleView(item)}>
          <Text style={styles.actionButtonText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleEdit(item)}>
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleBookings(item)}>
          <Text style={styles.actionButtonText}>Booking</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(tabs)/employee/payouts')}>
          <Text style={styles.actionButtonText}>Payout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(tabs)/employee/schedule')}>
          <Text style={styles.actionButtonText}>Schedule</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <RoleAccessGuard allowedRoles={['BSP']}>
      <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>List of Employee</Text>
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
          data={filteredEmployees}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={[styles.listContent, filteredEmployees.length === 0 && { flexGrow: 1 }]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconWrapper}>
                <View style={styles.emptyIconCircle}>
                  <LocationPinIcon size={40} color="#3B82F6" />
                </View>
                <View style={styles.emptyStarBadge}>
                  <OutlineStarIcon size={16} color="#3B82F6" />
                </View>
              </View>
              <Text style={styles.emptyTitle}>No Branch Service{'\n'}Added Yet</Text>
              <Text style={styles.emptySubtitle}>Add locations that you frequently{'\n'}visit for quick access</Text>
            </View>
          }
        />
        
        <View style={styles.footer}>
          <Button 
            title="+ Add Employee" 
            onPress={() => {
              setModalMode('create');
              setSelectedEmployee(null);
              setIsModalVisible(true);
            }} 
            variant="outline" 
            style={{ marginBottom: 12 }}
          />
          <Button 
            title="Continue" 
            onPress={async () => {
              await completeStepAndNavigate('branchEmployeeMapping', router, 'completed');
            }} 
            variant="primary" 
          />
        </View>
      </SafeAreaView>

      <EmployeeModal 
        visible={isModalVisible} 
        onClose={() => {
          setIsModalVisible(false);
          setTimeout(() => setSelectedEmployee(null), 300);
        }} 
        mode={modalMode} 
        initialData={selectedEmployee || undefined}
        onSubmit={(data) => {
          if (modalMode === 'update' && selectedEmployee) {
            updateEmployee(selectedEmployee.id, data);
          } else {
            addEmployee(data);
          }
        }}
      />

      <EmployeeDetailsModal
        visible={isDetailsVisible}
        onClose={() => setIsDetailsVisible(false)}
        employee={selectedEmployee}
      />

      <EmployeeBookingsModal
        visible={isBookingsVisible}
        onClose={() => setIsBookingsVisible(false)}
        employee={selectedEmployee}
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
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: '#0F172A' },
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
  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 },
  employeeName: { fontSize: 14, fontWeight: '600', color: '#334155' },
  statusText: { fontSize: 11, fontWeight: '700', color: '#22C55E' },
  statusInactive: { color: '#EF4444' },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 },
  actionButton: { 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    borderRadius: 20, 
    paddingHorizontal: 16, 
    paddingVertical: 6,
    flex: 1,
    alignItems: 'center',
    minWidth: '22%'
  },
  actionButtonText: { fontSize: 11, color: '#0F172A', fontWeight: '500' },
  
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 80 },
  emptyIconWrapper: { position: 'relative', marginBottom: 24 },
  emptyIconCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#E0E7FF', justifyContent: 'center', alignItems: 'center' },
  emptyStarBadge: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', elevation: 2 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A', textAlign: 'center', marginBottom: 12 },
  emptySubtitle: { fontSize: 13, color: '#94A3B8', textAlign: 'center', lineHeight: 20 },

  footer: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 16 }
});
