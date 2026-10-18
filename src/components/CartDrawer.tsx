import React from 'react';
import { useStore } from '../context/StoreContext';
import { formatKz } from '../utils/security';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    setCurrentView,
    settings,
  } = useStore();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0F0F12] border-l border-white/10 flex flex-col justify-between shadow-2xl">
          {/* Cart Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-white">Carrinho de Compras</h2>
                <span className="text-xs text-slate-400">
                  {cart.length} {cart.length === 1 ? 'modelo' : 'modelos'} no carrinho
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#18181C] border border-white/10 flex items-center justify-center text-slate-500 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-base font-semibold text-white">O seu carrinho está vazio</p>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  Explore o nosso catálogo exclusivo e encomende o seu modelo preferido da BCB Shoes.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCurrentView('catalog');
                  }}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-black font-semibold text-xs tracking-wider uppercase cursor-pointer"
                >
                  Explorar Ténis
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 rounded-xl bg-[#141417] border border-white/5 hover:border-white/10 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-lg bg-[#18181C] p-2 shrink-0 flex items-center justify-center border border-white/5">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-contain filter drop-shadow"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-white leading-snug line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                          title="Remover item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                        <span>Tam: <strong className="text-white font-mono">{item.size}</strong></span>
                        <span>·</span>
                        <span className="truncate max-w-[120px]">{item.color}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-white/10 rounded-lg bg-[#18181C] px-1 py-0.5">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-xs text-slate-300 hover:text-white"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-mono font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-xs text-slate-300 hover:text-white"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <span className="font-mono text-xs font-bold gold-gradient-text tabular-nums">
                        {formatKz(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer / Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-[#121215] space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-white font-mono">{formatKz(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Estimativa de Envio (Luanda)</span>
                  <span className="text-white font-mono">{formatKz(settings.deliveryLuandaKz)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                  <span>Total Estimado</span>
                  <span className="font-mono gold-gradient-text text-base">
                    {formatKz(cartSubtotal + settings.deliveryLuandaKz)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-black/40 p-2.5 rounded-lg border border-white/5">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Encomenda garantida com confirmação e suporte via WhatsApp</span>
              </div>

              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full py-4 px-6 rounded-xl font-display font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C89B3C] text-black hover:opacity-95 shadow-lg shadow-[#D4AF37]/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Prosseguir para o Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
