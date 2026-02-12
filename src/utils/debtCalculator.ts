import { User, Expense, Settlement, Transaction } from '../types';

export interface Balance {
  userId: string;
  name: string;
  amount: number;
}

export function calculateBalances(
  members: User[],
  expenses: Expense[],
  settlements: Settlement[]
): Balance[] {
  const balances: Record<string, number> = {};
  
  members.forEach(member => {
    balances[member.id] = 0;
  });

  expenses.forEach(expense => {
    balances[expense.paidBy] += expense.amount;
    
    expense.splits.forEach(split => {
      if (!split.paid) {
        balances[split.userId] -= split.amount;
      }
    });
  });

  settlements
    .filter(s => s.status === 'confirmed')
    .forEach(settlement => {
      balances[settlement.from] += settlement.amount;
      balances[settlement.to] -= settlement.amount;
    });

  return members.map(member => ({
    userId: member.id,
    name: member.name,
    amount: parseFloat(balances[member.id].toFixed(2))
  }));
}

export function optimizeTransactions(balances: Balance[]): Transaction[] {
  const transactions: Transaction[] = [];
  
  const creditors = balances
    .filter(b => b.amount > 0)
    .sort((a, b) => b.amount - a.amount);
    
  const debtors = balances
    .filter(b => b.amount < 0)
    .sort((a, b) => a.amount - b.amount);

  let i = 0, j = 0;
  
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    
    const amount = Math.min(Math.abs(debtor.amount), creditor.amount);
    
    if (amount > 0.01) {
      transactions.push({
        from: debtor.userId,
        to: creditor.userId,
        amount: parseFloat(amount.toFixed(2))
      });
    }
    
    debtor.amount += amount;
    creditor.amount -= amount;
    
    if (Math.abs(debtor.amount) < 0.01) i++;
    if (Math.abs(creditor.amount) < 0.01) j++;
  }
  
  return transactions;
}