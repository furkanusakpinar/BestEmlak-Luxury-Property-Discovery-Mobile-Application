import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { DARK_COLORS, SPACING, SIZES } from '../constants/Theme';

export default function CategoryItem({ title, active, onPress, colors = DARK_COLORS }) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[
        styles.container, 
        { backgroundColor: colors.surface, borderColor: colors.glass },
        active && { backgroundColor: colors.primary, borderColor: colors.primary }
      ]}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.text,
        { color: colors.textSecondary },
        active && { color: colors.white }
      ]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: SIZES.radius_xl,
    backgroundColor: DARK_COLORS.surface,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: DARK_COLORS.glass,
  },
  containerActive: {
    backgroundColor: DARK_COLORS.primary,
    borderColor: DARK_COLORS.primary,
  },
  text: {
    color: DARK_COLORS.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  textActive: {
    color: DARK_COLORS.white,
  },
});
