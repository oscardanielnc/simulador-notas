import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { es } from '@/i18n/es';
import { color, font, numbers } from '@/theme/tokens';
import { StarIcon } from '@/ui/StarIcon';

/** Distance between two integers (ADR 0005: at least 32 dp). */
export const STEP = 36;
const MAX = 20;
const TICKS = Array.from({ length: MAX + 1 }, (_, i) => i);

interface Props {
  value: number;
  onChange: (v: number) => void;
  /** Tick that gets the real-grade star, or null. */
  star: number | null;
}

/**
 * Horizontal ruler moving under a fixed center indicator.
 * The strip follows the finger on the UI thread; JS only hears about whole integers.
 */
export function RulerPicker({ value, onChange, star }: Props) {
  const [width, setWidth] = useState(0);
  const pos = useSharedValue(value);
  const start = useSharedValue(value);
  const last = useSharedValue(value);
  const dragging = useSharedValue(false);

  useEffect(() => {
    if (dragging.get()) return;
    last.set(value);
    pos.set(withTiming(value, { duration: 120 }));
  }, [value, pos, last, dragging]);

  const emit = (v: number) => {
    void Haptics.selectionAsync();
    onChange(v);
  };

  const pan = Gesture.Pan()
    .onBegin(() => {
      dragging.set(true);
      start.set(pos.get());
    })
    .onUpdate((e) => {
      const next = Math.min(MAX, Math.max(0, start.get() - e.translationX / STEP));
      pos.set(next);
      const whole = Math.round(next);
      if (whole !== last.get()) {
        last.set(whole);
        scheduleOnRN(emit, whole);
      }
    })
    .onFinalize(() => {
      dragging.set(false);
      pos.set(withTiming(last.get(), { duration: 120 }));
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
          onChange(
            Math.min(MAX, Math.max(0, value + (e.nativeEvent.actionName === 'increment' ? 1 : -1))),
          )
        }
      >
        <Animated.View style={[styles.strip, strip]}>
          {TICKS.map((i) => (
            <View key={i} style={[styles.tickBox, { left: i * STEP }]}>
              {i === star && <StarIcon size={14} />}
              <Text style={[styles.number, i === star && styles.realNumber]}>{i}</Text>
              <View style={[styles.tick, { height: i % 5 === 0 ? 22 : 12 }]} />
            </View>
          ))}
        </Animated.View>
        <View pointerEvents="none" style={styles.indicator} />
      </View>
    </GestureDetector>
  );
}

const TICK_BOX = 30;

const styles = StyleSheet.create({
  ruler: { flex: 1, height: 70, overflow: 'hidden' },
  strip: { position: 'absolute', top: 0, bottom: 0, left: 0 },
  tickBox: {
    position: 'absolute',
    bottom: 0,
    width: TICK_BOX,
    marginLeft: -TICK_BOX / 2,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 3,
  },
  number: { ...numbers, fontFamily: font.regular, fontSize: 12, color: color.secondary },
  realNumber: { fontFamily: font.semibold, color: color.strong },
  tick: { width: 1.5, backgroundColor: color.muted },
  indicator: {
    position: 'absolute',
    left: '50%',
    top: 14,
    bottom: 0,
    width: 3,
    marginLeft: -1.5,
    borderRadius: 2,
    backgroundColor: color.accent,
  },
});
