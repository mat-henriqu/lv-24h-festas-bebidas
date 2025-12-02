# 🔐 Sistema Completo com Autenticação e Gestão

## 📊 Nova Estrutura do Sistema

### 🎯 Funcionalidades Principais:

#### **Para Usuários (Clientes):**
- ✅ Login/Cadastro com email/senha
- ✅ Fazer múltiplos pedidos
- ✅ Ver histórico de pedidos
- ✅ Marcar produtos como recebidos no próprio voucher
- ✅ Voucher com QR Code autovalidável

#### **Para Admin:**
- ✅ Login admin separado
- ✅ Dashboard completo
- ✅ Gerenciar produtos (CRUD completo)
- ✅ Ver todos os pedidos
- ✅ Estatísticas de vendas
- ✅ Gerenciar usuários

---

## 🗃️ Nova Estrutura do Firestore

### 1. **Collection: `users`**
```javascript
users/{userId}
{
  uid: string,              // Firebase Auth UID
  email: string,
  name: string,
  phone: string,
  role: 'user' | 'admin',   // Tipo de usuário
  createdAt: timestamp,
  orders: [orderId1, orderId2, ...] // Referências aos pedidos
}
```

### 2. **Collection: `products`**
```javascript
products/{productId}
{
  id: string,
  name: string,
  category: string,         // Categoria livre
  price: number,
  image: string,            // URL da imagem
  description: string,
  stock: number,
  available: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 3. **Collection: `orders`** (ATUALIZADA)
```javascript
orders/{orderId}
{
  id: string,
  userId: string,           // Referência ao usuário
  customer: {
    name: string,
    phone: string,
    email: string
  },
  items: [
    {
      productId: string,
      name: string,
      quantity: number,
      price: number,
      image: string,
      delivered: number,    // ✨ NOVO: Quantidade já entregue
      deliveredAt: timestamp | null  // Quando foi entregue completamente
    }
  ],
  total: number,
  status: 'pending.paid' | 'paid' | 'pending.delivered' | 'delivered',
  paymentMethod: 'pix' | 'card' | 'cash',
  voucherCode: string,
  createdAt: timestamp,
  completedAt: timestamp | null,  // Quando TUDO foi entregue
  notes: string | null,
  // ✨ NOVO: Controle de entrega parcial
  totalItems: number,       // Total de itens no pedido
  deliveredItems: number    // Total de itens já entregues
}
```

### 4. **Collection: `categories`** (NOVA)
```javascript
categories/{categoryId}
{
  id: string,
  name: string,
  icon: string,
  order: number            // Para ordenação
}
```

---

## 🔐 Configuração do Firebase

### 1. **Ativar Authentication**

No Firebase Console:
1. Vá em **Authentication**
2. Clique em **Get Started**
3. Ative **Email/Password**
4. (Opcional) Ative **Google Sign-In**

### 2. **Configurar Firestore Rules**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && isOwner(userId);
      allow update: if isAdmin() || isOwner(userId);
      allow delete: if isAdmin();
    }
    
    // Products collection
    match /products/{productId} {
      allow read: if true; // Qualquer um pode ver produtos
      allow write: if isAdmin(); // Só admin pode modificar
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read: if isAuthenticated() && 
                    (isAdmin() || resource.data.userId == request.auth.uid);
      allow create: if isAuthenticated();
      allow update: if isAdmin() || 
                      (isAuthenticated() && resource.data.userId == request.auth.uid);
      allow delete: if isAdmin();
    }
    
    // Categories collection
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

### 3. **Criar Usuário Admin Inicial**

No Firebase Console:
1. **Authentication** > **Users** > **Add User**
2. Email: `admin@lvdistribuidora.com`
3. Senha: `Admin@123` (mude depois!)
4. Copie o **UID** do usuário criado
5. Vá no **Firestore** > Criar documento em `users`:

```javascript
// Collection: users
// Document ID: [COLE O UID AQUI]
{
  uid: "UID_DO_ADMIN",
  email: "admin@lvdistribuidora.com",
  name: "Administrador",
  phone: "",
  role: "admin",
  createdAt: [timestamp atual],
  orders: []
}
```

---

## 🎨 Fluxo Atualizado

### **Como Cliente:**

1. **Cadastro/Login**
   - Cria conta ou faz login
   - Dados salvos no Firestore

2. **Fazer Pedido**
   - Navega na loja
   - Adiciona produtos ao carrinho
   - Finaliza pedido
   - Pedido vinculado ao userId

3. **Ver Voucher**
   - Acessa "Meus Pedidos"
   - Vê todos os pedidos (histórico)
   - Clica em um pedido
   - Vê voucher com QR Code

4. **Marcar Produtos Recebidos**
   - No próprio voucher/pedido
   - Marca cada produto como recebido
   - Pode marcar quantidade parcial
   - Exemplo: Pediu 6 cervejas, recebeu 3
   - Sistema atualiza automaticamente

### **Como Admin:**

1. **Login Admin**
   - Login com credenciais admin
   - Acesso ao dashboard completo

2. **Gestão de Produtos**
   - CRUD completo (Create, Read, Update, Delete)
   - Upload de imagens
   - Controle de estoque
   - Categorias

3. **Gestão de Pedidos**
   - Ver todos os pedidos
   - Filtros avançados
   - Ver entregas parciais
   - Confirmar pagamentos
   - Ver estatísticas

4. **Dashboard**
   - Total de vendas
   - Produtos mais vendidos
   - Pedidos pendentes
   - Usuários cadastrados

---

## 📱 Páginas a Criar/Atualizar

### **Novas Páginas:**

1. **`/login`** - Login usuário/admin
2. **`/cadastro`** - Cadastro novo usuário
3. **`/meus-pedidos`** - Histórico de pedidos do usuário
4. **`/dashboard`** - Dashboard admin
5. **`/admin/produtos`** - Gestão de produtos (CRUD)
6. **`/admin/usuarios`** - Gestão de usuários
7. **`/admin/estatisticas`** - Relatórios e gráficos

### **Páginas a Atualizar:**

1. **`OrderVoucher`** - Adicionar checkboxes para marcar entregas
2. **`Shop`** - Proteger com autenticação
3. **`Checkout`** - Vincular ao userId
4. **`AdminOrders`** - Mostrar entregas parciais

---

## 🎯 Próximos Passos

Vou criar:

1. ✅ Atualizar tipos TypeScript
2. ✅ Criar hook useAuth
3. ✅ Criar páginas de Login/Cadastro
4. ✅ Atualizar OrderVoucher com marcação de entrega
5. ✅ Criar Dashboard Admin
6. ✅ Criar CRUD de Produtos
7. ✅ Atualizar todas as rotas com proteção

**Posso começar a implementar agora?** 🚀

---

## 💡 Conceito de Entrega Parcial

```
Pedido #LV-ABC123
--------------------
Item 1: 6x Cerveja Heineken
  ✅ Recebido: 3
  ⏳ Pendente: 3
  
Item 2: 2x Whisky Red Label  
  ✅ Recebido: 2 (completo)
  
Item 3: 12x Energético Red Bull
  ✅ Recebido: 0
  ⏳ Pendente: 12

Status: Parcialmente Entregue (5/20 itens)
```

Cliente marca no próprio voucher quando recebe!
