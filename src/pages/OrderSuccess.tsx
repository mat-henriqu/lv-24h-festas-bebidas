import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Order } from "@/types";
import OrderVoucher from "@/components/OrderVoucher";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    // Listener em tempo real
    const unsubscribe = onSnapshot(
      doc(db, "orders", orderId),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setOrder({ id: docSnapshot.id, ...docSnapshot.data() } as Order);
        } else {
          setOrder(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Erro ao carregar pedido:", error);
        setLoading(false);
      }
    );

    // Cleanup do listener quando componente desmontar
    return () => unsubscribe();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando pedido...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-xl font-semibold">Pedido não encontrado</p>
          <Button onClick={() => navigate('/')}>Voltar ao Início</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Mensagem de Sucesso */}
        <div className="text-center mb-8 space-y-2">
          <div className="text-6xl">🎉</div>
          <h1 className="text-3xl font-black text-primary">Pedido Confirmado!</h1>
          <p className="text-muted-foreground">
            Seu pedido foi realizado com sucesso. Guarde este voucher!
          </p>
        </div>

        {/* Voucher */}
        <OrderVoucher order={order} />

        {/* Instruções */}
        <div className="max-w-md mx-auto mt-8 space-y-4">
          {order.status === 'pending.paid' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
              <p className="font-semibold text-yellow-800 mb-2">⚠️ Aguardando Pagamento PIX</p>
              <p className="text-yellow-700">
                Realize o pagamento via PIX para confirmar seu pedido. 
                Após o pagamento, seu voucher será atualizado automaticamente.
              </p>
            </div>
          )}

          {order.status === 'paid' || order.status === 'pending.delivered' ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
              <p className="font-semibold text-blue-800 mb-2">✅ Pagamento Confirmado</p>
              <p className="text-blue-700">
                Seu pedido está pronto para retirada! Apresente este voucher na recepção.
              </p>
            </div>
          ) : null}

          {order.status === 'delivered' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
              <p className="font-semibold text-green-800 mb-2">🎉 Pedido Completo</p>
              <p className="text-green-700">
                Todos os itens foram entregues! Obrigado pela preferência.
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              className="flex-1 bg-gradient-to-r from-primary to-secondary"
              onClick={() => navigate('/')}
            >
              <Home className="mr-2 h-4 w-4" />
              Voltar ao Início
            </Button>
          </div>

          {/* Indicador de atualização em tempo real */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Atualizando em tempo real
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
