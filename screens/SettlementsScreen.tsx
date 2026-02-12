import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useApp } from '../context/AppContext';
import { AnimatedCard } from '../components/AnimatedCard';
import { calculateBalances, calculateOptimalSettlements } from '../utils/debtCalculator';
import { Ionicons } from '@expo/vector-icons';

export const SettlementsScreen = () => {
  const { users, expenses, settlements, addSettlement } = useApp();
  const [settlingId, setSettlingId] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  
  const balances = calculateBalances(expenses, users);
  const optimalSettlements = calculateOptimalSettlements(balances);
  
  const getUserName = (id: string) => users.find(u => u.id === id)?.name || 'Unknown';
  
  const handleSettle = (from: string, to: string, suggestedAmount: number) => {
    setSettlingId(`${from}-${to}`);
    setAmount(suggestedAmount.toFixed(2));
  };
  
  const confirmPayment = () => {
    if (!settlingId || !amount) return;
    
    const [from, to] = settlingId.split('-');
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    addSettlement({
      from,
      to,
      amount: numAmount,
      date: new Date().toISOString().split('T')[0],
      confirmed: true
    });
    
    setSettlingId(null);
    setAmount('');
  };
  
  const pendingSettlements = optimalSettlements.filter(s => 
    !settlements.some(set => 
      set.from === s.from && set.to === s.to && set.confirmed
    )
  );
  
  return (
    <LinearGradient
      colors={['#ede9fe', '#fdf4ff', '#e0f2fe']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Settlements</Text>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Pending Payments</Text>
        
        {pendingSettlements.length === 0 ? (
          <AnimatedCard style={styles.emptyCard}>
            <Ionicons name="checkmark-circle" size={48} color="#10b981" />
            <Text style={styles.emptyText}>All caught up!</Text>
            <Text style={styles.emptySubtext}>No pending settlements</Text>
          </AnimatedCard>
        ) : (
          pendingSettlements.map((settlement, index) => (
            <Animated.View entering={FadeInUp.delay(index * 100)} key={`${settlement.from}-${settlement.to}`}>
              <AnimatedCard style={styles.settlementCard} index={index}>
                <View style={styles.settlementHeader}>
                  <View style={styles.usersRow}>
                    <View style={styles.userBadge}>
                      <Text style={styles.userInitial}>{getUserName(settlement.from)[0]}</Text>
                    </View>
                    <View style={styles.arrowContainer}>
                      <Ionicons name="arrow-forward" size={20} color="#a855f7" />
                    </View>
                    <View style={[styles.userBadge, styles.userBadgeTo]}>
                      <Text style={styles.userInitial}>{getUserName(settlement.to)[0]}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.amountContainer}>
                    <Text style={styles.settlementAmount}>${settlement.amount.toFixed(2)}</Text>
                  </View>
                </View>
                
                <View style={styles.namesRow}>
                  <Text style={styles.userName}>{getUserName(settlement.from)}</Text>
                  <Text style={styles.paysText}>pays</Text>
                  <Text style={styles.userName}>{getUserName(settlement.to)}</Text>
                </View>
                
                {settlingId === `${settlement.from}-${settlement.to}` ? (
                  <View style={styles.confirmContainer}>
                    <TextInput
                      style={styles.amountInput}
                      value={amount}
                      onChangeText={setAmount}
                      keyboardType="decimal-pad"
                      placeholder="Amount"
                    />
                    <View style={styles.confirmButtons}>
                      <TouchableOpacity 
                        style={styles.cancelButton}
                        onPress={() => setSettlingId(null)}
                      >
                        <Text style={styles.cancelText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.confirmButton}
                        onPress={confirmPayment}
                      >
                        <LinearGradient
                          colors={['#8b5cf6', '#d946ef']}
                          style={styles.gradientConfirm}
                        >
                          <Text style={styles.confirmText}>Confirm</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={styles.settleButton}
                    onPress={() => handleSettle(settlement.from, settlement.to, settlement.amount)}
                  >
                    <Text style={styles.settleButtonText}>Mark as Paid</Text>
                  </TouchableOpacity>
                )}
              </AnimatedCard>
            </Animated.View>
          ))
        )}
        
        <Text style={styles.sectionTitle}>History</Text>
        {settlements.length === 0 ? (
          <AnimatedCard style={styles.emptyCardSmall}>
            <Text style={styles.emptyTextSmall}>No settlements yet</Text>
          </AnimatedCard>
        ) : (
          settlements.map((settlement, index) => (
            <Animated.View entering={FadeInUp.delay(600 + index * 50)} key={settlement.id}>
              <View style={styles.historyItem}>
                <View style={styles.historyIcon}>
                  <Ionicons name="checkmark-done" size={20} color="#10b981" />
                </View>
                <View style={styles.historyContent}>
                  <Text style={styles.historyText}>
                    {getUserName(settlement.from)} paid {getUserName(settlement.to)}
                  </Text>
                  <Text style={styles.historyDate}>{settlement.date}</Text>
                </View>
                <Text style={styles.historyAmount}>${settlement.amount.toFixed(2)}</Text>
              </View>
            </Animated.View>
          ))
        )}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 60,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2e1065',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2e1065',
    marginBottom: 12,
    marginTop: 8,
  },
  settlementCard: {
    marginBottom: 12,
  },
  settlementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  usersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd6fe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userBadgeTo: {
    backgroundColor: '#fae8ff',
  },
  userInitial: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b21a8',
  },
  arrowContainer: {
    padding: 4,
  },
  amountContainer: {
    backgroundColor: '#f3e8ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  settlementAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#a855f7',
  },
  namesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e1065',
  },
  paysText: {
    fontSize: 14,
    color: '#6b21a8',
    opacity: 0.7,
  },
  settleButton: {
    backgroundColor: '#a855f7',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  settleButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  confirmContainer: {
    gap: 12,
  },
  amountInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#2e1065',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.3)',
    textAlign: 'center',
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.3)',
  },
  cancelText: {
    color: '#6b21a8',
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientConfirm: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmText: {
    color: 'white',
    fontWeight: '600',
  },
  emptyCard: {
    padding: 40,
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2e1065',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b21a8',
    marginTop: 4,
  },
  emptyCardSmall: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTextSmall: {
    fontSize: 16,
    color: '#6b21a8',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.2)',
  },
  historyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#d1fae5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyContent: {
    flex: 1,
  },
  historyText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2e1065',
  },
  historyDate: {
    fontSize: 12,
    color: '#6b21a8',
    opacity: 0.7,
    marginTop: 2,
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  bottomPadding: {
    height: 40,
  },
});