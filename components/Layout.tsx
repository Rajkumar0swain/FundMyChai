import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Coffee, Menu, X, User, LogIn, LogOut } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isCreatorPage = location.pathname.startsWith('/c/');
  const isAuthPage = location.pathname === '/auth';

  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <nav className={`sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="bg-brand-yellow p-1.5 rounded-lg text-brand-dark">
                <Coffee size={24} strokeWidth={2.5} />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-slate-900">
                FundMyChai
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              {!isCreatorPage && !isAuthPage && (
                <>
                  {isAuthenticated && (
                     <Link to="/dashboard" className="text-slate-600 hover:text-slate-900 font-medium">
                        Dashboard
                     </Link>
                  )}
                  <Link to="/explore" className="text-slate-600 hover:text-slate-900 font-medium">
                    Explore
                  </Link>
                </>
              )}
              
              {!isCreatorPage && (
                isAuthenticated ? (
                  <div className="flex items-center gap-4">
                     <Link to="/dashboard">
                        <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-full font-medium text-sm hover:bg-slate-800 transition-colors">
                            <User size={16} />
                            My Dashboard
                        </button>
                     </Link>
                     <button 
                        onClick={handleLogout}
                        className="text-slate-500 hover:text-red-500 transition-colors"
                        title="Logout"
                     >
                        <LogOut size={20} />
                     </button>
                  </div>
                ) : (
                  <Link to="/auth">
                    <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-full font-medium text-sm hover:bg-slate-800 transition-colors">
                      <LogIn size={16} />
                      Log in / Sign up
                    </button>
                  </Link>
                )
              )}
              
              {isCreatorPage && (
                 <Link to="/auth">
                    <button className="flex items-center gap-2 bg-white border border-gray-200 text-slate-700 px-5 py-2 rounded-full font-medium text-sm hover:bg-gray-50 transition-colors">
                      Create your own page
                    </button>
                  </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-600 hover:text-slate-900 p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100">
            <div className="px-4 pt-2 pb-4 space-y-2">
              {isAuthenticated && (
                 <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-gray-50 rounded-md"
                  >
                    Dashboard
                  </Link>
              )}
              <Link
                to="/explore"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-gray-50 rounded-md"
              >
                Explore
              </Link>
              {isAuthenticated ? (
                 <button
                    onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                 >
                    Logout
                 </button>
              ) : (
                 <Link
                    to="/auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-brand-dark bg-brand-yellow/10 rounded-md"
                  >
                    Log in / Sign up
                  </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2024 FundMyChai. Built with Gemini & React.</p>
        </div>
      </footer>
    </div>
  );
};