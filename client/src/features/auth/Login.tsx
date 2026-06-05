import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { loginUser } from "@/features/auth/authSlice"; // <-- Changed import

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Must be at least 6 characters")
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // 1. Grab the new async states from Redux
  const { isLoading, error } = useAppSelector((state) => state.auth);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  // --- LOGIC HOOKS ---
  const onSubmit = async (data: LoginFormValues) => {
    try {
      // 2. We dispatch the real thunk and unwrap the result
      await dispatch(loginUser({ email: data.email, password: data.password })).unwrap();
      
      // 3. If unwrap() succeeds without throwing an error, we navigate
      navigate("/dashboard");
    } catch (err) {
      // The error is already saved in Redux state to display in the UI,
      // so we don't strictly need to do anything here unless we want to log it.
      console.error("Failed to login:", err);
    }
  }; 
  // -------------------

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
          <CardDescription>
            Enter your credentials to access your workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          
          {/* Display global API errors here */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                {...register("email")}
                id="email" 
                type="email" 
                placeholder="admin@company.com" 
                disabled={isLoading}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                {...register("password")}
                disabled={isLoading}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="font-medium text-slate-900 hover:underline dark:text-slate-100">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};