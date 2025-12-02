import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!product.available || product.stock < quantity) {
      toast.error("Produto indisponível no momento");
      return;
    }

    addItem(product, quantity);
    toast.success(`${quantity}x ${product.name} adicionado ao carrinho!`);
    setQuantity(1);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {!product.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Indisponível</span>
          </div>
        )}
        {product.stock < 10 && product.available && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            Últimas unidades!
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-foreground">{product.name}</h3>
            <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
          </div>
          <span className="text-xl font-bold text-primary">
            R$ {product.price.toFixed(2)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        <p className="text-xs text-muted-foreground">Estoque: {product.stock} un.</p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <div className="flex items-center border border-border rounded-md">
          <Button
            variant="ghost"
            size="sm"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="h-8 w-8 p-0"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-10 text-center font-semibold">{quantity}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={incrementQuantity}
            disabled={quantity >= product.stock}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <Button
          className="flex-1 bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all"
          onClick={handleAddToCart}
          disabled={!product.available || product.stock === 0}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Adicionar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
