import React from 'react';
import { FabrizLogo } from './FabrizLogo';

interface WelcomeAuthViewProps {
  onGoToLogin: () => void;
  onGoToRegister: () => void;
}

export const WelcomeAuthView: React.FC<WelcomeAuthViewProps> = ({
  onGoToLogin,
  onGoToRegister
}) => {
  return (
    <div className="h-full flex flex-col justify-between p-8 text-neutral-100 bg-neutral-900 overflow-y-auto">
      <div className="pt-6" />

      {/* Hero Branding */}
      <div className="flex flex-col items-center text-center my-auto space-y-5">
        <FabrizLogo size={76} />

        <div className="space-y-1.5">
          <h1 className="text-3xl font-black tracking-[0.2em] text-neutral-100">
            FABRIZ
          </h1>
          <p className="text-xs font-bold tracking-[0.2em] text-amber-400 uppercase">
            Keeps You Awake
          </p>
        </div>

        <div className="pt-4 text-sm text-neutral-400 max-w-xs leading-relaxed">
          Your tasks. Your notes.
          <br />
          Your memories. Your passwords.
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-6">
        <button
          onClick={onGoToRegister}
          className="w-full py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm transition shadow-lg shadow-amber-500/10"
        >
          Create Account
        </button>

        <button
          onClick={onGoToLogin}
          className="w-full py-3.5 px-4 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-neutral-200 hover:text-white font-semibold text-sm transition border border-neutral-700/60"
        >
          Log In
        </button>

        <p className="text-[11px] text-center text-neutral-500 pt-2">
          Private, zero-telemetry personal productivity
        </p>
      </div>
    </div>
  );
};
