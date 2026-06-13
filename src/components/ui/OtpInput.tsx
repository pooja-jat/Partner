import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet, Pressable, Text } from 'react-native';
import { COLORS } from '../../constants';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

export function OtpInput({ value, onChange, length = 6 }: OtpInputProps) {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handlePress = () => {
    inputRef.current?.focus();
  };

  const renderCells = () => {
    const cells = [];
    for (let i = 0; i < length; i++) {
      const char = value[i] || '';
      const isCurrentActive = isFocused && value.length === i;
      // If we're at the end and focused, make the last box active
      const isLastActive = isFocused && i === length - 1 && value.length === length;
      const active = isCurrentActive || isLastActive;
      const isFilled = char !== '';
      
      const isBox = active || isFilled;

      cells.push(
        <View 
          key={i} 
          style={[
            styles.cell,
            isBox ? styles.cellBox : styles.cellLine,
            active && styles.cellActive
          ]}
        >
          <Text style={styles.cellText}>{char}</Text>
        </View>
      );
    }
    return cells;
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handlePress} style={styles.cellsContainer}>
        {renderCells()}
      </Pressable>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(text) => {
          const cleaned = text.replace(/[^0-9a-zA-Z]/g, '').slice(0, length);
          onChange(cleaned);
        }}
        keyboardType="default"
        textContentType="oneTimeCode"
        maxLength={length}
        style={styles.hiddenInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoFocus
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    width: '100%',
  },
  cellsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cell: {
    width: 45,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellBox: {
    borderWidth: 1,
    borderColor: '#0F172A',
    borderRadius: 8,
  },
  cellLine: {
    borderBottomWidth: 1.5,
    borderColor: '#94A3B8',
  },
  cellActive: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    borderRadius: 8,
    borderBottomWidth: 2,
  },
  cellText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#0F172A',
  },
  hiddenInput: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.01,
    color: 'transparent',
    backgroundColor: 'transparent',
  },
});
