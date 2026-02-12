import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useApp } from '../context/AppContext';
import { calculateBalances, calculateOptimalSettlements } from '../utils/debtCalculator';
import { AnimatedCard } from '../components/AnimatedCard';
import { Ionicons } from '@expo/vector-icons';

export const HomeScreen = ({ navigation }: any) => {
  const { users, expenses, settlements } = useApp();
  
  const balances = calculateBalances(expenses, users);
  const optimalSettlements = calculateOptimalSettlements(balances);
  
  const totalDebt = balances.reduce((sum, b) => sum + (b.amount > 0 ? b.amount : 0), 0);
  
  const getUserName = (id: string) => users.find(u => u.id === id)?.name || 'Unknown';
  
  return (
    <LinearGradient
      colors={['#ede9fe', '#fdf4ff', '#e0f2fe']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>SplitSavvy</Text>
          <Text style={styles.subtitle}>Simplify your group debts</Text>
        </View>
        
        <AnimatedCard style={styles.summaryCard}>
          <Text style={styles.cardLabel}>Total Group Spending</Text>
          <Text style={styles.amount}>${totalDebt.toFixed(2)}</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{expenses.length}</Text>
              <Text style={styles.statLabel}>Expenses</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{settlements.filter(s => s.confirmed).length}</Text>
              <Text style={styles.statLabel}>Settled</Text>
            </View>
          </View>
        </AnimatedCard>
        
        <Text style={styles.sectionTitle}>Your Balance</Text>
        {balances.map((balance, index) => (
          <Animated.View entering={FadeInUp.delay(index * 100)} key={balance.userId}>
            <AnimatedCard style={styles.balanceCard} index={index}>
              <View style={styles.balanceRow}>
                <View style={styles.userInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{getUserName(balance.userId)[0]}</Text>
                  </View>
                  <Text style={styles.userName}>{getUserName(balance.userId)}</Text>
                </View>
                <Text style={[
                  styles.balanceAmount,
                  balance.amount > 0 ? styles.positive : balance.amount < 0 ? styles.negative : styles.neutral
                ]}>
                  {balance.amount > 0 ? '+' : ''}{balance.amount.toFixed(2)}
                </Text>
              </View>
            </AnimatedCard>
          </Animated.View>
        ))}
        
        <Text style={styles.sectionTitle}>Optimal Payment Plan</Text>
        {optimalSettlements.length === 0 ? (
          <AnimatedCard style={styles.emptyCard}>
            <Text style={styles.emptyText}>All settled up! 🎉</Text>
          </AnimatedCard>
        ) : (
          optimalSettlements.map((settlement, index) => (
            <Animated.View entering={FadeInUp.delay(400 + index * 100)} key={`${settlement.from}-${settlement.to}`}>
              <AnimatedCard style={styles.settlementCard} index={index}>
                <View style={styles.settlementRow}>
                  <View style={styles.settlementUsers}>
                    <Text style={styles.userNameSmall}>{getUserName(settlement.from)}</Text>
                    <Ionicons name="arrow-forward" size={16} color="#a855f7" />
                    <Text style={styles.userNameSmall}>{getUserName(settlement.to)}</Text>
                  </View>
                  <Text style={styles.settlementAmount}>${settlement.amount.toFixed(2)}</Text>
                </View>
              </AnimatedCard>
            </Animated.View>
          ))
        )}
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddExpense')}
        >
          <LinearGradient
            colors={['#8b5cf6', '#d946ef']}
            style={styles.gradientButton}
          >
            <Ionicons name="add" size={24} color="white" />
            <Text style={styles.buttonText}>Add Expense</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2e1065',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b21a8',
    opacity: 0.8,
  },
  summaryCard: {
    marginBottom: 24,
    padding: 24,
  },
  cardLabel: {
    fontSize: 14,
    color: '#6b21a8',
    marginBottom: 8,
    opacity: 0.8,
  },
  amount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#2e1065',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2e1065',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b21a8',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2e1065',
    marginBottom: 12,
    marginTop: 8,
  },
  balanceCard: {
    marginBottom: 12,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd6fe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b21a8',
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2e1065',
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: '600',
  },
  positive: {
    color: '#059669',
  },
  negative: {
    color: '#dc2626',
  },
  neutral: {
    color: '#6b7280',
  },
  settlementCard: {
    marginBottom: 8,
  },
  settlementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settlementUsers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userNameSmall: {
    fontSize: 14,
    color: '#2e1065',
    fontWeight: '500',
  },
  settlementAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#a855f7',
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b21a8',
    fontWeight: '500',
  },
  addButton: {
    marginVertical: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});