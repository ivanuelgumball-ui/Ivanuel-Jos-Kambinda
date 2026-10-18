import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PaymentMethod } from '../types';
import { formatKz } from '../utils/security';
import {
  ShieldCheck,
  CreditCard,
  Building2,
  Smartphone,
  ArrowLeft,
  CheckCircle2,
  Info,
  Copy,
  Check,
  MessageCircle,
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    currentUser,
    setCurrentView,
    createOrder,
    settings,
    showToast,
    sendPaidConfirmationToWhatsApp,
  } = useStore();

  // Customer form fields
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '+244 ');
  const [province, setProvince] = useState(currentUser?.province || 'Luanda');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [notes, setNotes] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('MCX_EXPRESS');
  const [mcxPhone, setMcxPhone] = useState(currentUser?.phone || '+244 ');
  const [paymentReference, setPaymentReference] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delivery fee based on province
  const deliveryFee = province === 'Luanda' ? settings.deliveryLuandaKz : settings.deliveryProvincesKz;
  const grandTotal = cartSubtotal + deliveryFee;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast(`${fieldName} copiado!`, 'info');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const processOrder = (andNotifyWhatsApp: boolean) => {
    if (!fullName.trim() || !username.trim() || !phone.trim() || !address.trim()) {
      showToast('Por favor preencha todos os dados de entrega obrigatórios.', 'error');
      return;
    }

    if (!paymentReference.trim()) {
      showToast(
        paymentMethod === 'MCX_EXPRESS'
          ? 'Por favor insira o ID da transação ou referência do Multicaixa Express.'
          : 'Por favor insira o código/referência do comprovativo da transferência.',
        'error'
      );
      return;
    }

    if (cart.length === 0) {
      showToast('O seu carrinho está vazio.', 'error');
      setCurrentView('catalog');
      return;
    }

    setIsSubmitting(true);

    try {
      const order = createOrder({
        customerName: fullName.trim(),
        username: username.trim().toLowerCase(),
        customerPhone: phone.trim(),
        customerEmail: email.trim(),
        deliveryProvince: province,
        deliveryCity: city.trim() || province,
        deliveryAddress: address.trim(),
        notes: notes.trim(),
        paymentMethod,
        paymentReference: paymentReference.trim(),
        paymentPhone: paymentMethod === 'MCX_EXPRESS' ? mcxPhone.trim() : undefined,
        deliveryFee,
      });

      showToast(`Pedido ${order.orderNumber} registado com sucesso!`, 'success');

      if (andNotifyWhatsApp) {
        // Automatically redirects to WhatsApp +244 955 730 067 with preview link!
        sendPaidConfirmationToWhatsApp(order);
      }

      setCurrentView('order-success');
    } catch (err) {
      console.error(err);
      showToast('Erro ao processar pedido. Tente novamente.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    processOrder(false);
  };

  const handleDirectPaidClick = (e: React.MouseEvent) => {
    e.preventDefault();
    processOrder(true);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Não existem itens para checkout</h2>
        <p className="text-sm text-slate-400 mb-6">Adicione os seus ténis favoritos ao carrinho primeiro.</p>
        <button
          onClick={() => setCurrentView('catalog')}
          className="px-6 py-3 rounded-xl bg-[#D4AF37] text-black font-semibold text-sm cursor-pointer"
        >
          Explorar Catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0C] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header navigation */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <button
            onClick={() => setCurrentView('catalog')}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-[#D4AF37] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continuar a Comprar</span>
          </button>
          <span className="font-display font-bold text-lg gold-gradient-text">
            CHECKOUT OFICIAL BCB SHOES
          </span>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Customer and Payment details (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Customer Information */}
            <div className="p-6 rounded-2xl bg-[#111114] border border-white/5 space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs flex items-center justify-center font-bold">
                    1
                  </span>
                  <span>Identificação do Cliente & Encomenda</span>
                </h3>
                {!currentUser && (
                  <button
                    type="button"
                    onClick={() => setCurrentView('login')}
                    className="text-xs text-[#D4AF37] hover:underline cursor-pointer"
                  >
                    Já tem conta? Iniciar Sessão
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: Manuel António dos Santos"
                    className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                    Nome de Usuário (Username) *
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ex: manuel.santos"
                    className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    O seu pedido ficará associado a este nome de usuário.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                    Telemóvel / WhatsApp de Contacto *
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+244 923 000 000"
                    className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                    Email para Notificações
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemplo@gmail.com"
                    className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Address */}
            <div className="p-6 rounded-2xl bg-[#111114] border border-white/5 space-y-5">
              <div className="border-b border-white/10 pb-3">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs flex items-center justify-center font-bold">
                    2
                  </span>
                  <span>Endereço de Entrega em Angola</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                    Província *
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Luanda">Luanda (Taxa: {formatKz(settings.deliveryLuandaKz)})</option>
                    <option value="Benguela">Benguela (Taxa: {formatKz(settings.deliveryProvincesKz)})</option>
                    <option value="Huíla">Huíla / Lubango (Taxa: {formatKz(settings.deliveryProvincesKz)})</option>
                    <option value="Huambo">Huambo (Taxa: {formatKz(settings.deliveryProvincesKz)})</option>
                    <option value="Cabinda">Cabinda (Taxa: {formatKz(settings.deliveryProvincesKz)})</option>
                    <option value="Cuanza Sul">Cuanza Sul (Taxa: {formatKz(settings.deliveryProvincesKz)})</option>
                    <option value="Uíge">Uíge (Taxa: {formatKz(settings.deliveryProvincesKz)})</option>
                    <option value="Namibe">Namibe (Taxa: {formatKz(settings.deliveryProvincesKz)})</option>
                    <option value="Zaire">Zaire (Taxa: {formatKz(settings.deliveryProvincesKz)})</option>
                    <option value="Outra Província">Outra Província</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                    Município / Bairro *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: Talatona / Kilamba / Alvalade"
                    className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                  Endereço Detalhado / Ponto de Referência *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: Rua Direita de Luanda, Condomínio X, Casa 12"
                  className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                  Notas Adicionais para a Encomenda (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Preferência de entrega após as 14h, ou contacto prévio via WhatsApp."
                  className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* 3. Real Payment Methods (Angola) */}
            <div className="p-6 rounded-2xl bg-[#111114] border border-white/5 space-y-6">
              <div className="border-b border-white/10 pb-3">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs flex items-center justify-center font-bold">
                    3
                  </span>
                  <span>Método de Pagamento Real & Autorizado</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  O sistema de pagamento é seguro e oficial. O pedido é validado pelo administrador através da verificação da transação real bancária ou Multicaixa Express.
                </p>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('MCX_EXPRESS')}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    paymentMethod === 'MCX_EXPRESS'
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 ring-1 ring-[#D4AF37]'
                      : 'border-white/10 bg-[#161619] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Smartphone className="w-5 h-5 text-[#D4AF37]" />
                    {paymentMethod === 'MCX_EXPRESS' && <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />}
                  </div>
                  <span className="font-semibold text-xs text-white">Multicaixa Express</span>
                  <span className="text-[10px] text-slate-400">Autorização direta via app</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('BANK_TRANSFER')}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    paymentMethod === 'BANK_TRANSFER'
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 ring-1 ring-[#D4AF37]'
                      : 'border-white/10 bg-[#161619] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Building2 className="w-5 h-5 text-[#D4AF37]" />
                    {paymentMethod === 'BANK_TRANSFER' && <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />}
                  </div>
                  <span className="font-semibold text-xs text-white">Transferência / IBAN</span>
                  <span className="text-[10px] text-slate-400">BAI · BFA · BIC</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('MULTICAIXA_REF')}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    paymentMethod === 'MULTICAIXA_REF'
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 ring-1 ring-[#D4AF37]'
                      : 'border-white/10 bg-[#161619] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <CreditCard className="w-5 h-5 text-[#D4AF37]" />
                    {paymentMethod === 'MULTICAIXA_REF' && <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />}
                  </div>
                  <span className="font-semibold text-xs text-white">Ref. Multicaixa</span>
                  <span className="text-[10px] text-slate-400">Pagamento por entidade</span>
                </button>
              </div>

              {/* Payment Details Container */}
              <div className="p-4 rounded-xl bg-[#141417] border border-white/10 space-y-4">
                {paymentMethod === 'MCX_EXPRESS' && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-2 text-xs text-slate-300">
                      <Info className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>
                        Insira o número de telemóvel associado ao seu <strong>Multicaixa Express</strong>. Após submeter o pedido, aprove a transação ou insira o código da notificação MCX recebida.
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-400 font-medium mb-1">
                          Telemóvel MCX Express *
                        </label>
                        <input
                          type="text"
                          required
                          value={mcxPhone}
                          onChange={(e) => setMcxPhone(e.target.value)}
                          placeholder="+244 923 000 000"
                          className="w-full bg-[#18181C] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-400 font-medium mb-1">
                          Código / Referência da Transação MCX *
                        </label>
                        <input
                          type="text"
                          required
                          value={paymentReference}
                          onChange={(e) => setPaymentReference(e.target.value)}
                          placeholder="Ex: MCX-893021 ou Código SMS"
                          className="w-full bg-[#18181C] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'BANK_TRANSFER' && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-2 text-xs text-slate-300">
                      <Info className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>
                        Efetue a transferência do valor total (<strong>{formatKz(grandTotal)}</strong>) para uma das contas bancárias oficiais da BCB Shoes:
                      </span>
                    </div>

                    {/* Official IBANs with Copy function */}
                    <div className="space-y-2 text-xs">
                      {/* BAI */}
                      <div className="p-3 rounded-lg bg-[#18181C] border border-white/5 flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-white block">Banco BAI</span>
                          <span className="font-mono text-slate-300 text-[11px] select-all">{settings.baiIban}</span>
                          <span className="text-[10px] text-slate-500 block">Titular: {settings.bankAccountHolder}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(settings.baiIban, 'IBAN BAI')}
                          className="p-1.5 text-slate-400 hover:text-white rounded bg-white/5 cursor-pointer"
                        >
                          {copiedField === 'IBAN BAI' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* BFA */}
                      <div className="p-3 rounded-lg bg-[#18181C] border border-white/5 flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-white block">Banco BFA</span>
                          <span className="font-mono text-slate-300 text-[11px] select-all">{settings.bfaIban}</span>
                          <span className="text-[10px] text-slate-500 block">Titular: {settings.bankAccountHolder}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(settings.bfaIban, 'IBAN BFA')}
                          className="p-1.5 text-slate-400 hover:text-white rounded bg-white/5 cursor-pointer"
                        >
                          {copiedField === 'IBAN BFA' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-400 font-medium mb-1">
                        Código / ID do Comprovativo Bancário *
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value)}
                        placeholder="Ex: TRF-BAI-994821 ou número de operação"
                        className="w-full bg-[#18181C] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'MULTICAIXA_REF' && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-2 text-xs text-slate-300">
                      <Info className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>
                        Pague no ATM ou no aplicativo Multicaixa utilizando a Entidade oficial da BCB Shoes:
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-[#18181C] border border-white/5 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Entidade</span>
                        <strong className="text-white font-mono text-sm">{settings.mcxEntityCode}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Valor Exato</span>
                        <strong className="text-white font-mono text-sm">{formatKz(grandTotal)}</strong>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-400 font-medium mb-1">
                        Número de Referência / Talão Multicaixa *
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value)}
                        placeholder="Ex: 928 104 382"
                        className="w-full bg-[#18181C] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <div className="p-6 rounded-2xl bg-[#111114] border border-white/10 space-y-5">
              <h3 className="font-display font-bold text-base text-white border-b border-white/10 pb-3">
                Resumo da Encomenda
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-14 h-14 object-contain rounded-lg bg-[#18181C] p-1.5 border border-white/5"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-white truncate">{item.product.name}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>Tam: <strong className="text-white font-mono">{item.size}</strong></span>
                        <span>·</span>
                        <span>Qtd: {item.quantity}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate">{item.color}</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-white tabular-nums">
                      {formatKz(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculation Breakdown */}
              <div className="pt-3 border-t border-white/10 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal dos Ténis</span>
                  <span className="text-white font-mono">{formatKz(cartSubtotal)}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Envio para ({province})</span>
                  <span className="text-white font-mono">{formatKz(deliveryFee)}</span>
                </div>

                <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-white/10">
                  <span>Total Final a Pagar</span>
                  <span className="font-mono text-lg gold-gradient-text tabular-nums">
                    {formatKz(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Security and Trust notice */}
              <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-black/40 p-3 rounded-xl border border-white/5">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <span>
                  O pagamento só será considerado confirmado após validação real da transação ou confirmação pelo administrador.
                </span>
              </div>

              {/* Requested PAGO Button: Direct to WhatsApp +244 955 730 067 with preview link */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleDirectPaidClick}
                className="w-full py-4 px-6 rounded-xl font-display font-extrabold text-sm uppercase tracking-wider bg-[#25D366] hover:bg-[#20BD5A] text-black shadow-xl shadow-[#25D366]/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50 hover:scale-[1.01]"
              >
                <MessageCircle className="w-5 h-5 fill-black text-[#25D366]" />
                <span>PAGO</span>
                <span className="text-xs font-semibold">(Enviar no WhatsApp +244 955 730 067)</span>
              </button>

              {/* Alternative Submit Order Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-xl font-display font-medium text-xs uppercase tracking-wider bg-[#18181C] hover:bg-[#222226] text-slate-300 border border-white/10 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>A Registar Encomenda...</span>
                ) : (
                  <span>Apenas Registar no Sistema</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
