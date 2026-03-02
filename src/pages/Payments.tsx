import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Plus, CheckCircle2, Circle, AlertCircle, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function Payments() {
  const { data, addPayment } = useData();
  const { payments, users, houseTotalValue } = data;
  const [filter, setFilter] = useState<'Todos' | 'Pago' | 'Pendente'>('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newPayment, setNewPayment] = useState({
    installment: payments.length + 1,
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paidBy: users.length > 0 ? users[0].id : '',
    status: 'Pago' as 'Pago' | 'Pendente'
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getUserName = (id: string) => users.find(u => u.id === id)?.name || 'Desconhecido';

  const filteredPayments = payments.filter(p => filter === 'Todos' || p.status === filter);

  const totalPaid = payments.filter(p => p.status === 'Pago').reduce((acc, curr) => acc + curr.amount, 0);
  const percentagePaid = houseTotalValue > 0 ? (totalPaid / houseTotalValue) * 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayment.amount || !newPayment.paidBy) {
      alert('Preencha os campos obrigatórios (Valor e Responsável).');
      return;
    }
    
    addPayment({
      installment: Number(newPayment.installment),
      amount: Number(newPayment.amount),
      date: newPayment.date,
      paidBy: newPayment.paidBy,
      status: newPayment.status
    });
    
    setIsModalOpen(false);
    setNewPayment({
      installment: payments.length + 2,
      amount: '',
      date: new Date().toISOString().split('T')[0],
      paidBy: users.length > 0 ? users[0].id : '',
      status: 'Pago'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Pagamentos da Casa</h1>
          <p className="text-sm text-gray-500 mt-1">Acompanhe as parcelas e o progresso da quitação do imóvel.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#1E3A8A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nova Parcela
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Nova Parcela</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nº da Parcela</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={newPayment.installment}
                    onChange={e => setNewPayment({...newPayment, installment: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    step="0.01"
                    value={newPayment.amount}
                    onChange={e => setNewPayment({...newPayment, amount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento/Pagamento</label>
                <input 
                  type="date" 
                  required
                  value={newPayment.date}
                  onChange={e => setNewPayment({...newPayment, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
                <select 
                  required
                  value={newPayment.paidBy}
                  onChange={e => setNewPayment({...newPayment, paidBy: e.target.value})}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  value={newPayment.status}
                  onChange={e => setNewPayment({...newPayment, status: e.target.value as 'Pago' | 'Pendente'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pago">Pago</option>
                  <option value="Pendente">Pendente</option>
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Progresso do Pagamento</h2>
          <span className="text-2xl font-bold text-[#10B981]">{percentagePaid.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
          <div 
            className="bg-[#10B981] h-4 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${percentagePaid}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-3 text-sm font-medium text-gray-500">
          <span>{formatCurrency(totalPaid)} pagos</span>
          <span>{formatCurrency(houseTotalValue)} total</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-2">
          {['Todos', 'Pago', 'Pendente'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Parcela</th>
                <th className="px-6 py-4">Data de Vencimento</th>
                <th className="px-6 py-4">Responsável</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    Parcela {payment.installment}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {format(new Date(payment.date), "dd 'de' MMM, yyyy", { locale: ptBR })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                        {getUserName(payment.paidBy).charAt(0)}
                      </div>
                      <span className="text-gray-700">{getUserName(payment.paidBy)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {payment.status === 'Pago' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Pago
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                        <Circle className="w-3.5 h-3.5" />
                        Pendente
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">
                    {formatCurrency(payment.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
