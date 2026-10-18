import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, User, Lock, Mail, Phone, ShieldCheck, Sparkles } from 'lucide-react';

export const AuthView: React.FC = () => {
  const { loginUser, registerUser, setCurrentView } = useStore();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login form
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Register form
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('+244 ');
  const [regPassword, setRegPassword] = useState('');
  const [regProvince, setRegProvince] = useState('Luanda');
  const [regAddress, setRegAddress] = useState('');
  const [regError, setRegError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);
    const result = await loginUser(loginIdentifier, loginPassword);
    setIsSubmitting(false);
    if (result.success) {
      setCurrentView('account');
    } else {
      setLoginError(result.message || 'Erro ao iniciar sessão.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (regPassword.length < 6) {
      setRegError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsSubmitting(true);
    const result = await registerUser({
      fullName: regFullName,
      username: regUsername,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      province: regProvince,
      address: regAddress,
    });
    setIsSubmitting(false);

    if (result.success) {
      setCurrentView('account');
    } else {
      setRegError(result.message || 'Erro ao criar conta.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto">
        {/* Back Link */}
        <button
          onClick={() => setCurrentView('home')}
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-[#D4AF37] mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar à Loja</span>
        </button>

        {/* Brand Card */}
        <div className="bg-[#111114] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center">
            <span className="font-display font-bold text-xl gold-gradient-text tracking-wider">
              BCB SHOES
            </span>
            <h2 className="font-display text-xl font-extrabold text-white mt-1">
              {mode === 'login' ? 'Entrar na sua Conta' : 'Criar Nova Conta'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Aceda ao seu histórico de compras e acompanhamento de encomendas.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#18181C] rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setLoginError('');
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B89228] text-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Iniciar Sessão
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setRegError('');
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B89228] text-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Criar Conta
            </button>
          </div>

          {/* Login Form */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {loginError}
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-medium">
                  Nome de Usuário ou Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="carlos.silva ou email"
                    className="w-full bg-[#18181C] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-medium">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#18181C] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89228] text-black font-display font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-md shadow-[#D4AF37]/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'A Autenticar...' : 'ENTRAR NA CONTA'}
              </button>

              <div className="pt-2 text-center">
                <span className="text-[11px] text-slate-400">
                  Conta de demonstração: <strong>carlos.silva</strong> / <strong>Bentinho</strong>
                </span>
              </div>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {regError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {regError}
                </div>
              )}

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1 font-medium">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="Ex: Carlos Silva"
                  className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1 font-medium">
                  Nome de Usuário (Username) *
                </label>
                <input
                  type="text"
                  required
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="Ex: carlossilva"
                  className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
                <span className="text-[10px] text-slate-400">
                  Cada pedido ficará permanentemente associado a este nome.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1 font-medium">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="exemplo@gmail.com"
                    className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1 font-medium">
                    WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+244 923 000 000"
                    className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1 font-medium">
                  Senha * (mínimo 6 caracteres)
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1 font-medium">
                    Província
                  </label>
                  <select
                    value={regProvince}
                    onChange={(e) => setRegProvince(e.target.value)}
                    className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Luanda">Luanda</option>
                    <option value="Benguela">Benguela</option>
                    <option value="Huíla">Huíla</option>
                    <option value="Huambo">Huambo</option>
                    <option value="Outra">Outra</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1 font-medium">
                    Endereço
                  </label>
                  <input
                    type="text"
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    placeholder="Bairro / Rua"
                    className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89228] text-black font-display font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-md shadow-[#D4AF37]/20 transition-all cursor-pointer disabled:opacity-50 mt-2"
              >
                {isSubmitting ? 'A Registar...' : 'CRIAR CONTA NA BCB SHOES'}
              </button>
            </form>
          )}

          {/* Secure Guarantee */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-2 border-t border-white/5">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>Segurança garantida com encriptação criptográfica</span>
          </div>
        </div>
      </div>
    </div>
  );
};
