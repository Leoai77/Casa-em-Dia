import { useData } from '@/context/DataContext';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line 
} from 'recharts';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';

const COLORS = ['#1E3A8A', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export function Reports() {
  const { data } = useData();
  const { expenses, users, payments } = data;

  // Data for Expenses by Category
  const expensesByCategory = expenses.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, [] as { name: string, value: number }[]);

  // Data for Contribution by User
  const contributionByUser = users.map(user => {
    const userPayments = payments.filter(p => p.paidBy === user.id && p.status === 'Pago').reduce((acc, curr) => acc + curr.amount, 0);
    const userExpenses = expenses.filter(e => e.paidBy === user.id).reduce((acc, curr) => acc + curr.amount, 0);
    return {
      name: user.name,
      'Pagamentos': userPayments,
      'Reforma': userExpenses,
    };
  });

  // Data for Monthly Evolution (Mocked for simplicity)
  const monthlyEvolution = [
    { name: 'Set', gastos: 2800, pagamentos: 100000 },
    { name: 'Out', gastos: 10300, pagamentos: 3500 },
    { name: 'Nov', gastos: 4200, pagamentos: 3500 },
    { name: 'Dez', gastos: 0, pagamentos: 0 },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Relatórios</h1>
          <p className="text-sm text-gray-500 mt-1">Visualize gráficos e exporte os dados financeiros.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-red-500" />
            Exportar PDF
          </button>
          <button className="bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-green-600" />
            Exportar Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Gastos por Categoria */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Gastos por Categoria</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Contribuição por Irmão */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Contribuição por Irmão</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={contributionByUser}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(value) => `R$ ${value / 1000}k`} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} cursor={{fill: 'transparent'}} />
                <Legend />
                <Bar dataKey="Pagamentos" stackId="a" fill="#1E3A8A" radius={[0, 0, 4, 4]} />
                <Bar dataKey="Reforma" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Evolução Mensal */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Evolução Mensal</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyEvolution}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(value) => `R$ ${value / 1000}k`} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="gastos" name="Gastos da Reforma" stroke="#EF4444" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="pagamentos" name="Pagamentos da Casa" stroke="#1E3A8A" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
