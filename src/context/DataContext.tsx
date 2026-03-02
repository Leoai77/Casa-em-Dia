import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, Expense, HousePayment } from '../types';

interface DataContextType {
  data: AppState;
  resetData: () => void;
  addUser: (name: string) => void;
  setHouseTotalValue: (value: number) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  addPayment: (payment: Omit<HousePayment, 'id'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY = 'casa-em-dia-data';

const defaultState: AppState = {
  houseTotalValue: 0,
  users: [],
  expenses: [],
  payments: []
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved data', e);
      }
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const resetData = () => {
    if (window.confirm('Tem certeza que deseja zerar todos os lançamentos e irmãos? Esta ação não pode ser desfeita.')) {
      setData(defaultState);
    }
  };

  const addUser = (name: string) => {
    const newUser = {
      id: `u${Date.now()}`,
      name,
      role: 'Membro' as const
    };
    setData({
      ...data,
      users: [...data.users, newUser]
    });
  };

  const setHouseTotalValue = (value: number) => {
    setData({
      ...data,
      houseTotalValue: value
    });
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = {
      ...expense,
      id: `e${Date.now()}`
    };
    setData({
      ...data,
      expenses: [...data.expenses, newExpense]
    });
  };

  const addPayment = (payment: Omit<HousePayment, 'id'>) => {
    const newPayment = {
      ...payment,
      id: `p${Date.now()}`
    };
    setData({
      ...data,
      payments: [...data.payments, newPayment]
    });
  };

  return (
    <DataContext.Provider value={{ data, resetData, addUser, setHouseTotalValue, addExpense, addPayment }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
