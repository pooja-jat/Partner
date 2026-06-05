import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Path, Circle } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const ChevronLeft = ({ color = '#3B82F6' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M15 18L9 12L15 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronRight = ({ color = '#3B82F6' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M9 18L15 12L9 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const StarIcon = ({ color = '#64748B' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ClockIcon = ({ color = '#64748B' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    <Path d="M12 8V12L15 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ProgressCircle = ({ current, total }: { current: number, total: number }) => {
  const radius = 60;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (current / total) * circumference;

  return (
    <View style={styles.chartContainer}>
      <Svg width="140" height="140" viewBox="0 0 140 140">
        <Circle cx="70" cy="70" r={radius} stroke="#E2E8F0" strokeWidth={strokeWidth} fill="none" />
        <Circle 
          cx="70" cy="70" r={radius} 
          stroke="rgba(26, 15, 163, 1.00)" strokeWidth={strokeWidth} 
          fill="none" 
          strokeDasharray={circumference} 
          strokeDashoffset={strokeDashoffset} 
          strokeLinecap="round" 
          transform="rotate(-90 70 70)"
        />
      </Svg>
      <View style={styles.chartTextContainer}>
        <Text style={styles.chartText}>{`${current}/${total}`}</Text>
      </View>
    </View>
  );
};

export default function PerformanceScreen() {
  useAndroidBack();
  const router = useSafeRouter();
  const [activeTab, setActiveTab] = useState('Day');

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Performance</Text>
          <TouchableOpacity style={styles.helpBtn} onPress={() => router.push('/(dashboard)/help-advanced')}>
            <Text style={styles.helpBtnText}>Help</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.mainCard}>
            
            {/* Tabs */}
            <View style={styles.tabsRow}>
              {['Day', 'Week', 'Month'].map(tab => (
                <TouchableOpacity 
                  key={tab} 
                  style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Date Scroller */}
            <View style={styles.dateScrollRow}>
              <TouchableOpacity style={styles.dateArrow}><ChevronLeft /></TouchableOpacity>
              <View style={styles.datePill}><Text style={styles.dateDay}>Mon</Text><Text style={styles.dateNum}>06</Text></View>
              <View style={styles.datePill}><Text style={styles.dateDay}>Tue</Text><Text style={styles.dateNum}>07</Text></View>
              <View style={styles.datePillActive}><Text style={styles.dateDayActive}>Wed</Text><Text style={styles.dateNumActive}>08</Text></View>
              <TouchableOpacity style={styles.dateArrow}><ChevronRight /></TouchableOpacity>
            </View>

            {/* Chart */}
            <ProgressCircle current={4} total={20} />
            <Text style={styles.acceptTitle}>Accept 20 Orders</Text>
            <Text style={styles.acceptSub}>to see your performance</Text>
            
            <View style={styles.infoBanner}>
              <Text style={styles.infoBannerText}>Bike Lite, Parcel and Bike only</Text>
            </View>

            {/* Categories */}
            <Text style={styles.sectionTitle}>By Category</Text>
            
            <View style={styles.categoryRow}>
              <View style={styles.categoryLeft}>
                <View style={styles.dot} />
                <Text style={styles.categoryName}>Deep Cleaning</Text>
              </View>
              <Text style={styles.categoryValue}>2 bookings</Text>
            </View>
            <View style={styles.categoryRow}>
              <View style={styles.categoryLeft}>
                <View style={styles.dot} />
                <Text style={styles.categoryName}>Standard Cleaning</Text>
              </View>
              <Text style={styles.categoryValue}>1 bookings</Text>
            </View>
            <View style={styles.categoryRow}>
              <View style={styles.categoryLeft}>
                <View style={styles.dot} />
                <Text style={styles.categoryName}>Move Out</Text>
              </View>
              <Text style={styles.categoryValue}>1 bookings</Text>
            </View>

            {/* Overview */}
            <Text style={styles.sectionTitle}>Overview</Text>
            
            <View style={styles.overviewRow}>
              <View style={styles.overviewBox}>
                <View style={styles.overviewHeader}>
                  <StarIcon />
                  <Text style={styles.overviewLabel}>Rating</Text>
                </View>
                <Text style={styles.overviewValue}>4.9</Text>
              </View>
              <View style={styles.overviewBox}>
                <View style={styles.overviewHeader}>
                  <ClockIcon />
                  <Text style={styles.overviewLabel}>Response</Text>
                </View>
                <Text style={styles.overviewValue}>1h</Text>
              </View>
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
  helpBtn: { backgroundColor: '#F97316', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  helpBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  mainCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20 },
  
  tabsRow: { flexDirection: 'row', backgroundColor: '#F8FAFC', borderRadius: 12, padding: 4, marginBottom: 24 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  tabBtnActive: { backgroundColor: 'rgba(26, 15, 163, 1.00)' },
  tabText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  tabTextActive: { color: '#FFFFFF' },

  dateScrollRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 },
  dateArrow: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  datePill: { backgroundColor: '#F8FAFC', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, alignItems: 'center' },
  datePillActive: { backgroundColor: 'rgba(26, 15, 163, 1.00)', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, alignItems: 'center' },
  dateDay: { fontSize: 11, color: '#64748B', marginBottom: 4 },
  dateNum: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  dateDayActive: { fontSize: 11, color: '#E2E8F0', marginBottom: 4 },
  dateNumActive: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },

  chartContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  chartTextContainer: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  chartText: { fontSize: 20, fontWeight: '800', color: 'rgba(26, 15, 163, 1.00)' },

  acceptTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', textAlign: 'center', marginBottom: 4 },
  acceptSub: { fontSize: 12, color: '#475569', textAlign: 'center', marginBottom: 16 },

  infoBanner: { backgroundColor: '#F8FAFC', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginBottom: 24 },
  infoBannerText: { fontSize: 11, color: '#0F172A', fontWeight: '500' },

  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 16 },

  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 12, borderRadius: 20, marginBottom: 12 },
  categoryLeft: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#3B82F6', marginRight: 8 },
  categoryName: { fontSize: 12, fontWeight: '600', color: '#0F172A' },
  categoryValue: { fontSize: 11, color: '#94A3B8' },

  overviewRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  overviewBox: { flex: 1, backgroundColor: '#F8FAFC', padding: 16, borderRadius: 20 },
  overviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  overviewLabel: { fontSize: 11, color: '#94A3B8', marginLeft: 6 },
  overviewValue: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
});
