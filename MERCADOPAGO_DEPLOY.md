# Mercado Pago Integration - Guia de Deploy

## 📋 Configuração Completa

### 1. Estrutura de Arquivos Criados

```
/api
  ├── create-preference.js  # Cria preferência de pagamento
  └── webhook.js            # Recebe notificações do Mercado Pago
vercel.json                 # Configuração do Vercel
.env.local                  # Variáveis de ambiente (local)
```

### 2. Deploy no Vercel

#### Passo 1: Criar conta no Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Importe o repositório `lv-24h-festas-bebidas`

#### Passo 2: Configurar Variáveis de Ambiente no Vercel
No painel do Vercel, vá em **Settings > Environment Variables** e adicione:

**Para Produção:**
```
MERCADOPAGO_ACCESS_TOKEN = APP_USR-2942396327584968-121109-5521192c79ae7dffe77a781d9133610f-3057127853
API_URL = https://seu-projeto.vercel.app
FRONTEND_URL = https://mat-henriqu.github.io/lv-24h-festas-bebidas
```

**IMPORTANTE:** Quando for para PRODUÇÃO REAL, troque as credenciais de teste pelas credenciais de produção do Mercado Pago.

#### Passo 3: Deploy
1. Clique em **Deploy**
2. Aguarde o deploy finalizar
3. Anote a URL gerada (ex: `https://lv-24h-festas-bebidas.vercel.app`)

#### Passo 4: Atualizar Frontend
Atualize o arquivo `.env.local` no seu projeto com a URL do Vercel:

```env
VITE_API_URL=https://seu-projeto.vercel.app
```

E faça commit e push das alterações.

### 3. Configurar Webhook no Mercado Pago

1. Acesse o [Painel do Mercado Pago](https://www.mercadopago.com.br/developers/panel)
2. Vá em **Suas integrações > Sua aplicação > Webhooks**
3. Configure a URL do webhook:
   ```
   https://seu-projeto.vercel.app/api/webhook
   ```
4. Selecione os eventos:
   - ✅ Pagamentos
5. Salve as configurações

### 4. Testar Localmente (Opcional)

Para testar localmente antes do deploy:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Executar localmente
vercel dev
```

O servidor local estará disponível em `http://localhost:3000`

### 5. Fluxo de Pagamento

1. **Cliente finaliza pedido** → Checkout cria pedido no Firebase
2. **Frontend chama API** → `/api/create-preference` retorna link do Mercado Pago
3. **Cliente é redirecionado** → Página do Mercado Pago (PIX/Cartão)
4. **Cliente paga** → Mercado Pago processa pagamento
5. **Webhook notifica** → `/api/webhook` recebe confirmação
6. **Status atualizado** → Pedido atualizado no Firebase
7. **Cliente retorna** → Página de sucesso/falha/pendente

### 6. URLs de Retorno

As URLs já estão configuradas no código:

- ✅ Sucesso: `/pagamento/sucesso?orderId=xxx`
- ❌ Falha: `/pagamento/falha?orderId=xxx`
- ⏳ Pendente: `/pagamento/pendente?orderId=xxx`

### 7. Modo Teste vs Produção

**Teste (atual):**
- Usa `sandbox_init_point` (ambiente de teste)
- Credenciais de teste configuradas
- Pagamentos não são reais

**Produção (quando ativar):**
- Usa `init_point` (ambiente real)
- Troque as credenciais para as de produção
- Pagamentos serão reais

Para ativar produção, altere em `create-preference.js`:
```javascript
window.location.href = data.init_point; // Remove sandbox_init_point
```

### 8. Monitoramento

Verifique os logs no Vercel:
- Acesse **Deployments > Sua versão > Functions**
- Veja os logs de `create-preference` e `webhook`

### 9. Segurança

✅ Access Token está protegido no backend (Vercel)  
✅ Public Key está no frontend (pode ser exposta)  
✅ Webhook valida origem Mercado Pago  
✅ CORS configurado automaticamente pelo Vercel  

### 10. Troubleshooting

**Erro: "Failed to fetch"**
- Verifique se a URL da API está correta no `.env.local`
- Confirme que o deploy do Vercel foi bem-sucedido

**Pagamento não atualiza status**
- Verifique se o webhook está configurado no Mercado Pago
- Veja os logs do webhook no Vercel

**Erro 500 na API**
- Verifique se as variáveis de ambiente estão configuradas no Vercel
- Confirme que o Access Token está correto

---

## 🚀 Pronto para Deploy!

Após seguir estes passos, seu sistema de pagamento com Mercado Pago estará funcionando em produção.

**Próximos passos:**
1. Testar em ambiente de teste
2. Validar fluxo completo de pagamento
3. Quando aprovado, trocar para credenciais de produção
4. Ativar para clientes reais! 🎉
