import { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { motion } from '@/theme/tokens';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const R = 40;
const C = 2 * Math.PI * R;

interface Props {
  /** Grade 0..20. */
  value: number;
  size: number;
  color: string;
  track: string;
}

export function ProgressRing({ value, size, color, track }: Props) {
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
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx={50} cy={50} r={R} fill="none" stroke={track} strokeWidth={12} />
      <AnimatedCircle
        cx={50}
        cy={50}
        r={R}
        fill="none"
        stroke={color}
        strokeWidth={12}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
        animatedProps={animatedProps}
      />
    </Svg>
  );
}
