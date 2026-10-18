import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Product,
  CartItem,
  User,
  Order,
  AdminLog,
  StoreSettings,
  OrderStatus,
} from '../types';
import {
  INITIAL_PRODUCTS,
  DEFAULT_SETTINGS,
  INITIAL_ORDERS,
} from '../data/initialData';
import {
  hashString,
  INITIAL_ADMIN_EMAIL,
  INITIAL_ADMIN_PASSWORD_HASH,
  generateOrderNumber,
  formatKz,
} from '../utils/security';

export type ViewState =
  | 'welcome'
  | 'home'
  | 'catalog'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'account'
  | 'login'
  | 'admin-login'
  | 'admin-panel';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface StoreContextType {
  // Navigation & View
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductActive: (id: string) => void;
  updateProductPrice: (id: string, newPrice: number) => void;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, size: number, color: string, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartItemCount: number;

  // Customer Auth & Accounts
  currentUser: User | null;
  loginUser: (identifier: string, password: string) => Promise<{ success: boolean; message?: string }>;
  registerUser: (userData: {
    username: string;
    fullName: string;
    email: string;
    phone: string;
    password: string;
    province?: string;
    address?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logoutUser: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
  userOrders: Order[];

  // Admin Auth & Management
  adminUser: { email: string } | null;
  loginAdmin: (email: string, password: string) => Promise<boolean>;
  logoutAdmin: () => void;
  changeAdminPassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  adminLogs: AdminLog[];
  addAdminLog: (action: string, details: string) => void;

  // Orders & Payment
  orders: Order[];
  createOrder: (orderData: {
    customerName: string;
    username: string;
    customerPhone: string;
    customerEmail: string;
    deliveryProvince: string;
    deliveryCity: string;
    deliveryAddress: string;
    notes?: string;
    paymentMethod: Order['paymentMethod'];
    paymentReference: string;
    paymentPhone?: string;
    deliveryFee: number;
  }) => Order;
  confirmOrderPayment: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  openWhatsAppForOrder: (order: Order, targetPhone?: string) => void;
  sendPaidConfirmationToWhatsApp: (order: Order) => void;

  // Settings
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;

  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation
  const [currentView, setCurrentView] = useState<ViewState>('welcome');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Toast notifications
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('bcb_products');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('bcb_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bcb_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('bcb_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Customers
  const [users, setUsers] = useState<Array<User & { passwordHash: string }>>(() => {
    try {
      const saved = localStorage.getItem('bcb_users');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'user-demo-1',
        username: 'carlos.silva',
        fullName: 'Carlos Manuel Silva',
        email: 'carlos.silva@exemplo.ao',
        phone: '+244 923 456 789',
        province: 'Luanda',
        address: 'Condomínio Bela Vista, Casa 42',
        role: 'customer',
        createdAt: '2026-10-10T12:00:00Z',
        passwordHash: '50b4eaf62bba81e5bab350210c32960f0050f99b0de4401d8c927e539fc44b43',
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('bcb_users', JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  }, [users]);

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('bcb_current_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('bcb_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('bcb_current_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  // Admin Auth State
  const [adminUser, setAdminUser] = useState<{ email: string } | null>(() => {
    try {
      const saved = localStorage.getItem('bcb_admin_session');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [adminEmail, setAdminEmail] = useState<string>(() => {
    try {
      return localStorage.getItem('bcb_admin_email') || INITIAL_ADMIN_EMAIL;
    } catch {
      return INITIAL_ADMIN_EMAIL;
    }
  });

  const [adminPasswordHash, setAdminPasswordHash] = useState<string>(() => {
    try {
      return localStorage.getItem('bcb_admin_hash') || INITIAL_ADMIN_PASSWORD_HASH;
    } catch {
      return INITIAL_ADMIN_PASSWORD_HASH;
    }
  });

  const [adminLogs, setAdminLogs] = useState<AdminLog[]>(() => {
    try {
      const saved = localStorage.getItem('bcb_admin_logs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'log-1',
        timestamp: new Date().toISOString(),
        action: 'Sistema Inicializado',
        details: 'Painel administrativo protegido configurado com hash criptográfico seguro.',
        adminEmail: INITIAL_ADMIN_EMAIL,
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('bcb_admin_logs', JSON.stringify(adminLogs));
    } catch (e) {
      console.error(e);
    }
  }, [adminLogs]);

  const addAdminLog = (action: string, details: string) => {
    const newLog: AdminLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      action,
      details,
      adminEmail: adminUser?.email || adminEmail,
    };
    setAdminLogs((prev) => [newLog, ...prev]);
  };

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('bcb_orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ORDERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('bcb_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  // Settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('bcb_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('bcb_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  // Products helpers
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...productData,
      id: 'prod-' + Date.now(),
    };
    setProducts((prev) => [newProd, ...prev]);
    addAdminLog('Produto Adicionado', `Criado produto: ${newProd.name} no valor de ${formatKz(newProd.price)}`);
    showToast(`Produto "${newProd.name}" adicionado com sucesso!`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          addAdminLog('Produto Editado', `Alterações guardadas para: ${updated.name}`);
          return updated;
        }
        return p;
      })
    );
    showToast('Produto atualizado com sucesso.', 'success');
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (target) {
      addAdminLog('Produto Removido', `Produto ${target.name} removido do catálogo.`);
      showToast(`Produto "${target.name}" removido.`, 'info');
    }
  };

  const toggleProductActive = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextState = !p.isActive;
          addAdminLog('Visibilidade de Produto', `${p.name} agora está ${nextState ? 'Ativo' : 'Inativo'}`);
          return { ...p, isActive: nextState };
        }
        return p;
      })
    );
  };

  const updateProductPrice = (id: string, newPrice: number) => {
    if (newPrice <= 0 || isNaN(newPrice)) {
      showToast('Preço inválido.', 'error');
      return;
    }
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          addAdminLog('Preço Atualizado', `${p.name}: de ${formatKz(p.price)} para ${formatKz(newPrice)}`);
          return { ...p, price: newPrice };
        }
        return p;
      })
    );
    showToast(`Preço atualizado para ${formatKz(newPrice)}`, 'success');
  };

  // Cart operations
  const addToCart = (product: Product, size: number, color: string, quantity = 1) => {
    const cartItemId = `${product.id}-${size}-${color}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            productId: product.id,
            product,
            size,
            color,
            quantity,
          },
        ];
      }
    });
    showToast(`${product.name} (Tam: ${size}) adicionado ao carrinho!`, 'success');
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Item removido do carrinho.', 'info');
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Customer Auth
  const loginUser = async (identifier: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    const passHash = await hashString(pass);
    const idClean = identifier.trim().toLowerCase();
    const found = users.find(
      (u) =>
        (u.email.toLowerCase() === idClean || u.username.toLowerCase() === idClean) &&
        u.passwordHash === passHash
    );

    if (found) {
      const { passwordHash: _, ...safeUser } = found;
      setCurrentUser(safeUser);
      showToast(`Bem-vindo de volta, ${safeUser.fullName}!`, 'success');
      return { success: true };
    }
    return { success: false, message: 'Nome de usuário/email ou senha incorretos.' };
  };

  const registerUser = async (data: {
    username: string;
    fullName: string;
    email: string;
    phone: string;
    password: string;
    province?: string;
    address?: string;
  }): Promise<{ success: boolean; message?: string }> => {
    const usernameClean = data.username.trim().toLowerCase();
    const emailClean = data.email.trim().toLowerCase();

    if (users.some((u) => u.username.toLowerCase() === usernameClean)) {
      return { success: false, message: 'Este nome de usuário já está registado.' };
    }
    if (users.some((u) => u.email.toLowerCase() === emailClean)) {
      return { success: false, message: 'Este email já está registado.' };
    }

    const passHash = await hashString(data.password);
    const newUser: User & { passwordHash: string } = {
      id: 'user-' + Date.now(),
      username: usernameClean,
      fullName: data.fullName.trim(),
      email: emailClean,
      phone: data.phone.trim(),
      province: data.province || 'Luanda',
      address: data.address || '',
      role: 'customer',
      createdAt: new Date().toISOString(),
      passwordHash: passHash,
    };

    setUsers((prev) => [...prev, newUser]);
    const { passwordHash: _, ...safeUser } = newUser;
    setCurrentUser(safeUser);
    showToast(`Conta criada com sucesso! Bem-vindo à BCB Shoes.`, 'success');
    return { success: true };
  };

  const logoutUser = () => {
    setCurrentUser(null);
    showToast('Sessão terminada.', 'info');
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...updates } : u))
    );
    showToast('Dados da conta atualizados.', 'success');
  };

  const userOrders = currentUser
    ? orders.filter((o) => o.username.toLowerCase() === currentUser.username.toLowerCase())
    : [];

  // Admin Auth
  const loginAdmin = async (email: string, pass: string): Promise<boolean> => {
    const passHash = await hashString(pass);
    const emailClean = email.trim().toLowerCase();
    if (emailClean === adminEmail.toLowerCase() && passHash === adminPasswordHash) {
      const adminSession = { email: adminEmail };
      setAdminUser(adminSession);
      try {
        localStorage.setItem('bcb_admin_session', JSON.stringify(adminSession));
      } catch (e) {
        console.error(e);
      }
      addAdminLog('Login ADM', `Administrador ${adminEmail} iniciou sessão com sucesso.`);
      showToast('Acesso concedido ao Painel Administrativo.', 'success');
      return true;
    }
    showToast('Credenciais de Administrador incorretas.', 'error');
    return false;
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    try {
      localStorage.removeItem('bcb_admin_session');
    } catch (e) {
      console.error(e);
    }
    showToast('Sessão de Administrador encerrada.', 'info');
    setCurrentView('home');
  };

  const changeAdminPassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    const curHash = await hashString(currentPassword);
    if (curHash !== adminPasswordHash) {
      return { success: false, message: 'A senha atual está incorreta.' };
    }
    if (newPassword.trim().length < 6) {
      return { success: false, message: 'A nova senha deve ter no mínimo 6 caracteres.' };
    }

    const newHash = await hashString(newPassword);
    setAdminPasswordHash(newHash);
    try {
      localStorage.setItem('bcb_admin_hash', newHash);
    } catch (e) {
      console.error(e);
    }
    addAdminLog('Senha Alterada', 'O administrador alterou a sua senha com sucesso.');
    return { success: true, message: 'Senha de administrador alterada com sucesso!' };
  };

  // Orders and Payments
  const createOrder = (orderData: {
    customerName: string;
    username: string;
    customerPhone: string;
    customerEmail: string;
    deliveryProvince: string;
    deliveryCity: string;
    deliveryAddress: string;
    notes?: string;
    paymentMethod: Order['paymentMethod'];
    paymentReference: string;
    paymentPhone?: string;
    deliveryFee: number;
  }): Order => {
    const orderItems = cart.map((item) => ({
      productId: item.productId,
      productName: item.product.name,
      productImage: item.product.images[0] || '',
      price: item.product.price,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
    }));

    const orderNumber = generateOrderNumber();
    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber,
      username: orderData.username,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      deliveryProvince: orderData.deliveryProvince,
      deliveryCity: orderData.deliveryCity,
      deliveryAddress: orderData.deliveryAddress,
      notes: orderData.notes,
      items: orderItems,
      subtotal: cartSubtotal,
      deliveryFee: orderData.deliveryFee,
      total: cartSubtotal + orderData.deliveryFee,
      paymentMethod: orderData.paymentMethod,
      paymentReference: orderData.paymentReference,
      paymentPhone: orderData.paymentPhone,
      paymentStatus: 'Pendente',
      orderStatus: 'Pendente',
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setSelectedOrder(newOrder);
    addAdminLog('Novo Pedido Recebido', `Pedido ${orderNumber} criado por @${newOrder.username} no valor de ${formatKz(newOrder.total)}`);
    return newOrder;
  };

  const confirmOrderPayment = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated: Order = {
            ...ord,
            paymentStatus: 'PAGAMENTO CONFIRMADO',
            orderStatus: ord.orderStatus === 'Pendente' ? 'Em Processamento' : ord.orderStatus,
            confirmedAt: new Date().toISOString(),
          };
          addAdminLog('Pagamento Confirmado', `Pedido ${ord.orderNumber} marcado como PAGAMENTO CONFIRMADO.`);
          return updated;
        }
        return ord;
      })
    );
    showToast('Pagamento confirmado com sucesso!', 'success');
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          addAdminLog('Estado do Pedido Alterado', `Pedido ${ord.orderNumber} alterado para: ${status}`);
          return { ...ord, orderStatus: status };
        }
        return ord;
      })
    );
    showToast(`Estado do pedido atualizado para "${status}".`, 'info');
  };

  // WhatsApp integration with pre-filled message matching prompt requirement
  const openWhatsAppForOrder = (order: Order, targetPhone?: string) => {
    const cleanStorePhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const cleanCustomerPhone = (targetPhone || order.customerPhone || '').replace(/[^0-9]/g, '');
    const destinationNumber = cleanCustomerPhone || cleanStorePhone;

    const firstProduct = order.items.map((i) => `${i.productName} (Tam: ${i.size})`).join(', ');

    const message = `Olá! A BCB Shoes confirma o seu pedido. Obrigado pela sua compra.
Pedido: ${order.orderNumber}
Produto: ${firstProduct}
Valor: ${formatKz(order.total)}
Nome de usuário: ${order.username}`;

    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${destinationNumber}?text=${encoded}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // Direct "PAGO" trigger to WhatsApp +244 955 730 067 with the pre-visualization link
  const sendPaidConfirmationToWhatsApp = (order: Order) => {
    // Official requested WhatsApp number: +244 955 730 067
    const destinationNumber = '244955730067';

    // Get current preview URL
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    const previewUrl =
      currentOrigin && !currentOrigin.includes('localhost') && !currentOrigin.includes('0.0.0.0')
        ? currentOrigin
        : 'https://ais-pre-n6qj5cochh7jvoiark2ul5-358628291361.europe-west2.run.app';

    const productsList = order.items
      .map((i) => `${i.quantity}x ${i.productName} (Tam: ${i.size}, Cor: ${i.color})`)
      .join(', ');

    const message = `Olá BCB Shoes! Já efetuei o pagamento da minha encomenda.

Status: PAGO
Número do Pedido: ${order.orderNumber}
Cliente: ${order.customerName} (@${order.username})
Contacto: ${order.customerPhone}
Produto: ${productsList}
Valor Total: ${formatKz(order.total)}
Método de Pagamento: ${order.paymentMethod.replace('_', ' ')}
Comprovativo / Referência: ${order.paymentReference}

Link de Pré-visualização da BCB Shoes:
${previewUrl}`;

    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${destinationNumber}?text=${encoded}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    showToast('A redirecionar para o WhatsApp oficial com comprovativo e pré-visualização...', 'success');
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      addAdminLog('Configurações Atualizadas', 'As definições da loja foram modificadas pelo administrador.');
      return updated;
    });
    showToast('Configurações da loja guardadas.', 'success');
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProductId,
        setSelectedProductId,
        selectedOrder,
        setSelectedOrder,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductActive,
        updateProductPrice,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartItemCount,
        currentUser,
        loginUser,
        registerUser,
        logoutUser,
        updateUserProfile,
        userOrders,
        adminUser,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        adminLogs,
        addAdminLog,
        orders,
        createOrder,
        confirmOrderPayment,
        updateOrderStatus,
        openWhatsAppForOrder,
        sendPaidConfirmationToWhatsApp,
        settings,
        updateSettings,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
