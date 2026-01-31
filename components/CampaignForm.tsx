import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Campaign } from '../types';
import { Save, ArrowLeft, Upload, Image as ImageIcon, X } from 'lucide-react';

interface CampaignFormProps {
  isEditing?: boolean;
}

export const CampaignForm: React.FC<CampaignFormProps> = ({ isEditing = false }) => {
  const { addCampaign, updateCampaign, selectedCampaign, setView } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<Omit<Campaign, 'id' | 'createdAt'>>({
    companyName: '',
    niche: '',
    services: '',
    targetAudience: '',
    brandVoice: '',
    logo: ''
  });

  useEffect(() => {
    if (isEditing && selectedCampaign) {
      setFormData({
        companyName: selectedCampaign.companyName,
        niche: selectedCampaign.niche,
        services: selectedCampaign.services,
        targetAudience: selectedCampaign.targetAudience,
        brandVoice: selectedCampaign.brandVoice,
        logo: selectedCampaign.logo || ''
      });
    }
  }, [isEditing, selectedCampaign]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && selectedCampaign) {
      updateCampaign({
        ...selectedCampaign,
        ...formData
      });
    } else {
      addCampaign({
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        ...formData
      });
    }
    setView('dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8 flex items-center space-x-4">
        <button 
          onClick={() => setView('dashboard')}
          className="p-3 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white hover:border-indigo-500/50 transition-all shadow-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter">
            {isEditing ? 'Configure Protocol' : 'Initialize Protocol'}
          </h1>
          <p className="text-slate-400 mt-1 font-medium">
            Define neural parameters for brand identity synthesis.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-6 relative z-10">
          
          {/* Logo Section */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Visual Anchor</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative flex flex-col items-center justify-center w-full aspect-square rounded-2xl border-2 border-dashed transition-all cursor-pointer group overflow-hidden
                ${formData.logo 
                  ? 'border-indigo-500/50 bg-slate-950 shadow-[0_0_20px_-5px_rgba(99,102,241,0.2)]' 
                  : 'border-slate-800 bg-slate-950/50 hover:border-indigo-500/50 hover:bg-slate-900'
                }
              `}
            >
              {formData.logo ? (
                <>
                  <img src={formData.logo} alt="Logo" className="w-full h-full object-contain p-6" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                    <p className="text-white text-sm font-bold">Replace Asset</p>
                  </div>
                </>
              ) : (
                <div className="text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mx-auto mb-3 border border-slate-800 group-hover:border-indigo-500/50 transition-colors">
                    <Upload className="h-6 w-6 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Upload Brand Mark</p>
                  <p className="text-[10px] text-slate-600 mt-1">PNG, JPG (Max 2MB)</p>
                </div>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleLogoUpload}
              />
            </div>
            {formData.logo && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFormData(prev => ({ ...prev, logo: '' }));
                }}
                className="mt-3 text-xs text-red-400 hover:text-red-300 flex items-center justify-center w-full font-medium"
              >
                <X className="h-3 w-3 mr-1" /> Remove Asset
              </button>
            )}
          </div>

          {/* Text Fields */}
          <div className="md:col-span-4 space-y-6">
            <div>
              <label htmlFor="companyName" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Entity Name</label>
              <input
                type="text"
                name="companyName"
                id="companyName"
                required
                className="block w-full rounded-xl border border-slate-700 bg-slate-950/50 py-3.5 px-4 text-white shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-slate-600 sm:text-sm"
                placeholder="Enter brand identity..."
                value={formData.companyName}
                onChange={e => setFormData({...formData, companyName: e.target.value})}
              />
            </div>

            <div>
              <label htmlFor="niche" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Sector / Niche</label>
              <input
                type="text"
                name="niche"
                id="niche"
                required
                className="block w-full rounded-xl border border-slate-700 bg-slate-950/50 py-3.5 px-4 text-white shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-slate-600 sm:text-sm"
                placeholder="e.g. Fintech, Organic Food, Gaming"
                value={formData.niche}
                onChange={e => setFormData({...formData, niche: e.target.value})}
              />
            </div>

            <div>
              <label htmlFor="brandVoice" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Voice Tone</label>
              <input
                type="text"
                name="brandVoice"
                id="brandVoice"
                required
                className="block w-full rounded-xl border border-slate-700 bg-slate-950/50 py-3.5 px-4 text-white shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-slate-600 sm:text-sm"
                placeholder="e.g. Authoritative, Playful, Cyberpunk"
                value={formData.brandVoice}
                onChange={e => setFormData({...formData, brandVoice: e.target.value})}
              />
            </div>
          </div>

          <div className="md:col-span-6">
            <label htmlFor="services" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Core Offerings</label>
            <textarea
              name="services"
              id="services"
              rows={3}
              required
              className="block w-full rounded-xl border border-slate-700 bg-slate-950/50 py-3.5 px-4 text-white shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-slate-600 sm:text-sm resize-none"
              placeholder="List main products or services..."
              value={formData.services}
              onChange={e => setFormData({...formData, services: e.target.value})}
            />
          </div>

          <div className="md:col-span-6">
            <label htmlFor="targetAudience" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Target Demographics</label>
            <textarea
              name="targetAudience"
              id="targetAudience"
              rows={2}
              required
              className="block w-full rounded-xl border border-slate-700 bg-slate-950/50 py-3.5 px-4 text-white shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-slate-600 sm:text-sm resize-none"
              placeholder="Describe ideal customer persona..."
              value={formData.targetAudience}
              onChange={e => setFormData({...formData, targetAudience: e.target.value})}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-x-6 pt-8 mt-4 border-t border-slate-800">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-slate-400 hover:text-white transition-colors"
            onClick={() => setView('dashboard')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_-5px_rgba(79,70,229,0.3)] hover:bg-indigo-500 hover:shadow-[0_0_25px_-5px_rgba(79,70,229,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300 hover:scale-[1.02]"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};