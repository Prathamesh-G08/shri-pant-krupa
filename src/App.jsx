import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoadingSpinner from './components/common/LoadingSpinner'

// Layouts
import CustomerLayout from './layouts/CustomerLayout'
import AdminLayout from './layouts/AdminLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'

// ── Lazy-loaded Customer Pages ──
const HomePage = lazy(() => import('./pages/customer/HomePage'))
const ProductsPage = lazy(() => import('./pages/customer/ProductsPage'))
const ProductDetailPage = lazy(() => import('./pages/customer/ProductDetailPage'))

// ── Lazy-loaded Admin Pages ──
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'))
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'))
const ManageProductsPage = lazy(() => import('./pages/admin/ManageProductsPage'))
const AddProductPage = lazy(() => import('./pages/admin/AddProductPage'))
const EditProductPage = lazy(() => import('./pages/admin/EditProductPage'))

function App() {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading…" />}>
      <Routes>
        {/* ── Customer Routes ── */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
        </Route>

        {/* ── Admin Login ── */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* ── Admin Protected Routes ── */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ManageProductsPage />} />
          <Route path="products/add" element={<AddProductPage />} />
          <Route path="products/edit/:id" element={<EditProductPage />} />
        </Route>

        {/* ── 404 fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
