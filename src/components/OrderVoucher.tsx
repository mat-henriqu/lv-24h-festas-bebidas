import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Order } from "@/types";
import OrderStatusBadge from "./OrderStatusBadge";
import { QRCodeSVG } from "qrcode.react";
import { Calendar, User, Phone, Package, CheckCircle2 } from "lucide-react";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/config/firebase";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface OrderVoucherProps {
  order: Order;
  onUpdate?: () => void;
}

const OrderVoucher = ({ order, onUpdate }: OrderVoucherProps) => {
  const { user } = useAuth();
  const [updating, setUpdating] = useState(false);
  const createdDate = order.createdAt.toDate().toLocaleDateString('pt-BR');
  const createdTime = order.createdAt.toDate().toLocaleTimeString('pt-BR');
  
  // Verificar se é o cliente dono do pedido
  const isOwner = user?.uid === order.userId;

  // Calcular totais
  const totalItems = order.totalItems || order.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalDelivered = order.deliveredItems || 0;
  const allDelivered = totalDelivered === totalItems;

  const handleToggleItemDelivery = async (itemIndex: number, currentDelivered: number, maxQuantity: number) => {
    if (!isOwner || updating) return;

    const newDelivered = currentDelivered >= maxQuantity ? 0 : currentDelivered + 1;
    
    setUpdating(true);
    try {
      const updatedItems = order.items.map((item, idx) => {
        if (idx === itemIndex) {
          return {
            ...item,
            delivered: newDelivered,
            deliveredAt: newDelivered === maxQuantity ? Timestamp.now() : undefined
          };
        }
        return item;
      });

      // Calcular novo total de itens entregues
      const newTotalDelivered = updatedItems.reduce((sum, item) => sum + (item.delivered || 0), 0);
      const isFullyDelivered = newTotalDelivered === totalItems;

      await updateDoc(doc(db, "orders", order.id), {
        items: updatedItems,
        deliveredItems: newTotalDelivered,
        status: isFullyDelivered ? 'delivered' : order.status,
        completedAt: isFullyDelivered ? Timestamp.now() : null
      });

      toast.success(
        newDelivered > currentDelivered 
          ? `Marcado ${newDelivered} item(ns) como recebido`
          : "Marcação removida"
      );
      
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Erro ao atualizar entrega:", error);
      toast.error("Erro ao atualizar. Tente novamente.");
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkAllDelivered = async () => {
    if (!isOwner || updating) return;

    setUpdating(true);
    try {
      const updatedItems = order.items.map(item => ({
        ...item,
        delivered: item.quantity,
        deliveredAt: Timestamp.now()
      }));

      await updateDoc(doc(db, "orders", order.id), {
        items: updatedItems,
        deliveredItems: totalItems,
        status: 'delivered',
        completedAt: Timestamp.now()
      });

      toast.success("Todos os itens marcados como recebidos! ✅");
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Erro ao marcar tudo como entregue:", error);
      toast.error("Erro ao atualizar. Tente novamente.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Card className={`max-w-md mx-auto border-4 ${
      order.status === 'delivered' ? 'border-green-500 bg-green-50' : 
      order.status === 'paid' ? 'border-yellow-500 bg-yellow-50' : 
      'border-gray-300'
    }`}>
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-primary">LV DISTRIBUIDORA 24H</h2>
          <p className="text-sm text-muted-foreground">Voucher de Pedido</p>
          <OrderStatusBadge status={order.status} className="text-sm" />
        </div>

        {/* QR Code */}
        <div className="flex justify-center py-4">
          <div className="bg-white p-4 rounded-lg shadow-inner">
            <QRCodeSVG 
              value={order.voucherCode} 
              size={150}
              level="H"
              includeMargin
            />
          </div>
        </div>

        {/* Voucher Code */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Código do Voucher</p>
          <p className="text-2xl font-mono font-bold tracking-wider text-foreground">
            {order.voucherCode}
          </p>
        </div>

        {/* Customer Info */}
        <div className="space-y-2 border-t border-b border-border py-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">{order.customer.name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{order.customer.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{createdDate} às {createdTime}</span>
          </div>
        </div>

        {/* Items com Sistema de Entrega Parcial */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Package className="h-4 w-4" />
              <span>Itens do Pedido</span>
            </div>
            {isOwner && !allDelivered && totalDelivered > 0 && (
              <span className="text-xs text-orange-600 font-semibold">
                {totalDelivered}/{totalItems} recebidos
              </span>
            )}
          </div>

          {order.items.map((item, index) => {
            const itemDelivered = item.delivered || 0;
            const itemPending = item.quantity - itemDelivered;
            const isItemComplete = itemDelivered === item.quantity;

            return (
              <div 
                key={index} 
                className={`border rounded-lg p-3 transition-all ${
                  isItemComplete ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {item.quantity}x {item.name}
                      </span>
                      {isItemComplete && (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      R$ {item.price.toFixed(2)} cada
                    </p>

                    {/* Marcação de entrega parcial (apenas para o cliente) */}
                    {isOwner && !allDelivered && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          Marque conforme recebe:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {Array.from({ length: item.quantity }, (_, i) => {
                            const isDelivered = i < itemDelivered;
                            return (
                              <button
                                key={i}
                                onClick={() => handleToggleItemDelivery(index, i + 1, item.quantity)}
                                disabled={updating || (i > itemDelivered)}
                                className={`w-8 h-8 rounded border-2 flex items-center justify-center text-xs font-bold transition-all ${
                                  isDelivered 
                                    ? 'bg-green-500 border-green-600 text-white' 
                                    : 'bg-white border-gray-300 text-gray-400 hover:border-green-400'
                                } ${i <= itemDelivered ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                              >
                                {i + 1}
                              </button>
                            );
                          })}
                        </div>
                        {itemDelivered > 0 && itemPending > 0 && (
                          <p className="text-xs text-orange-600 mt-1">
                            ✓ {itemDelivered} recebido • {itemPending} pendente
                          </p>
                        )}
                      </div>
                    )}

                    {/* Exibir status para não-donos */}
                    {!isOwner && itemDelivered > 0 && (
                      <p className="text-xs mt-1">
                        <span className="text-green-600">✓ {itemDelivered} entregue</span>
                        {itemPending > 0 && (
                          <span className="text-orange-600"> • {itemPending} pendente</span>
                        )}
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-semibold whitespace-nowrap">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Botão Marcar Tudo como Entregue */}
        {isOwner && !allDelivered && totalDelivered < totalItems && (
          <Button
            onClick={handleMarkAllDelivered}
            disabled={updating}
            className="w-full bg-green-500 hover:bg-green-600"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Marcar Tudo como Recebido
          </Button>
        )}

        {/* Total */}
        <div className="flex justify-between items-center pt-4 border-t border-border">
          <span className="text-lg font-bold">Total</span>
          <span className="text-2xl font-black text-primary">
            R$ {order.total.toFixed(2)}
          </span>
        </div>

        {/* Instructions */}
        <div className="text-center text-xs text-muted-foreground space-y-1">
          <p>Apresente este voucher ao receber seu pedido</p>
          {isOwner && !allDelivered && (
            <p className="font-semibold text-blue-600">
              💡 Você pode marcar os itens conforme recebe
            </p>
          )}
          {(order.status === 'pending.paid' || order.status === 'pending.delivered') && !allDelivered && (
            <p className="font-semibold text-yellow-600">
              ⚠️ Aguardando confirmação da recepcionista
            </p>
          )}
          {(order.status === 'delivered' || allDelivered) && (
            <div className="space-y-1">
              <p className="font-semibold text-green-600 text-sm">
                ✅ Pedido completamente entregue!
              </p>
              {order.completedAt && (
                <p className="text-xs text-green-600">
                  Finalizado em {order.completedAt.toDate().toLocaleString('pt-BR')}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderVoucher;
