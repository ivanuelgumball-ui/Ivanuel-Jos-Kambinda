import React from 'react';
import { useStore } from '../context/StoreContext';
import { bcbWelcomeImg } from '../data/initialData';
import { ArrowRight, Sparkles, ShieldCheck, Download } from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const { setCurrentView } = useStore();

  return (
    <div className="relative min-h-screen w-full bg-[#080809] flex flex-col items-center justify-between overflow-hidden select-none">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-[#070708]">
        {/* Exact owner image used as background, maintaining aspect ratio without distortion */}
        <img
          src={bcbWelcomeImg}
          alt="BCB Shoes - Vendas de Ténis por Encomenda"
          className="w-full h-full object-contain md:object-cover max-w-7xl mx-auto filter brightness-[0.88] contrast-[1.05]"
          loading="eager"
        />

        {/* Measured dark luxury gradient overlay for maximum legibility without hiding the emblem */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080809] via-black/40 to-[#080809]/80 backdrop-blur-[1px]" />

        {/* Subtle decorative gold ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none" />
      </div>

      {/* Top Header Tag */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-display text-xl md:text-2xl font-bold tracking-wider gold-gradient-text">
            BCB SHOES
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400">
          <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
          <span>Exclusividade & Luxo</span>
        </div>
      </header>

      {/* Main Welcome Message Overlay */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-6 py-12 flex flex-col items-center text-center my-auto">
        {/* Subtle decorative gold badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-black/60 backdrop-blur-md mb-6 shadow-lg shadow-black/50">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#E5E7EB] font-medium">
            Coleção Oficial & Encomendas Selecionadas
          </span>
        </div>

        {/* Required Welcome Titles */}
        <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-wide uppercase text-white mb-4 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
          <span className="block text-white">BEM-VINDO À</span>
          <span className="gold-gradient-text tracking-wider">BCB SHOES</span>
        </h1>

        <p className="text-base sm:text-xl md:text-2xl text-slate-200 font-light tracking-widest uppercase mb-10 max-w-2xl drop-shadow-md">
          “Vendas de ténis por encomenda”
        </p>

        {/* Required Big Elegant Entrance Button */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => setCurrentView('home')}
            className="group relative inline-flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-4 md:py-5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C59B27] text-black font-display font-bold text-base md:text-lg tracking-wider uppercase shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_45px_rgba(212,175,55,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
          >
            <span>ENTRAR NA LOJA</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
          </button>
        </div>

        {/* Quick ZIP file download button */}
        <div className="mt-4">
          <a
            href="/bcb-shoes.zip"
            download="bcb-shoes.zip"
            className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-[#D4AF37] transition-colors bg-black/60 hover:bg-black/80 px-4 py-2 rounded-xl border border-white/10 shadow-md"
            title="Descarregar ficheiro ZIP completo do projeto"
          >
            <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Descarregar Código Completo (.ZIP)</span>
          </a>
        </div>
      </main>

      {/* Bottom Footer Trust Indicators */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-6">
          <span>Angola: Luanda & Províncias</span>
          <span>·</span>
          <span>WhatsApp: +244 955 730 067</span>
        </div>
        <div className="flex items-center gap-4 text-slate-500">
          <span>Preto · Dourado · Prateado</span>
          <span>·</span>
          <span>100% Autêntico</span>
        </div>
      </footer>
    </div>
  );
};
