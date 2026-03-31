import React from 'react';
import { View, Dimensions } from 'react-native';
import { VictoryChart, VictoryBar, VictoryAxis } from 'victory-native';
import { useTheme } from '../../contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface BarChartProps {
  data: { label: string; value: number }[];
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({ data, height = 220 }) => {
  const { theme } = useTheme();
  const chartData = data.map((d) => ({ x: d.label, y: d.value }));

  return (
    <View>
      <VictoryChart
        width={width - 80}
        height={height}
        domainPadding={{ x: 20 }}
        padding={{ top: 10, bottom: 50, left: 40, right: 20 }}
      >
        <VictoryAxis
          style={{
            axis: { stroke: theme.border },
            tickLabels: {
              fill: theme.textSecondary,
              fontSize: 10,
              angle: data.length > 4 ? -30 : 0,
              textAnchor: data.length > 4 ? 'end' : 'middle',
            },
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
        <VictoryBar
          data={chartData}
          style={{ data: { fill: theme.text } }}
          cornerRadius={{ top: 4 }}
          animate={{ duration: 500 }}
        />
      </VictoryChart>
    </View>
  );
};
