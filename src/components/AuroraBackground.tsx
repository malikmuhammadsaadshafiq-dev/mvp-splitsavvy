import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export const AuroraBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const translateX1 = useSharedValue(0);
  const translateY1 = useSharedValue(0);
  const scale1 = useSharedValue(1);
  
  const translateX2 = useSharedValue(0);
  const translateY2 = useSharedValue(0);
  const scale2 = useSharedValue(1);

  useEffect(() => {
    translateX1.value = withRepeat(
      withSequence(
        withTiming(50, { duration: 7500, easing: Easing.inOut(Easing.ease) }),
        withTiming(-50, { duration: 7500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    
    translateY1.value = withRepeat(
      withSequence(
        withTiming(100, { duration: 7500, easing: Easing.inOut(Easing.ease) }),
        withTiming(-100, { duration: 7500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    
    scale1.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 7500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.95, { duration: 7500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    translateX2.value = withRepeat(
      withSequence(
        withTiming(-30, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
        withTiming(30, { duration: 8000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    
    translateY2.value = withRepeat(
      withSequence(
        withTiming(-80, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
        withTiming(80, { duration: 8000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    
    scale2.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.9, { duration: 8000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX1.value },
      { translateY: translateY1.value },
      { scale: scale1.value },
    ],
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX2.value },
      { translateY: translateY2.value },
      { scale: scale2.value },
    ],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#022c22', '#083344', '#172554']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      
      <Animated.View style={[styles.auroraCircle, styles.circle1, animatedStyle1]}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#34d399', opacity: 0.3, borderRadius: 999 }]} />
      </Animated.View>
      
      <Animated.View style={[styles.auroraCircle, styles.circle2, animatedStyle2]}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#06b6d4', opacity: 0.3, borderRadius: 999 }]} />
      </Animated.View>
      
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#022c22',
  },
  auroraCircle: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: 999,
  },
  circle1: {
    top: -height * 0.2,
    left: -width * 0.1,
  },
  circle2: {
    bottom: -height * 0.2,
    right: -width * 0.1,
  },
});