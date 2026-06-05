import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

interface DatePickerModalProps {
  visible: boolean;
  value: Date;
  onChange: (event: DateTimePickerEvent, date?: Date) => void;
  onClose: () => void;
  maximumDate?: Date;
  minimumDate?: Date;
}

export function DatePickerModal({
  visible,
  value,
  onChange,
  onClose,
  maximumDate,
  minimumDate,
}: DatePickerModalProps) {
  if (!visible) return null;

  if (Platform.OS === 'web') {
    return (
      <Modal visible={visible} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
          <TouchableOpacity activeOpacity={1} style={styles.webPickerContainer}>
            <View style={styles.header}>
              <Text style={styles.webTitle}>Select Date</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.doneText}>Done</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.webInputWrapper}>
              <input
                type="date"
                value={value ? value.toISOString().split('T')[0] : ''}
                max={maximumDate ? maximumDate.toISOString().split('T')[0] : undefined}
                min={minimumDate ? minimumDate.toISOString().split('T')[0] : undefined}
                onChange={(e) => {
                  if (e.target.value) {
                    const newDate = new Date(e.target.value);
                    onChange({ type: 'set' } as any, newDate);
                  }
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
              />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
  }

  if (Platform.OS === 'android') {
    return (
      <DateTimePicker
        value={value}
        mode="date"
        display="default"
        onChange={(event, date) => {
          onChange(event, date);
          // Android closes the picker automatically
          if (event.type === 'set' || event.type === 'dismissed') {
            onClose();
          }
        }}
        maximumDate={maximumDate}
        minimumDate={minimumDate}
      />
    );
  }

  // iOS layout (bottom sheet with Done button)
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={styles.pickerContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
          <DateTimePicker
            value={value}
            mode="date"
            display="spinner"
            onChange={onChange}
            maximumDate={maximumDate}
            minimumDate={minimumDate}
            style={styles.picker}
            textColor="#000000"
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: Platform.OS === 'web' ? 'center' : 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
  },
  webPickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '90%',
    maxWidth: 400,
    alignSelf: 'center',
    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.15)',
    elevation: 10,
    overflow: 'hidden',
  },
  webTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  webInputWrapper: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: Platform.OS === 'web' ? 'space-between' : 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  doneText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
  picker: {
    height: 200,
    width: '100%',
  },
});
