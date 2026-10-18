import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { formatKz } from '../utils/security';
import { ShoppingBag, Zap, Eye, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProductId, setCurrentView, addToCart, setIsCartOpen } = useStore();
  const [selectedSize, setSelectedSize] = useState<number>(product.sizes[0] || 41);
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || 'Padrão');
  const [justAdded, setJustAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedSize, selectedColor, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedSize, selectedColor, 1);
    setIsCartOpen(false);
    setCurrentView('checkout');
  };

  const handleOpenDetail = () => {
    setSelectedProductId(product.id);
    setCurrentView('product-detail');
  };

  return (
    <div
      onClick={handleOpenDetail}
      className="group relative flex flex-col bg-[#111113] rounded-2xl border border-white/5 hover:border-[#D4AF37]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/60 overflow-hidden cursor-pointer"
    >
      {/* Sneaker Image Frame */}
      <div className="relative aspect-[4/3] w-full bg-[#161619] overflow-hidden flex items-center justify-center p-4">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-500 text-xs">
            <span>Imagem do modelo</span>
          </div>
        )}

        {/* Quiet metadata tag (Anti-pill: single unobtrusive label) */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {product.isBestSeller && (
            <span className="text-[10px] uppercase tracking-wider font-semibold text-black bg-[#D4AF37] px-2 py-0.5 rounded">
              Mais Vendido
            </span>
          )}
          {product.isFeatured && !product.isBestSeller && (
            <span className="text-[10px] uppercase tracking-wider font-medium text-slate-300 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
              Destaque
            </span>
          )}
        </div>

        {/* Hover Quick View Button */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenDetail();
            }}
            className="p-2 rounded-full bg-black/80 hover:bg-[#D4AF37] text-white hover:text-black border border-white/10 transition-colors"
            title="Ver Detalhes"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          {/* Brand & Category line */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="uppercase tracking-widest text-[#D4AF37] font-medium text-[11px]">
              {product.brand}
            </span>
            <span className="text-slate-500 text-[11px]">{product.category}</span>
          </div>

          {/* Product Name */}
          <h3 className="text-base font-semibold text-white group-hover:text-[#F3E5AB] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>

          {/* Price & Stock status */}
          <div className="flex items-baseline justify-between mt-3 pt-3 border-t border-white/5">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Preço</span>
              <span className="text-lg font-bold text-white font-mono tabular-nums gold-gradient-text">
                {formatKz(product.price)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-emerald-400 font-medium block">
                {product.stock > 0 ? `${product.stock} disponíveis` : 'Esgotado'}
              </span>
              <span className="text-[10px] text-slate-400">Por encomenda</span>
            </div>
          </div>

          {/* Quick Size and Color Selector */}
          <div className="mt-3.5 pt-3 border-t border-white/5 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Tamanho:</span>
              <div className="flex items-center gap-1 overflow-x-auto py-0.5 no-scrollbar">
                {product.sizes.slice(0, 5).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSize(size);
                    }}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                      selectedSize === size
                        ? 'bg-[#D4AF37] text-black font-bold'
                        : 'bg-[#1C1C1F] text-slate-300 hover:text-white border border-white/5'
                    }`}
                  >
                    {size}
                  </button>
                ))}
                {product.sizes.length > 5 && (
                  <span className="text-[9px] text-slate-400">+{product.sizes.length - 5}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Required Functional Action Buttons: "Comprar agora" & "Adicionar ao carrinho" */}
        <div className="grid grid-cols-2 gap-2 mt-1 pt-2">
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              justAdded
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-[#1C1C20] hover:bg-[#25252A] text-slate-200 border-white/10 hover:border-[#D4AF37]/50'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Adicionado</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="truncate">Adicionar</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            disabled={product.stock <= 0}
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#D4AF37] to-[#B89228] text-black hover:opacity-95 shadow-md shadow-[#D4AF37]/20 transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-black" />
            <span className="truncate">Comprar agora</span>
          </button>
        </div>
      </div>
    </div>
  );
};
