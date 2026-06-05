import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { 
  MenuIcon, BellIcon, RibbonIcon, FilterSettingsIcon, 
  LocationPinIcon, ListIcon, CalendarIcon, WalletTabIcon
} from '@/components/ui/Icons';
import Svg, { Path, Circle } from 'react-native-svg';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { useAuthStore } from '@/store/authStore';

const InfoCircleIcon = ({ size = 16, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
    <Path d="M12 11V16M12 8H12.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export default function HomeScreen() {
  useAndroidBack(() => {
    BackHandler.exitApp();
  });
  const router = useSafeRouter();
  const [isOffDuty, setIsOffDuty] = useState(true);
  const role = useAuthStore(state => state.role);

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton}>
            <MenuIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.profileSection} onPress={() => router.push('/(tabs)')}>
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
          {/* Quick Actions Row */}
          <View style={styles.quickActionsContainer}>
            <View style={styles.actionItem}>
              <TouchableOpacity 
                style={[styles.actionCircle, { borderColor: '#DBEAFE' }]}
                onPress={() => router.push('/(dashboard)/performance')}
              >
                <RibbonIcon size={24} color="#3B82F6" />
              </TouchableOpacity>
              <Text style={styles.actionText}>Performance</Text>
            </View>
            <View style={styles.actionItem}>
              <TouchableOpacity 
                style={[styles.actionCircle, { borderColor: '#FEE2E2' }]}
                onPress={() => router.push('/(dashboard)/location')}
              >
                <LocationPinIcon size={24} color="#EF4444" />
              </TouchableOpacity>
              <Text style={styles.actionText}>Map</Text>
            </View>
            <View style={styles.actionItem}>
              <TouchableOpacity 
                style={[styles.actionCircle, { borderColor: '#FFEDD5' }]}
                onPress={() => router.push('/(dashboard)/bookings')}
              >
                <ListIcon size={24} color="#F97316" />
              </TouchableOpacity>
              <Text style={styles.actionText}>Bookings</Text>
            </View>
            {(role === 'BSP' || role === 'BS') && (
              <>
                <View style={styles.actionItem}>
                  <TouchableOpacity 
                    style={[styles.actionCircle, { borderColor: '#FCE7F3' }]}
                    onPress={() => router.push('/(tabs)/employee')}
                  >
                    <FilterSettingsIcon size={24} color="#EC4899" />
                  </TouchableOpacity>
                  <Text style={styles.actionText}>Team</Text>
                </View>
                <View style={styles.actionItem}>
                  <TouchableOpacity 
                    style={[styles.actionCircle, { borderColor: '#E0E7FF' }]}
                    onPress={() => router.push('/(dashboard)/seller/quotation-requests')}
                  >
                    <ListIcon size={24} color="#4F46E5" />
                  </TouchableOpacity>
                  <Text style={styles.actionText}>Quotes</Text>
                </View>
              </>
            )}
          </View>

          {/* Cards */}
          <View style={styles.cardsContainer}>
            
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <WalletTabIcon size={14} color="#64748B" />
                <Text style={styles.cardTitle}>Wallet Balance</Text>
              </View>
              <Text style={styles.cardAmount}>₹0</Text>
            </View>

            <TouchableOpacity style={styles.card} onPress={() => router.push('/(dashboard)/bookings')}>
              <View style={styles.cardHeader}>
                <WalletTabIcon size={14} color="#64748B" />
                <Text style={styles.cardTitle}>Today's Earnings</Text>
              </View>
              <Text style={styles.cardAmount}>₹0</Text>
            </TouchableOpacity>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <WalletTabIcon size={14} color="#64748B" />
                <Text style={styles.cardTitle}>Today's Earnings</Text>
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

  scrollContent: { flexGrow: 1, paddingBottom: 120 },
  mainContent: { flex: 1 },
  bottomSection: { alignItems: 'center', paddingBottom: 20 },

  quickActionsContainer: { 
    flexDirection: 'row', justifyContent: 'space-between', 
    paddingHorizontal: 24, marginTop: 24, marginBottom: 32 
  },
  actionItem: { alignItems: 'center' },
  actionCircle: { 
    width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFFFFF', 
    borderWidth: 1.5, justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  actionText: { fontSize: 10, color: '#64748B', fontWeight: '500' },

  cardsContainer: { paddingHorizontal: 20 },
  card: { 
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: '#F1F5F9',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  cardTitle: { fontSize: 11, color: '#94A3B8', fontWeight: '500' },
  cardAmount: { fontSize: 24, fontWeight: '800', color: '#0F172A' },

  rateCardContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16, marginBottom: 40 },
  rateCardText: { fontSize: 12, color: '#3B82F6', fontWeight: '600' },

  footerContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  footerText: { fontSize: 10, color: '#94A3B8' },
  footerTextBold: { fontSize: 10, color: '#0F172A', fontWeight: '700' },
});
