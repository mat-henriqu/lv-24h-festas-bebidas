import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CartItem as CartItemType } from "@/types";
import { useCart } from "@/hooks/useCart";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity } = item;

  const subtotal = product.price * quantity;

  return (
    <Card className="p-4">
      <div className="flex gap-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-20 h-20 object-cover rounded-md"
        />

        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-foreground">{product.name}</h3>
              <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeItem(product.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 border border-border rounded-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateQuantity(product.id, quantity - 1)}
                disabled={quantity <= 1}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateQuantity(product.id, quantity + 1)}
                disabled={quantity >= product.stock}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-right">
              <p className="text-sm text-muted-foreground">R$ {product.price.toFixed(2)} cada</p>
              <p className="font-bold text-lg text-primary">R$ {subtotal.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CartItem;
