import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateCampaignPosts, generateImage, editImage } from '../services/geminiService';
import { Post, SocialPlatform } from '../types';
import { 
  Calendar as CalendarIcon, 
  Loader2, 
  Save, 
  Image as ImageIcon, 
  Video, 
  Wand2, 
  Share2, 
  ArrowLeft,
  Sparkles,
  Download,
  Hash,
  FileText,
  Edit3,
  Linkedin,
  Instagram,
  Twitter,
  Facebook,
  FileDown,
  Clock,
  Settings
} from 'lucide-react';

export const PostPlanner: React.FC = () => {
  const { selectedCampaign, setView, savePosts, posts: allPosts } = useApp();
  const [loading, setLoading] = useState(false);
  const [generatingVisualId, setGeneratingVisualId] = useState<string | null>(null);
  const [editingVisualId, setEditingVisualId] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  
  const [generatedPosts, setGeneratedPosts] = useState<Post[]>([]);
  const [numDays, setNumDays] = useState(3);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [platform, setPlatform] = useState<SocialPlatform>('instagram');

  const existingPosts = selectedCampaign ? (allPosts[selectedCampaign.id] || []) : [];
  const displayPosts = generatedPosts.length > 0 ? generatedPosts : existingPosts;

  const handleGenerateSchedule = async () => {
    if (!selectedCampaign) return;
    setLoading(true);
    try {
      const data = await generateCampaignPosts(selectedCampaign, numDays, startDate, platform);
      const newPosts: Post[] = data.map(p => ({
        id: crypto.randomUUID(),
        status: 'draft',
        visualType: p.visualType || 'image',
        platform: platform,
        ...p
      }));
      setGeneratedPosts(newPosts);
    } catch (error) {
      alert("Failed to generate content plan.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePrompt = (postId: string, newPrompt: string) => {
    setGeneratedPosts(prev => prev.map(p => p.id === postId ? { ...p, visualDescription: newPrompt } : p));
  };

  const handleGenerateVisual = async (post: Post) => {
    if (post.visualType === 'video') return;

    setGeneratingVisualId(post.id);
    try {
      const url = await generateImage(post.visualDescription, selectedCampaign?.logo);
      const updated = displayPosts.map(p => p.id === post.id ? { ...p, visualUrl: url } : p);
      if (generatedPosts.length > 0) setGeneratedPosts(updated);
      else savePosts(selectedCampaign!.id, updated); 
      
    } catch (error) {
      console.error(error);
      alert("Failed to generate visual. " + (error as Error).message);
    } finally {
      setGeneratingVisualId(null);
    }
  };

  const handleEditVisual = async (post: Post) => {
    if (!post.visualUrl || !editPrompt) return;
    setGeneratingVisualId(post.id);
    try {
      const newUrl = await editImage(post.visualUrl, editPrompt);
      const updated = displayPosts.map(p => p.id === post.id ? { ...p, visualUrl: newUrl } : p);
      setGeneratedPosts(updated);
      setEditPrompt('');
      setEditingVisualId(null);
    } catch (error) {
      alert("Failed to edit image.");
    } finally {
      setGeneratingVisualId(null);
    }
  };

  const handleSave = () => {
    if (selectedCampaign && generatedPosts.length > 0) {
      savePosts(selectedCampaign.id, generatedPosts);
      alert('Content calendar saved successfully!');
      setGeneratedPosts([]); 
    }
  };

  const handleExportCSV = () => {
    if (displayPosts.length === 0) return;
    const headers = ['Date', 'Platform', 'Status', 'Caption', 'Hashtags', 'Visual Prompt', 'Visual URL'];
    const rows = displayPosts.map(post => [
      post.day, post.platform, post.status, `"${post.caption.replace(/"/g, '""')}"`, `"${post.hashtags.join(' ')}"`, `"${post.visualDescription.replace(/"/g, '""')}"`, post.visualUrl || ''
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedCampaign?.companyName}_content_calendar.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const PlatformIcon = ({ p }: { p: SocialPlatform }) => {
    switch(p) {
        case 'linkedin': return <Linkedin className="h-4 w-4" />;
        case 'twitter': return <Twitter className="h-4 w-4" />;
        case 'facebook': return <Facebook className="h-4 w-4" />;
        default: return <Instagram className="h-4 w-4" />;
    }
  }

  if (!selectedCampaign) return <div>No campaign selected</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
            <button 
            onClick={() => setView('dashboard')}
            className="p-3 bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-full text-slate-400 hover:text-white transition-all shadow-lg hover:shadow-indigo-500/10"
            >
            <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
            <h1 className="text-3xl font-black text-white tracking-tighter">Content Core</h1>
            <p className="text-slate-400 mt-1 flex items-center text-sm font-medium">
                Protocol: <span className="ml-2 px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{selectedCampaign.companyName}</span>
            </p>
            </div>
        </div>
        
        {displayPosts.length > 0 && (
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center px-4 py-2 border border-slate-700 bg-slate-900/50 text-sm font-semibold rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-500 transition-all"
          >
            <FileDown className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        )}
      </div>

      {/* Generator Controls Panel */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[60px] -ml-10 -mb-10 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-6">
            <Settings className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">Configuration Matrix</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Start Date</label>
              <div className="relative">
                 <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="block w-full rounded-xl border border-slate-700 bg-slate-950/50 py-3.5 px-4 text-white shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Duration</label>
              <div className="relative">
                <select
                  value={numDays}
                  onChange={(e) => setNumDays(Number(e.target.value))}
                  className="block w-full rounded-xl border border-slate-700 bg-slate-950/50 py-3.5 px-4 text-white shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all text-sm appearance-none"
                >
                  <option value={3}>3 Days (Sprint)</option>
                  <option value={7}>7 Days (Week)</option>
                  <option value={14}>14 Days (Cycle)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Target Platform</label>
              <div className="relative">
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
                  className="block w-full rounded-xl border border-slate-700 bg-slate-950/50 py-3.5 px-4 text-white shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all text-sm appearance-none"
                >
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">Twitter / X</option>
                  <option value="facebook">Facebook</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                  <Share2 className="h-4 w-4" />
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerateSchedule}
              disabled={loading}
              className="flex items-center justify-center px-6 py-3.5 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Synthesizing...
                </>
              ) : (
                <>
                  <Sparkles className="-ml-1 mr-2 h-5 w-5" />
                  Generate Strategy
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results / List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-bold text-white flex items-center tracking-tight">
            {generatedPosts.length > 0 ? (
              <>
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></div>
                Generated Preview
              </>
            ) : 'Scheduled Content'}
          </h2>
          {generatedPosts.length > 0 && (
            <button
              onClick={handleSave}
              className="inline-flex items-center px-5 py-2.5 border border-indigo-500/30 text-sm font-bold rounded-lg text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500 hover:text-white transition-all duration-300"
            >
              <Save className="-ml-0.5 mr-2 h-4 w-4" />
              Commit to Database
            </button>
          )}
        </div>

        {displayPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 rounded-3xl border border-dashed border-slate-800 bg-slate-900/20">
            <div className="h-20 w-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 shadow-inner border border-slate-800">
              <CalendarIcon className="h-8 w-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-white">System Idle</h3>
            <p className="mt-2 text-slate-500">Configure the parameters above to initiate content generation.</p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            {displayPosts.map((post) => (
              <div key={post.id} className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col hover:border-indigo-500/30 transition-all duration-300 group">
                
                {/* Visual Preview Area */}
                <div className="relative w-full bg-slate-950 aspect-video flex items-center justify-center overflow-hidden border-b border-slate-800/50">
                  {post.visualType === 'video' ? (
                     <div className="text-center p-4">
                        <Video className="h-12 w-12 text-indigo-500/50 mx-auto mb-3" />
                        <p className="text-sm text-indigo-400 font-medium">Video Post Planned</p>
                        <p className="text-xs text-slate-500 mt-1">Video generation module offline</p>
                     </div>
                  ) : (
                    post.visualUrl ? (
                      <img src={post.visualUrl} alt="Generated Content" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="text-center p-4">
                        <ImageIcon className="h-12 w-12 text-slate-800 mx-auto mb-3" />
                        <p className="text-sm text-slate-600 font-medium">Awaiting Visual Synthesis</p>
                      </div>
                    )
                  )}

                  {/* Generate Button Overlay (Only for Images) */}
                  {post.visualType === 'image' && (
                    <div className={`absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center ${post.visualUrl ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'} transition-opacity duration-300 z-10`}>
                      <button
                        onClick={() => handleGenerateVisual(post)}
                        disabled={generatingVisualId === post.id}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-[0_0_30px_-5px_rgba(79,70,229,0.4)] hover:bg-indigo-500 disabled:opacity-75 flex items-center transform hover:scale-105 transition-all"
                      >
                        {generatingVisualId === post.id ? (
                          <Loader2 className="animate-spin h-5 w-5 mr-2" />
                        ) : (
                          <Sparkles className="h-5 w-5 mr-2" />
                        )}
                        {post.visualUrl ? 'Regenerate' : 'Generate Visual'}
                      </button>
                    </div>
                  )}
                  
                  {/* Download Action */}
                   {post.visualUrl && (
                    <a href={post.visualUrl} download={`post-${post.id}`} className="absolute top-4 right-4 p-2.5 bg-black/60 backdrop-blur-md border border-white/10 text-white rounded-xl hover:bg-indigo-600 hover:border-indigo-500 opacity-0 group-hover:opacity-100 transition-all z-20">
                      <Download className="h-5 w-5" />
                    </a>
                  )}
                </div>

                {/* Edit Bar for Images */}
                {post.visualUrl && post.visualType === 'image' && (
                  <div className="bg-slate-950/50 p-3 border-b border-slate-800/50">
                    {editingVisualId === post.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editPrompt}
                          onChange={(e) => setEditPrompt(e.target.value)}
                          placeholder="e.g. Add a retro filter..."
                          className="flex-1 text-xs bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
                        />
                         <button 
                          onClick={() => handleEditVisual(post)}
                          disabled={generatingVisualId === post.id}
                          className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-500 transition-colors"
                        >
                          <Wand2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => setEditingVisualId(null)}
                          className="text-slate-400 p-2 hover:text-white transition-colors"
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => {
                          setEditingVisualId(post.id);
                          setEditPrompt('');
                        }}
                        className="w-full text-xs text-indigo-400 font-bold flex items-center justify-center hover:text-indigo-300 py-1 transition-colors uppercase tracking-wide"
                      >
                        <Wand2 className="h-3 w-3 mr-2" />
                        Edit Image with AI
                      </button>
                    )}
                  </div>
                )}

                {/* Content Body */}
                <div className="p-6 flex-1 space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-slate-800/50 rounded-lg text-slate-300 border border-slate-700/50">
                            <PlatformIcon p={post.platform} />
                        </div>
                        <span className="font-bold text-slate-200 text-sm tracking-wide">{post.day}</span>
                    </div>
                    
                    <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-md border ${
                      post.status === 'published' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {post.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Caption Content</h4>
                    <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed font-light">{post.caption}</p>
                  </div>

                  {post.videoScript && post.visualType === 'video' && (
                    <div>
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center">
                            <FileText className="h-3 w-3 mr-2" /> Video Script
                        </h4>
                        <div className="text-sm text-slate-300 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs shadow-inner">
                            {post.videoScript}
                        </div>
                    </div>
                  )}

                  <div>
                     <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center">
                        <Hash className="h-3 w-3 mr-2" /> Meta Tags
                     </h4>
                     <div className="flex flex-wrap gap-2">
                        {post.hashtags.map((tag, idx) => (
                            <span key={idx} className="text-xs text-indigo-300 bg-indigo-500/5 border border-indigo-500/20 px-2 py-1 rounded-md hover:bg-indigo-500/10 transition-colors cursor-default">
                                {tag.startsWith('#') ? tag : `#${tag}`}
                            </span>
                        ))}
                     </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-between">
                        <span className="flex items-center">
                          {post.visualType === 'video' ? <Video className="h-3 w-3 mr-2" /> : <ImageIcon className="h-3 w-3 mr-2" />} 
                          {post.visualType === 'video' ? 'Visual Description' : 'Generation Prompt'}
                        </span>
                        {/* Prompt is editable */}
                        {post.visualType === 'image' && !post.visualUrl && (
                          <span className="text-[10px] text-indigo-400 flex items-center opacity-75">
                            <Edit3 className="h-3 w-3 mr-1" /> Editable
                          </span>
                        )}
                    </h4>
                    
                    {post.visualType === 'image' && !post.visualUrl ? (
                      <textarea 
                        className="w-full text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none transition-all placeholder:text-slate-600"
                        rows={3}
                        value={post.visualDescription}
                        onChange={(e) => handleUpdatePrompt(post.id, e.target.value)}
                      />
                    ) : (
                      <p className="text-xs text-slate-500 italic bg-slate-950/30 p-3 rounded-xl border border-slate-800/30">
                          {post.visualDescription}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-slate-950/50 border-t border-slate-800/50 flex justify-end space-x-2">
                    <button className="text-slate-500 hover:text-white p-2 transition-colors">
                        <Share2 className="h-5 w-5" />
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};