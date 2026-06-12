import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { Switch } from '@/components/ui/Switch';
import { Employee } from '@/types';
import { parsePhoneNumber, validatePhone } from '@/utils/validation';

interface EmployeeFormProps {
  mode: 'create' | 'update';
  initialData?: Employee;
  onSubmit: (data: any) => void;
  visible?: boolean;
}

export function EmployeeForm({ mode, initialData, onSubmit, visible }: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    branchName: initialData?.branchName || '',
    role: initialData?.role || '',
    mainService: initialData?.mainService || '',
    subService: initialData?.subService || '',
    experience: initialData?.experience || '',
    mobileNumber: initialData?.mobileNumber || '',
    isActive: initialData?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData({
      name: initialData?.name || '',
      branchName: initialData?.branchName || '',
      role: initialData?.role || '',
      mainService: initialData?.mainService || '',
      subService: initialData?.subService || '',
      experience: initialData?.experience || '',
      mobileNumber: initialData?.mobileNumber || '',
      isActive: initialData?.isActive ?? true,
    });
    setErrors({});
  }, [visible, initialData]);

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Required';
    if (!formData.branchName) newErrors.branchName = 'Required';
    if (!formData.role) newErrors.role = 'Required';
    if (!formData.mainService) newErrors.mainService = 'Required';
    if (!formData.mobileNumber) {
      newErrors.mobileNumber = 'Required';
    } else {
      const { localNumber } = parsePhoneNumber(formData.mobileNumber);
      if (localNumber.length !== 10) {
        newErrors.mobileNumber = 'Must be 10 digits';
      } else if (!validatePhone(formData.mobileNumber)) {
        newErrors.mobileNumber = 'Invalid mobile number';
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {mode === "create" ? "New Staff Member" : "Update Staff Member"}
      </Text>
      <Text style={styles.subtitle}>
        Enter details to add a new employee to your branch.
      </Text>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <Input
          label="Employee Name"
          value={formData.name}
          onChangeText={(text) => {
            setFormData({ ...formData, name: text });
            setErrors({ ...errors, name: "" });
          }}
          placeholder="Enter Name"
          error={errors.name}
        />

        <Input
          label="Branch Name"
          value={formData.branchName}
          onChangeText={(text) => {
            setFormData({ ...formData, branchName: text });
            setErrors({ ...errors, branchName: "" });
          }}
          placeholder="Enter Branch Name"
          required
          error={errors.branchName}
        />

        <Input
          label="Role Designation"
          value={formData.role}
          onChangeText={(text) => {
            setFormData({ ...formData, role: text });
            setErrors({ ...errors, role: "" });
          }}
          placeholder="Enter Service Provider"
          required
          error={errors.role}
        />

        <Input
          label="Partner Service"
          value={formData.mainService}
          onChangeText={(text) => {
            setFormData({ ...formData, mainService: text, subService: "" });
            setErrors({ ...errors, mainService: "" });
          }}
          placeholder="Enter Partner Service"
          required
          error={errors.mainService}
        />

        <Input
          label="Sub Services"
          value={formData.subService}
          onChangeText={(text) =>
            setFormData({ ...formData, subService: text })
          }
          placeholder="Enter Sub Services"
        />

        <Input
          label="Professional Experience"
          value={formData.experience}
          onChangeText={(text) =>
            setFormData({ ...formData, experience: text })
          }
          placeholder="Enter Experience in years"
        />

        <PhoneInput
          label="Mobile Number"
          value={formData.mobileNumber}
          onChangeText={(text) => {
            setFormData({ ...formData, mobileNumber: text });
            setErrors({ ...errors, mobileNumber: "" });
          }}
          placeholder="Mobile number"
          required
          error={errors.mobileNumber}
        />

        {mode === "update" && (
          <View style={styles.statusContainer}>
            <View>
              <Text style={styles.statusLabel}>Employee Status</Text>
              <Text style={styles.statusDesc}>Toggle to active / inactive</Text>
            </View>
            <Switch
              value={formData.isActive}
              onValueChange={(val) =>
                setFormData({ ...formData, isActive: val })
              }
            />
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={mode === "create" ? "Save New Employee" : "Update Employee"}
          onPress={handleSubmit}
          variant="primary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  statusDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  footer: {
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 8 : 0,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
});
