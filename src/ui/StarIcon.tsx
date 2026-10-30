import { StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { es } from '@/i18n/es';
import { color as palette } from '@/theme/tokens';

interface Props {
  size?: number;
  color?: string;
  /** Pinned to the top-right corner of its card or chip. */
  corner?: boolean;
  label?: string;
}

/** Solid star for real grades. Never sparkles: users read those as "AI" (F04). */
export function StarIcon({
  size = 14,
  color = palette.accent,
  corner,
  label = es.a11y.real,
}: Props) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={corner ? styles.corner : undefined}
      accessibilityLabel={label}
      accessibilityRole="image"
      testID={corner ? 'corner-star' : 'star'}
    >
      <Path
        fill={color}
        d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  corner: { position: 'absolute', top: -7, right: -5, zIndex: 1 },
});
