import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
          <div className="max-w-[1600px] mx-auto p-6 md:p-8 space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppShell;
