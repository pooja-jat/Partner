import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image } from 'react-native';
import { CloseIcon, LinkIcon, YouTubeIcon, InstagramIcon, FacebookIcon, UserGroupIcon } from '@/components/ui/Icons';

interface PlatformDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  platform: any;
}

export const PlatformDetailsModal: React.FC<PlatformDetailsModalProps> = ({ visible, onClose, platform }) => {
  if (!platform) return null;

  const renderIcon = () => {
    switch(platform.type) {
      case 'Youtube': return <YouTubeIcon size={40} color="#FF0000" />;
      case 'Instagram': return <InstagramIcon size={40} color="#EC4899" />;
      case 'Facebook': return <FacebookIcon size={40} color="#1877F2" />;
      default: return <YouTubeIcon size={40} color="#FF0000" />;
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            <View style={styles.closeBtnContainer}>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <CloseIcon size={14} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.header}>
              <View style={styles.iconBox}>
                {renderIcon()}
              </View>
              <View style={styles.headerInfo}>
                <Text style={styles.channelName}>{platform.name}</Text>
                <Text style={styles.channelHandle}>{platform.handle}</Text>
              </View>
            </View>

            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <UserGroupIcon size={18} color="#4338CA" />
                <View style={styles.metricTexts}>
                  <Text style={styles.metricValue}>{platform.subscribers}</Text>
                  <Text style={styles.metricLabel}>Subscribers</Text>
                </View>
              </View>
              <View style={styles.metricItem}>
                <UserGroupIcon size={18} color="#4338CA" />
                <View style={styles.metricTexts}>
                  <Text style={styles.metricValue}>{platform.followers}</Text>
                  <Text style={styles.metricLabel}>Followers</Text>
                </View>
              </View>
            </View>

            <View style={styles.linkContainer}>
              <LinkIcon size={16} color="#4338CA" />
              <Text style={styles.linkText} numberOfLines={1}>{platform.link}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About Channel</Text>
              <Text style={styles.aboutText}>
                Lifestyle vlogs, travel adventures, daily life, and exciting challenges, New video every week!
              </Text>
              
              <View style={styles.infoList}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Joined Youtube</Text>
                  <Text style={styles.infoValue}>25 March 2018</Text>
                </View>
                <View style={styles.infoDivider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Channel Type</Text>
                  <Text style={styles.infoValue}>Public</Text>
                </View>
                <View style={styles.infoDivider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Categories</Text>
                  <Text style={styles.infoValue}>Travel, Lifestyle</Text>
                </View>
                <View style={styles.infoDivider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>India</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Media Proofs</Text>
              <Text style={styles.aboutText}>
                Lifestyle vlogs, travel adventures, daily life, and exciting challenges, New video every week!
              </Text>

              <View style={styles.proofsGrid}>
                {/* Dummy images for proofs */}
                <View style={styles.proofImagePlaceholder}>
                  <Text style={styles.placeholderText}>Image 1</Text>
                </View>
                <View style={styles.proofImagePlaceholder}>
                  <Text style={styles.placeholderText}>Image 2</Text>
                </View>
                <View style={styles.proofImagePlaceholder}>
                  <Text style={styles.placeholderText}>Image 3</Text>
                </View>
              </View>
            </View>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '95%', flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 40 },
  
  closeBtnContainer: { alignItems: 'flex-end', marginBottom: 12 },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },

  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconBox: { marginRight: 16 },
  headerInfo: { flex: 1 },
  channelName: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  channelHandle: { fontSize: 13, color: '#64748B' },

  metricsRow: { flexDirection: 'row', justifyContent: 'center', gap: 32, marginBottom: 20 },
  metricItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  metricTexts: {},
  metricValue: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  metricLabel: { fontSize: 11, color: '#64748B' },

  linkContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', borderRadius: 24, paddingVertical: 12, paddingHorizontal: 16, marginBottom: 32 },
  linkText: { fontSize: 13, color: '#4338CA', marginLeft: 8, fontWeight: '500' },

  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
  aboutText: { fontSize: 12, color: '#64748B', lineHeight: 18, marginBottom: 20 },

  infoList: {},
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  infoLabel: { fontSize: 12, color: '#64748B' },
  infoValue: { fontSize: 12, fontWeight: '600', color: '#0F172A' },
  infoDivider: { height: 1, backgroundColor: '#F1F5F9' },

  proofsGrid: { flexDirection: 'row', gap: 8 },
  proofImagePlaceholder: { flex: 1, aspectRatio: 1, backgroundColor: '#F1F5F9', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 10, color: '#94A3B8' },
});
