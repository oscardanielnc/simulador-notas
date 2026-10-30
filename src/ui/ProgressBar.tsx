import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { color, motion } from '@/theme/tokens';

export function ProgressBar({ value }: { value: number }) {
  const progress = useSharedValue(value / 20);
  useEffect(() => {
    progress.set(
      withTiming(value / 20, {
        duration: motion.bar,
        easing: Easing.out(Easing.quad),
      }),
    );
  }, [value, progress]);
  const fill = useAnimatedStyle(() => ({ width: `${progress.get() * 100}%` }));
  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, fill]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 6, borderRadius: 3, backgroundColor: color.track, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3, backgroundColor: color.secondary },
});
