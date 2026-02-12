export interface User {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

export interface Split {
  userId: string;
  amount: number;
  paid: boolean;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  date: string;
  category: string;
  receipt?: string;
  splits: Split[];
  createdAt: number;
}

export interface Settlement {
  id: string;
  from: string;
  to: string;
  amount: number;
  date: string;
  proof?: string;
  status: 'pending' | 'confirmed';
  createdAt: number;
}

export interface Group {
  id: string;
  name: string;
  members: User[];
  expenses: Expense[];
  settlements: Settlement[];
  createdAt: number;
}

export interface Transaction {
  from: string;
  to: string;
  amount: number;
}