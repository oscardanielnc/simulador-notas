import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { isFailing } from '@/core/grading';
import { color, font, motion, numbers, shadow } from '@/theme/tokens';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const R = 38;
const C = 2 * Math.PI * R;

interface Props {
  /** Grade 0..20. */
  value: number;
  size: number;
  /** Text in the middle, e.g. the rounded grade. */
  label?: string;
}

/**
 * Ring on a white disc: the same colors on the dark and the light cards,
 * so red and purple always sit on white (design/tokens.md § Ring).
 */
export function ProgressRing({ value, size, label }: Props) {
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
  return (
    <View style={[styles.disc, { width: size, height: size, borderRadius: size / 2 }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Circle cx={50} cy={50} r={R} fill="none" stroke={color.tint} strokeWidth={9} />
        <AnimatedCircle
          cx={50}
          cy={50}
          r={R}
          fill="none"
          stroke={failing ? color.danger : color.accent}
          strokeWidth={9}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          animatedProps={animatedProps}
        />
      </Svg>
      {label !== undefined && (
        <Text
          style={[
            styles.label,
            { fontSize: size * 0.3, color: failing ? color.danger : color.text },
          ]}
        >
          {label}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  disc: {
    backgroundColor: color.bg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.chip,
  },
  label: { ...numbers, position: 'absolute', fontFamily: font.semibold },
});
