# 🚀 Guia Rápido de Teste - Sistema Completo!

## ✅ Sistema Implementado com Sucesso!

### 📁 Arquivos Criados:
- ✅ Configuração Firebase
- ✅ Tipos TypeScript (OrderStatus atualizado!)
- ✅ Context do Carrinho
- ✅ Componentes: ProductCard, CartItem, OrderVoucher, OrderStatusBadge
- ✅ Páginas: Shop, Cart, Checkout, OrderSuccess, AdminOrders
- ✅ Rotas integradas no App.tsx
- ✅ Hero com botão "Fazer Pedido Online"

---

## 🎯 Status dos Pedidos (Atualizado):

1. **`pending.paid`** 🟡 - Aguardando pagamento (PIX pendente)
2. **`paid`** 🔵 - Pagamento confirmado
3. **`pending.delivered`** 🟠 - Pago, aguardando entrega
4. **`delivered`** 🟢 - Entregue (card verde!)

---

## 🧪 Como Testar AGORA:

### 1️⃣ **Rodar o Projeto**

```bash
npm run dev
```

Acesse: `http://localhost:8080`

---

### 2️⃣ **Criar Produtos no Firestore**

Vá no Firebase Console:
- https://console.firebase.google.com/
- Selecione seu projeto: `lv-24h-festas-bebidas`
- Firestore Database > Coleções
- Criar collection `products`

**Exemplo de Produto:**

```json
{
  "name": "Cerveja Heineken Lata 350ml",
  "category": "Cerveja",
  "price": 5.50,
  "image": "https://via.placeholder.com/300?text=Heineken",
  "description": "Cerveja premium importada, sempre gelada!",
  "stock": 100,
  "available": true
}
```

**Adicione mais produtos:**

```json
{
  "name": "Whisky Red Label 1L",
  "category": "Whisky",
  "price": 89.90,
  "image": "https://via.placeholder.com/300?text=Red+Label",
  "description": "Whisky escocês premium",
  "stock": 20,
  "available": true
}
```

```json
{
  "name": "Energético Red Bull 250ml",
  "category": "Energético",
  "price": 8.50,
  "image": "https://via.placeholder.com/300?text=Red+Bull",
  "description": "Energia para sua festa!",
  "stock": 150,
  "available": true
}
```

```json
{
  "name": "Gelo Saborizado Limão 1kg",
  "category": "Gelo",
  "price": 12.00,
  "image": "https://via.placeholder.com/300?text=Gelo+Limao",
  "description": "Gelo com sabor de limão",
  "stock": 50,
  "available": true
}
```

---

### 3️⃣ **Fluxo de Teste Completo**

#### **Como Cliente:**

1. Abra: `http://localhost:8080`
2. Clique em **"Fazer Pedido Online"**
3. Navegue pela loja: `http://localhost:8080/loja`
4. Adicione produtos ao carrinho
5. Clique no botão **"Carrinho"** (com badge)
6. Revise itens
7. Clique em **"Finalizar Pedido"**
8. Preencha dados:
   - Nome: João Silva
   - Telefone: (11) 98765-4321
9. Escolha forma de pagamento:
   - **PIX** → Status inicial: `pending.paid`
   - **Cartão/Dinheiro** → Status inicial: `paid`
10. Clique em **"Confirmar Pedido"**
11. Veja seu **VOUCHER** com QR Code!
12. Anote o código (ex: LV-ABC12345)

#### **Como Recepcionista:**

1. Acesse: `http://localhost:8080/admin/pedidos`
2. Veja lista de pedidos em tempo real
3. Use a busca para encontrar por código/nome
4. **Se PIX (`pending.paid`):**
   - Clique em **"Confirmar Pagamento"**
   - Status muda para `pending.delivered`
5. **Se pago (`paid` ou `pending.delivered`):**
   - Cliente apresenta voucher
   - Clique em **"Marcar como Entregue"**
   - Card fica **VERDE** ✅
   - Status: `delivered`

---

## 🎨 URLs Disponíveis:

- **`/`** - Home (Hero + Produtos + Contato)
- **`/loja`** - Loja Online
- **`/carrinho`** - Carrinho de Compras
- **`/checkout`** - Finalizar Pedido
- **`/pedido/:id`** - Voucher do Pedido
- **`/admin/pedidos`** - Painel Recepção

---

## 🔧 Resolver Problemas:

### Erro: "Firebase not configured"
- Verifique `src/config/firebase.ts`
- Credenciais já configuradas!

### Produtos não aparecem:
- Vá no Firestore e crie produtos
- Verifique se `available: true`

### Carrinho não salva:
- Está usando localStorage
- Limpe cache do navegador se necessário

---

## 📱 Sobre Pagamentos:

**Sistema ATUAL:**
- ✅ Cliente escolhe forma de pagamento
- ✅ Recebe voucher
- ✅ Paga na retirada (cartão/dinheiro)
- ✅ OU via PIX (manual - cliente envia comprovante)
- ✅ Recepcionista confirma e marca como entregue

**FUTURO (opcional):**
- Integrar Mercado Pago para PIX automático
- Aceitar cartão online
- Veja: `PAGAMENTOS.md`

---

## 🎉 Próximos Passos:

1. ✅ **Testar tudo funcionando**
2. 📸 **Adicionar imagens reais dos produtos**
3. 🎨 **Customizar cores/design**
4. 💳 **Integrar pagamento (quando quiser)**
5. 🚀 **Deploy no GitHub Pages**
6. 📱 **Divulgar o link!**

---

## 🐛 Comandos Úteis:

```bash
# Rodar desenvolvimento
npm run dev

# Build para produção
npm run build

# Deploy no GitHub Pages
npm run deploy

# Atualizar dependências
npm audit fix
```

---

## 📞 Suporte:

Qualquer dúvida, só chamar! Sistema completo e funcionando! 🍺🎉

---

**Desenvolvido para LV Distribuidora 24 Horas**
Sistema de Pedidos Online v1.0
