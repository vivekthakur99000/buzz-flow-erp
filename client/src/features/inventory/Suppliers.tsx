import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Truck } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchSuppliers } from "./supplierSlice";
import { CreateSupplierDialog } from "../inventory/CreateSupplierDialog";

export const Suppliers: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // --- LOGIC HOOKS ---
  const { suppliers, isLoading, error } = useAppSelector((state) => state.supplier);

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Suppliers</h2>
          <p className="text-slate-500 dark:text-slate-400">Manage your vendors and supply chain partners.</p>
        </div>
        
        <CreateSupplierDialog />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-slate-500" />
            Active Suppliers
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>
          )}

          <div className="rounded-md border border-slate-200 dark:border-slate-800">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                      Loading suppliers...
                    </TableCell>
                  </TableRow>
                ) : suppliers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                      No suppliers found. Add your first vendor to start receiving inventory.
                    </TableCell>
                  </TableRow>
                ) : (
                  suppliers.map((supplier) => (
                    <TableRow key={supplier._id}>
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell>{supplier.contactPerson || "N/A"}</TableCell>
                      <TableCell>{supplier.email}</TableCell>
                      <TableCell>{supplier.phone}</TableCell>
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