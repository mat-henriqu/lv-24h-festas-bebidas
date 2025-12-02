import { Timestamp } from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';

// Status do pedido
export type OrderStatus = 'pending.paid' | 'paid' | 'pending.delivered' | 'delivered';

// Tipo de usuário
export type UserRole = 'user' | 'admin';

// Usuário
export interface User {
  uid: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  createdAt: Timestamp;
  orders: string[]; // IDs dos pedidos
}

// Produto
export interface Product {
  id: string;
  name: string;
  category: string; // Livre para qualquer categoria
  price: number;
  image: string;
  description: string;
  stock: number;
  available: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Item do carrinho
export interface CartItem {
  product: Product;
  quantity: number;
}

// Item do pedido (simplificado para salvar no Firebase)
export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  delivered: number; // Quantidade já entregue
  deliveredAt?: Timestamp; // Quando foi completamente entregue
}

// Cliente
export interface Customer {
  name: string;
  phone: string;
  email?: string;
}

// Pedido
export interface Order {
  id: string;
  userId: string; // Obrigatório agora
  customer: Customer;
  items: OrderItem[];
  total: number;
  subtotal: number; // Valor antes do desconto
  discount: number; // Valor do desconto aplicado
  couponCode?: string; // Código do cupom usado
  status: OrderStatus;
  paymentMethod: 'pix' | 'card' | 'cash' | 'debit' | 'credit'; // Separado débito/crédito
  voucherCode: string;
  createdAt: Timestamp;
  completedAt?: Timestamp; // Quando tudo foi entregue
  notes?: string;
  totalItems: number; // Total de itens no pedido
  deliveredItems: number; // Total de itens já entregues
}

// Contexto do Carrinho
export interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

// Contexto de Autenticação
export interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
}

// Categoria
export interface Category {
  id: string;
  name: string;
  icon?: string;
  order: number;
}

// Cupom de Desconto
export interface Coupon {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed'; // Percentual ou valor fixo
  value: number; // Percentual (ex: 10 = 10%) ou valor fixo (ex: 50 = R$ 50)
  minPurchase: number; // Valor mínimo da compra para usar o cupom
  maxDiscount?: number; // Desconto máximo em reais (para percentual)
  usageLimit: number; // Limite total de usos
  usedCount: number; // Quantas vezes foi usado
  validFrom: Timestamp;
  validUntil: Timestamp;
  active: boolean;
  createdAt: Timestamp;
}

// Item da Lista de Favoritos
export interface FavoriteItem {
  productId: string;
  addedAt: Timestamp;
}

// Lista de Favoritos do Usuário
export interface UserFavorites {
  userId: string;
  items: FavoriteItem[];
  updatedAt: Timestamp;
}

// Estatísticas do Dashboard
export interface DashboardStats {
  revenue: {
    today: number;
    week: number;
    month: number;
    year: number;
  };
  orders: {
    today: number;
    week: number;
    month: number;
    year: number;
  };
  customers: {
    today: number;
    week: number;
    month: number;
    year: number;
  };
  averageTicket: number;
  paymentMethods: {
    pix: { total: number; orders: number; percentage: number };
    debit: { total: number; orders: number; percentage: number };
    credit: { total: number; orders: number; percentage: number };
    cash: { total: number; orders: number; percentage: number };
  };
  topProducts: Array<{
    productId: string;
    name: string;
    category: string;
    image: string;
    totalQuantity: number;
    totalRevenue: number;
    ordersCount: number;
  }>;
  topCustomers: Array<{
    userId: string;
    name: string;
    email: string;
    totalOrders: number;
    totalSpent: number;
  }>;
}
