import React from 'react';
import {Routes, Route } from 'react-router-dom';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import MerchantLogin from './components/merchant/MerchantLogin';
import MerchantDashboard from './components/merchant/MerchantDashboard';
import UserAuth from './components/user/UserAuth';
import UserDashboard from './components/user/UserDashboard';
import TrackOrders from './components/user/TrackOrders';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';


const App = () => {
  return (
    <>
     <div className="bgimg">
      <Navbar />
      <Routes>

<Route
  path="/admin-dashboard"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
        
        <Route path="/admin-login" element={<AdminLogin />} />
        
        <Route path="/merchant-login" element={<MerchantLogin />} />
        <Route path="/" element={<UserAuth />} />
        
        <Route path="/track-orders" element={<TrackOrders />} />
<Route
  path="/merchant-dashboard"
  element={
    <ProtectedRoute allowedRoles={['merchant']}>
      <MerchantDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/user-dashboard"
  element={
    <ProtectedRoute allowedRoles={['user']}>
      <UserDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/track-orders"
  element={
    <ProtectedRoute allowedRoles={['user']}>
      <TrackOrders />
    </ProtectedRoute>
  }
/>

      </Routes>
      </div>
    </>
  );
};

export default App;
