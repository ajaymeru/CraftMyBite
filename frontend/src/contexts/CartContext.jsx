import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartQuantity, setCartQuantity] = useState(0);

  const fetchCartQuantity = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await axios.get(`${BASE_URL}/api/menu/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.items && response.data.items.length > 0) {
        const total = response.data.items.reduce(
          (acc, item) => acc + (item.quantity || 0),
          0
        );
        setCartQuantity(total);
      } else {
        setCartQuantity(0);
      }
    } catch (error) {
      console.error("Error fetching cart quantity:", error.response?.data || error.message);
      setCartQuantity(0);
    }
  };

  useEffect(() => {
    fetchCartQuantity();
    const intervalId = setInterval(fetchCartQuantity, 100);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <CartContext.Provider value={{ cartQuantity, fetchCartQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
