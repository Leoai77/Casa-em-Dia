import { AppState } from './types';

export const mockData: AppState = {
  houseTotalValue: 450000,
  users: [
    { id: 'u1', name: 'Lucas', role: 'Administrador' },
    { id: 'u2', name: 'Mariana', role: 'Membro' },
  ],
  expenses: [
    { id: 'e1', description: 'Cimento e Areia', amount: 1200, date: '2023-10-15', category: 'Material de Construção', paidBy: 'u1', paymentMethod: 'Cartão de Crédito' },
    { id: 'e2', description: 'Pintor', amount: 3500, date: '2023-10-20', category: 'Mão de Obra', paidBy: 'u2', paymentMethod: 'Pix' },
    { id: 'e3', description: 'Taxas de Cartório', amount: 2800, date: '2023-09-10', category: 'Documentação', paidBy: 'u1', paymentMethod: 'Transferência' },
    { id: 'e4', description: 'Sofá', amount: 4200, date: '2023-11-05', category: 'Mobília', paidBy: 'u2', paymentMethod: 'Cartão de Crédito' },
    { id: 'e5', description: 'Pisos', amount: 5600, date: '2023-10-25', category: 'Material de Construção', paidBy: 'u1', paymentMethod: 'Boleto' },
  ],
  payments: [
    { id: 'p1', installment: 1, amount: 50000, date: '2023-09-01', paidBy: 'u1', status: 'Pago' },
    { id: 'p2', installment: 2, amount: 50000, date: '2023-09-01', paidBy: 'u2', status: 'Pago' },
    { id: 'p3', installment: 3, amount: 3500, date: '2023-10-01', paidBy: 'u1', status: 'Pago' },
    { id: 'p4', installment: 4, amount: 3500, date: '2023-11-01', paidBy: 'u2', status: 'Pago' },
    { id: 'p5', installment: 5, amount: 3500, date: '2023-12-01', paidBy: 'u1', status: 'Pendente' },
  ]
};
