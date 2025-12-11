import { useSearchParams, useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="mt-8">
          <CardContent className="p-8 text-center">
            <XCircle className="h-20 w-20 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-red-700 mb-2">
              Pagamento Recusado
            </h1>
            <p className="text-muted-foreground mb-6">
              Não foi possível processar seu pagamento. Você pode tentar novamente.
            </p>

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
                onClick={() => navigate('/carrinho')}
              >
                Voltar ao Carrinho
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

export default PaymentFailure;
