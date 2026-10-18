import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatKz } from '../utils/security';
import {
  ShoppingBag,
  Zap,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  MessageCircle,
  Sparkles,
  Check,
} from 'lucide-react';

export const ProductDetailView: React.FC = () => {
  const {
    products,
    selectedProductId,
    setCurrentView,
    addToCart,
    setIsCartOpen,
    settings,
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number>(product?.sizes[0] || 41);
  const [selectedColor, setSelectedColor] = useState<string>(product?.colors[0] || 'Padrão');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-400">Produto não encontrado.</p>
        <button
          onClick={() => setCurrentView('catalog')}
          className="mt-4 px-6 py-2 rounded-lg bg-[#D4AF37] text-black font-semibold"
        >
          Voltar ao Catálogo
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setIsCartOpen(false);
    setCurrentView('checkout');
  };

  const handleAskWhatsApp = () => {
    const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Olá BCB Shoes! Gostaria de mais informações sobre o ténis: ${product.name} (Ref: ${product.sku}), tamanho ${selectedSize}.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb / Back button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setCurrentView('catalog')}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-[#D4AF37] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Catálogo de Ténis</span>
          </button>
          <span className="text-xs text-slate-400 font-mono">SKU: {product.sku}</span>
        </div>

        {/* 2-Column Contiguous Purchase Module */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Main Featured Photo */}
            <div className="relative aspect-[4/3] w-full rounded-2xl bg-[#141416] border border-white/10 overflow-hidden flex items-center justify-center p-6 shadow-2xl shadow-black">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] transition-all duration-300"
              />

              {/* Tag indicator */}
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-black/80 backdrop-blur-md border border-[#D4AF37]/30 text-xs font-semibold text-[#D4AF37]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Venda por Encomenda Oficial</span>
                </span>
              </div>
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 h-20 rounded-xl bg-[#141416] border p-2 shrink-0 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]'
                        : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.name} miniatura ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Trust and Authenticity Block */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-5 rounded-xl bg-[#111114] border border-white/5 mt-4">
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <span className="font-semibold block text-white">100% Autêntico</span>
                  <span className="text-[11px] text-slate-400">Verificação de qualidade</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <Truck className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <span className="font-semibold block text-white">Entrega Garantida</span>
                  <span className="text-[11px] text-slate-400">Luanda e Províncias</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <RotateCcw className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <span className="font-semibold block text-white">Acompanhamento</span>
                  <span className="text-[11px] text-slate-400">Via WhatsApp direto</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-28">
            <div>
              {/* Category & Brand */}
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-2">
                <span>{product.brand}</span>
                <span>·</span>
                <span className="text-slate-400">{product.category}</span>
              </div>

              {/* Title */}
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-4">
                <span className="font-mono text-3xl font-extrabold gold-gradient-text tabular-nums">
                  {formatKz(product.price)}
                </span>
                <span className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                  {product.stock > 0 ? `${product.stock} pares disponíveis` : 'Sob Reserva'}
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-1">
                Tempo estimado para encomenda: <strong className="text-white">{product.preOrderEstimatedDays || '7 - 12 dias úteis'}</strong>
              </p>
            </div>

            {/* Description */}
            <div className="text-sm text-slate-300 leading-relaxed border-t border-b border-white/10 py-4">
              <p>{product.description}</p>
            </div>

            {/* Color selection */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-2">
                Cor Selecionada: <span className="text-[#D4AF37] font-normal">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      selectedColor === color
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white shadow-sm ring-1 ring-[#D4AF37]'
                        : 'border-white/10 bg-[#161619] text-slate-400 hover:text-white'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs uppercase tracking-wider text-slate-300 font-semibold">
                  Tamanho Europeu (EU): <span className="text-[#D4AF37] font-normal">{selectedSize}</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowSizeGuide(!showSizeGuide)}
                  className="text-xs text-slate-400 hover:text-[#D4AF37] underline decoration-slate-600 transition-colors cursor-pointer"
                >
                  Guia de tamanhos
                </button>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 rounded-xl text-sm font-mono font-medium border transition-all cursor-pointer ${
                      selectedSize === size
                        ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-bold shadow-md shadow-[#D4AF37]/20'
                        : 'bg-[#161619] text-slate-300 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Guide Modal / Dropdown */}
            {showSizeGuide && (
              <div className="p-4 rounded-xl bg-[#141417] border border-[#D4AF37]/30 text-xs text-slate-300 animate-in fade-in duration-150">
                <div className="flex items-center justify-between font-semibold text-white mb-2 pb-2 border-b border-white/10">
                  <span>Tabela de Correspondência de Tamanhos</span>
                  <button onClick={() => setShowSizeGuide(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center py-1 font-mono text-[11px]">
                  <div className="text-slate-400">EU</div>
                  <div className="text-slate-400">US</div>
                  <div className="text-slate-400">UK</div>
                  <div className="text-slate-400">CM</div>
                  <div>39</div><div>6.5</div><div>6.0</div><div>24.5 cm</div>
                  <div>40</div><div>7.5</div><div>7.0</div><div>25.0 cm</div>
                  <div>41</div><div>8.0</div><div>7.5</div><div>26.0 cm</div>
                  <div>42</div><div>8.5</div><div>8.0</div><div>26.5 cm</div>
                  <div>43</div><div>9.5</div><div>9.0</div><div>27.5 cm</div>
                  <div>44</div><div>10.0</div><div>9.5</div><div>28.0 cm</div>
                  <div>45</div><div>11.0</div><div>10.5</div><div>29.0 cm</div>
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div className="flex items-center gap-4">
              <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold">
                Quantidade:
              </span>
              <div className="flex items-center border border-white/10 rounded-xl bg-[#161619] p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:bg-white/10 transition-colors"
                >
                  -
                </button>
                <span className="w-10 text-center font-mono font-bold text-sm text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:bg-white/10 transition-colors"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-slate-400">
                Total:{' '}
                <strong className="text-white font-mono">{formatKz(product.price * quantity)}</strong>
              </span>
            </div>

            {/* Required Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 py-4 px-6 rounded-xl font-semibold text-sm border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isAdded
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-[#1C1C20] hover:bg-[#25252A] text-white border-white/20 hover:border-[#D4AF37]/50'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Adicionado ao Carrinho</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                    <span>Adicionar ao Carrinho</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 py-4 px-6 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C89B3C] text-black hover:opacity-95 shadow-lg shadow-[#D4AF37]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>Comprar Agora</span>
              </button>
            </div>

            {/* Direct WhatsApp Consultation button */}
            <button
              type="button"
              onClick={handleAskWhatsApp}
              className="w-full py-3 px-4 rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Tirar Dúvidas sobre este Ténis no WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
