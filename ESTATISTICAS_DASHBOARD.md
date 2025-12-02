# 📊 Dashboard Admin - Estatísticas Completas

## 🎯 Estatísticas Implementadas

### **1. Visão Geral (Cards Principais)**
- 💰 **Faturamento Total** (hoje/semana/mês/ano)
- 📦 **Total de Pedidos** (hoje/semana/mês/ano)
- 👥 **Clientes Únicos** (hoje/semana/mês/ano)
- 📈 **Ticket Médio** (valor médio por pedido)

### **2. Análise de Vendas**
```typescript
{
  // Faturamento por Período
  today: {
    total: number,
    orders: number,
    customers: number,
    averageTicket: number
  },
  week: { ... },
  month: { ... },
  year: { ... },
  
  // Comparação com Período Anterior
  growth: {
    today: +15.5%,
    week: +8.2%,
    month: +12.3%
  }
}
```

### **3. Análise por Forma de Pagamento**
```typescript
{
  pix: {
    total: number,        // R$ 2.450,00
    orders: number,       // 45 pedidos
    percentage: number    // 42% do total
  },
  card: {
    total: number,        // R$ 1.800,00
    orders: number,       // 30 pedidos
    percentage: number    // 31% do total
  },
  cash: {
    total: number,        // R$ 1.580,00
    orders: number,       // 28 pedidos
    percentage: number    // 27% do total
  }
}
```

### **4. Produtos Mais Vendidos (Top 10)**
```typescript
[
  {
    productId: string,
    name: string,
    category: string,
    image: string,
    totalQuantity: number,      // Quantidade total vendida
    totalRevenue: number,       // Faturamento total deste produto
    ordersCount: number,        // Em quantos pedidos apareceu
    averagePerOrder: number,    // Média de unidades por pedido
    trend: "up" | "down" | "stable"  // Tendência de vendas
  }
]
```

### **5. Categorias Mais Vendidas**
```typescript
[
  {
    category: string,
    totalQuantity: number,
    totalRevenue: number,
    ordersCount: number,
    percentage: number,
    topProduct: {
      name: string,
      quantity: number
    }
  }
]
```

### **6. Análise de Clientes**
```typescript
{
  // Clientes que Mais Compraram (Top 10)
  topCustomers: [
    {
      userId: string,
      name: string,
      email: string,
      phone: string,
      totalOrders: number,      // 15 pedidos
      totalSpent: number,       // R$ 3.450,00
      averageTicket: number,    // R$ 230,00
      lastOrderDate: timestamp,
      favoriteCategory: string
    }
  ],
  
  // Novos Clientes
  newCustomers: {
    today: number,
    week: number,
    month: number
  },
  
  // Clientes Recorrentes
  returningCustomers: {
    count: number,
    percentage: number,  // 68% dos clientes voltam
    averageOrders: number  // Média de 3.5 pedidos por cliente
  }
}
```

### **7. Análise de Horários de Pico**
```typescript
{
  byHour: [
    {
      hour: "14:00",
      orders: number,
      revenue: number,
      customers: number
    }
  ],
  peakHours: ["18:00-20:00", "14:00-16:00"],
  slowHours: ["02:00-06:00"]
}
```

### **8. Status dos Pedidos**
```typescript
{
  pending: {
    count: number,
    total: number
  },
  paid: {
    count: number,
    total: number
  },
  partiallyDelivered: {
    count: number,
    total: number,
    itemsDelivered: number,
    itemsPending: number
  },
  completed: {
    count: number,
    total: number
  }
}
```

### **9. Análise de Estoque**
```typescript
{
  lowStock: [
    {
      productId: string,
      name: string,
      currentStock: number,
      soldToday: number,
      estimatedDaysLeft: number
    }
  ],
  outOfStock: Product[],
  mostRotated: [  // Produtos com maior giro
    {
      product: string,
      soldThisMonth: number,
      averagePerDay: number
    }
  ]
}
```

### **10. Métricas de Entrega**
```typescript
{
  averageDeliveryTime: number,  // Tempo médio até marcar como entregue
  fastestDelivery: number,
  slowestDelivery: number,
  
  partialDeliveries: {
    count: number,
    percentage: number,
    mostCommonReasons: [
      {
        reason: "Produto em falta",
        occurrences: number
      }
    ]
  }
}
```

### **11. Análise de Vouchers/Validação**
```typescript
{
  generatedToday: number,
  validatedToday: number,
  averageValidationTime: number,  // Tempo médio até validar
  pendingValidation: number
}
```

### **12. Análise Financeira Detalhada**
```typescript
{
  // Faturamento Bruto
  grossRevenue: {
    today: number,
    week: number,
    month: number,
    year: number
  },
  
  // Por Forma de Pagamento (Detalhado)
  paymentMethods: {
    pix: {
      count: number,
      total: number,
      percentage: number,
      averageTicket: number,
      largestTransaction: number,
      smallestTransaction: number
    },
    debit: {
      count: number,
      total: number,
      percentage: number,
      averageTicket: number
    },
    credit: {
      count: number,
      total: number,
      percentage: number,
      averageTicket: number
    },
    cash: {
      count: number,
      total: number,
      percentage: number,
      averageTicket: number
    }
  },
  
  // Análise de Taxas (se aplicável)
  fees: {
    pix: number,      // Taxa PIX
    debit: number,    // Taxa débito
    credit: number    // Taxa crédito
  },
  
  // Valor Líquido (após taxas)
  netRevenue: {
    today: number,
    week: number,
    month: number
  }
}
```

### **13. Gráficos e Visualizações**

#### **Gráfico de Linha - Vendas por Período**
- Últimos 7 dias
- Últimos 30 dias
- Últimos 12 meses
- Comparação ano atual vs ano anterior

#### **Gráfico de Pizza**
- Distribuição por forma de pagamento
- Distribuição por categoria
- Status dos pedidos

#### **Gráfico de Barras**
- Top 10 produtos
- Top 10 clientes
- Vendas por hora do dia
- Vendas por dia da semana

#### **Heatmap**
- Vendas por dia da semana + hora
- Identificar padrões de compra

### **14. Alertas e Notificações**
```typescript
{
  alerts: [
    {
      type: "low_stock",
      message: "5 produtos com estoque baixo",
      severity: "warning",
      products: Product[]
    },
    {
      type: "pending_orders",
      message: "12 pedidos aguardando pagamento há mais de 1 hora",
      severity: "high"
    },
    {
      type: "high_demand",
      message: "Cerveja Heineken vendeu 50% a mais que a média",
      severity: "info"
    }
  ]
}
```

### **15. Exportação de Relatórios**
- 📄 PDF com resumo do período
- 📊 Excel com dados detalhados
- 📈 CSV para análise externa
- 📧 Envio automático por email

---

## 🎨 Layout do Dashboard

### **Seção 1: Cards Principais (Topo)**
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ 💰 Hoje     │ 📦 Pedidos  │ 👥 Clientes │ 📊 Ticket   │
│ R$ 2.450,00 │     45      │     32      │ R$ 54,44    │
│ +15.5% ↑    │ +8 ↑        │ +5 ↑        │ +2.1% ↑     │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### **Seção 2: Período Selecionável**
```
[ Hoje ] [ Semana ] [ Mês ] [ Ano ] [ Customizado ]
```

### **Seção 3: Gráfico Principal**
```
┌─────────────────────────────────────────────────────────┐
│ 📈 Faturamento nos Últimos 7 Dias                       │
│                                                          │
│  [Gráfico de Linha com Vendas + Pedidos]                │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### **Seção 4: Análise por Pagamento**
```
┌────────────────────┬────────────────────┬────────────────────┐
│ 💳 PIX             │ 💳 Cartão Débito   │ 💳 Cartão Crédito  │
│ R$ 1.450,00        │ R$ 850,00          │ R$ 950,00          │
│ 42% (25 pedidos)   │ 24% (15 pedidos)   │ 27% (18 pedidos)   │
└────────────────────┴────────────────────┴────────────────────┘
┌────────────────────┐
│ 💵 Dinheiro        │
│ R$ 200,00          │
│ 7% (5 pedidos)     │
└────────────────────┘
```

### **Seção 5: Top Produtos e Clientes**
```
┌──────────────────────────────┬──────────────────────────────┐
│ 🏆 Produtos Mais Vendidos    │ 👑 Melhores Clientes         │
│                              │                              │
│ 1. Cerveja Heineken (120un)  │ 1. João Silva (R$ 850,00)    │
│ 2. Whisky Red Label (45un)   │ 2. Maria Santos (R$ 720,00)  │
│ 3. Vodka Smirnoff (38un)     │ 3. Pedro Costa (R$ 650,00)   │
│ ...                          │ ...                          │
└──────────────────────────────┴──────────────────────────────┘
```

### **Seção 6: Status e Alertas**
```
┌─────────────────────────────────────────────────────────┐
│ ⚠️ Alertas                                              │
│                                                          │
│ 🔴 5 produtos com estoque baixo                          │
│ 🟡 12 pedidos aguardando confirmação de pagamento        │
│ 🔵 Cerveja Heineken: alta demanda (+50% da média)       │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Tecnologias para Gráficos

### **Recharts** (Recomendado)
```bash
npm install recharts
```
- Gráficos de linha, barra, pizza, área
- Responsivo e customizável
- Bem documentado

### **Chart.js com react-chartjs-2**
```bash
npm install chart.js react-chartjs-2
```
- Alternativa robusta
- Muitos tipos de gráficos

---

## 📊 Queries do Firestore para Estatísticas

### **1. Vendas por Período**
```typescript
const getRevenueByPeriod = async (startDate: Date, endDate: Date) => {
  const ordersRef = collection(db, 'orders');
  const q = query(
    ordersRef,
    where('createdAt', '>=', startDate),
    where('createdAt', '<=', endDate),
    where('status', '!=', 'pending.paid')
  );
  
  const snapshot = await getDocs(q);
  const total = snapshot.docs.reduce((sum, doc) => sum + doc.data().total, 0);
  const orders = snapshot.size;
  
  return { total, orders };
};
```

### **2. Top Produtos**
```typescript
const getTopProducts = async (limit: number = 10) => {
  const ordersRef = collection(db, 'orders');
  const snapshot = await getDocs(ordersRef);
  
  const productStats = new Map();
  
  snapshot.docs.forEach(doc => {
    const items = doc.data().items;
    items.forEach(item => {
      if (!productStats.has(item.productId)) {
        productStats.set(item.productId, {
          ...item,
          totalQuantity: 0,
          totalRevenue: 0,
          ordersCount: 0
        });
      }
      
      const stats = productStats.get(item.productId);
      stats.totalQuantity += item.quantity;
      stats.totalRevenue += item.quantity * item.price;
      stats.ordersCount += 1;
    });
  });
  
  return Array.from(productStats.values())
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, limit);
};
```

### **3. Vendas por Forma de Pagamento**
```typescript
const getRevenueByPaymentMethod = async (startDate: Date, endDate: Date) => {
  const ordersRef = collection(db, 'orders');
  const q = query(
    ordersRef,
    where('createdAt', '>=', startDate),
    where('createdAt', '<=', endDate)
  );
  
  const snapshot = await getDocs(q);
  const stats = {
    pix: { total: 0, orders: 0 },
    debit: { total: 0, orders: 0 },
    credit: { total: 0, orders: 0 },
    cash: { total: 0, orders: 0 }
  };
  
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    const method = data.paymentMethod;
    stats[method].total += data.total;
    stats[method].orders += 1;
  });
  
  return stats;
};
```

---

## ✅ Resumo das Estatísticas

| Categoria | Métricas |
|-----------|----------|
| 💰 **Financeiro** | Faturamento total, por período, por forma de pagamento, ticket médio, taxas |
| 📦 **Produtos** | Top vendidos, por categoria, giro de estoque, alertas de estoque baixo |
| 👥 **Clientes** | Total, novos, recorrentes, top compradores, favoritos por cliente |
| 📊 **Pedidos** | Total, status, tempo médio de entrega, entregas parciais |
| ⏰ **Temporal** | Vendas por hora, dia da semana, mês, comparação períodos |
| 📈 **Tendências** | Crescimento, produtos em alta, padrões de compra |
| ⚠️ **Alertas** | Estoque baixo, pedidos pendentes, produtos em alta demanda |

**Total: 15+ categorias de estatísticas completas!** 🎯
