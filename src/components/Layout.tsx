import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout({ children, currentPage, setCurrentPage }: { children: ReactNode, currentPage: string, setCurrentPage: (page: string) => void }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={(page) => {
          setCurrentPage(page);
          setIsMobileMenuOpen(false);
        }} 
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
