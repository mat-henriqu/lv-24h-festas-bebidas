import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/types";
import { Clock, CheckCircle, Package } from "lucide-react";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const OrderStatusBadge = ({ status, className }: OrderStatusBadgeProps) => {
  const statusConfig = {
    'pending.paid': {
      label: "Aguardando Pagamento",
      color: "bg-yellow-500",
      icon: Clock,
    },
    'paid': {
      label: "Pago",
      color: "bg-blue-500",
      icon: CheckCircle,
    },
    'pending.delivered': {
      label: "Aguardando Retirada",
      color: "bg-orange-500",
      icon: Package,
    },
    'delivered': {
      label: "Entregue",
      color: "bg-green-500",
      icon: CheckCircle,
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge className={`${config.color} text-white ${className}`}>
      <Icon className="mr-1 h-3 w-3" />
      {config.label}
    </Badge>
  );
};

export default OrderStatusBadge;
