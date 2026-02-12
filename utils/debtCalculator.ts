import { Balance, Expense, User } from '../types';

export const calculateBalances = (expenses: Expense[], users: User[]): Balance[] => {
  const balances: Record<string, number> = {};
  
  users.forEach(user => {
    balances[user.id] = 0;
  });
  
  expenses.forEach(expense => {
    balances[expense.paidBy] += expense.amount;
    expense.splits.forEach(split => {
      balances[split.userId] -= split.amount;
    });
  });
  
  return users.map(user => ({
    userId: user.id,
    amount: Math.round(balances[user.id] * 100) / 100
  }));
};

export const calculateOptimalSettlements = (balances: Balance[]): {from: string, to: string, amount: number}[] => {
  const debtors = balances.filter(b => b.amount < -0.01).map(b => ({...b, amount: Math.abs(b.amount)}));
  const creditors = balances.filter(b => b.amount > 0.01);
  
  const settlements: {from: string, to: string, amount: number}[] = [];
  
  let i = 0, j = 0;
  
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    
    const amount = Math.min(debtor.amount, creditor.amount);
    
    if (amount > 0.01) {
      settlements.push({
        from: debtor.userId,
        to: creditor.userId,
        amount: Math.round(amount * 100) / 100
      });
    }
    
    debtor.amount -= amount;
    creditor.amount -= amount;
    
    if (debtor.amount < 0.01) i++;
    if (creditor.amount < 0.01) j++;
  }
  
  return settlements;
};