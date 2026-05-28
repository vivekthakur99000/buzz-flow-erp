import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Users, Shield } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchEmployees } from "./employeeSlice";
import { CreateEmployeeDialog } from "./CreateEmployeeDialog";
import { SetProfileDialog } from "./SetProfileDialog";

export const Employees: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // --- REDUX STATE ---
  const { employees, isLoading, error } = useAppSelector((state) => state.employee);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Team Management</h2>
          <p className="text-slate-500">Manage staff access and assign workspace roles.</p>
        </div>
        
        {/* We will drop the CreateEmployeeDialog here */}
        <CreateEmployeeDialog />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-slate-500" />
            Active Staff
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
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                      Loading team members...
                    </TableCell>
                  </TableRow>
                ) : employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                      No staff members found.
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((staff) => (
                    <TableRow key={staff._id}>
                      <TableCell className="font-medium">{staff.name}</TableCell>
                      <TableCell className="text-slate-500">{staff.email}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1">
                          {staff.role === "Admin" && <Shield className="h-3 w-3 text-indigo-500" />}
                          {staff.role}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                          Active
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <SetProfileDialog userId={staff._id} userName={staff.name} />
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