import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ConsultantChat } from './ConsultantChat';
import { 
  LayoutDashboard, 
  PlusCircle, 
  MessageSquare, 
  Menu, 
  X,
  Zap,
  LogOut,
  Cpu
} from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setView, setSelectedCampaign, view } = useApp();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isChatOpen, setChatOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleNav = (target: 'dashboard' | 'new-campaign') => {
    if (target === 'dashboard') setSelectedCampaign(null);
    setView(target);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans text-slate-200">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-950/80 backdrop-blur-xl border-r border-slate-800/50 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className="flex items-center justify-between p-6 pt-8">
            <div className="flex items-center space-x-3 group cursor-default">
              <div className="relative">
                 <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                 <div className="relative bg-slate-900 border border-slate-700 p-2.5 rounded-xl text-indigo-500">
                    <Cpu className="h-6 w-6" />
                 </div>
              </div>
              <div>
                <span className="block text-lg font-bold tracking-tight text-white leading-none">SocialAI</span>
                <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">Manager v2.0</span>
              </div>
            </div>
            <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-white">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
            <div className="px-4 pb-2">
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Main Modules</p>
            </div>
            <button
              onClick={() => handleNav('dashboard')}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group border ${
                view === 'dashboard' 
                  ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300 shadow-[0_0_20px_-10px_rgba(99,102,241,0.5)]' 
                  : 'border-transparent text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <LayoutDashboard className={`mr-3 h-5 w-5 ${view === 'dashboard' ? 'text-indigo-400' : 'text-slate-500 group-hover:text-white'}`} />
              Dashboard
            </button>
            
            <button
              onClick={() => handleNav('new-campaign')}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group border ${
                view === 'new-campaign' 
                  ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300 shadow-[0_0_20px_-10px_rgba(99,102,241,0.5)]' 
                  : 'border-transparent text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <PlusCircle className={`mr-3 h-5 w-5 ${view === 'new-campaign' ? 'text-indigo-400' : 'text-slate-500 group-hover:text-white'}`} />
              Initialize Campaign
            </button>

             <div className="pt-8 px-4 pb-2">
               <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Neural Net</p>
             </div>
             <button
                onClick={() => setChatOpen(true)}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white border border-transparent hover:border-slate-800 transition-all duration-200 group"
              >
                <div className="relative mr-3">
                    <span className="absolute top-0 right-0 -mr-0.5 -mt-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-slate-950 animate-pulse"></span>
                    <MessageSquare className="h-5 w-5 text-slate-500 group-hover:text-purple-400 transition-colors" />
                </div>
                Marketing Consultant
              </button>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800/50">
            <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-500 rounded-xl hover:bg-slate-900 hover:text-red-400 transition-colors">
              <LogOut className="mr-3 h-5 w-5" />
              <span>Disconnect</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-4 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 relative z-30">
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="text-slate-400 hover:text-white focus:outline-none">
              <Menu className="h-6 w-6" />
            </button>
            <span className="ml-3 text-lg font-bold text-white">SocialAI</span>
          </div>
          <button onClick={() => setChatOpen(true)} className="text-indigo-500">
            <MessageSquare className="h-6 w-6" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 relative z-10 scrollbar-hide">
          {children}
        </main>
      </div>

      {/* Consultant Chat Sidepanel */}
      <ConsultantChat isOpen={isChatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};