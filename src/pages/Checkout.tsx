import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CreditCard, Banknote, Smartphone, Tag, X } from "lucide-react";
import { collection, addDoc, Timestamp, updateDoc, doc, arrayUnion, query, where, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Customer, OrderItem, Coupon } from "@/types";

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [customer, setCustomer] = useState<Customer>({
    name: "",
    phone: "",
    email: "",
  });
  
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | 'cash'>('pix');
  const [notes, setNotes] = useState("");
  
  // Estados do Cupom
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  
  // Cálculo do subtotal, desconto e total final
  const subtotal = total;
  const discount = appliedCoupon 
    ? appliedCoupon.type === 'percentage'
      ? Math.min(
          (subtotal * appliedCoupon.value) / 100,
          appliedCoupon.maxDiscount || Infinity
        )
      : appliedCoupon.value
    : 0;
  const finalTotal = Math.max(subtotal - discount, 0);
  
  // Validar e aplicar cupom
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Digite um código de cupom");
      return;
    }
    
    setValidatingCoupon(true);
    
    try {
      // Buscar cupom no Firestore
      const couponsRef = collection(db, "coupons");
      const q = query(couponsRef, where("code", "==", couponCode.toUpperCase()));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        toast.error("Cupom não encontrado");
        setValidatingCoupon(false);
        return;
      }
      
      const couponData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Coupon;
      
      // Validações
      if (!couponData.active) {
        toast.error("Este cupom está inativo");
        setValidatingCoupon(false);
        return;
      }
      
      const now = new Date();
      const validFrom = couponData.validFrom.toDate();
      const validUntil = couponData.validUntil.toDate();
      
      if (now < validFrom) {
        toast.error("Este cupom ainda não está válido");
        setValidatingCoupon(false);
        return;
      }
      
      if (now > validUntil) {
        toast.error("Este cupom expirou");
        setValidatingCoupon(false);
        return;
      }
      
      if (couponData.usedCount >= couponData.usageLimit) {
        toast.error("Este cupom atingiu o limite de uso");
        setValidatingCoupon(false);
        return;
      }
      
      if (subtotal < couponData.minPurchase) {
        toast.error(
          `Valor mínimo de compra: R$ ${couponData.minPurchase.toFixed(2)}`
        );
        setValidatingCoupon(false);
        return;
      }
      
      // Cupom válido!
      setAppliedCoupon(couponData);
      toast.success(
        `Cupom aplicado! Desconto de ${
          couponData.type === 'percentage'
            ? `${couponData.value}%`
            : `R$ ${couponData.value.toFixed(2)}`
        }`
      );
      
    } catch (error) {
      console.error("Erro ao validar cupom:", error);
      toast.error("Erro ao validar cupom");
    } finally {
      setValidatingCoupon(false);
    }
  };
  
  // Remover cupom aplicado
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.info("Cupom removido");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customer.name || !customer.phone) {
      toast.error("Preencha nome e telefone");
      return;
    }

    setLoading(true);
    
    try {
      if (!user) {
        toast.error("Você precisa estar logado");
        navigate('/login');
        return;
      }

      // Gerar código do voucher
      const voucherCode = `LV-${uuidv4().substring(0, 8).toUpperCase()}`;
      
      // Preparar itens do pedido com campos de entrega
      const orderItems: OrderItem[] = items.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.image,
        delivered: 0, // Nenhum item entregue ainda
        deliveredAt: undefined,
      }));

      // Calcular total de itens
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

      // Criar pedido no Firebase
      const orderRef = await addDoc(collection(db, "orders"), {
        userId: user.uid, // Vincular ao usuário
        customer,
        items: orderItems,
        total: finalTotal,
        subtotal,
        discount,
        couponCode: appliedCoupon?.code || null,
        status: paymentMethod === 'pix' ? 'pending.paid' : 'paid', // PIX aguarda pagamento
        paymentMethod,
        voucherCode,
        createdAt: Timestamp.now(),
        completedAt: null,
        notes: notes || null,
        totalItems,
        deliveredItems: 0, // Nenhum item entregue ainda
      });
      
      // Se um cupom foi usado, incrementar o contador
      if (appliedCoupon) {
        await updateDoc(doc(db, "coupons", appliedCoupon.id), {
          usedCount: appliedCoupon.usedCount + 1
        });
      }

      // Atualizar array de pedidos do usuário
      await updateDoc(doc(db, "users", user.uid), {
        orders: arrayUnion(orderRef.id)
      });

      // Limpar carrinho
      clearCart();
      
      // Redirecionar para página do voucher
      toast.success("Pedido realizado com sucesso!");
      navigate(`/pedido/${orderRef.id}`);
      
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      toast.error("Erro ao processar pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/carrinho');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 max-w-4xl py-8">
        <Button variant="ghost" onClick={() => navigate('/carrinho')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Carrinho
        </Button>

        <h1 className="text-3xl font-black mb-6">Finalizar Pedido</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados do Cliente */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Seus Dados</h2>
              
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={customer.name}
                  onChange={(e) => setCustomer({...customer, name: e.target.value})}
                  placeholder="João Silva"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone/WhatsApp *</Label>
                <Input
                  id="phone"
                  value={customer.phone}
                  onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                  placeholder="(11) 98765-4321"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (opcional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={customer.email}
                  onChange={(e) => setCustomer({...customer, email: e.target.value})}
                  placeholder="seuemail@exemplo.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações (opcional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Alguma observação sobre seu pedido?"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Forma de Pagamento */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Forma de Pagamento</h2>
              
              <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted">
                  <RadioGroupItem value="pix" id="pix" />
                  <Label htmlFor="pix" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Smartphone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">PIX</p>
                      <p className="text-xs text-muted-foreground">Pagamento instantâneo</p>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">Cartão de Crédito/Débito</p>
                      <p className="text-xs text-muted-foreground">Pagar na retirada</p>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Banknote className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">Dinheiro</p>
                      <p className="text-xs text-muted-foreground">Pagar na retirada</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Resumo */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Resumo do Pedido</h2>
              
              {items.map(item => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.product.name}</span>
                  <span className="font-semibold">R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                
                {/* Campo de Cupom */}
                <div className="space-y-2">
                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Código do cupom"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1"
                        disabled={validatingCoupon}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleApplyCoupon}
                        disabled={validatingCoupon || !couponCode.trim()}
                        className="px-4"
                      >
                        {validatingCoupon ? (
                          "..."
                        ) : (
                          <>
                            <Tag className="mr-2 h-4 w-4" />
                            Aplicar
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-sm font-semibold text-green-700">
                            {appliedCoupon.code}
                          </p>
                          <p className="text-xs text-green-600">
                            {appliedCoupon.description}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveCoupon}
                        className="h-8 w-8 p-0 text-green-700 hover:text-green-800 hover:bg-green-100"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 font-semibold">
                    <span>Desconto:</span>
                    <span>- R$ {discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between text-2xl font-bold pt-4 border-t">
                <span>Total:</span>
                <span className="text-primary">R$ {finalTotal.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Botão Finalizar */}
          <Button 
            type="submit" 
            className="w-full py-6 text-lg bg-gradient-to-r from-primary to-secondary"
            disabled={loading}
          >
            {loading ? "Processando..." : "Confirmar Pedido"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
