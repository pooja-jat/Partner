import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { IdCardIcon } from './Icons';

interface ImageUploadCardProps {
  label: string;
  subLabel?: string;
  onPress: () => void;
  style?: any;
}

export function ImageUploadCard({ label, subLabel, onPress, style }: ImageUploadCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        <IdCardIcon size={20} color="#475569" />
      </View>
      <Text style={styles.label}>{label}</Text>
      {subLabel ? <Text style={styles.subLabel}>{subLabel}</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0', // slate 200
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC', // slate 50
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E2E8F0', // slate 200
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A', // slate 900
    marginBottom: 4,
  },
  subLabel: {
    fontSize: 12,
    color: '#64748B', // slate 500
  },
});
