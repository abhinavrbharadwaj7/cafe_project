import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CafeProvider } from './context/CafeContext';
import CustomerMenu from './pages/customer/Menu';
import AdminDashboard from './pages/admin/Dashboard';

function App() {
  return (
    <CafeProvider>
      <BrowserRouter>
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<CustomerMenu />} />
          <Route path="/table/:id" element={<CustomerMenu />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </CafeProvider>
  );
}

export default App;
