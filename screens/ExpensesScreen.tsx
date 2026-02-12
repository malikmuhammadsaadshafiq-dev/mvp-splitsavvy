import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { useApp } from '../context/AppContext';
import { AnimatedCard } from '../components/AnimatedCard';
import { Ionicons } from '@expo/vector-icons';

export const ExpensesScreen = ({ navigation }: any) => {
  const { expenses, users, deleteExpense } = useApp();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const getUserName = (id: string) => users.find(u => u.id === id)?.name || 'Unknown';
  
  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setDeletingId(id);
            setTimeout(() => {
              deleteExpense(id);
              setDeletingId(null);
            }, 300);
          }
        }
      ]
    );
  };
  
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Food': 'restaurant',
      'Groceries': 'cart',
      'Transport': 'car',
      'Travel': 'airplane',
      'Entertainment': 'film',
      'Utilities': 'flash',
      'Gifts': 'gift'
    };
    return icons[category] || 'receipt';
  };
  
  return (
    <LinearGradient
      colors={['#ede9fe', '#fdf4ff', '#e0f2fe']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Expenses</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddExpense')}>
          <Ionicons name="add-circle" size={32} color="#a855f7" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {expenses.length === 0 ? (
          <AnimatedCard style={styles.emptyCard}>
            <Text style={styles.emptyText}>No expenses yet</Text>
            <TouchableOpacity 
              style={styles.addFirstButton}
              onPress={() => navigation.navigate('AddExpense')}
            >
              <Text style={styles.addFirstText}>Add your first expense</Text>
            </TouchableOpacity>
          </AnimatedCard>
        ) : (
          expenses.map((expense, index) => (
            <Animated.View 
              key={expense.id}
              entering={FadeInRight.delay(index * 50)}
              exiting={FadeOutLeft}
              style={deletingId === expense.id ? { opacity: 0.5 } : {}}
            >
              <AnimatedCard style={styles.expenseCard} index={index}>
                <View style={styles.expenseHeader}>
                  <View style={styles.categoryIcon}>
                    <Ionicons 
                      name={getCategoryIcon(expense.category) as any} 
                      size={20} 
                      color="#a855f7" 
                    />
                  </View>
                  <View style={styles.expenseInfo}>
                    <Text style={styles.expenseDescription}>{expense.description}</Text>
                    <Text style={styles.expenseMeta}>
                      Paid by {getUserName(expense.paidBy)} • {expense.date}
                    </Text>
                  </View>
                  <Text style={styles.expenseAmount}>${expense.amount.toFixed(2)}</Text>
                </View>
                
                <View style={styles.splitsContainer}>
                  {expense.splits.map((split, idx) => (
                    <View key={idx} style={styles.splitTag}>
                      <Text style={styles.splitText}>
                        {getUserName(split.userId)}: ${split.amount.toFixed(2)}
                      </Text>
                    </View>
                  ))}
                </View>
                
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDelete(expense.id)}
                >
                  <Ionicons name="trash-outline" size={18} color="#dc2626" />
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </AnimatedCard>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  expenseCard: {
    marginBottom: 12,
  },
  expenseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f3e8ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e1065',
    marginBottom: 2,
  },
  expenseMeta: {
    fontSize: 12,
    color: '#6b21a8',
    opacity: 0.8,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2e1065',
  },
  splitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(167, 139, 250, 0.2)',
  },
  splitTag: {
    backgroundColor: '#f3e8ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  splitText: {
    fontSize: 12,
    color: '#6b21a8',
    fontWeight: '500',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  deleteText: {
    fontSize: 14,
    color: '#dc2626',
    fontWeight: '500',
  },
  emptyCard: {
    marginTop: 40,
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#6b21a8',
    marginBottom: 16,
  },
  addFirstButton: {
    backgroundColor: '#a855f7',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addFirstText: {
    color: 'white',
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});