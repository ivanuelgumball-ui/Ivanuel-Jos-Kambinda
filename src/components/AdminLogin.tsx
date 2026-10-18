import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Shield, Lock, Mail, ArrowLeft, KeyRound } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, setCurrentView } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const success = await loginAdmin(email, password);
    setIsSubmitting(false);

    if (success) {
      setCurrentView('admin-panel');
    } else {
      setErrorMsg('Email ou senha de administrador incorretos.');
    }
  };

  return (
    <div className="min-h-screen bg-[#08080A] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto">
        <button
          onClick={() => setCurrentView('home')}
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-[#D4AF37] mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar à Loja Principal</span>
        </button>

        <div className="bg-[#121215] border border-[#D4AF37]/30 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#1C1C20] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mx-auto shadow-md">
              <Shield className="w-7 h-7" />
            </div>
            <span className="font-display font-bold text-xs gold-gradient-text tracking-[0.25em] uppercase block">
              Acesso Restrito
            </span>
            <h2 className="font-display text-xl font-extrabold text-white">
              Painel Administrativo BCB Shoes
            </h2>
            <p className="text-xs text-slate-400">
              Autenticação protegida por chave criptográfica para gestão de encomendas e produtos.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5 font-medium">
                Email de Administrador
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agnelocastelobranco@gmail.com"
                  className="w-full bg-[#18181C] border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5 font-medium">
                Senha de Acesso
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#18181C] border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89228] text-black font-display font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-lg shadow-[#D4AF37]/20 transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {isSubmitting ? 'A Validar Credenciais...' : 'ENTRAR NO PAINEL ADM'}
            </button>
          </form>

          <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <KeyRound className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Acesso Inicial Autorizado:</span>
            </div>
            <p className="truncate">Email: <span className="text-white font-mono">agnelocastelobranco@gmail.com</span></p>
            <p className="text-[10px] text-slate-500">
              A senha informada na especificação do projeto é processada através de hash seguro SHA-256.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
