import React from 'react';
import { useApp } from '../context/AppContext';
import { Campaign } from '../types';
import { Edit2, Trash2, Plus, ArrowRight, Zap, Play, Layers } from 'lucide-react';

interface DashboardProps {
  onCreateNew: () => void;
  onEdit: (c: Campaign) => void;
  onManage: (c: Campaign) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onCreateNew, onEdit, onManage }) => {
  const { campaigns, deleteCampaign } = useApp();

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      
      {/* Futuristic Hero Section - Compact Version */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl p-6 sm:p-10 text-center shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center space-x-2 px-2 py-0.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-4">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
            </span>
            <span>System Operational</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              Social Architecture
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 ml-2">
              Engine
            </span>
          </h1>
          
          <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed mb-6">
            Deploy advanced AI protocols to synthesize high-engagement content strategies across multiple dimensions.
          </p>
          
          <button
            onClick={onCreateNew}
            className="group relative inline-flex items-center justify-center px-6 py-2.5 bg-indigo-600 text-white rounded-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)]"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <Plus className="h-4 w-4 mr-2" />
            <span className="font-bold text-sm tracking-wide">Initialize New Protocol</span>
          </button>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div>
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Layers className="h-5 w-5 mr-3 text-slate-500" />
            Active Campaigns
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            {campaigns.length} / ∞
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {campaigns.map((campaign) => (
            <div 
              key={campaign.id} 
              className="group relative bg-slate-900/60 backdrop-blur-md rounded-xl border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col overflow-hidden"
            >
              {/* Card Header & Content */}
              <div className="p-5 flex-1 relative z-10">
                <div className="flex justify-between items-start mb-4">
                  {/* Logo Container */}
                  <div className="relative group-hover:scale-105 transition-transform duration-300">
                      {campaign.logo ? (
                          <div className="h-14 w-14 rounded-xl bg-slate-950 p-2 border border-slate-700 shadow-inner flex items-center justify-center overflow-hidden">
                              <img src={campaign.logo} alt="Brand Logo" className="w-full h-full object-contain" />
                          </div>
                      ) : (
                          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white font-bold text-xl shadow-lg border border-white/10">
                              {campaign.companyName.substring(0, 1).toUpperCase()}
                          </div>
                      )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                    <button 
                      onClick={() => onEdit(campaign)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                      title="Edit Settings"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if(confirm('Terminate this protocol?')) deleteCampaign(campaign.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Terminate"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-1 truncate pr-4">{campaign.companyName}</h3>
                <p className="text-xs font-medium text-indigo-400 mb-4">{campaign.niche}</p>
                
                <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800/50">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Target Audience</div>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {campaign.targetAudience}
                  </p>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-3 border-t border-slate-800/50 bg-slate-950/30">
                <button
                  onClick={() => onManage(campaign)}
                  className="w-full flex items-center justify-between px-3 py-2 bg-slate-800/50 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 rounded-lg text-xs font-semibold text-white transition-all group-hover:shadow-lg"
                >
                  <span className="flex items-center">
                    <Zap className="h-3.5 w-3.5 mr-2 text-indigo-400 group-hover:text-white" />
                    Access Generator
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}

          {/* Empty State Card */}
          {campaigns.length === 0 && (
            <div className="col-span-full border border-dashed border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-slate-900/20">
              <div className="h-12 w-12 bg-slate-800 rounded-full flex items-center justify-center mb-3">
                <Play className="h-5 w-5 text-slate-500 ml-0.5" />
              </div>
              <h3 className="text-base font-medium text-white">No Active Protocols</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4 max-w-xs">Initialize a new campaign to begin the content generation process.</p>
              <button
                onClick={onCreateNew}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center"
              >
                Start Protocol <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};