import type { TextStyle, ViewStyle } from 'react-native';

/** docs/design/tokens.md */
export const color = {
  bg: '#FFFFFF',
  surface: '#F6F5FE',
  surfaceChip: '#FFFFFF',
  tint: '#EEEDFE',
  track: '#E4E2FA',
  muted: '#AFA9EC',
  secondary: '#7F77DD',
  accent: '#534AB7',
  strong: '#3C3489',
  text: '#26215C',
  danger: '#E24B4A',
  onDark: '#FFFFFF',
  starOnDark: '#CECBF6',
} as const;

export const font = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
} as const;

export const size = {
  final: 38,
  criterion: 24,
  editor: 36,
  chip: 17,
  title: 16,
  label: 12,
  small: 11,
} as const;

export const radius = { sheet: 28, card: 20, chip: 14, pill: 999 } as const;

export const space = { gap: 12, chipGap: 6, cardPad: 14, screen: 16 } as const;

export const SELECTION_BORDER = 2.5;

export const motion = { bar: 150, selection: 120 } as const;

export const shadow = {
  card: {
    shadowColor: color.accent,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  chip: {
    shadowColor: color.accent,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
} satisfies Record<string, ViewStyle>;

export const numbers: TextStyle = { fontVariant: ['tabular-nums'] };

/** Every selectable element reserves the border so selecting never shifts layout. */
export const selectable = (selected: boolean): ViewStyle => ({
  borderWidth: SELECTION_BORDER,
  borderColor: selected ? color.secondary : 'transparent',
});

export const gradeColor = (failing: boolean, base: string = color.text) =>
  failing ? color.danger : base;
