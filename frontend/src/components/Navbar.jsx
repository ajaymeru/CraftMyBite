import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FaSun, FaMoon, FaBars, FaTimes, FaShoppingCart } from 'react-icons/fa';
import { CartContext } from '../contexts/CartContext';
import "../styles/Navbar.scss";

const Navbar = () => {
  const navigate = useNavigate();
  const { cartQuantity } = useContext(CartContext);

  const [darkMode, setDarkMode] = useState(() => {
    const storedMode = localStorage.getItem('darkMode');
    return storedMode ? JSON.parse(storedMode) : false;
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [role, setRole] = useState(null);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.user.role);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      setRole(null);
    }
  }, []);

  const toggleDarkMode = () => setDarkMode(prev => !prev);
  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);
  const handleLinkClick = () => setMobileMenuOpen(false);

  let navLinks = [];
  if (role === 'user') {
    navLinks = [
      { label: 'Home', path: '/' },
      { label: 'Menu', path: '/menu' },
      { label: 'Orders', path: '/orders' },
    ];
  } else if (role === 'admin' || role === 'manager') {
    navLinks = [
      { label: 'Home', path: '/' },
      { label: 'Manage Menu', path: '/manage-menu' },
      { label: 'Manage Orders', path: '/manage-order' },
    ];
  } else {
    navLinks = [{ label: 'Home', path: '/' }];
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    setRole(null);
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">
          <img src="/assets/CraftMyBite.png" alt="CraftMyBite Logo" />
        </Link>
      </div>

      <div className="navbar-middle desktop-menu">
        {navLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            onClick={handleLinkClick}
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      <div className="navbar-right">
        <button onClick={toggleDarkMode} className="navbar-toggle">
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {role === 'user' && (
          <Link to="/cart" className="navbar-btn cart-icon" onClick={handleLinkClick}>
            <FaShoppingCart />
            {cartQuantity > 0 && <span className="cart-quantity">{cartQuantity}</span>}
          </Link>
        )}

        {role ? (
          <button className="navbar-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link to="/auth" className="navbar-btn" onClick={handleLinkClick}>
            Sign In / Up
          </Link>
        )}

        <div className="navbar-hamburger" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      <div className={`navbar-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        {navLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            onClick={handleLinkClick}
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            {link.label}
          </NavLink>
        ))}

        {/* {role === 'user' && (
          <Link to="/cart" className="navbar-btn cart-icon" onClick={handleLinkClick}>
            <FaShoppingCart />
            {cartQuantity > 0 && <span className="cart-quantity">{cartQuantity}</span>}
          </Link>
        )} */}

        {role ? (
          <button className="navbar-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link to="/auth" className="navbar-btn" onClick={handleLinkClick}>
            Sign In / Up
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
