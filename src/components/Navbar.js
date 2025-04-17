import React from 'react';
import { Link } from 'react-router-dom';
import "../style/Navbar.css";

const Navbar = () => {
  return (
    <nav style={{ padding: '10px', background: '#f1f1f1' }}>
      <Link to="/" style={{ marginRight: '10px' }}>SignUp & Login</Link>
      <Link to="/track-orders" style={{ marginRight: '10px' }}>Track Orders</Link>
      <Link to="/merchant-login" style={{ marginRight: '10px' }}>Merchant</Link>
      <Link to="/admin-login">Admin</Link>
    </nav>
  );
};

export default Navbar;
