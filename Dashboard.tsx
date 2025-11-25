import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { generateCreativeBio } from '../services/geminiService';
import { Creator, Transaction } from '../types';
import { Wand2, Rocket, UserCircle, CreditCard, Copy, Check, ExternalLink, X, AlertTriangle, LayoutDashboard, Settings, IndianRupee, History, PlusCircle } from 'lucide-react';
import { encodeData } from '../utils/storage';
import confetti from 'canvas-confetti';

// Mock Data for Transaction History
const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', fromName: 'Anjali P.', amount: 500, message: 'Love your content! Keep it up.', date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), status: 'success' },
  { id: 't2', fromName: 'Rohan K.', amount: 150, message: 'Thanks for the help.', date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), status: 'success' },
  { id: 't3', fromName: 'Anonymous', amount: 50, message: 'Chai money ☕', date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), status: 'success' },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');
  
  // Auth Check
  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated');
    if (!isAuth) {
        navigate('/auth');
    }
  }, [navigate]);

  // Profile State
  const [creator, setCreator] = useState<Creator>(() => {
    const saved = localStorage.getItem('creator_profile');
    return saved ? JSON.parse(saved) : {
      id: 'demo',
      name: '',
      handle: '',
      upiId: '',
      bio: '',
      category: '',
      avatarUrl: ''
    };
  });

  // Transaction State
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
      const saved = localStorage.getItem('transactions');
      return saved ? JSON.parse(saved) : MOCK_TRANSACTIONS;
  });

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [aiPrompt, setAiPrompt] = useState({ category: '', vibe: 'funny' });

  useEffect(() => {
    localStorage.setItem('creator_profile', JSON.stringify(creator));
    if (window.location.protocol === 'blob:') {
        setIsPreviewMode(true);
    }
  }, [creator]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Actions
  const handleGenerateBio = async () => {
    if (!creator.name || !aiPrompt.category) {
      alert("Please enter your name and what you do!");
      return;
    }
    setIsGeneratingBio(true);
    try {
      const bio = await generateCreativeBio(creator.name, aiPrompt.category, aiPrompt.vibe);
      setCreator(prev => ({ ...prev, bio, category: aiPrompt.category }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const getShareableUrl = () => {
    // Robust URL construction for GH Pages subdirectories
    const currentUrl = new URL(window.location.href);
    const origin = currentUrl.origin;
    const pathname = currentUrl.pathname; // This captures '/repo-name/'
    
    // Ensure we don't duplicate the slash between origin/path and the hash
    const basePath = pathname.endsWith('/') ? pathname : `${pathname}/`;
    
    // Construct: https://user.github.io/repo-name/#/c/handle
    const fullBase = `${origin}${basePath}`;
    const hashPath = `#/c/${creator.handle || 'your-page'}`;
    const data = encodeData(creator);
    
    return `${fullBase}${hashPath}?d=${encodeURIComponent(data)}`;
  };

  const handlePublish = () => {
    if (!creator.name || !creator.handle || !creator.upiId) {
        alert("Please fill in at least your Name, Handle, and UPI ID to publish.");
        return;
    }

    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem('creator_profile', JSON.stringify(creator));
      setIsLoading(false);
      setShowSuccessModal(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFDD00', '#ffffff', '#000000']
      });
    }, 1000);
  };

  const copyLink = () => {
    const url = getShareableUrl();
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const visitPage = () => {
    const data = encodeData(creator);
    navigate(`/c/${creator.handle || 'demo'}?d=${encodeURIComponent(data)}`);
  };

  const addManualTransaction = () => {
      const newTx: Transaction = {
          id: `t${Date.now()}`,
          fromName: 'Manual Entry',
          amount: 100,
          message: 'Offline donation',
          date: new Date().toISOString(),
          status: 'success'
      };
      setTransactions([newTx, ...transactions]);
  };

  // Calculations
  const totalEarnings = transactions.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Preview Warning */}
        {isPreviewMode && (
             <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-8 flex gap-3 text-orange-800">
                <AlertTriangle className="shrink-0 mt-0.5" size={20} />
                <div className="text-sm">
                    <p className="font-bold">You are in Preview Mode</p>
                    <p className="mt-1 opacity-90">
                        Generated links (blob:...) cannot be shared externally. Deploy this code to share publicly.
                    </p>
                </div>
            </div>
        )}

        {/* Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-slate-900">
                {creator.name ? `Welcome, ${creator.name.split(' ')[0]}!` : 'Dashboard'}
            </h1>
            <p className="text-slate-500 mt-2">Manage your page and view your supporters.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-200/50 p-1 rounded-xl mb-8 w-fit">
            <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'overview' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
            >
                <LayoutDashboard size={16} className="mr-2"/>
                Overview
            </button>
            <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'settings' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
            >
                <Settings size={16} className="mr-2"/>
                Page Settings
            </button>
        </div>

        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-slate-500 text-sm font-medium">Total Earnings</h3>
                            <div className="bg-green-100 p-2 rounded-full text-green-600">
                                <IndianRupee size={20} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-slate-900">₹{totalEarnings.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                         <div className="flex items-center justify-between mb-4">
                            <h3 className="text-slate-500 text-sm font-medium">Supporters</h3>
                            <div className="bg-yellow-100 p-2 rounded-full text-yellow-600">
                                <UserCircle size={20} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-slate-900">{transactions.length}</p>
                    </div>
                </div>

                {/* Transaction History */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <History size={20} className="text-slate-400"/>
                            Recent Supporters
                        </h3>
                        <Button variant="ghost" size="sm" onClick={addManualTransaction}>
                            <PlusCircle size={16} className="mr-2" />
                            Log Payment
                        </Button>
                    </div>
                    
                    <div className="bg-blue-50 p-3 mx-6 mt-4 rounded-lg flex gap-3 text-xs text-blue-800">
                        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                        <p>
                            <strong>Note:</strong> Since this app uses personal UPI, automatic payment tracking is not possible without a bank API integration. 
                            The table below shows <span className="underline">demo data</span> or manually logged payments.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-slate-500">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Supporter</th>
                                    <th className="px-6 py-3 font-medium">Amount</th>
                                    <th className="px-6 py-3 font-medium">Message</th>
                                    <th className="px-6 py-3 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                            No support yet. Share your page to get started!
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map(tx => (
                                        <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900">{tx.fromName}</td>
                                            <td className="px-6 py-4 font-bold text-green-600">+₹{tx.amount}</td>
                                            <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{tx.message}</td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {new Date(tx.date).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {/* TAB: SETTINGS (The Original Dashboard Content) */}
        {activeTab === 'settings' && (
             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
             {/* Avatar & Basic Info */}
             <div className="p-8 border-b border-gray-100">
               <div className="flex items-start gap-4 mb-6">
                 <div className="h-20 w-20 rounded-full bg-yellow-100 border-4 border-white shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                   {creator.avatarUrl ? (
                      <img src={creator.avatarUrl} alt="Avatar" className="w-full h-full object-cover"/>
                   ) : (
                     <UserCircle size={40} className="text-yellow-600/50" />
                   )}
                 </div>
                 <div className="flex-1">
                   <label className="block text-sm font-semibold text-slate-700 mb-1">Display Name <span className="text-red-500">*</span></label>
                   <input
                     type="text"
                     value={creator.name}
                     onChange={e => setCreator({...creator, name: e.target.value})}
                     placeholder="e.g. Rahul Sharma"
                     className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                   />
                 </div>
               </div>
   
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-1">Page Handle <span className="text-red-500">*</span></label>
                   <div className="relative">
                     <span className="absolute left-3 top-2.5 text-slate-400">/c/</span>
                     <input
                       type="text"
                       value={creator.handle}
                       onChange={e => setCreator({...creator, handle: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')})}
                       placeholder="your-name"
                       className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                     />
                   </div>
                 </div>
                 <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-1">Avatar URL (Optional)</label>
                   <input
                     type="text"
                     value={creator.avatarUrl}
                     onChange={e => setCreator({...creator, avatarUrl: e.target.value})}
                     placeholder="https://..."
                     className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                   />
                 </div>
               </div>
             </div>
   
             {/* Payment Details */}
             <div className="p-8 border-b border-gray-100 bg-gray-50/50">
               <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                 <CreditCard size={20} className="text-slate-400"/>
                 Payment Details
               </h3>
               <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-1">UPI ID (VPA) <span className="text-red-500">*</span></label>
                 <input
                   type="text"
                   value={creator.upiId}
                   onChange={e => setCreator({...creator, upiId: e.target.value})}
                   placeholder="username@oksbi"
                   className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all font-mono text-slate-600"
                 />
                 <p className="text-xs text-slate-500 mt-2">
                   Funds will be transferred directly to this UPI ID. Ensure it is correct.
                 </p>
               </div>
             </div>
   
             {/* AI Bio Generator */}
             <div className="p-8">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                   <Wand2 size={20} className="text-purple-500"/>
                   About You
                 </h3>
                 <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-700 rounded-full">Powered by Gemini</span>
               </div>
               
               <div className="bg-purple-50 p-4 rounded-xl mb-4 border border-purple-100">
                 <div className="grid grid-cols-2 gap-4 mb-4">
                   <div>
                     <label className="block text-xs font-semibold text-purple-900 mb-1">I create...</label>
                     <input
                       type="text"
                       value={aiPrompt.category}
                       onChange={e => setAiPrompt({...aiPrompt, category: e.target.value})}
                       placeholder="Tech videos, Digital Art..."
                       className="w-full px-3 py-1.5 text-sm rounded-md border border-purple-200 focus:outline-none focus:border-purple-400"
                     />
                   </div>
                   <div>
                     <label className="block text-xs font-semibold text-purple-900 mb-1">Vibe</label>
                     <select
                       value={aiPrompt.vibe}
                       onChange={e => setAiPrompt({...aiPrompt, vibe: e.target.value})}
                       className="w-full px-3 py-1.5 text-sm rounded-md border border-purple-200 focus:outline-none focus:border-purple-400 bg-white"
                     >
                       <option value="funny">Funny & Casual</option>
                       <option value="professional">Professional</option>
                       <option value="humble">Humble & Grateful</option>
                       <option value="energetic">Energetic</option>
                     </select>
                   </div>
                 </div>
                 <Button 
                   onClick={handleGenerateBio}
                   type="button"
                   size="sm"
                   variant="secondary"
                   isLoading={isGeneratingBio}
                   className="w-full bg-purple-600 hover:bg-purple-700 text-white border-none"
                 >
                   <Wand2 size={14} className="mr-2"/>
                   Generate Bio with AI
                 </Button>
               </div>
   
               <textarea
                 value={creator.bio}
                 onChange={e => setCreator({...creator, bio: e.target.value})}
                 rows={4}
                 placeholder="Tell your audience about yourself..."
                 className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all resize-none text-slate-600"
               />
             </div>
   
             <div className="p-8 border-t border-gray-100 flex justify-end">
               <Button onClick={handlePublish} isLoading={isLoading} className="w-full sm:w-auto shadow-xl shadow-yellow-200/50">
                 <Rocket size={18} className="mr-2"/>
                 Publish Page
               </Button>
             </div>
           </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl scale-100 animate-in zoom-in-95 duration-200 relative">
                <button 
                    onClick={() => setShowSuccessModal(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X size={20} />
                </button>
                
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Rocket size={32} className="text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Your page is Live! 🚀</h2>
                    <p className="text-slate-500 mt-2">
                        {isPreviewMode 
                            ? "Page details saved. Use 'View Page' to test internally, or deploy the code to share."
                            : "Your serverless profile is ready. Share this link to start receiving payments."
                        }
                    </p>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 mb-6 flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                         <p className="text-xs text-slate-500 font-medium mb-1">Your Page Link</p>
                         <p className="text-sm font-mono text-slate-800 truncate select-all">{getShareableUrl()}</p>
                    </div>
                    <button 
                        onClick={copyLink}
                        className="p-2 bg-white border border-gray-200 rounded-lg hover:border-yellow-400 hover:text-yellow-700 transition-colors shrink-0"
                        title="Copy Link"
                    >
                         {linkCopied ? <Check size={18} className="text-green-600"/> : <Copy size={18}/>}
                    </button>
                </div>

                <div className="space-y-3">
                    <Button onClick={visitPage} className="w-full justify-center">
                        View Public Page <ExternalLink size={16} className="ml-2" />
                    </Button>
                    <Button 
                        onClick={() => {
                            copyLink();
                            setShowSuccessModal(false);
                        }} 
                        variant="outline" 
                        className="w-full justify-center"
                    >
                        Copy Link & Close
                    </Button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};