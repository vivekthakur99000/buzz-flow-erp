import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { FileText, Plus, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchProducts } from "../inventory/inventorySlice"; // We need products to sell!
import { addOrderItem, createOrder, removeOrderItem } from "./orderSlice"; // You will build these next
import { fetchCustomers } from "./customerSlice";
import { CreateCustomerDialog } from "./CreateCustomerDialog";

export const SalesOrder: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // --- REDUX STATE (We will wire this up next!) ---
  const { products } = useAppSelector((state) => state.inventory);
  const { draftItems, isLoading } = useAppSelector((state) => state.order);
  const { customers } = useAppSelector((state) => state.customer);
  

  // Fetch products when the page loads so the dropdown is populated
  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 100, search: "" }));
    dispatch(fetchCustomers());
  }, [dispatch]);

  // --- LOCAL STATE FOR FORM INPUTS ---
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [customerId, setCustomerId] = useState(""); // In a real app, this would be a dropdown of fetched Customers

  // --- DERIVED CALCULATIONS ---
  const subTotal = draftItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const gstAmount = subTotal * 0.18; // 18% GST per your backend controller
  const grandTotal = subTotal + gstAmount;

  // --- HANDLERS (We will wire these to your slice soon) ---
  const handleAddLineItem = () => {
    if (!selectedProductId || quantity < 1) return;
    
    // Find the full product object from our Redux inventory state
    const product = products.find(p => p._id === selectedProductId);
    if (!product) return;

    // We will dispatch your 'addOrderItem' reducer here:
    dispatch(addOrderItem({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: quantity
    }));

    // Reset the inputs after adding
    setSelectedProductId("");
    setQuantity(1);
  };

  const handleRemoveLineItem = (productId: string) => {
    dispatch(removeOrderItem(productId));
  };

  const handleGenerateInvoice = () => {
    dispatch(createOrder({ customerId, draftItems }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Sales Order Entry</h2>
        <p className="text-slate-500">Draft new customer orders and generate invoices.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Add Line Item Form */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Add Line Item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Customer ID</Label>
              <div className="flex gap-2">
                <Select onValueChange={(value) => setCustomerId(value ?? "")} value={customerId}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select customer..." />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer._id} value={customer._id}>
                        {customer.name} {customer.phone ? `- ${customer.phone}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <CreateCustomerDialog />
              </div>
            </div>
            
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <Label>Product</Label>
              <Select onValueChange={(value) => setSelectedProductId(value ?? "")} value={selectedProductId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product..." />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p._id} value={p._id}>{p.name} - ${p.price}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input 
                type="number" 
                min="1" 
                value={quantity} 
                onChange={(e) => setQuantity(Number(e.target.value))} 
              />
            </div>

            <Button className="w-full mt-2 border border-slate-200" variant="secondary" onClick={handleAddLineItem}>
              <Plus className="mr-2 h-4 w-4" /> Add to Order
            </Button>
          </CardContent>
        </Card>

        {/* RIGHT COLUMN: The Draft Invoice & Checkout */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-slate-500" /> Draft Invoice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {draftItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                        No line items added. Select a product to begin drafting the order.
                      </TableCell>
                    </TableRow>
                  ) : (
                    draftItems.map((item) => (
                      <TableRow key={item.product}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveLineItem(item.product)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Order Summary */}
            <div className="mt-6 space-y-2 text-sm flex flex-col items-end">
              <div className="flex justify-between w-48">
                <span className="text-slate-500">Subtotal:</span>
                <span className="font-medium">${subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-48">
                <span className="text-slate-500">GST (18%):</span>
                <span className="font-medium">${gstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-48 text-lg font-bold pt-2 border-t border-slate-200">
                <span>Total:</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button size="lg" disabled={draftItems.length === 0 || !customerId || isLoading} onClick={handleGenerateInvoice}>
                {isLoading ? "Processing..." : "Generate Invoice"}
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};