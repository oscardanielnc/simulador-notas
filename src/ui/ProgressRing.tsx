import { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

import { isFailing } from '@/core/grading';
import { color, motion, ring } from '@/theme/tokens';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const R = 40;
const C = 2 * Math.PI * R;

interface Props {
  /** Grade 0..20. */
  value: number;
  size: number;
  /** `dark` for the filled purple cards, `light` for the lavender ones. */
  tone: 'dark' | 'light';
}

/** One ring that fills up; red below 10.5 (design/tokens.md § Ring). */
export function ProgressRing({ value, size, tone }: Props) {
  const progress = useSharedValue(value / 20);
  useEffect(() => {
    progress.set(
      withTiming(value / 20, {
        duration: motion.bar,
        easing: Easing.out(Easing.quad),
      }),
    );
  }, [value, progress]);
  const animatedProps = useAnimatedProps(() => ({
    strokeDasharray: [C * progress.get(), C],
  }));
  const failing = isFailing(value);
  const dark = tone === 'dark';
  const stroke = failing ? color.danger : dark ? 'url(#ring)' : color.secondary;
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={ring.from} />
          <Stop offset="1" stopColor={ring.to} />
        </LinearGradient>
      </Defs>
      <Circle
        cx={50}
        cy={50}
        r={R}
        fill="none"
        stroke={dark ? ring.track : color.track}
        strokeWidth={dark ? 11 : 12}
      />
      <AnimatedCircle
        cx={50}
        cy={50}
        r={R}
        fill="none"
        stroke={stroke}
        strokeOpacity={value > 0 ? 1 : 0}
        strokeWidth={dark ? 11 : 12}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
        animatedProps={animatedProps}
      />
    </Svg>
  );
}
