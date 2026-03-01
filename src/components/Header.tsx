import { Bell, Menu, Search } from 'lucide-react';

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent w-64"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="w-8 h-8 bg-[#1E3A8A] rounded-full flex items-center justify-center text-white font-medium text-sm">
            L
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900">Lucas</p>
            <p className="text-xs text-gray-500">Administrador</p>
          </div>
        </div>
      </div>
    </header>
  );
}
