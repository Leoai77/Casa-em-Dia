import React from 'react';
import { useData } from '@/context/DataContext';
import { Home, DollarSign, TrendingUp, Users, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export function Dashboard() {
  const { data, addUser } = useData();
  const { houseTotalValue, payments, expenses, users } = data;

  const totalPaid = payments.filter(p => p.status === 'Pago').reduce((acc, curr) => acc + curr.amount, 0);
  const remainingBalance = houseTotalValue - totalPaid;
  const totalRenovation = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleAddUser = () => {
    const name = window.prompt('Nome do novo irmão:');
    if (name && name.trim() !== '') {
      addUser(name.trim());
    }
  };

  const monthlyData = [
    { name: 'Set', total: 102800 },
    { name: 'Out', total: 13800 },
    { name: 'Nov', total: 7700 },
    { name: 'Dez', total: 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <button className="bg-[#1E3A8A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors shadow-sm">
          Novo Lançamento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card 
          title="Valor Total da Casa" 
          value={formatCurrency(houseTotalValue)} 
          icon={<Home className="w-5 h-5 text-blue-600" />} 
          trend="+0%" 
        />
        <Card 
          title="Total Já Pago" 
          value={formatCurrency(totalPaid)} 
          icon={<DollarSign className="w-5 h-5 text-green-600" />} 
          trend={`+${((totalPaid / houseTotalValue) * 100).toFixed(1)}%`} 
          trendUp={true}
        />
        <Card 
          title="Saldo Restante" 
          value={formatCurrency(remainingBalance)} 
          icon={<TrendingUp className="w-5 h-5 text-red-600" />} 
          trend={`-${((remainingBalance / houseTotalValue) * 100).toFixed(1)}%`} 
          trendUp={false}
        />
        <Card 
          title="Gasto na Reforma" 
          value={formatCurrency(totalRenovation)} 
          icon={<Users className="w-5 h-5 text-purple-600" />} 
          trend="+12% este mês" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Evolução de Gastos</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6B7280'}} />
                <YAxis tickFormatter={(value) => `R$ ${value / 1000}k`} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6B7280'}} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Area type="monotone" dataKey="total" stroke="#1E3A8A" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Resumo por Irmão</h2>
            <button 
              onClick={handleAddUser}
              className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
              title="Adicionar irmão"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {users.map(user => {
              const userPayments = payments.filter(p => p.paidBy === user.id && p.status === 'Pago').reduce((acc, curr) => acc + curr.amount, 0);
              const userExpenses = expenses.filter(e => e.paidBy === user.id).reduce((acc, curr) => acc + curr.amount, 0);
              const totalContribution = userPayments + userExpenses;

              return (
                <div key={user.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{formatCurrency(totalContribution)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {(totalPaid + totalRenovation) > 0 ? ((totalContribution / (totalPaid + totalRenovation)) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, icon, trend, trendUp }: { title: string, value: string, icon: React.ReactNode, trend: string, trendUp?: boolean }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="p-2 bg-gray-50 rounded-lg">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <div className="flex items-center gap-1 mt-2">
          {trendUp !== undefined && (
            trendUp ? <ArrowUpRight className="w-4 h-4 text-green-500" /> : <ArrowDownRight className="w-4 h-4 text-red-500" />
          )}
          <p className={`text-xs font-medium ${trendUp === true ? 'text-green-600' : trendUp === false ? 'text-red-600' : 'text-gray-500'}`}>
            {trend}
          </p>
        </div>
      </div>
    </div>
  );
}
