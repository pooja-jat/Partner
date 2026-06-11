import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BackArrowIcon } from '@/components/ui/Icons';

export default function BankAccountsScreen() {
  const router = useSafeRouter();
  const [accountDetailsVisible, setAccountDetailsVisible] = useState(false);
  const [addBankModalVisible, setAddBankModalVisible] = useState(false);
  const [newAccountHolder, setNewAccountHolder] = useState('');
  const [newAccountNumber, setNewAccountNumber] = useState('');
  const [newIFSC, setNewIFSC] = useState('');

  const handleSaveBankAccount = () => {
    // Placeholder: you can persist the new account data here
    setAddBankModalVisible(false);
    // Reset fields
    setNewAccountHolder('');
    setNewAccountNumber('');
    setNewIFSC('');
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bank Accounts</Text>
          {/* Account Details Modal */}
          <Modal
            visible={accountDetailsVisible}
            animationType="fade"
            transparent
            onRequestClose={() => setAccountDetailsVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setAccountDetailsVisible(false)}>
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>HDFC Bank Account Details</Text>
                <Text style={styles.modalInfo}>Account Holder: John Doe</Text>
                <Text style={styles.modalInfo}>Account Number: 1234 5678 9012 3456</Text>
                <Text style={styles.modalInfo}>IFSC: HDFC0001234</Text>
              </View>
            </View>
          </Modal>
          {/* Add New Bank Account Modal */}
          <Modal
            visible={addBankModalVisible}
            animationType="fade"
            transparent
            onRequestClose={() => setAddBankModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setAddBankModalVisible(false)}>
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Add New Bank Account</Text>
                <TextInput
                  placeholder="Account Holder Name"
                  placeholderTextColor="#94A3B8"
                  style={styles.inputField}
                  value={newAccountHolder}
                  onChangeText={setNewAccountHolder}
                />
                <TextInput
                  placeholder="Account Number"
                  placeholderTextColor="#94A3B8"
                  style={styles.inputField}
                  value={newAccountNumber}
                  onChangeText={setNewAccountNumber}
                  keyboardType="numeric"
                />
                <TextInput
                  placeholder="IFSC Code"
                  placeholderTextColor="#94A3B8"
                  style={styles.inputField}
                  value={newIFSC}
                  onChangeText={setNewIFSC}
                />
                <TouchableOpacity style={styles.saveBtn} onPress={handleSaveBankAccount}>
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <TouchableOpacity onPress={() => setAccountDetailsVisible(true)}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.bankName}>HDFC Bank</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Primary</Text>
                </View>
              </View>
              <Text style={styles.accNo}>XXXX XXXX XXXX 1234</Text>
              <Text style={styles.ifsc}>IFSC: HDFC0001234</Text>
            </View>
          </TouchableOpacity>

          <Button 
            title="+ Add New Bank Account" 
            onPress={() => setAddBankModalVisible(true)} 
            variant="outline" 
          />
        </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  content: { padding: 20 },
  card: { padding: 20, backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: '#22C55E' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  bankName: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  badge: { backgroundColor: '#DCFCE7', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#166534' },
  accNo: { fontSize: 14, color: '#334155', marginBottom: 4, letterSpacing: 1 },
  ifsc: { fontSize: 12, color: '#64748B' },
  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, width: '90%', maxWidth: 400, ...Platform.select({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    android: { elevation: 4 },
    web: { boxShadow: '0px 2px 8px rgba(0,0,0,0.1)' }
  }) },
  modalCloseBtn: { position: 'absolute', top: 12, right: 12, padding: 4 },
  modalCloseText: { fontSize: 18, color: '#64748B' },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 12, textAlign: 'center' },
  modalInfo: { fontSize: 14, color: '#0F172A', marginBottom: 8 },
  inputField: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12, marginVertical: 8, fontSize: 14, color: '#0F172A' },
  saveBtn: { backgroundColor: '#4F46E5', borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginTop: 12 },
  saveBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' }
});
