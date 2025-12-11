import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);

  const orderId = searchParams.get('orderId');
  const paymentStatus = searchParams.get('status') || 'approved';

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        navigate('/');
        return;
      }

      try {
        const orderRef = doc(db, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          const orderData = { id: orderSnap.id, ...orderSnap.data() };
          setOrder(orderData);

          // Atualizar status do pedido se foi aprovado
          if (paymentStatus === 'approved' && orderData.status === 'pending.paid') {
            await updateDoc(orderRef, {
              status: 'paid',
              paidAt: new Date()
            });
            setOrder({ ...orderData, status: 'paid' });
          }
        }
      } catch (error) {
        console.error('Erro ao carregar pedido:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId, paymentStatus, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="mt-8">
          <CardContent className="p-8 text-center">
            {paymentStatus === 'approved' ? (
              <>
                <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-green-700 mb-2">
                  Pagamento Aprovado!
                </h1>
                <p className="text-muted-foreground mb-6">
                  Seu pagamento foi processado com sucesso
                </p>
              </>
            ) : paymentStatus === 'pending' ? (
              <>
                <Clock className="h-20 w-20 text-yellow-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-yellow-700 mb-2">
                  Pagamento Pendente
                </h1>
                <p className="text-muted-foreground mb-6">
                  Aguardando confirmação do pagamento
                </p>
              </>
            ) : (
              <>
                <XCircle className="h-20 w-20 text-red-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-red-700 mb-2">
                  Pagamento não concluído
                </h1>
                <p className="text-muted-foreground mb-6">
                  Houve um problema com o pagamento
                </p>
              </>
            )}

            {order && (
              <div className="bg-muted rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground mb-2">
                  Código do Voucher
                </p>
                <p className="text-2xl font-bold text-primary">
                  {order.voucherCode}
                </p>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => navigate(`/pedido/${orderId}`)}
                className="bg-primary"
              >
                Ver Detalhes do Pedido
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/')}
              >
                Voltar ao Início
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
