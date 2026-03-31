import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography } from '../theme/typography';
import { Transaction } from '../types';
import { TransactionCard } from './TransactionCard';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.28;

interface SwipeableTransactionProps {
  transaction: Transaction;
  onPress: () => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export const SwipeableTransaction: React.FC<SwipeableTransactionProps> = ({
  transaction,
  onPress,
  onSwipeLeft,
  onSwipeRight,
}) => {
  const { theme } = useTheme();
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const isSwiping = useRef(false);
  const dismiss = (direction: 'left' | 'right', callback: () => void) => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: direction === 'left' ? -width : width,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start(() => callback());
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > 8 && Math.abs(gs.dx) > Math.abs(gs.dy),
      onPanResponderGrant: () => {
        isSwiping.current = false;
      },
      onPanResponderMove: (_, gs) => {
        translateX.setValue(gs.dx);
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dx > SWIPE_THRESHOLD) {
          isSwiping.current = true;
          dismiss('right', onSwipeRight);
        } else if (gs.dx < -SWIPE_THRESHOLD) {
          isSwiping.current = true;
          dismiss('left', onSwipeLeft);
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            friction: 6,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          friction: 6,
        }).start();
      },
    })
  ).current;

  // Derive hint opacities from translateX
  const safeHintOpacity = translateX.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const investigateHintOpacity = translateX.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.wrapper}>
      {/* Safe hint (right swipe) */}
      <Animated.View style={[styles.actionHint, styles.safeHint, { opacity: safeHintOpacity, backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }]}>
        <Text style={[styles.actionText, { color: theme.text }]}>✓ SAFE</Text>
      </Animated.View>

      {/* Investigate hint (left swipe) */}
      <Animated.View
        style={[styles.actionHint, styles.investigateHint, { opacity: investigateHintOpacity, backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}
      >
        <Text style={[styles.actionText, { color: theme.text }]}>⚑ INVESTIGATE</Text>
      </Animated.View>

      <Animated.View
        style={{ transform: [{ translateX }], opacity }}
        {...panResponder.panHandlers}
      >
        <TransactionCard transaction={transaction} onPress={onPress} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { position: 'relative', marginBottom: 12 },
  actionHint: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: 12,
    zIndex: -1,
  },
  safeHint: { left: 0, right: 0, alignItems: 'flex-start' },
  investigateHint: { left: 0, right: 0, alignItems: 'flex-end' },
  actionText: { ...Typography.label, fontSize: 13 },
});
