import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { FileText, Eye } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchOrders } from "./orderSlice";

export const OrderHistory: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orders, isLoading, error } = useAppSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Order History</h2>
        <p className="text-slate-500">View and manage past customer invoices.</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-500" />
            All Invoices
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>
          )}

          <div className="rounded-md border border-slate-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-center">Items</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                      Loading orders...
                    </TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                      No orders found. Generate an invoice to see it here.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium text-xs text-slate-500">
                        {order._id.substring(order._id.length - 8).toUpperCase()}
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {/* Assuming your backend populates the customer name */}
                        {order.customer?.name || "Unknown Customer"}
                      </TableCell>
                      <TableCell className="text-center">
                        {order.items?.length || 0}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${order.totalAmount?.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4 text-slate-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};