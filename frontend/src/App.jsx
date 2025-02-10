import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginRegister from './components/LoginRegister'; 
import './App.css';
import UserMenu from './pages/UserMenu';
import UserCart from './pages/UserCart';
import UserOrders from './pages/UserOrders';
import MenuItems from './pages/MenuItems';
import OrderReq from './pages/OrderReq';
import ProtectedRoute from './contexts/ProtectedRoute';

function App() {
  const location = useLocation(); 
  const hideFooterPaths = ['/auth']; 

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/auth' element={<LoginRegister />} />
        
        <Route path='/menu' element={<ProtectedRoute allowedRoles={['user']}><UserMenu /></ProtectedRoute>} />
        <Route path='/cart' element={<ProtectedRoute allowedRoles={['user']}><UserCart /></ProtectedRoute>} />
        <Route path='/orders' element={<ProtectedRoute allowedRoles={['user']}><UserOrders /></ProtectedRoute>} />

        <Route path='/manage-menu' element={<ProtectedRoute allowedRoles={['admin', 'manager']}><MenuItems /></ProtectedRoute>} />
        <Route path='/manage-order' element={<ProtectedRoute allowedRoles={['admin', 'manager']}><OrderReq /></ProtectedRoute>} />
      </Routes>

      {!hideFooterPaths.includes(location.pathname) && <Footer />}
    </div>
  );
}

export default App;
