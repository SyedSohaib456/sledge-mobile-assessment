import { createTheme } from '@shopify/restyle';

const palette = {
  cyan400: '#53EAFD',
  cyan500: '#2DD4F0',
  cyan900: '#0D3D52',
  navy950: '#0F1923',
  teal700: '#185A78',
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F8FAFC',
  gray100: '#F1F5F9',
  gray200: '#E2E8F0',
  gray400: '#94A3B8',
  gray500: '#64748B',
  gray600: '#475569',
  green400: '#4ADE80',
  green500: '#22C55E',
  green900: '#14532D',
  red400: '#F87171',
  red500: '#EF4444',
  red900: '#7F1D1D',
  amber400: '#FBBF24',
  amber900: '#78350F',
  blue400: '#60A5FA',
  blue900: '#1E3A5F',
  transparent: 'transparent',
};

const theme = createTheme({
  colors: {
    // backgrounds
    mainBackground: palette.gray50,
    cardBackground: palette.white,
    cardBackgroundSunk: palette.gray100,
    cardBackgroundDark: palette.navy950,
    headerBackground: palette.navy950,
    inputBackground: palette.gray100,
    modalBackground: palette.white,
    overlay: 'rgba(0,0,0,0.5)',

    // text
    textPrimary: palette.navy950,
    textSecondary: palette.gray500,
    textInverse: palette.white,
    textMuted: palette.gray400,
    textAccent: palette.cyan400,

    // accent
    primary: palette.cyan400,
    primaryDark: palette.cyan500,

    // sync status colors
    statusPendingBg: palette.gray100,
    statusPendingText: palette.gray600,
    statusSyncingBg: palette.blue900,
    statusSyncingText: palette.blue400,
    statusSyncedBg: palette.green900,
    statusSyncedText: palette.green400,
    statusErrorBg: palette.red900,
    statusErrorText: palette.red400,

    // ui
    border: palette.gray200,
    danger: palette.red500,
    warning: palette.amber400,
    warningBg: palette.amber900,
    success: palette.green500,

    // transparent
    transparent: palette.transparent,
  },
  spacing: {
    xxs: 4,
    xs: 8,
    s: 12,
    m: 16,
    l: 20,
    xl: 24,
    xxl: 32,
    xxxl: 48,
    xxxxl: 64,
  },
  borderRadii: {
    xs: 4,
    s: 8,
    m: 12,
    l: 16,
    xl: 20,
    xxl: 28,
    full: 9999,
  },
  textVariants: {
    defaults: {
      fontFamily: 'Urbanist-Regular',
      color: 'textPrimary',
      fontSize: 14,
    },
    display: {
      fontFamily: 'Urbanist-ExtraBold',
      fontSize: 40,
      lineHeight: 48,
      color: 'textPrimary',
    },
    h1: {
      fontFamily: 'Urbanist-Bold',
      fontSize: 32,
      lineHeight: 40,
      color: 'textPrimary',
    },
    h2: {
      fontFamily: 'Urbanist-Bold',
      fontSize: 24,
      lineHeight: 32,
      color: 'textPrimary',
    },
    h3: {
      fontFamily: 'Urbanist-Bold',
      fontSize: 18,
      lineHeight: 26,
      color: 'textPrimary',
    },
    h4: {
      fontFamily: 'Urbanist-Bold',
      fontSize: 16,
      lineHeight: 22,
      color: 'textPrimary',
    },
    body: {
      fontFamily: 'Urbanist-Regular',
      fontSize: 14,
      lineHeight: 22,
      color: 'textPrimary',
    },
    bodyMedium: {
      fontFamily: 'Urbanist-Medium',
      fontSize: 14,
      lineHeight: 22,
      color: 'textPrimary',
    },
    caption: {
      fontFamily: 'Urbanist-Regular',
      fontSize: 12,
      lineHeight: 16,
      color: 'textSecondary',
    },
    label: {
      fontFamily: 'Urbanist-Medium',
      fontSize: 12,
      lineHeight: 16,
      color: 'textSecondary',
      letterSpacing: 0.5,
    },
    button: {
      fontFamily: 'Urbanist-Bold',
      fontSize: 15,
      lineHeight: 20,
      color: 'textPrimary',
    },
  },
  cardVariants: {
    defaults: {
      backgroundColor: 'cardBackground',
      borderRadius: 'l',
      padding: 'm',
    },
    sunk: {
      backgroundColor: 'cardBackgroundSunk',
      borderRadius: 'l',
      padding: 'm',
    },
    dark: {
      backgroundColor: 'cardBackgroundDark',
      borderRadius: 'l',
      padding: 'm',
    },
  },
});

export type Theme = typeof theme;
export default theme;
