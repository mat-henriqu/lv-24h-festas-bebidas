import { useState, useEffect } from "react";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Order, Product } from "@/types";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  CreditCard,
  Package,
  AlertTriangle,
  Clock,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays, eachDayOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";

type Period = 'today' | 'week' | 'month' | 'year';

interface Stats {
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
  ordersByStatus: {
    'pending.paid': number;
    'paid': number;
    'pending.delivered': number;
    'delivered': number;
  };
  salesByDay: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  salesByHour: Array<{
    hour: string;
    orders: number;
    revenue: number;
  }>;
}

const COLORS = {
  pix: '#00C853',
  debit: '#2196F3',
  credit: '#FF9800',
  cash: '#9E9E9E',
  primary: '#D4AF37',
  secondary: '#1a1a1a',
};

const AdminDashboard = () => {
  const [period, setPeriod] = useState<Period>('today');
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDateRange = (period: Period) => {
    const now = new Date();
    switch (period) {
      case 'today':
        return { start: startOfDay(now), end: endOfDay(now) };
      case 'week':
        return { start: startOfWeek(now, { locale: ptBR }), end: endOfWeek(now, { locale: ptBR }) };
      case 'month':
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case 'year':
        return { start: startOfYear(now), end: endOfYear(now) };
    }
  };

  const loadStats = async () => {
    try {
      const ordersRef = collection(db, 'orders');
      const ordersSnapshot = await getDocs(ordersRef);
      const allOrders = ordersSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Order));

      // Filtrar pedidos pagos (excluir pending.paid)
      const paidOrders = allOrders.filter(o => o.status !== 'pending.paid');

      // Calcular estatísticas por período
      const now = new Date();
      const todayRange = getDateRange('today');
      const weekRange = getDateRange('week');
      const monthRange = getDateRange('month');
      const yearRange = getDateRange('year');

      const filterByPeriod = (orders: Order[], start: Date, end: Date) => {
        return orders.filter(o => {
          const orderDate = o.createdAt.toDate();
          return orderDate >= start && orderDate <= end;
        });
      };

      const todayOrders = filterByPeriod(paidOrders, todayRange.start, todayRange.end);
      const weekOrders = filterByPeriod(paidOrders, weekRange.start, weekRange.end);
      const monthOrders = filterByPeriod(paidOrders, monthRange.start, monthRange.end);
      const yearOrders = filterByPeriod(paidOrders, yearRange.start, yearRange.end);

      // Receita
      const revenue = {
        today: todayOrders.reduce((sum, o) => sum + o.total, 0),
        week: weekOrders.reduce((sum, o) => sum + o.total, 0),
        month: monthOrders.reduce((sum, o) => sum + o.total, 0),
        year: yearOrders.reduce((sum, o) => sum + o.total, 0),
      };

      // Pedidos
      const orders = {
        today: todayOrders.length,
        week: weekOrders.length,
        month: monthOrders.length,
        year: yearOrders.length,
      };

      // Clientes únicos
      const getUniqueCustomers = (orders: Order[]) => 
        new Set(orders.map(o => o.userId)).size;

      const customers = {
        today: getUniqueCustomers(todayOrders),
        week: getUniqueCustomers(weekOrders),
        month: getUniqueCustomers(monthOrders),
        year: getUniqueCustomers(yearOrders),
      };

      // Ticket médio
      const averageTicket = paidOrders.length > 0
        ? paidOrders.reduce((sum, o) => sum + o.total, 0) / paidOrders.length
        : 0;

      // Análise por forma de pagamento
      const paymentStats = {
        pix: { total: 0, orders: 0, percentage: 0 },
        debit: { total: 0, orders: 0, percentage: 0 },
        credit: { total: 0, orders: 0, percentage: 0 },
        cash: { total: 0, orders: 0, percentage: 0 },
      };

      paidOrders.forEach(order => {
        const method = order.paymentMethod;
        if (paymentStats[method]) {
          paymentStats[method].total += order.total;
          paymentStats[method].orders += 1;
        }
      });

      const totalRevenue = Object.values(paymentStats).reduce((sum, m) => sum + m.total, 0);
      Object.keys(paymentStats).forEach(key => {
        const method = key as keyof typeof paymentStats;
        paymentStats[method].percentage = totalRevenue > 0
          ? (paymentStats[method].total / totalRevenue) * 100
          : 0;
      });

      // Top 10 produtos
      const productStats = new Map<string, {
        productId: string;
        name: string;
        category: string;
        image: string;
        totalQuantity: number;
        totalRevenue: number;
        ordersCount: number;
      }>();

      paidOrders.forEach(order => {
        order.items.forEach(item => {
          if (!productStats.has(item.productId)) {
            productStats.set(item.productId, {
              productId: item.productId,
              name: item.name,
              category: '', // Pode ser preenchido depois
              image: item.image,
              totalQuantity: 0,
              totalRevenue: 0,
              ordersCount: 0,
            });
          }
          const stats = productStats.get(item.productId)!;
          stats.totalQuantity += item.quantity;
          stats.totalRevenue += item.quantity * item.price;
          stats.ordersCount += 1;
        });
      });

      const topProducts = Array.from(productStats.values())
        .sort((a, b) => b.totalQuantity - a.totalQuantity)
        .slice(0, 10);

      // Top 10 clientes
      const customerStats = new Map<string, {
        userId: string;
        name: string;
        email: string;
        totalOrders: number;
        totalSpent: number;
      }>();

      paidOrders.forEach(order => {
        if (!customerStats.has(order.userId)) {
          customerStats.set(order.userId, {
            userId: order.userId,
            name: order.customer.name,
            email: order.customer.email || '',
            totalOrders: 0,
            totalSpent: 0,
          });
        }
        const stats = customerStats.get(order.userId)!;
        stats.totalOrders += 1;
        stats.totalSpent += order.total;
      });

      const topCustomers = Array.from(customerStats.values())
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 10);

      // Status dos pedidos
      const ordersByStatus = {
        'pending.paid': allOrders.filter(o => o.status === 'pending.paid').length,
        'paid': allOrders.filter(o => o.status === 'paid').length,
        'pending.delivered': allOrders.filter(o => o.status === 'pending.delivered').length,
        'delivered': allOrders.filter(o => o.status === 'delivered').length,
      };

      // Vendas por dia (últimos 7 dias)
      const last7Days = eachDayOfInterval({
        start: subDays(now, 6),
        end: now,
      });

      const salesByDay = last7Days.map(day => {
        const dayOrders = filterByPeriod(
          paidOrders,
          startOfDay(day),
          endOfDay(day)
        );
        return {
          date: format(day, 'dd/MM', { locale: ptBR }),
          revenue: dayOrders.reduce((sum, o) => sum + o.total, 0),
          orders: dayOrders.length,
        };
      });

      // Vendas por hora
      const hourStats = Array.from({ length: 24 }, (_, i) => ({
        hour: `${i.toString().padStart(2, '0')}:00`,
        orders: 0,
        revenue: 0,
      }));

      paidOrders.forEach(order => {
        const hour = order.createdAt.toDate().getHours();
        hourStats[hour].orders += 1;
        hourStats[hour].revenue += order.total;
      });

      // Filtrar apenas horas com vendas
      const salesByHour = hourStats.filter(h => h.orders > 0);

      setStats({
        revenue,
        orders,
        customers,
        averageTicket,
        paymentMethods: paymentStats,
        topProducts,
        topCustomers,
        ordersByStatus,
        salesByDay,
        salesByHour,
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Erro ao carregar estatísticas</p>
        </div>
      </div>
    );
  }

  const currentStats = {
    revenue: stats.revenue[period],
    orders: stats.orders[period],
    customers: stats.customers[period],
  };

  // Dados para gráfico de pizza (formas de pagamento)
  const paymentPieData = Object.entries(stats.paymentMethods)
    .filter(([_, data]) => data.total > 0)
    .map(([method, data]) => ({
      name: method === 'pix' ? 'PIX' : 
            method === 'debit' ? 'Débito' :
            method === 'credit' ? 'Crédito' : 'Dinheiro',
      value: data.total,
      orders: data.orders,
    }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-primary mb-2">Dashboard Admin</h1>
          <p className="text-muted-foreground">Visão completa do seu negócio</p>
        </div>

        {/* Seletor de Período */}
        <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)} className="mb-6">
          <TabsList>
            <TabsTrigger value="today">Hoje</TabsTrigger>
            <TabsTrigger value="week">Semana</TabsTrigger>
            <TabsTrigger value="month">Mês</TabsTrigger>
            <TabsTrigger value="year">Ano</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Cards Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Faturamento
              </CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(currentStats.revenue)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {period === 'today' ? 'Hoje' : 
                 period === 'week' ? 'Esta semana' :
                 period === 'month' ? 'Este mês' : 'Este ano'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pedidos
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentStats.orders}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total de pedidos pagos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Clientes
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentStats.customers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Clientes únicos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ticket Médio
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.averageTicket)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Valor médio por pedido
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Vendas por Dia */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Vendas nos Últimos 7 Dias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.salesByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      name === 'revenue' ? formatCurrency(value) : value,
                      name === 'revenue' ? 'Receita' : 'Pedidos'
                    ]}
                  />
                  <Legend formatter={(value) => value === 'revenue' ? 'Receita' : 'Pedidos'} />
                  <Line type="monotone" dataKey="revenue" stroke={COLORS.primary} strokeWidth={2} />
                  <Line type="monotone" dataKey="orders" stroke={COLORS.secondary} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Formas de Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" />
                Formas de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentPieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          entry.name === 'PIX' ? COLORS.pix :
                          entry.name === 'Débito' ? COLORS.debit :
                          entry.name === 'Crédito' ? COLORS.credit :
                          COLORS.cash
                        } 
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {Object.entries(stats.paymentMethods).map(([method, data]) => (
                  data.total > 0 && (
                    <div key={method} className="flex justify-between text-sm">
                      <span className="capitalize">
                        {method === 'pix' ? 'PIX' : 
                         method === 'debit' ? 'Débito' :
                         method === 'credit' ? 'Crédito' : 'Dinheiro'}
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(data.total)} ({data.orders} pedidos)
                      </span>
                    </div>
                  )
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vendas por Hora */}
        {stats.salesByHour.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Vendas por Horário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.salesByHour}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      name === 'revenue' ? formatCurrency(value) : value,
                      name === 'revenue' ? 'Receita' : 'Pedidos'
                    ]}
                  />
                  <Legend formatter={(value) => value === 'revenue' ? 'Receita' : 'Pedidos'} />
                  <Bar dataKey="revenue" fill={COLORS.primary} />
                  <Bar dataKey="orders" fill={COLORS.secondary} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Top Produtos e Clientes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top 10 Produtos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Top 10 Produtos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topProducts.map((product, index) => (
                  <div key={product.productId} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {index + 1}
                    </div>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.totalQuantity} vendidos • {product.ordersCount} pedidos
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{formatCurrency(product.totalRevenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top 10 Clientes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Top 10 Clientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topCustomers.map((customer, index) => (
                  <div key={customer.userId} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{customer.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {customer.email || 'Sem email'} • {customer.totalOrders} pedidos
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{formatCurrency(customer.totalSpent)}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(customer.totalSpent / customer.totalOrders)}/pedido
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status dos Pedidos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Status dos Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Aguardando Pagamento</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.ordersByStatus['pending.paid']}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Pagos</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.ordersByStatus['paid']}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Entrega Parcial</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.ordersByStatus['pending.delivered']}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Entregues</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.ordersByStatus['delivered']}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
