import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useApp } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';

export const AddExpenseScreen = ({ navigation }: any) => {
  const { users, addExpense } = useApp();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(users[0]?.id || '');
  const [selectedUsers, setSelectedUsers] = useState<string[]>(users.map(u => u.id));
  const [category, setCategory] = useState('Food');
  const [loading, setLoading] = useState(false);
  
  const categories = ['Food', 'Groceries', 'Transport', 'Travel', 'Entertainment', 'Utilities', 'Gifts'];
  
  const toggleUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      if (selectedUsers.length > 1) {
        setSelectedUsers(selectedUsers.filter(id => id !== userId));
      }
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };
  
  const handleSubmit = async () => {
    if (!description.trim() || !amount.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    setLoading(true);
    
    const splitAmount = numAmount / selectedUsers.length;
    const splits = selectedUsers.map(userId => ({
      userId,
      amount: parseFloat(splitAmount.toFixed(2))
    }));
    
    const totalSplit = splits.reduce((sum, s) => sum + s.amount, 0);
    if (totalSplit !== numAmount) {
      splits[0].amount += parseFloat((numAmount - totalSplit).toFixed(2));
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addExpense({
      description,
      amount: numAmount,
      paidBy,
      date: new Date().toISOString().split('T')[0],
      category,
      splits
    });
    
    setLoading(false);
    navigation.goBack();
  };
  
  return (
    <LinearGradient
      colors={['#ede9fe', '#fdf4ff', '#e0f2fe']}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#2e1065" />
        </TouchableOpacity>
        <Text style={styles.title}>Add Expense</Text>
        <View style={{ width: 28 }} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.delay(100)}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="What was this for?"
              placeholderTextColor="#a855f7"
            />
          </View>
        </Animated.View>
        
        <Animated.View entering={FadeInUp.delay(200)}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.amountInput}>
              <Text style={styles.dollarSign}>$</Text>
              <TextInput
                style={[styles.input, styles.amountField]}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#a855f7"
              />
            </View>
          </View>
        </Animated.View>
        
        <Animated.View entering={FadeInUp.delay(300)}>
          <Text style={styles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  category === cat && styles.categoryButtonActive
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[
                  styles.categoryText,
                  category === cat && styles.categoryTextActive
                ]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
        
        <Animated.View entering={FadeInUp.delay(400)}>
          <Text style={styles.label}>Paid by</Text>
          <View style={styles.payerContainer}>
            {users.map(user => (
              <TouchableOpacity
                key={user.id}
                style={[
                  styles.payerButton,
                  paidBy === user.id && styles.payerButtonActive
                ]}
                onPress={() => setPaidBy(user.id)}
              >
                <Text style={[
                  styles.payerText,
                  paidBy === user.id && styles.payerTextActive
                ]}>{user.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
        
        <Animated.View entering={FadeInUp.delay(500)}>
          <Text style={styles.label}>Split between</Text>
          <View style={styles.splitContainer}>
            {users.map(user => (
              <TouchableOpacity
                key={user.id}
                style={[
                  styles.splitButton,
                  selectedUsers.includes(user.id) && styles.splitButtonActive
                ]}
                onPress={() => toggleUser(user.id)}
              >
                <View style={styles.checkbox}>
                  {selectedUsers.includes(user.id) && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <Text style={[
                  styles.splitText,
                  selectedUsers.includes(user.id) && styles.splitTextActive
                ]}>{user.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
        
        <Animated.View entering={FadeInUp.delay(600)}>
          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <LinearGradient
              colors={['#8b5cf6', '#d946ef']}
              style={styles.gradientButton}
            >
              <Text style={styles.submitText}>
                {loading ? 'Saving...' : 'Save Expense'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
        
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
    fontSize: 24,
    fontWeight: '700',
    color: '#2e1065',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b21a8',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#2e1065',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.3)',
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.3)',
    paddingLeft: 16,
  },
  dollarSign: {
    fontSize: 20,
    color: '#a855f7',
    fontWeight: '600',
  },
  amountField: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  categoryScroll: {
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.3)',
  },
  categoryButtonActive: {
    backgroundColor: '#a855f7',
    borderColor: '#a855f7',
  },
  categoryText: {
    color: '#6b21a8',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: 'white',
  },
  payerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  payerButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.3)',
  },
  payerButtonActive: {
    backgroundColor: '#a855f7',
    borderColor: '#a855f7',
  },
  payerText: {
    color: '#6b21a8',
    fontWeight: '500',
  },
  payerTextActive: {
    color: 'white',
  },
  splitContainer: {
    marginBottom: 24,
  },
  splitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.3)',
  },
  splitButtonActive: {
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    borderColor: '#a855f7',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#a855f7',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#a855f7',
  },
  splitText: {
    fontSize: 16,
    color: '#6b21a8',
  },
  splitTextActive: {
    color: '#2e1065',
    fontWeight: '600',
  },
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});