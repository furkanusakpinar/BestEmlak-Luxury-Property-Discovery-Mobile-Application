export const DARK_COLORS = {
  primary: '#C5A059',
  secondary: '#1A1A1A',
  background: '#121212',
  surface: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  accent: '#D4AF37',
  error: '#FF5252',
  success: '#4CAF50',
  white: '#FFFFFF',
  black: '#000000',
  glass: 'rgba(255, 255, 255, 0.1)',
};

export const LIGHT_COLORS = {
  primary: '#C5A059',
  secondary: '#F5F5F5',
  background: '#FFFFFF',
  surface: '#F8F9FA',
  text: '#121212',
  textSecondary: '#666666',
  accent: '#D4AF37',
  error: '#FF5252',
  success: '#4CAF50',
  white: '#FFFFFF',
  black: '#000000',
  glass: 'rgba(0, 0, 0, 0.05)',
};

// Default exports for backward compatibility if needed, but we'll use context
export const COLORS = DARK_COLORS;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const SIZES = {
  radius_sm: 8,
  radius_md: 12,
  radius_lg: 20,
  radius_xl: 30,
};

export const SHADOWS = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dark: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
};
