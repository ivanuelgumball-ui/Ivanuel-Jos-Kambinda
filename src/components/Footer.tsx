import React from 'react';
import { useStore } from '../context/StoreContext';
import { MessageCircle, Shield, MapPin, Mail, Sparkles, Download } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, settings, setActiveCategory } = useStore();

  const handleWhatsAppDirect = () => {
    const clean = settings.whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${clean}?text=Ol%C3%A1%20BCB%20Shoes!%20Gostaria%20de%20fazer%20uma%20encomenda%20de%20t%C3%A9nis.`, '_blank');
  };

  return (
    <footer className="bg-[#070709] border-t border-white/10 text-slate-400 text-xs pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#18181C] border border-[#D4AF37]/50 flex items-center justify-center font-display font-bold text-sm gold-gradient-text">
                BCB
              </div>
              <span className="font-display font-bold text-lg tracking-wider text-white">
                BCB SHOES
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Loja premium especializada na importação e venda de ténis por encomenda para clientes exigentes em toda Angola.
            </p>
            <div className="pt-1">
              <button
                onClick={handleWhatsAppDirect}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] text-xs font-semibold transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-[#25D366]" />
                <span>+244 955 730 067</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white">
              Navegação
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setCurrentView('home')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Página Inicial
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('catalog')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Catálogo Completo
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('welcome')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Tela de Boas-Vindas
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('account')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Meus Pedidos & Conta
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white">
              Categorias
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    setActiveCategory('Performance & Corrida');
                    setCurrentView('catalog');
                  }}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Performance & Corrida
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveCategory('Retro & Chunky');
                    setCurrentView('catalog');
                  }}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Retro & Chunky
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveCategory('Casual & Streetwear');
                    setCurrentView('catalog');
                  }}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Casual & Streetwear
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveCategory('Edição Limitada');
                    setCurrentView('catalog');
                  }}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Edição Limitada
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Administration */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white">
              Atendimento & Luanda
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Luanda, Angola · Envio para todas as províncias</span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>agnelocastelobranco@gmail.com</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex flex-col gap-2">
              <button
                onClick={() => setCurrentView('admin-login')}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-amber-400 transition-colors cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Área Restrita (Painel ADM)</span>
              </button>
              <a
                href="/bcb-shoes.zip"
                download="bcb-shoes-project.zip"
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#D4AF37] transition-colors"
                title="Descarregar ficheiro zip com todo o código fonte e imagens"
              >
                <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Descarregar Ficheiro ZIP</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright & identity notice */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} BCB Shoes. Todos os direitos reservados. Vendas de ténis por encomenda.</p>
          <div className="flex items-center gap-3">
            <span>Preto</span>
            <span>·</span>
            <span className="text-[#D4AF37]">Dourado</span>
            <span>·</span>
            <span className="text-slate-300">Prateado</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
