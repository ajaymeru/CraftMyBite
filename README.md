# CraftMyBite

CraftMyBite is a role-based menu management system built using the **MERN stack** (**MongoDB, Express, React, Node.js**). It allows **users, managers, and admins** to interact with the system based on their assigned roles.

## 🚀 Features

### 🔐 Authentication & Authorization
- **User Signup & Login** (JWT-based authentication)
- **Protected Routes** for **Users, Managers, and Admins**
- **Role-based access control**

### 🛒 User Features
- Browse **menu items**
- **Add to cart**
- **Place orders**

### 📋 Manager Features
- **Update menu items** (but cannot create or delete)
- **Update order status**

### ⚙️ Admin Features
- **Create, update, delete menu items**
- **Update order status**

---

## 🏗️ Tech Stack
- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Vercel (Frontend), Vercel (Backend)

---

## 🌍 Environment Variables
Ensure you have the following **.env** variables set:

### Backend (`.env` in `/backend`)
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
VITE_BACKEND_URL=https://craft-my-bite.vercel.app
```

### Frontend (`.env` in `/frontend`)
```env
VITE_BACKEND_URL=https://craft-my-bite.vercel.app
```

---

## 🔧 Installation & Setup

### Backend
```sh
cd backend
npm install
npm start
```

### Frontend
```sh
cd frontend
npm install
npm run dev
```

---

## 🔗 API Endpoints
### **User Routes** (`/api/users`)
| Method | Endpoint          | Description         |
|--------|------------------|---------------------|
| POST   | `/register`      | User registration  |
| POST   | `/login`         | User login         |

### **Menu Routes** (`/api/menu`)
| Method | Endpoint          | Description             |
|--------|------------------|-------------------------|
| GET    | `/`              | Get all menu items     |
| POST   | `/add` (Admin)   | Add a new menu item    |
| PUT    | `/:id` (Manager) | Update menu item       |
| DELETE | `/:id` (Admin)   | Delete menu item       |

### **Order Routes** (`/api/order`)
| Method | Endpoint          | Description                 |
|--------|------------------|-----------------------------|
| POST   | `/place`         | Place an order             |
| GET    | `/orders`        | Get all orders (Admin)     |
| PUT    | `/:id/status`    | Update order status (Manager/Admin) |

---

## 🚀 Deployment

### Deploying Backend (Vercel)
```sh
cd backend
vercel
```

### Deploying Frontend (Vercel)
```sh
cd frontend
vercel
```

---

## 🔥 Contributing
Feel free to fork this repository and submit a **pull request**. 🚀

---

## 📜 License
This project is licensed under the **MIT License**.

