
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Zap, Heart, ShieldCheck } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-40 bg-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-sm font-semibold mb-8 border border-yellow-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
            </span>
            Now supporting UPI Payments
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-[1.1]">
            Give your audience <br className="hidden md:block"/>
            an easy way to say <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">thanks.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-10 leading-relaxed">
            FundMyChai makes it simple for creators to receive support. Direct UPI payments, 0% commission fees.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/auth">
              <Button size="lg" className="min-w-[200px] shadow-yellow-200 shadow-xl">
                Start my page
              </Button>
            </Link>
            <Link to="/c/demo">
              <Button variant="outline" size="lg" className="min-w-[200px]">
                View demo page
              </Button>
            </Link>
          </div>
          
          <div className="mt-16 text-sm text-slate-500 font-medium">
            Deploy this app to publish your page instantly.
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-yellow-600 mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Direct UPI</h3>
              <p className="text-slate-600 leading-relaxed">
                Money goes directly to your bank account via UPI. No waiting periods, no minimum payout thresholds.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6">
                <Heart size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">0% Fees</h3>
              <p className="text-slate-600 leading-relaxed">
                We don't take a cut. Your supporters pay you directly. We just help you generate the QR code.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Publish</h3>
              <p className="text-slate-600 leading-relaxed">
                Just create your page and click publish. We store your profile data securely in the link itself.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};