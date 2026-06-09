import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image, BackHandler, Animated, Dimensions, Switch, Modal } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import {
  MenuIcon, BellIcon, LocationPinIcon, WalletTabIcon,
  ServiceIcon, BookingsTabIcon, ReceiptIcon, DocumentIcon, InfoCircleIcon as InfoIcon,
  TrendingUpIcon, BranchIcon, EmployeeIcon, UserGroupIcon, BuildingIcon,
  StarIcon, ShieldIcon, RibbonIcon,
} from '@/components/ui/Icons';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { useAuthStore } from '@/store/authStore';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.68;

// ── inline SVG icons for drawer ──────────────────────────────────────────────
const ChevronRight = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18L15 12L9 6" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const CardIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="5" width="20" height="14" rx="2" stroke="#64748B" strokeWidth="1.5" />
    <Path d="M2 10H22" stroke="#64748B" strokeWidth="1.5" />
  </Svg>
);
const HelpIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke="#64748B" strokeWidth="1.5" />
    <Path d="M9.09 9C9.33 8.33 9.79 7.77 10.4 7.41C11.01 7.05 11.73 6.92 12.43 7.04C13.13 7.16 13.76 7.52 14.22 8.06C14.67 8.61 14.92 9.29 14.92 10C14.92 12 11.92 13 11.92 13" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M12 17H12.01" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);
const ReferIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M9 14L4 9L9 4" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M4 9H15C17.76 9 20 11.24 20 14C20 16.76 17.76 19 15 19H14" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const SliderIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M4 21V14M4 10V3M12 21V12M12 8V3M20 21V16M20 12V3M2 14H6M10 8H14M18 16H22" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
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

// ── feature grids ─────────────────────────────────────────────────────────────
const FC = '#3B82F6';
const ISP_FEATURES = [
  { label: 'Performance',      icon: TrendingUpIcon,  route: '/(dashboard)/performance' },
  { label: 'Services',         icon: ServiceIcon,     route: '/(tabs)/services' },
  { label: 'Service Area',     icon: LocationPinIcon, route: '/(tabs)/service-area' },
  { label: 'Live Bookings',    icon: BookingsTabIcon, route: '/(dashboard)/bookings' },
  { label: 'Instructions',     icon: InfoIcon,        route: '/(dashboard)/instructions' },
  { label: 'Booking Earnings', icon: ReceiptIcon,     route: '/(dashboard)/earnings' },
];
const BS_FEATURES = [
  { label: 'Performance',               icon: TrendingUpIcon,  route: '/(dashboard)/performance' },
  { label: 'Business',                  icon: BuildingIcon,    route: '/(tabs)/business' },
  { label: 'Branch',                    icon: BranchIcon,      route: '/(tabs)/branch' },
  { label: 'Employees',                 icon: EmployeeIcon,    route: '/(tabs)/employee' },
  { label: 'Services',                  icon: ServiceIcon,     route: '/(tabs)/services' },
  { label: 'Service Area',              icon: LocationPinIcon, route: '/(tabs)/service-area' },
  { label: 'Live Quotations',           icon: RibbonIcon,      route: '/(dashboard)/seller/quotation-requests' },
  { label: 'Live Orders',               icon: BookingsTabIcon, route: '/(dashboard)/orders-list' },
  { label: 'Instructions',              icon: InfoIcon,        route: '/(dashboard)/instructions' },
  { label: 'Branch & Service\nMapping', icon: MappingIcon,     route: '/(tabs)/mapping' },
  { label: 'Order Earnings',            icon: ReceiptIcon,     route: '/(dashboard)/booking-earnings' },
  { label: 'Order History',             icon: ReceiptIcon,     route: '/(dashboard)/order-history' },
  { label: 'Quotation\nHistory',        icon: DocumentIcon,    route: '/(dashboard)/quotation-history' },
];
const BSP_FEATURES = [
  { label: 'Performance',       icon: TrendingUpIcon,  route: '/(dashboard)/performance' },
  { label: 'Business',          icon: BuildingIcon,    route: '/(tabs)/business' },
  { label: 'Branch',            icon: BranchIcon,      route: '/(tabs)/branch' },
  { label: 'Employees',         icon: EmployeeIcon,    route: '/(tabs)/employee' },
  { label: 'Services',          icon: ServiceIcon,     route: '/(tabs)/services' },
  { label: 'Service Area',      icon: LocationPinIcon, route: '/(tabs)/service-area' },
  { label: 'Live Bookings',     icon: BookingsTabIcon, route: '/(dashboard)/bookings' },
  { label: 'Instructions',      icon: InfoIcon,        route: '/(dashboard)/instructions' },
  { label: 'Employee Assign',   icon: UserGroupIcon,   route: '/(tabs)/add-employee' },
  { label: 'Branch & Service\nMapping', icon: MappingIcon, route: '/(tabs)/mapping' },
  { label: 'Booking Earnings',  icon: ReceiptIcon,     route: '/(dashboard)/booking-earnings' },
  { label: 'Booking History',   icon: HistoryIcon,     route: '/(dashboard)/booking-history' },
];

export default function HomeScreen() {
  useAndroidBack(() => { BackHandler.exitApp(); });

  const router = useSafeRouter();
  const role = useAuthStore(state => state.role);
  const insets = useSafeAreaInsets();
  const [isOffDuty, setIsOffDuty] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  // Reset drawer when screen loses focus (navigating away), so it's closed on return
  useFocusEffect(useCallback(() => {
    return () => {
      translateX.setValue(-DRAWER_WIDTH);
      setDrawerOpen(false);
    };
  }, [translateX]));

  const openDrawer = () => {
    setDrawerOpen(true);
    translateX.setValue(0);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    translateX.setValue(-DRAWER_WIDTH);
  };

  const navigateFrom = (route: string) => {
    closeDrawer();
    setTimeout(() => router.push(route as any), 220);
  };

  const getMenuItems = () => {
    const items: { id: string; title: string; icon: React.ReactNode; route: string }[] = [
      { id: 'status',        title: 'Partner Approval Status', icon: <CardIcon />,                              route: '/(dashboard)/application-status' },
      { id: 'help',          title: 'Help',                    icon: <HelpIcon />,                              route: '/(dashboard)/help-advanced' },
      { id: 'payment',       title: 'Payment',                 icon: <CardIcon />,                              route: '/(dashboard)/payment-method' },
      { id: 'bookings',      title: 'My Bookings',             icon: <BookingsTabIcon size={20} color="#64748B" />, route: '/(dashboard)/bookings' },
      { id: 'safety',        title: 'Safety',                  icon: <ShieldIcon size={20} color="#64748B" />,  route: '/(dashboard)/safety' },
      { id: 'refer',         title: 'Refer and Earn',          icon: <ReferIcon />,                             route: '/(dashboard)/referral' },
      { id: 'notifications', title: 'Notifications',           icon: <BellIcon size={20} color="#64748B" />,    route: '/(dashboard)/notifications' },
      { id: 'settings',      title: 'Settings',                icon: <SliderIcon />,                            route: '/(dashboard)/settings' },
      { id: 'earning',       title: 'My Earning',              icon: <ReceiptIcon size={20} color="#64748B" />, route: '/(dashboard)/earnings' },
      { id: 'rating',        title: 'My Rating',               icon: <StarIcon size={20} color="#64748B" />,    route: '/(dashboard)/my-rating' },
      { id: 'kyc',           title: 'KYC Documents',           icon: <CardIcon />,                              route: '/(tabs)/kyc' },
    ];
    if (role === 'ISP' || role === 'BSP') {
      items.push({ id: 'services',    title: 'Partner Service',      icon: <ServiceIcon size={20} color="#64748B" />,     route: '/(tabs)/services' });
      items.push({ id: 'servicearea', title: 'Service Area',         icon: <LocationPinIcon size={20} color="#64748B" />, route: '/(tabs)/service-area' });
    }
    if (role === 'BS') {
      items.push({ id: 'sellersvcs',  title: 'Seller Services',      icon: <ServiceIcon size={20} color="#64748B" />,     route: '/(tabs)/services' });
      items.push({ id: 'servicearea', title: 'Service Area',         icon: <LocationPinIcon size={20} color="#64748B" />, route: '/(tabs)/service-area' });
    }
    if (role === 'BSP' || role === 'BS') {
      items.push({ id: 'bizprof',  title: 'Business Profile',   icon: <CardIcon />, route: '/(auth)/business-profile' });
      items.push({ id: 'bizdocs',  title: 'Business Documents', icon: <CardIcon />, route: '/(tabs)/business' });
      items.push({ id: 'bizbranch',title: 'Business Branch',    icon: <CardIcon />, route: '/(tabs)/branch' });
    }
    if (role === 'BSP') {
      items.push({ id: 'branchmap', title: 'Branch Mapping',       icon: <CardIcon />, route: '/(tabs)/mapping' });
      items.push({ id: 'employee',  title: 'Employee Management',   icon: <CardIcon />, route: '/(tabs)/employee' });
    }
    return items;
  };

  const FEATURES = role === 'BSP' ? BSP_FEATURES : role === 'BS' ? BS_FEATURES : ISP_FEATURES;
  const featureRows: typeof FEATURES[] = [];
  for (let i = 0; i < FEATURES.length; i += 4) featureRows.push(FEATURES.slice(i, i + 4));

  return (
    <GradientBackground style={styles.container}>

      {/* Screen content — rendered first (below drawer in z-order) */}
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton} activeOpacity={0.7} hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }} onPress={() => { console.log('hamburger pressed'); openDrawer(); }}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path d="M3 6H21M3 12H21M3 18H21" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
            </Svg>
          </TouchableOpacity>

          <TouchableOpacity style={styles.profileSection} onPress={() => router.push('/(dashboard)/profile')}>
            <Image source={{ uri: 'https://i.pravatar.cc/150?img=12' }} style={styles.avatarImage} />
            <Text style={styles.greetingText}>Hi Eswar P</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dutyToggle, !isOffDuty && styles.dutyToggleOn]}
            onPress={() => { setIsOffDuty(!isOffDuty); if (isOffDuty) router.push('/(dashboard)/account-status'); }}
          >
            {isOffDuty && <View style={styles.dutyDot} />}
            <Text style={[styles.dutyText, !isOffDuty && styles.dutyTextOn]}>{isOffDuty ? 'OFF DUTY' : 'ON DUTY'}</Text>
            {!isOffDuty && <View style={styles.dutyDotOn} />}
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(dashboard)/location')}>
            <LocationPinIcon size={24} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(dashboard)/notifications')}>
            <BellIcon size={24} color="#0F172A" />
            <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.mainContent}>
            <View style={styles.quickActionsContainer}>
              {featureRows.map((row, rowIndex) => (
                <View key={rowIndex} style={[styles.quickActionsRow, row.length < 4 && styles.quickActionsRowStart]}>
                  {row.map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <View key={feature.label} style={styles.actionItem}>
                        <TouchableOpacity style={styles.actionCircle} onPress={() => router.push(feature.route as any)}>
                          <Icon size={30} color={FC} />
                        </TouchableOpacity>
                        <Text style={styles.actionText}>{feature.label}</Text>
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>

            <View style={styles.cardsContainer}>
              <TouchableOpacity style={styles.card} onPress={() => router.push('/(dashboard)/wallet')}>
                <View style={styles.cardHeader}><WalletTabIcon size={12} color="#64748B" /><Text style={styles.cardTitle}>Wallet Balance</Text></View>
                <Text style={styles.cardAmount}>₹0</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.card} onPress={() => router.push('/(dashboard)/earnings')}>
                <View style={styles.cardHeader}><WalletTabIcon size={12} color="#64748B" /><Text style={styles.cardTitle}>Today's Earnings</Text></View>
                <Text style={styles.cardAmount}>₹0</Text>
              </TouchableOpacity>
              <View style={styles.card}>
                <View style={styles.cardHeader}><WalletTabIcon size={12} color="#64748B" /><Text style={styles.cardTitle}>Total Earnings</Text></View>
                <Text style={styles.cardAmount}>₹0</Text>
              </View>
            </View>
          </View>

          <View style={styles.bottomSection}>
            <TouchableOpacity style={styles.rateCardContainer} onPress={() => router.push('/(dashboard)/rate-card')}>
              <InfoCircleIcon size={16} color="#3B82F6" />
              <Text style={styles.rateCardText}>View Rate Card</Text>
            </TouchableOpacity>
            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Powered by </Text>
              <Text style={styles.footerTextBold}>RIT Cloud Solutions pvt. ltd</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* ── Drawer via Modal (guaranteed above everything) ── */}
      <Modal visible={drawerOpen} transparent animationType="none" onRequestClose={closeDrawer} statusBarTranslucent>
        <View style={StyleSheet.absoluteFill}>
          {/* Full backdrop */}
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={closeDrawer}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' }} />
          </TouchableOpacity>

          {/* Drawer panel — slides in from left */}
          <Animated.View style={[styles.drawer, { transform: [{ translateX }], paddingTop: insets.top }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
              {/* Profile row */}
              <TouchableOpacity style={styles.drawerProfile} activeOpacity={0.85} onPress={() => navigateFrom('/(dashboard)/profile-details')}>
                <Image source={{ uri: 'https://i.pravatar.cc/150?u=ujjwal' }} style={styles.drawerAvatar} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.drawerName}>Ujjwal Kumar</Text>
                  <Text style={styles.drawerPhone}>9573447204</Text>
                </View>
                <View style={styles.drawerRating}>
                  <Text style={styles.drawerRatingText}>5.0</Text>
                  <StarIcon size={12} color="#F97316" />
                </View>
                <ChevronRight />
              </TouchableOpacity>

              {/* Online toggle */}
              <View style={styles.drawerToggle}>
                <Text style={styles.drawerToggleLabel}>Vendor is Online</Text>
                <Switch value={isOnline} onValueChange={setIsOnline} trackColor={{ false: '#CBD5E1', true: '#1A0FA3' }} thumbColor="#FFFFFF" />
              </View>

              {/* Menu */}
              <View style={styles.drawerMenu}>
                {getMenuItems().map((item, index, arr) => (
                  <View key={item.id}>
                    <TouchableOpacity style={styles.drawerMenuItem} activeOpacity={0.7} onPress={() => navigateFrom(item.route)}>
                      <View style={styles.drawerMenuIcon}>{item.icon}</View>
                      <Text style={styles.drawerMenuText}>{item.title}</Text>
                      <ChevronRight />
                    </TouchableOpacity>
                    {index < arr.length - 1 && <View style={styles.drawerDivider} />}
                  </View>
                ))}
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: 0 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16, zIndex: 1 },
  menuButton: { marginRight: 8, padding: 6, zIndex: 2 },
  profileSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatarImage: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  greetingText: { fontSize: 11, fontWeight: '700', color: '#0F172A' },

  dutyToggle: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 16, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: '#E2E8F0', marginRight: 8 },
  dutyToggleOn: { borderColor: '#22C55E' },
  dutyDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1', marginRight: 6 },
  dutyDotOn: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#22C55E', marginLeft: 6 },
  dutyText: { fontSize: 9, fontWeight: '700', color: '#64748B' },
  dutyTextOn: { color: '#22C55E' },

  iconButton: { padding: 4, marginLeft: 2, position: 'relative' },
  badge: { position: 'absolute', top: 2, right: 2, backgroundColor: '#EF4444', width: 14, height: 14, borderRadius: 7, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FFFFFF' },
  badgeText: { color: '#FFFFFF', fontSize: 8, fontWeight: '700' },

  scrollContent: { flexGrow: 1, paddingBottom: 16 },
  mainContent: { flex: 1 },
  bottomSection: { alignItems: 'center', paddingBottom: 0 },

  quickActionsContainer: { paddingHorizontal: 16, marginTop: 24, marginBottom: 32, gap: 20 },
  quickActionsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  quickActionsRowStart: { flexDirection: 'row', justifyContent: 'flex-start', gap: 0 },
  actionItem: { alignItems: 'center', width: '25%' },
  actionCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: 'rgba(26, 15, 163, 1.00)', justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  actionText: { fontSize: 10, color: '#64748B', fontWeight: '500', textAlign: 'center' },

  cardsContainer: { paddingHorizontal: 12, flexDirection: 'row', gap: 8 },
  card: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 10, paddingHorizontal: 10, borderWidth: 1, borderColor: '#F1F5F9' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 4 },
  cardTitle: { fontSize: 9, color: '#94A3B8', fontWeight: '500', flex: 1 },
  cardAmount: { fontSize: 18, fontWeight: '800', color: '#0F172A' },

  rateCardContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16, marginBottom: 12 },
  rateCardText: { fontSize: 12, color: '#3B82F6', fontWeight: '600' },
  footerContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  footerText: { fontSize: 10, color: '#94A3B8' },
  footerTextBold: { fontSize: 10, color: '#0F172A', fontWeight: '700' },

  // ── Drawer ──
  drawer: {
    position: 'absolute', top: 0, left: 0, bottom: 0,
    width: DRAWER_WIDTH, backgroundColor: '#F8FAFC',
    elevation: 24,
    shadowColor: '#000', shadowOffset: { width: 4, height: 0 }, shadowOpacity: 0.15, shadowRadius: 12,
  },
  drawerProfile: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 24, paddingBottom: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  drawerAvatar: { width: 52, height: 52, borderRadius: 26, marginRight: 12, borderWidth: 2, borderColor: '#E2E8F0' },
  drawerName: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  drawerPhone: { fontSize: 12, color: '#64748B', marginTop: 2 },
  drawerRating: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF7ED', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 10 },
  drawerRatingText: { fontSize: 12, fontWeight: '700', color: '#0F172A', marginRight: 4 },
  drawerToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', marginHorizontal: 16, marginTop: 14, padding: 14, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0' },
  drawerToggleLabel: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  drawerMenu: { backgroundColor: '#FFFFFF', borderRadius: 16, marginHorizontal: 16, marginTop: 14, paddingVertical: 4 },
  drawerMenuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  drawerMenuIcon: { width: 24, alignItems: 'center', marginRight: 14 },
  drawerMenuText: { flex: 1, fontSize: 13, color: '#334155', fontWeight: '500' },
  drawerDivider: { height: 1, backgroundColor: '#F1F5F9', marginLeft: 54, marginRight: 16 },
});
