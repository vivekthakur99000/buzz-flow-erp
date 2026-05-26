import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { ArrowDownToLine } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { receiveInventory } from "./inventorySlice";

const receiveSchema = z.object({
  supplier: z.string().min(1, "Please select a supplier"),
  product: z.string().min(1, "Please select a product"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  totalCost: z.coerce.number().min(0, "Cost cannot be negative"),
});

type ReceiveFormValues = z.infer<typeof receiveSchema>;

export const ReceiveStockDialog: React.FC = () => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  
  // Pull data from our Redux stores to populate the dropdowns!
  const { products, isLoading: isProductLoading } = useAppSelector((state) => state.inventory);
  const { suppliers, isLoading: isSupplierLoading } = useAppSelector((state) => state.supplier);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<z.input<typeof receiveSchema>, unknown, ReceiveFormValues>({
    resolver: zodResolver(receiveSchema),
    defaultValues: {
      supplier: "",
      product: "",
      quantity: 0,
      totalCost: 0,
    }
  });

  const onSubmit = async (data: ReceiveFormValues) => {
    try {
      await dispatch(receiveInventory(data)).unwrap();
      
      setOpen(false);
      reset();
    } catch (err) {
      console.error("Failed to receive stock:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="secondary" className="flex items-center gap-2 border border-slate-200" />}>
        <ArrowDownToLine className="h-4 w-4" />
        Receive Stock
      </DialogTrigger>
      
      <DialogContent style={{ maxWidth: 425 }}>
        <DialogHeader>
          <DialogTitle>Receive Inventory</DialogTitle>
          <DialogDescription>
            Log an incoming shipment from a supplier to update your stock levels.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          
          <div className="space-y-2">
            <Label>Supplier</Label>
            <Select onValueChange={(val) => setValue("supplier", val as string)}>
              <SelectTrigger disabled={isSupplierLoading}>
                <SelectValue placeholder="Select a supplier..." />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((sup) => (
                  <SelectItem key={sup._id} value={sup._id}>{sup.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.supplier?.message && <p className="text-xs text-red-500">{errors.supplier.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Product</Label>
            <Select onValueChange={(val) => setValue("product", val as string)}>
              <SelectTrigger disabled={isProductLoading}>
                <SelectValue placeholder="Select a product..." />
              </SelectTrigger>
              <SelectContent>
                {products.map((prod) => (
                  <SelectItem key={prod._id} value={prod._id}>{prod.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.product?.message && <p className="text-xs text-red-500">{errors.product.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity Received</Label>
              <Input id="quantity" type="number" {...register("quantity")} />
              {errors.quantity?.message && <p className="text-xs text-red-500">{errors.quantity.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="totalCost">Total Cost ($)</Label>
              <Input id="totalCost" type="number" step="0.01" {...register("totalCost")} />
              {errors.totalCost?.message && <p className="text-xs text-red-500">{errors.totalCost.message}</p>}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit">
              Confirm Receipt
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};