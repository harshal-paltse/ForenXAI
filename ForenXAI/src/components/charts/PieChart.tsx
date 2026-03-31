import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { VictoryPie } from 'victory-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Typography } from '../../theme/typography';

const { width } = Dimensions.get('window');

interface PieChartProps {
  data: { label: string; value: number }[];
  height?: number;
}

export const PieChart: React.FC<PieChartProps> = ({ data, height = 220 }) => {
  const { theme, mode } = useTheme();

  // Grayscale scales that work in both themes
  const scale =
    mode === 'dark'
      ? ['#FFFFFF', '#CCCCCC', '#999999', '#666666', '#444444', '#2A2A2A']
      : ['#000000', '#333333', '#555555', '#777777', '#999999', '#BBBBBB'];

  const chartData = data.map((d) => ({ x: d.label, y: d.value }));

  return (
    <View>
      <VictoryPie
        data={chartData}
        width={width - 80}
        height={height}
        colorScale={scale}
        style={{
          labels: { fill: theme.text, fontSize: 10, fontWeight: '600' },
        }}
        innerRadius={36}
        animate={{ duration: 500 }}
      />
      <View style={styles.legend}>
        {data.map((d, i) => (
          <View key={d.label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: scale[i % scale.length] }]} />
            <Text style={[styles.legendText, { color: theme.textSecondary }]}>
              {d.label} ({d.value})
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { ...Typography.small },
});
