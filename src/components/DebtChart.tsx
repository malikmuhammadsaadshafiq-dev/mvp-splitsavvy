import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Balance } from '../utils/debtCalculator';

const { width } = Dimensions.get('window');

interface DebtChartProps {
  balances: Balance[];
}

export const DebtChart: React.FC<DebtChartProps> = ({ balances }) => {
  const maxAmount = Math.max(...balances.map(b => Math.abs(b.amount)));
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Debt Overview</Text>
      <View style={styles.chartContainer}>
        {balances.map((balance, index) => {
          const height = maxAmount > 0 ? (Math.abs(balance.amount) / maxAmount) * 150 : 0;
          const isPositive = balance.amount >= 0;
          
          return (
            <Animated.View 
              key={balance.userId} 
              entering={FadeInUp.delay(index * 100).duration(600)}
              style={styles.barWrapper}
            >
              <View 
                style={[
                  styles.bar, 
                  { 
                    height: height,
                    backgroundColor: isPositive ? '#34d399' : '#f87171',
                  }
                ]} 
              />
              <Text style={styles.barLabel}>{balance.name.split(' ')[0]}</Text>
              <Text style={[styles.barValue, { color: isPositive ? '#34d399' : '#f87171' }]}>
                ${Math.abs(balance.amount).toFixed(0)}
              </Text>
            </Animated.View>
          );
        })}
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#34d399' }]} />
          <Text style={styles.legendText}>Owed to you</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#f87171' }]} />
          <Text style={styles.legendText}>You owe</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.2)',
    padding: 20,
    marginVertical: 10,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: 'DMSans_700Bold',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 200,
    paddingBottom: 10,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 40,
    borderRadius: 8,
    minHeight: 4,
  },
  barLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 8,
    fontSize: 12,
    fontFamily: 'DMSans_500Medium',
  },
  barValue: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: 'DMSans_700Bold',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontFamily: 'DMSans_400Regular',
  },
});