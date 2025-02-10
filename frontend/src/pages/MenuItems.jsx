import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config';
import '../styles/MenuItems.scss';

const MenuItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    price: '',
    availability: true,
    image: null
  });

  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/menu`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch menu items');
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newItem.name);
    formData.append('category', newItem.category);
    formData.append('price', newItem.price);
    formData.append('availability', newItem.availability);
    if (newItem.image) formData.append('imageUrl', newItem.image);

    try {
      await axios.post(`${BASE_URL}/api/menu`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setShowCreateForm(false);
      setNewItem({
        name: '',
        category: '',
        price: '',
        availability: true,
        image: null
      });
      fetchItems();
    } catch (err) {
      setError('Failed to create item');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', editingItem.name);
    formData.append('category', editingItem.category);
    formData.append('price', editingItem.price);
    formData.append('availability', editingItem.availability);
    if (editingItem.image) formData.append('imageUrl', editingItem.image);

    try {
      await axios.patch(`${BASE_URL}/api/menu/${editingItem._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setEditingItem(null);
      fetchItems();
    } catch (err) {
      setError('Failed to update item');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/menu/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchItems();
    } catch (err) {
      setError('Failed to delete item');
    }
  };

  const handleAddToCart = async (itemId) => {
    try {
      await axios.patch(`${BASE_URL}/api/menu/cart`, 
        { menuItem: itemId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Optionally show success message
    } catch (err) {
      setError('Failed to add to cart');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="menu-items">
      {role === 'admin' && (
        <button onClick={() => setShowCreateForm(true)}>Create New Item</button>
      )}

      {showCreateForm && (
        <div className="form-modal">
          <h3>Create New Item</h3>
          <form onSubmit={handleCreate}>
            <input
              type="text"
              placeholder="Name"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={newItem.category}
              onChange={(e) => setNewItem({...newItem, category: e.target.value})}
            />
            <input
              type="number"
              placeholder="Price"
              value={newItem.price}
              onChange={(e) => setNewItem({...newItem, price: e.target.value})}
              required
            />
            <label>
              Available:
              <input
                type="checkbox"
                checked={newItem.availability}
                onChange={(e) => setNewItem({...newItem, availability: e.target.checked})}
              />
            </label>
            <input
              type="file"
              onChange={(e) => setNewItem({...newItem, image: e.target.files[0]})}
            />
            <button type="submit">Create</button>
            <button type="button" onClick={() => setShowCreateForm(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {editingItem && (
        <div className="form-modal">
          <h3>Edit Item</h3>
          <form onSubmit={handleUpdate}>
            <input
              type="text"
              value={editingItem.name}
              onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
              required
            />
            <input
              type="text"
              value={editingItem.category}
              onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
            />
            <input
              type="number"
              value={editingItem.price}
              onChange={(e) => setEditingItem({...editingItem, price: e.target.value})}
              required
            />
            <label>
              Available:
              <input
                type="checkbox"
                checked={editingItem.availability}
                onChange={(e) => setEditingItem({...editingItem, availability: e.target.checked})}
              />
            </label>
            <input
              type="file"
              onChange={(e) => setEditingItem({...editingItem, image: e.target.files[0]})}
            />
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditingItem(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}

      <div className="items-grid">
        {items.map((item) => (
          <div key={item._id} className="menu-item">
            <img src={item.imageUrl} alt={item.name} />
            <h3>{item.name}</h3>
            <p>Category: {item.category}</p>
            <p>Price: ${item.price}</p>
            <p>Status: {item.availability ? 'Available' : 'Unavailable'}</p>
            
            {(role === 'admin' || role === 'manager') && (
              <div className="admin-controls">
                <button onClick={() => setEditingItem(item)}>Edit</button>
                {role === 'admin' && (
                  <button onClick={() => handleDelete(item._id)}>Delete</button>
                )}
              </div>
            )}

            {!['admin', 'manager'].includes(role) && (
              <button 
                onClick={() => handleAddToCart(item._id)}
                disabled={!item.availability}
              >
                {item.availability ? 'Add to Cart' : 'Out of Stock'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuItems;