import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatKz, formatDate } from '../utils/security';
import {
  User,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  MessageCircle,
  LogOut,
  Save,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const AccountView: React.FC = () => {
  const {
    currentUser,
    logoutUser,
    userOrders,
    updateUserProfile,
    setCurrentView,
    openWhatsAppForOrder,
    sendPaidConfirmationToWhatsApp,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [province, setProvince] = useState(currentUser?.province || 'Luanda');
  const [address, setAddress] = useState(currentUser?.address || '');

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Sessão não iniciada</h2>
        <p className="text-sm text-slate-400 mb-6">Inicie sessão para ver a sua conta e os seus pedidos.</p>
        <button
          onClick={() => setCurrentView('login')}
          className="px-6 py-3 rounded-xl bg-[#D4AF37] text-black font-semibold text-xs"
        >
          Iniciar Sessão
        </button>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      fullName,
      phone,
      province,
      address,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAGAMENTO CONFIRMADO':
      case 'Concluído':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>{status}</span>
          </span>
        );
      case 'Em Processamento':
      case 'Em Envio':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30">
            <Truck className="w-3 h-3" />
            <span>{status}</span>
          </span>
        );
      case 'Cancelado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <AlertCircle className="w-3 h-3" />
            <span>{status}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
            <Clock className="w-3 h-3" />
            <span>{status}</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Account Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#111114] border border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#18181C] border border-[#D4AF37]/30 flex items-center justify-center font-display font-bold text-xl gold-gradient-text">
              {currentUser.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white">{currentUser.fullName}</h1>
                <span className="text-xs text-[#D4AF37] font-mono">@{currentUser.username}</span>
              </div>
              <p className="text-xs text-slate-400">{currentUser.email} · {currentUser.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('catalog')}
              className="px-4 py-2 rounded-xl bg-[#18181C] hover:bg-[#202025] text-xs text-white border border-white/10 transition-colors cursor-pointer"
            >
              Fazer Nova Encomenda
            </button>
            <button
              onClick={logoutUser}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>

        {/* Tabs: Meus Pedidos vs Dados da Conta */}
        <div className="flex border-b border-white/10 gap-6 text-sm">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 font-semibold cursor-pointer transition-colors relative ${
              activeTab === 'orders' ? 'text-[#D4AF37]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span>Meus Pedidos ({userOrders.length})</span>
            </div>
            {activeTab === 'orders' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 font-semibold cursor-pointer transition-colors relative ${
              activeTab === 'profile' ? 'text-[#D4AF37]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Dados Pessoais & Endereço</span>
            </div>
            {activeTab === 'profile' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />
            )}
          </button>
        </div>

        {/* Tab Content: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {userOrders.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#111114] border border-white/5 space-y-3">
                <Package className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="text-base font-semibold text-white">Nenhum pedido registado ainda</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Ainda não encomendou ténis com o nome de usuário @{currentUser.username}.
                </p>
                <button
                  onClick={() => setCurrentView('catalog')}
                  className="mt-3 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89228] text-black font-semibold text-xs cursor-pointer"
                >
                  Ver Catálogo de Ténis
                </button>
              </div>
            ) : (
              userOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-6 rounded-2xl bg-[#111114] border border-white/5 hover:border-white/10 transition-colors space-y-4"
                >
                  {/* Top Bar of Order Card */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-white">
                          {order.orderNumber}
                        </span>
                        {getStatusBadge(order.paymentStatus)}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Registado em {formatDate(order.createdAt)} · Método: {order.paymentMethod.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="text-[10px] uppercase text-slate-400 block">Total</span>
                        <span className="font-mono font-bold text-sm gold-gradient-text tabular-nums">
                          {formatKz(order.total)}
                        </span>
                      </div>

                      {/* Direct "PAGO" Button */}
                      <button
                        onClick={() => sendPaidConfirmationToWhatsApp(order)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20BD5A] text-black font-extrabold text-xs shadow-md shadow-[#25D366]/20 transition-all cursor-pointer hover:scale-105"
                        title="Enviar comprovativo de pagamento e link de pré-visualização para +244 955 730 067"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-black text-[#25D366]" />
                        <span>PAGO</span>
                      </button>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-xl bg-[#161619] border border-white/5"
                      >
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-12 h-12 object-contain rounded-lg bg-[#0E0E10] p-1"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-white truncate">
                            {item.productName}
                          </h4>
                          <span className="text-[11px] text-slate-400 block">
                            Tamanho: <strong className="text-white font-mono">{item.size}</strong> · Cor: {item.color}
                          </span>
                          <span className="text-[11px] text-[#D4AF37] font-mono">
                            {item.quantity}x {formatKz(item.price)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer status timeline info */}
                  <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                    <div>
                      <span>Entrega: </span>
                      <strong className="text-slate-300">{order.deliveryCity}, {order.deliveryProvince}</strong>
                      <span className="text-slate-500 ml-1">({order.deliveryAddress})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span>Ref. de Pagamento: </span>
                      <span className="font-mono text-slate-300 bg-[#161619] px-2 py-0.5 rounded border border-white/5 select-all">
                        {order.paymentReference}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab Content: Profile Editing */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="p-6 rounded-2xl bg-[#111114] border border-white/5 max-w-2xl space-y-4">
            <h3 className="text-base font-semibold text-white border-b border-white/10 pb-3">
              Atualizar Dados da Conta
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-medium mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-medium mb-1">
                  Nome de Usuário (Inalterável)
                </label>
                <input
                  type="text"
                  disabled
                  value={currentUser.username}
                  className="w-full bg-[#141416] border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-500 cursor-not-allowed font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-medium mb-1">
                  Telemóvel / WhatsApp
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-medium mb-1">
                  Província de Entrega
                </label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="Luanda">Luanda</option>
                  <option value="Benguela">Benguela</option>
                  <option value="Huíla">Huíla</option>
                  <option value="Huambo">Huambo</option>
                  <option value="Outra Província">Outra Província</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-medium mb-1">
                Endereço Padrão de Entrega
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Rua, Bairro, Condomínio"
                className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#C29B2B] text-black font-semibold text-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Alterações</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
