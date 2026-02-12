import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: any;
  index?: number;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({ children, style, index = 0 }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  
  React.useEffect(() => {
    opacity.value = withSpring(1, { delay: index * 100 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle, style]}>
      <BlurView intensity={20} style={styles.blur}>
        {children}
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.3)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },
  blur: {
    padding: 20,
    width: '100%',
  }
});