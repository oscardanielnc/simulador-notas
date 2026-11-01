import { StyleSheet, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { isFailing } from '@/core/grading';
import { color, font, numbers } from '@/theme/tokens';
import { StarIcon } from '@/ui/StarIcon';

import { MAX_GRADE } from './ruler-logic';

/** Distance between two integers (ADR 0005: at least 32 dp). */
export const STEP = 48;
const HEIGHT = 100;
const TICK_BOX = 34;

/**
 * One floating number + line. The number at the center grows into the big current grade,
 * so the picker is the only place the value is shown (F03).
 */
export function Tick({ i, pos, star }: { i: number; pos: SharedValue<number>; star: boolean }) {
  const near = useAnimatedStyle(() => {
    const d = Math.abs(i - pos.get());
    return {
      opacity: interpolate(d, [0, 1, 4], [1, 0.55, 0.15], 'clamp'),
      transform: [{ scale: interpolate(d, [0, 1, 3], [2.1, 1, 0.85], 'clamp') }],
    };
  });
  return (
    <View style={[styles.tick, { left: i * STEP }]}>
      <View style={styles.starSlot}>{star && <StarIcon size={14} />}</View>
      <Animated.Text
        style={[styles.number, isFailing(i) && styles.failing, star && styles.realNumber, near]}
      >
        {i}
      </Animated.Text>
      <View style={[styles.line, i % 5 === 0 && styles.longLine]} />
    </View>
  );
}

export const styles = StyleSheet.create({
  ruler: { height: HEIGHT, overflow: 'hidden' },
  strip: { position: 'absolute', top: 0, bottom: 0, left: 0, width: (MAX_GRADE + 1) * STEP },
  tick: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: TICK_BOX,
    marginLeft: -TICK_BOX / 2,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
  starSlot: { height: 16, justifyContent: 'center', marginBottom: 14 },
  number: {
    ...numbers,
    fontFamily: font.semibold,
    fontSize: 17,
    lineHeight: 22,
    color: color.text,
    marginBottom: 16,
  },
  failing: { color: color.danger },
  realNumber: { color: color.accent },
  line: { width: 1.5, height: 10, borderRadius: 1, backgroundColor: color.muted },
  longLine: { height: 18 },
  indicator: {
    position: 'absolute',
    left: '50%',
    bottom: 0,
    width: 3,
    height: 22,
    marginLeft: -1.5,
    borderRadius: 2,
    backgroundColor: color.accent,
  },
});
