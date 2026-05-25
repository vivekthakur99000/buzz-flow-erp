import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/hooks/hooks";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: string[]; // Optional: specify roles that can access this route
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles
}) => {

   const {isAuthenticated, user} = useAppSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

   if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
  return <Navigate to="/unauthorized" replace />;
}

    return children || <Outlet />;
};