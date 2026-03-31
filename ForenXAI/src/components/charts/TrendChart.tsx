import React from 'react';
import { View, Dimensions } from 'react-native';
import { VictoryChart, VictoryArea, VictoryAxis } from 'victory-native';
import { useTheme } from '../../contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface TrendChartProps {
  data: { day: string; value: number }[];
  height?: number;
}

export const TrendChart: React.FC<TrendChartProps> = ({ data, height = 180 }) => {
  const { theme } = useTheme();
  const chartData = data.map((d) => ({ x: d.day, y: d.value }));

  return (
    <View>
      <VictoryChart
        width={width - 80}
        height={height}
        padding={{ top: 10, bottom: 40, left: 40, right: 20 }}
      >
        <VictoryAxis
          style={{
            axis: { stroke: theme.border },
            tickLabels: { fill: theme.textSecondary, fontSize: 10 },
            grid: { stroke: 'transparent' },
          }}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: theme.border },
            tickLabels: { fill: theme.textSecondary, fontSize: 10 },
            grid: { stroke: theme.border, strokeDasharray: '4,4', strokeOpacity: 0.4 },
          }}
        />
        <VictoryArea
          data={chartData}
          style={{
            data: {
              fill: theme.text,
              fillOpacity: 0.08,
              stroke: theme.text,
              strokeWidth: 2,
            },
          }}
          animate={{ duration: 500 }}
        />
      </VictoryChart>
    </View>
  );
};
