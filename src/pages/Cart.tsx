import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import CartItem from "@/components/CartItem";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ShoppingBag } from "lucide-react";

const Cart = () => {
  const { items, total, clearCart, itemCount } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <div className="text-center space-y-4">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-bold">Seu carrinho está vazio</h2>
          <Button onClick={() => navigate('/loja')}>Ir para a Loja</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 max-w-4xl py-8">
        <Button variant="ghost" onClick={() => navigate('/loja')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continuar Comprando
        </Button>

        <h1 className="text-3xl font-black mb-6">Meu Carrinho ({itemCount} itens)</h1>

        <div className="space-y-4 mb-6">
          {items.map(item => (
            <CartItem key={item.product.id} item={item} />
          ))}
        </div>

        <Card className="sticky bottom-4">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between text-2xl font-bold">
              <span>Total:</span>
              <span className="text-primary">R$ {total.toFixed(2)}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={clearCart} className="flex-1">
                Limpar Carrinho
              </Button>
              <Button onClick={() => navigate('/checkout')} className="flex-1 bg-gradient-to-r from-primary to-secondary">
                Finalizar Pedido
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cart;
