import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Briefcase } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { addEmployeeProfile } from "./employeeProfileSlice";

const profileSchema = z.object({
  department: z.string().min(2, "Department is required"),
  designation: z.string().min(2, "Designation is required"),
  baseSalary: z.coerce.number().min(0, "Salary cannot be negative"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface SetProfileDialogProps {
  userId: string;
  userName: string;
}

export const SetProfileDialog: React.FC<SetProfileDialogProps> = ({ userId, userName }) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const { isLoading } = useAppSelector((state) => state.employeeProfile);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<z.input<typeof profileSchema>, unknown, ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { department: "", designation: "", baseSalary: 0 }
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      // Combine the form data with the userId we passed in as a prop
      const payload = { ...data, userId };
      
      await dispatch(addEmployeeProfile(payload)).unwrap();
      
      setOpen(false);
      reset();
    } catch (err) {
      console.error("Failed to set profile:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Briefcase className="h-4 w-4" />
          Set Profile & Salary
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Set HR Profile</DialogTitle>
          <DialogDescription>
            Configure employment details for <span className="font-bold text-slate-900">{userName}</span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input id="department" placeholder="e.g., Engineering, Sales" disabled={isLoading} {...register("department")} />
            {errors.department && <p className="text-xs text-red-500">{errors.department.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="designation">Designation / Job Title</Label>
            <Input id="designation" placeholder="e.g., Senior Developer" disabled={isLoading} {...register("designation")} />
            {errors.designation && <p className="text-xs text-red-500">{errors.designation.message}</p>}
          </div>
            
          <div className="space-y-2">
            <Label htmlFor="baseSalary">Monthly Base Salary ($)</Label>
            <Input id="baseSalary" type="number" disabled={isLoading} {...register("baseSalary")} />
            {errors.baseSalary && <p className="text-xs text-red-500">{errors.baseSalary.message}</p>}
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};