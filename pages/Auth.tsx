import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Coffee, ArrowRight, Lock } from 'lucide-react';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      // In a real app, this would hit a backend API.
      // Here we simulate a session by setting localStorage.
      localStorage.setItem('isAuthenticated', 'true');
      
      // If signing up, we might pre-fill the profile name
      if (!isLogin && name) {
        const existingProfile = localStorage.getItem('creator_profile');
        if (!existingProfile) {
            const initialProfile = {
                id: 'user_' + Date.now(),
                name: name,
                handle: '',
                upiId: '',
                bio: '',
                category: '',
                avatarUrl: ''
            };
            localStorage.setItem('creator_profile', JSON.stringify(initialProfile));
        }
      }

      setIsLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-brand-yellow rounded-xl flex items-center justify-center text-brand-dark mb-4">
            <Coffee size={24} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-display font-bold text-slate-900">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {isLogin 
              ? 'Enter your details to access your dashboard.' 
              : 'Start receiving support from your fans today.'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                  placeholder="e.g. Rahul Sharma"
                />
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full flex justify-center" 
            isLoading={isLoading}
          >
            {isLogin ? 'Sign in' : 'Create Account'} <ArrowRight size={16} className="ml-2"/>
          </Button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-slate-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-yellow-600 hover:text-yellow-500 underline decoration-yellow-400/50"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-lg flex gap-3 items-start text-xs text-blue-800">
            <Lock size={14} className="mt-0.5 shrink-0" />
            <p>This is a demo authentication flow. You can use any email/password to test the dashboard.</p>
        </div>
      </div>
    </div>
  );
};