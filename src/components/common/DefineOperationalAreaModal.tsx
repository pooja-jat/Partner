import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { CloseIcon, SearchIcon, LocationPinIcon } from '@/components/ui/Icons';

interface DefineOperationalAreaModalProps {
  visible: boolean;
  onClose: () => void;
  mode: 'create' | 'update';
  initialData?: any;
  onSubmit: (data: any) => void;
  hideBranch?: boolean;
}

export const DefineOperationalAreaModal: React.FC<DefineOperationalAreaModalProps> = ({ visible, onClose, mode, initialData, onSubmit, hideBranch = false }) => {
  const [branch, setBranch] = useState(initialData?.branch || '');
  const [radius, setRadius] = useState(initialData?.radius || 15);
  const [locationType, setLocationType] = useState<'Urban' | 'Rural'>(initialData?.locationType || 'Urban');
  const [isActive, setIsActive] = useState<boolean>(initialData ? initialData.status === 'Active' : true);

  const handleSubmit = () => {
    onSubmit({ branch, radius, locationType, isActive });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.header}>
              <View style={styles.headerTopRow}>
                <Text style={styles.title}>Define Service Area</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <CloseIcon size={16} color="#64748B" />
                </TouchableOpacity>
              </View>
              <Text style={styles.subtitle}>
                Set the locations and radius where you provide services.
              </Text>
            </View>

            {!hideBranch && (
              <View style={styles.section}>
                <Text style={styles.label}>Service Provider Name</Text>
                <TextInput
                  style={styles.inputBox}
                  value={branch}
                  onChangeText={setBranch}
                  placeholder="Enter service provider name"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            )}

            <View style={styles.section}>
              <View style={styles.radiusHeader}>
                <Text style={styles.label}>Service Radius</Text>
                <Text style={styles.radiusValue}>{radius} km</Text>
              </View>

              <View style={styles.sliderTrack}>
                <View
                  style={[
                    styles.sliderFill,
                    { width: `${(radius / 50) * 100}%` },
                  ]}
                />
              </View>
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabelText}>1 km</Text>
                <Text style={styles.sliderLabelText}>50 km</Text>
              </View>
            </View>

            <View style={styles.rowSection}>
              <View style={styles.halfSection}>
                <Text style={styles.label}>Country</Text>
                <TextInput style={styles.inputBox} placeholder="Enter Country" placeholderTextColor="#94A3B8" />
              </View>
              <View style={styles.halfSection}>
                <Text style={styles.label}>State</Text>
                <TextInput style={styles.inputBox} placeholder="Enter State" placeholderTextColor="#94A3B8" />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Location Type</Text>
              <View style={styles.segmentedControl}>
                <TouchableOpacity
                  style={[
                    styles.segment,
                    locationType === "Urban" && styles.segmentActive,
                  ]}
                  onPress={() => setLocationType("Urban")}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      locationType === "Urban" && styles.segmentTextActive,
                    ]}
                  >
                    Urban
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.segment,
                    locationType === "Rural" && styles.segmentActive,
                  ]}
                  onPress={() => setLocationType("Rural")}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      locationType === "Rural" && styles.segmentTextActive,
                    ]}
                  >
                    Rural
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.rowSection}>
              <View style={styles.halfSection}>
                <Text style={styles.label}>City</Text>
                <TextInput style={styles.inputBox} placeholder="Enter City" placeholderTextColor="#94A3B8" />
              </View>
              <View style={styles.halfSection}>
                <Text style={styles.label}>District</Text>
                <TextInput style={styles.inputBox} placeholder="Enter District" placeholderTextColor="#94A3B8" />
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.searchBox}>
                <SearchIcon size={20} color="#64748B" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search for your location/society/ap..."
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <TouchableOpacity style={styles.currentLocationBtn}>
                <LocationPinIcon size={18} color="#4338CA" />
                <Text style={styles.currentLocationText}>
                  Use current location
                </Text>
              </TouchableOpacity>
            </View>

            {mode === "update" && (
              <View style={styles.statusSection}>
                <View style={styles.statusTextContainer}>
                  <Text style={styles.statusTitle}>Employee Status</Text>
                  <Text style={styles.statusSubtitle}>
                    Toggle to active / inactive
                  </Text>
                </View>
                <Switch value={isActive} onValueChange={setIsActive} />
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title={
                mode === "update" ? "Update Service Area" : "Save Service Area"
              }
              onPress={handleSubmit}
              variant="primary"
              style={{ backgroundColor: "rgba(26, 15, 163, 1.00)" }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '95%', width: '100%', maxWidth: 480, alignSelf: 'center' },
  scrollContent: { padding: 24, paddingBottom: 40 },
  header: { marginBottom: 24 },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  title: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  subtitle: { fontSize: 13, color: '#64748B', lineHeight: 20 },
  
  section: { marginBottom: 20 },
  rowSection: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  halfSection: { flex: 1 },
  
  label: { fontSize: 12, fontWeight: '500', color: '#0F172A', marginBottom: 8 },
  labelDisabled: { fontSize: 12, fontWeight: '500', color: '#94A3B8', marginBottom: 8 },
  
  inputBox: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 12, height: 44, backgroundColor: '#FFFFFF', fontSize: 13, color: '#0F172A' },
  dropdownBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 12, height: 44, backgroundColor: '#FFFFFF' },
  dropdownActive: { borderColor: '#4338CA' },
  dropdownDisabled: { backgroundColor: '#F8FAFC', borderColor: '#F1F5F9' },
  dropdownText: { fontSize: 13, color: '#0F172A', fontWeight: '500' },
  dropdownTextDisabled: { fontSize: 13, color: '#94A3B8', fontWeight: '500' },
  
  radiusHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  radiusValue: { fontSize: 13, fontWeight: '700', color: 'rgba(26, 15, 163, 1.00)' },
  
  sliderTrack: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, marginBottom: 8, overflow: 'hidden' },
  sliderFill: { height: '100%', backgroundColor: 'rgba(26, 15, 163, 1.00)', borderRadius: 3 },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  sliderLabelText: { fontSize: 10, color: '#94A3B8' },

  segmentedControl: { flexDirection: 'row', backgroundColor: '#F8FAFC', borderRadius: 8, padding: 4, borderWidth: 1, borderColor: '#F1F5F9' },
  segment: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 6 },
  segmentActive: { backgroundColor: '#FFFFFF', boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)', elevation: 2 },
  segmentText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  segmentTextActive: { color: '#0F172A', fontWeight: '600' },

  searchBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 12, height: 44, backgroundColor: '#FFFFFF', marginBottom: 16 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 13, color: '#0F172A' },
  
  currentLocationBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  currentLocationText: { fontSize: 13, fontWeight: '600', color: '#4338CA' },

  statusSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 12, marginBottom: 24, marginTop: 8 },
  statusTextContainer: { flex: 1 },
  statusTitle: { fontSize: 14, fontWeight: '600', color: '#0F172A', marginBottom: 2 },
  statusSubtitle: { fontSize: 12, color: '#94A3B8' },

  footer: { padding: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', backgroundColor: '#FFFFFF' }
});
