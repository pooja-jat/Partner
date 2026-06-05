import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon, BadgeCheckIcon, WhatsAppIcon } from '@/components/ui/Icons';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const UserOutlineIcon = ({ size = 20, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 21V19C20 17.8954 19.1046 17 18 17H6C4.89543 17 4 17.8954 4 19V21" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="1.5" />
  </Svg>
);

const MailIcon = ({ size = 20, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Rect x="3" y="5" width="18" height="14" rx="2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

const CalendarIcon = ({ size = 20, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M16 2V6M8 2V6M3 10H21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

const BadgeIcon = ({ size = 20, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="10" r="4" stroke={color} strokeWidth="1.5" />
    <Path d="M10 14L9 21L12 19L15 21L14 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronRightIcon = ({ size = 16, color = '#94A3B8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18L15 12L9 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

import { useAuthStore } from '@/store/authStore';

export default function ProfileDetailsScreen() {
  useAndroidBack(() => router.push('/(dashboard)/profile'));
  const router = useSafeRouter();
  const role = useAuthStore(state => state.role);

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/(dashboard)/profile')} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitle}>Profile</Text>
            <Text style={styles.headerSubtitle}>Keep your profile up to date</Text>
          </View>
          <TouchableOpacity style={styles.helpButton} onPress={() => router.push('/(dashboard)/help-advanced')}>
            <Text style={styles.helpText}>Help</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.mainCard}>
            
            <View style={styles.avatarContainer}>
              <Image source={{ uri: 'https://i.pravatar.cc/150?u=ramu' }} style={styles.avatar} />
            </View>

            <View style={styles.badgesRow}>
              <View style={styles.proBadge}>
                <BadgeCheckIcon size={14} color="#4338CA" />
                <Text style={styles.proBadgeText}>{role || 'Professional'}</Text>
              </View>
            </View>
            <View style={styles.badgesRow}>
              <View style={styles.verifiedBadge}>
                <BadgeCheckIcon size={14} color="#22C55E" />
                <Text style={styles.verifiedBadgeText}>Verified Partner</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Earnings</Text>
                <Text style={styles.statValue}>$3,240</Text>
                <Text style={styles.statGrowth}>+12% this month</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Total Bookings</Text>
                <Text style={styles.statValue}>142</Text>
                <Text style={styles.statSub}>8 upcoming</Text>
              </View>
            </View>

            <View style={styles.experienceCard}>
              <View style={styles.expIconCircle}>
                <BadgeIcon size={20} color="#3B82F6" />
              </View>
              <View style={styles.expInfo}>
                <Text style={styles.expTitle}>Experience Level</Text>
                <Text style={styles.expSub}>Joined 2 years ago</Text>
              </View>
              <Text style={styles.expLevel}>Level 4</Text>
            </View>

            <View style={styles.infoList}>
              
              <View style={styles.infoItem}>
                <UserOutlineIcon />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Name</Text>
                  <Text style={styles.infoValue}>Ramu galiramu</Text>
                </View>
                <ChevronRightIcon />
              </View>

              <View style={styles.infoItem}>
                <MailIcon />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>galiramu01@gmail.com</Text>
                </View>
                <ChevronRightIcon />
              </View>

              <View style={styles.infoItem}>
                <UserOutlineIcon />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Gender</Text>
                  <Text style={styles.infoValue}>Male</Text>
                </View>
                <ChevronRightIcon />
              </View>

              <View style={styles.infoItem}>
                <CalendarIcon />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Date of Birth</Text>
                  <Text style={styles.infoValueLink}>Required</Text>
                </View>
                <ChevronRightIcon />
              </View>

              <View style={styles.infoItem}>
                <WhatsAppIcon size={20} color="#64748B" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Use Whatsapp</Text>
                </View>
                <ChevronRightIcon />
              </View>

              <View style={styles.infoItem}>
                <BadgeIcon size={20} color="#64748B" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Member Since</Text>
                </View>
                <ChevronRightIcon />
              </View>

              <View style={styles.infoItem}>
                <UserOutlineIcon />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Emergency Contact</Text>
                  <Text style={styles.infoValueLink}>Required</Text>
                </View>
                <Text style={styles.addText}>Add</Text>
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
  headerTitleBox: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  headerSubtitle: { fontSize: 12, color: '#64748B' },
  helpButton: { backgroundColor: '#F97316', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  helpText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  mainCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20 },
  
  avatarContainer: { alignItems: 'center', marginBottom: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: '#22C55E' },
  
  badgesRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 8 },
  proBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF2FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: '#4338CA' },
  proBadgeText: { color: '#4338CA', fontSize: 11, fontWeight: '700', marginLeft: 4 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: '#22C55E' },
  verifiedBadgeText: { color: '#16A34A', fontSize: 11, fontWeight: '700', marginLeft: 4 },

  statsRow: { flexDirection: 'row', gap: 12, marginTop: 16, marginBottom: 24 },
  statBox: { flex: 1, borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 16, padding: 16 },
  statLabel: { fontSize: 11, color: '#64748B', marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  statGrowth: { fontSize: 10, color: '#16A34A', fontWeight: '500' },
  statSub: { fontSize: 10, color: '#94A3B8' },

  experienceCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 16, padding: 16, marginBottom: 24 },
  expIconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  expInfo: { flex: 1 },
  expTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  expSub: { fontSize: 11, color: '#64748B' },
  expLevel: { fontSize: 14, fontWeight: '700', color: '#3B82F6' },

  infoList: { gap: 24 },
  infoItem: { flexDirection: 'row', alignItems: 'center' },
  infoTextContainer: { flex: 1, marginLeft: 16 },
  infoLabel: { fontSize: 11, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  infoValue: { fontSize: 11, color: '#64748B' },
  infoValueLink: { fontSize: 11, color: '#4338CA', fontWeight: '500' },
  addText: { fontSize: 11, color: '#4338CA', fontWeight: '700', marginRight: 4 },
});
