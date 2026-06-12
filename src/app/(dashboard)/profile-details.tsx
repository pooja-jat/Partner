import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Platform,
  Modal, TextInput, KeyboardAvoidingView, Linking, Pressable,
} from 'react-native';
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

const GenderIcon = ({ size = 20, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="9" r="4" stroke={color} strokeWidth="1.5" />
    <Path d="M12 13v8M9 18h6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

const ChevronRightIcon = ({ size = 16, color = '#94A3B8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18L15 12L9 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CloseIcon = ({ size = 20, color = '#0F172A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

import { useAuthStore } from '@/store/authStore';

type EditField = 'name' | 'email' | 'gender' | null;

const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

function formatDate(d: Date) {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export default function ProfileDetailsScreen() {
  const router = useSafeRouter();
  useAndroidBack(() => router.push('/(dashboard)/profile'));
  const role = useAuthStore(state => state.role);

  const [name, setName] = useState('Kanha');
  const [email, setEmail] = useState('kanhameena0427@gmail.com');
  const [gender, setGender] = useState('Not set');
  const [dob] = useState<Date>(new Date(2000, 4, 22));

  const [editField, setEditField] = useState<EditField>(null);
  const [editValue, setEditValue] = useState('');

  const openEdit = (field: EditField, current: string) => {
    setEditField(field);
    setEditValue(current);
  };

  const handleSave = () => {
    if (editField === 'name') setName(editValue.trim() || name);
    if (editField === 'email') setEmail(editValue.trim() || email);
    setEditField(null);
  };

  const handleGenderSelect = (g: string) => {
    setGender(g);
    setEditField(null);
  };

  const openWhatsApp = () => {
    Linking.openURL('whatsapp://').catch(() => {
      Linking.openURL('https://wa.me/');
    });
  };

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

              <TouchableOpacity style={styles.infoItem} onPress={() => openEdit('name', name)}>
                <UserOutlineIcon />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Name</Text>
                  <Text style={styles.infoValue}>{name}</Text>
                </View>
                <ChevronRightIcon />
              </TouchableOpacity>

              <TouchableOpacity style={styles.infoItem} onPress={() => openEdit('email', email)}>
                <MailIcon />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{email}</Text>
                </View>
                <ChevronRightIcon />
              </TouchableOpacity>

              <TouchableOpacity style={styles.infoItem} onPress={() => openEdit('gender', gender)}>
                <GenderIcon />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Gender</Text>
                  <Text style={styles.infoValue}>{gender}</Text>
                </View>
                <ChevronRightIcon />
              </TouchableOpacity>

              <View style={styles.infoItem}>
                <CalendarIcon />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Date of Birth</Text>
                  <Text style={styles.infoValue}>{formatDate(dob)}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.infoItem} onPress={openWhatsApp}>
                <WhatsAppIcon size={20} color="#64748B" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Use Whatsapp</Text>
                  <Text style={styles.infoValue}>Open WhatsApp</Text>
                </View>
                <ChevronRightIcon />
              </TouchableOpacity>

              <View style={styles.infoItem}>
                <BadgeIcon size={20} color="#64748B" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Member Since</Text>
                  <Text style={styles.infoValue}>May 2026</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.infoItem} onPress={() => router.push('/(dashboard)/emergency-contacts')}>
                <UserOutlineIcon />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Emergency Contact</Text>
                  <Text style={styles.infoValueLink}>Manage contacts</Text>
                </View>
                <Text style={styles.addText}>Add</Text>
              </TouchableOpacity>

            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Name / Email edit bottom sheet */}
      <Modal
        visible={editField === 'name' || editField === 'email'}
        transparent
        animationType="slide"
        statusBarTranslucent
      >
        <Pressable style={styles.sheetOverlay} onPress={() => setEditField(null)}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.sheetKAV}
          >
            <Pressable style={styles.sheetCard}>
              <View style={styles.sheetHandle} />
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>
                  Update {editField === 'name' ? 'Name' : 'Email'}
                </Text>
                <TouchableOpacity onPress={() => setEditField(null)} hitSlop={8}>
                  <CloseIcon size={20} />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.sheetInput}
                value={editValue}
                onChangeText={setEditValue}
                keyboardType={editField === 'email' ? 'email-address' : 'default'}
                autoCapitalize={editField === 'email' ? 'none' : 'words'}
                autoFocus
                placeholder={editField === 'name' ? 'Enter your name' : 'Enter your email'}
                placeholderTextColor="#94A3B8"
              />
              <View style={styles.sheetFooter}>
                <TouchableOpacity style={styles.cancelSheetBtn} onPress={() => setEditField(null)}>
                  <Text style={styles.cancelSheetText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>

      {/* Gender picker bottom sheet */}
      <Modal
        visible={editField === 'gender'}
        transparent
        animationType="slide"
        statusBarTranslucent
      >
        <Pressable style={styles.sheetOverlay} onPress={() => setEditField(null)}>
          <Pressable style={styles.sheetCard}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Select Gender</Text>
              <TouchableOpacity onPress={() => setEditField(null)} hitSlop={8}>
                <CloseIcon size={20} />
              </TouchableOpacity>
            </View>
            {GENDERS.map(g => (
              <TouchableOpacity
                key={g}
                style={[styles.genderOption, gender === g && styles.genderOptionActive]}
                onPress={() => handleGenderSelect(g)}
              >
                <Text style={[styles.genderOptionText, gender === g && styles.genderOptionTextActive]}>{g}</Text>
                {gender === g && (
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    <Path d="M20 6L9 17L4 12" stroke="rgba(26,15,163,1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                )}
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

    </GradientBackground>
  );
}

const ACCENT = 'rgba(26, 15, 163, 1.00)';

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },

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
  infoValueLink: { fontSize: 11, color: ACCENT, fontWeight: '500' },
  addText: { fontSize: 11, color: ACCENT, fontWeight: '700', marginRight: 4 },

  // Bottom sheet
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheetKAV: { justifyContent: 'flex-end' },
  sheetCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  sheetHandle: { width: 40, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  sheetTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  sheetInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  sheetFooter: { flexDirection: 'row', gap: 12 },
  cancelSheetBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  cancelSheetText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  saveBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: ACCENT, alignItems: 'center' },
  saveBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },

  // Gender options
  genderOption: { paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  genderOptionActive: { backgroundColor: '#EEF2FF' },
  genderOptionText: { fontSize: 14, color: '#334155', fontWeight: '500' },
  genderOptionTextActive: { color: ACCENT, fontWeight: '700' },
});
