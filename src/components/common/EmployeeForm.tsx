import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { SelectInput } from '@/components/ui/SelectInput';
import { Switch } from '@/components/ui/Switch';
import { Employee } from '@/types';
import { useBranchStore } from '@/store/branchStore';
import { parsePhoneNumber, validatePhone } from '@/utils/validation';
import { useServicesStore } from '@/store/servicesStore';
import { SelectOptionsModal } from './SelectOptionsModal';

const ROLES = [
  { label: 'Branch Manager', value: 'Branch Manager' },
  { label: 'Service Provider', value: 'Service Provider' },
  { label: 'Staff', value: 'Staff' }
];

const EXPERIENCES = [
  { label: '0-1 Years', value: '0-1 Years' },
  { label: '1-3 Years', value: '1-3 Years' },
  { label: '3-5 Years', value: '3-5 Years' },
  { label: '5+ Years', value: '5+ Years' }
];

interface EmployeeFormProps {
  mode: 'create' | 'update';
  initialData?: Employee;
  onSubmit: (data: any) => void;
}

export function EmployeeForm({ mode, initialData, onSubmit }: EmployeeFormProps) {
  const { branches } = useBranchStore();
  const { services } = useServicesStore();

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
  const [modalType, setModalType] = useState<string | null>(null);

  const branchOptions = branches.length > 0 
    ? branches.map(b => ({ label: b.name, value: b.name }))
    : [
        { label: 'Downtown Hub (Dummy)', value: 'Downtown Hub (Dummy)' },
        { label: 'Westside Office (Dummy)', value: 'Westside Office (Dummy)' }
      ];
  const mainServiceOptions = services.length > 0
    ? services.map(s => ({ label: s.name, value: s.name }))
    : [
        { label: 'Plumbing', value: 'Plumbing' },
        { label: 'Electrical', value: 'Electrical' },
        { label: 'HVAC', value: 'HVAC' }
      ];
  
  const selectedService = services.find(s => s.name === formData.mainService);
  const subServiceOptions = selectedService && selectedService.subServices.length > 0
    ? selectedService.subServices.map(sub => ({ label: sub.name, value: sub.name }))
    : [
        { label: 'Pipe Leak Repair', value: 'Pipe Leak Repair' },
        { label: 'Drain Cleaning', value: 'Drain Cleaning' },
        { label: 'Water Heater Installation', value: 'Water Heater Installation' },
        { label: 'Wiring', value: 'Wiring' },
        { label: 'AC Repair', value: 'AC Repair' }
      ];

  const handleSelect = (value: string) => {
    if (modalType === 'branch') setFormData({ ...formData, branchName: value });
    if (modalType === 'role') setFormData({ ...formData, role: value });
    if (modalType === 'mainService') {
      setFormData({ ...formData, mainService: value, subService: '' });
    }
    if (modalType === 'subService') setFormData({ ...formData, subService: value });
    if (modalType === 'experience') setFormData({ ...formData, experience: value });
    
    setErrors({ ...errors, [modalType || '']: '' });
    setModalType(null);
  };

  const getOptions = () => {
    switch (modalType) {
      case 'branch': return branchOptions;
      case 'role': return ROLES;
      case 'mainService': return mainServiceOptions;
      case 'subService': return subServiceOptions;
      case 'experience': return EXPERIENCES;
      default: return [];
    }
  };

  const getModalTitle = () => {
    switch (modalType) {
      case 'branch': return 'Select Branch';
      case 'role': return 'Select Role';
      case 'mainService': return 'Select Main Service';
      case 'subService': return 'Select Sub Service';
      case 'experience': return 'Select Experience';
      default: return '';
    }
  };

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
        {mode === 'create' ? 'New Staff Member' : 'Update Staff Member'}
      </Text>
      <Text style={styles.subtitle}>
        Enter details to add a new employee to your branch.
      </Text>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContent}>
        
        <Input
          label="Employee Name"
          value={formData.name}
          onChangeText={(text) => {
            setFormData({ ...formData, name: text });
            setErrors({ ...errors, name: '' });
          }}
          placeholder="e.g. John Doe"
          error={errors.name}
        />

        <SelectInput
          label="Branch Name"
          value={formData.branchName}
          placeholder="Select"
          onPress={() => setModalType('branch')}
          required
        />
        {errors.branchName ? <Text style={styles.errorText}>{errors.branchName}</Text> : null}

        <SelectInput
          label="Role Designation"
          value={formData.role}
          placeholder="Select"
          onPress={() => setModalType('role')}
          required
        />
        {errors.role ? <Text style={styles.errorText}>{errors.role}</Text> : null}

        <SelectInput
          label="Partner Service"
          value={formData.mainService}
          placeholder="Select"
          onPress={() => setModalType('mainService')}
          required
        />
        {errors.mainService ? <Text style={styles.errorText}>{errors.mainService}</Text> : null}

        <SelectInput
          label="Sub Services"
          value={formData.subService}
          placeholder="Select"
          onPress={() => setModalType('subService')}
        />

        <SelectInput
          label="Professional Experience"
          value={formData.experience}
          placeholder="Select"
          onPress={() => setModalType('experience')}
        />

        <PhoneInput
          label="Mobile Number"
          value={formData.mobileNumber}
          onChangeText={(text) => {
            setFormData({ ...formData, mobileNumber: text });
            setErrors({ ...errors, mobileNumber: '' });
          }}
          placeholder="Mobile number"
          required
          error={errors.mobileNumber}
        />

        {mode === 'update' && (
          <View style={styles.statusContainer}>
            <View>
              <Text style={styles.statusLabel}>Employee Status</Text>
              <Text style={styles.statusDesc}>Toggle to active / inactive</Text>
            </View>
            <Switch 
              value={formData.isActive}
              onValueChange={(val) => setFormData({ ...formData, isActive: val })}
            />
          </View>
        )}

      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={mode === 'create' ? "Save New Employee" : "Update Employee"}
          onPress={handleSubmit}
          variant="primary"
        />
      </View>

      <SelectOptionsModal
        visible={!!modalType}
        onClose={() => setModalType(null)}
        title={getModalTitle()}
        options={getOptions()}
        onSelect={handleSelect}
      />
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
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: -16,
    marginBottom: 16,
  }
});
