import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { createProduct } from "./inventorySlice"; 

// 1. The Validation Schema
const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  sku: z.string().min(2, "SKU is required"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  lowStockThreshold: z.coerce.number().int().min(0, "Threshold cannot be negative").default(5),
});

type ProductFormValues = z.infer<typeof productSchema>;

export const CreateProductDialog: React.FC = () => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  
  // We'll borrow the loading state from your inventory slice
  const { isLoading } = useAppSelector((state) => state.inventory);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<z.input<typeof productSchema>, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sku: "",
      price: 0,
      stock: 0,
      lowStockThreshold: 5,
    }
  });

  // --- LOGIC HOOK ---
  const onSubmit = async (data: ProductFormValues) => {
    try {
         await dispatch(createProduct(data)).unwrap();
      
      // 2. Close the modal and reset the form
      setOpen(false);
      reset();
      
      // 3. Optional: Trigger a fresh fetch so the table updates instantly
    } catch (err) {
      console.error("Failed to create product:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="flex items-center gap-2" />}>
        <Plus className="h-4 w-4" />
        Add Product
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Enter the details for the new product here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" placeholder="Wireless Keyboard" disabled={isLoading} {...register("name")} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" placeholder="KBD-001" disabled={isLoading} {...register("sku")} />
            {errors.sku && <p className="text-xs text-red-500">{errors.sku.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input id="price" type="number" step="0.01" disabled={isLoading} {...register("price")} />
              {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stock">Initial Stock</Label>
              <Input id="stock" type="number" disabled={isLoading} {...register("stock")} />
              {errors.stock && <p className="text-xs text-red-500">{errors.stock.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lowStockThreshold">Low Stock Alert Threshold</Label>
            <Input id="lowStockThreshold" type="number" disabled={isLoading} {...register("lowStockThreshold")} />
            {errors.lowStockThreshold && <p className="text-xs text-red-500">{errors.lowStockThreshold.message}</p>}
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};