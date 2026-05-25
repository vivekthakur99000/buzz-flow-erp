import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { Login } from './features/auth/Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<h1>Login Page</h1>} />
        <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />
        
        {/* Protected Routes Wrapper */}
        <Route element={<ProtectedRoute />}>
          {/* Layout Wrapper - Everything inside here gets the Sidebar/Header */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<div>Dashboard Metrics Coming Soon</div>} />
            {/* Future nested routes will go here */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App