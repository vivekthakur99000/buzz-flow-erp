import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { Login } from './features/auth/Login'
import { Register } from './features/auth/Register'
import { Dashboard } from './features/dashboard/Dashboard'
import { Inventory } from './features/inventory/Inventory'
import { Suppliers } from './features/inventory/Suppliers'
import { SalesOrder } from './features/sales/SalesOrder'
import { OrderHistory } from './features/sales/OrderHistory'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />
        
        {/* Protected Routes Wrapper */}
        <Route element={<ProtectedRoute />}>
          {/* Layout Wrapper - Everything inside here gets the Sidebar/Header */}
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard/>} />
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/inventory" element={<Inventory/>} />
            <Route path="/suppliers" element={<Suppliers/>} />
            <Route path="/sales-order" element={<SalesOrder/>} />
            <Route path="/orders" element={<OrderHistory/>} />
            
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App