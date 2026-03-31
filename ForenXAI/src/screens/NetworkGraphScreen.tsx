import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import Svg, { Circle, Line, Text as SvgText, G } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';
import { Typography } from '../theme/typography';
import { Card } from '../components/Card';
import { SmartHeader } from '../components/SmartHeader';

const { width } = Dimensions.get('window');
const GRAPH_SIZE = width - 32;

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  type: 'account' | 'merchant';
  risk: number; // 0-100
}

interface Edge {
  source: string;
  target: string;
  amount: number;
  suspicious: boolean;
}

const NODES: Node[] = [
  { id: 'A1', label: 'ACC-001', x: GRAPH_SIZE * 0.5, y: 80, type: 'account', risk: 87 },
  { id: 'A2', label: 'ACC-002', x: GRAPH_SIZE * 0.15, y: 200, type: 'account', risk: 20 },
  { id: 'A3', label: 'ACC-003', x: GRAPH_SIZE * 0.85, y: 200, type: 'account', risk: 65 },
  { id: 'M1', label: 'Merchant-X', x: GRAPH_SIZE * 0.3, y: 340, type: 'merchant', risk: 95 },
  { id: 'M2', label: 'Merchant-Y', x: GRAPH_SIZE * 0.7, y: 340, type: 'merchant', risk: 30 },
  { id: 'A4', label: 'ACC-004', x: GRAPH_SIZE * 0.5, y: 460, type: 'account', risk: 72 },
];

const EDGES: Edge[] = [
  { source: 'A1', target: 'M1', amount: 45000, suspicious: true },
  { source: 'A1', target: 'A3', amount: 15000, suspicious: true },
  { source: 'A2', target: 'M1', amount: 8000, suspicious: false },
  { source: 'A3', target: 'M2', amount: 3000, suspicious: false },
  { source: 'M1', target: 'A4', amount: 38000, suspicious: true },
  { source: 'A4', target: 'A2', amount: 12000, suspicious: false },
];

export const NetworkGraphScreen = () => {
  const { theme } = useTheme();
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const getNodeById = (id: string) => NODES.find((n) => n.id === id);

  const getNodeColor = (risk: number) => {
    if (risk >= 70) return theme.text;
    if (risk >= 40) return theme.textSecondary;
    return theme.border;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SmartHeader title="Transaction Network" />
      <View style={[styles.graphContainer, { borderColor: theme.border }]}>
        <Svg width={GRAPH_SIZE} height={520}>
          {/* Edges */}
          {EDGES.map((edge, i) => {
            const src = getNodeById(edge.source);
            const tgt = getNodeById(edge.target);
            if (!src || !tgt) return null;
            return (
              <Line
                key={i}
                x1={src.x}
                y1={src.y}
                x2={tgt.x}
                y2={tgt.y}
                stroke={edge.suspicious ? theme.text : theme.border}
                strokeWidth={edge.suspicious ? 2 : 1}
                strokeDasharray={edge.suspicious ? '0' : '4,4'}
              />
            );
          })}

          {/* Nodes */}
          {NODES.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const nodeColor = getNodeColor(node.risk);
            const radius = node.type === 'account' ? 22 : 18;
            return (
              <G key={node.id} onPress={() => setSelectedNode(node)}>
                <Circle
                  cx={node.x}
                  cy={node.y}
                  r={isSelected ? radius + 4 : radius}
                  fill={nodeColor}
                  stroke={theme.text}
                  strokeWidth={isSelected ? 2 : 1}
                />
                <SvgText
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  fill={theme.background}
                  fontSize={9}
                  fontWeight="700"
                >
                  {node.id}
                </SvgText>
                <SvgText
                  x={node.x}
                  y={node.y + radius + 14}
                  textAnchor="middle"
                  fill={theme.textSecondary}
                  fontSize={9}
                >
                  {node.label}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.text }]} />
          <Text style={[styles.legendText, { color: theme.textSecondary }]}>High Risk</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.textSecondary }]} />
          <Text style={[styles.legendText, { color: theme.textSecondary }]}>Medium Risk</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.border }]} />
          <Text style={[styles.legendText, { color: theme.textSecondary }]}>Low Risk</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: theme.text }]} />
          <Text style={[styles.legendText, { color: theme.textSecondary }]}>Suspicious</Text>
        </View>
      </View>

      {/* Node detail panel */}
      {selectedNode && (
        <Card style={[styles.detailPanel, { borderColor: theme.border }]}>
          <View style={styles.detailHeader}>
            <Text style={[styles.detailTitle, { color: theme.text }]}>
              {selectedNode.label}
            </Text>
            <Pressable onPress={() => setSelectedNode(null)}>
              <Text style={[styles.closeBtn, { color: theme.textSecondary }]}>✕</Text>
            </Pressable>
          </View>
          <Text style={[styles.detailType, { color: theme.textSecondary }]}>
            Type: {selectedNode.type.toUpperCase()}
          </Text>
          <Text style={[styles.detailRisk, { color: theme.text }]}>
            Risk Score: {selectedNode.risk}/100
          </Text>
          <Text style={[styles.detailConnections, { color: theme.textSecondary }]}>
            Connections:{' '}
            {EDGES.filter(
              (e) => e.source === selectedNode.id || e.target === selectedNode.id
            ).length}
          </Text>
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  graphContainer: {
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendLine: { width: 16, height: 2 },
  legendText: { ...Typography.small },
  detailPanel: { marginHorizontal: 16, marginTop: 4 },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailTitle: { ...Typography.h4 },
  closeBtn: { ...Typography.h4 },
  detailType: { ...Typography.caption, marginBottom: 4 },
  detailRisk: { ...Typography.bodyBold, marginBottom: 4 },
  detailConnections: { ...Typography.caption },
});
