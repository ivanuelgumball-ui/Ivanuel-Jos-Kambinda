import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Clock } from 'lucide-react';
import adizeroBlackSilverImg from '../assets/images/adizero_black_silver_1792277988474.jpg';

export const HeroBanner: React.FC = () => {
  const { setCurrentView, setSelectedProductId } = useStore();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0E0E11] via-[#0A0A0C] to-[#0B0B0C] border-b border-white/5 py-12 md:py-20">
      {/* Decorative ambient radial glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-slate-400/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text Zone (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18181C] border border-[#D4AF37]/30 text-xs text-[#E5E7EB]">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="uppercase tracking-widest text-[11px] font-semibold">
                Edição 2026 · Vendas Por Encomenda
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              A Exclusividade nos <br />
              Seus Pés com a <br />
              <span className="gold-gradient-text tracking-wide">BCB SHOES</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Descubra os modelos mais procurados mundialmente, desde silhuetas de alta performance como o <strong>Adidas Adizero EVO SL</strong> a clássicos retro e edições limitadas. Encomende com total comodidade e receba em qualquer ponto de Angola.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setCurrentView('catalog')}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C89B3C] text-black font-display font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-xl shadow-[#D4AF37]/25 flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Explorar Todos os Ténis</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setSelectedProductId('prod-adizero-black-silver');
                  setCurrentView('product-detail');
                }}
                className="px-6 py-4 rounded-xl bg-[#18181C] hover:bg-[#222227] text-white border border-white/10 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Ver Lançamento EVO SL
              </button>
            </div>

            {/* Trust markers */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>100% Autêntico</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Envios para Angola</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Prazos Transparentes</span>
              </div>
            </div>
          </div>

          {/* Right Showcase Visual (5 cols) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl bg-gradient-to-br from-[#16161A] to-[#0D0D0F] border border-white/10 p-6 flex items-center justify-center shadow-2xl shadow-black group">
              <img
                src={adizeroBlackSilverImg}
                alt="Adidas Adizero EVO SL Black Silver"
                className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              {/* Floating product card pill */}
              <div className="absolute -bottom-4 -left-4 sm:left-4 bg-[#141418]/90 backdrop-blur-md border border-[#D4AF37]/40 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Disponível</span>
                  <span className="text-xs font-semibold text-white block">Adizero EVO SL Onyx</span>
                </div>
                <span className="font-mono text-xs font-bold gold-gradient-text tabular-nums ml-2">
                  85.000 Kz
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
