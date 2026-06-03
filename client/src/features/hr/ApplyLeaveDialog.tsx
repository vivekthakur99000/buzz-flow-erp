import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Calendar } from "lucide-react";
import { useAppDispatch } from "@/hooks/hooks";
import { applyLeave } from "./hrSlice";
import { Textarea } from "@/components/ui/textarea";

const leaveSchema = z.object({
  leaveType: z.enum(["Sick", "Casual", "Annual", "Unpaid"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  reason: z.string().min(5, "Please provide a brief reason"),
}).refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
  message: "End date cannot be before start date",
  path: ["endDate"], // This attaches the error message directly to the endDate field
});

type LeaveFormValues = z.infer<typeof leaveSchema>;

export const ApplyLeaveDialog: React.FC = () => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveSchema),
    defaultValues: { reason: "", startDate: "", endDate: "" }
  });

  const onSubmit = async (data: LeaveFormValues) => {
    try {
      setIsLoading(true);
      await dispatch(applyLeave(data)).unwrap();
      setOpen(false);
      reset();
    } catch (err) {
      console.error("Failed to apply for leave:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" className="flex items-center gap-2" />}>
        <Calendar className="h-4 w-4" />
        Apply for Leave
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Request Time Off</DialogTitle>
          <DialogDescription>
            Submit your leave request for manager approval.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Leave Type</Label>
            <Select onValueChange={(val) => setValue("leaveType", val as LeaveFormValues["leaveType"])}>
              <SelectTrigger disabled={isLoading}>
                <SelectValue placeholder="Select type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sick">Sick Leave</SelectItem>
                <SelectItem value="Casual">Casual Leave</SelectItem>
                <SelectItem value="Annual">Annual Leave</SelectItem>
                <SelectItem value="Unpaid">Unpaid Leave</SelectItem>
              </SelectContent>
            </Select>
            {errors.leaveType && <p className="text-xs text-red-500">{errors.leaveType.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" type="date" disabled={isLoading} {...register("startDate")} />
              {errors.startDate && <p className="text-xs text-red-500">{errors.startDate.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" type="date" disabled={isLoading} {...register("endDate")} />
              {errors.endDate && <p className="text-xs text-red-500">{errors.endDate.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea 
              id="reason" 
              placeholder="Briefly explain your reason for leave..." 
              disabled={isLoading} 
              className="resize-none"
              {...register("reason")} 
            />
            {errors.reason && <p className="text-xs text-red-500">{errors.reason.message}</p>}
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};