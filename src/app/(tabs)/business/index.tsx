import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeRouter } from "@/hooks/useSafeRouter";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SelectInput } from "@/components/ui/SelectInput";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { Button } from "@/components/ui/Button";
import {
  BackArrowIcon,
  BuildingIcon,
  PhoneIcon,
  ShieldCheckIcon,
} from "@/components/ui/Icons";
import { InfoAlert } from "@/components/ui/InfoAlert";
import { useLocalSearchParams } from "expo-router";
import { useAndroidBack } from "@/hooks/useAndroidBack";
import { SelectOptionsModal } from "@/components/common/SelectOptionsModal";
import { RoleAccessGuard } from "@/components/common/RoleAccessGuard";

const BUSINESS_TYPES = [
  { label: "Sole Proprietorship", value: "Sole Proprietorship" },
  { label: "Partnership", value: "Partnership" },
  {
    label: "Limited Liability Company (LLC)",
    value: "Limited Liability Company (LLC)",
  },
  { label: "Corporation", value: "Corporation" },
];

function SectionHeader({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionIconWrapper}>{icon}</View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

export default function BusinessSetupScreen() {
  useAndroidBack(() => router.replace("/(tabs)"));
  const router = useSafeRouter();
  const { readonly, error } = useLocalSearchParams<{
    readonly?: string;
    error?: string;
  }>();
  const isReadonly = readonly === "true";

  const [form, setForm] = useState({
    businessName: "",
    businessType: "",
    establishedYear: "",
    employees: "",
    email: "",
    phone: "",
    website: "",
    gst: "",
    pan: "",
    registration: "",
  });

  const [typeModalVisible, setTypeModalVisible] = useState(false);

  const updateForm = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleBack = () => {
    router.replace("/(tabs)");
  };

  const handleSubmit = () => {
    router.push("/(tabs)/upload?flow=business");
  };

  return (
    <RoleAccessGuard allowedRoles={["BSP", "BS"]}>
      <GradientBackground style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <BackArrowIcon size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Business Setup</Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Card style={styles.card} variant="default">
              <Text style={styles.pageTitle}>Business Details</Text>
              <Text style={styles.pageDesc}>
                Enter your company details for verification. This information
                will be linked to your branches and services.
              </Text>

              {error === "true" && (
                <View style={{ marginBottom: 16 }}>
                  <InfoAlert message="Your business details were rejected. Please review and update them." />
                </View>
              )}

              {/* Basic Information */}
              <SectionHeader
                icon={<BuildingIcon size={18} color="#4338CA" />}
                title="Basic Information"
              />

              <Input
                label="Business Name"
                placeholder="e.g. Acme Services"
                value={form.businessName}
                onChangeText={(t) => updateForm("businessName", t)}
                editable={!isReadonly}
              />

              <SelectInput
                label="Business Type"
                placeholder="Select"
                value={form.businessType}
                onPress={() => setTypeModalVisible(true)}
                disabled={isReadonly}
              />

              <View style={styles.row}>
                <View style={styles.flex1}>
                  <Input
                    label="Established Year"
                    placeholder="YYYY"
                    keyboardType="numeric"
                    value={form.establishedYear}
                    onChangeText={(t) => updateForm("establishedYear", t)}
                    editable={!isReadonly}
                  />
                </View>
                <View style={styles.flex1}>
                  <Input
                    label="No. of Employees"
                    placeholder="Enter"
                    keyboardType="numeric"
                    value={form.employees}
                    onChangeText={(t) => updateForm("employees", t)}
                    editable={!isReadonly}
                  />
                </View>
              </View>

              {/* Contact Information */}
              <SectionHeader
                icon={<PhoneIcon size={18} color="#4338CA" />}
                title="Contact Information"
              />

              <Input
                label="Business Email"
                placeholder="contact@company.com"
                keyboardType="email-address"
                value={form.email}
                onChangeText={(t) => updateForm("email", t)}
                editable={!isReadonly}
              />

              <PhoneInput
                label="Business Phone"
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                onChangeText={(t) => updateForm("phone", t)}
              />

              <Input
                label="Website URL"
                placeholder="https://www.company.com"
                keyboardType="url"
                value={form.website}
                onChangeText={(t) => updateForm("website", t)}
                editable={!isReadonly}
              />

              {/* Legal & Verification */}
              <SectionHeader
                icon={<ShieldCheckIcon size={18} color="#4338CA" />}
                title="Legal & Verification"
              />
              <Text style={styles.legalDesc}>
                These details will be securely stored for the approval process.
              </Text>

              <Input
                label="GST Number"
                placeholder="Enter GSTIN"
                value={form.gst}
                onChangeText={(t) => updateForm("gst", t)}
                editable={!isReadonly}
              />

              <Input
                label="PAN Number"
                placeholder="Enter PAN"
                value={form.pan}
                onChangeText={(t) => updateForm("pan", t)}
                editable={!isReadonly}
              />

              <Input
                label="Registration Number"
                placeholder="Enter CIN / Registration No."
                value={form.registration}
                onChangeText={(t) => updateForm("registration", t)}
                editable={!isReadonly}
              />

              {!isReadonly && (
                <Button
                  title="Submit for Verification"
                  onPress={handleSubmit}
                  variant="primary"
                  style={styles.submitBtn}
                />
              )}
            </Card>
          </ScrollView>
          <SelectOptionsModal
            visible={typeModalVisible}
            onClose={() => setTypeModalVisible(false)}
            title="Select Business Type"
            options={BUSINESS_TYPES}
            onSelect={(value) => updateForm("businessType", value)}
          />
        </SafeAreaView>
      </GradientBackground>
    </RoleAccessGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    padding: 24,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    marginTop: 8,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  pageDesc: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  sectionIconWrapper: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  legalDesc: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 16,
    marginTop: -8,
  },
  submitBtn: {
    marginTop: 16,
  },
});
