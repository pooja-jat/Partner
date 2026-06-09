import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon, ChevronDownIcon } from '@/components/ui/Icons';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { useAuthStore } from '@/store/authStore';

const PRIMARY = 'rgba(26, 15, 163, 1.00)';

const BRANCHES  = ['All Branches',  'Downtown Branch', 'North Zone', 'East Hub'];
const EMPLOYEES = ['All Employees', 'Rahul Sharma',    'Priya Singh', 'Amit Kumar'];
const SERVICES  = ['All Services',  'Plumbing',        'Electrical',  'Cleaning', 'Carpentry'];

type EarningsTab = 'branch' | 'employee' | 'service';
type HistoryTab  = 'Completed' | 'Canceled' | 'Missed';

// ── Dummy data (BSP) ────────────────────────────────────────────────────────

const BRANCH_EARNINGS = [
  { id: '1', name: 'Downtown Branch', bookings: 24, amount: '₹18,400' },
  { id: '2', name: 'North Zone',      bookings: 16, amount: '₹11,200' },
  { id: '3', name: 'East Hub',        bookings: 9,  amount: '₹6,750'  },
];

const EMPLOYEE_EARNINGS = [
  { id: '1', name: 'Rahul Sharma', branch: 'Downtown Branch', bookings: 12, amount: '₹9,600' },
  { id: '2', name: 'Priya Singh',  branch: 'North Zone',      bookings: 8,  amount: '₹6,400' },
  { id: '3', name: 'Amit Kumar',   branch: 'East Hub',        bookings: 6,  amount: '₹4,800' },
];

const SERVICE_EARNINGS = [
  { id: '1', service: 'Plumbing',   bookings: 18, amount: '₹14,400' },
  { id: '2', service: 'Electrical', bookings: 14, amount: '₹11,200' },
  { id: '3', service: 'Cleaning',   bookings: 10, amount: '₹7,000'  },
  { id: '4', service: 'Carpentry',  bookings: 7,  amount: '₹5,600'  },
];

// ── Dummy data (BS) ─────────────────────────────────────────────────────────

const ORDER_HISTORY = [
  { id: 'B001', service: 'AC Repair',            date: 'Oct 13, 2023', amount: '₹500', status: 'Completed' },
  { id: 'B002', service: 'AC gas filling',       date: 'Oct 13, 2023', amount: '₹500', status: 'Completed' },
  { id: 'B003', service: 'AC pump Change',       date: 'Oct 12, 2023', amount: '₹200', status: 'Completed' },
  { id: 'B004', service: 'AC Air Filter Change', date: 'Oct 12, 2023', amount: '₹200', status: 'Completed' },
  { id: 'B005', service: 'AC Repair',            date: 'Oct 11, 2023', amount: '₹350', status: 'Pending'   },
  { id: 'B006', service: 'Washing Machine',      date: 'Oct 11, 2023', amount: '₹400', status: 'Pending'   },
  { id: 'B007', service: 'RO Installation',      date: 'Oct 10, 2023', amount: '₹600', status: 'Canceled'  },
  { id: 'B008', service: 'AC Servicing',         date: 'Oct 10, 2023', amount: '₹300', status: 'Canceled'  },
];

const STATUS_COLOR: Record<HistoryTab, { bg: string; text: string }> = {
  Completed: { bg: '#DCFCE7', text: '#16A34A' },
  Canceled:  { bg: '#FEE2E2', text: '#DC2626' },
  Missed:    { bg: '#FEF3C7', text: '#92400E' },
};

// ── Shared components ───────────────────────────────────────────────────────

const Dropdown = ({ value, options, onSelect }: { value: string; options: string[]; onSelect: (v: string) => void }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={dd.wrap}>
      <TouchableOpacity style={dd.btn} onPress={() => setOpen(!open)} activeOpacity={0.8}>
        <Text style={dd.btnText} numberOfLines={1}>{value}</Text>
        <ChevronDownIcon size={14} color="#64748B" />
      </TouchableOpacity>
      {open && (
        <View style={dd.menu}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[dd.option, opt === value && dd.optionActive]}
              onPress={() => { onSelect(opt); setOpen(false); }}
            >
              <Text style={[dd.optionText, opt === value && dd.optionTextActive]}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const SummaryCard = ({ label, value, sub }: { label: string; value: string; sub: string }) => (
  <View style={sc.card}>
    <Text style={sc.label}>{label}</Text>
    <Text style={sc.value}>{value}</Text>
    <Text style={sc.sub}>{sub}</Text>
  </View>
);

// ── Main screen ─────────────────────────────────────────────────────────────

export default function BookingEarningsScreen() {
  const router = useSafeRouter();
  useAndroidBack(() => router.back());
  const role = useAuthStore(state => state.role);

  // BSP state
  const [activeTab,            setActiveTab]            = useState<EarningsTab>('branch');
  const [branchFilter,         setBranchFilter]         = useState('All Branches');
  const [employeeFilter,       setEmployeeFilter]       = useState('All Employees');
  const [employeeBranchFilter, setEmployeeBranchFilter] = useState('All Branches');
  const [serviceFilter,        setServiceFilter]        = useState('All Services');
  const [serviceBranchFilter,  setServiceBranchFilter]  = useState('All Branches');

  // BS state
  const [bsBranchFilter,  setBsBranchFilter]  = useState('All Branches');
  const [bsServiceFilter, setBsServiceFilter] = useState('All Services');
  const [historyTab,      setHistoryTab]      = useState<HistoryTab>('Completed');

  const completedOrders = ORDER_HISTORY.filter(b => b.status === 'Completed').length;
  const orderEarnings   = ORDER_HISTORY
    .filter(b => b.status === 'Completed')
    .reduce((sum, b) => sum + parseInt(b.amount.replace(/[₹,]/g, '')), 0);

  const filteredHistory = ORDER_HISTORY.filter(b => b.status === historyTab);

  const bspTabs: { key: EarningsTab; label: string }[] = [
    { key: 'branch',   label: 'Branch Earnings'   },
    { key: 'employee', label: 'Employee Earnings'  },
    { key: 'service',  label: 'Service Wise'       },
  ];

  // ── BS Layout ──────────────────────────────────────────────────────────────
  if (role === 'BS') {
    return (
      <GradientBackground style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <BackArrowIcon size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Order Earnings</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.bsScroll}>

            {/* Branch + Services filters */}
            <View style={styles.bsFilterRow}>
              <Dropdown value={bsBranchFilter}  options={BRANCHES}  onSelect={setBsBranchFilter} />
              <Dropdown value={bsServiceFilter} options={SERVICES}  onSelect={setBsServiceFilter} />
            </View>

            {/* Stat boxes */}
            <View style={styles.bsStatsRow}>
              <View style={styles.bsStatBox}>
                <Text style={styles.bsStatValue}>{completedOrders}</Text>
                <Text style={styles.statLabel}>Completed Orders</Text>
              </View>
              <View style={[styles.bsStatBox, styles.bsStatBoxEarnings]}>
                <Text style={[styles.bsStatValue, { color: '#16A34A' }]}>₹{orderEarnings}</Text>
                <Text style={styles.statLabel}>Order Earnings</Text>
              </View>
            </View>

            {/* Order History */}
            <Text style={styles.bsSectionTitle}>Order History</Text>

            <View style={styles.bsHistoryTabsRow}>
              {(['Completed', 'Canceled', 'Missed'] as HistoryTab[]).map(tab => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.historyTab, historyTab === tab && styles.historyTabActive]}
                  onPress={() => setHistoryTab(tab)}
                  activeOpacity={1}
                >
                  <Text style={[styles.historyTabText, historyTab === tab && styles.historyTabTextActive]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {filteredHistory.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>No {historyTab} orders</Text>
              </View>
            ) : (
              filteredHistory.map(b => {
                const col = STATUS_COLOR[b.status as HistoryTab];
                return (
                  <View key={b.id} style={styles.bsCard}>
                    <View style={styles.cardLeft}>
                      <Text style={styles.bsCardService}>{b.service}</Text>
                      <Text style={styles.cardDate}>{b.date}</Text>
                    </View>
                    <View style={styles.cardRight}>
                      <Text style={styles.bsCardAmount}>{b.amount}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: col.bg }]}>
                        <Text style={[styles.statusText, { color: col.text }]}>{b.status}</Text>
                      </View>
                    </View>
                  </View>
                );
              })
            )}

          </ScrollView>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  // ── BSP Layout ────────────────────────────────────────────────────────────
  const bspCompleted = ORDER_HISTORY.filter(b => b.status === 'Completed').length;
  const bspEarnings  = ORDER_HISTORY
    .filter(b => b.status === 'Completed')
    .reduce((sum, b) => sum + parseInt(b.amount.replace(/[₹,]/g, '')), 0);
  const bspFiltered  = ORDER_HISTORY.filter(b => b.status === historyTab);

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Booking Earnings</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* Branch + Employee + Services filters */}
          <View style={styles.filterCol}>
            <View style={styles.filterRow}>
              <Dropdown value={branchFilter}   options={BRANCHES}   onSelect={setBranchFilter} />
              <Dropdown value={employeeFilter} options={EMPLOYEES}  onSelect={setEmployeeFilter} />
            </View>
            <View style={styles.filterRow}>
              <Dropdown value={serviceFilter}  options={SERVICES}   onSelect={setServiceFilter} />
            </View>
          </View>

          {/* Stat boxes */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{bspCompleted}</Text>
              <Text style={styles.statLabel}>Completed Bookings</Text>
            </View>
            <View style={[styles.statBox, styles.statBoxEarnings]}>
              <Text style={[styles.statValue, { color: '#16A34A' }]}>₹{bspEarnings}</Text>
              <Text style={styles.statLabel}>Booking Earnings</Text>
            </View>
          </View>

          {/* Booking History */}
          <Text style={styles.sectionTitle}>Booking History</Text>

          <View style={styles.historyTabsRow}>
            {(['Completed', 'Canceled', 'Missed'] as HistoryTab[]).map(tab => (
              <TouchableOpacity
                key={tab}
                style={[styles.historyTab, historyTab === tab && styles.historyTabActive]}
                onPress={() => setHistoryTab(tab)}
                activeOpacity={1}
              >
                <Text style={[styles.historyTabText, historyTab === tab && styles.historyTabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {bspFiltered.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No {historyTab} bookings</Text>
            </View>
          ) : (
            bspFiltered.map(b => {
              const col = STATUS_COLOR[b.status as HistoryTab];
              return (
                <View key={b.id} style={styles.card}>
                  <View style={styles.cardLeft}>
                    <Text style={styles.cardService}>{b.service}</Text>
                    <Text style={styles.cardDate}>{b.date}</Text>
                  </View>
                  <View style={styles.cardRight}>
                    <Text style={styles.cardAmount}>{b.amount}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: col.bg }]}>
                      <Text style={[styles.statusText, { color: col.text }]}>{b.status}</Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}

        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea:  { flex: 1 },
  header:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  backBtn:   { marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },

  tabBar: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 16, backgroundColor: '#E2E8F0', borderRadius: 12, padding: 4 },
  tab:       { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tabActive: { backgroundColor: PRIMARY },
  tabText:   { fontSize: 11, fontWeight: '600', color: '#64748B', textAlign: 'center' },
  tabTextActive: { color: '#FFFFFF' },

  scroll:     { paddingHorizontal: 20, paddingBottom: 40 },
  filterCol:  { marginBottom: 16, gap: 10, zIndex: 20 },
  filterRow:  { flexDirection: 'row', gap: 10 },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },

  // BSP stat boxes (shared)
  statsRow:       { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statBox:        { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9', elevation: 1 },
  statBoxEarnings:{ borderColor: '#DCFCE7', backgroundColor: '#F0FDF4' },
  statValue:      { fontSize: 28, fontWeight: '800', color: PRIMARY, marginBottom: 4 },
  statLabel:      { fontSize: 11, color: '#64748B', fontWeight: '500', textAlign: 'center' },

  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 14 },

  historyTabsRow:     { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 12, padding: 4, marginBottom: 16 },
  historyTab:         { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 8 },
  historyTabActive:   { backgroundColor: PRIMARY },
  historyTabText:     { fontSize: 12, fontWeight: '600', color: '#64748B' },
  historyTabTextActive: { color: '#FFFFFF' },

  // BSP card (shared)
  card:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#F1F5F9', elevation: 1 },
  earningCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#F1F5F9', elevation: 1 },
  cardLeft:    { flex: 1 },
  cardService: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  cardDate:    { fontSize: 12, color: '#64748B' },
  cardRight:   { alignItems: 'flex-end', gap: 6 },
  cardAmount:  { fontSize: 16, fontWeight: '800', color: PRIMARY },

  statusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  statusText:  { fontSize: 10, fontWeight: '700' },

  pill:     { backgroundColor: 'rgba(26,15,163,0.08)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  pillText: { fontSize: 10, fontWeight: '700', color: PRIMARY },

  emptyBox:  { paddingVertical: 40, alignItems: 'center' },
  emptyText: { fontSize: 13, color: '#94A3B8' },

  // ── BS-specific styles ──
  bsScroll:        { paddingHorizontal: 24, paddingBottom: 48 },
  bsFilterRow:     { flexDirection: 'row', gap: 12, marginBottom: 20, zIndex: 10 },
  bsStatsRow:      { flexDirection: 'row', gap: 14, marginBottom: 28 },
  bsStatBox:       { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 18, paddingVertical: 20, paddingHorizontal: 16, alignItems: 'center', borderWidth: 1, borderColor: '#E8ECF1', elevation: 3, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  bsStatBoxEarnings: { borderColor: '#BBF7D0', backgroundColor: '#F0FDF4' },
  bsStatValue:     { fontSize: 32, fontWeight: '800', color: PRIMARY, marginBottom: 6 },
  bsSectionTitle:  { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 16, marginTop: 4 },
  bsHistoryTabsRow:{ flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 14, padding: 5, marginBottom: 20 },
  bsCard:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 18, paddingHorizontal: 20, marginBottom: 14, borderWidth: 1, borderColor: '#E8ECF1', elevation: 3, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  bsCardService:   { fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
  bsCardAmount:    { fontSize: 18, fontWeight: '800', color: PRIMARY },
});

const dd = StyleSheet.create({
  wrap: { flex: 1, position: 'relative', zIndex: 10 },
  btn:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  btnText: { fontSize: 12, color: '#0F172A', fontWeight: '500', flex: 1, marginRight: 4 },
  menu:    { position: 'absolute', top: 46, left: 0, right: 0, backgroundColor: '#FFFFFF', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', zIndex: 999, elevation: 8 },
  option:       { paddingHorizontal: 14, paddingVertical: 10 },
  optionActive: { backgroundColor: 'rgba(26,15,163,0.06)' },
  optionText:   { fontSize: 12, color: '#334155' },
  optionTextActive: { fontWeight: '700', color: PRIMARY },
});

const sc = StyleSheet.create({
  card:  { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#F1F5F9', elevation: 1 },
  label: { fontSize: 10, color: '#94A3B8', fontWeight: '500', marginBottom: 4 },
  value: { fontSize: 20, fontWeight: '800', color: '#0F172A', marginBottom: 2 },
  sub:   { fontSize: 10, color: '#64748B' },
});
