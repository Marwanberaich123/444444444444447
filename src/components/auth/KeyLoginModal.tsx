import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { cleanKeyInput } from '../../utils/keyUtils';
import {
  KeyRound,
  ShieldCheck,
  AlertCircle,
  X,
  ArrowRight,
  Eye,
  EyeOff,
  MessageCircle,
  Lock,
  ClipboardPaste
} from 'lucide-react';

interface KeyLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSupport?: () => void;
}

export const KeyLoginModal: React.FC<KeyLoginModalProps> = ({
  isOpen,
  onClose,
  onOpenSupport
}) => {
  const { t, isRtl } = useLanguage();
  const { loginWithKey } = useAuth();

  const [keyInput, setKeyInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [showKey, setShowKey] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = cleanKeyInput(keyInput);
    if (!cleanKey) {
      setError(t('auth.keyRequired', 'Please enter your Secret Access Key.'));
      return;
    }

    setLoading(true);
    setError(null);

    const result = await loginWithKey(cleanKey, nameInput.trim() || undefined);
    setLoading(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || t('auth.codeInvalid', 'Invalid or unrecognized Secret Access Key.'));
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setKeyInput(cleanKeyInput(text));
        setError(null);
      }
    } catch {
      // ignore clipboard permission error
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-[#111724] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 p-0.5 mx-auto shadow-lg shadow-indigo-600/30">
            <div className="w-full h-full rounded-[14px] bg-[#0f1422] flex items-center justify-center">
              <KeyRound className="w-6 h-6 text-indigo-400" />
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {t('auth.keyLoginTitle', 'Sign In with Secret Key')}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
            {t('auth.keyLoginSubtitle', 'Enter your 10-character Secret Access Key to authenticate and unlock GiveMePOD.')}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>{t('auth.enterAccessCode', 'Secret Access Key')}</span>
              <span className="text-[11px] font-normal text-slate-500 font-mono">10 Characters</span>
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={keyInput}
                onChange={e => {
                  setKeyInput(cleanKeyInput(e.target.value));
                  setError(null);
                }}
                onPaste={e => {
                  e.preventDefault();
                  const pasted = e.clipboardData.getData('text');
                  setKeyInput(cleanKeyInput(pasted));
                  setError(null);
                }}
                placeholder="XXXXXXXXXX"
                maxLength={24}
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                className="w-full h-12 pl-4 pr-20 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white font-mono text-sm tracking-widest placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors uppercase"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePasteFromClipboard}
                  className="p-1.5 text-slate-400 hover:text-indigo-400 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Paste from clipboard"
                >
                  <ClipboardPaste className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  title={showKey ? 'Hide key' : 'Show key'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              <span>{t('auth.nameOptional', 'Display Name or Brand (Optional)')}</span>
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              placeholder="e.g. My Brand"
              className="w-full h-11 px-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Authenticating Key...</span>
              </span>
            ) : (
              <>
                <span>{t('auth.loginBtn', 'Unlock Command Center')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Support & Key Inquiry */}
        <div className="pt-2 border-t border-slate-800/80 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <span>{t('auth.noKey', "Don't have a Secret Key?")}</span>
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenSupport) onOpenSupport();
            }}
            className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 flex items-center gap-1 cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{t('auth.contactSupportBtn', 'Contact Support')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

