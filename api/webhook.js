import mercadopago from 'mercadopago';

export default async function handler(req, res) {
  // Apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Configurar Mercado Pago
    mercadopago.configure({
      access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
    });

    // Obter dados da notificação
    const { type, data } = req.body;

    console.log('Webhook recebido:', { type, data });

    // Processar apenas notificações de pagamento
    if (type === 'payment') {
      const paymentId = data.id;

      // Buscar informações do pagamento
      const payment = await mercadopago.payment.get(paymentId);
      
      const paymentData = payment.body;
      const orderId = paymentData.external_reference;
      const status = paymentData.status;

      console.log('Pagamento:', {
        id: paymentId,
        orderId,
        status,
        amount: paymentData.transaction_amount
      });

      // Aqui você pode atualizar o status do pedido no Firebase
      // Baseado no status do pagamento:
      // - approved: pagamento aprovado
      // - pending: pagamento pendente
      // - in_process: pagamento em processamento
      // - rejected: pagamento rejeitado
      // - cancelled: pagamento cancelado
      // - refunded: pagamento reembolsado

      // Exemplo de como atualizar (você precisará importar Firebase Admin SDK):
      /*
      const { db } = require('../config/firebase-admin');
      
      let orderStatus = 'pending.paid';
      
      if (status === 'approved') {
        orderStatus = 'paid';
      } else if (status === 'rejected' || status === 'cancelled') {
        orderStatus = 'cancelled';
      }
      
      await db.collection('orders').doc(orderId).update({
        paymentStatus: status,
        status: orderStatus,
        paymentId: paymentId,
        paidAt: status === 'approved' ? new Date() : null
      });
      */

      return res.status(200).json({ 
        success: true, 
        message: 'Webhook processado',
        orderId,
        paymentStatus: status
      });
    }

    return res.status(200).json({ success: true, message: 'Notificação ignorada' });

  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    return res.status(500).json({ 
      error: 'Erro ao processar webhook',
      details: error.message 
    });
  }
}
