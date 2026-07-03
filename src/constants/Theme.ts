/**
 * SiloGuard — Design System tokens (React Native)
 * Traducido 1:1 desde el Design System de Claude Design (_ds_manifest.json).
 * Dark-first: canvas casi negro, superficies grises en capas, bordes hairline.
 * El verde es marca + "saludable"; ámbar/rojo/azul cargan el estado del grano.
 */

export const DarkColors = {
  // Legacy aliases (compat con pantallas existentes — no romper)
  primary: '#22C55E',
  primaryDark: '#16A34A',
  accent: '#F59E0B',
  success: '#16A34A',
  warning: '#EAB308',

  // Brand + status (raw)
  green: '#22C55E',
  green600: '#16A34A',
  greenTint: 'rgba(34, 197, 94, 0.12)',
  greenLine: 'rgba(34, 197, 94, 0.30)',
  amber: '#F59E0B',
  amberTint: 'rgba(245, 158, 11, 0.12)',
  danger: '#EF4444',
  dangerTint: 'rgba(239, 68, 68, 0.12)',
  info: '#3B82F6',
  infoTint: 'rgba(59, 130, 246, 0.12)',

  // Surfaces
  bg: '#0A0A0A',
  surface: '#111111',
  surface2: '#1A1A1A',
  surface3: '#262626',
  specBg: '#0F0F0F',
  border: '#2A2A2A',
  borderStrong: '#3A3A3A',

  // Text
  text: '#F5F5F5',
  textMuted: '#6B7280',
  textOnGreen: '#0A0A0A',

  // Semantic aliases (lo que usás en los componentes)
  surfaceApp: '#0A0A0A',
  surfaceCard: '#111111',
  surfaceInput: '#1A1A1A',
  surfaceHover: '#262626',
  borderDefault: '#2A2A2A',
  textPrimary: '#F5F5F5',
  textSecondary: '#6B7280',
  textLink: '#22C55E',
  textInverse: '#0A0A0A',
  actionPrimary: '#22C55E',
  actionPrimaryHover: '#16A34A',
  actionPrimaryText: '#0A0A0A',

  // Status semantic
  statusOk: '#22C55E',
  statusOkTint: 'rgba(34, 197, 94, 0.12)',
  statusWarn: '#F59E0B',
  statusWarnTint: 'rgba(245, 158, 11, 0.12)',
  statusCritical: '#EF4444',
  statusCriticalTint: 'rgba(239, 68, 68, 0.12)',
  statusInfo: '#3B82F6',
  statusInfoTint: 'rgba(59, 130, 246, 0.12)',
} as const;

/**
 * Paleta clara. Mantiene exactamente las mismas claves que DarkColors
 * (marca y estados iguales); solo cambian superficies, textos y bordes.
 */
export const LightColors = {
  ...DarkColors,
  bg: '#F7F7F8',
  surface: '#FFFFFF',
  surface2: '#F0F0F2',
  surface3: '#E6E6EA',
  specBg: '#FFFFFF',
  border: '#E2E2E6',
  borderStrong: '#CBCBD2',
  text: '#0A0A0A',
  textMuted: '#6B7280',
  surfaceApp: '#F7F7F8',
  surfaceCard: '#FFFFFF',
  surfaceInput: '#F0F0F2',
  surfaceHover: '#E6E6EA',
  borderDefault: '#E2E2E6',
  textPrimary: '#0A0A0A',
  textSecondary: '#6B7280',
} as const;

export type ThemeColors = { [K in keyof typeof DarkColors]: string };

// Compat: las pantallas que aún no usan el tema dinámico siguen en oscuro.
export const Colors = DarkColors;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
  screenGutter: 24,
  xxl: 48, // legacy alias
} as const;

// Legacy escala tipográfica (compat con pantallas existentes — no romper).
// Las pantallas nuevas/DS deben usar `Type`.
export const FontSize = {
  headingXl: 24,
  headingLg: 20,
  headingMd: 18,
  bodyLg: 16,
  bodyMd: 14,
  bodySm: 12,
  label: 11,
  badge: 9,
} as const;

export const Radius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 999,
} as const;

export const FontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

/**
 * Escala tipográfica. En RN no hay letterSpacing por token global,
 * así que cada estilo lleva fontSize / lineHeight / letterSpacing listo para usar.
 */
export const Type = {
  display: { fontSize: 48, lineHeight: 58, letterSpacing: -1.5, fontWeight: FontWeight.bold },
  h1: { fontSize: 32, lineHeight: 40, letterSpacing: -0.5, fontWeight: FontWeight.bold },
  h2: { fontSize: 24, lineHeight: 30, letterSpacing: -0.3, fontWeight: FontWeight.semibold },
  h3: { fontSize: 18, lineHeight: 26, letterSpacing: 0, fontWeight: FontWeight.semibold },
  body: { fontSize: 14, lineHeight: 22, letterSpacing: 0, fontWeight: FontWeight.regular },
  caption: { fontSize: 12, lineHeight: 16, letterSpacing: 0.8, fontWeight: FontWeight.regular },
  label: { fontSize: 12, lineHeight: 16, letterSpacing: 0.3, fontWeight: FontWeight.bold },
  overline: { fontSize: 11, lineHeight: 14, letterSpacing: 1.5, fontWeight: FontWeight.bold },
} as const;

/**
 * Sombras. RN usa shadowColor/shadowOffset/shadowOpacity/shadowRadius (iOS)
 * y elevation (Android). El glow verde es el acento de la marca.
 */
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
  },
  glowGreen: {
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

// Familia tipográfica. Si cargás Inter con expo-font, usá 'Inter'.
// Mientras no esté cargada, RN cae al system font (que en iOS es muy parecido).
export const FontFamily = {
  sans: 'Inter',
} as const;

export const Theme = {
  Colors,
  Spacing,
  Radius,
  Type,
  Shadows,
  FontWeight,
  FontFamily,
} as const;

export default Theme;
