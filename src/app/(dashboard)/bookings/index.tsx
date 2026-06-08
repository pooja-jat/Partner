import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Platform, Modal, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';
import { useFocusEffect } from 'expo-router';
import { Booking, UserSession, PartnerProfile } from '@/types/storage.types';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

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
  serviceIcon: React.ReactNode;
  iconBg: string;
  dateStr: string;
  timeStr: string;
  subServices: string[];
}

export default function BookingsScreen() {
  useAndroidBack();
  const router = useSafeRouter();
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [session, setSession] = useState<UserSession | null>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('All');
  const [selectedPaymentType, setSelectedPaymentType] = useState('All');
  const [showPaymentTypeDropdown, setShowPaymentTypeDropdown] = useState(false);
  const [bookingPopupVisible, setBookingPopupVisible] = useState(false);
  const [popupBooking, setPopupBooking] = useState<Booking | null>(null);

  const TABS = [
    { id: 'All', label: 'All', icon: null },
    { id: 'On the way', label: 'On the way', icon: (color: string) => <CarIcon size={16} color={color} /> },
    { id: 'Upcoming', label: 'Upcoming', icon: (color: string) => <ClockIcon size={16} color={color} /> }
  ];

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const s = await StorageService.getUserSession();
        setSession(s);

        let bks = await StorageService.getBookings();
        if (bks.length === 0 || bks.length < 5) {
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
    let serviceIcon: React.ReactNode = <DropletIcon size={20} />;
    let iconBg = '#FFF7ED';
    let subServices: string[] = [];

    if (booking.serviceId === 'S1' || booking.serviceId.toLowerCase().includes('ac')) {
      serviceName = 'AC Repair';
      serviceIcon = <SnowflakeIcon size={20} />;
      iconBg = '#EFF6FF';
      subServices = ['Deep Cleaning', 'Gas Refilling', 'Filter Wash'];
    } else if (booking.serviceId === 'S2' || booking.serviceId.toLowerCase().includes('wash')) {
      serviceName = 'Washing Machine';
      serviceIcon = <WashingMachineIcon size={20} />;
      iconBg = '#F0FDF4';
      subServices = ['Motor Repair', 'Drum Cleaning', 'PCB Check'];
    } else if (booking.serviceId === 'S3' || booking.serviceId.toLowerCase().includes('ro')) {
      serviceName = 'RO Installation';
      serviceIcon = <DropletIcon size={20} />;
      iconBg = '#FFF7ED';
      subServices = ['Filter Change', 'Tank Cleaning', 'UV Lamp Check'];
    }

    const customerMap: Record<string, string> = {
      U1: 'Amit Kumar', U2: 'Priya Verma', U3: 'Neha Singh', U4: 'Rajesh Sharma', U5: 'Vikram Aditya',
    };
    const priceMap: Record<string, string> = {
      U1: '₹599', U2: '₹649', U3: '₹799', U4: '₹549', U5: '₹599',
    };

    const customerName = customerMap[booking.userId] ?? `User ${booking.userId}`;
    const price = priceMap[booking.userId] ?? '₹350';
    const paymentLabel = booking.paymentStatus === 'paid' ? 'Paid' : 'Pending';
    const paymentColor = booking.paymentStatus === 'paid' ? '#16A34A' : '#EA580C';

    const schedParts = booking.scheduledTime.split('\n');
    const dateStr = schedParts[0] || '2 May 2024 (Today)';
    const timeStr = schedParts[1] || '10:00 AM';

    return { serviceName, customerName, location: booking.location, price, paymentLabel, paymentColor, serviceIcon, iconBg, dateStr, timeStr, subServices };
  };

  const handleDutyToggle = (value: boolean) => {
    setIsOnDuty(value);
    if (value && bookings.length > 0) {
      setPopupBooking(bookings[0]);
      setBookingPopupVisible(true);
    }
  };

  const handleAccept = () => {
    setBookingPopupVisible(false);
  };

  const handleReject = () => {
    setBookingPopupVisible(false);
  };

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
      (selectedPaymentStatus === 'Partial Paid' && booking.paymentStatus === 'unpaid') ||
      (selectedPaymentStatus === 'Failed' && booking.paymentStatus === 'unpaid');

    const matchesPaymentType =
      selectedPaymentType === 'All' ||
      (selectedPaymentType === 'Online' && booking.paymentMethod === 'online') ||
      (selectedPaymentType === 'Cash' && booking.paymentMethod === 'cash');

    return matchesSearch && matchesTab && matchesPaymentStatus && matchesPaymentType;
  });

  const popupDetails = popupBooking ? getBookingDisplayDetails(popupBooking) : null;

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isOnDuty ? `${filteredBookings.length} Orders` : '0 Orders'}
          </Text>
          <TouchableOpacity
            style={[styles.dutyBadge, isOnDuty ? styles.dutyBadgeOn : styles.dutyBadgeOff]}
            onPress={() => handleDutyToggle(!isOnDuty)}
          >
            <View style={[styles.dutyDot, { backgroundColor: isOnDuty ? '#FFFFFF' : '#94A3B8' }]} />
            <Text style={[styles.dutyBadgeText, isOnDuty ? styles.dutyBadgeTextOn : styles.dutyBadgeTextOff]}>
              {isOnDuty ? 'ON DUTY' : 'OFF DUTY'}
            </Text>
          </TouchableOpacity>
        </View>

        {!isOnDuty ? (
          /* Off Duty Empty State */
          <View style={styles.offDutyContainer}>
            <Text style={styles.offDutyText}>Go On-Duty to receive orders.</Text>
            <View style={styles.offDutySwitchRow}>
              <Text style={styles.offDutySwitchLabel}>OFF DUTY</Text>
              <Switch
                value={isOnDuty}
                onValueChange={handleDutyToggle}
                trackColor={{ false: '#E2E8F0', true: '#22C55E' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        ) : (
          /* On Duty — Orders List */
          <>
            {/* Search and Filter */}
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

            {/* Tabs */}
            <View style={styles.tabsRow}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
                {TABS.map(tab => {
                  const isActive = activeTab === tab.id;
                  const iconColor = isActive ? '#FFFFFF' : '#64748B';
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

            {/* Booking Cards */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              {filteredBookings.map((booking) => {
                const display = getBookingDisplayDetails(booking);
                return (
                  <TouchableOpacity
                    key={booking.bookingId}
                    style={styles.bookingCard}
                    onPress={() => router.push(`/(dashboard)/bookings/${booking.bookingId.replace('#', '')}` as any)}
                  >
                    <View style={styles.cardHeader}>
                      <View style={[styles.serviceIconContainer, { backgroundColor: display.iconBg }]}>
                        {display.serviceIcon}
                      </View>
                      <View style={styles.serviceTextCol}>
                        <Text style={styles.serviceName}>{display.serviceName}</Text>
                        <Text style={styles.idText}>ID: {booking.bookingId}</Text>
                      </View>
                      <View style={styles.distanceBadge}>
                        <LocationIcon size={12} color="#3B82F6" />
                        <Text style={styles.distanceText}>Distance: {(booking.serviceRadius ?? 0).toFixed(1)}KM</Text>
                      </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                      <UserIcon size={16} color="#64748B" />
                      <Text style={styles.infoText}>{display.customerName}</Text>
                    </View>

                    <View style={styles.infoRowAlignTop}>
                      <LocationIcon size={16} color="#64748B" />
                      <Text style={styles.addressText}>{display.location}</Text>
                    </View>

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

                    <TouchableOpacity
                      style={styles.viewBtn}
                      onPress={() => router.push(`/(dashboard)/bookings/${booking.bookingId.replace('#', '')}` as any)}
                    >
                      <Text style={styles.viewBtnText}>View</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </>
        )}
      </SafeAreaView>

      {/* Booking Request Popup */}
      <Modal visible={bookingPopupVisible} animationType="fade" transparent>
        <View style={styles.popupOverlay}>
          <View style={styles.bookingPopup}>
            <TouchableOpacity style={styles.popupCloseBtn} onPress={handleReject}>
              <Text style={styles.popupCloseX}>×</Text>
            </TouchableOpacity>

            <Text style={styles.popupServiceName}>{popupDetails?.serviceName ?? 'Service'}</Text>

            <View style={styles.popupDivider} />

            <Text style={styles.popupSubTitle}>{popupDetails?.customerName}</Text>
            {(popupDetails?.subServices ?? []).map((item, i) => (
              <Text key={i} style={styles.popupSubItem}>• {item}</Text>
            ))}

            <View style={styles.popupDivider} />

            <View style={styles.popupPriceRow}>
              <Text style={styles.popupPrice}>{popupDetails?.price}</Text>
              <Text style={styles.popupPaymentStatus}> ({popupDetails?.paymentLabel})</Text>
            </View>

            <View style={styles.popupDivider} />

            <View style={styles.popupActionsRow}>
              <View style={styles.popupDotIndicator} />
              <View style={styles.popupBtnGroup}>
                <TouchableOpacity style={styles.popupRejectBtn} onPress={handleReject}>
                  <Text style={styles.popupRejectText}>−</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.popupAcceptBtn} onPress={handleAccept}>
                  <Text style={styles.popupAcceptText}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal visible={filterModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheetContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Bookings</Text>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setFilterModalVisible(false)}>
                <Text style={{ fontSize: 24, color: '#64748B', fontWeight: 'bold' }}>×</Text>
              </TouchableOpacity>
            </View>

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
                    onPress={() => { setSelectedPaymentType(type); setShowPaymentTypeDropdown(false); }}
                  >
                    <Text style={styles.dropdownItemText}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalResetBtn}
                onPress={() => { setSelectedPaymentStatus('All'); setSelectedPaymentType('All'); setFilterModalVisible(false); }}
              >
                <Text style={styles.modalResetBtnText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalApplyBtn} onPress={() => setFilterModalVisible(false)}>
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

  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  backButton: { marginRight: 12 },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: '#0F172A' },
  dutyBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
  dutyBadgeOn: { backgroundColor: '#22C55E' },
  dutyBadgeOff: { backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  dutyDot: { width: 8, height: 8, borderRadius: 4 },
  dutyBadgeText: { fontSize: 11, fontWeight: '700' },
  dutyBadgeTextOn: { color: '#FFFFFF' },
  dutyBadgeTextOff: { color: '#64748B' },

  // Off duty empty state
  offDutyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  offDutyText: { fontSize: 16, color: '#334155', fontWeight: '500', marginBottom: 32, textAlign: 'center' },
  offDutySwitchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 40, borderWidth: 1, borderColor: '#E2E8F0' },
  offDutySwitchLabel: { fontSize: 12, fontWeight: '700', color: '#64748B' },

  // Search & Filter
  searchFilterRow: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 12, gap: 12, alignItems: 'center' },
  searchContainer: {
    flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderRadius: 12, borderWidth: 1.5, borderColor: '#E2E8F0', paddingHorizontal: 12, height: 48,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 13, color: '#0F172A', fontWeight: '500' },
  filterBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF',
    borderRadius: 12, borderWidth: 1.5, borderColor: '#E2E8F0', paddingHorizontal: 16, height: 48, gap: 8,
  },
  filterBtnText: { fontSize: 13, color: 'rgba(26, 15, 163, 1.00)', fontWeight: '700' },

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

  scrollContent: { paddingHorizontal: 16, paddingBottom: 120 },

  bookingCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }, android: { elevation: 2 } })
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  serviceIconContainer: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  serviceTextCol: { flex: 1, marginLeft: 12 },
  serviceName: { fontSize: 14, fontWeight: '700', color: 'rgba(26, 15, 163, 1.00)', marginBottom: 2 },
  idText: { fontSize: 11, color: '#94A3B8', fontWeight: '500' },
  distanceBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  distanceText: { fontSize: 11, fontWeight: '700', color: '#3B82F6' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoRowAlignTop: { flexDirection: 'row', alignItems: 'flex-start' },
  infoText: { marginLeft: 8, fontSize: 12, color: '#0F172A', fontWeight: '500' },
  addressText: { marginLeft: 8, fontSize: 12, color: '#64748B', flex: 1, lineHeight: 18 },
  bottomBanner: { marginTop: 12, backgroundColor: '#EFF6FF', borderRadius: 12, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bannerLabel: { fontSize: 10, color: '#64748B', fontWeight: '500', marginBottom: 4 },
  bannerValueDate: { fontSize: 12, fontWeight: '700', color: '#0F172A' },
  bannerValueTime: { fontSize: 11, color: '#64748B', marginTop: 1 },
  alignRight: { alignItems: 'flex-end' },
  bannerValuePrice: { fontSize: 16, fontWeight: '800', color: 'rgba(26, 15, 163, 1.00)', marginBottom: 2 },
  paymentStatusText: { fontSize: 9, fontWeight: '800' },
  viewBtn: { marginTop: 12, backgroundColor: 'rgba(26, 15, 163, 1.00)', borderRadius: 12, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  viewBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },

  // Booking popup
  popupOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.5)', justifyContent: 'center', alignItems: 'center' },
  bookingPopup: { width: '88%', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20 },
  popupCloseBtn: { position: 'absolute', top: 12, right: 16, zIndex: 10 },
  popupCloseX: { fontSize: 26, color: '#94A3B8', lineHeight: 28 },
  popupServiceName: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 4, marginTop: 4, paddingRight: 24 },
  popupDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },
  popupSubTitle: { fontSize: 14, fontWeight: '600', color: '#0F172A', marginBottom: 6 },
  popupSubItem: { fontSize: 13, color: '#334155', marginBottom: 4, paddingLeft: 4 },
  popupPriceRow: { flexDirection: 'row', alignItems: 'center' },
  popupPrice: { fontSize: 22, fontWeight: '800', color: '#22C55E' },
  popupPaymentStatus: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  popupActionsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  popupDotIndicator: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#EF4444' },
  popupBtnGroup: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  popupRejectBtn: { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  popupRejectText: { fontSize: 22, color: '#64748B', lineHeight: 26 },
  popupAcceptBtn: { backgroundColor: 'rgba(26, 15, 163, 1.00)', borderRadius: 24, paddingHorizontal: 32, paddingVertical: 12 },
  popupAcceptText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },

  // Filter modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'flex-end' },
  modalSheetContainer: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, minHeight: 360, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  modalCloseBtn: { padding: 4 },
  modalSectionLabel: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginTop: 16, marginBottom: 12 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
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
