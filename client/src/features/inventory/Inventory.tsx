import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchProducts } from "./inventorySlice";
import { CreateProductDialog } from "./CreateProductDialog";
import { ReceiveStockDialog } from "./ReceiveStockDialog";
import { fetchSuppliers } from "./supplierSlice";

export const Inventory: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // --- LOCAL STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  // --- REDUX STATE ---
  const { products, isLoading, error, pagination } = useAppSelector((state) => state.inventory);

  // --- LOGIC HOOKS ---
  // 1. Fetch data with a 500ms debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(fetchProducts({ page, limit: 10, search: searchTerm }));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [dispatch, page, searchTerm]);

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Inventory</h2>
          <p className="text-slate-500 dark:text-slate-400">Manage your product catalog and track stock levels.</p>
        </div>
        <CreateProductDialog />
        <ReceiveStockDialog/>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>All Products</CardTitle>
            {/* Search Bar */}
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>
          )}

          <div className="rounded-md border border-slate-200 dark:border-slate-800">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                      Loading inventory...
                    </TableCell>
                  </TableRow>
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                      {searchTerm ? "No products match your search." : "No products found. Add your first product to get started."}
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-slate-500">{product.sku}</TableCell>
                      <TableCell className="text-right">${product.price?.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-medium">{product.stock}</TableCell>
                      <TableCell className="text-center">
                        {product.stock <= (product.lowStockThreshold || 5) ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-500">
                            <AlertCircle className="h-3 w-3" />
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-500">
                            In Stock
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* --- PAGINATION CONTROLS --- */}
          {pagination && pagination.totalPages > 0 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-slate-500">
                Showing <span className="font-medium">{(pagination.currentPage - 1) * pagination.limit + 1}</span> to{" "}
                <span className="font-medium">{Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)}</span> of{" "}
                <span className="font-medium">{pagination.totalItems}</span> results
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={pagination.currentPage === 1 || isLoading}
                  className="h-8 w-8 p-0"
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="text-sm font-medium px-2">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={pagination.currentPage === pagination.totalPages || isLoading}
                  className="h-8 w-8 p-0"
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
};