import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Clock, Calendar, CheckCircle, XCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { punchIn, punchOut, fetchLeaveRequests, updateLeaveStatus } from "./hrSlice";
import { ApplyLeaveDialog } from "./ApplyLeaveDialog";

export const HRPortal: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // --- REDUX STATE (You will wire this up next!) ---
  const { leaveRequests, attendanceToday, isLoading } = useAppSelector((state) => state.hr);
  const { user } = useAppSelector((state) => state.auth); // To check if user is Admin/Manager
  

  // A simple live clock for the UI
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    dispatch(fetchLeaveRequests());
  }, [dispatch]);

  const handleTimeClock = () => {
    if (attendanceToday && !attendanceToday.checkOutTime) {
      dispatch(punchOut());
      return;
    }

    dispatch(punchIn());
  };

  const handleLeaveAction = (leaveId: string, status: "Approved" | "Rejected") => {
    dispatch(updateLeaveStatus({ leaveId, status }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">HR & Attendance Portal</h2>
          <p className="text-slate-500">Manage your daily attendance and time-off requests.</p>
        </div>
        
        <ApplyLeaveDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* ATTENDANCE WIDGET */}
        <Card className="md:col-span-1 border-indigo-100 dark:border-indigo-900/50 shadow-sm">
          <CardHeader className="bg-indigo-50/50 dark:bg-indigo-900/10 pb-4">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                <Clock className="h-5 w-5" />
                Time Clock
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex flex-col items-center text-center space-y-6">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">
                {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <h3 className="text-4xl font-bold tracking-tight font-mono text-slate-900 dark:text-white">
                {currentTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </h3>
            </div>

            <div className="w-full space-y-3">
              <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" 
                size="lg"
                disabled={isLoading || (attendanceToday && attendanceToday.checkOutTime)}
                onClick={handleTimeClock}
              >
                {attendanceToday ? (attendanceToday.checkOutTime ? "Punched Out" : "Punch Out") : "Punch In"}
              </Button>
            </div>
            
            {attendanceToday && (
              <p className="text-xs text-slate-500">
                Punched in at: {new Date(attendanceToday.checkInTime).toLocaleTimeString()}
              </p>
            )}
          </CardContent>
        </Card>

        {/* LEAVE REQUESTS TABLE */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Status</TableHead>
                    {/* Only show Actions column if user is Manager or Admin */}
                    {(user?.role === "Admin" || user?.role === "Manager") && (
                      <TableHead className="text-right">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={5} className="text-center h-24">Loading leaves...</TableCell></TableRow>
                  ) : leaveRequests.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center h-24 text-slate-500">No leave requests found.</TableCell></TableRow>
                  ) : (
                    leaveRequests.map((leave) => (
                      <TableRow key={leave._id}>
                        <TableCell className="font-medium">{leave.user?.name || "Unknown"}</TableCell>
                        <TableCell>{leave.leaveType}</TableCell>
                        <TableCell className="text-sm">
                          {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                            leave.status === "Approved" ? "bg-emerald-100 text-emerald-800" :
                            leave.status === "Rejected" ? "bg-red-100 text-red-800" :
                            "bg-amber-100 text-amber-800"
                          }`}>
                            {leave.status}
                          </span>
                        </TableCell>
                        
                        {(user?.role === "Admin" || user?.role === "Manager") && (
                          <TableCell className="text-right">
                            {leave.status === "Pending" && (
                              <div className="flex justify-end gap-2">
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" onClick={() => handleLeaveAction(leave._id, "Approved")}>
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleLeaveAction(leave._id, "Rejected")}>
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};