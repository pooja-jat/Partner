import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Image, TextInput, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';

import { useLocalSearchParams } from 'expo-router';
import { StorageService } from '@/services/storage.service';
import { Booking } from '@/types/storage.types';

const CameraIcon = ({ color = '#3B82F6' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M23 19C23 20.1046 22.1046 21 21 21H3C1.89543 21 1 20.1046 1 19V8C1 6.89543 1.89543 6 3 6H7L9 3H15L17 6H21C22.1046 6 23 6.89543 23 8V19Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function BeforeAfterScreen() {
  useAndroidBack();
  const router = useSafeRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const [booking, setBooking] = React.useState<Booking | null>(null);
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    const loadData = async () => {
      if (bookingId) {
        const bks = await StorageService.getBookings();
        const bk = bks.find(b => b.bookingId === bookingId || b.bookingId.replace('#', '') === bookingId);
        if (bk) setBooking(bk);
      }
    };
    loadData();
  }, [bookingId]);

  const handleSubmit = async () => {
    if (booking) {
      // Mark as completed
      const updated = { ...booking, status: 'completed' as const };
      await StorageService.saveBooking(updated);
    }
    router.push({
      pathname: '/(dashboard)/job-completed',
      params: { bookingId }
    });
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flexArea}>
          
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <BackArrowIcon size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Before & After</Text>
          </View>

          <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            <View style={styles.mainCard}>
              
              {/* BEFORE SECTION */}
              <Text style={styles.sectionTitle}>Before</Text>
              <View style={styles.photoGrid}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1596700057077-bd1c9c0587d5?q=80&w=300&auto=format&fit=crop' }} style={styles.photoBox} />
                <Image source={{ uri: 'https://images.unsplash.com/photo-1596700057404-51a84f3eb1a4?q=80&w=300&auto=format&fit=crop' }} style={styles.photoBox} />
                <Image source={{ uri: 'https://images.unsplash.com/photo-1596700057778-1a5c6e88e2c0?q=80&w=300&auto=format&fit=crop' }} style={styles.photoBox} />
                <TouchableOpacity style={styles.addPhotoBtn}>
                  <CameraIcon />
                  <Text style={styles.addPhotoText}>Add Photo</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />

              {/* AFTER SECTION */}
              <Text style={styles.sectionTitle}>After</Text>
              <View style={styles.photoGrid}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1596700057393-db1c5e9b4661?q=80&w=300&auto=format&fit=crop' }} style={styles.photoBox} />
                <Image source={{ uri: 'https://images.unsplash.com/photo-1596700057279-d19113d0a92b?q=80&w=300&auto=format&fit=crop' }} style={styles.photoBox} />
                <Image source={{ uri: 'https://images.unsplash.com/photo-1596700057008-04b39b33e244?q=80&w=300&auto=format&fit=crop' }} style={styles.photoBox} />
                <TouchableOpacity style={styles.addPhotoBtn}>
                  <CameraIcon />
                  <Text style={styles.addPhotoText}>Add Photo</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />

              <Text style={styles.notesLabel}>Notes (Optional)</Text>
              <TextInput 
                style={styles.notesInput}
                placeholder="Write notes here..."
                placeholderTextColor="#94A3B8"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />

              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitBtnText}>Submit & Complete</Text>
              </TouchableOpacity>

            </View>

            <View style={styles.bottomSpacing} />

          </ScrollView>

        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1,  },
  flexArea: { flex: 1 },
  
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },

  scrollArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },

  mainCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20 },

  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 16 },

  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  photoBox: { width: '47%', aspectRatio: 1, borderRadius: 16, backgroundColor: '#F1F5F9' },
  
  addPhotoBtn: { width: '47%', aspectRatio: 1, borderRadius: 16, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  addPhotoText: { color: '#3B82F6', fontSize: 11, fontWeight: '700', marginTop: 8 },

  divider: { height: 1, backgroundColor: '#F8FAFC', marginVertical: 24 },

  notesLabel: { fontSize: 11, color: '#94A3B8', marginBottom: 8 },
  notesInput: { backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, minHeight: 80, fontSize: 13, color: '#0F172A', marginBottom: 20 },
  submitBtn: { backgroundColor: 'rgba(26, 15, 163, 1.00)', paddingVertical: 16, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  submitBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  bottomSpacing: { height: 100 },
});
