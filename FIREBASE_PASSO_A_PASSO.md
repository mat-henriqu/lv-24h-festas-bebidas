# 🔥 Firebase - Passo a Passo Completo (Para Iniciantes)

## 📋 O que você vai fazer:
1. ✅ Ativar Authentication (login de usuários)
2. ✅ Criar o primeiro usuário admin
3. ✅ Criar as coleções no Firestore
4. ✅ Configurar regras de segurança
5. ✅ (Opcional) Adicionar produtos de exemplo

---

## 🚀 PASSO 1: Ativar Authentication

### 1.1 Acessar o Firebase Console
1. Abra: https://console.firebase.google.com/
2. Clique no seu projeto **"lv-24h-festas-bebidas"**

### 1.2 Ativar Email/Password
1. No menu lateral esquerdo, clique em **"Authentication"** (ícone de pessoa)
2. Clique no botão **"Get started"** (Começar)
3. Na aba **"Sign-in method"** (Métodos de login)
4. Clique em **"Email/Password"**
5. **Ative a primeira opção** (Email/Password) - deixe o toggle AZUL
6. Clique em **"Save"** (Salvar)

✅ **Pronto!** Agora seu app pode criar usuários com email e senha.

---

## 👤 PASSO 2: Criar o Primeiro Usuário Admin

### 2.1 Adicionar Usuário
1. Ainda em **Authentication**
2. Clique na aba **"Users"** (Usuários)
3. Clique no botão **"Add user"** (Adicionar usuário)
4. Preencha:
   - **Email**: `admin@lvdistribuidora.com`
   - **Password**: `Admin@123456` (ou outra senha que quiser)
5. Clique em **"Add user"**

### 2.2 Copiar o UID do Admin
1. Após criar, você verá o usuário na lista
2. **COPIE o UID** (User UID) - é um código tipo: `abc123xyz456def789`
3. Cole em um bloco de notas temporariamente - **você vai usar ele no próximo passo!**

![UID Example](https://i.imgur.com/exemplo-uid.png)

✅ **UID copiado!** Guarde ele, vamos usar daqui a pouco.

---

## 🗄️ PASSO 3: Criar Collections no Firestore

### 3.1 Acessar Firestore
1. No menu lateral esquerdo, clique em **"Firestore Database"**
2. Se aparecer "Get started", clique nele
3. Escolha **"Start in production mode"** (Iniciar em modo produção)
4. Escolha a localização: **"southamerica-east1 (São Paulo)"**
5. Clique em **"Enable"** (Ativar)

### 3.2 Criar Collection "users"
1. Clique em **"Start collection"** (Iniciar coleção)
2. **Collection ID**: `users`
3. Clique em **"Next"** (Próximo)

### 3.3 Adicionar o Admin na Collection "users"
1. **Document ID**: Cole aqui o **UID que você copiou** no Passo 2.2
2. Adicione os campos (clique em "Add field" para cada um):

| Field (Campo) | Type (Tipo) | Value (Valor) |
|---------------|-------------|---------------|
| `uid` | string | Cole o UID novamente |
| `email` | string | `admin@lvdistribuidora.com` |
| `name` | string | `Administrador` |
| `phone` | string | `` (deixe vazio) |
| `role` | string | `admin` |
| `createdAt` | timestamp | Clique no relógio e escolha "now" |
| `orders` | array | Deixe vazio `[]` |

3. Clique em **"Save"** (Salvar)

✅ **Usuário admin criado no Firestore!**

---

### 3.4 Criar Collection "products" (vazia por enquanto)
1. Volte para a tela principal do Firestore
2. Clique em **"Start collection"**
3. **Collection ID**: `products`
4. Clique em **"Next"**
5. **Document ID**: `_exemplo` (apenas para criar a coleção)
6. Adicione um campo qualquer:
   - Field: `temp`
   - Type: `string`
   - Value: `deletar depois`
7. Clique em **"Save"**
8. **DEPOIS** você pode deletar esse documento `_exemplo` (clique nele → três pontinhos → Delete document)

✅ **Collection "products" criada!** (Vamos adicionar produtos depois pelo admin)

---

### 3.5 Criar Collection "orders" (vazia)
1. Repita o mesmo processo acima:
2. **Collection ID**: `orders`
3. Crie um documento temporário `_exemplo` e depois delete

✅ **Collection "orders" criada!**

---

### 3.6 Criar Collection "categories" (opcional - pode fazer depois)
1. Mesma coisa:
2. **Collection ID**: `categories`
3. Documento temporário e delete depois

✅ **Todas as collections criadas!**

Você deve ver isso no Firestore agora:
```
📁 users
   └── [UID do admin]
       
📁 products
   (vazia)
   
📁 orders
   (vazia)
   
📁 categories
   (vazia)
```

---

## 🔒 PASSO 4: Configurar Regras de Segurança

### 4.1 Acessar Rules
1. Em **Firestore Database**, clique na aba **"Rules"** (Regras)
2. Você verá um editor de código

### 4.2 Substituir as Regras
1. **DELETE TUDO** que está escrito lá
2. **COPIE E COLE** o código abaixo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Funções auxiliares
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
    
    // Collection: users
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && isOwner(userId);
      allow update: if isAdmin() || isOwner(userId);
      allow delete: if isAdmin();
    }
    
    // Collection: products
    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Collection: orders
    match /orders/{orderId} {
      allow read: if isAuthenticated() && 
                    (isAdmin() || resource.data.userId == request.auth.uid);
      allow create: if isAuthenticated();
      allow update: if isAdmin() || 
                      (isAuthenticated() && resource.data.userId == request.auth.uid);
      allow delete: if isAdmin();
    }
    
    // Collection: categories
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

3. Clique em **"Publish"** (Publicar)

✅ **Regras de segurança configuradas!** Agora:
- Qualquer um pode VER produtos (para a loja funcionar)
- Só admin pode ADICIONAR/EDITAR/DELETAR produtos
- Usuários só veem seus próprios pedidos
- Admin vê todos os pedidos

---

## 🎉 PASSO 5: Verificar se está tudo OK

### Checklist:
- ✅ Authentication ativado (Email/Password)
- ✅ Usuário admin criado (email: `admin@lvdistribuidora.com`)
- ✅ UID do admin copiado e usado no Firestore
- ✅ Collection `users` criada com documento do admin
- ✅ Collection `products` criada (vazia)
- ✅ Collection `orders` criada (vazia)
- ✅ Collection `categories` criada (vazia)
- ✅ Regras de segurança configuradas e publicadas

---

## 📸 Como deve estar seu Firestore:

```
🔥 Firestore Database
│
├── 📁 users
│   └── 📄 [UID do admin]
│       ├── uid: "abc123..."
│       ├── email: "admin@lvdistribuidora.com"
│       ├── name: "Administrador"
│       ├── phone: ""
│       ├── role: "admin"
│       ├── createdAt: [timestamp]
│       └── orders: []
│
├── 📁 products (vazia)
│
├── 📁 orders (vazia)
│
└── 📁 categories (vazia)
```

---

## ❓ Perguntas Frequentes

**Q: E se eu esquecer a senha do admin?**
A: Vá em Authentication → Users → clique no email do admin → "Reset password"

**Q: Posso mudar o email do admin depois?**
A: Sim! Em Authentication → Users → clique no admin → edite o email

**Q: Como adiciono produtos?**
A: Depois que eu implementar o dashboard admin, você vai conseguir adicionar pelo próprio site! Ou pode adicionar manualmente no Firestore clicando em "Add document" na collection `products`.

**Q: As regras de segurança são obrigatórias?**
A: SIM! Sem elas, qualquer pessoa pode deletar tudo do seu banco. SEMPRE configure as regras.

**Q: E se eu errar alguma coisa?**
A: Sem problemas! Você pode deletar e refazer. O Firebase não cobra nada até passar de limites bem altos.

---

## 🚀 Próximos Passos

Assim que terminar esses 5 passos, **me avise** que eu:

1. ✅ Vou implementar o sistema de login
2. ✅ Criar o dashboard admin
3. ✅ Fazer o CRUD de produtos
4. ✅ Implementar todo o sistema de pedidos
5. ✅ Adicionar as estatísticas completas

**Tudo pronto?** Me manda "Pronto, Firebase configurado!" 🎉

---

## 📝 Credenciais para Teste

Depois de tudo configurado, você vai logar com:

**Admin:**
- Email: `admin@lvdistribuidora.com`
- Senha: `Admin@123456` (ou a que você escolheu)

**Usuário teste** (você pode criar depois no próprio app):
- Qualquer email válido
- Qualquer senha com 6+ caracteres
