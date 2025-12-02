import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, Timestamp, where } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Order } from "@/types";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import { CheckCircle, Search, QrCode } from "lucide-react";
import { toast } from "sonner";

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<'all' | 'pending' | 'delivered'>('pending');

  useEffect(() => {
    // Listener em tempo real para pedidos
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Order));
      setOrders(ordersData);
    });

    return () => unsubscribe();
  }, []);

  const handleDeliverOrder = async (orderId: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: 'delivered',
        completedAt: Timestamp.now()
      });
      toast.success("Pedido marcado como entregue!");
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
      toast.error("Erro ao atualizar pedido");
    }
  };

  const handleConfirmPayment = async (orderId: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: 'pending.delivered'
      });
      toast.success("Pagamento confirmado!");
    } catch (error) {
      console.error("Erro ao confirmar pagamento:", error);
      toast.error("Erro ao confirmar pagamento");
    }
  };

  const filteredOrders = orders.filter(order => {
    // Filtro por status
    if (filter === 'pending' && order.status === 'delivered') return false;
    if (filter === 'delivered' && order.status !== 'delivered') return false;

    // Busca por código ou nome
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        order.voucherCode.toLowerCase().includes(search) ||
        order.customer.name.toLowerCase().includes(search) ||
        order.customer.phone.includes(search)
      );
    }

    return true;
  });

  const pendingCount = orders.filter(o => o.status !== 'delivered').length;
  const deliveredToday = orders.filter(o => {
    if (o.status !== 'delivered') return false;
    const today = new Date().toDateString();
    return o.completedAt?.toDate().toDateString() === today;
  }).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-black mb-2">Painel Recepção</h1>
          <div className="flex gap-4 text-sm">
            <div>
              <p className="opacity-90">Pendentes</p>
              <p className="text-2xl font-bold">{pendingCount}</p>
            </div>
            <div>
              <p className="opacity-90">Entregues Hoje</p>
              <p className="text-2xl font-bold">{deliveredToday}</p>
            </div>
          </div>
        </div>

        {/* Busca */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por código, nome ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs value={filter} onValueChange={(v: string) => setFilter(v as typeof filter)}>
          <TabsList className="w-full mb-6">
            <TabsTrigger value="all" className="flex-1">Todos</TabsTrigger>
            <TabsTrigger value="pending" className="flex-1">Pendentes</TabsTrigger>
            <TabsTrigger value="delivered" className="flex-1">Entregues</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">Nenhum pedido encontrado</p>
              </div>
            ) : (
              filteredOrders.map(order => (
                <Card key={order.id} className={order.status === 'delivered' ? 'border-green-500 bg-green-50' : ''}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <QrCode className="h-5 w-5 text-muted-foreground" />
                          <span className="font-mono font-bold text-lg">{order.voucherCode}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {order.createdAt.toDate().toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <OrderStatusBadge status={order.status} />
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="font-semibold">{order.customer.name}</p>
                      <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                      
                      <div className="mt-3">
                        <p className="text-sm font-semibold mb-1">Itens:</p>
                        {order.items.map((item, idx) => (
                          <p key={idx} className="text-sm text-muted-foreground">
                            {item.quantity}x {item.name}
                          </p>
                        ))}
                      </div>

                      <p className="text-xl font-bold text-primary mt-2">
                        Total: R$ {order.total.toFixed(2)}
                      </p>
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2">
                      {order.status === 'pending.paid' && (
                        <Button 
                          onClick={() => handleConfirmPayment(order.id)}
                          className="flex-1 bg-blue-500 hover:bg-blue-600"
                        >
                          Confirmar Pagamento
                        </Button>
                      )}
                      
                      {(order.status === 'paid' || order.status === 'pending.delivered') && (
                        <Button 
                          onClick={() => handleDeliverOrder(order.id)}
                          className="flex-1 bg-green-500 hover:bg-green-600"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Marcar como Entregue
                        </Button>
                      )}

                      {order.status === 'delivered' && (
                        <div className="flex-1 text-center text-green-600 font-semibold py-2">
                          ✅ Entregue em {order.completedAt?.toDate().toLocaleString('pt-BR')}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminOrders;
