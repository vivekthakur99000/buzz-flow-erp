import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, LogOut, FileText, UserCog, Truck, ShoppingCart } from "lucide-react";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup
} from "../../components/ui/dropdown-menu";

// --- REDUX IMPORTS WILL GO HERE ---
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { logout } from "@/features/auth/authSlice";
// ----------------------------------

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Grab the first two letters of the name, or default to "U"
  const userInitials = user?.name
    ? user.name.substring(0, 2).toUpperCase()
    : "U";

  // Grab the real name and role, with safe fallbacks
  const userName = user?.name || "User";
  const userRole = user?.role || "Administrator";

  return (
    <div className="min-h-screen bg-slate-50 flex dark:bg-slate-900">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-slate-800 font-bold text-xl text-white tracking-tight">
          BuzzFlow ERP
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-slate-800 text-white" : "hover:bg-slate-800 hover:text-white"}`
            }
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </NavLink>
          <NavLink
            to="/inventory"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-slate-800 text-white" : "hover:bg-slate-800 hover:text-white"}`
            }
          >
            <Package className="h-5 w-5" />
            Inventory
          </NavLink>
          <NavLink
            to="/employees"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-slate-800 text-white" : "hover:bg-slate-800 hover:text-white"}`
            }
          >
            <UserCog className="h-5 w-5" />
            Employees
          </NavLink>
          <NavLink
            to="/suppliers"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-slate-800 text-white" : "hover:bg-slate-800 hover:text-white"}`
            }
          >
            <Truck className="h-5 w-5" />
            Suppliers
          </NavLink>
          <NavLink
            to="/sales-order"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-slate-800 text-white" : "hover:bg-slate-800 hover:text-white"}`
            }
          >
            <ShoppingCart className="h-5 w-5" />
            Sales Orders
          </NavLink>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-slate-800 text-white" : "hover:bg-slate-800 hover:text-white"}`
            }
          >
            <FileText className="h-5 w-5" />
            Order History
          </NavLink>
        </nav>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* --- HEADER --- */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 dark:bg-slate-950 dark:border-slate-800">
          <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Workspace
          </h1>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="outline-none rounded-full focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-all">
                    <Avatar className="h-9 w-9 cursor-pointer border border-slate-200 hover:border-slate-300 transition-all">
                      <AvatarFallback className="bg-slate-100 text-slate-600 font-medium">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                }
              />
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userName}
                    </p>
                    <p className="text-xs leading-none text-slate-500">
                      {userRole}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* Wire the onClick here to your handleLogout function! */}
                <DropdownMenuItem
                  className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* --- PAGE CONTENT --- */}
        <main className="flex-1 overflow-y-auto p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};
