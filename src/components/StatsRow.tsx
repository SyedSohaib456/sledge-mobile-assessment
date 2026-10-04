import React from 'react';
import { StyleSheet } from 'react-native';
import { Box, Text } from '../theme';

type StatItem = {
  label: string;
  value: number;
  color: string;
};

type Props = {
  items: StatItem[];
};

export function StatsRow({ items }: Props) {
  return (
    <Box flexDirection="row" gap="s">
      {items.map((item, index) => (
        <Box key={index} flex={1} style={styles.card} alignItems="center">
          <Text variant="h3" style={{ color: item.color }}>
            {item.value}
          </Text>
          <Text variant="caption" style={{ color: '#94A3B8', marginTop: 2 }}>
            {item.label}
          </Text>
        </Box>
      ))}
    </Box>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12,
    padding: 12,
  },
});
