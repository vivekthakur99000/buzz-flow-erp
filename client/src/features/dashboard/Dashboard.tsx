import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Users, DollarSign, Package, AlertTriangle } from "lucide-react";
import { useAppDispatch } from "@/hooks/hooks";
import { fetchDashboardMetrics, type RecentOrder } from "./dashboardSlice";
import { useAppSelector } from "@/hooks/hooks";

export const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  
const {metrics, isLoading, error} = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardMetrics());
  }, [dispatch]);

  // Fallback data so the UI doesn't crash before the API connects
  const displayMetrics = metrics || {
    totalRevenue: 0,
    totalOrders: 0,
    lowStockCount: 0,
    activeEmployeeCount: 0,
    recentOrders: [],
  };

  if (isLoading) {
    return <div className="flex h-full items-center justify-center text-slate-500">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-md">Error loading dashboard: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <p className="text-slate-500 dark:text-slate-400">Here's what's happening in your workspace today.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${displayMetrics.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayMetrics.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{displayMetrics.lowStockCount} Items</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayMetrics.activeEmployeeCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayMetrics.recentOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-slate-500">No recent orders found.</TableCell>
                </TableRow>
              ) : (
                displayMetrics.recentOrders.map((order: RecentOrder) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium text-slate-600">{order._id.substring(0, 8)}...</TableCell>
                    <TableCell>{order.customer?.name || "Unknown"}</TableCell>
                    <TableCell className="text-right font-medium">${order.grandTotal.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};