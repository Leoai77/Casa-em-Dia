import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Plus, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function Payments() {
  const { data } = useData();
  const { payments, users, houseTotalValue } = data;
  const [filter, setFilter] = useState<'Todos' | 'Pago' | 'Pendente'>('Todos');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getUserName = (id: string) => users.find(u => u.id === id)?.name || 'Desconhecido';

  const filteredPayments = payments.filter(p => filter === 'Todos' || p.status === filter);

  const totalPaid = payments.filter(p => p.status === 'Pago').reduce((acc, curr) => acc + curr.amount, 0);
  const percentagePaid = houseTotalValue > 0 ? (totalPaid / houseTotalValue) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Pagamentos da Casa</h1>
          <p className="text-sm text-gray-500 mt-1">Acompanhe as parcelas e o progresso da quitação do imóvel.</p>
        </div>
        <button className="bg-[#1E3A8A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors shadow-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nova Parcela
        </button>
      </div>

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
