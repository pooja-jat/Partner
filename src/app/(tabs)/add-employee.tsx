import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import { EmployeeForm } from '@/components/common/EmployeeForm';
import { useEmployeeStore } from '@/store/employeeStore';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';
import { RoleAccessGuard } from '@/components/common/RoleAccessGuard';
import { completeStepAndNavigate } from '@/utils/onboarding';

export default function AddEmployeeScreen() {
  useAndroidBack(() => router.replace('/(tabs)'));
  const router = useSafeRouter();
  const { addEmployee } = useEmployeeStore();

  const handleSubmit = async (data: any) => {
    addEmployee(data);
    await completeStepAndNavigate('addingEmployee', router, 'reviewing');
  };

  const handleSkip = async () => {
    await completeStepAndNavigate('addingEmployee', router, 'completed');
  };

  return (
    <RoleAccessGuard allowedRoles={['BSP']}>
      <GradientBackground style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.backButton}>
                <BackArrowIcon size={24} color="#0F172A" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Add Employee</Text>
            </View>
            <TouchableOpacity 
              onPress={handleSkip} 
              style={{ paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#CBD5E1' }}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#64748B' }}>Skip</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>

            <EmployeeForm mode="create" onSubmit={handleSubmit} />
          </View>
        </SafeAreaView>
      </GradientBackground>
    </RoleAccessGuard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1,  },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 20 },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A' },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    padding: 24,
  },
});
