import { useData } from '@/context/DataContext';
import { ArrowRightLeft, Wallet, TrendingUp, Plus } from 'lucide-react';

export function IndividualSummary() {
  const { data, addUser } = useData();
  const { users, payments, expenses } = data;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleAddUser = () => {
    const name = window.prompt('Nome do novo irmão:');
    if (name && name.trim() !== '') {
      addUser(name.trim());
    }
  };

  // Calculate totals
  const totalPaid = payments.filter(p => p.status === 'Pago').reduce((acc, curr) => acc + curr.amount, 0);
  const totalRenovation = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const grandTotal = totalPaid + totalRenovation;

  // Calculate per user
  const userStats = users.map(user => {
    const userPayments = payments.filter(p => p.paidBy === user.id && p.status === 'Pago').reduce((acc, curr) => acc + curr.amount, 0);
    const userExpenses = expenses.filter(e => e.paidBy === user.id).reduce((acc, curr) => acc + curr.amount, 0);
    const totalContribution = userPayments + userExpenses;
    const percentage = grandTotal > 0 ? (totalContribution / grandTotal) * 100 : 0;
    const expectedContribution = users.length > 0 ? grandTotal / users.length : 0;
    const balance = totalContribution - expectedContribution;

    return {
      ...user,
      userPayments,
      userExpenses,
      totalContribution,
      percentage,
      expectedContribution,
      balance
    };
  });

  // Calculate settlements
  const debtors = userStats.filter(u => u.balance < -0.01).map(u => ({ ...u, amount: Math.abs(u.balance) })).sort((a, b) => b.amount - a.amount);
  const creditors = userStats.filter(u => u.balance > 0.01).map(u => ({ ...u, amount: u.balance })).sort((a, b) => b.amount - a.amount);
  
  const transactions = [];
  let i = 0;
  let j = 0;
  
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    
    const amount = Math.min(debtor.amount, creditor.amount);
    
    transactions.push({
      from: debtor,
      to: creditor,
      amount
    });
    
    debtor.amount -= amount;
    creditor.amount -= amount;
    
    if (debtor.amount < 0.01) i++;
    if (creditor.amount < 0.01) j++;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Resumo Individual</h1>
          <p className="text-sm text-gray-500 mt-1">Acompanhe a contribuição de cada irmão e o saldo de acertos.</p>
        </div>
        <button 
          onClick={handleAddUser}
          className="flex items-center gap-2 bg-[#1E3A8A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Adicionar Irmão
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userStats.map(stat => (
          <div key={stat.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 opacity-50"></div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white text-xl font-bold shadow-sm">
                  {stat.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{stat.name}</h2>
                  <p className="text-sm font-medium text-gray-500">{stat.role}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-[#1E3A8A]">{stat.percentage.toFixed(1)}%</p>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Participação</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2 text-gray-600">
                  <Wallet className="w-4 h-4" />
                  <span className="text-sm font-medium">Total Contribuído</span>
                </div>
                <span className="font-bold text-gray-900">{formatCurrency(stat.totalContribution)}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border border-gray-100 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Pagamentos da Casa</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(stat.userPayments)}</p>
                </div>
                <div className="p-3 border border-gray-100 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Gastos da Reforma</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(stat.userExpenses)}</p>
                </div>
              </div>

              <div className={`mt-4 p-4 rounded-lg border flex items-start gap-3 ${
                stat.balance > 0.01 
                  ? 'bg-green-50 border-green-100 text-green-800' 
                  : stat.balance < -0.01 
                    ? 'bg-red-50 border-red-100 text-red-800' 
                    : 'bg-gray-50 border-gray-100 text-gray-800'
              }`}>
                <TrendingUp className={`w-5 h-5 mt-0.5 ${stat.balance < -0.01 ? 'rotate-180' : ''}`} />
                <div>
                  <p className="text-sm font-bold">
                    {stat.balance > 0.01 ? 'Tem a receber' : stat.balance < -0.01 ? 'Precisa compensar' : 'Tudo certo'}
                  </p>
                  <p className="text-lg font-black mt-1">{formatCurrency(Math.abs(stat.balance))}</p>
                  <p className="text-xs mt-1 opacity-80">
                    Baseado na divisão igualitária ({users.length > 0 ? (100 / users.length).toFixed(1) : 0}% para cada)
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5 text-blue-600" />
          Sugestão de Acerto
        </h2>
        {transactions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transactions.map((t, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold">
                    {t.from.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t.from.name}</p>
                    <p className="text-xs text-gray-500">Paga</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center px-4">
                  <div className="px-3 py-1 bg-white border border-gray-300 rounded-lg font-bold text-sm text-gray-900">
                    {formatCurrency(t.amount)}
                  </div>
                  <ArrowRightLeft className="w-4 h-4 text-gray-400 mt-1" />
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t.to.name}</p>
                    <p className="text-xs text-gray-500">Recebe</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                    {t.to.name.charAt(0)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 text-gray-500">
            As contas estão perfeitamente equilibradas! 🎉
          </div>
        )}
      </div>
    </div>
  );
}
