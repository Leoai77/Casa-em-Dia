import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppState } from '../types';
import { mockData } from '../mockData';

interface DataContextType {
  data: AppState;
  resetData: () => void;
  addUser: (name: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppState>(mockData);

  const resetData = () => {
    if (window.confirm('Tem certeza que deseja zerar todos os lançamentos e irmãos? Esta ação não pode ser desfeita.')) {
      setData({
        ...data,
        expenses: [],
        payments: [],
        users: []
      });
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

  return (
    <DataContext.Provider value={{ data, resetData, addUser }}>
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
