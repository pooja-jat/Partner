import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Platform, Pressable, Keyboard } from 'react-native';
import { Employee } from '@/types';
import { CloseIcon, RightArrowIcon, ChevronDownIcon, DownloadExcelIcon, EnvelopeIcon, HeadphoneIcon, ReceiptIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';

interface EmployeeBookingsModalProps {
  visible: boolean;
  onClose: () => void;
  employee: Employee | null;
}

// Dummy data for orders
const DUMMY_ORDERS = [
  { id: '1', title: 'Ac Repair', date: 'Oct 13, 2023', status: 'Completed', amount: '₹500' },
  { id: '2', title: 'Jar gas filling', date: 'Oct 15, 2023', status: 'Completed', amount: '₹500' },
  { id: '3', title: 'Ac pump Change', date: 'Oct 12, 2023', status: 'Completed', amount: '₹300' },
  { id: '4', title: 'Jar Air Filter Change', date: 'Oct 12, 2023', status: 'Completed', amount: '₹300' },
];

export function EmployeeBookingsModal({ visible, onClose, employee }: EmployeeBookingsModalProps) {
  const [viewMode, setViewMode] = useState<'list' | 'details'>('list');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  const [timeFilter, setTimeFilter] = useState<'Day' | 'Week' | 'Month'>('Day');
  const [statusFilter, setStatusFilter] = useState<'Completed' | 'Cancelled' | 'Missed'>('Completed');

  const handleClose = () => {
    setViewMode('list');
    setSelectedOrder(null);
    onClose();
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setViewMode('details');
  };

  const renderList = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      
      {/* Time Toggle */}
      <View style={styles.timeToggleContainer}>
        {['Day', 'Week', 'Month'].map(tab => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.timeToggleTab, timeFilter === tab && styles.timeToggleActive]}
            onPress={() => setTimeFilter(tab as any)}
          >
            <Text style={[styles.timeToggleText, timeFilter === tab && styles.timeToggleActiveText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Date Carousel */}
      <View style={styles.dateCarousel}>
        <TouchableOpacity style={styles.arrowBtn}><Text style={styles.arrowText}>←</Text></TouchableOpacity>
        <View style={styles.dateItem}><Text style={styles.dateItemText}>Mon{'\n'}06</Text></View>
        <View style={styles.dateItem}><Text style={styles.dateItemText}>Tue{'\n'}07</Text></View>
        <View style={[styles.dateItem, styles.dateItemActive]}><Text style={styles.dateItemActiveText}>Wed{'\n'}08</Text></View>
        <TouchableOpacity style={styles.arrowBtn}><Text style={styles.arrowText}>→</Text></TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Completed Orders</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statValueEarnings}>₹0</Text>
          <Text style={styles.statLabel}>Order Earnings</Text>
        </View>
      </View>

      {/* Action Links */}
      <TouchableOpacity style={styles.actionLink}>
        <View style={styles.actionLinkIconBox}><ReceiptIcon size={16} color="#3B82F6" /></View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.actionLinkTitle}>All Orders</Text>
          <Text style={styles.actionLinkSub}>Order History and Order Earnings</Text>
        </View>
        <Text style={styles.actionLinkArrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionLink}>
        <View style={styles.actionLinkIconBox}><Text style={{ color: '#3B82F6', fontWeight: 'bold' }}>₹</Text></View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.actionLinkTitle}>View Rate Card</Text>
        </View>
        <Text style={styles.actionLinkArrow}>›</Text>
      </TouchableOpacity>

      {/* Order History Header */}
      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>Order History</Text>
        <TouchableOpacity style={styles.excelBtn}>
          <DownloadExcelIcon size={14} color="#3B82F6" />
          <Text style={styles.excelBtnText}>Excel</Text>
        </TouchableOpacity>
      </View>

      {/* Status Tabs */}
      <View style={styles.statusTabsRow}>
        {['Completed', 'Cancelled', 'Missed'].map(tab => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.statusTab, statusFilter === tab && styles.statusTabActive]}
            onPress={() => setStatusFilter(tab as any)}
          >
            <Text style={[styles.statusTabText, statusFilter === tab && styles.statusTabActiveText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Orders List */}
      <View style={styles.ordersList}>
        {DUMMY_ORDERS.map(order => (
          <View key={order.id} style={styles.orderCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.orderTitle}>{order.title}</Text>
              <View style={styles.orderMeta}>
                <Text style={styles.orderDate}>{order.date}</Text>
                <Text style={styles.orderDot}> • </Text>
                <Text style={styles.orderStatusCompleted}>{order.status}</Text>
              </View>
            </View>
            <Text style={styles.orderAmount}>{order.amount}</Text>
            <TouchableOpacity style={styles.viewBtn} onPress={() => handleViewOrder(order)}>
              <Text style={styles.viewBtnText}>View</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderDetails = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      
      {/* Back Button inside modal */}
      <TouchableOpacity onPress={() => setViewMode('list')} style={styles.detailsBackBtn}>
        <Text style={styles.detailsBackText}>← Back to List</Text>
      </TouchableOpacity>

      <View style={styles.addressCard}>
        <View style={styles.addressHeader}>
          <View>
            <Text style={styles.addressTitle}>22, Musakhedi Main Rd</Text>
            <Text style={styles.addressMeta}>01 April 2024 • 12:00 PM</Text>
            <Text style={styles.addressMeta}>Rs. 19</Text>
          </View>
        </View>

        <View style={styles.addressDetailsHeader}>
          <Text style={styles.addressDetailsTitle}>Address Details</Text>
          <ChevronDownIcon size={16} color="#94A3B8" />
        </View>

        <Text style={styles.serviceIdText}>Service ID #SR12345684349</Text>

        <View style={styles.mapRouteBox}>
          {/* Start Point */}
          <View style={styles.routeRow}>
            <View style={styles.routeIconBox}>
              <View style={styles.dotGreen} />
              <View style={styles.lineVertical} />
            </View>
            <View style={styles.routeTexts}>
              <Text style={styles.routeLocTitle}>17-1-64/B</Text>
              <Text style={styles.routeLocSub}>Prasannamma temple centre, hla Nagar, Tirupati, Andhra Pradesh 517501, India</Text>
            </View>
          </View>
          {/* End Point */}
          <View style={styles.routeRow}>
            <View style={styles.routeIconBox}>
              <View style={styles.dotRed} />
            </View>
            <View style={styles.routeTexts}>
              <Text style={styles.routeLocTitle}>17-1-64/B</Text>
              <Text style={styles.routeLocSub}>Padmavatipuram, Tirupati, Andhra Pradesh 517501, India</Text>
            </View>
          </View>
          <Text style={styles.routeMetaText}>13.4 mins  •  3.5 kms</Text>
        </View>

        <TouchableOpacity style={styles.helpBox}>
          <HeadphoneIcon size={20} color="#FFFFFF" />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.helpTitle}>Need help?</Text>
            <Text style={styles.helpSub}>We're a tap away</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.invoiceCard}>
        <View style={styles.invoiceHeader}>
          <ReceiptIcon size={20} color="#0F172A" />
          <Text style={styles.invoiceTitle}>Invoice</Text>
        </View>

        <View style={styles.invoiceRowTotal}>
          <Text style={styles.invoiceTotalLabel}>Total Fare</Text>
          <Text style={styles.invoiceTotalValue}>Rs. 19.00</Text>
        </View>
        <View style={styles.invoiceDividerDashed} />

        <View style={styles.invoiceRow}>
          <Text style={styles.invoiceLabel}>Ride Charge</Text>
          <Text style={styles.invoiceValue}>Rs. 17.82</Text>
        </View>
        <View style={styles.invoiceRow}>
          <Text style={styles.invoiceLabel}>Booking Fees & Convenience Charges</Text>
          <Text style={styles.invoiceValue}>Rs. 20.18</Text>
        </View>
        <View style={styles.invoiceRow}>
          <Text style={styles.invoiceLabel}>Discount</Text>
          <Text style={styles.invoiceValue}>Rs. -19.0</Text>
        </View>

        <TouchableOpacity style={styles.emailBtn}>
          <EnvelopeIcon size={20} color="#FFFFFF" />
          <Text style={styles.emailBtnText}>Send Invoice via Email</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Pressable onPress={handleClose} style={StyleSheet.absoluteFill}>
          <View style={StyleSheet.absoluteFill} />
        </Pressable>
        
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <CloseIcon size={24} color="#64748B" />
            </TouchableOpacity>
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {viewMode === 'list' ? 'Order History & Earnings' : 'Order Details'}
              </Text>
            </View>

            {viewMode === 'list' ? renderList() : renderDetails()}
            
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '100%',
    paddingHorizontal: 20,
    maxHeight: '90%',
  },
  modalContent: {
    backgroundColor: '#F8FAFC', // slightly off-white for the modal background
    borderRadius: 24,
    width: '100%',
    maxHeight: '100%',
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  modalHeader: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  scrollContent: {
    padding: 20,
  },

  // LIST VIEW STYLES
  timeToggleContainer: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 24, padding: 4, marginBottom: 20 },
  timeToggleTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 20 },
  timeToggleActive: { backgroundColor: 'rgba(26, 15, 163, 1.00)' },
  timeToggleText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  timeToggleActiveText: { color: '#FFFFFF', fontWeight: '600' },

  dateCarousel: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  arrowBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  arrowText: { color: '#3B82F6', fontWeight: 'bold' },
  dateItem: { paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#F1F5F9', borderRadius: 16, alignItems: 'center' },
  dateItemActive: { backgroundColor: 'rgba(26, 15, 163, 1.00)' },
  dateItemText: { fontSize: 12, color: '#64748B', textAlign: 'center' },
  dateItemActiveText: { fontSize: 12, color: '#FFFFFF', textAlign: 'center', fontWeight: '600' },

  statsContainer: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 16 },
  statBox: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: '#F1F5F9', marginHorizontal: 16 },
  statValue: { fontSize: 24, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  statValueEarnings: { fontSize: 24, fontWeight: '700', color: '#4338CA', marginBottom: 4 },
  statLabel: { fontSize: 11, color: '#64748B' },

  actionLink: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12 },
  actionLinkIconBox: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  actionLinkTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  actionLinkSub: { fontSize: 11, color: '#64748B' },
  actionLinkArrow: { fontSize: 18, color: '#94A3B8' },

  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 16 },
  historyTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  excelBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: '#EEF2FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#FFFFFF' },
  excelBtnText: { fontSize: 12, color: '#3B82F6', fontWeight: '500' },

  statusTabsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  statusTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9' },
  statusTabActive: { backgroundColor: '#DBEAFE' },
  statusTabText: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  statusTabActiveText: { color: '#1E3A8A', fontWeight: '700' },

  ordersList: { gap: 12 },
  orderCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  orderTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  orderMeta: { flexDirection: 'row', alignItems: 'center' },
  orderDate: { fontSize: 11, color: '#64748B' },
  orderDot: { fontSize: 11, color: '#94A3B8' },
  orderStatusCompleted: { fontSize: 11, color: '#22C55E', fontWeight: '600' },
  orderAmount: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginRight: 12 },
  viewBtn: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 },
  viewBtnText: { fontSize: 11, color: '#0F172A', fontWeight: '500' },

  // DETAILS VIEW STYLES
  detailsBackBtn: { marginBottom: 16 },
  detailsBackText: { fontSize: 14, color: '#4338CA', fontWeight: '600' },

  addressCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 16 },
  addressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  addressTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  addressMeta: { fontSize: 11, color: '#64748B', marginBottom: 2 },
  
  addressDetailsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  addressDetailsTitle: { fontSize: 13, fontWeight: '600', color: '#0F172A' },
  serviceIdText: { fontSize: 11, color: '#64748B', marginBottom: 16 },

  mapRouteBox: { paddingLeft: 8, marginBottom: 24 },
  routeRow: { flexDirection: 'row' },
  routeIconBox: { width: 20, alignItems: 'center', marginRight: 12 },
  dotGreen: { width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: '#22C55E' },
  dotRed: { width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: '#EF4444' },
  lineVertical: { width: 1, height: 40, backgroundColor: '#CBD5E1', marginVertical: 4 },
  routeTexts: { flex: 1, paddingBottom: 16 },
  routeLocTitle: { fontSize: 12, fontWeight: '600', color: '#0F172A', marginBottom: 2 },
  routeLocSub: { fontSize: 11, color: '#64748B', lineHeight: 16 },
  routeMetaText: { fontSize: 11, color: '#94A3B8', marginTop: -8, marginLeft: 32 },

  helpBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(26, 15, 163, 1.00)', borderRadius: 12, padding: 16 },
  helpTitle: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  helpSub: { fontSize: 11, color: '#CBD5E1' },

  invoiceCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 40 },
  invoiceHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  invoiceTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  invoiceRowTotal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  invoiceTotalLabel: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  invoiceTotalValue: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  invoiceDividerDashed: { height: 1, borderTopWidth: 1, borderTopColor: '#E2E8F0', borderStyle: 'dashed', marginBottom: 16 },
  invoiceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  invoiceLabel: { fontSize: 11, color: '#64748B', flex: 1, paddingRight: 16 },
  invoiceValue: { fontSize: 12, color: '#0F172A', fontWeight: '500' },
  
  emailBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(26, 15, 163, 1.00)', borderRadius: 12, paddingVertical: 14, marginTop: 24, gap: 8 },
  emailBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' }
});
