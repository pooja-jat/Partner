import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeRouter } from "@/hooks/useSafeRouter";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { BackArrowIcon } from "@/components/ui/Icons";
import Svg, { Path, Circle } from "react-native-svg";
import { StorageService } from "@/services/storage.service";

const SearchIcon = ({ color = "#94A3B8", size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" />
    <Path
      d="M21 21l-4.35-4.35"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

const FilterIcon = ({ color = "#1A0FA3", size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const BellIcon = ({ color = "#0F172A", size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const MenuIcon = ({ color = "#0F172A", size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 12h18M3 6h18M3 18h18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

const ServiceIconWrapper = ({ serviceName }: { serviceName: string }) => {
  const isAc = serviceName.toLowerCase().includes("ac");
  const isLeak =
    serviceName.toLowerCase().includes("leak") ||
    serviceName.toLowerCase().includes("pipe");

  let bg = "#EEF2FF";
  let char = "🔧";

  if (isAc) {
    bg = "#E0F2FE";
    char = "❄️";
  } else if (isLeak) {
    bg = "#ECFDF5";
    char = "🚰";
  }

  return (
    <View style={[styles.serviceIconCircle, { backgroundColor: bg }]}>
      <Text style={{ fontSize: 18 }}>{char}</Text>
    </View>
  );
};

export default function QuotationRequestsScreen() {
  const router = useSafeRouter();
  const [activeTab, setActiveTab] = useState<
    "Pending" | "Approved" | "Rejected"
  >("Pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const loadRequests = async () => {
      const storedRaw = await StorageService.getMaterialRequests();
      const stored = storedRaw ? storedRaw : [];

      const formatted = stored.map((r: any) => ({
        id: r.requestId,
        title: r.items?.some((i: any) => i.name === "Copper Pipe")
          ? "AC Repair"
          : "Material Request",
        serviceName: r.items?.some((i: any) => i.name === "Copper Pipe")
          ? "AC Repair"
          : "Material Request",
        customer: r.customerName || "James Wilson",
        bookingId: r.bookingId || "BK-9821",
        date: r.submittedAt?.split(" ")[0] || "Oct 24, 2023",
        status: r.status,
        estimate: r.grandTotal ? `₹${r.grandTotal.toFixed(2)}` : "₹1,250.00",
        requestId: r.requestId,
      }));

      const fallbacks = [
        {
          id: "RQ123456",
          title: "AC Repair",
          serviceName: "AC Repair",
          customer: "James Wilson",
          bookingId: "BK-9821",
          date: "Oct 24, 2023",
          status: "pending_quote",
          estimate: "$120.00",
          requestId: "RQ123456",
        },
        {
          id: "RQ882312",
          title: "Pipe Leakage",
          serviceName: "Pipe Leakage",
          customer: "Sarah Connor",
          bookingId: "BK-5512",
          date: "Oct 23, 2023",
          status: "pending_quote",
          estimate: "$85.00",
          requestId: "RQ882312",
        },
        {
          id: "RQ773211",
          title: "Wiring Installation",
          serviceName: "Wiring Installation",
          customer: "Michael Scott",
          bookingId: "BK-1029",
          date: "Oct 22, 2023",
          status: "pending_quote",
          estimate: "$210.00",
          requestId: "RQ773211",
        },
      ];

      // Filter duplicates by requestId
      const combined = [...formatted];
      fallbacks.forEach((f) => {
        if (!combined.some((c) => c.requestId === f.requestId)) {
          combined.push(f);
        }
      });

      setRequests(combined);
    };
    loadRequests();
  }, []);

  const getFilteredRequests = () => {
    return requests.filter((req) => {
      // Filter by Search Query
      const matchesSearch =
        req.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.customer.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Filter by Tab
      if (activeTab === "Pending") {
        return ["pending_quote", "quoted"].includes(req.status);
      } else if (activeTab === "Approved") {
        return ["approved", "completed"].includes(req.status);
      } else {
        return req.status === "rejected";
      }
    });
  };

  const filtered = getFilteredRequests();

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        {/* Design Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.replace("/(dashboard)")}
            style={styles.menuButton}
          >
            <MenuIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Quotations</Text>
          <TouchableOpacity style={styles.bellBtn}>
            <BellIcon />
          </TouchableOpacity>
        </View>

        {/* Custom Tabs */}
        <View style={styles.tabBar}>
          {(["Pending", "Approved", "Rejected"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              activeOpacity={0.85}
              style={[
                styles.tabItem,
                activeTab === tab && styles.activeTabItem,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <SearchIcon />
            <TextInput
              style={styles.searchInput}
              placeholder="Search Request ID..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <FilterIcon size={18} color="#1A0FA3" />
          </TouchableOpacity>
        </View>

        {/* Requests List */}
        <ScrollView contentContainerStyle={styles.content}>
          {filtered.map((req) => (
            <View key={req.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <ServiceIconWrapper serviceName={req.serviceName} />
                <View style={styles.headerInfo}>
                  <Text style={styles.cardTitle}>{req.serviceName}</Text>
                  <Text style={styles.requestIdText}>{req.requestId}</Text>
                </View>
                <View
                  style={[
                    styles.badge,
                    ["pending_quote", "quoted"].includes(req.status) && {
                      backgroundColor: "#EFF6FF",
                    },
                    req.status === "approved" && { backgroundColor: "#ECFDF5" },
                    req.status === "completed" && {
                      backgroundColor: "#F0FDF4",
                    },
                    req.status === "rejected" && { backgroundColor: "#FEF2F2" },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      ["pending_quote", "quoted"].includes(req.status) && {
                        color: "#2563EB",
                      },
                      req.status === "approved" && { color: "#10B981" },
                      req.status === "completed" && { color: "#166534" },
                      req.status === "rejected" && { color: "#EF4444" },
                    ]}
                  >
                    {req.status === "pending_quote"
                      ? "Pending"
                      : req.status === "quoted"
                        ? "Quoted"
                        : req.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.cardDivider} />

              <View style={styles.detailsGrid}>
                <View style={styles.detailsCol}>
                  <Text style={styles.gridLabel}>CUSTOMER</Text>
                  <Text style={styles.gridValue}>{req.customer}</Text>

                  <Text style={[styles.gridLabel, { marginTop: 12 }]}>
                    REQUESTED ON
                  </Text>
                  <Text style={styles.gridValue}>{req.date}</Text>
                </View>

                <View style={styles.detailsCol}>
                  <Text style={styles.gridLabel}>BOOKING ID</Text>
                  <Text style={styles.gridValue}>{req.bookingId}</Text>

                  <Text style={[styles.gridLabel, { marginTop: 12 }]}>
                    QUOTE ESTIMATE
                  </Text>
                  <Text style={styles.gridValueEstimate}>{req.estimate}</Text>
                </View>
              </View>

              <Button
                title="View Request Details"
                onPress={() =>
                  router.push({
                    pathname: "/(dashboard)/seller/quotation-details",
                    params: { requestId: req.requestId },
                  })
                }
                variant="primary"
                style={{ marginTop: 12 }}
              />
            </View>
          ))}

          {filtered.length === 0 && (
            <Text style={styles.emptyText}>No requests found in this tab.</Text>
          )}
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
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  menuButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#0F172A" },
  bellBtn: { padding: 4 },

  tabBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTabItem: {
    borderBottomColor: "#1A0FA3",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  activeTabText: {
    color: "#1A0FA3",
  },

  searchSection: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
    alignItems: "center",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#0F172A",
    padding: 0,
  },
  filterBtn: {
    width: 40,
    height: 40,
    backgroundColor: "#EEF2FF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  content: { padding: 20, gap: 16 },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    ...Platform.select({
      web: { boxShadow: "0px 2px 8px rgba(0,0,0,0.05)" },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 8,
        elevation: 2,
      },
    }),
  },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  serviceIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerInfo: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#0F172A" },
  requestIdText: { fontSize: 11, color: "#64748B", marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 10, fontWeight: "700" },

  cardDivider: { height: 1, backgroundColor: "#F1F5F9", marginVertical: 14 },

  detailsGrid: { flexDirection: "row", marginBottom: 16 },
  detailsCol: { flex: 1 },
  gridLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.5,
  },
  gridValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
    marginTop: 4,
  },
  gridValueEstimate: {
    fontSize: 12,
    fontWeight: "700",
    color: "#16A34A",
    marginTop: 4,
  },

  viewDetailsBtn: {
    backgroundColor: "#1E1B4B",
    borderRadius: 12,
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  viewDetailsBtnText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
  caretText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },

  emptyText: {
    textAlign: "center",
    color: "#64748B",
    marginTop: 40,
    fontSize: 13,
  },
});
