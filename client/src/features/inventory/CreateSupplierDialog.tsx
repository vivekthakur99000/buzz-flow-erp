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
import { createSupplier } from "./supplierSlice";

const supplierSchema = z.object({
  name: z.string().min(2, "Company name is required"),
  contactPerson: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

export const CreateSupplierDialog: React.FC = () => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  
  const { isLoading } = useAppSelector((state) => state.supplier);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
    }
  });

  const onSubmit = async (data: SupplierFormValues) => {
    try {
      await dispatch(createSupplier(data)).unwrap();
      setOpen(false);
      reset();
    } catch (err) {
      console.error("Failed to create supplier:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="flex items-center gap-2" />}>
        <Plus className="h-4 w-4" />
        Add Supplier
      </DialogTrigger>
      
      <DialogContent style={{ maxWidth: 425 }}>
        <DialogHeader>
          <DialogTitle>Add New Supplier</DialogTitle>
          <DialogDescription>
            Register a new vendor to your supply chain network.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name *</Label>
            <Input id="name" placeholder="Acme Logistics" disabled={isLoading} {...register("name")} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPerson">Contact Person (Optional)</Label>
            <Input id="contactPerson" placeholder="Jane Doe" disabled={isLoading} {...register("contactPerson")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" placeholder="sales@acme.com" disabled={isLoading} {...register("email")} />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" placeholder="+1 234 567 8900" disabled={isLoading} {...register("phone")} />
              {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Supplier"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};