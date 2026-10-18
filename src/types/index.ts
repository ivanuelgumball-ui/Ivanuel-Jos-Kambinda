export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number; // in Kwanza (Kz)
  description: string;
  images: string[];
  sizes: number[];
  colors: string[];
  stock: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isActive: boolean;
  preOrderEstimatedDays?: string;
  sku: string;
}

export interface CartItem {
  id: string; // unique item key (productId + size + color)
  productId: string;
  product: Product;
  size: number;
  color: string;
  quantity: number;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  province?: string;
  address?: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export type PaymentMethod = 'MCX_EXPRESS' | 'BANK_TRANSFER' | 'MULTICAIXA_REF';

export type PaymentStatus = 'Pendente' | 'PAGAMENTO CONFIRMADO' | 'Cancelado';

export type OrderStatus = 'Pendente' | 'Em Processamento' | 'Em Envio' | 'Concluído' | 'Cancelado';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  size: number;
  color: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g., BCB-2026-1042
  username: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryProvince: string;
  deliveryCity: string;
  deliveryAddress: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentReference: string;
  paymentPhone?: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  confirmedAt?: string;
}

export interface AdminLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  adminEmail: string;
}

export interface StoreSettings {
  storeName: string;
  whatsappNumber: string; // "+244 955 730 067"
  supportEmail: string;
  baiIban: string;
  bfaIban: string;
  bicIban: string;
  bankAccountHolder: string;
  mcxEntityCode: string;
  categories: string[];
  deliveryLuandaKz: number;
  deliveryProvincesKz: number;
}
