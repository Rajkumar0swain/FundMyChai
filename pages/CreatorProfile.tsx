
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '../components/Button';
import { Creator } from '../types';
import { Coffee, Shield, CheckCircle2, Copy, Monitor, Share2, Check, Link as LinkIcon, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { decodeData } from '../utils/storage';

// Mock data to use if no local storage found
const MOCK_CREATOR: Creator = {
  id: 'demo',
  name: 'Demo Creator',
  handle: 'demo',
  upiId: 'demo@upi', // This is just for display
  bio: 'Hey! I create open source projects and educational content. If you found my work helpful, consider buying me a chai. It helps keep the servers running!',
  category: 'Coding',
  avatarUrl: 'https://picsum.photos/200'
};

export const CreatorProfile: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const [searchParams] = useSearchParams();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState(100); // Default 100 INR
  const [customAmount, setCustomAmount] = useState('');
  const [coffeeCount, setCoffeeCount] = useState(3);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Strategy:
    // 1. Check URL param 'd' (Encoded Data) - This allows stateless sharing
    // 2. Check LocalStorage (For the creator viewing their own page)
    // 3. Fallback to Mock
    
    const dataParam = searchParams.get('d');
    
    if (dataParam) {
        const decoded = decodeData(dataParam);
        if (decoded) {
            setCreator(decoded);
            return;
        } else {
            // Data param exists but failed to decode
            setError("The profile link seems to be invalid or corrupted.");
            return;
        }
    }

    const saved = localStorage.getItem('creator_profile');
    if (saved) {
      const parsed: Creator = JSON.parse(saved);
      // Only use local storage if the handle matches or we are in demo mode
      if (parsed.handle === handle || handle === 'demo') {
        setCreator(parsed);
      } else {
        setCreator(MOCK_CREATOR);
      }
    } else {
      setCreator(MOCK_CREATOR);
    }
  }, [handle, searchParams]);

  useEffect(() => {
    // Scroll to QR if shown
    if (showQR && qrRef.current) {
        qrRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Fire confetti!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
    }
  }, [showQR]);

  const handleCoffeeSelect = (count: number) => {
    setCoffeeCount(count);
    setAmount(count * 50); // Assuming 1 Coffee = 50 INR
    setCustomAmount('');
    setShowQR(false);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(val);
    if (val) {
      setAmount(parseInt(val, 10));
      setCoffeeCount(0); // Deselect coffee multipliers
    }
    setShowQR(false);
  };

  const handleCopyLink = async () => {
    try {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
        console.error('Failed to copy', err);
    }
  };

  const handleShare = async () => {
    // Ensure we are sharing a valid, absolute URL string
    const url = new URL(window.location.href).toString();
    const shareData = {
        title: `Buy ${creator?.name} a Chai`,
        text: `Support ${creator?.name} on FundMyChai!`,
        url: url
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (err: any) {
            // AbortError is typical when user cancels the share sheet
            if (err.name !== 'AbortError') {
                console.error('Share failed:', err);
                handleCopyLink(); // Fallback
            }
        }
    } else {
        handleCopyLink();
    }
  };

  if (error) {
      return (
          <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
              <div className="bg-red-50 text-red-600 p-4 rounded-full mb-4">
                  <AlertCircle size={48} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Profile Not Found</h2>
              <p className="text-slate-500 max-w-md mb-8">{error}</p>
              <Link to="/">
                <Button>Go Home</Button>
              </Link>
          </div>
      );
  }

  if (!creator) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  const upiLink = `upi://pay?pa=${creator.upiId}&pn=${encodeURIComponent(creator.name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(message || 'Support from FundMyChai')}`;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Cover Image */}
      <div className="h-48 md:h-64 w-full bg-gradient-to-r from-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Left Column: Profile */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center md:text-left">
              <div className="relative inline-block">
                <div className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-white shadow-md bg-gray-200 mx-auto md:mx-0 overflow-hidden">
                  <img 
                    src={creator.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${creator.name}`} 
                    alt={creator.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 bg-green-500 h-4 w-4 rounded-full border-2 border-white"></div>
              </div>
              
              <h1 className="text-2xl font-bold text-slate-900 mt-4">{creator.name}</h1>
              <p className="text-slate-500 font-medium text-sm mt-1 mb-4">Creates {creator.category}</p>
              
              <div className="prose prose-sm text-slate-600 mb-6 break-words">
                <p>{creator.bio}</p>
              </div>

              <div className="pt-6 border-t border-gray-100 space-y-4">
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        className="flex-1 border-dashed border-gray-300 hover:border-yellow-400 hover:bg-yellow-50 text-slate-600"
                        onClick={handleShare}
                    >
                        <Share2 size={18} className="mr-2"/>
                        Share Page
                    </Button>
                    <button 
                        onClick={handleCopyLink}
                        className="p-3 rounded-full border border-gray-200 text-slate-500 hover:bg-gray-50 hover:text-slate-900 transition-colors"
                        title="Copy Link"
                    >
                        {isCopied ? <Check size={18} className="text-green-600"/> : <LinkIcon size={18}/>}
                    </button>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-slate-400 justify-center md:justify-start">
                    <Shield size={14} />
                    <span>Verified Creator</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Payment */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-yellow-100/50 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                Buy <span className="text-brand-dark font-display">{creator.name}</span> a Chai
                <Coffee className="text-yellow-500 fill-yellow-500" size={24}/>
              </h2>

              {/* Amount Selection */}
              <div className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-100 mb-6">
                <div className="flex items-center gap-3 mb-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 text-2xl shrink-0">
                    ☕
                  </div>
                  <span className="text-slate-400 font-medium">x</span>
                  {[1, 3, 5].map(num => (
                    <button
                      key={num}
                      onClick={() => handleCoffeeSelect(num)}
                      className={`h-12 w-12 rounded-full font-bold text-lg transition-all ${
                        coffeeCount === num 
                          ? 'bg-brand-yellow text-brand-dark ring-2 ring-yellow-400 ring-offset-2' 
                          : 'bg-white text-slate-600 border border-gray-200 hover:border-yellow-400'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                  <input
                    type="number"
                    placeholder="₹"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    className={`h-12 w-24 rounded-full px-4 font-bold text-lg outline-none transition-all ${
                        !coffeeCount
                          ? 'bg-white ring-2 ring-yellow-400 ring-offset-2 border-transparent' 
                          : 'bg-white border border-gray-200 focus:border-yellow-400'
                      }`}
                  />
                </div>
                
                <div className="text-center md:text-left">
                  <p className="text-slate-600 font-medium">
                    Supporting with <span className="font-bold text-slate-900">₹{amount}</span>
                  </p>
                </div>
              </div>

              {/* Message Inputs */}
              <div className="space-y-4 mb-6">
                <input
                  type="text"
                  placeholder="Name or @twitter (optional)"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none transition-all bg-gray-50 focus:bg-white"
                />
                <textarea
                  placeholder="Say something nice... (optional)"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none transition-all bg-gray-50 focus:bg-white resize-none"
                />
              </div>

              {!showQR ? (
                <Button 
                  onClick={() => setShowQR(true)} 
                  className="w-full py-4 text-lg shadow-yellow-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  disabled={amount <= 0}
                >
                  Support ₹{amount}
                </Button>
              ) : (
                <div ref={qrRef} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-slate-900 rounded-xl p-6 text-white text-center">
                    <div className="flex items-center justify-center gap-2 mb-6 text-yellow-400 font-medium">
                      <CheckCircle2 size={20} />
                      <span>Scan to pay securely</span>
                    </div>

                    <div className="bg-white p-4 rounded-lg inline-block mb-6 shadow-2xl">
                        <QRCodeSVG 
                            value={upiLink} 
                            size={200}
                            level={"H"}
                            includeMargin={true}
                            imageSettings={{
                                src: "https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg",
                                x: undefined,
                                y: undefined,
                                height: 24,
                                width: 24,
                                excavate: true,
                            }}
                        />
                    </div>

                    <div className="space-y-3">
                        <p className="text-slate-300 text-sm">
                            Scan with any UPI app
                        </p>
                        <div className="flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/PhonePe.svg/1200px-PhonePe.svg.png" className="h-6 object-contain" alt="PhonePe"/>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Google_Pay_Logo.svg/2560px-Google_Pay_Logo.svg.png" className="h-6 object-contain" alt="GPay"/>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Paytm_Logo.jpg/1200px-Paytm_Logo.jpg" className="h-6 object-contain rounded" alt="Paytm"/>
                        </div>
                    </div>

                    {/* Mobile Deep Link Button */}
                    <div className="md:hidden mt-6 pt-6 border-t border-slate-700">
                         <a href={upiLink} className="block w-full bg-yellow-400 text-slate-900 font-bold py-3 rounded-lg hover:bg-yellow-300">
                            Pay via UPI App
                         </a>
                    </div>

                     <div className="mt-6 pt-6 border-t border-slate-700 flex items-center justify-center gap-2">
                        <span className="font-mono text-slate-400 text-sm truncate max-w-[200px]">{creator.upiId}</span>
                        <button 
                            onClick={() => navigator.clipboard.writeText(creator.upiId)}
                            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                            title="Copy UPI ID"
                        >
                            <Copy size={14} />
                        </button>
                    </div>

                    <button 
                        onClick={() => setShowQR(false)}
                        className="mt-4 text-sm text-slate-400 hover:text-white underline"
                    >
                        Change Amount
                    </button>
                  </div>
                  
                  <div className="mt-4 bg-blue-50 text-blue-700 p-4 rounded-lg text-sm flex gap-3">
                    <Monitor className="shrink-0 mt-0.5" size={16} />
                    <p>
                        <strong>Desktop Tip:</strong> Open your favorite UPI app (GPay, PhonePe) on your phone and scan the code above.
                    </p>
                  </div>
                  
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
