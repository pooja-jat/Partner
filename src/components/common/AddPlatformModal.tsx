import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { Button } from '@/components/ui/Button';
import { ChevronDownIcon, CloseIcon, UploadIcon } from '@/components/ui/Icons';

interface AddPlatformModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const AddPlatformModal: React.FC<AddPlatformModalProps> = ({ visible, onClose, onSubmit }) => {
  const [platform, setPlatform] = useState('');
  const [channelName, setChannelName] = useState('');
  const [channelLink, setChannelLink] = useState('');
  const [followers, setFollowers] = useState('');
  const [subscribers, setSubscribers] = useState('');
  const [about, setAbout] = useState('');

  const handleSubmit = () => {
    onSubmit({ platform, channelName, channelLink, followers, subscribers, about });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            <View style={styles.header}>
              <View style={styles.headerTopRow}>
                <Text style={styles.title}>Add Platform</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <CloseIcon size={16} color="#64748B" />
                </TouchableOpacity>
              </View>
              <Text style={styles.subtitle}>Fill in your channel details below.</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Platform Details</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputIcon}>@</Text>
                <TouchableOpacity style={styles.dropdownInput}>
                  <Text style={styles.dropdownText}>{platform || 'Select Platform'}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputIcon}>@</Text>
                <TextInput 
                  style={styles.textInput}
                  placeholder="Channel / Username"
                  value={channelName}
                  onChangeText={setChannelName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputIcon}>🔗</Text>
                <TextInput 
                  style={styles.textInput}
                  placeholder="Channel Link / Profile URL"
                  value={channelLink}
                  onChangeText={setChannelLink}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Audience Metrics</Text>
              <View style={styles.rowInputs}>
                <TextInput 
                  style={[styles.textInputBox, { flex: 1 }]}
                  placeholder="Enter Followers"
                  keyboardType="numeric"
                  value={followers}
                  onChangeText={setFollowers}
                />
                <TextInput 
                  style={[styles.textInputBox, { flex: 1 }]}
                  placeholder="Enter Subscribers"
                  keyboardType="numeric"
                  value={subscribers}
                  onChangeText={setSubscribers}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Upload Proof</Text>
              <View style={styles.rowInputs}>
                <TouchableOpacity style={styles.uploadBox}>
                  <UploadIcon size={24} color="#4338CA" />
                  <Text style={styles.uploadTitle}>Upload Profile Image</Text>
                  <Text style={styles.uploadSub}>JPG, PNG up to 5MB</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.uploadBox}>
                  <UploadIcon size={24} color="#4338CA" />
                  <Text style={styles.uploadTitle}>Upload Channel Image</Text>
                  <Text style={styles.uploadSub}>JPG, PNG up to 5MB</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About Your Channel</Text>
              <TextInput 
                style={styles.textArea}
                placeholder="Tell us about your content, audience and platform."
                multiline
                numberOfLines={4}
                value={about}
                onChangeText={setAbout}
                textAlignVertical="top"
              />
            </View>

          </ScrollView>

          <View style={styles.footer}>
            <Button 
              title="Submit for Review ->" 
              onPress={handleSubmit} 
              variant="primary" 
              style={{ backgroundColor: 'rgba(26, 15, 163, 1.00)' }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '95%', flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 40 },
  
  header: { marginBottom: 24 },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  title: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  subtitle: { fontSize: 13, color: '#64748B', lineHeight: 20 },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 12 },

  inputGroup: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 8, height: 48, marginBottom: 12, paddingHorizontal: 12, backgroundColor: '#FFFFFF' },
  inputIcon: { fontSize: 16, color: '#94A3B8', width: 24 },
  dropdownInput: { flex: 1, justifyContent: 'center' },
  dropdownText: { fontSize: 13, color: '#94A3B8' },
  textInput: { flex: 1, fontSize: 13, color: '#0F172A' },

  rowInputs: { flexDirection: 'row', gap: 12 },
  textInputBox: { borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 8, height: 48, paddingHorizontal: 12, fontSize: 13, color: '#0F172A', backgroundColor: '#FFFFFF' },

  uploadBox: { flex: 1, borderWidth: 1, borderColor: '#C7D2FE', borderStyle: 'dashed', borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' },
  uploadTitle: { fontSize: 11, fontWeight: '600', color: '#0F172A', marginTop: 12, textAlign: 'center' },
  uploadSub: { fontSize: 10, color: '#64748B', marginTop: 4, textAlign: 'center' },

  textArea: { borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 12, padding: 16, fontSize: 13, color: '#0F172A', height: 100, backgroundColor: '#FFFFFF' },

  footer: { padding: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', backgroundColor: '#FFFFFF' }
});
