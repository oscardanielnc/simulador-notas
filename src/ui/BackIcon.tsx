import Svg, { Path } from 'react-native-svg';

import { color } from '@/theme/tokens';

/** Vector arrow: a text glyph sits off-center because of font metrics. */
export function BackIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 5l-7 7 7 7"
        stroke={color.strong}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
