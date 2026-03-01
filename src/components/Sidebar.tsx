import { Home, Receipt, HomeIcon, Users, PieChart, Settings, LogOut, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useData } from '@/context/DataContext';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'expenses', label: 'Gastos da Reforma', icon: Receipt },
  { id: 'payments', label: 'Pagamentos da Casa', icon: HomeIcon },
  { id: 'summary', label: 'Resumo Individual', icon: Users },
  { id: 'reports', label: 'Relatórios', icon: PieChart },
];

export function Sidebar({ 
  currentPage, 
  setCurrentPage, 
  isOpen, 
  setIsOpen 
}: { 
  currentPage: string, 
  setCurrentPage: (page: string) => void,
  isOpen?: boolean,
  setIsOpen?: (isOpen: boolean) => void
}) {
  const { resetData } = useData();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen?.(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-[#1E3A8A] text-white flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center">
              <HomeIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Casa em Dia</span>
          </div>
          <button 
            className="md:hidden p-2 text-blue-200 hover:text-white"
            onClick={() => setIsOpen?.(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-white/10 text-white" 
                  : "text-blue-100 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-[#10B981]" : "text-blue-200")} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-blue-800">
        <button 
          onClick={resetData}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
          Zerar Valores
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-blue-200 hover:bg-white/5 hover:text-white transition-colors mt-1">
          <Settings className="w-5 h-5" />
          Configurações
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-blue-200 hover:bg-white/5 hover:text-white transition-colors mt-1">
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </div>
    </aside>
    </>
  );
}
