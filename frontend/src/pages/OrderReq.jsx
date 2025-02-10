import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config';
import '../styles/OrderReq.scss';

const OrderReq = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/order`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
      console.log(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch orders');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${BASE_URL}/api/order/${orderId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err.response?.data || err.message);
    }
  };

  const pendingOrders = orders.filter(order => order.status === 'Pending');
  const completedOrders = orders.filter(order => order.status === 'Completed');

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="OrderReq">
      <h2>Order Requests</h2>
      
      <div className="orders-section">
        <h3>Pending Orders</h3>
        {pendingOrders.length > 0 ? (
          pendingOrders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>
                <p><strong>Status:</strong> {order.status}</p>
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
              <div className="order-actions">
                <button onClick={() => updateStatus(order._id, 'Completed')}>
                  Mark as Completed
                </button>
              </div>
              <p className="order-message">Your pending order will be completed soon.</p>
            </div>
          ))
        ) : (
          <p>No pending orders.</p>
        )}
      </div>

      <div className="orders-section">
        <h3>Completed Orders</h3>
        {completedOrders.length > 0 ? (
          completedOrders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>
                <p><strong>Status:</strong> {order.status}</p>
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

export default OrderReq;
