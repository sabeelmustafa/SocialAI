import React from 'react';
import { useApp } from '../context/AppContext';
import { Campaign } from '../types';
import { Edit2, Calendar, Trash2, Plus, ArrowRight, LayoutDashboard, Zap, TrendingUp, Users, Eye, MousePointer } from 'lucide-react';

interface DashboardProps {
  onCreateNew: () => void;
  onEdit: (c: Campaign) => void;
  onManage: (c: Campaign) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onCreateNew, onEdit, onManage }) => {
  const { campaigns, deleteCampaign } = useApp();

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      
      {/* Analytics Overview (Mock Data) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                    <TrendingUp className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">+12.5%</span>
            </div>
            <div>
                <h4 className="text-2xl font-bold text-white">24.5k</h4>
                <p className="text-xs text-slate-500 mt-1">Total Impressions</p>
            </div>
        </div>
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                    <Users className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">+5.2%</span>
            </div>
            <div>
                <h4 className="text-2xl font-bold text-white">8,102</h4>
                <p className="text-xs text-slate-500 mt-1">Follower Growth</p>
            </div>
        </div>
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                    <Eye className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">+24%</span>
            </div>
            <div>
                <h4 className="text-2xl font-bold text-white">145k</h4>
                <p className="text-xs text-slate-500 mt-1">Content Reach</p>
            </div>
        </div>
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400">
                    <MousePointer className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded">-1.2%</span>
            </div>
            <div>
                <h4 className="text-2xl font-bold text-white">4.2%</h4>
                <p className="text-xs text-slate-500 mt-1">Click Through Rate</p>
            </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-slate-800 pt-8">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Active Campaigns</h2>
          <p className="text-slate-400 mt-1">Manage and deploy your social strategies.</p>
        </div>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 font-semibold text-sm"
        >
          <Plus className="h-5 w-5 mr-2" />
          Initialize Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {campaigns.map((campaign) => (
          <div 
            key={campaign.id} 
            className="group bg-slate-900 rounded-2xl border border-slate-800 hover:border-indigo-500/50 shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden"
          >
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

            <div className="p-8 flex-1 relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="relative">
                    {campaign.logo ? (
                        <div className="h-14 w-14 rounded-xl bg-slate-950 p-2 border border-slate-700 shadow-inner flex items-center justify-center overflow-hidden">
                            <img src={campaign.logo} alt="Brand Logo" className="w-full h-full object-contain" />
                        </div>
                    ) : (
                        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            {campaign.companyName.substring(0, 1).toUpperCase()}
                        </div>
                    )}
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onEdit(campaign)}
                    className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Edit Settings"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={(e) => {
                      if(confirm('Are you sure you want to delete this campaign?')) {
                        deleteCampaign(campaign.id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 truncate">{campaign.companyName}</h3>
              <p className="text-sm text-slate-400 mb-6 line-clamp-2 min-h-[2.5rem]">{campaign.niche}</p>
              
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-600 uppercase tracking-widest">Target Protocol</div>
                <p className="text-sm text-slate-300 line-clamp-2 bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
                  {campaign.targetAudience}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/30 rounded-b-2xl relative z-10">
              <button
                onClick={() => onManage(campaign)}
                className="w-full flex items-center justify-center px-4 py-3 border border-slate-700 text-sm font-semibold rounded-xl text-indigo-400 hover:bg-indigo-600 hover:text-white hover:border-transparent transition-all duration-300 group-hover:shadow-lg group-hover:shadow-indigo-500/20"
              >
                <Zap className="h-4 w-4 mr-2" />
                Deploy Content Strategy
                <ArrowRight className="h-4 w-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </button>
            </div>
          </div>
        ))}

        {campaigns.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-24 px-4 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
            <div className="h-20 w-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <LayoutDashboard className="h-10 w-10 text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-white">System Idle</h3>
            <p className="text-slate-500 mt-2 mb-8 text-center max-w-sm">
              No active marketing protocols found. Initialize a new campaign to begin content generation.
            </p>
            <button
              onClick={onCreateNew}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 text-sm font-bold transition-all"
            >
              <Plus className="h-5 w-5 mr-2" />
              Initialize First Campaign
            </button>
          </div>
        )}
      </div>
    </div>
  );
};