import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShoppingBag,
  User as UserIcon,
  Search,
  Menu,
  X,
  Shield,
  Sparkles,
  Download,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cartItemCount,
    setIsCartOpen,
    currentUser,
    adminUser,
    searchQuery,
    setSearchQuery,
    setActiveCategory,
  } = useStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: 'home' | 'catalog') => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setCurrentView('catalog');
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Promotional Announcement Banner */}
      <div className="bg-gradient-to-r from-[#121214] via-[#1E1B10] to-[#121214] border-b border-[#D4AF37]/20 text-[#E5E7EB] text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="text-[#D4AF37]">✨</span>
            <span className="truncate">
              Vendas de ténis por encomenda em Angola · Luanda e todas as províncias · Entregas seguras
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px] text-slate-400 shrink-0">
            <span>WhatsApp Oficial: <strong className="text-[#D4AF37] font-semibold">+244 955 730 067</strong></span>
            <span>·</span>
            <button
              onClick={() => setCurrentView('welcome')}
              className="hover:text-white transition-colors underline decoration-[#D4AF37]/50 cursor-pointer"
            >
              Tela Inicial
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Bar */}
      <header className="sticky top-0 z-40 bg-[#0B0B0C]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1C1C1F] to-[#0A0A0B] border border-[#D4AF37]/40 flex items-center justify-center shadow-md shadow-black/50 group-hover:border-[#D4AF37] transition-colors">
                <span className="font-display font-extrabold text-lg gold-gradient-text">
                  BCB
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg md:text-xl tracking-wider text-white group-hover:text-[#F3E5AB] transition-colors leading-none">
                  BCB SHOES
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase text-slate-400 font-medium">
                  Vendas Por Encomenda
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (single-line, clean prose) */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
            <button
              onClick={() => handleNavClick('home')}
              className={`hover:text-[#D4AF37] transition-colors whitespace-nowrap cursor-pointer ${
                currentView === 'home' ? 'text-[#D4AF37] font-semibold' : ''
              }`}
            >
              Início
            </button>
            <button
              onClick={() => handleNavClick('catalog')}
              className={`hover:text-[#D4AF37] transition-colors whitespace-nowrap cursor-pointer ${
                currentView === 'catalog' ? 'text-[#D4AF37] font-semibold' : ''
              }`}
            >
              Catálogo de Ténis
            </button>
            <button
              onClick={() => handleCategoryClick('Performance & Corrida')}
              className="hover:text-[#D4AF37] transition-colors whitespace-nowrap cursor-pointer"
            >
              Corrida & Performance
            </button>
            <button
              onClick={() => handleCategoryClick('Retro & Chunky')}
              className="hover:text-[#D4AF37] transition-colors whitespace-nowrap cursor-pointer"
            >
              Retro & Chunky
            </button>
            <button
              onClick={() => {
                if (currentUser) {
                  setCurrentView('account');
                } else {
                  setCurrentView('login');
                }
              }}
              className="hover:text-[#D4AF37] transition-colors whitespace-nowrap cursor-pointer"
            >
              Meus Pedidos
            </button>
          </nav>

          {/* Zone 3: Interactive Affordances (Search, Account, Cart) */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Search Input toggle */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="flex items-center bg-[#18181B] border border-[#D4AF37]/50 rounded-lg px-2.5 py-1.5 w-44 sm:w-64 transition-all">
                  <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setCurrentView('catalog');
                      }
                    }}
                    placeholder="Pesquisar ténis..."
                    autoFocus
                    className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none w-full"
                  />
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="text-slate-400 hover:text-white ml-1 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsSearchOpen(true);
                  }}
                  aria-label="Abrir pesquisa"
                  className="p-2.5 rounded-lg text-slate-300 hover:text-[#D4AF37] hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Customer Account Button */}
            <button
              onClick={() => {
                if (currentUser) {
                  setCurrentView('account');
                } else {
                  setCurrentView('login');
                }
              }}
              aria-label="Conta do cliente"
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-[#D4AF37] hover:bg-white/5 transition-colors cursor-pointer text-xs"
            >
              <UserIcon className="w-4 h-4" />
              <span>{currentUser ? `@${currentUser.username}` : 'Entrar / Conta'}</span>
            </button>

            {/* Direct ZIP Download Button */}
            <a
              href="/bcb-shoes.zip"
              download="bcb-shoes.zip"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-bold transition-all shadow-sm"
              title="Descarregar ficheiro ZIP do site (5.7 MB)"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Baixar ZIP</span>
            </a>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Abrir carrinho de compras"
              className="relative flex items-center justify-center p-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-black hover:opacity-95 transition-all cursor-pointer shadow-md shadow-[#D4AF37]/20"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-white text-black font-bold text-[11px] rounded-full w-5 h-5 flex items-center justify-center shadow-lg border border-black">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Admin Access Indicator if logged in */}
            {adminUser && (
              <button
                onClick={() => setCurrentView('admin-panel')}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs hover:bg-amber-500/20 transition-colors"
                title="Aceder ao Painel Administrativo"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>ADM</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white lg:hidden cursor-pointer"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-[#D4AF37]" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#0E0E10] px-6 py-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left py-2 text-base font-medium text-white hover:text-[#D4AF37]"
            >
              Início
            </button>
            <button
              onClick={() => handleNavClick('catalog')}
              className="text-left py-2 text-base font-medium text-white hover:text-[#D4AF37]"
            >
              Catálogo de Ténis
            </button>
            <div className="pt-2 pb-1 border-t border-white/10 text-xs uppercase tracking-wider text-slate-400">
              Categorias
            </div>
            <button
              onClick={() => handleCategoryClick('Performance & Corrida')}
              className="text-left py-1 text-sm text-slate-300 hover:text-[#D4AF37]"
            >
              Corrida & Performance
            </button>
            <button
              onClick={() => handleCategoryClick('Retro & Chunky')}
              className="text-left py-1 text-sm text-slate-300 hover:text-[#D4AF37]"
            >
              Retro & Chunky
            </button>
            <button
              onClick={() => handleCategoryClick('Edição Limitada')}
              className="text-left py-1 text-sm text-slate-300 hover:text-[#D4AF37]"
            >
              Edição Limitada
            </button>
            <div className="pt-3 border-t border-white/10 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (currentUser) {
                    setCurrentView('account');
                  } else {
                    setCurrentView('login');
                  }
                }}
                className="flex items-center gap-2 py-2 text-sm text-white"
              >
                <UserIcon className="w-4 h-4 text-[#D4AF37]" />
                <span>{currentUser ? `Minha Conta (@${currentUser.username})` : 'Entrar / Criar Conta'}</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCurrentView('admin-login');
                }}
                className="flex items-center gap-2 py-2 text-xs text-slate-400 hover:text-amber-300"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Acesso Painel ADM</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
