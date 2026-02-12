import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { HomeScreen } from './src/screens/HomeScreen';
import { ExpensesScreen } from './src/screens/ExpensesScreen';
import { SettlementsScreen } from './src/screens/SettlementsScreen';
import { GroupScreen } from './src/screens/GroupScreen';
import { AuroraBackground } from './src/components/AuroraBackground';
import { Group, User, Expense, Settlement } from './src/types';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const DEMO_USERS: User[] = [
  { id: '1', name: 'Alex Rivera', avatar: 'https://i.pravatar.cc/150?u=1', color: '#34d399' },
  { id: '2', name: 'Jordan Chen', avatar: 'https://i.pravatar.cc/150?u=2', color: '#60a5fa' },
  { id: '3', name: 'Taylor Swift', avatar: 'https://i.pravatar.cc/150?u=3', color: '#f472b6' },
  { id: '4', name: 'Casey Neistat', avatar: 'https://i.pravatar.cc/150?u=4', color: '#fbbf24' },
];

const DEMO_EXPENSES: Expense[] = [
  {
    id: 'e1',
    title: 'Airbnb Weekend',
    amount: 800,
    paidBy: '1',
    date: '2024-01-15',
    category: 'Accommodation',
    splits: [
      { userId: '1', amount: 200, paid: false },
      { userId: '2', amount: 200, paid: false },
      { userId: '3', amount: 200, paid: false },
      { userId: '4', amount: 200, paid: false },
    ],
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'e2',
    title: 'Dinner at Nobu',
    amount: 240,
    paidBy: '2',
    date: '2024-01-15',
    category: 'Food',
    splits: [
      { userId: '1', amount: 60, paid: false },
      { userId: '2', amount: 60, paid: false },
      { userId: '3', amount: 60, paid: false },
      { userId: '4', amount: 60, paid: false },
    ],
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'e3',
    title: 'Gas & Tolls',
    amount: 120,
    paidBy: '3',
    date: '2024-01-16',
    category: 'Transport',
    splits: [
      { userId: '1', amount: 40, paid: false },
      { userId: '2', amount: 40, paid: false },
      { userId: '3', amount: 40, paid: false },
    ],
    createdAt: Date.now() - 86400000 * 4,
  },
  {
    id: 'e4',
    title: 'Grocery Run',
    amount: 180,
    paidBy: '4',
    date: '2024-01-16',
    category: 'Food',
    splits: [
      { userId: '1', amount: 45, paid: false },
      { userId: '2', amount: 45, paid: false },
      { userId: '3', amount: 45, paid: false },
      { userId: '4', amount: 45, paid: false },
    ],
    createdAt: Date.now() - 86400000 * 4,
  },
  {
    id: 'e5',
    title: 'Concert Tickets',
    amount: 400,
    paidBy: '1',
    date: '2024-01-17',
    category: 'Entertainment',
    splits: [
      { userId: '1', amount: 200, paid: false },
      { userId: '2', amount: 200, paid: false },
    ],
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'e6',
    title: 'Parking Downtown',
    amount: 60,
    paidBy: '3',
    date: '2024-01-17',
    category: 'Transport',
    splits: [
      { userId: '1', amount: 15, paid: false },
      { userId: '2', amount: 15, paid: false },
      { userId: '3', amount: 15, paid: false },
      { userId: '4', amount: 15, paid: false },
    ],
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'e7',
    title: 'Drinks & Apps',
    amount: 90,
    paidBy: '2',
    date: '2024-01-18',
    category: 'Food',
    splits: [
      { userId: '1', amount: 22.5, paid: false },
      { userId: '2', amount: 22.5, paid: false },
      { userId: '3', amount: 22.5, paid: false },
      { userId: '4', amount: 22.5, paid: false },
    ],
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'e8',
    title: 'Sunday Brunch',
    amount: 65,
    paidBy: '4',
    date: '2024-01-19',
    category: 'Food',
    splits: [
      { userId: '1', amount: 16.25, paid: false },
      { userId: '2', amount: 16.25, paid: false },
      { userId: '3', amount: 16.25, paid: false },
      { userId: '4', amount: 16.25, paid: false },
    ],
    createdAt: Date.now() - 86400000,
  },
];

const DEMO_SETTLEMENTS: Settlement[] = [];

const DEMO_GROUP: Group = {
  id: 'g1',
  name: 'Weekend Getaway',
  members: DEMO_USERS,
  expenses: DEMO_EXPENSES,
  settlements: DEMO_SETTLEMENTS,
  createdAt: Date.now() - 86400000 * 7,
};

export const GroupContext = React.createContext<{
  group: Group;
  addExpense: (expense: Expense) => void;
  addSettlement: (settlement: Settlement) => void;
  refreshGroup: () => void;
}>({
  group: DEMO_GROUP,
  addExpense: () => {},
  addSettlement: () => {},
  refreshGroup: () => {},
});

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(2, 44, 34, 0.9)',
          borderTopWidth: 1,
          borderTopColor: 'rgba(52, 211, 153, 0.2)',
          height: 88,
          paddingBottom: 24,
          paddingTop: 12,
        },
        tabBarActiveTintColor: '#34d399',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
        tabBarLabelStyle: {
          fontFamily: 'DMSans_500Medium',
          fontSize: 12,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Expenses') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'Settle') {
            iconName = focused ? 'swap-horizontal' : 'swap-horizontal-outline';
          } else if (route.name === 'Group') {
            iconName = focused ? 'people' : 'people-outline';
          }
          
          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Expenses" component={ExpensesScreen} />
      <Tab.Screen name="Settle" component={SettlementsScreen} />
      <Tab.Screen name="Group" component={GroupScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [group, setGroup] = useState<Group>(DEMO_GROUP);
  const [loading, setLoading] = useState(true);
  
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  const addExpense = useCallback((expense: Expense) => {
    setGroup(prev => ({
      ...prev,
      expenses: [expense, ...prev.expenses],
    }));
  }, []);

  const addSettlement = useCallback((settlement: Settlement) => {
    setGroup(prev => ({
      ...prev,
      settlements: [settlement, ...prev.settlements],
    }));
  }, []);

  const refreshGroup = useCallback(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#022c22', '#083344', '#172554']}
          style={StyleSheet.absoluteFill}
        />
        <ActivityIndicator size="large" color="#34d399" />
      </View>
    );
  }

  return (
    <GroupContext.Provider value={{ group, addExpense, addSettlement, refreshGroup }}>
      <AuroraBackground>
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuroraBackground>
    </GroupContext.Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#022c22',
  },
});