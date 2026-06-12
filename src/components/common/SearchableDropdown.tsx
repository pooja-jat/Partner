import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView,
} from 'react-native';
import { COLORS } from '@/constants';

interface SearchableDropdownProps {
  label?: string;
  placeholder?: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  disabled?: boolean;
}

export function SearchableDropdown({
  label,
  placeholder = 'Type to search...',
  value,
  options,
  onChange,
  disabled = false,
}: SearchableDropdownProps) {
  const [query, setQuery] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // sync display when value is reset from outside (e.g. parent clears child)
  useEffect(() => {
    setQuery(value);
  }, [value]);

  const suggestions = query.trim().length > 0
    ? options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleChangeText = (text: string) => {
    setQuery(text);
    onChange(text);
    setShowSuggestions(true);
  };

  const handleSelect = (item: string) => {
    setQuery(item);
    onChange(item);
    setShowSuggestions(false);
  };

  const handleBlur = () => {
    // small delay so tap on suggestion registers first
    setTimeout(() => setShowSuggestions(false), 150);
  };

  const handleFocus = () => {
    if (query.trim().length > 0) setShowSuggestions(true);
  };

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TextInput
        style={[styles.input, disabled && styles.inputDisabled]}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        value={query}
        onChangeText={handleChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        editable={!disabled}
        autoCapitalize="words"
        autoCorrect={false}
      />

      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.dropdown}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
            style={{ maxHeight: 180 }}
          >
            {suggestions.map((item) => (
              <TouchableOpacity
                key={item}
                activeOpacity={0.7}
                style={styles.item}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.itemText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginBottom: 12,
    zIndex: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  inputDisabled: {
    backgroundColor: '#F8FAFC',
    color: '#94A3B8',
  },
  dropdown: {
    position: 'absolute',
    top: 74,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    zIndex: 999,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  itemText: {
    fontSize: 14,
    color: '#334155',
  },
});
