import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { BASE_URL } from '../../config';
import '../styles/Auth.scss';

const LoginRegister = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const toggleForm = () => {
    const container = document.querySelector('.auth-container');
    container.classList.add('fade-out');  

    setTimeout(() => {
      setIsLogin(!isLogin);
      container.classList.remove('fade-out');
    }, 500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isLogin) {
      try {
        const response = await axios.post(`${BASE_URL}/api/users/login`, {
          email: formData.email,
          password: formData.password
        });
        setSuccess('Login successful!');
        localStorage.setItem('token', response.data.token);
        const decoded = jwtDecode(response.data.token);
        localStorage.setItem('role', decoded.user.role);
        navigate('/');
        window.location.reload();
      } catch (err) {
        setError(err.response?.data?.error || 'Login failed');
      }
    } else {
      try {
        await axios.post(`${BASE_URL}/api/users/register`, formData);
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => {
          setIsLogin(true);
        }, 2000);
      } catch (err) {
        setError(err.response?.data?.error || 'Registration failed');
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className={`auth-container ${isLogin ? '' : 'rotate'}`}>
        <div className="form-container">
          <h2>{isLogin ? 'Login' : 'Register'}</h2>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label>Username:</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} required />
              </div>
            )}

            <div className="form-group">
              <label>Password:</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label>Role:</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
            )}

            <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
          </form>

          <p onClick={toggleForm} className="toggle-text">
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
