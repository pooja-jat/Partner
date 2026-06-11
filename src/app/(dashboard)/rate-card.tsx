import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import { useAndroidBack } from '@/hooks/useAndroidBack';

export default function RateCardScreen() {
  useAndroidBack(() => router.push('/(dashboard)/profile'));
  const router = useSafeRouter();
  const [activeTab, setActiveTab] = useState<'Service' | 'Instant'>('Service');

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/(dashboard)/profile')} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rate Card</Text>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.tab, activeTab === 'Service' && styles.tabActive]}
            onPress={() => setActiveTab('Service')}
          >
            <Text style={[styles.tabText, activeTab === 'Service' && styles.tabTextActive]}>Service</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.tab, activeTab === 'Instant' && styles.tabActive]}
            onPress={() => setActiveTab('Instant')}
          >
            <Text style={[styles.tabText, activeTab === 'Instant' && styles.tabTextActive]}>Instant</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.fareCard}>
            <View style={styles.cardHeaderGreen}>
              <Text style={styles.cardHeaderTitleGreen}>Order Fare</Text>
            </View>
            <View style={styles.cardBody}>
              
              <View style={styles.fareRow}>
                <View style={styles.fareInfo}>
                  <Text style={styles.fareTitle}>Distance Fare</Text>
                  <Text style={styles.fareSub}>For the kilometers travelled</Text>
                </View>
              </View>

              <View style={styles.subFareList}>
                <View style={styles.verticalLine} />
                <View style={styles.subFareRow}>
                  <Text style={styles.subFareLabel}>0 to 4 km</Text>
                  <Text style={styles.subFareAmount}><Text style={styles.amountBold}>₹6.3</Text> per km</Text>
                </View>
                <View style={styles.subFareRow}>
                  <Text style={styles.subFareLabel}>4 to 100 km</Text>
                  <Text style={styles.subFareAmount}><Text style={styles.amountBold}>₹8.4</Text> per km</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.fareRow}>
                <View style={styles.fareInfo}>
                  <Text style={styles.fareTitle}>Base Fare</Text>
                  <Text style={styles.fareSub}>For completing an order</Text>
                </View>
                <Text style={styles.amountBoldDark}>₹11</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.fareRow}>
                <View style={styles.fareInfo}>
                  <Text style={styles.fareTitle}>Platform fee</Text>
                  <Text style={styles.fareSub}>Collected from customer</Text>
                </View>
                <Text style={styles.amountBoldDark}>₹2</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.fareRow}>
                <View style={styles.fareInfo}>
                  <Text style={styles.fareTitle}>Wait Time charges</Text>
                  <Text style={styles.fareSub}>After 3 min (Max ₹20)</Text>
                </View>
                <Text style={styles.amountBoldDark}>+ ₹1 <Text style={styles.amountLight}>per min</Text></Text>
              </View>

            </View>
          </View>

          <View style={styles.fareCard}>
            <View style={styles.cardHeaderGreen}>
              <Text style={styles.cardHeaderTitleGreen}>Extra Fare (not applicable on all orders)</Text>
            </View>
            <View style={styles.cardBody}>
              
              <View style={styles.fareRow}>
                <View style={styles.fareInfo}>
                  <Text style={styles.fareTitle}>Long Pickup Fare per km</Text>
                  <Text style={styles.fareSub}>After 2 km (Max ₹6)</Text>
                </View>
                <Text style={styles.amountBoldDark}>+ ₹3 <Text style={styles.amountLight}>per km</Text></Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.fareRow}>
                <View style={styles.fareInfo}>
                  <Text style={styles.fareTitle}>Cancellation Fare</Text>
                  <Text style={styles.fareSub}>When the customer cancels</Text>
                </View>
                <Text style={styles.amountBoldDark}>+ ₹0 to ₹10</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.fareRow}>
                <View style={styles.fareInfo}>
                  <Text style={styles.fareTitle}>Night Fare (10:00pm - 6:00am)</Text>
                  <Text style={styles.fareSub}>+20% on Base, Time and Distance Fare</Text>
                </View>
                <Text style={styles.amountBoldDark}>+20%</Text>
              </View>

            </View>
          </View>

          <View style={[styles.fareCard, { borderColor: 'rgba(26, 15, 163, 1.00)' }]}>
            <View style={styles.cardHeaderPurple}>
              <Text style={styles.cardHeaderTitlePurple}>Commission and GST (Depends on order fare)</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.fareTitle}>Hozify's Commission</Text>
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1,  },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', flex: 1 },

  tabContainer: { flexDirection: 'row', marginHorizontal: 20, backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginBottom: 20, elevation: 2, boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)'},
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#0F172A' },
  tabText: { fontSize: 14, fontWeight: '500', color: '#64748B' },
  tabTextActive: { fontWeight: '700', color: '#0F172A' },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  fareCard: { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', marginBottom: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  cardHeaderGreen: { backgroundColor: '#DCFCE7', padding: 12, paddingHorizontal: 16 },
  cardHeaderTitleGreen: { color: '#166534', fontSize: 12, fontWeight: '700' },
  cardHeaderPurple: { backgroundColor: 'rgba(26, 15, 163, 1.00)', padding: 12, paddingHorizontal: 16 },
  cardHeaderTitlePurple: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  
  cardBody: { padding: 16 },
  fareRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  fareInfo: { flex: 1, paddingRight: 16 },
  fareTitle: { fontSize: 13, fontWeight: '600', color: '#1E293B', marginBottom: 4 },
  fareSub: { fontSize: 11, color: '#64748B' },
  
  subFareList: { paddingLeft: 24, marginTop: 12, position: 'relative' },
  verticalLine: { position: 'absolute', left: 8, top: 4, bottom: 4, width: 1, backgroundColor: '#E2E8F0', borderStyle: 'dashed' },
  subFareRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  subFareLabel: { fontSize: 12, color: '#64748B' },
  subFareAmount: { fontSize: 12, color: '#64748B' },
  amountBold: { fontWeight: '700', color: '#1E293B' },
  
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 },

  amountBoldDark: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  amountLight: { fontWeight: '400', color: '#64748B' },
});
