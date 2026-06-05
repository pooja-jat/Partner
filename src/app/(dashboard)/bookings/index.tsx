import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Booking, UserSession, PartnerProfile } from '@/types/storage.types';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

// Custom inline SVG icons matching the screenshot UI
const SearchIcon = ({ size = 20, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2" />
    <Path d="M20 20L16 16" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const FilterIcon = ({ size = 18, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 6H20M7 12H17M10 18H14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CarIcon = ({ size = 16, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3C13 6.8 11.8 6 10.5 6H5C3.9 6 3 6.9 3 8v8c0 .6.4 1 1 1h2m3 0h6m5-5H3M7.5 20a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm10 0a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ClockIcon = ({ size = 16, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    <Path d="M12 6V12L16 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const UserIcon = ({ size = 16, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LocationIcon = ({ size = 16, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 21C16 16.8 19 12.8 19 9C19 5.13401 15.866 2 12 2C8.13401 2 5 5.13401 5 9C5 12.8 8 16.8 12 21Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="9" r="2.5" stroke={color} strokeWidth="1.5" />
  </Svg>
);

const SnowflakeIcon = ({ size = 20, color = '#1D4ED8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2V22M12 12L19 19M12 12L5 5M12 12L5 19M12 12L19 5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M9 4L12 7L15 4M15 20L12 17L9 20M20 9L17 12L20 15M4 15L7 12L4 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const WashingMachineIcon = ({ size = 20, color = '#059669' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="5" y="3" width="14" height="18" rx="2" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth="2" />
    <Circle cx="8" cy="6" r="1.5" fill={color} />
    <Circle cx="11" cy="6" r="1.5" fill={color} />
    <Path d="M5 9H19" stroke={color} strokeWidth="2" />
  </Svg>
);

const DropletIcon = ({ size = 20, color = '#C2410C' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2C12 2 19 9 19 13C19 16.866 15.866 20 12 20C8.13401 20 5 16.866 5 13C5 9 12 2 12 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

interface BookingDetails {
  serviceName: string;
  customerName: string;
  location: string;
  price: string;
  paymentLabel: string;
  paymentColor: string;
  statusLabel: string;
  statusBg: string;
  statusColor: string;
  dotColor: string;
  serviceIcon: React.ReactNode;
  iconBg: string;
  dateStr: string;
  timeStr: string;
}

export default function BookingsScreen() {
  useAndroidBack();
  const router = useSafeRouter();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [session, setSession] = useState<UserSession | null>(null);
  const [partnerProfile, setPartnerProfile] = useState<PartnerProfile | null>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('All');
  const [selectedPaymentType, setSelectedPaymentType] = useState('All');
  const [showPaymentTypeDropdown, setShowPaymentTypeDropdown] = useState(false);

  const TABS = [
    { id: 'All', label: 'All', icon: null },
    { id: 'On the way', label: 'On the way', icon: (color: string) => <CarIcon size={16} color={color} /> },
    { id: 'Upcoming', label: 'Upcoming', icon: (color: string) => <ClockIcon size={16} color={color} /> }
  ];

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const s = await StorageService.getUserSession();
        const p = await StorageService.getPartnerProfile();
        setSession(s);
        setPartnerProfile(p);
        
        let bks = await StorageService.getBookings();
        if (bks.length === 0 || bks.some(b => (b as any).paymentMethod === 'cash') || bks.length < 5) {
          // Initialize mock bookings with realistic data
          const dummies: Booking[] = [
            {
              bookingId: '#BK123456', userId: 'U1', serviceId: 'S1', branchId: 'BR1', employeeId: undefined, profAccepted: undefined,
              status: 'pending', paymentStatus: 'unpaid', paymentMethod: 'online', paymentLinkGenerated: false,
              checkInCode: '1234', completionOtp: '123456', scheduledTime: '5 May 2024 (Today)\n10:00 AM', location: 'A-101, Green Residency, Sector 45, Noida, UP - 201301', serviceRadius: 10
            },
            {
              bookingId: '#BK123457', userId: 'U2', serviceId: 'S2', branchId: 'BR1', employeeId: undefined, profAccepted: undefined,
              status: 'accepted', paymentStatus: 'paid', paymentMethod: 'online', paymentLinkGenerated: false,
              checkInCode: '4321', completionOtp: '654321', scheduledTime: '6 May 2024 (Tomorrow)\n11:30 AM', location: 'B-205, Sunshine Apartments, Sector 50, Noida, UP - 201301', serviceRadius: 15
            },
            {
              bookingId: '#BK123458', userId: 'U3', serviceId: 'S3', branchId: 'BR1', employeeId: 'EMP1', profAccepted: false,
              status: 'accepted', paymentStatus: 'paid', paymentMethod: 'online', paymentLinkGenerated: true,
              checkInCode: '1111', completionOtp: '222222', scheduledTime: '7 May 2024\n04:00 PM', location: 'C-205, Galaxy Tower, Sector 76, Noida, UP - 201301', serviceRadius: 20
            },
            {
              bookingId: '#BK123459', userId: 'U4', serviceId: 'S1', branchId: 'BR1', employeeId: 'EMP1', profAccepted: true,
              status: 'accepted', paymentStatus: 'paid', paymentMethod: 'online', paymentLinkGenerated: false,
              checkInCode: '5678', completionOtp: '987654', scheduledTime: '8 May 2024\n09:00 AM', location: 'D-312, Stellar Park, Sector 62, Noida, UP - 201301', serviceRadius: 12
            },
            {
              bookingId: '#BK123460', userId: 'U5', serviceId: 'S2', branchId: 'BR1', employeeId: 'EMP1', profAccepted: true,
              status: 'closed', paymentStatus: 'paid', paymentMethod: 'online', paymentLinkGenerated: false,
              checkInCode: '9999', completionOtp: '888888', scheduledTime: '9 May 2024\n04:30 PM', location: 'E-401, Purvanchal Royal Park, Sector 137, Noida, UP - 201301', serviceRadius: 18
            }
          ];
          await StorageService.setItem('BOOKINGS', dummies);
          bks = dummies;
        }

        // Apply role based filtering
        if (s?.role === 'ISP') {
          bks = bks.filter(b => b.serviceRadius <= 25);
        } else if (s?.role === 'Professional') {
          bks = bks.filter(b => b.employeeId === 'EMP1');
        }

        setBookings(bks);
      };
      loadData();
    }, [])
  );

  const getBookingDisplayDetails = (booking: Booking): BookingDetails => {
    let serviceName = booking.serviceId;
    let serviceIcon = <DropletIcon size={20} />;
    let iconBg = '#FFF7ED'; // light orange

    if (booking.serviceId === 'S1' || booking.serviceId.toLowerCase().includes('ac') || booking.serviceId.toLowerCase().includes('repair')) {
      serviceName = 'AC Repair';
      serviceIcon = <SnowflakeIcon size={20} />;
      iconBg = '#EFF6FF'; // light blue
    } else if (booking.serviceId === 'S2' || booking.serviceId.toLowerCase().includes('wash') || booking.serviceId.toLowerCase().includes('machine')) {
      serviceName = 'Washing Machine';
      serviceIcon = <WashingMachineIcon size={20} />;
      iconBg = '#F0FDF4'; // light green
    } else if (booking.serviceId === 'S3' || booking.serviceId.toLowerCase().includes('ro') || booking.serviceId.toLowerCase().includes('install')) {
      serviceName = 'RO Installation';
      serviceIcon = <DropletIcon size={20} />;
      iconBg = '#FFF7ED'; // light orange/brown
    }

    let customerName = `User ${booking.userId}`;
    let location = booking.location;
    if (booking.userId === 'U1') {
      customerName = 'Amit Kumar';
      location = 'A-101, Green Residency, Sector 45, Noida, UP - 201301';
    } else if (booking.userId === 'U2') {
      customerName = 'Priya Verma';
      location = 'B-205, Sunshine Apartments, Sector 50, Noida, UP - 201301';
    } else if (booking.userId === 'U3') {
      customerName = 'Neha Singh';
      location = 'C-205, Galaxy Tower, Sector 76, Noida, UP - 201301';
    } else if (booking.userId === 'U4') {
      customerName = 'Rajesh Sharma';
      location = 'D-312, Stellar Park, Sector 62, Noida, UP - 201301';
    } else if (booking.userId === 'U5') {
      customerName = 'Vikram Aditya';
      location = 'E-401, Purvanchal Royal Park, Sector 137, Noida, UP - 201301';
    }

    let price = '₹599';
    if (booking.userId === 'U1') price = '₹599';
    else if (booking.userId === 'U2') price = '₹649';
    else if (booking.userId === 'U3') price = '₹799';
    else if (booking.userId === 'U4') price = '₹549';
    else if (booking.userId === 'U5') price = '₹599';
    else price = '₹350';

    let paymentLabel = 'Pending';
    let paymentColor = '#EA580C'; // orange / pending

    if (booking.paymentStatus === 'paid') {
      paymentLabel = 'Paid';
      paymentColor = '#16A34A'; // green / paid
    }

    let statusLabel = 'Scheduled';
    let statusBg = '#F3E8FF'; // light purple
    let statusColor = '#7C3AED'; // purple
    let dotColor = '#7C3AED';

    if (booking.status === 'accepted' || booking.status === 'checked_in') {
      statusLabel = 'On the way';
      statusBg = '#EFF6FF'; // light blue
      statusColor = '#2563EB'; // blue
      dotColor = '#2563EB';
    } else if (booking.status === 'pending') {
      statusLabel = 'Upcoming';
      statusBg = '#FFEDD5'; // light orange
      statusColor = '#EA580C'; // orange
      dotColor = '#EA580C';
    } else if (booking.status === 'closed' || booking.status === 'completed') {
      statusLabel = 'Scheduled';
      statusBg = '#F3E8FF'; // light purple
      statusColor = '#7C3AED'; // purple
      dotColor = '#7C3AED';
    }

    // Split date & time
    const schedParts = booking.scheduledTime.split('\n');
    const dateStr = schedParts[0] || '2 May 2024 (Today)';
    const timeStr = schedParts[1] || '10:00 AM';

    return {
      serviceName,
      customerName,
      location,
      price,
      paymentLabel,
      paymentColor,
      statusLabel,
      statusBg,
      statusColor,
      dotColor,
      serviceIcon,
      iconBg,
      dateStr,
      timeStr,
    };
  };

  // Filter and search computation
  const filteredBookings = bookings.filter(booking => {
    const details = getBookingDisplayDetails(booking);
    const matchesSearch = 
      booking.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      details.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      details.serviceName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = 
      activeTab === 'All' ||
      (activeTab === 'On the way' && (booking.status === 'accepted' || booking.status === 'checked_in')) ||
      (activeTab === 'Upcoming' && booking.status === 'pending');

    const matchesPaymentStatus = 
      selectedPaymentStatus === 'All' ||
      (selectedPaymentStatus === 'Paid' && booking.paymentStatus === 'paid') ||
      (selectedPaymentStatus === 'Pending' && booking.paymentStatus === 'unpaid') ||
      (selectedPaymentStatus === 'Partial Paid' && booking.paymentStatus === 'unpaid') || // Mock fallback matching Design
      (selectedPaymentStatus === 'Failed' && booking.paymentStatus === 'unpaid'); // Mock fallback matching Design

    const matchesPaymentType = 
      selectedPaymentType === 'All' ||
      (selectedPaymentType === 'Online' && booking.paymentMethod === 'online') ||
      (selectedPaymentType === 'Cash' && booking.paymentMethod === 'cash');

    return matchesSearch && matchesTab && matchesPaymentStatus && matchesPaymentType;
  });

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        {/* Search and Filter Row */}
        <View style={styles.searchFilterRow}>
          <View style={styles.searchContainer}>
            <SearchIcon size={20} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by ID, customer name or service"
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterModalVisible(true)}>
            <FilterIcon size={18} color="rgba(26, 15, 163, 1.00)" />
            <Text style={styles.filterBtnText}>Filter</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs Row */}
        <View style={styles.tabsRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
            {TABS.map(tab => {
              const isActive = activeTab === tab.id;
              const activeColor = '#FFFFFF';
              const inactiveColor = '#64748B';
              const iconColor = isActive ? activeColor : inactiveColor;
              
              return (
                <TouchableOpacity 
                  key={tab.id} 
                  style={[styles.tabBtn, isActive ? styles.tabBtnActive : styles.tabBtnInactive]}
                  onPress={() => setActiveTab(tab.id)}
                >
                  <View style={styles.tabContent}>
                    {tab.icon && <View style={styles.tabIconBox}>{tab.icon(iconColor)}</View>}
                    <Text style={[styles.tabText, isActive ? styles.tabTextActive : styles.tabTextInactive]}>
                      {tab.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Bookings Card List */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {filteredBookings.map((booking) => {
            const display = getBookingDisplayDetails(booking);
            return (
              <TouchableOpacity 
                key={booking.bookingId} 
                style={styles.bookingCard}
                onPress={() => router.push(`/(dashboard)/bookings/${booking.bookingId.replace('#', '')}`)}
              >
                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <View style={[styles.serviceIconContainer, { backgroundColor: display.iconBg }]}>
                    {display.serviceIcon}
                  </View>
                  <View style={styles.serviceTextCol}>
                    <Text style={styles.serviceName}>{display.serviceName}</Text>
                    <Text style={styles.idText}>ID: {booking.bookingId}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: display.statusBg }]}>
                    <View style={[styles.statusDot, { backgroundColor: display.dotColor }]} />
                    <Text style={[styles.statusText, { color: display.statusColor }]}>{display.statusLabel}</Text>
                  </View>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Customer Row */}
                <View style={styles.infoRow}>
                  <UserIcon size={16} color="#64748B" />
                  <Text style={styles.infoText}>{display.customerName}</Text>
                </View>

                {/* Location Row */}
                <View style={styles.infoRowAlignTop}>
                  <LocationIcon size={16} color="#64748B" />
                  <Text style={styles.addressText}>{display.location}</Text>
                </View>

                {/* Bottom Banner */}
                <View style={styles.bottomBanner}>
                  <View>
                    <Text style={styles.bannerLabel}>Schedule</Text>
                    <Text style={styles.bannerValueDate}>{display.dateStr}</Text>
                    <Text style={styles.bannerValueTime}>{display.timeStr}</Text>
                  </View>
                  <View style={styles.alignRight}>
                    <Text style={styles.bannerLabel}>Payment</Text>
                    <Text style={styles.bannerValuePrice}>{display.price}</Text>
                    <Text style={[styles.paymentStatusText, { color: display.paymentColor }]}>
                      {display.paymentLabel}
                    </Text>
                  </View>
                </View>

                {/* View Details Button */}
                <TouchableOpacity 
                  style={styles.viewBtn}
                  onPress={() => router.push(`/(dashboard)/bookings/${booking.bookingId.replace('#', '')}`)}
                >
                  <Text style={styles.viewBtnText}>View</Text>
                </TouchableOpacity>

              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </SafeAreaView>

      <Modal visible={filterModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheetContainer}>
            
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Bookings</Text>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setFilterModalVisible(false)}>
                <Text style={{ fontSize: 24, color: '#64748B', fontWeight: 'bold' }}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Payment Status Label & Chips */}
            <Text style={styles.modalSectionLabel}>Payment Status</Text>
            <View style={styles.chipsRow}>
              {['All', 'Paid', 'Pending', 'Partial Paid', 'Failed'].map(status => {
                const isSelected = selectedPaymentStatus === status;
                return (
                  <TouchableOpacity 
                    key={status} 
                    style={[styles.chip, isSelected ? styles.chipSelected : styles.chipUnselected]}
                    onPress={() => setSelectedPaymentStatus(status)}
                  >
                    <Text style={[styles.chipText, isSelected ? styles.chipTextSelected : styles.chipTextUnselected]}>
                      {status}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Payment Type Label & Custom Dropdown */}
            <Text style={styles.modalSectionLabel}>Payment Type</Text>
            <TouchableOpacity 
              style={styles.dropdownTrigger}
              onPress={() => setShowPaymentTypeDropdown(!showPaymentTypeDropdown)}
            >
              <Text style={styles.dropdownTriggerText}>
                {selectedPaymentType === 'All' ? 'Select Payment Type' : selectedPaymentType}
              </Text>
              <Text style={styles.dropdownChevron}>▼</Text>
            </TouchableOpacity>

            {showPaymentTypeDropdown && (
              <View style={styles.dropdownMenu}>
                {['All', 'Online', 'Cash'].map(type => (
                  <TouchableOpacity 
                    key={type} 
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedPaymentType(type);
                      setShowPaymentTypeDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Footer Buttons */}
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.modalResetBtn} 
                onPress={() => {
                  setSelectedPaymentStatus('All');
                  setSelectedPaymentType('All');
                  setFilterModalVisible(false);
                }}
              >
                <Text style={styles.modalResetBtnText}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.modalApplyBtn} 
                onPress={() => setFilterModalVisible(false)}
              >
                <Text style={styles.modalApplyBtnText}>Apply Filter</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
  </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  
  // Search & Filter styles
  searchFilterRow: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, gap: 12, alignItems: 'center' },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 48,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      }
    })
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 13, color: '#0F172A', fontWeight: '500' },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    height: 48,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      }
    })
  },
  filterBtnText: { fontSize: 13, color: 'rgba(26, 15, 163, 1.00)', fontWeight: '700' },

  // Filter tabs styles
  tabsRow: { marginBottom: 16 },
  tabsScroll: { paddingHorizontal: 16, gap: 8 },
  tabBtn: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, borderWidth: 1, minHeight: 38, justifyContent: 'center' },
  tabBtnActive: { backgroundColor: 'rgba(26, 15, 163, 1.00)', borderColor: 'rgba(26, 15, 163, 1.00)' },
  tabBtnInactive: { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' },
  tabContent: { flexDirection: 'row', alignItems: 'center' },
  tabIconBox: { marginRight: 6 },
  tabText: { fontSize: 12, fontWeight: '600' },
  tabTextActive: { color: '#FFFFFF' },
  tabTextInactive: { color: '#64748B' },

  // Scroll Content List
  scrollContent: { paddingHorizontal: 16, paddingBottom: 120 },

  // Booking Card Design
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0,0,0,0.05)',
      },
    })
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  serviceIconContainer: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  serviceTextCol: { flex: 1, marginLeft: 12 },
  serviceName: { fontSize: 14, fontWeight: '700', color: 'rgba(26, 15, 163, 1.00)', marginBottom: 2 },
  idText: { fontSize: 11, color: '#94A3B8', fontWeight: '500' },
  
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 10, fontWeight: '700' },

  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },

  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoRowAlignTop: { flexDirection: 'row', alignItems: 'flex-start' },
  infoText: { marginLeft: 8, fontSize: 12, color: '#0F172A', fontWeight: '500' },
  addressText: { marginLeft: 8, fontSize: 12, color: '#64748B', flex: 1, lineHeight: 18 },

  // Bottom Banner
  bottomBanner: {
    marginTop: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bannerLabel: { fontSize: 10, color: '#64748B', fontWeight: '500', marginBottom: 4 },
  bannerValueDate: { fontSize: 12, fontWeight: '700', color: '#0F172A' },
  bannerValueTime: { fontSize: 11, color: '#64748B', marginTop: 1 },
  alignRight: { alignItems: 'flex-end' },
  bannerValuePrice: { fontSize: 16, fontWeight: '800', color: 'rgba(26, 15, 163, 1.00)', marginBottom: 2 },
  paymentStatusText: { fontSize: 9, fontWeight: '800' },
  viewBtn: {
    marginTop: 12,
    backgroundColor: 'rgba(26, 15, 163, 1.00)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#1A0FA3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      }
    })
  },
  viewBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'flex-end' },
  modalSheetContainer: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, minHeight: 360, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  modalCloseBtn: { padding: 4 },
  modalSectionLabel: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginTop: 16, marginBottom: 12 },
  
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#CBD5E1' },
  chipSelected: { backgroundColor: 'rgba(26, 15, 163, 1.00)', borderColor: 'rgba(26, 15, 163, 1.00)' },
  chipUnselected: { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' },
  chipText: { fontSize: 12, fontWeight: '600' },
  chipTextSelected: { color: '#FFFFFF' },
  chipTextUnselected: { color: '#64748B' },

  dropdownTrigger: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16 },
  dropdownTriggerText: { fontSize: 13, color: '#334155', fontWeight: '500' },
  dropdownChevron: { fontSize: 10, color: '#64748B' },
  dropdownMenu: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingVertical: 4, marginBottom: 16, marginTop: -8 },
  dropdownItem: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  dropdownItemText: { fontSize: 13, color: '#334155' },

  modalFooter: { flexDirection: 'row', gap: 16, marginTop: 24, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16 },
  modalResetBtn: { flex: 1, height: 48, borderRadius: 14, borderWidth: 1, borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center' },
  modalResetBtnText: { fontSize: 14, fontWeight: '700', color: '#64748B' },
  modalApplyBtn: { flex: 1, height: 48, borderRadius: 14, backgroundColor: 'rgba(26, 15, 163, 1.00)', justifyContent: 'center', alignItems: 'center' },
  modalApplyBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
});
