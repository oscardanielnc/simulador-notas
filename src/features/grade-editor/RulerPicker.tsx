import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { es } from '@/i18n/es';
import { isFailing } from '@/core/grading';
import { color, font, numbers } from '@/theme/tokens';
import { StarIcon } from '@/ui/StarIcon';

/** Distance between two integers (ADR 0005: at least 32 dp). */
export const STEP = 48;
const MAX = 20;
const HEIGHT = 100;
const TICKS = Array.from({ length: MAX + 1 }, (_, i) => i);
const clamp = (v: number) => {
  'worklet';
  return Math.min(MAX, Math.max(0, v));
};

interface Props {
  value: number;
  onChange: (v: number) => void;
  /** Number that gets the real-grade star, or null. */
  star: number | null;
}

/**
 * One floating number + line. The number at the center grows into the big current grade,
 * so the picker is the only place the value is shown (F03).
 */
function Tick({ i, pos, star }: { i: number; pos: SharedValue<number>; star: boolean }) {
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

/**
 * Floating numbers that slide under a fixed center line.
 * The finger and the fling run on the UI thread; JS hears only whole integers.
 */
export function RulerPicker({ value, onChange, star }: Props) {
  const [width, setWidth] = useState(0);
  const pos = useSharedValue(value);
  const start = useSharedValue(value);
  const touching = useSharedValue(false);

  useEffect(() => {
    if (touching.get()) return;
    pos.set(withTiming(value, { duration: 180, easing: Easing.out(Easing.cubic) }));
  }, [value, pos, touching]);

  const emit = (v: number) => {
    void Haptics.selectionAsync();
    onChange(v);
  };

  useAnimatedReaction(
    () => Math.round(pos.get()),
    (now, before) => {
      if (touching.get() && before !== null && now !== before) scheduleOnRN(emit, now);
    },
  );

  const pan = Gesture.Pan()
    .onBegin(() => {
      touching.set(true);
      start.set(pos.get());
    })
    .onUpdate((e) => {
      pos.set(clamp(start.get() - e.translationX / STEP));
    })
    .onEnd((e) => {
      // Fling: carry the velocity a little further, then land on a whole number.
      const target = Math.round(clamp(pos.get() - (e.velocityX / STEP) * 0.18));
      const distance = Math.abs(target - pos.get());
      pos.set(
        withTiming(
          target,
          { duration: 160 + Math.min(distance, 6) * 50, easing: Easing.out(Easing.cubic) },
          () => touching.set(false),
        ),
      );
    })
    .onFinalize((_, success) => {
      if (!success) touching.set(false);
    });

  const strip = useAnimatedStyle(() => ({
    transform: [{ translateX: width / 2 - pos.get() * STEP }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <View
        style={styles.ruler}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={es.editor.ruler}
        accessibilityValue={{ min: 0, max: MAX, now: value }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(e) =>
          onChange(clamp(value + (e.nativeEvent.actionName === 'increment' ? 1 : -1)))
        }
      >
        <Animated.View style={[styles.strip, strip]}>
          {TICKS.map((i) => (
            <Tick key={i} i={i} pos={pos} star={i === star} />
          ))}
        </Animated.View>
        <View pointerEvents="none" style={styles.indicator} />
      </View>
    </GestureDetector>
  );
}

const TICK_BOX = 34;

const styles = StyleSheet.create({
  ruler: { height: HEIGHT, overflow: 'hidden' },
  strip: { position: 'absolute', top: 0, bottom: 0, left: 0, width: (MAX + 1) * STEP },
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
