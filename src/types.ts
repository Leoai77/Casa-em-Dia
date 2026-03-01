export type User = {
  id: string;
  name: string;
  role: 'Administrador' | 'Membro';
  avatar?: string;
};

export type ExpenseCategory = 'Material de Construção' | 'Mão de Obra' | 'Documentação' | 'Mobília' | 'Outros';

export type Expense = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  paidBy: string; // User ID
  paymentMethod: string;
  receiptUrl?: string;
};

export type HousePayment = {
  id: string;
  installment: number;
  amount: number;
  date: string;
  paidBy: string; // User ID
  status: 'Pago' | 'Pendente';
};

export type AppState = {
  houseTotalValue: number;
  users: User[];
  expenses: Expense[];
  payments: HousePayment[];
};
