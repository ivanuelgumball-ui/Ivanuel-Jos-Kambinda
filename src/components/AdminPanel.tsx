import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Order, OrderStatus } from '../types';
import { formatKz, formatDate } from '../utils/security';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageCircle,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Search,
  DollarSign,
  TrendingUp,
  Box,
  Layers,
  Save,
  X,
  Lock,
  Download,
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    adminUser,
    logoutAdmin,
    setCurrentView,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductActive,
    updateProductPrice,
    orders,
    confirmOrderPayment,
    updateOrderStatus,
    openWhatsAppForOrder,
    sendPaidConfirmationToWhatsApp,
    settings,
    updateSettings,
    changeAdminPassword,
    adminLogs,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'settings'>('dashboard');

  // Order filters
  const [orderFilter, setOrderFilter] = useState<'Todos' | 'Pagos' | 'Pendentes' | 'Cancelados' | 'Processamento' | 'Concluídos'>('Todos');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [inspectedOrder, setInspectedOrder] = useState<Order | null>(null);

  // Product modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<{
    name: string;
    brand: string;
    category: string;
    price: number;
    description: string;
    imageUrl: string;
    sizes: string;
    colors: string;
    stock: number;
    isFeatured: boolean;
    isBestSeller: boolean;
    isActive: boolean;
    preOrderEstimatedDays: string;
    sku: string;
  }>({
    name: '',
    brand: 'BCB Shoes',
    category: 'Performance & Corrida',
    price: 85000,
    description: '',
    imageUrl: '',
    sizes: '39, 40, 41, 42, 43, 44',
    colors: 'Preto / Prateado, Branco / Prateado',
    stock: 10,
    isFeatured: true,
    isBestSeller: false,
    isActive: true,
    preOrderEstimatedDays: '7 - 12 dias úteis',
    sku: '',
  });

  // Inline price modification state
  const [editingPriceMap, setEditingPriceMap] = useState<{ [id: string]: number }>({});

  // Password change state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  // Store settings edit state
  const [settingsForm, setSettingsForm] = useState({
    whatsappNumber: settings.whatsappNumber,
    baiIban: settings.baiIban,
    bfaIban: settings.bfaIban,
    bankAccountHolder: settings.bankAccountHolder,
    mcxEntityCode: settings.mcxEntityCode,
    deliveryLuandaKz: settings.deliveryLuandaKz,
    deliveryProvincesKz: settings.deliveryProvincesKz,
  });

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-[#08080A] flex flex-col items-center justify-center p-4">
        <div className="p-8 rounded-2xl bg-[#121215] border border-red-500/30 text-center space-y-4 max-w-md">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">Acesso Não Autorizado</h2>
          <p className="text-xs text-slate-400">
            É necessária autenticação com as credenciais de administrador para aceder a esta secção.
          </p>
          <button
            onClick={() => setCurrentView('admin-login')}
            className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-black font-semibold text-xs cursor-pointer"
          >
            Aceder ao Login ADM
          </button>
        </div>
      </div>
    );
  }

  // Dashboard Metrics Calculation
  const totalOrdersCount = orders.length;
  const paidOrders = orders.filter((o) => o.paymentStatus === 'PAGAMENTO CONFIRMADO');
  const pendingOrders = orders.filter((o) => o.paymentStatus === 'Pendente');
  const cancelledOrders = orders.filter((o) => o.paymentStatus === 'Cancelado' || o.orderStatus === 'Cancelado');
  const totalSalesRevenueKz = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const totalProductsCount = products.length;
  const outOfStockProductsCount = products.filter((p) => p.stock <= 0).length;

  // Filtered orders list
  const filteredOrders = orders.filter((ord) => {
    let matchesStatus = true;
    if (orderFilter === 'Pagos') matchesStatus = ord.paymentStatus === 'PAGAMENTO CONFIRMADO';
    else if (orderFilter === 'Pendentes') matchesStatus = ord.paymentStatus === 'Pendente';
    else if (orderFilter === 'Cancelados') matchesStatus = ord.paymentStatus === 'Cancelado' || ord.orderStatus === 'Cancelado';
    else if (orderFilter === 'Processamento') matchesStatus = ord.orderStatus === 'Em Processamento';
    else if (orderFilter === 'Concluídos') matchesStatus = ord.orderStatus === 'Concluído';

    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      ord.username.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      ord.customerPhone.includes(orderSearchQuery);

    return matchesStatus && matchesSearch;
  });

  // Open modal to add product
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      brand: 'BCB Shoes',
      category: 'Performance & Corrida',
      price: 85000,
      description: '',
      imageUrl: '',
      sizes: '39, 40, 41, 42, 43, 44',
      colors: 'Preto / Prateado, Branco / Prateado',
      stock: 8,
      isFeatured: true,
      isBestSeller: false,
      isActive: true,
      preOrderEstimatedDays: '7 - 12 dias úteis',
      sku: `BCB-${Math.floor(100 + Math.random() * 900)}`,
    });
    setIsProductModalOpen(true);
  };

  // Open modal to edit product
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      brand: prod.brand,
      category: prod.category,
      price: prod.price,
      description: prod.description,
      imageUrl: prod.images[0] || '',
      sizes: prod.sizes.join(', '),
      colors: prod.colors.join(', '),
      stock: prod.stock,
      isFeatured: prod.isFeatured || false,
      isBestSeller: prod.isBestSeller || false,
      isActive: prod.isActive,
      preOrderEstimatedDays: prod.preOrderEstimatedDays || '7 - 12 dias úteis',
      sku: prod.sku,
    });
    setIsProductModalOpen(true);
  };

  // Save product form
  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedSizes = productForm.sizes
      .split(',')
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n));

    const parsedColors = productForm.colors
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const imagesArray = productForm.imageUrl
      ? [productForm.imageUrl]
      : editingProduct?.images || [products[0]?.images[0] || ''];

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: productForm.name,
        brand: productForm.brand,
        category: productForm.category,
        price: Number(productForm.price),
        description: productForm.description,
        images: imagesArray,
        sizes: parsedSizes.length > 0 ? parsedSizes : [40, 41, 42, 43],
        colors: parsedColors.length > 0 ? parsedColors : ['Padrão'],
        stock: Number(productForm.stock),
        isFeatured: productForm.isFeatured,
        isBestSeller: productForm.isBestSeller,
        isActive: productForm.isActive,
        preOrderEstimatedDays: productForm.preOrderEstimatedDays,
        sku: productForm.sku,
      });
    } else {
      addProduct({
        sku: productForm.sku || `BCB-${Math.floor(100 + Math.random() * 900)}`,
        name: productForm.name,
        brand: productForm.brand,
        category: productForm.category,
        price: Number(productForm.price),
        description: productForm.description,
        images: imagesArray,
        sizes: parsedSizes.length > 0 ? parsedSizes : [40, 41, 42, 43],
        colors: parsedColors.length > 0 ? parsedColors : ['Padrão'],
        stock: Number(productForm.stock),
        isFeatured: productForm.isFeatured,
        isBestSeller: productForm.isBestSeller,
        isActive: productForm.isActive,
        preOrderEstimatedDays: productForm.preOrderEstimatedDays,
      });
    }

    setIsProductModalOpen(false);
  };

  // Password change submission
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (newPass !== confirmPass) {
      setPassError('A nova senha e a confirmação não coincidem.');
      return;
    }

    const res = await changeAdminPassword(currentPass, newPass);
    if (res.success) {
      setPassSuccess(res.message);
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } else {
      setPassError(res.message);
    }
  };

  // Settings form submission
  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-slate-200">
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-40 bg-[#101014]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1C1C20] to-[#0A0A0B] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] font-bold text-sm">
            ADM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-white text-base">Painel de Gestão BCB Shoes</span>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.2 rounded font-mono">
                PRIVADO
              </span>
            </div>
            <span className="text-[11px] text-slate-400">{adminUser.email}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">Ver Loja Pública</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-xs text-rose-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sair do ADM</span>
          </button>
        </div>
      </header>

      {/* Main Admin Layout with Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#121216] rounded-2xl border border-white/5">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard & Métricas</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Gestão de Produtos ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Gestão de Pedidos ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Configurações & Segurança</span>
          </button>
        </div>

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Metric KPI cards grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Valor Total das Vendas */}
              <div className="p-5 rounded-2xl bg-[#121216] border border-white/5 space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block">
                  Valor Total das Vendas
                </span>
                <span className="font-mono text-xl sm:text-2xl font-bold gold-gradient-text tabular-nums block">
                  {formatKz(totalSalesRevenueKz)}
                </span>
                <span className="text-[10px] text-emerald-400">Apenas transações confirmadas</span>
              </div>

              {/* Total de Pedidos */}
              <div className="p-5 rounded-2xl bg-[#121216] border border-white/5 space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block">
                  Total de Pedidos
                </span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-white tabular-nums block">
                  {totalOrdersCount}
                </span>
                <span className="text-[10px] text-slate-400">Registados no sistema</span>
              </div>

              {/* Pedidos Pagos */}
              <div className="p-5 rounded-2xl bg-[#121216] border border-emerald-500/20 bg-emerald-950/10 space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-medium block">
                  Pedidos Pagos
                </span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-emerald-300 tabular-nums block">
                  {paidOrders.length}
                </span>
                <span className="text-[10px] text-emerald-400/80">Pagamento confirmado</span>
              </div>

              {/* Pedidos Pendentes */}
              <div className="p-5 rounded-2xl bg-[#121216] border border-amber-500/20 bg-amber-950/10 space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-amber-400 font-medium block">
                  Pedidos Pendentes
                </span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-amber-300 tabular-nums block">
                  {pendingOrders.length}
                </span>
                <span className="text-[10px] text-amber-400/80">Aguardando validação</span>
              </div>
            </div>

            {/* Secondary KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#121216] border border-white/5">
                <span className="text-xs text-slate-400 block">Pedidos Cancelados</span>
                <span className="font-mono text-lg font-bold text-rose-400">{cancelledOrders.length}</span>
              </div>
              <div className="p-4 rounded-xl bg-[#121216] border border-white/5">
                <span className="text-xs text-slate-400 block">Produtos Cadastrados</span>
                <span className="font-mono text-lg font-bold text-white">{totalProductsCount}</span>
              </div>
              <div className="p-4 rounded-xl bg-[#121216] border border-white/5">
                <span className="text-xs text-slate-400 block">Produtos Sem Stock</span>
                <span className="font-mono text-lg font-bold text-rose-300">{outOfStockProductsCount}</span>
              </div>
              <div className="p-4 rounded-xl bg-[#121216] border border-white/5">
                <span className="text-xs text-slate-400 block">WhatsApp de Suporte</span>
                <span className="font-mono text-xs font-semibold text-[#D4AF37] truncate block">{settings.whatsappNumber}</span>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="p-6 rounded-2xl bg-[#121216] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-white">
                  Últimas Encomendas Registadas
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#D4AF37] hover:underline cursor-pointer"
                >
                  Ver Todos os Pedidos →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider font-medium">
                      <th className="py-2.5 pr-4">Nº Pedido</th>
                      <th className="py-2.5 px-4">Cliente</th>
                      <th className="py-2.5 px-4">Data</th>
                      <th className="py-2.5 px-4">Valor</th>
                      <th className="py-2.5 px-4">Pagamento</th>
                      <th className="py-2.5 pl-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 pr-4 font-mono font-bold text-white">{ord.orderNumber}</td>
                        <td className="py-3 px-4">
                          <span className="text-white block font-medium">{ord.customerName}</span>
                          <span className="text-[10px] text-[#D4AF37]">@{ord.username}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-400">{formatDate(ord.createdAt)}</td>
                        <td className="py-3 px-4 font-mono font-bold text-white">{formatKz(ord.total)}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                            ord.paymentStatus === 'PAGAMENTO CONFIRMADO'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-amber-500/10 text-amber-300'
                          }`}>
                            {ord.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3 pl-4 text-right">
                          <button
                            onClick={() => {
                              setInspectedOrder(ord);
                              setActiveTab('orders');
                            }}
                            className="text-[#D4AF37] hover:underline"
                          >
                            Detalhes
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GESTÃO DE PRODUTOS */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header with Add Product button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-bold text-lg text-white">Catálogo de Produtos</h3>
                <p className="text-xs text-slate-400">
                  Adicione, edite dados, controle stock e altere preços diretamente no painel.
                </p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-black font-semibold text-xs uppercase tracking-wider hover:opacity-95 shadow cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Novo Produto</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="rounded-2xl bg-[#121216] border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-[#16161A] text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="py-3.5 px-4">Foto & Modelo</th>
                      <th className="py-3.5 px-4">Categoria</th>
                      <th className="py-3.5 px-4">Alterar Preço (Kz)</th>
                      <th className="py-3.5 px-4">Tamanhos</th>
                      <th className="py-3.5 px-4">Stock</th>
                      <th className="py-3.5 px-4">Estado</th>
                      <th className="py-3.5 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {products.map((p) => {
                      const curEditingPrice = editingPriceMap[p.id] !== undefined ? editingPriceMap[p.id] : p.price;
                      return (
                        <tr key={p.id} className="hover:bg-white/5 transition-colors">
                          {/* Image & Title */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.images[0]}
                                alt={p.name}
                                className="w-12 h-12 object-contain rounded-lg bg-[#18181C] p-1 border border-white/5 shrink-0"
                              />
                              <div>
                                <span className="font-semibold text-white block">{p.name}</span>
                                <span className="text-[10px] text-slate-500 font-mono">SKU: {p.sku} · {p.brand}</span>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-4 px-4 text-slate-300">{p.category}</td>

                          {/* Instant Direct Price Edit */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min="1000"
                                step="1000"
                                value={curEditingPrice}
                                onChange={(e) =>
                                  setEditingPriceMap({
                                    ...editingPriceMap,
                                    [p.id]: Number(e.target.value),
                                  })
                                }
                                className="w-24 bg-[#18181C] border border-white/10 rounded-lg px-2 py-1 text-xs text-white font-mono focus:border-[#D4AF37] focus:outline-none"
                              />
                              {curEditingPrice !== p.price && (
                                <button
                                  onClick={() => {
                                    updateProductPrice(p.id, curEditingPrice);
                                    const nextMap = { ...editingPriceMap };
                                    delete nextMap[p.id];
                                    setEditingPriceMap(nextMap);
                                  }}
                                  className="px-2 py-1 rounded bg-[#D4AF37] text-black font-bold text-[10px] hover:bg-[#C29B2B]"
                                  title="Guardar novo preço"
                                >
                                  Salvar
                                </button>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                              Atual: {formatKz(p.price)}
                            </span>
                          </td>

                          {/* Sizes */}
                          <td className="py-4 px-4">
                            <div className="flex flex-wrap gap-1 max-w-[140px]">
                              {p.sizes.map((s) => (
                                <span key={s} className="px-1.5 py-0.5 rounded bg-[#18181C] text-[10px] font-mono text-slate-300">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Stock */}
                          <td className="py-4 px-4">
                            <span className={`font-mono font-bold ${p.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {p.stock} pares
                            </span>
                          </td>

                          {/* Visibility Toggle */}
                          <td className="py-4 px-4">
                            <button
                              onClick={() => toggleProductActive(p.id)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold cursor-pointer ${
                                p.isActive
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                              }`}
                            >
                              {p.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                              <span>{p.isActive ? 'Ativo' : 'Inativo'}</span>
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                title="Editar Produto"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Remover definitivamente "${p.name}"?`)) {
                                    deleteProduct(p.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                                title="Remover Produto"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GESTÃO DE PEDIDOS E PAGAMENTOS */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Filter buttons & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Status filter tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                {(['Todos', 'Pendentes', 'Pagos', 'Processamento', 'Concluídos', 'Cancelados'] as const).map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setOrderFilter(tab)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        orderFilter === tab
                          ? 'bg-[#D4AF37] text-black font-bold shadow'
                          : 'bg-[#18181C] text-slate-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {tab}
                    </button>
                  )
                )}
              </div>

              {/* Search in orders */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Pesquisar pedido, cliente ou @"
                  className="bg-[#18181C] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] w-64"
                />
              </div>
            </div>

            {/* Orders Table */}
            <div className="rounded-2xl bg-[#121216] border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-[#16161A] text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="py-3.5 px-4">Nº Pedido</th>
                      <th className="py-3.5 px-4">Usuário / Cliente</th>
                      <th className="py-3.5 px-4">Produto & Detalhes</th>
                      <th className="py-3.5 px-4">Valor Total</th>
                      <th className="py-3.5 px-4">Método</th>
                      <th className="py-3.5 px-4">Data</th>
                      <th className="py-3.5 px-4">Estado Pagamento</th>
                      <th className="py-3.5 px-4">Estado Pedido</th>
                      <th className="py-3.5 px-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-slate-500">
                          Nenhum pedido encontrado para este filtro.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-white select-all">
                            {ord.orderNumber}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-white block">{ord.customerName}</span>
                            <span className="text-[#D4AF37] font-mono text-[11px]">@{ord.username}</span>
                            <span className="text-[10px] text-slate-500 block">{ord.customerPhone}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="max-w-[200px]">
                              {ord.items.map((i, idx) => (
                                <div key={idx} className="text-slate-300 text-[11px] truncate">
                                  <strong>{i.quantity}x</strong> {i.productName}
                                  <span className="text-slate-500 text-[10px] block">
                                    Tam: {i.size} · {i.color}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-white tabular-nums">
                            {formatKz(ord.total)}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-slate-300 font-mono text-[11px] block">
                              {ord.paymentMethod.replace('_', ' ')}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              Ref: {ord.paymentReference}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                            {formatDate(ord.createdAt)}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                ord.paymentStatus === 'PAGAMENTO CONFIRMADO'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : ord.paymentStatus === 'Cancelado'
                                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                  : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              {ord.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={ord.orderStatus}
                              onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                              className="bg-[#18181C] border border-white/10 rounded px-2 py-1 text-[11px] text-white focus:outline-none focus:border-[#D4AF37]"
                            >
                              <option value="Pendente">Pendente</option>
                              <option value="Em Processamento">Em Processamento</option>
                              <option value="Em Envio">Em Envio</option>
                              <option value="Concluído">Concluído</option>
                              <option value="Cancelado">Cancelado</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setInspectedOrder(ord)}
                              className="px-2.5 py-1 rounded bg-[#1C1C20] hover:bg-[#282830] text-xs text-[#D4AF37] border border-[#D4AF37]/30 transition-colors cursor-pointer"
                            >
                              Abrir & Gerir
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CONFIGURAÇÕES & SEGURANÇA */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-200">
            {/* Change Password Form */}
            <div className="p-6 rounded-2xl bg-[#121216] border border-white/5 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <Lock className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-display font-bold text-base text-white">
                  Alteração Segura da Senha ADM
                </h3>
              </div>

              <p className="text-xs text-slate-400">
                A senha nunca é guardada em texto limpo. Ao alterar, a nova senha é encriptada com hash criptográfico SHA-256 no armazenamento de segurança.
              </p>

              {passError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {passError}
                </div>
              )}

              {passSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                  {passSuccess}
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Senha Atual de Administrador
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Nova Senha (Mínimo 6 caracteres)
                  </label>
                  <input
                    type="password"
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#C29B2B] text-black font-semibold text-xs transition-colors cursor-pointer"
                >
                  Atualizar Senha com Hash
                </button>
              </form>
            </div>

            {/* Bank Details & WhatsApp Settings */}
            <div className="p-6 rounded-2xl bg-[#121216] border border-white/5 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <Settings className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-display font-bold text-base text-white">
                  Dados de Pagamento & WhatsApp Oficial
                </h3>
              </div>

              <form onSubmit={handleSettingsSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Número Oficial de WhatsApp
                  </label>
                  <input
                    type="text"
                    value={settingsForm.whatsappNumber}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })
                    }
                    className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    IBAN Banco BAI
                  </label>
                  <input
                    type="text"
                    value={settingsForm.baiIban}
                    onChange={(e) => setSettingsForm({ ...settingsForm, baiIban: e.target.value })}
                    className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    IBAN Banco BFA
                  </label>
                  <input
                    type="text"
                    value={settingsForm.bfaIban}
                    onChange={(e) => setSettingsForm({ ...settingsForm, bfaIban: e.target.value })}
                    className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                      Taxa Luanda (Kz)
                    </label>
                    <input
                      type="number"
                      value={settingsForm.deliveryLuandaKz}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          deliveryLuandaKz: Number(e.target.value),
                        })
                      }
                      className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                      Taxa Províncias (Kz)
                    </label>
                    <input
                      type="number"
                      value={settingsForm.deliveryProvincesKz}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          deliveryProvincesKz: Number(e.target.value),
                        })
                      }
                      className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#C29B2B] text-black font-semibold text-xs transition-colors cursor-pointer"
                >
                  Guardar Configurações
                </button>
              </form>
            </div>

            {/* Export / Download ZIP Package */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-[#121216] border border-[#D4AF37]/30 space-y-3">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <Download className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-display font-bold text-base text-white">
                  Descarregar Código Completo do Site (.ZIP)
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Descarregue o arquivo compactado contendo todo o código-fonte (React 19, TypeScript, Tailwind CSS), fotos oficiais dos ténis, configurações de publicação e a versão compilada em <code className="text-[#D4AF37]">dist/</code> pronta a hospedar em qualquer servidor.
              </p>
              <div className="pt-2 flex items-center gap-4">
                <a
                  href="/bcb-shoes.zip"
                  download="bcb-shoes-project.zip"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Descarregar bcb-shoes.zip (5.7 MB)</span>
                </a>
                <span className="text-xs text-slate-400">Pronto a extrair e usar</span>
              </div>
            </div>

            {/* Audit Logs of Admin Actions */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-[#121216] border border-white/5 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-display font-bold text-base text-white">
                  Registo de Auditoria de Ações do Administrador
                </h3>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {adminLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-[#18181C] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <div>
                      <strong className="text-white mr-2">{log.action}:</strong>
                      <span className="text-slate-300">{log.details}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0">
                      {formatDate(log.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* INSPECT ORDER MODAL WITH PAYMENT CONFIRMATION & WHATSAPP BUTTON */}
      {inspectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#121216] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#D4AF37]">
                  Detalhes do Pedido
                </span>
                <h3 className="text-xl font-mono font-bold text-white">
                  {inspectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setInspectedOrder(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-[#18181C] border border-white/5 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Pagamento</span>
                <span className={`font-bold text-[11px] ${
                  inspectedOrder.paymentStatus === 'PAGAMENTO CONFIRMADO' ? 'text-emerald-400' : 'text-amber-300'
                }`}>
                  {inspectedOrder.paymentStatus}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Estado</span>
                <span className="text-white font-semibold">{inspectedOrder.orderStatus}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Método</span>
                <span className="text-slate-300">{inspectedOrder.paymentMethod.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Total</span>
                <span className="gold-gradient-text font-bold font-mono">{formatKz(inspectedOrder.total)}</span>
              </div>
            </div>

            {/* Customer information */}
            <div className="space-y-2 text-xs text-slate-300 p-4 rounded-xl bg-[#161619] border border-white/5">
              <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider mb-2">
                Dados do Cliente
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <p>Nome: <strong className="text-white">{inspectedOrder.customerName}</strong></p>
                <p>Nome de Usuário: <strong className="text-[#D4AF37] font-mono">@{inspectedOrder.username}</strong></p>
                <p>Telemóvel / WhatsApp: <strong className="text-white">{inspectedOrder.customerPhone}</strong></p>
                <p>Email: <span>{inspectedOrder.customerEmail || 'Não indicado'}</span></p>
                <p className="sm:col-span-2">
                  Entrega: {inspectedOrder.deliveryAddress}, {inspectedOrder.deliveryCity} ({inspectedOrder.deliveryProvince})
                </p>
                <p className="sm:col-span-2">
                  Referência de Pagamento: <strong className="text-white font-mono bg-black/40 px-2 py-0.5 rounded">{inspectedOrder.paymentReference}</strong>
                </p>
                {inspectedOrder.notes && (
                  <p className="sm:col-span-2 text-slate-400 italic">Notas: "{inspectedOrder.notes}"</p>
                )}
              </div>
            </div>

            {/* Products in this order */}
            <div className="space-y-2">
              <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider">
                Itens da Encomenda
              </h4>
              <div className="space-y-2">
                {inspectedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#18181C] border border-white/5 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={it.productImage} alt={it.productName} className="w-10 h-10 object-contain rounded bg-black/50 p-1" />
                      <div>
                        <span className="text-white font-semibold block">{it.productName}</span>
                        <span className="text-slate-400 text-[11px]">Tamanho: <strong>{it.size}</strong> · Cor: {it.color} · Qtd: {it.quantity}</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-white">{formatKz(it.price * it.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* REQUIRED ACTIONS: CONFIRM PAYMENT & CONTACT ON WHATSAPP */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
              {/* Payment Confirmation Button */}
              {inspectedOrder.paymentStatus !== 'PAGAMENTO CONFIRMADO' ? (
                <button
                  onClick={() => {
                    confirmOrderPayment(inspectedOrder.id);
                    setInspectedOrder({
                      ...inspectedOrder,
                      paymentStatus: 'PAGAMENTO CONFIRMADO',
                      orderStatus: 'Em Processamento',
                    });
                  }}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-emerald-600/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>CONFIRMAR PAGAMENTO</span>
                </button>
              ) : (
                <div className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>PAGAMENTO CONFIRMADO</span>
                </div>
              )}

              {/* Direct WhatsApp Contact Button */}
              <button
                onClick={() => openWhatsAppForOrder(inspectedOrder)}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#18181C] hover:bg-[#222226] text-white border border-white/10 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
                <span>MENSAGEM AO CLIENTE</span>
              </button>

              {/* Requested PAGO Button with Preview Link */}
              <button
                onClick={() => sendPaidConfirmationToWhatsApp(inspectedOrder)}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-[#25D366]/20"
                title="Abrir WhatsApp +244 955 730 067 com link de pré-visualização"
              >
                <MessageCircle className="w-4 h-4 fill-black text-[#25D366]" />
                <span>PAGO (COM LINK)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[#121216] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-display font-bold text-base text-white">
                {editingProduct ? 'Editar Modelo de Ténis' : 'Adicionar Novo Modelo ao Catálogo'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductForm} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="Ex: Nike Air Zoom Alpha"
                    className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Marca
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    placeholder="Adidas, Nike, etc."
                    className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Preço em Kz *
                  </label>
                  <input
                    type="number"
                    required
                    min="1000"
                    step="500"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: Number(e.target.value) })
                    }
                    className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Categoria
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Performance & Corrida">Performance & Corrida</option>
                    <option value="Casual & Streetwear">Casual & Streetwear</option>
                    <option value="Retro & Chunky">Retro & Chunky</option>
                    <option value="Edição Limitada">Edição Limitada</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                  Descrição do Ténis
                </label>
                <textarea
                  rows={3}
                  required
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({ ...productForm, description: e.target.value })
                  }
                  placeholder="Materiais, amortecimento, estilo e detalhes da encomenda..."
                  className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Tamanhos (separados por vírgula)
                  </label>
                  <input
                    type="text"
                    value={productForm.sizes}
                    onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                    placeholder="39, 40, 41, 42, 43, 44"
                    className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Cores Disponíveis
                  </label>
                  <input
                    type="text"
                    value={productForm.colors}
                    onChange={(e) => setProductForm({ ...productForm, colors: e.target.value })}
                    placeholder="Preto / Prateado, Branco"
                    className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Stock Disponível
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.stock}
                    onChange={(e) =>
                      setProductForm({ ...productForm, stock: Number(e.target.value) })
                    }
                    className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Previsão de Encomenda
                  </label>
                  <input
                    type="text"
                    value={productForm.preOrderEstimatedDays}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        preOrderEstimatedDays: e.target.value,
                      })
                    }
                    placeholder="7 - 12 dias úteis"
                    className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                  URL da Foto (ou deixar em branco para manter a atual)
                </label>
                <input
                  type="text"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  placeholder="https://... ou caminho da imagem"
                  className="w-full bg-[#18181C] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) =>
                      setProductForm({ ...productForm, isFeatured: e.target.checked })
                    }
                    className="rounded bg-[#18181C] border-white/20 text-[#D4AF37]"
                  />
                  <span>Produto em Destaque</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isBestSeller}
                    onChange={(e) =>
                      setProductForm({ ...productForm, isBestSeller: e.target.checked })
                    }
                    className="rounded bg-[#18181C] border-white/20 text-[#D4AF37]"
                  />
                  <span>Mais Vendido</span>
                </label>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-black font-semibold text-xs uppercase tracking-wider cursor-pointer shadow"
                >
                  Guardar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
