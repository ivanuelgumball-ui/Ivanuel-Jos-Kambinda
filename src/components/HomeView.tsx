import React from 'react';
import { useStore } from '../context/StoreContext';
import { HeroBanner } from './HeroBanner';
import { ProductCard } from './ProductCard';
import { formatKz } from '../utils/security';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  MessageCircle,
  Sparkles,
  Zap,
  Flame,
} from 'lucide-react';
import bcbWelcomeImg from '../assets/images/bcb_welcome_screen_1792277986708.jpg';

export const HomeView: React.FC = () => {
  const { products, setCurrentView, setActiveCategory, settings } = useStore();

  const activeProducts = products.filter((p) => p.isActive);
  const featuredProducts = activeProducts.filter((p) => p.isFeatured).slice(0, 4);
  const bestSellers = activeProducts.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-slate-200">
      {/* 1. Hero Campaign Banner */}
      <HeroBanner />

      {/* 2. Categorias Principais de Ténis */}
      <section className="py-12 border-b border-white/5 bg-[#0D0D10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-semibold block">
                Navegação Rápida
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white mt-0.5">
                Categorias Selecionadas
              </h2>
            </div>
            <button
              onClick={() => setCurrentView('catalog')}
              className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver todas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                title: 'Performance & Corrida',
                count: activeProducts.filter((p) => p.category === 'Performance & Corrida').length,
                desc: 'Adizero, EVO SL & Maratona',
              },
              {
                title: 'Retro & Chunky',
                count: activeProducts.filter((p) => p.category === 'Retro & Chunky').length,
                desc: 'Estilo anos 2000 & Metálicos',
              },
              {
                title: 'Casual & Streetwear',
                count: activeProducts.filter((p) => p.category === 'Casual & Streetwear').length,
                desc: 'Urbano, Versátil e Confortável',
              },
              {
                title: 'Edição Limitada',
                count: activeProducts.filter((p) => p.category === 'Edição Limitada').length,
                desc: 'Colecionador & Ouro/Prata',
              },
            ].map((cat, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveCategory(cat.title);
                  setCurrentView('catalog');
                }}
                className="group p-5 rounded-2xl bg-[#141418] border border-white/5 hover:border-[#D4AF37]/50 transition-all text-left flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg hover:shadow-black/60 cursor-pointer"
              >
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">
                    {cat.count} {cat.count === 1 ? 'modelo' : 'modelos'}
                  </span>
                  <h3 className="font-display font-semibold text-sm text-white group-hover:text-[#F3E5AB] transition-colors mt-1">
                    {cat.title}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-white/5">
                  {cat.desc}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Produtos em Destaque */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Seleção Exclusiva</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Produtos em Destaque
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('catalog')}
            className="text-xs font-semibold text-slate-300 hover:text-[#D4AF37] flex items-center gap-1.5 cursor-pointer"
          >
            <span>Ver Todo o Catálogo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Luxury Brand Story / Banner Callout */}
      <section className="py-14 bg-gradient-to-r from-[#111115] via-[#16140D] to-[#111115] border-y border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-64 h-80 rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl bg-black">
                <img
                  src={bcbWelcomeImg}
                  alt="BCB Shoes Identidade Visual"
                  className="w-full h-full object-cover filter brightness-95 contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-center">
                  <span className="font-display text-xs font-bold gold-gradient-text uppercase tracking-widest">
                    Identidade Oficial BCB Shoes
                  </span>
                </div>
              </div>
            </div>

            {/* Explanation & Value Prop */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                Luxo · Confiança · Exclusividade
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                Como Funciona a Venda de Ténis Por Encomenda?
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                A <strong>BCB Shoes</strong> especializa-se na importação direta de calçado desportivo e de luxo sob encomenda prévia para clientes exigentes em Angola. Garantimos autenticidade absoluta em cada par, embalagem original e rastreio permanente até à entrega na sua morada em Luanda ou províncias.
              </p>

              {/* 3 Step Flow */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <span className="font-mono text-sm font-bold text-[#D4AF37]">01. Escolha</span>
                  <p className="text-xs text-slate-300">Escolha o modelo, tamanho (EU) e cor desejada na loja.</p>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <span className="font-mono text-sm font-bold text-[#D4AF37]">02. Validação</span>
                  <p className="text-xs text-slate-300">Efetue o pagamento por MCX Express ou transferência bancária.</p>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <span className="font-mono text-sm font-bold text-[#D4AF37]">03. WhatsApp</span>
                  <p className="text-xs text-slate-300">Confirmação direta e suporte no WhatsApp oficial.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Produtos Mais Vendidos */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] font-semibold uppercase tracking-wider mb-1">
              <Flame className="w-3.5 h-3.5" />
              <span>Mais Procurados</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Ténis Mais Vendidos
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('catalog')}
            className="text-xs font-semibold text-slate-300 hover:text-[#D4AF37] flex items-center gap-1.5 cursor-pointer"
          >
            <span>Ver Todos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};
