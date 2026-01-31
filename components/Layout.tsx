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
  LogOut
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
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 h-20 border-b border-slate-800">
            <div className="flex items-center space-x-3 text-indigo-500">
              <div className="bg-indigo-500/20 p-2 rounded-lg">
                <Zap className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">SocialAI</span>
            </div>
            <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-white">
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
            <button
              onClick={() => handleNav('dashboard')}
              className={`flex items-center w-full px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 group ${
                view === 'dashboard' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <LayoutDashboard className={`mr-3 h-5 w-5 ${view === 'dashboard' ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
              Dashboard
            </button>
            
            <button
              onClick={() => handleNav('new-campaign')}
              className={`flex items-center w-full px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 group ${
                view === 'new-campaign' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <PlusCircle className={`mr-3 h-5 w-5 ${view === 'new-campaign' ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
              New Campaign
            </button>

             <div className="pt-10">
               <p className="px-4 text-xs font-bold text-slate-600 uppercase tracking-wider mb-4">
                 AI Modules
               </p>
               <button
                onClick={() => setChatOpen(true)}
                className="flex items-center w-full px-4 py-3.5 text-sm font-medium text-slate-400 rounded-xl hover:bg-slate-800 hover:text-white transition-all duration-200 group"
              >
                <MessageSquare className="mr-3 h-5 w-5 text-purple-500 group-hover:text-purple-400" />
                Expert Consultant
              </button>
             </div>
          </nav>

          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center w-full px-4 py-3 text-sm text-slate-500 rounded-xl hover:bg-slate-800 hover:text-white cursor-pointer transition-colors">
              <LogOut className="mr-3 h-5 w-5" />
              <span>Sign Out</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-950 relative">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-900/10 to-transparent pointer-events-none"></div>

        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-4 h-16 bg-slate-900 border-b border-slate-800 relative z-10">
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

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative z-10">
          {children}
        </main>
      </div>

      {/* Consultant Chat Sidepanel */}
      <ConsultantChat isOpen={isChatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};