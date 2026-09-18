import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { FabrizLogo } from './FabrizLogo';

interface LoginViewProps {
  onLoginSuccess: (user: { uid: string; email: string; username: string }) => void;
  onGoToRegister: () => void;
  onBack: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onGoToRegister,
  onBack
}) => {
  const [email, setEmail] = useState('lokesh16215@gmail.com');
  const [password, setPassword] = useState('Fabriz2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const emailTrimmed = email.trim();
    if (!emailTrimmed) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
      return;
    }

    setIsLoading(true);

    // Simulate authenticating against Firebase Auth
    setTimeout(() => {
      setIsLoading(false);
      const username = emailTrimmed.split('@')[0];
      onLoginSuccess({
        uid: 'usr_' + btoa(emailTrimmed).substring(0, 12),
        email: emailTrimmed,
        username: username
      });
    }, 600);
  };

  return (
    <div className="h-full flex flex-col justify-between p-6 text-neutral-100 bg-neutral-900 overflow-y-auto">
      <div>
        {/* Top bar with back button & Fabriz logo */}
        <div className="flex items-center justify-between pb-6">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition"
            title="Back to welcome"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <FabrizLogo size={36} />
        </div>

        {/* Title */}
        <div className="space-y-1 pb-6">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-100">
            Welcome Back
          </h2>
          <p className="text-xs text-neutral-400">
            Access your tasks, notes, and password manager.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-800/60 text-xs text-red-200 flex items-start gap-2">
            <span>•</span>
            <span className="flex-1">{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400/70 rounded-xl pl-10 pr-3 py-2.5 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert('Password reset email instructions simulated for ' + email)}
                className="text-[11px] text-amber-400 hover:underline"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400/70 rounded-xl pl-10 pr-10 py-2.5 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none transition font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-neutral-950 font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>
      </div>

      {/* Switch to Register */}
      <div className="pt-6 text-center">
        <p className="text-xs text-neutral-400">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onGoToRegister}
            className="text-amber-400 font-semibold hover:underline"
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
};
