import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { CloseIcon } from '@/components/ui/Icons';
import Svg, { Path } from 'react-native-svg';

interface HozifyIDCardModalProps {
  visible: boolean;
  onClose: () => void;
}

const ApprovedCheckIcon = ({ size = 12, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ShareIcon = ({ size = 16, color = '#0F172A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M8.59 13.51L15.42 17.49M15.41 6.51L8.59 10.49" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const HozifyIDCardModal: React.FC<HozifyIDCardModalProps> = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <CloseIcon size={16} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.cardContainer}>
            {/* Top Blue Section */}
            <View style={styles.cardHeader}>
              <View style={styles.brandCircle}>
                <Text style={styles.brandTextSmall}>Hozify</Text>
                <Text style={styles.brandTextLarge}>Partner</Text>
              </View>
            </View>

            {/* Avatar overlapping */}
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: 'https://i.pravatar.cc/150?img=11' }} style={styles.avatarImg} />
            </View>

            {/* Body */}
            <View style={styles.cardBody}>
              <View style={styles.nameRow}>
                <Text style={styles.nameText}>Eswar P</Text>
                <View style={styles.approvedBadge}>
                  <ApprovedCheckIcon />
                  <Text style={styles.approvedText}>Approved</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <Text style={styles.labelText}>MOBILE NUMBER</Text>
              <Text style={styles.valueText}>+91 9533911988</Text>

              <View style={styles.detailsRow}>
                <View style={styles.detailsCol}>
                  <Text style={styles.labelText}>LICENSE NUMBER</Text>
                  <Text style={styles.valueText}>AP10320230002272</Text>
                </View>
                <View style={styles.detailsCol}>
                  <Text style={styles.labelText}>LICENSE VALIDITY</Text>
                  <Text style={styles.valueText}>12/07/2036</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.shareButton}>
                <ShareIcon />
                <Text style={styles.shareText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.viewDeclarationBtn}>
            <Text style={styles.viewDeclarationText}>view declaration</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 480, alignSelf: 'center', alignItems: 'center' },
  
  closeButton: { alignSelf: 'flex-end', marginBottom: 16, backgroundColor: 'rgba(255,255,255,0.2)', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },

  cardContainer: { backgroundColor: '#FFFFFF', borderRadius: 24, width: '100%', maxWidth: 480, overflow: 'hidden' },
  
  cardHeader: { backgroundColor: 'rgba(26, 15, 163, 1.00)', height: 120, padding: 20, alignItems: 'flex-end' },
  brandCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  brandTextSmall: { color: 'rgba(26, 15, 163, 1.00)', fontSize: 10, fontWeight: '700' },
  brandTextLarge: { color: '#0F172A', fontSize: 12, fontWeight: '800' },

  avatarWrapper: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', marginTop: -45, marginLeft: 20 },
  avatarImg: { width: 82, height: 82, borderRadius: 41 },

  cardBody: { padding: 20 },
  
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  nameText: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  approvedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#10B981', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, gap: 4 },
  approvedText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },

  divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 16 },

  labelText: { fontSize: 10, color: '#94A3B8', fontWeight: '600', marginBottom: 4 },
  valueText: { fontSize: 13, color: '#0F172A', fontWeight: '700', marginBottom: 16 },

  detailsRow: { flexDirection: 'row' },
  detailsCol: { flex: 1 },

  shareButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#64748B', borderRadius: 12, paddingVertical: 12, marginTop: 16, gap: 8 },
  shareText: { fontSize: 13, fontWeight: '600', color: '#0F172A' },

  viewDeclarationBtn: { marginTop: 24 },
  viewDeclarationText: { color: '#FFFFFF', fontSize: 13, fontWeight: '500' },
});
