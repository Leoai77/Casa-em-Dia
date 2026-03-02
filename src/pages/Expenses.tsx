import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Plus, Filter, Search, MoreVertical, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ExpenseCategory } from '@/types';

export function Expenses() {
  const { data, addExpense } = useData();
  const { expenses, users } = data;
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Material de Construção' as ExpenseCategory,
    paidBy: users.length > 0 ? users[0].id : '',
    paymentMethod: 'Pix'
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getUserName = (id: string) => users.find(u => u.id === id)?.name || 'Desconhecido';

  const filteredExpenses = expenses.filter(expense => 
    expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.amount || !newExpense.paidBy) {
      alert('Preencha os campos obrigatórios (Descrição, Valor e Responsável).');
      return;
    }
    
    addExpense({
      description: newExpense.description,
      amount: Number(newExpense.amount),
      date: newExpense.date,
      category: newExpense.category,
      paidBy: newExpense.paidBy,
      paymentMethod: newExpense.paymentMethod
    });
    
    setIsModalOpen(false);
    setNewExpense({
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      category: 'Material de Construção',
      paidBy: users.length > 0 ? users[0].id : '',
      paymentMethod: 'Pix'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gastos da Reforma</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie todos os custos com a obra e mobília.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#1E3A8A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Gasto
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
              <h2 className="text-lg font-semibold text-gray-900">Novo Gasto</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <input 
                  type="text" 
                  required
                  value={newExpense.description}
                  onChange={e => setNewExpense({...newExpense, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Cimento e Areia"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    step="0.01"
                    value={newExpense.amount}
                    onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                  <input 
                    type="date" 
                    required
                    value={newExpense.date}
                    onChange={e => setNewExpense({...newExpense, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select 
                  value={newExpense.category}
                  onChange={e => setNewExpense({...newExpense, category: e.target.value as ExpenseCategory})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Material de Construção">Material de Construção</option>
                  <option value="Mão de Obra">Mão de Obra</option>
                  <option value="Documentação">Documentação</option>
                  <option value="Mobília">Mobília</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsável (Quem pagou)</label>
                <select 
                  required
                  value={newExpense.paidBy}
                  onChange={e => setNewExpense({...newExpense, paidBy: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>Selecione um irmão</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
                {users.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">Adicione irmãos no Dashboard primeiro.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento</label>
                <select 
                  value={newExpense.paymentMethod}
                  onChange={e => setNewExpense({...newExpense, paymentMethod: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pix">Pix</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Transferência">Transferência</option>
                  <option value="Boleto">Boleto</option>
                  <option value="Dinheiro">Dinheiro</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={users.length === 0}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
