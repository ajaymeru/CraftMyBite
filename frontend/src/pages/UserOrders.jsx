import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config';
import '../styles/UserOrders.scss';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await axios.get(`${BASE_URL}/api/order`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (err) {
      console.error("Error fetching orders:", err.response?.data || err.message);
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const pendingOrders = orders.filter(order => order.status === "Pending");
  const completedOrders = orders.filter(order => order.status === "Completed");

  const calculateOrderTotal = (order) => {
    return order.items.reduce((acc, cartItem) => {
      const price = cartItem.menuItem.price;
      return acc + (price * cartItem.quantity);
    }, 0);
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="UserOrders">
      <h2>Your Orders</h2>

      <div className="orders-section">
        <h3>Pending Orders</h3>
        {pendingOrders.length > 0 ? (
          pendingOrders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Total:</strong> ${order.totalAmount ? order.totalAmount.toFixed(2) : calculateOrderTotal(order).toFixed(2)}</p>
              </div>
              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={item.menuItem.imageUrl} alt={item.menuItem.name} />
                    <div className="item-details">
                      <h4>{item.menuItem.name}</h4>
                      <p>Price: ${item.menuItem.price.toFixed(2)}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Subtotal: ${(item.menuItem.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="order-message">Your pending order will be completed soon.</p>
            </div>
          ))
        ) : (
          <p>No pending orders.</p>
        )}
      </div>

      <div className="orders-section">
        <h3>Past Completed Orders</h3>
        {completedOrders.length > 0 ? (
          completedOrders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Total:</strong> ${order.totalAmount ? order.totalAmount.toFixed(2) : calculateOrderTotal(order).toFixed(2)}</p>
              </div>
              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={item.menuItem.imageUrl} alt={item.menuItem.name} />
                    <div className="item-details">
                      <h4>{item.menuItem.name}</h4>
                      <p>Price: ${item.menuItem.price.toFixed(2)}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Subtotal: ${(item.menuItem.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="order-message">Thank you for being our valued customer. Here is your past order history.</p>
            </div>
          ))
        ) : (
          <p>No completed orders found.</p>
        )}
      </div>
    </div>
  );
};

export default UserOrders;
