import { useSearchParams, useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const PaymentPending = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="mt-8">
          <CardContent className="p-8 text-center">
            <Clock className="h-20 w-20 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-yellow-700 mb-2">
              Pagamento Pendente
            </h1>
            <p className="text-muted-foreground mb-6">
              Estamos aguardando a confirmação do seu pagamento. Isso pode levar alguns minutos.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                Você receberá uma notificação assim que o pagamento for confirmado.
                Acompanhe o status do seu pedido na área de "Meus Pedidos".
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              {orderId && (
                <Button
                  onClick={() => navigate(`/pedido/${orderId}`)}
                  className="bg-primary"
                >
                  Ver Pedido
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => navigate('/meus-pedidos')}
              >
                Meus Pedidos
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

export default PaymentPending;
