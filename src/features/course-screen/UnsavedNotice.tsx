import { StyleSheet, Text, View } from 'react-native';

import { es } from '@/i18n/es';
import { color, font, radius, size } from '@/theme/tokens';
import { StarIcon } from '@/ui/StarIcon';

/** Only real grades survive a restart (ADR 0009); the student must know before closing. */
export function UnsavedNotice() {
  return (
    <View style={styles.notice} accessibilityRole="text">
      <StarIcon size={14} />
      <Text style={styles.text}>{es.course.unsavedNotice}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderRadius: radius.chip,
    backgroundColor: color.tint,
  },
  text: { flex: 1, fontFamily: font.medium, fontSize: size.small, color: color.strong },
});
