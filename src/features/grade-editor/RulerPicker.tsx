import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { es } from '@/i18n/es';

import { clampGrade, createCommitGate, flingTarget, MAX_GRADE, tapTarget } from './ruler-logic';
import { STEP, styles, Tick } from './RulerTick';

export { STEP };

const TICKS = Array.from({ length: MAX_GRADE + 1 }, (_, i) => i);

interface Props {
  value: number;
  onChange: (v: number) => void;
  /** Number that gets the real-grade star, or null. */
  star: number | null;
}

/**
 * Floating numbers that slide under a fixed center line. Drag, fling or tap a number.
 * The strip runs on the UI thread. Every touch ends with one explicit commit of the
 * whole number it lands on, so the card can never keep a number the ruler is not showing.
 */
export function RulerPicker({ value, onChange, star }: Props) {
  const [gate] = useState(() => createCommitGate(value));
  const [width, setWidth] = useState(0);
  const pos = useSharedValue(value);
  const start = useSharedValue(value);
  const gen = useSharedValue(0);
  const settledGen = useSharedValue(0);
  const dragging = useSharedValue(false);
  const landing = useSharedValue(false);

  // Values the picker reported are already on screen; only outside changes move the strip.
  useEffect(() => {
    if (!gate.isOutside(value) || dragging.get()) return;
    pos.set(withTiming(value, { duration: 180, easing: Easing.out(Easing.cubic) }));
  }, [value, pos, dragging, gate]);

  const live = (g: number, v: number) => gate.live(g, v) && onChange(v);
  const commit = (g: number, v: number) => gate.commit(g, v) && onChange(v);
  const tick = () => void Haptics.selectionAsync();

  useAnimatedReaction(
    () => Math.round(pos.get()),
    (now, before) => {
      if (before === null || now === before) return;
      if (dragging.get() || landing.get()) scheduleOnRN(tick);
      if (dragging.get()) scheduleOnRN(live, gen.get(), now);
    },
  );

  /** Lands on a whole number and tells JS right away, before the animation ends. */
  const settle = (target: number) => {
    'worklet';
    const g = gen.get();
    settledGen.set(g);
    const distance = Math.abs(target - pos.get());
    landing.set(true);
    pos.set(
      withTiming(
        target,
        { duration: 160 + Math.min(distance, 6) * 50, easing: Easing.out(Easing.cubic) },
        () => {
          if (gen.get() === g) landing.set(false);
        },
      ),
    );
    scheduleOnRN(commit, g, target);
  };

  const pan = Gesture.Pan()
    .onBegin(() => {
      gen.set(gen.get() + 1);
      cancelAnimation(pos);
      start.set(pos.get());
    })
    .onUpdate((e) => {
      dragging.set(true);
      pos.set(clampGrade(start.get() - e.translationX / STEP));
    })
    .onEnd((e) => {
      dragging.set(false);
      settle(flingTarget(pos.get(), e.velocityX, STEP));
    })
    .onFinalize(() => {
      dragging.set(false);
      // A touch that stopped the strip without dragging still lands on a whole number.
      if (settledGen.get() !== gen.get()) settle(Math.round(pos.get()));
    });

  const tap = Gesture.Tap()
    .maxDistance(10)
    .onEnd((e, success) => {
      if (!success) return;
      gen.set(gen.get() + 1);
      settle(tapTarget(pos.get(), e.x, width, STEP));
    });

  const strip = useAnimatedStyle(() => ({
    transform: [{ translateX: width / 2 - pos.get() * STEP }],
  }));

  return (
    <GestureDetector
      gesture={Gesture.Race(pan.withTestId('ruler-pan'), tap.withTestId('ruler-tap'))}
    >
      <View
        style={styles.ruler}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={es.editor.ruler}
        accessibilityValue={{ min: 0, max: MAX_GRADE, now: value }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(e) =>
          onChange(clampGrade(value + (e.nativeEvent.actionName === 'increment' ? 1 : -1)))
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
