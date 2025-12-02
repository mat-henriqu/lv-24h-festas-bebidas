# 💳 Guia de Integração de Pagamentos - LV Distribuidora

## 🎯 Opções GRATUITAS para Pagamento Online

### 1. **Mercado Pago (RECOMENDADO)** ⭐

**Vantagens:**
- ✅ GRÁTIS para começar
- ✅ PIX instantâneo
- ✅ Aceita cartão de crédito/débito
- ✅ SDK JavaScript fácil de integrar
- ✅ Checkout transparente ou redirect
- ✅ Dashboard completo

**Taxas:**
- PIX: 0,99% por transação
- Cartão de crédito: ~3,99% + R$ 0,40
- Sem mensalidade

**Como Integrar:**

```bash
npm install @mercadopago/sdk-react
```

#### Exemplo de Integração:

```typescript
// src/lib/mercadopago.ts
import { loadMercadoPago } from "@mercadopago/sdk-js";

export const initMercadoPago = () => {
  loadMercadoPago();
  // Sua public key do Mercado Pago
  window.MP = new window.MercadoPago('SUA_PUBLIC_KEY');
};

// Criar preferência de pagamento
export const createPayment = async (orderData: any) => {
  const response = await fetch('SUA_API_BACKEND/create_preference', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: orderData.items.map(item => ({
        title: item.name,
        quantity: item.quantity,
        unit_price: item.price,
      })),
      payer: {
        name: orderData.customer.name,
        email: orderData.customer.email,
        phone: { number: orderData.customer.phone }
      }
    })
  });
  
  return response.json();
};
```

**Documentação:** https://www.mercadopago.com.br/developers

---

### 2. **PagSeguro (PagBank)**

**Vantagens:**
- ✅ GRÁTIS para cadastro
- ✅ PIX + Cartões
- ✅ Link de pagamento (sem código)
- ✅ Checkout transparente disponível

**Taxas:**
- PIX: 0,99%
- Cartão: ~3,99%
- Sem mensalidade

**Como usar:**
- Gere links de pagamento no painel
- Integre via API REST
- Webhook para notificações

**Documentação:** https://dev.pagbank.uol.com.br/

---

### 3. **Stripe** (Internacional, aceita Brasil)

**Vantagens:**
- ✅ Interface moderna
- ✅ Documentação excelente
- ✅ PIX disponível
- ✅ Muito usado globalmente

**Taxas:**
- PIX: 1,4% + R$ 0,25
- Cartão: 3,4% + R$ 0,40

**Documentação:** https://stripe.com/br

---

### 4. **Asaas** (Para pequenos negócios)

**Vantagens:**
- ✅ Plano gratuito disponível
- ✅ PIX + Cartão + Boleto
- ✅ Simples de integrar
- ✅ Ideal para iniciantes

**Taxas:**
- PIX: 1,99%
- Cartão: 4,29%
- Plano gratuito: 50 cobranças/mês

**Documentação:** https://docs.asaas.com/

---

## 🚀 Implementação Rápida (Sem Backend)

### Opção 1: **Link de Pagamento Mercado Pago**

Não precisa de backend! Use apenas links:

```typescript
// src/pages/Checkout.tsx

const handleMercadoPagoPayment = () => {
  // Crie um link de pagamento no dashboard do Mercado Pago
  // Ou use a API de preferências
  window.open('https://mpago.la/SEU_LINK_AQUI', '_blank');
};
```

### Opção 2: **QR Code PIX Manual**

Para começar SEM integração:

```typescript
// src/pages/Checkout.tsx

const handlePixPayment = () => {
  // Mostre seu QR Code PIX fixo
  const pixKey = 'sua-chave@pix.com';
  const pixQRCode = 'codigo-qr-base64-ou-url';
  
  // Exiba em um modal
  // Cliente faz PIX manualmente
  // Confirme manualmente no admin
};
```

---

## 📱 Implementação Recomendada (Simples)

### **Fase 1: Sem Pagamento Online Automático**

```typescript
// Atual no seu projeto:
// 1. Cliente faz pedido
// 2. Escolhe PIX/Cartão/Dinheiro
// 3. Recebe voucher
// 4. Paga na retirada OU via PIX manual
// 5. Recepcionista confirma pagamento no admin
```

✅ **Já está funcionando!** Perfeito para começar.

---

### **Fase 2: Adicionar PIX Automático** (Recomendado)

Use **Mercado Pago** ou **PagSeguro**:

1. **Backend Simples (Firebase Functions ou Node.js):**

```javascript
// functions/index.js (Firebase Functions)
const functions = require('firebase-functions');
const mercadopago = require('mercadopago');

mercadopago.configure({
  access_token: 'SUA_ACCESS_TOKEN'
});

exports.createPayment = functions.https.onCall(async (data, context) => {
  const preference = {
    items: data.items,
    payer: data.customer,
    notification_url: 'SUA_URL_WEBHOOK'
  };
  
  const response = await mercadopago.preferences.create(preference);
  return { id: response.body.id, init_point: response.body.init_point };
});
```

2. **Frontend atualizado:**

```typescript
// src/pages/Checkout.tsx

import { getFunctions, httpsCallable } from 'firebase/functions';

const handleMercadoPagoCheckout = async () => {
  const functions = getFunctions();
  const createPayment = httpsCallable(functions, 'createPayment');
  
  const result = await createPayment({
    items: orderItems,
    customer: customerData
  });
  
  // Redirecionar para checkout Mercado Pago
  window.location.href = result.data.init_point;
};
```

---

## 🎯 **RECOMENDAÇÃO FINAL**

### Para COMEÇAR AGORA (0 custo):

1. **Mantenha sistema atual** (pagamento na retirada)
2. **Adicione QR Code PIX fixo** para quem quiser pagar antecipado
3. **Recepcionista confirma** pagamento manualmente

### Para CRESCER (baixo custo):

1. **Integre Mercado Pago** (melhor custo-benefício)
2. **Automatize PIX** com webhook
3. **Adicione checkout de cartão**

---

## 📦 Próximos Passos

### 1. Testar Sistema Atual
```bash
npm run dev
```

### 2. Popular Firestore com Produtos

Vá no Firebase Console > Firestore e crie produtos:

```json
{
  "name": "Cerveja Heineken Lata 350ml",
  "category": "Cerveja",
  "price": 5.50,
  "image": "https://exemplo.com/heineken.jpg",
  "description": "Cerveja premium importada",
  "stock": 100,
  "available": true
}
```

### 3. Testar Fluxo Completo
- Adicionar produtos ao carrinho
- Fazer checkout
- Ver voucher
- Testar painel admin: `/admin/pedidos`

---

## 💡 Dicas Importantes

1. **Para PIX Manual:**
   - Crie uma chave PIX do negócio
   - Mostre QR Code no checkout
   - Cliente envia comprovante por WhatsApp
   - Confirme no admin

2. **Segurança:**
   - Use Firebase Rules para proteger Firestore
   - Adicione autenticação para admin
   - Valide dados antes de salvar

3. **Melhorias Futuras:**
   - Notificações push quando pedido pronto
   - Histórico de pedidos do cliente
   - Dashboard de vendas
   - Cupons de desconto

---

**Escolha:** Comece sem integração de pagamento e adicione depois! 🚀
