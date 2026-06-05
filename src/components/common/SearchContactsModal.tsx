import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

interface Contact {
  id: string;
  name: string;
  phone: string;
  initial: string;
  selected?: boolean;
}

interface SearchContactsModalProps {
  visible: boolean;
  onClose: () => void;
}

const SearchIcon = ({ color = '#0F172A' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CloseIcon = ({ color = '#FFFFFF' }) => (
  <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckboxIcon = ({ checked = false, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="18" height="18" rx="4" fill={checked ? color : 'transparent'} stroke={checked ? color : '#F1F5F9'} strokeWidth="2" />
    {checked && <Path d="M8 12L11 15L16 9" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
  </Svg>
);

const CloseModalIcon = ({ color = '#0F172A' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const SearchContactsModal: React.FC<SearchContactsModalProps> = ({ visible, onClose }) => {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'A D Packaging Oil', phone: '9099022114', initial: 'A', selected: true },
    { id: '2', name: 'AJio Delevery', phone: '9110792602', initial: 'A', selected: true },
    { id: '3', name: '8003281009', phone: '8003281009', initial: '8', selected: false },
  ]);

  const selectedContacts = contacts.filter(c => c.selected);

  const toggleSelect = (id: string) => {
    setContacts(contacts.map(c => {
      if (c.id === id) {
        // Enforce max 4
        if (!c.selected && selectedContacts.length >= 4) return c;
        return { ...c, selected: !c.selected };
      }
      return c;
    }));
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <CloseModalIcon />
          </TouchableOpacity>

          <View style={styles.searchContainer}>
            <SearchIcon />
            <TextInput 
              placeholder="Search contacts"
              style={styles.searchInput}
              placeholderTextColor="#64748B"
            />
          </View>

          <Text style={styles.limitText}>You can add upto 4 contacts only</Text>

          {/* Selected Pills */}
          {selectedContacts.length > 0 && (
            <View style={styles.pillContainer}>
              {selectedContacts.map(c => (
                <View key={`pill-${c.id}`} style={styles.pill}>
                  <Text style={styles.pillText}>{c.phone.substring(0,8)}...</Text>
                  <TouchableOpacity onPress={() => toggleSelect(c.id)} style={styles.pillClose}>
                    <CloseIcon />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Contact List */}
          <ScrollView showsVerticalScrollIndicator={false} style={styles.listContainer}>
            {contacts.map((contact) => (
              <TouchableOpacity key={contact.id} style={styles.contactRow} onPress={() => toggleSelect(contact.id)}>
                <Image source={{ uri: `https://i.pravatar.cc/150?u=${contact.id}` }} style={styles.avatarImage} />
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactPhone}>{contact.phone}</Text>
                </View>
                <CheckboxIcon checked={contact.selected} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.addBtn} onPress={onClose}>
            <Text style={styles.addBtnText}>ADD</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheetContainer: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, height: '80%' },
  
  closeBtn: { alignSelf: 'flex-end', padding: 8 },

  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 13, color: '#0F172A' },

  limitText: { fontSize: 11, color: '#94A3B8', marginBottom: 16 },

  pillContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  pill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(26, 15, 163, 1.00)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, gap: 8 },
  pillText: { color: '#FFFFFF', fontSize: 11, fontWeight: '500' },
  pillClose: { opacity: 0.8 },

  listContainer: { flex: 1 },
  contactRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, borderColor: '#F8FAFC', borderRadius: 16, marginBottom: 8 },
  avatarImage: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  avatarText: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  contactPhone: { fontSize: 11, color: '#94A3B8' },

  addBtn: { backgroundColor: 'rgba(26, 15, 163, 1.00)', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  addBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
