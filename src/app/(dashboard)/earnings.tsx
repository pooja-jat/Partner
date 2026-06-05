import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Rect, Defs, LinearGradient, Stop, Path, Circle } from 'react-native-svg';
import MoneyTransferModal from '@/components/common/MoneyTransferModal';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const CashIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="6" width="20" height="12" rx="2" stroke="#16A34A" strokeWidth="1.5" />
    <Circle cx="12" cy="12" r="3" stroke="#16A34A" strokeWidth="1.5" />
    <Path d="M2 9h20M2 15h20" stroke="#16A34A" strokeWidth="1.5" strokeOpacity="0.3" />
  </Svg>
);

const YoutubeIcon = () => (
  <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="5" width="20" height="14" rx="4" stroke="#DC2626" strokeWidth="2" />
    <Path d="M10 9l6 3-6 3V9z" fill="#DC2626" />
  </Svg>
);

export default function EarningsScreen() {
  useAndroidBack(() => router.push('/(dashboard)/profile'));
  const router = useSafeRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'wallet'>('all');
  const [isTransferModalVisible, setTransferModalVisible] = useState(false);

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/(dashboard)/profile')} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Earnings</Text>
          
          <TouchableOpacity style={styles.helpBtn} onPress={() => router.push('/(dashboard)/help-advanced')}>
            <View style={StyleSheet.absoluteFill}>
              <Svg height="100%" width="100%" style={{ borderRadius: 8 }}>
                <Defs>
                  <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0" stopColor="#F97316" stopOpacity="1" />
                    <Stop offset="1" stopColor="#FBBF24" stopOpacity="1" />
                  </LinearGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#grad)" rx="8" />
              </Svg>
            </View>
            <Text style={styles.helpBtnText}>Help</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentArea}>
          
          <View style={styles.tabsRow}>
            <TouchableOpacity 
              style={[styles.tabBtn, activeTab === 'all' && styles.activeTabBtn]} 
              onPress={() => setActiveTab('all')}
            >
              <Text style={activeTab === 'all' ? styles.activeTabText : styles.inactiveTabText}>All Earnings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tabBtn, activeTab === 'wallet' && styles.activeTabBtn]}
              onPress={() => setActiveTab('wallet')}
            >
              <Text style={activeTab === 'wallet' ? styles.activeTabText : styles.inactiveTabText}>Wallet</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            {activeTab === 'all' ? (
              <View style={styles.tabContent}>
                
                {/* Subscription Plans Card */}
                <TouchableOpacity style={styles.subCard} onPress={() => router.push('/(dashboard)/rewards-plan')}>
                  <View style={styles.subCardLeft}>
                    <Text style={styles.subCardTitle}>Subscription Plans</Text>
                    <Text style={styles.subCardDesc}>Ride at ₹0 Commission</Text>
                    <View style={styles.bikeBadge}>
                      <Text style={styles.bikeBadgeText}>Bike</Text>
                    </View>
                  </View>
                  
                  <View style={styles.subCardGraphic}>
                    <View style={styles.purpleShape}>
                      <Text style={styles.purpleShapeText}>0</Text>
                    </View>
                    <View style={styles.brownShape} />
                  </View>
                </TouchableOpacity>

                {/* Info Card */}
                <TouchableOpacity style={styles.infoCard} onPress={() => setTransferModalVisible(true)}>
                  <View style={StyleSheet.absoluteFill}>
                    <Svg height="100%" width="100%" style={{ borderRadius: 16 }}>
                      <Defs>
                        <LinearGradient id="gradInfo" x1="0" y1="0" x2="1" y2="0">
                          <Stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
                          <Stop offset="1" stopColor="#F3E8FF" stopOpacity="0.8" />
                        </LinearGradient>
                      </Defs>
                      <Rect width="100%" height="100%" fill="url(#gradInfo)" rx="16" />
                    </Svg>
                  </View>
                  <Text style={styles.infoCardTitle}>Know all about your Earnings</Text>
                  <View style={styles.infoCardIcons}>
                    <View style={styles.cashIconWrap}>
                      <CashIcon />
                    </View>
                    <YoutubeIcon />
                  </View>
                </TouchableOpacity>

              </View>
            ) : (
              <View style={styles.tabContent}>
                <View style={styles.walletStateContainer}>
                  <Text style={styles.walletStateText}>Wallet Details Coming Soon</Text>
                  <TouchableOpacity style={styles.filterBtn} onPress={() => router.push('/(dashboard)/filters')}>
                    <Text style={styles.filterBtnText}>Open Filters</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

          </ScrollView>
        </View>
        
        <MoneyTransferModal 
          visible={isTransferModalVisible} 
          onClose={() => setTransferModalVisible(false)} 
        />

      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1,  },
  
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', flex: 1 },
  
  helpBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  helpBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },

  contentArea: { flex: 1, backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },

  tabsRow: { flexDirection: 'row', paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  tabBtn: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  activeTabBtn: { borderBottomWidth: 2, borderBottomColor: 'rgba(26, 15, 163, 1.00)' },
  activeTabText: { color: '#0F172A', fontSize: 13, fontWeight: '800' },
  inactiveTabText: { color: '#64748B', fontSize: 13, fontWeight: '600' },

  scrollContent: { padding: 20 },
  tabContent: { flex: 1 },

  subCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, flexDirection: 'row', borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16, overflow: 'hidden' },
  subCardLeft: { flex: 1, zIndex: 2 },
  subCardTitle: { fontSize: 14, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  subCardDesc: { fontSize: 11, color: '#475569', marginBottom: 12 },
  bikeBadge: { alignSelf: 'flex-start', borderColor: '#16A34A', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4 },
  bikeBadgeText: { color: '#16A34A', fontSize: 10, fontWeight: '700' },
  
  subCardGraphic: { position: 'absolute', right: -20, top: -20, bottom: -20, width: 120, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  purpleShape: { width: 80, height: 90, borderRadius: 40, backgroundColor: '#C084FC', justifyContent: 'center', alignItems: 'center', transform: [{ rotate: '-10deg' }] },
  purpleShapeText: { color: '#FFFFFF', fontSize: 32, fontWeight: '800', fontStyle: 'italic', marginTop: -10 },
  brownShape: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#D4A373', position: 'absolute', bottom: 20, right: 10, transform: [{ rotate: '20deg' }] },

  infoCard: { borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
  infoCardTitle: { fontSize: 13, color: '#0F172A', flex: 1, fontWeight: '500' },
  infoCardIcons: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cashIconWrap: { backgroundColor: '#FEF3C7', padding: 4, borderRadius: 6 },

  walletStateContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  walletStateText: { fontSize: 14, color: '#64748B', marginBottom: 20 },
  filterBtn: { backgroundColor: 'rgba(26, 15, 163, 1.00)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  filterBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
});
