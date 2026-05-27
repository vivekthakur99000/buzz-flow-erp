import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { UserPlus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { createCustomer } from "./customerSlice";

const customerSchema = z.object({
  name: z.string().min(2, "Customer name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export const CreateCustomerDialog: React.FC = () => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const { isLoading } = useAppSelector((state) => state.customer);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: "", email: "", phone: "" }
  });

  const onSubmit = async (data: CustomerFormValues) => {
    try {
      await dispatch(createCustomer(data)).unwrap();
      setOpen(false);
      reset();
    } catch (err) {
      console.error("Failed to create customer:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
          <UserPlus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogDescription>
            Register a new client to process their sales order.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input id="name" placeholder="John Doe" disabled={isLoading} {...register("name")} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" placeholder="john@example.com" disabled={isLoading} {...register("email")} />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>
            
          <div className="space-y-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input id="phone" placeholder="+1 234 567 8900" disabled={isLoading} {...register("phone")} />
            {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Customer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};