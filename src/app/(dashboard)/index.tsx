import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import {
  MenuIcon, BellIcon, RibbonIcon, FilterSettingsIcon,
  LocationPinIcon, ListIcon, CalendarIcon, WalletTabIcon,
  ServiceIcon, BookingsTabIcon, ClockCircleIcon, ReceiptIcon, DocumentIcon, InfoCircleIcon as InfoIcon,
  TrendingUpIcon, BranchIcon, EmployeeIcon, UserGroupIcon, BuildingIcon,
} from '@/components/ui/Icons';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { useAuthStore } from '@/store/authStore';

const InfoCircleIcon = ({ size = 16, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
    <Path d="M12 11V16M12 8H12.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const MappingIcon = ({ size = 24, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 7L9 4L15 7L21 4V17L15 20L9 17L3 20V7Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    <Path d="M9 4V17M15 7V20" stroke={color} strokeWidth="1.5" />
  </Svg>
);

const HistoryIcon = ({ size = 24, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 8V12L14 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M3.05 11A9 9 0 1 0 4 7.4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M3 4V8H7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const FEATURE_COLOR = '#3B82F6';

// ISP role features (original set)
const ISP_FEATURES = [
  { label: 'Performance',      icon: TrendingUpIcon,  color: FEATURE_COLOR, route: '/(dashboard)/performance' },
  { label: 'Services',         icon: ServiceIcon,     color: FEATURE_COLOR, route: '/(tabs)/services' },
  { label: 'Service Area',     icon: LocationPinIcon, color: FEATURE_COLOR, route: '/(tabs)/service-area' },
  { label: 'Live Bookings',    icon: BookingsTabIcon, color: FEATURE_COLOR, route: '/(dashboard)/bookings' },
  { label: 'Instructions',     icon: InfoIcon,        color: FEATURE_COLOR, route: '/(dashboard)/instructions' },
  { label: 'Booking Earnings', icon: ReceiptIcon,     color: FEATURE_COLOR, route: '/(dashboard)/earnings' },
];

// BS role features — 13 items, 4 per row
const BS_FEATURES = [
  { label: 'Performance',               icon: TrendingUpIcon,  color: FEATURE_COLOR, route: '/(dashboard)/performance' },
  { label: 'Business',                  icon: BuildingIcon,    color: FEATURE_COLOR, route: '/(tabs)/business' },
  { label: 'Branch',                    icon: BranchIcon,      color: FEATURE_COLOR, route: '/(tabs)/branch' },
  { label: 'Employees',                 icon: EmployeeIcon,    color: FEATURE_COLOR, route: '/(tabs)/employee' },
  { label: 'Services',                  icon: ServiceIcon,     color: FEATURE_COLOR, route: '/(tabs)/services' },
  { label: 'Service Area',              icon: LocationPinIcon, color: FEATURE_COLOR, route: '/(tabs)/service-area' },
  { label: 'Live Quotations',           icon: RibbonIcon,      color: FEATURE_COLOR, route: '/(dashboard)/seller/quotation-requests' },
  { label: 'Live Orders',               icon: BookingsTabIcon, color: FEATURE_COLOR, route: '/(dashboard)/orders-list' },
  { label: 'Instructions',              icon: InfoIcon,        color: FEATURE_COLOR, route: '/(dashboard)/instructions' },
  { label: 'Branch & Service\nMapping', icon: MappingIcon,    color: FEATURE_COLOR, route: '/(tabs)/mapping' },
  { label: 'Order Earnings',            icon: ReceiptIcon,     color: FEATURE_COLOR, route: '/(dashboard)/booking-earnings' },
  { label: 'Order History',             icon: ReceiptIcon,     color: FEATURE_COLOR, route: '/(dashboard)/order-history' },
  { label: 'Quotation\nHistory',        icon: DocumentIcon,    color: FEATURE_COLOR, route: '/(dashboard)/quotation-history' },
];

// BSP role features — 13 items, 4 per row
const BSP_FEATURES = [
  { label: 'Performance',       icon: TrendingUpIcon,  color: FEATURE_COLOR, route: '/(dashboard)/performance' },
  { label: 'Business',          icon: BuildingIcon,    color: FEATURE_COLOR, route: '/(tabs)/business' },
  { label: 'Branch',            icon: BranchIcon,      color: FEATURE_COLOR, route: '/(tabs)/branch' },
  { label: 'Employees',         icon: EmployeeIcon,    color: FEATURE_COLOR, route: '/(tabs)/employee' },
  { label: 'Services',          icon: ServiceIcon,     color: FEATURE_COLOR, route: '/(tabs)/services' },
  { label: 'Service Area',      icon: LocationPinIcon, color: FEATURE_COLOR, route: '/(tabs)/service-area' },
  { label: 'Live Bookings',     icon: BookingsTabIcon, color: FEATURE_COLOR, route: '/(dashboard)/bookings' },
  { label: 'Instructions',      icon: InfoIcon,        color: FEATURE_COLOR, route: '/(dashboard)/instructions' },
  { label: 'Employee Assign',   icon: UserGroupIcon,   color: FEATURE_COLOR, route: '/(tabs)/add-employee' },
  { label: 'Branch & Service\nMapping', icon: MappingIcon, color: FEATURE_COLOR, route: '/(tabs)/mapping' },
  { label: 'Booking Earnings',  icon: ReceiptIcon,     color: FEATURE_COLOR, route: '/(dashboard)/booking-earnings' },
  { label: 'Booking History',   icon: HistoryIcon,     color: FEATURE_COLOR, route: '/(dashboard)/booking-history' },
];

export default function HomeScreen() {
  useAndroidBack(() => {
    BackHandler.exitApp();
  });
  const router = useSafeRouter();
  const [isOffDuty, setIsOffDuty] = useState(true);
  const role = useAuthStore(state => state.role);

  const FEATURES = role === 'BSP' ? BSP_FEATURES : role === 'BS' ? BS_FEATURES : ISP_FEATURES;

  // Split features into rows of 4
  const featureRows: typeof FEATURES[] = [];
  for (let i = 0; i < FEATURES.length; i += 4) {
    featureRows.push(FEATURES.slice(i, i + 4));
  }

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton}>
            <MenuIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.profileSection} onPress={() => router.push('/(dashboard)/profile')}>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/150?img=12' }} 
              style={styles.avatarImage} 
            />
            <Text style={styles.greetingText}>Hi Eswar P</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.dutyToggle, !isOffDuty && styles.dutyToggleOn]} 
            onPress={() => {
              setIsOffDuty(!isOffDuty);
              if (isOffDuty) {
                router.push('/(dashboard)/account-status');
              }
            }}
          >
            {isOffDuty && <View style={styles.dutyDot} />}
            <Text style={[styles.dutyText, !isOffDuty && styles.dutyTextOn]}>
              {isOffDuty ? 'OFF DUTY' : 'ON DUTY'}
            </Text>
            {!isOffDuty && <View style={styles.dutyDotOn} />}
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(dashboard)/location')}>
            <LocationPinIcon size={24} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(dashboard)/notifications')}>
            <BellIcon size={24} color="#0F172A" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.mainContent}>
          {/* Quick Actions Grid */}
          <View style={styles.quickActionsContainer}>
            {featureRows.map((row, rowIndex) => (
              <View
                key={rowIndex}
                style={[
                  styles.quickActionsRow,
                  row.length < 4 && styles.quickActionsRowStart,
                ]}
              >
                {row.map((feature) => {
                  const IconComponent = feature.icon;
                  return (
                    <View key={feature.label} style={styles.actionItem}>
                      <TouchableOpacity
                        style={styles.actionCircle}
                        onPress={() => router.push(feature.route as any)}
                      >
                        <IconComponent size={30} color={feature.color} />
                      </TouchableOpacity>
                      <Text style={styles.actionText}>{feature.label}</Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>

          {/* Cards */}
          <View style={styles.cardsContainer}>
            <TouchableOpacity style={styles.card} onPress={() => router.push('/(dashboard)/wallet')}>
              <View style={styles.cardHeader}>
                <WalletTabIcon size={12} color="#64748B" />
                <Text style={styles.cardTitle}>Wallet Balance</Text>
              </View>
              <Text style={styles.cardAmount}>₹0</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={() => router.push('/(dashboard)/earnings')}>
              <View style={styles.cardHeader}>
                <WalletTabIcon size={12} color="#64748B" />
                <Text style={styles.cardTitle}>Today's Earnings</Text>
              </View>
              <Text style={styles.cardAmount}>₹0</Text>
            </TouchableOpacity>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <WalletTabIcon size={12} color="#64748B" />
                <Text style={styles.cardTitle}>Total Earnings</Text>
              </View>
              <Text style={styles.cardAmount}>₹0</Text>
            </View>
          </View>
          </View>

          <View style={styles.bottomSection}>
          {/* Rate Card Link */}
          <TouchableOpacity 
            style={styles.rateCardContainer}
            onPress={() => router.push('/(dashboard)/rate-card')}
          >
            <InfoCircleIcon size={16} color="#3B82F6" />
            <Text style={styles.rateCardText}>View Rate Card</Text>
          </TouchableOpacity>

          {/* Footer Text */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Powered by </Text>
            <Text style={styles.footerTextBold}>RIT Cloud Solutions pvt. ltd</Text>
          </View>
          </View>
        </ScrollView>
      </SafeAreaView>

    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    paddingHorizontal: 16, paddingVertical: 12
  },
  menuButton: { marginRight: 8 },
  profileSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatarImage: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  greetingText: { fontSize: 11, fontWeight: '700', color: '#0F172A' },
  
  dutyToggle: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', 
    borderRadius: 16, paddingHorizontal: 8, paddingVertical: 4, 
    borderWidth: 1, borderColor: '#E2E8F0', marginRight: 8 
  },
  dutyToggleOn: { borderColor: '#22C55E' },
  dutyDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1', marginRight: 6 },
  dutyDotOn: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#22C55E', marginLeft: 6 },
  dutyText: { fontSize: 9, fontWeight: '700', color: '#64748B' },
  dutyTextOn: { color: '#22C55E' },
  
  iconButton: { padding: 4, marginLeft: 2, position: 'relative' },
  badge: { 
    position: 'absolute', top: 2, right: 2, backgroundColor: '#EF4444', 
    width: 14, height: 14, borderRadius: 7, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#FFFFFF'
  },
  badgeText: { color: '#FFFFFF', fontSize: 8, fontWeight: '700' },

  scrollContent: { flexGrow: 1, paddingBottom: 16 },
  mainContent: { flex: 1 },
  bottomSection: { alignItems: 'center', paddingBottom: 0 },

  quickActionsContainer: {
    paddingHorizontal: 16, marginTop: 24, marginBottom: 32, gap: 20,
  },
  quickActionsRow: {
    flexDirection: 'row', justifyContent: 'space-between',
  },
  quickActionsRowStart: {
    flexDirection: 'row', justifyContent: 'flex-start', gap: 0,
  },
  actionItem: { alignItems: 'center', width: '25%' },
  actionCircle: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFFFFF',
    borderWidth: 2, borderColor: 'rgba(26, 15, 163, 1.00)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 6,
  },
  actionText: { fontSize: 10, color: '#64748B', fontWeight: '500', textAlign: 'center' },

  cardsContainer: { paddingHorizontal: 12, flexDirection: 'row', gap: 8 },
  card: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 10, paddingHorizontal: 10,
    borderWidth: 1, borderColor: '#F1F5F9',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 4 },
  cardTitle: { fontSize: 9, color: '#94A3B8', fontWeight: '500', flex: 1 },
  cardAmount: { fontSize: 18, fontWeight: '800', color: '#0F172A' },

  rateCardContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16, marginBottom: 12 },
  rateCardText: { fontSize: 12, color: '#3B82F6', fontWeight: '600' },

  footerContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  footerText: { fontSize: 10, color: '#94A3B8' },
  footerTextBold: { fontSize: 10, color: '#0F172A', fontWeight: '700' },

});
