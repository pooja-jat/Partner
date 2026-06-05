import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Card } from '@/components/ui/Card';
import { BackArrowIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';

export default function EmployeePayoutsScreen() {
  const router = useSafeRouter();

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Employee Payouts</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Card style={styles.card}>
            <Text style={styles.title}>Pending Payout</Text>
            <Text style={styles.amount}>₹4,250.00</Text>
            <Text style={styles.subtitle}>For the week of Oct 14 - Oct 20</Text>

            <Button 
              title="Process Payout" 
              onPress={() => alert('Payout processed!')} 
              variant="primary" 
              style={styles.btn} 
            />
          </Card>

          <Text style={styles.sectionTitle}>Recent Payouts</Text>
          
          {[1, 2, 3].map((_, idx) => (
            <View key={idx} style={styles.historyCard}>
              <View>
                <Text style={styles.historyAmount}>₹3,800.00</Text>
                <Text style={styles.historyDate}>Oct 13, 2024</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Paid</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  content: { padding: 20 },
  card: { padding: 24, backgroundColor: '#FFFFFF', borderRadius: 24, alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 14, color: '#64748B', marginBottom: 8 },
  amount: { fontSize: 32, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  subtitle: { fontSize: 12, color: '#94A3B8', marginBottom: 24 },
  btn: { width: '100%' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 12, paddingHorizontal: 4 },
  historyCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 12 },
  historyAmount: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  historyDate: { fontSize: 12, color: '#64748B' },
  badge: { backgroundColor: '#DCFCE7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#166534' }
});
