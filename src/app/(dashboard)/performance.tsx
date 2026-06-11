import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeRouter } from "@/hooks/useSafeRouter";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { BackArrowIcon, ChevronDownIcon } from "@/components/ui/Icons";
import Svg, { Path, Circle } from "react-native-svg";
import { useAndroidBack } from "@/hooks/useAndroidBack";
import { useAuthStore } from "@/store/authStore";

const PRIMARY = "rgba(26, 15, 163, 1.00)";

const BRANCHES = ["All Branches", "Downtown Branch", "North Zone", "East Hub"];
const EMPLOYEES = [
  "All Employees",
  "Rahul Sharma",
  "Priya Singh",
  "Amit Kumar",
];
const SERVICES = [
  "All Services",
  "Plumbing",
  "Electrical",
  "Cleaning",
  "Carpentry",
];

type HistoryTab = "Completed" | "Pending" | "Canceled";

const BOOKING_HISTORY = [
  {
    id: "B001",
    service: "AC Repair",
    date: "Oct 13, 2023",
    amount: "₹500",
    status: "Completed",
  },
  {
    id: "B002",
    service: "AC gas filling",
    date: "Oct 13, 2023",
    amount: "₹500",
    status: "Completed",
  },
  {
    id: "B003",
    service: "AC pump Change",
    date: "Oct 12, 2023",
    amount: "₹200",
    status: "Completed",
  },
  {
    id: "B004",
    service: "AC Air Filter Change",
    date: "Oct 12, 2023",
    amount: "₹200",
    status: "Completed",
  },
  {
    id: "B005",
    service: "AC Repair",
    date: "Oct 11, 2023",
    amount: "₹350",
    status: "Pending",
  },
  {
    id: "B006",
    service: "Washing Machine",
    date: "Oct 11, 2023",
    amount: "₹400",
    status: "Pending",
  },
  {
    id: "B007",
    service: "RO Installation",
    date: "Oct 10, 2023",
    amount: "₹600",
    status: "Canceled",
  },
  {
    id: "B008",
    service: "AC Servicing",
    date: "Oct 10, 2023",
    amount: "₹300",
    status: "Canceled",
  },
];

const Dropdown = ({
  value,
  options,
  onSelect,
}: {
  value: string;
  options: string[];
  onSelect: (v: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={dd.wrap}>
      <TouchableOpacity
        style={dd.btn}
        onPress={() => setOpen(!open)}
        activeOpacity={0.8}
      >
        <Text style={dd.btnText} numberOfLines={1}>
          {value}
        </Text>
        <ChevronDownIcon size={14} color="#64748B" />
      </TouchableOpacity>
      {open && (
        <View style={dd.menu}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[dd.option, opt === value && dd.optionActive]}
              onPress={() => {
                onSelect(opt);
                setOpen(false);
              }}
            >
              <Text
                style={[dd.optionText, opt === value && dd.optionTextActive]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const ChevronLeft = ({ color = "#3B82F6" }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18L9 12L15 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ChevronRight = ({ color = "#3B82F6" }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 18L15 12L9 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const StarIcon = ({ color = "#64748B" }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ClockIcon = ({ color = "#64748B" }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    <Path
      d="M12 8V12L15 15"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ProgressCircle = ({
  current,
  total,
}: {
  current: number;
  total: number;
}) => {
  const radius = 60;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (current / total) * circumference;
  return (
    <View style={styles.chartContainer}>
      <Svg width="140" height="140" viewBox="0 0 140 140">
        <Circle
          cx="70"
          cy="70"
          r={radius}
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx="70"
          cy="70"
          r={radius}
          stroke={PRIMARY}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
        />
      </Svg>
      <View style={styles.chartTextContainer}>
        <Text style={styles.chartText}>{`${current}/${total}`}</Text>
      </View>
    </View>
  );
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getDateWindow(centerDate: Date) {
  const result = [];
  for (let i = -1; i <= 1; i++) {
    const d = new Date(centerDate);
    d.setDate(centerDate.getDate() + i);
    result.push(d);
  }
  return result;
}

export default function PerformanceScreen() {
  useAndroidBack();
  const router = useSafeRouter();
  const role = useAuthStore((state) => state.role);

  const [activeTab, setActiveTab] = useState("Day");
  const [branchFilter, setBranchFilter] = useState("All Branches");
  const [empFilter, setEmpFilter] = useState("All Employees");
  const [serviceFilter, setServiceFilter] = useState("All Services");
  const [historyTab, setHistoryTab] = useState<HistoryTab>("Completed");
  const [bsTypeFilter, setBsTypeFilter] = useState<"Quotations" | "Orders">("Quotations");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const completedCount = BOOKING_HISTORY.filter(
    (b) => b.status === "Completed",
  ).length;
  const pendingCount = BOOKING_HISTORY.filter(
    (b) => b.status === "Pending",
  ).length;

  const filteredHistory = BOOKING_HISTORY.filter(
    (b) => b.status === historyTab,
  );

  const STATUS_COLOR: Record<HistoryTab, { bg: string; text: string }> = {
    Completed: { bg: "#DCFCE7", text: "#16A34A" },
    Pending: { bg: "#FEF9C3", text: "#CA8A04" },
    Canceled: { bg: "#FEE2E2", text: "#DC2626" },
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Performance</Text>
          <TouchableOpacity
            style={styles.helpBtn}
            onPress={() => router.push("/(dashboard)/help-advanced")}
          >
            <Text style={styles.helpBtnText}>Help</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.mainCard}>
            {/* BSP-only filters — on top */}
            {role === "BSP" && (
              <View style={styles.filterRow}>
                <Dropdown
                  value={branchFilter}
                  options={BRANCHES}
                  onSelect={setBranchFilter}
                />
                <Dropdown
                  value={empFilter}
                  options={EMPLOYEES}
                  onSelect={setEmpFilter}
                />
              </View>
            )}

            {/* BS-only filters — Branch dropdown + Quotations/Orders buttons */}
            {role === "BS" && (
              <View style={styles.bsFilterRow}>
                <View style={styles.bsDropdownWrap}>
                  <Dropdown
                    value={branchFilter}
                    options={BRANCHES}
                    onSelect={setBranchFilter}
                  />
                </View>
                <TouchableOpacity
                  style={[styles.bsTypeBtn, bsTypeFilter === "Quotations" && styles.bsTypeBtnActive]}
                  onPress={() => setBsTypeFilter("Quotations")}
                  activeOpacity={1}
                >
                  <Text style={[styles.bsTypeBtnText, bsTypeFilter === "Quotations" && styles.bsTypeBtnTextActive]}>
                    Quotations
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.bsTypeBtn, bsTypeFilter === "Orders" && styles.bsTypeBtnActive]}
                  onPress={() => setBsTypeFilter("Orders")}
                  activeOpacity={1}
                >
                  <Text style={[styles.bsTypeBtnText, bsTypeFilter === "Orders" && styles.bsTypeBtnTextActive]}>
                    Orders
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Day / Week / Month tabs — below filters */}
            <View style={styles.tabsRow}>
              {["Day", "Week", "Month"].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.tabBtn,
                    activeTab === tab && styles.tabBtnActive,
                  ]}
                  onPress={() => setActiveTab(tab)}
                  activeOpacity={1}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === tab && styles.tabTextActive,
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Date scroller */}
            <View style={styles.dateScrollRow}>
              <TouchableOpacity
                style={styles.dateArrow}
                onPress={() => {
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() - 1);
                  setSelectedDate(d);
                }}
                activeOpacity={0.7}
              >
                <ChevronLeft />
              </TouchableOpacity>
              {getDateWindow(selectedDate).map((date, idx) => {
                const isActive = idx === 1;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={isActive ? styles.datePillActive : styles.datePill}
                    onPress={() => setSelectedDate(date)}
                    activeOpacity={0.8}
                  >
                    <Text style={isActive ? styles.dateDayActive : styles.dateDay}>
                      {DAY_NAMES[date.getDay()]}
                    </Text>
                    <Text style={isActive ? styles.dateNumActive : styles.dateNum}>
                      {String(date.getDate()).padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity
                style={styles.dateArrow}
                onPress={() => {
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() + 1);
                  setSelectedDate(d);
                }}
                activeOpacity={0.7}
              >
                <ChevronRight />
              </TouchableOpacity>
            </View>

            {/* Stat boxes: only for BS */}
            {role === "BS" && (
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{completedCount}</Text>
                  <Text style={styles.statLabel}>Completed Bookings</Text>
                </View>
                <View style={[styles.statBox, styles.statBoxRight]}>
                  <Text style={[styles.statValue, { color: "#CA8A04" }]}>
                    {pendingCount}
                  </Text>
                  <Text style={styles.statLabel}>Pending Bookings</Text>
                </View>
              </View>
            )}

            {/* Progress chart */}
            <ProgressCircle current={4} total={20} />
            <Text style={styles.acceptTitle}>Accept 20 Orders</Text>
            <Text style={styles.acceptSub}>to see your performance</Text>

            {role !== "BS" && (
              <View style={styles.infoBanner}>
                <Text style={styles.infoBannerText}>
                  Bike Lite, Parcel and Bike only
                </Text>
              </View>
            )}

            {/* By Category */}
            <Text style={styles.sectionTitle}>By Category</Text>
            {[
              { name: "Deep Cleaning", count: 2 },
              { name: "Standard Cleaning", count: 1 },
              { name: "Move Out", count: 1 },
            ].map((cat) => (
              <View key={cat.name} style={styles.categoryRow}>
                <View style={styles.categoryLeft}>
                  <View style={styles.dot} />
                  <Text style={styles.categoryName}>{cat.name}</Text>
                </View>
                <Text style={styles.categoryValue}>{cat.count} bookings</Text>
              </View>
            ))}

            {/* Overview */}
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.overviewRow}>
              <View style={styles.overviewBox}>
                <View style={styles.overviewHeader}>
                  <StarIcon />
                  <Text style={styles.overviewLabel}>Rating</Text>
                </View>
                <Text style={styles.overviewValue}>4.9</Text>
              </View>
              <View style={styles.overviewBox}>
                <View style={styles.overviewHeader}>
                  <ClockIcon />
                  <Text style={styles.overviewLabel}>Response</Text>
                </View>
                <Text style={styles.overviewValue}>1h</Text>
              </View>
            </View>
          </View>

          {/* Booking History section */}
          <View style={styles.historySection}>
            <Text style={styles.historySectionTitle}>Booking History</Text>

            {/* Completed / Pending / Canceled tabs */}
            <View style={styles.historyTabsRow}>
              {(["Completed", "Pending", "Canceled"] as HistoryTab[]).map(
                (tab) => (
                  <TouchableOpacity
                    key={tab}
                    style={[
                      styles.historyTab,
                      historyTab === tab && styles.historyTabActive,
                    ]}
                    onPress={() => setHistoryTab(tab)}
                    activeOpacity={1}
                  >
                    <Text
                      style={[
                        styles.historyTabText,
                        historyTab === tab && styles.historyTabTextActive,
                      ]}
                    >
                      {tab}
                    </Text>
                  </TouchableOpacity>
                ),
              )}
            </View>

            {/* Booking list */}
            {filteredHistory.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>No {historyTab} bookings</Text>
              </View>
            ) : (
              filteredHistory.map((b) => {
                const col = STATUS_COLOR[b.status as HistoryTab];
                return (
                  <View key={b.id} style={styles.bookingCard}>
                    <View style={styles.bookingCardLeft}>
                      <Text style={styles.bookingService}>{b.service}</Text>
                      <Text style={styles.bookingDate}>{b.date}</Text>
                    </View>
                    <View style={styles.bookingCardRight}>
                      <Text style={styles.bookingAmount}>{b.amount}</Text>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: col.bg },
                        ]}
                      >
                        <Text style={[styles.statusText, { color: col.text }]}>
                          {b.status}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#0F172A", flex: 1 },
  helpBtn: {
    backgroundColor: "#F97316",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  helpBtnText: { color: "#FFFFFF", fontSize: 12, fontWeight: "600" },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  mainCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },

  tabsRow: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  tabBtnActive: { backgroundColor: PRIMARY },
  tabText: { fontSize: 12, fontWeight: "600", color: "#64748B" },
  tabTextActive: { color: "#FFFFFF" },

  filterRow: { flexDirection: "row", gap: 8, marginBottom: 16, zIndex: 20 },

  dateScrollRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dateArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  datePill: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
  },
  datePillActive: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
  },
  dateDay: { fontSize: 11, color: "#64748B", marginBottom: 4 },
  dateNum: { fontSize: 14, fontWeight: "700", color: "#0F172A" },
  dateDayActive: { fontSize: 11, color: "#E2E8F0", marginBottom: 4 },
  dateNumActive: { fontSize: 14, fontWeight: "700", color: "#FFFFFF" },

  statsRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  statBox: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  statBoxRight: {
    borderWidth: 1,
    borderColor: "#FEF9C3",
    backgroundColor: "#FFFEF0",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "800",
    color: PRIMARY,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
    textAlign: "center",
  },

  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  chartTextContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  chartText: { fontSize: 20, fontWeight: "800", color: PRIMARY },

  acceptTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 4,
  },
  acceptSub: {
    fontSize: 12,
    color: "#475569",
    textAlign: "center",
    marginBottom: 16,
  },

  infoBanner: {
    backgroundColor: "#F8FAFC",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  infoBannerText: { fontSize: 11, color: "#0F172A", fontWeight: "500" },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 16,
  },

  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 20,
    marginBottom: 12,
  },
  categoryLeft: { flexDirection: "row", alignItems: "center" },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3B82F6",
    marginRight: 8,
  },
  categoryName: { fontSize: 12, fontWeight: "600", color: "#0F172A" },
  categoryValue: { fontSize: 11, color: "#94A3B8" },

  overviewRow: { flexDirection: "row", gap: 12, marginTop: 4 },
  overviewBox: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 20,
  },
  overviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  overviewLabel: { fontSize: 11, color: "#94A3B8", marginLeft: 6 },
  overviewValue: { fontSize: 18, fontWeight: "800", color: "#0F172A" },

  // Booking History section
  historySection: { backgroundColor: "#FFFFFF", borderRadius: 24, padding: 20 },
  historySectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 16,
  },

  historyTabsRow: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  historyTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  historyTabActive: { backgroundColor: PRIMARY },
  historyTabText: { fontSize: 12, fontWeight: "600", color: "#64748B" },
  historyTabTextActive: { color: "#FFFFFF" },

  bookingCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  bookingCardLeft: { flex: 1 },
  bookingService: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 4,
  },
  bookingDate: { fontSize: 11, color: "#94A3B8" },
  bookingCardRight: { alignItems: "flex-end", gap: 6 },
  bookingAmount: { fontSize: 14, fontWeight: "700", color: PRIMARY },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  statusText: { fontSize: 10, fontWeight: "700" },

  emptyBox: { paddingVertical: 32, alignItems: "center" },
  emptyText: { fontSize: 13, color: "#94A3B8" },

  bsFilterRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16, zIndex: 20 },
  bsDropdownWrap: { flex: 1 },
  bsTypeBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: "#E2E8F0", backgroundColor: "#F8FAFC" },
  bsTypeBtnActive: { backgroundColor: "rgba(26, 15, 163, 1.00)", borderColor: "rgba(26, 15, 163, 1.00)" },
  bsTypeBtnText: { fontSize: 12, fontWeight: "600", color: "#64748B" },
  bsTypeBtnTextActive: { color: "#FFFFFF" },
});

const dd = StyleSheet.create({
  wrap: { flex: 1, position: "relative", zIndex: 10 },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  btnText: {
    fontSize: 10,
    color: "#0F172A",
    fontWeight: "500",
    flex: 1,
    marginRight: 2,
  },
  menu: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    zIndex: 999,
    elevation: 8,
  },
  option: { paddingHorizontal: 12, paddingVertical: 9 },
  optionActive: { backgroundColor: "rgba(26,15,163,0.06)" },
  optionText: { fontSize: 11, color: "#334155" },
  optionTextActive: { fontWeight: "700", color: PRIMARY },
});
