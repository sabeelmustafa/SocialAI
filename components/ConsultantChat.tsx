import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { consultMarketingExpert } from '../services/geminiService';
import { ChatMessage } from '../types';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';

interface ConsultantChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConsultantChat: React.FC<ConsultantChatProps> = ({ isOpen, onClose }) => {
  const { selectedCampaign } = useApp();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Hello! I\'m your AI Marketing Expert. How can I help you grow your brand today?',
      timestamp: Date.now()
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Prepare history for API context
      const history = messages.concat(userMsg).map(m => ({ role: m.role, text: m.text }));
      const responseText = await consultMarketingExpert(history, selectedCampaign);
      
      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-slate-900 border-l border-slate-800 shadow-2xl transform transition-transform duration-300 ease-in-out z-40 flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-500/20 p-2 rounded-lg">
             <Bot className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Marketing Brain</h3>
            <p className="text-xs text-emerald-400 flex items-center">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1.5 animate-pulse"></span>
                Online
            </p>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Info Context Bar */}
      {selectedCampaign ? (
        <div className="bg-slate-950 px-4 py-2 text-xs text-indigo-300 border-b border-slate-800/50 flex items-center">
          <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
          Context: <span className="font-bold ml-1">{selectedCampaign.companyName}</span>
        </div>
      ) : (
        <div className="bg-slate-950 px-4 py-2 text-xs text-slate-500 border-b border-slate-800/50">
          General Consultation Mode
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-950/50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`
              max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-lg
              ${msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
              }
            `}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
           <div className="flex justify-start">
             <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-none p-4 shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-900">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for strategy advice..."
            className="w-full pl-4 pr-12 py-3 bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-white placeholder:text-slate-600 transition-all"
          />
          <button 
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 top-2 p-1.5 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 disabled:opacity-50 disabled:bg-slate-800 disabled:text-slate-500 transition-all"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};