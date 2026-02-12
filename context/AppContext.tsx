import React, { createContext, useContext, useState, useCallback } from 'react';
import { Expense, Settlement, User } from '../types';
import { v4 as uuidv4 } from 'uuid';

const USERS: User[] = [
  { id: '1', name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Charlie', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', name: 'Diana', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: '5', name: 'Eric', avatar: 'https://i.pravatar.cc/150?u=5' },
];

const DEMO_EXPENSES: Expense[] = [
  {
    id: uuidv4(),
    description: 'Dinner at La Trattoria',
    amount: 120,
    paidBy: '1',
    date: '2024-01-15',
    category: 'Food',
    splits: [
      { userId: '1', amount: 30 },
      { userId: '2', amount: 30 },
      { userId: '3', amount: 30 },
      { userId: '4', amount: 30 }
    ]
  },
  {
    id: uuidv4(),
    description: 'Whole Foods Groceries',
    amount: 85.50,
    paidBy: '2',
    date: '2024-01-16',
    category: 'Groceries',
    splits: [
      { userId: '1', amount: 28.50 },
      { userId: '2', amount: 28.50 },
      { userId: '3', amount: 28.50 }
    ]
  },
  {
    id: uuidv4(),
    description: 'Uber to Airport',
    amount: 45,
    paidBy: '3',
    date: '2024-01-18',
    category: 'Transport',
    splits: [
      { userId: '3', amount: 22.50 },
      { userId: '4', amount: 22.50 }
    ]
  },
  {
    id: uuidv4(),
    description: 'Airbnb - Miami Trip',
    amount: 450,
    paidBy: '4',
    date: '2024-01-20',
    category: 'Travel',
    splits: [
      { userId: '1', amount: 90 },
      { userId: '2', amount: 90 },
      { userId: '3', amount: 90 },
      { userId: '4', amount: 90 },
      { userId: '5', amount: 90 }
    ]
  },
  {
    id: uuidv4(),
    description: 'Concert Tickets',
    amount: 200,
    paidBy: '1',
    date: '2024-01-22',
    category: 'Entertainment',
    splits: [
      { userId: '1', amount: 50 },
      { userId: '2', amount: 50 },
      { userId: '3', amount: 50 },
      { userId: '5', amount: 50 }
    ]
  },
  {
    id: uuidv4(),
    description: 'Gas Money - Road Trip',
    amount: 60,
    paidBy: '2',
    date: '2024-01-23',
    category: 'Transport',
    splits: [
      { userId: '2', amount: 20 },
      { userId: '3', amount: 20 },
      { userId: '5', amount: 20 }
    ]
  },
  {
    id: uuidv4(),
    description: 'Birthday Gift for Sarah',
    amount: 75,
    paidBy: '3',
    date: '2024-01-25',
    category: 'Gifts',
    splits: [
      { userId: '1', amount: 37.50 },
      { userId: '3', amount: 37.50 }
    ]
  },
  {
    id: uuidv4(),
    description: 'Electric Bill',
    amount: 140,
    paidBy: '4',
    date: '2024-01-28',
    category: 'Utilities',
    splits: [
      { userId: '1', amount: 35 },
      { userId: '2', amount: 35 },
      { userId: '4', amount: 35 },
      { userId: '5', amount: 35 }
    ]
  },
  {
    id: uuidv4(),
    description: 'Movie Night + Popcorn',
    amount: 65,
    paidBy: '1',
    date: '2024-01-30',
    category: 'Entertainment',
    splits: [
      { userId: '1', amount: 21.67 },
      { userId: '2', amount: 21.67 },
      { userId: '4', amount: 21.66 }
    ]
  },
  {
    id: uuidv4(),
    description: 'Sunday Brunch',
    amount: 95,
    paidBy: '2',
    date: '2024-02-01',
    category: 'Food',
    splits: [
      { userId: '1', amount: 23.75 },
      { userId: '2', amount: 23.75 },
      { userId: '3', amount: 23.75 },
      { userId: '4', amount: 23.75 }
    ]
  }
];

interface AppContextType {
  users: User[];
  expenses: Expense[];
  settlements: Settlement[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  addSettlement: (settlement: Omit<Settlement, 'id'>) => void;
  confirmSettlement: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(DEMO_EXPENSES);
  const [settlements, setSettlements] = useState<Settlement[]>([]);

  const addExpense = useCallback((expense: Omit<Expense, 'id'>) => {
    setExpenses(prev => [...prev, { ...expense, id: uuidv4() }]);
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  }, []);

  const addSettlement = useCallback((settlement: Omit<Settlement, 'id'>) => {
    setSettlements(prev => [...prev, { ...settlement, id: uuidv4() }]);
  }, []);

  const confirmSettlement = useCallback((id: string) => {
    setSettlements(prev => prev.map(s => 
      s.id === id ? { ...s, confirmed: true } : s
    ));
  }, []);

  return (
    <AppContext.Provider value={{
      users: USERS,
      expenses,
      settlements,
      addExpense,
      deleteExpense,
      addSettlement,
      confirmSettlement
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};