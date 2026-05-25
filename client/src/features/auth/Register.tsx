import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { registerWorkspace } from "@/features/auth/authSlice"; 

const registerSchema = z.object({
    companyName: z.string().min(2, "Company name must be at least 2 characters"),
    companyEmail: z.string().email("Invalid company email address"),
    companyPhone: z.string().min(10, "Invalid company phone number"),
    companyAddress: z.string().min(5, "Company address must be at least 5 characters"),
    name: z.string().min(2, "Your name must be at least 2 characters"),
    email: z.string().email("Invalid admin email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      // .unwrap() forces Redux to throw an actual error if the thunk fails
      await dispatch(registerWorkspace(data)).unwrap();
      navigate("/dashboard");
    } catch (err) {
      // If it fails, the error is printed here, and the UI banner handles the rest
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 py-10">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Create your Workspace</CardTitle>
          <CardDescription>
            Register your company and set up your admin account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* --- COMPANY SECTION --- */}
            <div>
              <h3 className="text-lg font-medium mb-3">Company Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" placeholder="Acme Corp" disabled={isLoading} {...register("companyName")} />
                  {errors.companyName && <p className="text-xs text-red-500">{errors.companyName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyEmail">Company Email</Label>
                  <Input id="companyEmail" type="email" placeholder="contact@acme.com" disabled={isLoading} {...register("companyEmail")} />
                  {errors.companyEmail && <p className="text-xs text-red-500">{errors.companyEmail.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyPhone">Company Phone</Label>
                  <Input id="companyPhone" placeholder="+1 234 567 890" disabled={isLoading} {...register("companyPhone")} />
                  {errors.companyPhone && <p className="text-xs text-red-500">{errors.companyPhone.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyAddress">Company Address</Label>
                  <Input id="companyAddress" placeholder="123 Business St." disabled={isLoading} {...register("companyAddress")} />
                  {errors.companyAddress && <p className="text-xs text-red-500">{errors.companyAddress.message}</p>}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800"></div>

            {/* --- ADMIN SECTION --- */}
            <div>
              <h3 className="text-lg font-medium mb-3">Admin Account</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Full Name</Label>
                  <Input id="name" placeholder="John Doe" disabled={isLoading} {...register("name")} />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Your Admin Email</Label>
                  <Input id="email" type="email" placeholder="admin@acme.com" disabled={isLoading} {...register("email")} />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" disabled={isLoading} {...register("password")} />
                  {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Workspace..." : "Register Workspace"}
            </Button>

            <div className="text-center text-sm text-slate-500 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-slate-900 font-medium hover:underline dark:text-slate-100">
                Sign in
              </Link>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
};