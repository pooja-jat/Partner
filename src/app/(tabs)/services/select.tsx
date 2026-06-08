import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { ChevronDownIcon, ChevronUpIcon, CloseIcon } from '@/components/ui/Icons';
import { useServicesStore } from '@/store/servicesStore';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';

// static mock list for selection
const AVAILABLE_CATEGORIES = [
  {
    id: 'plumbing', name: 'Plumbing',
    subServices: [
      { id: 'p1', name: 'Pipe Leak Repair' },
      { id: 'p2', name: 'Drain Cleaning' },
      { id: 'p3', name: 'Water Heater Installation' }
    ]
  },
  {
    id: 'electrical', name: 'Electrical',
    subServices: [
      { id: 'e1', name: 'Wiring' },
      { id: 'e2', name: 'Panel Upgrade' }
    ]
  },
  {
    id: 'hvac', name: 'HVAC',
    subServices: [
      { id: 'h1', name: 'AC Repair' },
      { id: 'h2', name: 'Heater Installation' }
    ]
  }
];

export default function SelectServicesModal() {
  useAndroidBack();
  const router = useSafeRouter();
  const { addService } = useServicesStore();
  
  const [expanded, setExpanded] = useState<string | null>('plumbing');
  const [selectedSubs, setSelectedSubs] = useState<Record<string, boolean>>({});
  const [experience, setExperience] = useState<string>('');

  const toggleCategory = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  const toggleSub = (id: string) => {
    setSelectedSubs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = () => {
    const selectedCategory = AVAILABLE_CATEGORIES.find(c => c.id === expanded);
    if (selectedCategory) {
      const subs = selectedCategory.subServices
        .filter(s => selectedSubs[s.id])
        .map(s => ({
          id: s.id,
          name: s.name,
          yearsOfExperience: experience,
          selected: true
        }));
      
      if (subs.length > 0) {
        addService({
          id: selectedCategory.id + Date.now(),
          name: selectedCategory.name,
          active: true,
          dateAdded: 'Oct 14, 2023', // hardcoded mock date
          subServices: subs
        });
        StorageService.updateMandatoryFlowStep('partnerServiceSelection', 'reviewing').then(async () => {
          const session = await StorageService.getUserSession();
          if (session?.isApproved) {
            router.back();
          } else {
            router.replace('/(tabs)/services/list');
          }
        });
      }
    }
  };

  return (
    <GradientBackground style={styles.modalOverlay}>
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => router.back()} />
        
        <View style={styles.modalContent}>
          <View style={styles.modalWhiteBg}>
            {Platform.OS !== 'web' && <View style={styles.dragHandle} />}
            <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
              <CloseIcon size={24} color="#64748B" />
            </TouchableOpacity>
            <View style={styles.header}>
              <Text style={styles.title}>Select Services</Text>
              <Text style={styles.subtitle}>Choose the service categories and sub-services you will provide.</Text>
            </View>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {AVAILABLE_CATEGORIES.map(cat => {
              const isExpanded = expanded === cat.id;
              return (
                <View key={cat.id} style={styles.accordionContainer}>
                  <TouchableOpacity style={styles.accordionHeader} onPress={() => toggleCategory(cat.id)} activeOpacity={0.7}>
                    <Text style={styles.accordionTitle}>{cat.name}</Text>
                    {isExpanded ? <ChevronUpIcon size={20} /> : <ChevronDownIcon size={20} />}
                  </TouchableOpacity>
                  
                  {isExpanded && (
                    <View style={styles.accordionBody}>
                      {cat.subServices.map(sub => (
                        <View key={sub.id} style={{ marginBottom: 12 }}>
                          <Checkbox 
                            checked={!!selectedSubs[sub.id]} 
                            onChange={() => toggleSub(sub.id)} 
                            label={sub.name} 
                          />
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}

            <View style={styles.experienceContainer}>
              <Text style={styles.expTitle}>Experience</Text>
              <Text style={styles.expSubtitle}>This helps us allocate better bookings to you.</Text>
              <Input 
                label="Total Years of Experience" 
                placeholder="e.g. 5" 
                value={experience} 
                onChangeText={setExperience} 
                keyboardType="numeric" 
                rightIcon={<Text style={styles.unitText}>Years</Text>}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button title="Save Services" onPress={handleSave} variant="primary" />
          </View>
        </View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1 },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  safeArea: {
    flex: 1,
    ...Platform.select({
      web: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      },
      default: {
        justifyContent: 'flex-end',
      },
    }),
  },
  modalContent: {
    overflow: 'hidden',
    ...Platform.select({
      web: {
        borderRadius: 24,
        width: '90%',
        maxWidth: 600,
        maxHeight: '85%',
        boxShadow: '0px 8px 32px rgba(15, 23, 42, 0.15)',
        elevation: 8,
      },
      default: {
        height: '85%',
        width: '100%',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      },
    }),
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  modalWhiteBg: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { padding: 24, paddingBottom: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
  subtitle: { fontSize: 13, color: '#64748B', lineHeight: 20 },
  scroll: { flex: 1, paddingHorizontal: 24 },
  accordionContainer: { borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 12, marginBottom: 12, overflow: 'hidden' },
  accordionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#F8FAFC' },
  accordionTitle: { fontSize: 14, fontWeight: '600', color: '#0F172A' },
  accordionBody: { padding: 16, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  experienceContainer: { marginTop: 24, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 24 },
  expTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  expSubtitle: { fontSize: 13, color: '#64748B', marginBottom: 20 },
  unitText: { fontSize: 14, color: '#94A3B8' },
  footer: { padding: 24, borderTopWidth: 1, borderTopColor: '#F1F5F9' }
});
