import mercadopago from 'mercadopago';

export default async function handler(req, res) {
  // Apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, orderId, customerEmail, customerName, customerPhone } = req.body;

    // Validar dados
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items são obrigatórios' });
    }

    if (!orderId) {
      return res.status(400).json({ error: 'orderId é obrigatório' });
    }

    // Configurar Mercado Pago com Access Token
    mercadopago.configure({
      access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
    });

    // Criar preferência de pagamento
    const preference = {
      items: items.map(item => ({
        title: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        currency_id: 'BRL',
      })),
      payer: {
        email: customerEmail || 'test@test.com',
        name: customerName,
        phone: {
          number: customerPhone
        }
      },
      back_urls: {
        success: `${process.env.FRONTEND_URL || 'https://mat-henriqu.github.io/lv-24h-festas-bebidas'}/pagamento/sucesso?orderId=${orderId}`,
        failure: `${process.env.FRONTEND_URL || 'https://mat-henriqu.github.io/lv-24h-festas-bebidas'}/pagamento/falha?orderId=${orderId}`,
        pending: `${process.env.FRONTEND_URL || 'https://mat-henriqu.github.io/lv-24h-festas-bebidas'}/pagamento/pendente?orderId=${orderId}`
      },
      auto_return: 'approved',
      external_reference: orderId,
      notification_url: `${process.env.API_URL || 'https://seu-projeto.vercel.app'}/api/webhook`,
      statement_descriptor: 'LV DISTRIBUIDORA',
      metadata: {
        order_id: orderId
      }
    };

    const response = await mercadopago.preferences.create(preference);

    // Retornar init_point para redirecionar o usuário
    return res.status(200).json({
      id: response.body.id,
      init_point: response.body.init_point,
      sandbox_init_point: response.body.sandbox_init_point
    });

  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    return res.status(500).json({ 
      error: 'Erro ao criar preferência de pagamento',
      details: error.message 
    });
  }
}
