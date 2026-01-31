import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { CampaignForm } from './components/CampaignForm';
import { PostPlanner } from './components/PostPlanner';
import { AppProvider, useApp } from './context/AppContext';
import { Campaign } from './types';

// Main content switcher
const AppContent: React.FC = () => {
  const { view, setView, selectedCampaign, setSelectedCampaign } = useApp();

  const handleEditCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setView('edit-campaign');
  };

  const handleManageCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setView('planner');
  };

  const handleCreateNew = () => {
    setSelectedCampaign(null);
    setView('new-campaign');
  };

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return (
          <Dashboard 
            onCreateNew={handleCreateNew} 
            onEdit={handleEditCampaign}
            onManage={handleManageCampaign}
          />
        );
      case 'new-campaign':
      case 'edit-campaign':
        return <CampaignForm isEditing={view === 'edit-campaign'} />;
      case 'planner':
        return <PostPlanner />;
      default:
        return <Dashboard onCreateNew={handleCreateNew} onEdit={handleEditCampaign} onManage={handleManageCampaign} />;
    }
  };

  return (
    <Layout>
      {renderView()}
    </Layout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}