import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config';
import '../styles/UserCart.scss';

const UserCart = () => {
  const [cart, setCart] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await axios.get(`${BASE_URL}/api/menu/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.items) {
        setCart(response.data);
      } else {
        setCart({ items: [] });
      }
    } catch (error) {
      console.error("Error fetching cart:", error.response?.data || error.message);
      setError(error.response?.data?.error || error.message);
    }
  };

  const fetchPendingOrders = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await axios.get(`${BASE_URL}/api/order`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const pending = response.data.filter(order => order.status === "Pending");
      setPendingOrders(pending);
    } catch (error) {
      console.error("Error fetching orders:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchCart();
      await fetchPendingOrders();
      setLoading(false);
    };
    fetchData();
  }, []);

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((acc, cartItem) => {
      const itemTotal = cartItem.menuItem.price * cartItem.quantity;
      return acc + itemTotal;
    }, 0);
  };

  const updateCartItemQuantity = async (itemId, newQuantity) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found");
      return;
    }
    try {
      await axios.patch(
        `${BASE_URL}/api/menu/cart`,
        { menuItem: itemId, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(`Cart updated for item ${itemId}: quantity ${newQuantity}`);
      fetchCart();
    } catch (error) {
      console.error("Error updating cart:", error.response?.data || error.message);
    }
  };

  const handleCartIncrement = (itemId, currentQty) => {
    updateCartItemQuantity(itemId, currentQty + 1);
  };

  const handleCartDecrement = (itemId, currentQty) => {
    updateCartItemQuantity(itemId, currentQty - 1);
  };

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await axios.post(`${BASE_URL}/api/order`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Order placed:", response.data);
      setOrderPlaced(true);
      setCart({ items: [] });
      await fetchPendingOrders();
    } catch (error) {
      console.error("Error placing order:", error.response?.data || error.message);
      setError(error.response?.data?.error || error.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return <p>Loading your cart...</p>;
  }

  return (
    <div className="UserCart">
      <div className="place-order">
        <h2>Your Cart</h2>
        {error && <p className="error-message">{error}</p>}
        {cart && cart.items && cart.items.length > 0 ? (
          <>
            <div className="cart-items">
              {cart.items.map(cartItem => (
                <div className="cart-item" key={cartItem._id}>
                  <img src={cartItem.menuItem.imageUrl} alt={cartItem.menuItem.name} />
                  <div className="item-info">
                    <h3>{cartItem.menuItem.name}</h3>
                    <p>Price: ${cartItem.menuItem.price.toFixed(2)}</p>
                    <div className="quantity-control">
                      <button className="decrement-btn" onClick={() => handleCartDecrement(cartItem.menuItem._id, cartItem.quantity)}>
                        -
                      </button>
                      <span className="quantity">{cartItem.quantity}</span>
                      <button className="increment-btn" onClick={() => handleCartIncrement(cartItem.menuItem._id, cartItem.quantity)}>
                        +
                      </button>
                    </div>
                    <p>Subtotal: ${(cartItem.menuItem.price * cartItem.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-total">
              <h3>Total: ${calculateTotal().toFixed(2)}</h3>
            </div>
            {!orderPlaced ? (
              <button className="place-order-btn" onClick={handlePlaceOrder} disabled={placingOrder}>
                {placingOrder ? 'Placing Order...' : 'Place Order'}
              </button>
            ) : (
              <div className="order-confirmation">
                <h3>Your order is pending</h3>
                <p>Please wait for confirmation from the manager/admin.</p>
              </div>
            )}
          </>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
      <div className="pending-orders">
        <h2>Pending Orders</h2>
        {pendingOrders.length > 0 ? (
          pendingOrders.map(order => (
            <div key={order._id} className="order-card">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <p>{item.menuItem.name} x {item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No pending orders.</p>
        )}
      </div>
    </div>
  );
};

export default UserCart;
