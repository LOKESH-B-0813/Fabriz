import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail, User } from 'lucide-react';
import { FabrizLogo } from './FabrizLogo';

interface RegisterViewProps {
  onRegisterSuccess: (user: { uid: string; email: string; username: string }) => void;
  onGoToLogin: () => void;
  onBack: () => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({
  onRegisterSuccess,
  onGoToLogin,
  onBack
}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Compute password strength
  const getPasswordStrength = () => {
    if (!password) return { label: '', color: 'bg-neutral-800', score: 0 };
    if (password.length < 8) return { label: 'Too short (min 8)', color: 'bg-red-500', score: 1 };
    let score = 2;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { label: 'Fair', color: 'bg-yellow-500', score: 2 };
    if (score <= 4) return { label: 'Good', color: 'bg-amber-400', score: 3 };
    return { label: 'Strong', color: 'bg-emerald-500', score: 4 };
  };

  const strength = getPasswordStrength();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const u = username.trim();
    const em = email.trim();

    if (!u) {
      setErrorMessage('Please enter a username or display name.');
      return;
    }
    if (!em) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(em)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    // Simulate account creation in Firebase Auth & Firestore user profile
    setTimeout(() => {
      setIsLoading(false);
      onRegisterSuccess({
        uid: 'usr_' + btoa(em).substring(0, 12),
        email: em,
        username: u
      });
    }, 700);
  };

  return (
    <div className="h-full flex flex-col justify-between p-6 text-neutral-100 bg-neutral-900 overflow-y-auto">
      <div>
        {/* Top bar with back button & Fabriz logo */}
        <div className="flex items-center justify-between pb-5">
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
        <div className="space-y-1 pb-4">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-100">
            Create Account
          </h2>
          <p className="text-xs text-neutral-400">
            One private space for tasks, notes, and passwords.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-3 p-3 rounded-xl bg-red-950/50 border border-red-800/60 text-xs text-red-200 flex items-start gap-2">
            <span>•</span>
            <span className="flex-1">{errorMessage}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-300">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="lokesh"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400/70 rounded-xl pl-10 pr-3 py-2 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1">
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
                placeholder="lokesh16215@gmail.com"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400/70 rounded-xl pl-10 pr-3 py-2 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-300">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400/70 rounded-xl pl-10 pr-10 py-2 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none transition font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {password && (
              <div className="flex items-center gap-2 pt-1">
                <div className="flex-1 h-1 rounded-full bg-neutral-800 overflow-hidden flex gap-1">
                  <div className={`h-full ${strength.score >= 1 ? strength.color : 'bg-transparent'} flex-1`} />
                  <div className={`h-full ${strength.score >= 2 ? strength.color : 'bg-transparent'} flex-1`} />
                  <div className={`h-full ${strength.score >= 3 ? strength.color : 'bg-transparent'} flex-1`} />
                  <div className={`h-full ${strength.score >= 4 ? strength.color : 'bg-transparent'} flex-1`} />
                </div>
                <span className="text-[10px] text-neutral-400">{strength.label}</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-300">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400/70 rounded-xl pl-10 pr-3 py-2 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none transition font-mono"
              />
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
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>
      </div>

      {/* Switch to Sign In */}
      <div className="pt-4 text-center">
        <p className="text-xs text-neutral-400">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onGoToLogin}
            className="text-amber-400 font-semibold hover:underline"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};
