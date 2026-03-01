import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Plus, Filter, Search, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function Expenses() {
  const { data } = useData();
  const { expenses, users } = data;
  const [searchTerm, setSearchTerm] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getUserName = (id: string) => users.find(u => u.id === id)?.name || 'Desconhecido';

  const filteredExpenses = expenses.filter(expense => 
    expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gastos da Reforma</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie todos os custos com a obra e mobília.</p>
        </div>
        <button className="bg-[#1E3A8A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors shadow-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Gasto
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar gastos..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 w-full sm:w-auto justify-center">
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Descrição</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Responsável</th>
                <th className="px-6 py-4 text-right">Valor</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{expense.description}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {format(new Date(expense.date), "dd 'de' MMM, yyyy", { locale: ptBR })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                        {getUserName(expense.paidBy).charAt(0)}
                      </div>
                      <span className="text-gray-700">{getUserName(expense.paidBy)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <p>Mostrando {filteredExpenses.length} de {expenses.length} resultados</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50">Anterior</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50">Próxima</button>
          </div>
        </div>
      </div>
    </div>
  );
}
