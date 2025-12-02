# 🛒 Sistema de Pedidos Online - LV Distribuidora 24h

## 📦 Instalação das Dependências

```bash
npm install firebase qrcode.react uuid
npm install -D @types/uuid
```

## 🔧 Configuração do Firebase

### 1. Criar projeto no Firebase Console

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Escolha um nome (ex: lv-distribuidora)
4. Ative o Firestore Database (modo teste para desenvolvimento)
5. Vá em Configurações do Projeto > Geral
6. Role até "Seus aplicativos" e clique em Web (</>)
7. Copie as credenciais

### 2. Configurar credenciais

Edite `src/config/firebase.ts` e cole suas credenciais do Firebase.

### 3. Estrutura do Firestore

Crie as seguintes collections no Firestore:

#### Collection: `products`
```json
{
  "id": "prod-001",
  "name": "Cerveja Heineken Lata 350ml",
  "category": "cerveja",
  "price": 5.50,
  "image": "url_da_imagem",
  "description": "Cerveja premium importada",
  "stock": 100,
  "available": true
}
```

#### Collection: `orders`
```json
{
  "id": "order-001",
  "customer": {
    "name": "João Silva",
    "phone": "(11) 98765-4321",
    "email": "joao@email.com"
  },
  "items": [{
    "productId": "prod-001",
    "name": "Cerveja Heineken",
    "quantity": 6,
    "price": 5.50,
    "image": "url"
  }],
  "total": 33.00,
  "status": "pending",
  "paymentMethod": "pix",
  "voucherCode": "LV-ABC123",
  "createdAt": "timestamp",
  "deliveredAt": null
}
```

## 📂 Arquivos Criados

### ✅ Já Criados:
- `src/config/firebase.ts` - Configuração Firebase
- `src/types/index.ts` - TypeScript types
- `src/context/CartContext.tsx` - Gerenciamento carrinho
- `src/components/ProductCard.tsx` - Card de produto
- `src/components/CartItem.tsx` - Item do carrinho
- `src/components/OrderStatusBadge.tsx` - Badge de status
- `src/components/OrderVoucher.tsx` - Voucher visual
- `src/pages/Shop.tsx` - Loja online
- `src/pages/Cart.tsx` - Carrinho

### 🔨 Faltam Criar:

#### `src/pages/Checkout.tsx`
Página de checkout com formulário de dados do cliente e seleção de pagamento.

#### `src/pages/OrderSuccess.tsx`
Exibe o voucher após pagamento aprovado.

#### `src/pages/AdminOrders.tsx`
Painel da recepcionista para ver pedidos pendentes e marcar como entregue.

#### `src/hooks/useOrders.ts`
Hook customizado para gerenciar pedidos no Firestore.

## 🚀 Integrar no Projeto

### 1. Atualizar `App.tsx`

```tsx
import { CartProvider } from "@/context/CartContext";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/lv-24h-festas-bebidas">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/loja" element={<Shop />} />
            <Route path="/carrinho" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/pedido/:orderId" element={<OrderSuccess />} />
            <Route path="/admin/pedidos" element={<AdminOrders />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);
```

### 2. Adicionar botão "Fazer Pedido" no Hero

```tsx
<Button onClick={() => navigate('/loja')}>
  Fazer Pedido Online
</Button>
```

## 🎨 Fluxo do Sistema

### Cliente:
1. **Loja** (`/loja`) - Navega e adiciona produtos ao carrinho
2. **Carrinho** (`/carrinho`) - Revisa itens e quantidades
3. **Checkout** (`/checkout`) - Preenche dados e escolhe pagamento
4. **Pagamento** - Simula pagamento (PIX/Cartão/Dinheiro)
5. **Voucher** (`/pedido/:id`) - Recebe voucher com QR Code
6. **Retirada** - Apresenta voucher na recepção

### Recepcionista:
1. **Admin** (`/admin/pedidos`) - Ver lista de pedidos
2. **Ler QR Code** ou **Buscar código** manualmente
3. **Confirmar Entrega** - Marca pedido como entregue
4. **Status muda** - Voucher fica verde

## 🎯 Próximos Passos

1. Instale as dependências
2. Configure o Firebase
3. Popule o Firestore com produtos
4. Teste o fluxo completo
5. Implemente sistema de pagamento real (opcional)
6. Adicione autenticação para admin
7. Deploy

## 💡 Funcionalidades Extras (Futuro)

- Histórico de pedidos do cliente
- Notificações push quando pedido estiver pronto
- Sistema de cupons de desconto
- Programa de fidelidade
- Delivery com rastreamento
- Integração com gateway de pagamento real
- Dashboard com métricas de vendas

## 🔐 Segurança

Para produção:
- Configure regras de segurança do Firestore
- Adicione autenticação Firebase Auth
- Proteja rotas admin
- Valide dados no servidor com Cloud Functions
- Use Environment Variables para chaves API

---

**Desenvolvido para LV Distribuidora 24 Horas** 🍺
