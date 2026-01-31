export interface Campaign {
  id: string;
  companyName: string;
  niche: string;
  services: string;
  targetAudience: string;
  brandVoice: string;
  logo?: string; // Base64 string of the uploaded logo
  createdAt: number;
}

export type SocialPlatform = 'instagram' | 'linkedin' | 'twitter' | 'facebook';

export interface Post {
  id: string;
  day: string; // e.g., "Monday" or date string
  platform: SocialPlatform;
  caption: string;
  hashtags: string[];
  visualDescription: string;
  visualType: 'image' | 'video';
  visualUrl?: string; // Data URI for images
  videoScript?: string; // Script for video posts
  status: 'draft' | 'scheduled' | 'published';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type ViewState = 'dashboard' | 'new-campaign' | 'edit-campaign' | 'planner';

export interface AppState {
  campaigns: Campaign[];
  selectedCampaign: Campaign | null;
  posts: Record<string, Post[]>; // Map campaignId to posts
  view: ViewState;
}

export interface GeneratedPostData {
  day: string;
  caption: string;
  hashtags: string[];
  visualDescription: string;
  visualType: 'image' | 'video';
  videoScript?: string;
}