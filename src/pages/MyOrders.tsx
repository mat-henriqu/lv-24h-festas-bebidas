import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { Order, Product } from '@/types';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import { Package, Eye, ArrowLeft, ShoppingCart, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

export default function MyOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Listener em tempo real para pedidos do usuário
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Order));
      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleBuyAgain = async (order: Order) => {
    try {
      // Buscar produtos atualizados do Firestore
      const productsRef = collection(db, 'products');
      const productsSnapshot = await onSnapshot(query(productsRef), (snapshot) => {
        order.items.forEach(item => {
          const productDoc = snapshot.docs.find(doc => doc.id === item.productId);
          if (productDoc) {
            const product = { id: productDoc.id, ...productDoc.data() } as Product;
            if (product.available && product.stock >= item.quantity) {
              addItem(product, item.quantity);
            } else if (!product.available) {
              toast.error(`${product.name} não está mais disponível`);
            } else {
              toast.error(`${product.name} não tem estoque suficiente`);
            }
          }
        });
        toast.success('Produtos adicionados ao carrinho!');
        navigate('/carrinho');
      });
      return () => productsSnapshot();
    } catch (error) {
      console.error('Erro ao adicionar produtos:', error);
      toast.error('Erro ao adicionar produtos ao carrinho');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Carregando pedidos...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          <div className="mb-6">
            <h1 className="text-3xl font-black mb-2">Meus Pedidos</h1>
            <p className="text-muted-foreground">
              Acompanhe o status de todos os seus pedidos
            </p>
          </div>

          {orders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum pedido ainda</h3>
                <p className="text-muted-foreground mb-4">
                  Você ainda não fez nenhum pedido
                </p>
                <Button onClick={() => navigate('/loja')}>
                  Fazer Primeiro Pedido
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const totalDelivered = order.deliveredItems || 0;
                const totalItems = order.totalItems || order.items.reduce((sum, item) => sum + item.quantity, 0);
                const isPartiallyDelivered = totalDelivered > 0 && totalDelivered < totalItems;
                const isFullyDelivered = order.status === 'delivered';

                return (
                  <Card key={order.id} className={isFullyDelivered ? 'border-green-200 bg-green-50' : ''}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg mb-2">
                            Pedido #{order.voucherCode}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(order.createdAt.toDate(), {
                              addSuffix: true,
                              locale: ptBR
                            })}
                          </p>
                        </div>
                        <OrderStatusBadge status={order.status} />
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Itens do Pedido */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Itens:</h4>
                        {order.items.map((item, idx) => {
                          const itemDelivered = item.delivered || 0;
                          const itemPending = item.quantity - itemDelivered;
                          
                          return (
                            <div key={idx} className="flex items-center justify-between text-sm border-b pb-2">
                              <div className="flex items-center gap-2">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    R$ {item.price.toFixed(2)} x {item.quantity}
                                  </p>
                                  {isPartiallyDelivered && (
                                    <p className="text-xs">
                                      <span className="text-green-600">✓ {itemDelivered} entregue</span>
                                      {itemPending > 0 && (
                                        <span className="text-orange-600"> • {itemPending} pendente</span>
                                      )}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <p className="font-semibold">
                                R$ {(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Total */}
                      <div className="flex justify-between items-center pt-2 border-t">
                        <p className="font-bold">Total</p>
                        <p className="font-bold text-lg">R$ {order.total.toFixed(2)}</p>
                      </div>

                      {/* Progresso de Entrega */}
                      {(isPartiallyDelivered || isFullyDelivered) && (
                        <div className="bg-muted p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium">Progresso da Entrega</p>
                            <p className="text-sm font-bold">
                              {totalDelivered}/{totalItems} itens
                            </p>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                isFullyDelivered ? 'bg-green-500' : 'bg-orange-500'
                              }`}
                              style={{ width: `${(totalDelivered / totalItems) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Ações */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => navigate(`/pedido/${order.id}`)}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Voucher
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBuyAgain(order)}
                          className="flex-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-300"
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Comprar Novamente
                        </Button>
                      </div>

                      {/* Informações Adicionais */}
                      <div className="text-xs text-muted-foreground space-y-1 border-t pt-2">
                        <p>📱 {order.customer.phone}</p>
                        <p>💳 {order.paymentMethod.toUpperCase()}</p>
                        {order.notes && <p>📝 {order.notes}</p>}
                        {isFullyDelivered && order.completedAt && (
                          <p className="text-green-600 font-semibold">
                            ✅ Entregue em {order.completedAt.toDate().toLocaleString('pt-BR')}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
