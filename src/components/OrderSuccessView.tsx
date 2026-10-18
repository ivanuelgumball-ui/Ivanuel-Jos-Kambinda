import React from 'react';
import { useStore } from '../context/StoreContext';
import { formatKz, formatDate } from '../utils/security';
import {
  CheckCircle,
  MessageCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';

export const OrderSuccessView: React.FC = () => {
  const {
    selectedOrder,
    setCurrentView,
    openWhatsAppForOrder,
    sendPaidConfirmationToWhatsApp,
  } = useStore();

  if (!selectedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-400">Nenhum pedido selecionado recentemente.</p>
        <button
          onClick={() => setCurrentView('catalog')}
          className="mt-4 px-6 py-2.5 rounded-xl bg-[#D4AF37] text-black font-semibold text-xs"
        >
          Voltar à Loja
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0C] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#111114] border border-[#D4AF37]/30 text-center space-y-6 shadow-2xl">
          {/* Success Check Icon */}
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-semibold">
              Registo Efetuado com Sucesso
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Obrigado pela sua encomenda na BCB Shoes!
            </h1>
            <p className="text-sm text-slate-300 max-w-lg mx-auto mt-2">
              O seu pedido foi registado no sistema. A nossa equipa irá validar a sua transação para iniciar a encomenda.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="p-5 rounded-2xl bg-[#16161A] border border-white/10 text-left space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <span className="text-xs text-slate-400 block">Número do Pedido</span>
                <span className="font-mono text-base font-bold text-white select-all">
                  {selectedOrder.orderNumber}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Data de Registo</span>
                <span className="text-xs text-slate-300">{formatDate(selectedOrder.createdAt)}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Estado do Pagamento</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
                  <Clock className="w-3 h-3" />
                  <span>{selectedOrder.paymentStatus}</span>
                </span>
              </div>
            </div>

            {/* Customer info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div>
                <span className="text-slate-400 block">Cliente:</span>
                <strong className="text-white">{selectedOrder.customerName}</strong> (@{selectedOrder.username})
              </div>
              <div>
                <span className="text-slate-400 block">Contacto:</span>
                <strong className="text-white">{selectedOrder.customerPhone}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Entrega:</span>
                <span>{selectedOrder.deliveryCity}, {selectedOrder.deliveryProvince}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Total a Pagar:</span>
                <strong className="gold-gradient-text text-sm font-mono">{formatKz(selectedOrder.total)}</strong>
              </div>
            </div>

            {/* Purchased Items List */}
            <div className="pt-3 border-t border-white/5 space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                Itens Encomendados
              </span>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-8 h-8 object-contain rounded bg-[#101012] border border-white/5 p-0.5"
                    />
                    <span className="text-white">{item.productName}</span>
                    <span className="text-slate-400">(Tam: {item.size}) x{item.quantity}</span>
                  </div>
                  <span className="font-mono text-slate-300">{formatKz(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Prominent PAGO Button that goes directly to WhatsApp +244 955 730 067 with preview link */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#17251C] via-[#102016] to-[#17251C] border-2 border-[#25D366]/40 text-center space-y-3 shadow-xl">
            <span className="text-xs text-[#25D366] uppercase tracking-wider font-semibold block">
              ⚡ Confirmação Imediata de Pagamento
            </span>
            <p className="text-xs text-slate-300">
              Já realizou o pagamento via Multicaixa Express ou Transferência? Clique no botão abaixo para enviar a confirmação e o link de pré-visualização diretamente para a BCB Shoes:
            </p>

            <button
              onClick={() => sendPaidConfirmationToWhatsApp(selectedOrder)}
              className="w-full sm:w-auto px-10 py-4 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-black font-display font-extrabold text-base tracking-wider uppercase flex items-center justify-center gap-3 transition-all cursor-pointer shadow-[0_0_25px_rgba(37,211,102,0.4)] hover:shadow-[0_0_35px_rgba(37,211,102,0.6)] hover:scale-[1.02] active:scale-[0.98] mx-auto"
            >
              <MessageCircle className="w-5 h-5 fill-black text-[#25D366]" />
              <span>PAGO</span>
              <span className="text-xs font-normal opacity-90 hidden sm:inline">(Enviar no WhatsApp +244 955 730 067)</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {/* View Orders Button */}
            <button
              onClick={() => setCurrentView('account')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#1C1C20] hover:bg-[#25252A] text-white border border-white/10 text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
              <span>Ver os Meus Pedidos</span>
            </button>

            <button
              onClick={() => setCurrentView('catalog')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-transparent hover:bg-white/5 text-slate-300 border border-white/10 text-xs font-semibold tracking-wider uppercase cursor-pointer"
            >
              Continuar a Comprar
            </button>
          </div>

          <p className="text-xs text-slate-400 pt-2">
            Assim que a transferência ou Multicaixa Express for verificado pelo administrador, o estado passará para <strong>PAGAMENTO CONFIRMADO</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
