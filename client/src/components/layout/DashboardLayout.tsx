import React from "react";
import { Outlet } from "react-router-dom";

// 1. We define the contract for our props
interface DashboardLayoutProps {
  children?: React.ReactNode;
}

// 2. We apply the contract to the component
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex dark:bg-slate-900">
      {/* Sidebar Placeholder */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-slate-800 font-bold text-xl tracking-tight">
          ERP System
        </div>
        <nav className="flex-1 p-4">
          {/* Navigation links will go here */}
          <p className="text-slate-400 text-sm">Navigation pending...</p>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Placeholder */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 dark:bg-slate-950 dark:border-slate-800">
          <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800"></div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* This renders whatever child route is currently active */}
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};