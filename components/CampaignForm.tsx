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
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center space-x-4">
        <button 
          onClick={() => setView('dashboard')}
          className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {isEditing ? 'Edit Profile' : 'Initialize Campaign'}
          </h1>
          <p className="text-slate-400 mt-2">
            Configure the neural parameters for your brand identity.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl shadow-indigo-500/10 space-y-8 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-600 rounded-full blur-[100px] opacity-10 pointer-events-none"></div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-6">
          
          {/* Logo Section */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium leading-6 text-indigo-400 mb-2">Brand Logo / Visual Anchor</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative flex flex-col items-center justify-center w-full aspect-square rounded-xl border-2 border-dashed transition-all cursor-pointer group overflow-hidden
                ${formData.logo 
                  ? 'border-indigo-500 bg-slate-950' 
                  : 'border-slate-700 bg-slate-950 hover:border-indigo-500 hover:bg-slate-800'
                }
              `}
            >
              {formData.logo ? (
                <>
                  <img src={formData.logo} alt="Logo" className="w-full h-full object-contain p-4" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <p className="text-white text-sm font-medium">Change Logo</p>
                  </div>
                </>
              ) : (
                <div className="text-center p-4">
                  <Upload className="mx-auto h-10 w-10 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                  <p className="mt-2 text-xs text-slate-400">Upload PNG/JPG</p>
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
                className="mt-2 text-xs text-red-400 hover:text-red-300 flex items-center justify-center w-full"
              >
                <X className="h-3 w-3 mr-1" /> Remove Logo
              </button>
            )}
          </div>

          {/* Text Fields */}
          <div className="md:col-span-4 space-y-6">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium leading-6 text-indigo-400">Company Name</label>
              <div className="mt-2">
                <input
                  type="text"
                  name="companyName"
                  id="companyName"
                  required
                  className="block w-full rounded-lg border-0 bg-slate-800 py-3 px-4 text-white shadow-sm ring-1 ring-inset ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all placeholder:text-slate-500"
                  placeholder="Enter brand name"
                  value={formData.companyName}
                  onChange={e => setFormData({...formData, companyName: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label htmlFor="niche" className="block text-sm font-medium leading-6 text-indigo-400">Industry / Niche</label>
              <div className="mt-2">
                <input
                  type="text"
                  name="niche"
                  id="niche"
                  required
                  className="block w-full rounded-lg border-0 bg-slate-800 py-3 px-4 text-white shadow-sm ring-1 ring-inset ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all placeholder:text-slate-500"
                  placeholder="e.g. Fintech, Organic Food, Gaming"
                  value={formData.niche}
                  onChange={e => setFormData({...formData, niche: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label htmlFor="brandVoice" className="block text-sm font-medium leading-6 text-indigo-400">Brand Voice</label>
              <div className="mt-2">
                <input
                  type="text"
                  name="brandVoice"
                  id="brandVoice"
                  required
                  className="block w-full rounded-lg border-0 bg-slate-800 py-3 px-4 text-white shadow-sm ring-1 ring-inset ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all placeholder:text-slate-500"
                  placeholder="e.g. Authoritative, Playful, Cyberpunk"
                  value={formData.brandVoice}
                  onChange={e => setFormData({...formData, brandVoice: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-6">
            <label htmlFor="services" className="block text-sm font-medium leading-6 text-indigo-400">Key Products or Services</label>
            <div className="mt-2">
              <textarea
                name="services"
                id="services"
                rows={3}
                required
                className="block w-full rounded-lg border-0 bg-slate-800 py-3 px-4 text-white shadow-sm ring-1 ring-inset ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all placeholder:text-slate-500 resize-none"
                placeholder="List your main offerings..."
                value={formData.services}
                onChange={e => setFormData({...formData, services: e.target.value})}
              />
            </div>
          </div>

          <div className="md:col-span-6">
            <label htmlFor="targetAudience" className="block text-sm font-medium leading-6 text-indigo-400">Target Audience</label>
            <div className="mt-2">
              <textarea
                name="targetAudience"
                id="targetAudience"
                rows={2}
                required
                className="block w-full rounded-lg border-0 bg-slate-800 py-3 px-4 text-white shadow-sm ring-1 ring-inset ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all placeholder:text-slate-500 resize-none"
                placeholder="Describe your ideal customer persona..."
                value={formData.targetAudience}
                onChange={e => setFormData({...formData, targetAudience: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-x-6 pt-6 border-t border-slate-800">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-slate-400 hover:text-white transition-colors"
            onClick={() => setView('dashboard')}
          >
            Discard
          </button>
          <button
            type="submit"
            className="inline-flex items-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 hover:shadow-indigo-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};