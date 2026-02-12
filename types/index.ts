export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Split {
  userId: string;
  amount: number;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  date: string;
  splits: Split[];
  category: string;
  receipt?: string;
}

export interface Settlement {
  id: string;
  from: string;
  to: string;
  amount: number;
  date: string;
  confirmed: boolean;
  proof?: string;
}

export interface Balance {
  userId: string;
  amount: number;
}