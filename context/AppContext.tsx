import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, Campaign, Post, ViewState } from '../types';

interface AppContextType {
  campaigns: Campaign[];
  posts: Record<string, Post[]>;
  selectedCampaign: Campaign | null;
  view: ViewState;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (campaign: Campaign) => void;
  deleteCampaign: (id: string) => void;
  setSelectedCampaign: (campaign: Campaign | null) => void;
  setView: (view: ViewState) => void;
  savePosts: (campaignId: string, newPosts: Post[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Mock Data
const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    companyName: 'EcoSip',
    niche: 'Sustainable Beverages',
    services: 'Organic Coffee, Reusable Cups',
    targetAudience: 'Eco-conscious millennials, Coffee lovers',
    brandVoice: 'Friendly, Earthy, Inspiring',
    createdAt: Date.now()
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem('socialai_campaigns');
    return saved ? JSON.parse(saved) : MOCK_CAMPAIGNS;
  });

  const [posts, setPosts] = useState<Record<string, Post[]>>(() => {
    const saved = localStorage.getItem('socialai_posts');
    return saved ? JSON.parse(saved) : {};
  });

  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [view, setView] = useState<ViewState>('dashboard');

  useEffect(() => {
    localStorage.setItem('socialai_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('socialai_posts', JSON.stringify(posts));
  }, [posts]);

  const addCampaign = (campaign: Campaign) => {
    setCampaigns(prev => [...prev, campaign]);
  };

  const updateCampaign = (updated: Campaign) => {
    setCampaigns(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const deleteCampaign = (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
    if (selectedCampaign?.id === id) {
      setSelectedCampaign(null);
      setView('dashboard');
    }
  };

  const savePosts = (campaignId: string, newPosts: Post[]) => {
    setPosts(prev => ({
      ...prev,
      [campaignId]: [...(prev[campaignId] || []), ...newPosts]
    }));
  };

  return (
    <AppContext.Provider value={{
      campaigns,
      posts,
      selectedCampaign,
      view,
      addCampaign,
      updateCampaign,
      deleteCampaign,
      setSelectedCampaign,
      setView,
      savePosts
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};