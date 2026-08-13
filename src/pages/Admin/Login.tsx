import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ArrowLeft, Loader2, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSEO } from '../../lib/useSEO';

export default function AdminLogin() {
  useSEO({
    title: 'Admin Login | Destiny Numbers',
    description: 'Admin login for the Destiny Numbers CMS. Authorised users only.',
    keywords: 'admin login destiny numbers, cms login',
  });
  const { user, isAdmin, signIn, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user && isAdmin) {
      const from = (location.state as any)?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, isAdmin, loading, navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSigningIn(true);
    try {
      await signIn(username.trim(), password);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials.');
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F2A] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#C9A84C]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F2A] flex items-center justify-center px-6">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C9A84C]/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 blur-[120px] rounded-full animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-[#1C3557] flex items-center justify-center mx-auto mb-10 border border-[#C9A84C]/20 shadow-2xl">
            <ShieldCheck className="w-10 h-10 text-[#C9A84C]" />
          </div>
          <span className="text-[#C9A84C] text-[10px] tracking-[0.5em] font-black mb-4 block">Identity Verification</span>
          <h1 className="text-4xl font-display font-medium text-[#F5ECD7] italic tracking-tight">
            Vault <span className="not-italic text-[#C9A84C]">Access</span>
          </h1>
        </div>

        <div className="bg-white p-10 md:p-12 border border-[#E0D5C0] shadow-2xl relative space-y-6">
          <div className="text-center">
            <p className="text-gray-500 text-sm">Secure access for site administrators</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 flex items-center gap-3 text-sm"
              >
                <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold tracking-widest text-[#1C3557] uppercase mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                placeholder="Enter username"
                className="w-full border border-[#E0D5C0] px-4 py-3 text-sm text-[#1C3557] outline-none focus:border-[#C9A84C] transition-colors"
                style={{ borderRadius: '0px' }}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-widest text-[#1C3557] uppercase mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Enter password"
                  className="w-full border border-[#E0D5C0] px-4 py-3 pr-11 text-sm text-[#1C3557] outline-none focus:border-[#C9A84C] transition-colors"
                  style={{ borderRadius: '0px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1C3557] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSigningIn}
              className="w-full h-[52px] bg-[#1C3557] hover:bg-[#12284c] text-white text-[11px] font-black tracking-[0.3em] flex items-center justify-center gap-3 transition-all uppercase disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              style={{ borderRadius: '0px' }}
            >
              {isSigningIn ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-gray-100 flex justify-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-[10px] font-black tracking-[0.2em] transition-colors uppercase"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Public Site
            </button>
          </div>
        </div>

        <div className="mt-12 text-center text-[9px] text-white/20 tracking-[0.4em] font-black">
          © 2025 Destiny Numbers. Secure Environment.
        </div>
      </motion.div>
    </div>
  );
}
