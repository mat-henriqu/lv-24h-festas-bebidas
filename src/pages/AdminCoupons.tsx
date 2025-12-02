import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp, query, orderBy } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Coupon } from "@/types";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Ticket, Plus, Pencil, Trash2, Percent, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface CouponFormData {
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: string;
  minPurchase: string;
  maxDiscount: string;
  usageLimit: string;
  validFrom: string;
  validUntil: string;
  active: boolean;
}

const AdminCoupons = () => {
  const [coupons, setcoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<CouponFormData>({
    code: "",
    description: "",
    type: "percentage",
    value: "",
    minPurchase: "0",
    maxDiscount: "",
    usageLimit: "100",
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    active: true,
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const couponsRef = collection(db, "coupons");
      const q = query(couponsRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const couponsData = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Coupon)
      );
      setcoupons(couponsData);
    } catch (error) {
      console.error("Erro ao carregar cupons:", error);
      toast.error("Erro ao carregar cupons");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      type: "percentage",
      value: "",
      minPurchase: "0",
      maxDiscount: "",
      usageLimit: "100",
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      active: true,
    });
    setEditingCoupon(null);
  };

  const handleOpenDialog = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        description: coupon.description,
        type: coupon.type,
        value: coupon.value.toString(),
        minPurchase: coupon.minPurchase.toString(),
        maxDiscount: coupon.maxDiscount?.toString() || "",
        usageLimit: coupon.usageLimit.toString(),
        validFrom: coupon.validFrom.toDate().toISOString().split('T')[0],
        validUntil: coupon.validUntil.toDate().toISOString().split('T')[0],
        active: coupon.active,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSave = async () => {
    if (!formData.code || !formData.value || !formData.usageLimit) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setSaving(true);
    try {
      const couponData = {
        code: formData.code.toUpperCase(),
        description: formData.description,
        type: formData.type,
        value: parseFloat(formData.value),
        minPurchase: parseFloat(formData.minPurchase) || 0,
        maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
        usageLimit: parseInt(formData.usageLimit),
        usedCount: editingCoupon?.usedCount || 0,
        validFrom: Timestamp.fromDate(new Date(formData.validFrom)),
        validUntil: Timestamp.fromDate(new Date(formData.validUntil + 'T23:59:59')),
        active: formData.active,
      };

      if (editingCoupon) {
        await updateDoc(doc(db, "coupons", editingCoupon.id), couponData);
        toast.success("Cupom atualizado com sucesso!");
      } else {
        await addDoc(collection(db, "coupons"), {
          ...couponData,
          createdAt: Timestamp.now(),
        });
        toast.success("Cupom criado com sucesso!");
      }

      handleCloseDialog();
      loadCoupons();
    } catch (error) {
      console.error("Erro ao salvar cupom:", error);
      toast.error("Erro ao salvar cupom");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!couponToDelete) return;

    try {
      await deleteDoc(doc(db, "coupons", couponToDelete.id));
      toast.success("Cupom excluído com sucesso!");
      setIsDeleteDialogOpen(false);
      setCouponToDelete(null);
      loadCoupons();
    } catch (error) {
      console.error("Erro ao excluir cupom:", error);
      toast.error("Erro ao excluir cupom");
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const isExpired = (coupon: Coupon) => {
    return coupon.validUntil.toDate() < new Date();
  };

  const isUsageLimitReached = (coupon: Coupon) => {
    return coupon.usedCount >= coupon.usageLimit;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Carregando cupons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-primary mb-2">Gerenciar Cupons</h1>
          <p className="text-muted-foreground">Crie e gerencie cupons de desconto</p>
        </div>

        <div className="flex justify-end mb-6">
          <Button
            onClick={() => handleOpenDialog()}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Criar Cupom
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              Cupons ({coupons.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Uso</TableHead>
                    <TableHead>Validade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        Nenhum cupom cadastrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    coupons.map((coupon) => (
                      <TableRow key={coupon.id}>
                        <TableCell className="font-mono font-bold text-primary">
                          {coupon.code}
                        </TableCell>
                        <TableCell>{coupon.description}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {coupon.type === 'percentage' ? (
                              <><Percent className="h-3 w-3 mr-1" /> Percentual</>
                            ) : (
                              <><DollarSign className="h-3 w-3 mr-1" /> Fixo</>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {coupon.type === 'percentage'
                            ? `${coupon.value}%`
                            : formatCurrency(coupon.value)}
                        </TableCell>
                        <TableCell>
                          <span className={coupon.usedCount >= coupon.usageLimit ? 'text-red-600 font-semibold' : ''}>
                            {coupon.usedCount}/{coupon.usageLimit}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">
                          {coupon.validUntil.toDate().toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          {!coupon.active ? (
                            <Badge variant="secondary">Inativo</Badge>
                          ) : isExpired(coupon) ? (
                            <Badge variant="destructive">Expirado</Badge>
                          ) : isUsageLimitReached(coupon) ? (
                            <Badge variant="destructive">Esgotado</Badge>
                          ) : (
                            <Badge variant="default" className="bg-green-600">Ativo</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDialog(coupon)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setCouponToDelete(coupon);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCoupon ? "Editar Cupom" : "Criar Cupom"}
              </DialogTitle>
              <DialogDescription>
                {editingCoupon
                  ? "Atualize as informações do cupom"
                  : "Preencha os dados do novo cupom de desconto"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="code">
                  Código <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="Ex: PRIMEIRACOMPRA"
                  className="font-mono font-bold"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição do cupom"
                  rows={2}
                />
              </div>

              <div className="grid gap-2">
                <Label>
                  Tipo de Desconto <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={formData.type}
                  onValueChange={(value: 'percentage' | 'fixed') =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="percentage" id="percentage" />
                    <Label htmlFor="percentage" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4" />
                        Percentual (%)
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <Label htmlFor="fixed" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Valor Fixo (R$)
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="value">
                    {formData.type === 'percentage' ? 'Percentual (%)' : 'Valor (R$)'}{' '}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.01"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder={formData.type === 'percentage' ? '10' : '50.00'}
                  />
                </div>
                {formData.type === 'percentage' && (
                  <div className="grid gap-2">
                    <Label htmlFor="maxDiscount">Desconto Máximo (R$)</Label>
                    <Input
                      id="maxDiscount"
                      type="number"
                      step="0.01"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                      placeholder="Opcional"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="minPurchase">Compra Mínima (R$)</Label>
                  <Input
                    id="minPurchase"
                    type="number"
                    step="0.01"
                    value={formData.minPurchase}
                    onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="usageLimit">
                    Limite de Uso <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="validFrom">Válido De</Label>
                  <Input
                    id="validFrom"
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="validUntil">Válido Até</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="active" className="text-base font-semibold">
                    Cupom Ativo
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Cupom pode ser usado pelos clientes
                  </p>
                </div>
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, active: checked })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog} disabled={saving}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Salvando..." : editingCoupon ? "Atualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o cupom{" "}
                <span className="font-semibold font-mono">{couponToDelete?.code}</span>? Esta ação não pode
                ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setCouponToDelete(null)}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AdminCoupons;
